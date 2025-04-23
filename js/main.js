// Глобальная переменная для отслеживания текущего воспроизводимого трека
let currentAudio = null;

// Функция для создания карточки артиста
function createArtistCard(artist) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4 fade-in';
    
    const card = document.createElement('div');
    card.className = 'card artist-card h-100';
    card.dataset.artistId = artist.id;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'position-relative overflow-hidden';
    
    const image = document.createElement('img');
    image.src = artist.image;
    image.className = 'card-img-top artist-image';
    image.alt = artist.name;
    image.loading = 'lazy'; // Lazy loading для улучшения производительности
    
    const genreBadge = document.createElement('span');
    genreBadge.className = 'badge genre-badge';
    genreBadge.textContent = artist.genre;
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';
    
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = artist.name;
    
    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = artist.description.substring(0, 100) + (artist.description.length > 100 ? '...' : '');
    
    const cardButton = document.createElement('button');
    cardButton.className = 'btn mt-auto align-self-start rounded-pill px-3';
    cardButton.innerHTML = '<i class="bi bi-music-note-list me-2"></i>Смотреть';
    
    imageContainer.appendChild(image);
    imageContainer.appendChild(genreBadge);
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardButton);
    
    card.appendChild(imageContainer);
    card.appendChild(cardBody);
    
    col.appendChild(card);
    
    // Добавление задержки для анимации
    col.style.animationDelay = `${artist.id * 0.1}s`;
    
    // Добавляем слушатель события для открытия модального окна
    card.addEventListener('click', () => openArtistModal(artist));
    
    return col;
}

// Функция для поиска mp3 файлов в директории артиста
async function loadArtistTracks(artist) {
    try {
        // Получаем список файлов через API
        const result = await getFilesList(artist.audioFolder);
        
        if (result.success && result.files.length > 0) {
            // Сортируем файлы по имени
            result.files.sort();
            
            // Сохраняем в плейлист артиста
            artist.playlist = result.files;
            return result.files;
        } else {
            // Если файлы не найдены, возвращаем пустой массив
            return [];
        }
    } catch (error) {
        console.error('Ошибка при загрузке треков:', error);
        return [];
    }
}

// Функция для открытия модального окна с информацией об артисте
async function openArtistModal(artist) {
    // Заполняем модальное окно информацией об артисте
    document.getElementById('modalArtistImage').src = artist.image;
    document.getElementById('modalArtistImage').alt = artist.name;
    document.getElementById('modalArtistName').textContent = artist.name;
    document.getElementById('modalArtistGenre').textContent = artist.genre;
    document.getElementById('modalArtistDescription').textContent = artist.description;
    
    // Обработка видео в зависимости от типа
    const videoContainer = document.getElementById('videoContainer');
    
    if (artist.videoType === 'youtube') {
        // YouTube видео
        videoContainer.innerHTML = `
            <div class="ratio ratio-16x9">
                <iframe id="modalArtistVideo" src="${artist.video}" title="YouTube video" allowfullscreen></iframe>
            </div>
        `;
    } else if (artist.videoType === 'mp4' && artist.localVideo) {
        // Локальное mp4 видео
        videoContainer.innerHTML = `
            <div>
                <video id="modalArtistVideo" class="w-100" controls>
                    <source src="${artist.localVideo}" type="video/mp4">
                    Ваш браузер не поддерживает воспроизведение видео.
                </video>
            </div>
        `;
    } else {
        // Если нет видео
        videoContainer.innerHTML = `
            <div class="alert alert-info m-3">
                <i class="bi bi-exclamation-circle me-2"></i>Видео не доступно
            </div>
        `;
    }
    
    // Всегда загружаем треки артиста заново
    await loadArtistTracks(artist);
    
    // Очищаем и заполняем плейлист
    const playlistContainer = document.getElementById('modalArtistPlaylist');
    playlistContainer.innerHTML = '';
    
    if (artist.playlist.length === 0) {
        // Если плейлист пуст, показываем сообщение
        const emptyPlaylist = document.createElement('div');
        emptyPlaylist.className = 'alert alert-info m-3';
        emptyPlaylist.innerHTML = '<i class="bi bi-music-note-beamed me-2"></i>Треки не найдены. Добавьте MP3 файлы в папку ' + artist.audioFolder;
        playlistContainer.appendChild(emptyPlaylist);
    } else {
        // Создаем элементы плейлиста с аудиоплеером
        artist.playlist.forEach((track, index) => {
            // Получаем имя трека без расширения
            const trackName = track.replace(/\.mp3$/, '');
            
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item list-group-item border-0 border-bottom';
            
            const trackContent = document.createElement('div');
            trackContent.className = 'py-2';
            
            const trackHeader = document.createElement('div');
            trackHeader.className = 'd-flex justify-content-between align-items-center mb-2';
            
            const trackTitle = document.createElement('h6');
            trackTitle.className = 'mb-0';
            trackTitle.innerHTML = `<span class="playlist-number">${index + 1}.</span> ${trackName}`;
            
            trackHeader.appendChild(trackTitle);
            
            // Создаем аудиоплеер для трека
            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.className = 'w-100 mt-2';
            audioPlayer.src = `${artist.audioFolder}/${track}`;
            audioPlayer.preload = 'metadata';
            
            // При воспроизведении одного трека останавливаем другие
            audioPlayer.addEventListener('play', () => {
                if (currentAudio && currentAudio !== audioPlayer) {
                    currentAudio.pause();
                }
                currentAudio = audioPlayer;
            });
            
            trackContent.appendChild(trackHeader);
            trackContent.appendChild(audioPlayer);
            
            trackItem.appendChild(trackContent);
            playlistContainer.appendChild(trackItem);
        });
    }
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('artistModal'));
    modal.show();
}

// Функция для остановки воспроизведения медиа
function stopMediaPlayback() {
    // Останавливаем аудио
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Останавливаем видео
    const videoContainer = document.getElementById('videoContainer');
    const iframe = videoContainer.querySelector('iframe');
    const video = videoContainer.querySelector('video');
    
    if (iframe) {
        // Останавливаем YouTube видео
        const src = iframe.src;
        iframe.src = '';
        setTimeout(() => {
            iframe.src = src;
        }, 100);
    } else if (video) {
        // Останавливаем локальное видео
        video.pause();
        video.currentTime = 0;
    }
}

// Функция для загрузки обновленных данных из localStorage
function loadUpdatedArtistsData() {
    const savedData = localStorage.getItem('artistsData');
    
    if (savedData) {
        const updatedArtists = JSON.parse(savedData);
        
        // Обновляем данные артистов, сохраняя ссылки на изображения и плейлисты
        for (let i = 0; i < artists.length; i++) {
            const updatedArtist = updatedArtists.find(a => a.id === artists[i].id);
            if (updatedArtist) {
                artists[i].name = updatedArtist.name;
                artists[i].genre = updatedArtist.genre;
                artists[i].description = updatedArtist.description;
                // Обновляем поля видео
                artists[i].videoType = updatedArtist.videoType;
                artists[i].video = updatedArtist.video;
                artists[i].localVideo = updatedArtist.localVideo;
            }
        }
    }
}

// Функция для инициализации галереи артистов
function initArtistsGallery() {
    const container = document.getElementById('artists-container');
    container.innerHTML = ''; // Очищаем контейнер перед добавлением карточек
    
    // Загружаем обновленные данные
    loadUpdatedArtistsData();
    
    // Создаем и добавляем карточки артистов
    artists.forEach(artist => {
        const card = createArtistCard(artist);
        container.appendChild(card);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initArtistsGallery();
    
    // Обновляем видео в модальном окне при его закрытии,
    // чтобы предотвратить продолжение воспроизведения видео в фоне
    document.getElementById('artistModal').addEventListener('hidden.bs.modal', function () {
        stopMediaPlayback();
    });
}); 