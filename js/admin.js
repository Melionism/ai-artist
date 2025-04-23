// Функции для управления данными артистов в админке

// Инициализация хранилища данных
let artistsData = [...artists]; // Копируем массив, чтобы не изменять оригинал напрямую
let selectedArtistId = null;

// Функция для отображения списка артистов
function renderArtistsList() {
    const artistsList = document.getElementById('artistsList');
    artistsList.innerHTML = '';
    
    artistsData.forEach(artist => {
        const listItem = document.createElement('a');
        listItem.href = '#';
        listItem.className = 'list-group-item list-group-item-action artist-item';
        listItem.dataset.artistId = artist.id;
        listItem.textContent = artist.name;
        
        // Добавляем активный класс для выбранного артиста
        if (selectedArtistId === artist.id) {
            listItem.classList.add('active');
        }
        
        // Обработчик события клика по элементу списка
        listItem.addEventListener('click', (e) => {
            e.preventDefault();
            selectArtist(artist.id);
        });
        
        artistsList.appendChild(listItem);
    });
}

// Функция для выбора артиста из списка
function selectArtist(artistId) {
    selectedArtistId = artistId;
    
    // Обновляем активный класс в списке
    const artistItems = document.querySelectorAll('.artist-item');
    artistItems.forEach(item => {
        if (Number(item.dataset.artistId) === artistId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Находим артиста по ID
    const artist = artistsData.find(a => a.id === artistId);
    
    // Заполняем форму данными артиста
    document.getElementById('artistId').value = artist.id;
    document.getElementById('artistName').value = artist.name;
    document.getElementById('artistGenre').value = artist.genre;
    document.getElementById('artistDescription').value = artist.description;
    document.getElementById('artistImagePath').textContent = artist.image;
    
    // Заполняем поля видео
    document.getElementById('videoType').value = artist.videoType || 'youtube';
    document.getElementById('youtubeVideo').value = artist.video || '';
    document.getElementById('localVideo').value = artist.localVideo || '';
    
    // Показываем/скрываем поля в зависимости от типа видео
    toggleVideoFields();
}

// Функция для переключения полей видео в зависимости от выбранного типа
function toggleVideoFields() {
    const videoType = document.getElementById('videoType').value;
    const youtubeField = document.getElementById('youtubeVideoField');
    const localVideoField = document.getElementById('localVideoField');
    
    if (videoType === 'youtube') {
        youtubeField.style.display = 'block';
        localVideoField.style.display = 'none';
    } else {
        youtubeField.style.display = 'none';
        localVideoField.style.display = 'block';
    }
}

// Функция для сохранения изменений артиста
function saveArtistChanges(e) {
    e.preventDefault();
    
    // Получаем данные из формы
    const artistId = Number(document.getElementById('artistId').value);
    const name = document.getElementById('artistName').value.trim();
    const genre = document.getElementById('artistGenre').value.trim();
    const description = document.getElementById('artistDescription').value.trim();
    const videoType = document.getElementById('videoType').value;
    const youtubeVideo = document.getElementById('youtubeVideo').value.trim();
    const localVideo = document.getElementById('localVideo').value.trim();
    
    // Валидация данных
    if (!name || !genre || !description) {
        showAlert('Пожалуйста, заполните все обязательные поля', 'danger');
        return;
    }
    
    // Дополнительная валидация для видео
    if (videoType === 'youtube' && !youtubeVideo) {
        showAlert('Пожалуйста, укажите ссылку на YouTube видео', 'danger');
        return;
    }
    
    if (videoType === 'mp4' && !localVideo) {
        showAlert('Пожалуйста, укажите путь к MP4 видео', 'danger');
        return;
    }
    
    // Находим индекс артиста в массиве
    const artistIndex = artistsData.findIndex(a => a.id === artistId);
    
    if (artistIndex !== -1) {
        // Обновляем данные артиста
        artistsData[artistIndex].name = name;
        artistsData[artistIndex].genre = genre;
        artistsData[artistIndex].description = description;
        artistsData[artistIndex].videoType = videoType;
        
        // Обновляем данные в зависимости от типа видео
        if (videoType === 'youtube') {
            artistsData[artistIndex].video = youtubeVideo;
            artistsData[artistIndex].localVideo = '';
        } else {
            artistsData[artistIndex].video = '';
            artistsData[artistIndex].localVideo = localVideo;
        }
        
        // Сохраняем данные в localStorage
        saveArtistsData();
        
        // Обновляем список артистов
        renderArtistsList();
        
        // Показываем уведомление об успешном сохранении
        showAlert('Данные артиста успешно сохранены', 'success');
    }
}

// Функция для сохранения данных в localStorage
function saveArtistsData() {
    localStorage.setItem('artistsData', JSON.stringify(artistsData));
}

// Функция для загрузки данных из localStorage
function loadArtistsData() {
    const savedData = localStorage.getItem('artistsData');
    
    if (savedData) {
        artistsData = JSON.parse(savedData);
    }
}

// Функция для отображения уведомления
function showAlert(message, type) {
    const alertContainer = document.querySelector('.alert-container');
    
    // Создаем элемент уведомления
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Очищаем контейнер и добавляем новое уведомление
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    alertContainer.classList.add('show');
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
        alertContainer.classList.remove('show');
    }, 3000);
}

// Функция для применения изменений на основной странице
function applyChangesToMainPage() {
    // Обновляем оригинальный массив artists
    for (let i = 0; i < artists.length; i++) {
        const updatedArtist = artistsData.find(a => a.id === artists[i].id);
        if (updatedArtist) {
            artists[i].name = updatedArtist.name;
            artists[i].genre = updatedArtist.genre;
            artists[i].description = updatedArtist.description;
        }
    }
    
    showAlert('Изменения применены к основной странице', 'success');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем сохраненные данные
    loadArtistsData();
    
    // Отображаем список артистов
    renderArtistsList();
    
    // Выбираем первого артиста по умолчанию
    if (artistsData.length > 0 && !selectedArtistId) {
        selectArtist(artistsData[0].id);
    }
    
    // Обработчик события отправки формы
    const artistForm = document.getElementById('artistForm');
    artistForm.addEventListener('submit', saveArtistChanges);
    
    // Обработчик события изменения типа видео
    const videoTypeSelect = document.getElementById('videoType');
    videoTypeSelect.addEventListener('change', toggleVideoFields);
    
    // Обработчик события нажатия на кнопку применения изменений
    const applyChangesBtn = document.getElementById('applyChangesBtn');
    applyChangesBtn.addEventListener('click', applyChangesToMainPage);
}); 