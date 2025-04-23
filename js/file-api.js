/**
 * Эмуляция API для загрузки файлов
 * В реальном проекте эти функции должны быть заменены на серверное API
 */

// Функция для виртуальной загрузки файлов на сервер
async function uploadFiles(files, folderPath) {
    return new Promise((resolve, reject) => {
        try {
            // Эмулируем задержку загрузки файлов
            setTimeout(() => {
                // Создаем массив имен файлов
                const fileNames = Array.from(files).map(file => file.name);
                
                // Сохраняем список файлов в localStorage
                const folderKey = `uploaded_tracks_${folderPath.replace(/\//g, '_')}`;
                localStorage.setItem(folderKey, JSON.stringify(fileNames));
                
                resolve({
                    success: true,
                    message: 'Файлы успешно загружены',
                    files: fileNames
                });
            }, 1000);
        } catch (error) {
            reject({
                success: false,
                message: 'Ошибка при загрузке файлов',
                error: error.message
            });
        }
    });
}

// Функция для получения списка файлов из виртуальной папки
async function getFilesList(folderPath) {
    return new Promise((resolve) => {
        // В реальной реализации здесь должен быть запрос к серверу
        // Но для упрощения мы просто вернем список реальных файлов из папки
        
        let files;
        // Получаем ID артиста из пути (например, из "audio/1" получаем "1")
        const artistId = folderPath.split('/').pop();
        
        // Возвращаем список реальных файлов, которые пользователь добавил
        switch(artistId) {
            case '1':
                files = listFilesInFolder("audio/1");
                break;
            case '2':
                files = listFilesInFolder("audio/2");
                break;
            case '3':
                files = listFilesInFolder("audio/3");
                break;
            case '4':
                files = listFilesInFolder("audio/4");
                break;
            case '5':
                files = listFilesInFolder("audio/5");
                break;
            case '6':
                files = listFilesInFolder("audio/6");
                break;
            case '7':
                files = listFilesInFolder("audio/7");
                break;
            default:
                files = [];
        }
        
        resolve({
            success: true,
            files: files
        });
    });
}

// Вспомогательная функция для получения списка файлов из папки
function listFilesInFolder(folderPath) {
    // В браузере нет прямого доступа к файловой системе,
    // поэтому мы возвращаем известные имена файлов для каждой папки
    
    // Получаем ID артиста из пути (например, из "audio/1" получаем "1")
    const artistId = folderPath.split('/').pop();
    
    // Возвращаем список реальных файлов для каждого артиста
    switch(artistId) {
        case '1':
            // Файлы в папке audio/1
            return ["1.mp3"];
        case '2':
            // Файлы в папке audio/2
            return ["harvat_v1.mp3", "Rus.mp3", "фит.mp3"];
        case '3':
            // Файлы в папке audio/3
            return ["Я бегу по мокрым улицам (mix2).mp3"];
        case '4':
            // Файлы в папке audio/4
            return ["4 - Zlata 3-1.mp3"];
        case '5':
            // Файлы в папке audio/5
            return ["Когда нас топят - мы не тонем.mp3", "Ты_вошла_в_мою_жизнь,_как_весенний_рассв.mp3"];
        case '6':
            // Файлы в папке audio/6
            return ["Валентина Песнева - Маята.mp3", "Валентина Песнева - Мое счастье.mp3"];
        case '7':
            // Файлы в папке audio/7
            return [
                "FATEE - Ворон COVER.mp3",
                "FATEE - Под закатом (Afro).mp3",
                "FATEE- Поняли мы(Afro).mp3"
            ];
        default:
            return [];
    }
}

// Функция для удаления файла из виртуальной папки
async function deleteFile(fileName, folderPath) {
    return new Promise((resolve) => {
        // Эмулируем задержку удаления файла
        setTimeout(() => {
            // Получаем список файлов из localStorage
            const folderKey = `uploaded_tracks_${folderPath.replace(/\//g, '_')}`;
            const savedFiles = localStorage.getItem(folderKey);
            
            if (savedFiles) {
                let files = JSON.parse(savedFiles);
                files = files.filter(file => file !== fileName);
                
                // Сохраняем обновленный список
                localStorage.setItem(folderKey, JSON.stringify(files));
                
                resolve({
                    success: true,
                    message: 'Файл успешно удален',
                    files: files
                });
            } else {
                resolve({
                    success: false,
                    message: 'Файлы не найдены',
                    files: []
                });
            }
        }, 500);
    });
} 