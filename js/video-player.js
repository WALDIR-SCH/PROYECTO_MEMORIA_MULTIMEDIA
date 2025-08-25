// Video Player JavaScript - PuzzlePlay Module
const videos = [
    {
        id: 1,
        title: "Tutorial de PuzzlePlay",
        artist: "PuzzlePlay Team",
        description: "Aprende a jugar PuzzlePlay",
        thumbnail: "img/logo_puzzleplay.png",
        videoUrl: "videos/tutorial.mp4",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "2:30",
        type: "local"
    },
    {
        id: 2,
        title: "Consejos para ganar",
        artist: "PuzzlePlay Experts",
        description: "Mejora tu estrategia",
        thumbnail: "img/logo_puzzleplay.png",
        videoUrl: "videos/consejos.mp4",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "3:15",
        type: "local"
    },
    {
        id: 3,
        title: "Modo Multijugador",
        artist: "PuzzlePlay Team",
        description: "Juega con amigos",
        thumbnail: "img/logo_puzzleplay.png",
        videoUrl: "videos/multijugador.mp4",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "4:20",
        type: "local"
    },
    {
        id: 4,
        title: "Niveles Secretos",
        artist: "PuzzlePlay Masters",
        description: "Descubre niveles ocultos",
        thumbnail: "img/logo_puzzleplay.png",
        videoUrl: "videos/secretos.mp4",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "5:10",
        type: "local"
    },
    {
        id: 5,
        title: "Tutorial Oficial de PuzzlePlay",
        artist: "PuzzlePlay Official",
        description: "Guía completa del juego",
        thumbnail: "img/logo_puzzleplay.png",
        videoUrl: "",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "10:25",
        type: "youtube"
    },
    {
        id: 6,
        title: "Mejores Estrategias 2024",
        artist: "Pro Gamers",
        description: "Conviértete en experto",
        thumbnail: "img/logo_puzzleplay.png",
        videoUrl: "",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "15:30",
        type: "youtube"
    }
];

let currentVideoIndex = 0;
let isPlaying = false;
let youtubePlayer = null;

// Initialize the video player
document.addEventListener('DOMContentLoaded', function() {
    loadVideosFromLocalStorage();
    loadVideoGallery();
    setupEventListeners();
    setupUploadHandlers();
});

function loadVideoGallery() {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = '';

    videos.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        let badge = '';
        if (video.type === 'youtube') {
            badge = '<div class="youtube-badge">YouTube</div>';
        }
        
        videoCard.innerHTML = `
            ${badge}
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-card-content">
                <h3>${video.title}</h3>
                <p>${video.artist}</p>
                <p><small>${video.duration}</small></p>
            </div>
        `;
        videoCard.addEventListener('click', () => openVideoPlayer(index));
        videosGrid.appendChild(videoCard);
    });
}

function setupEventListeners() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const rewindBtn = document.getElementById('rewindBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const closeVideoPlayer = document.getElementById('closeVideoPlayer');

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', togglePlayPause);
    videoPlayer.addEventListener('click', togglePlayPause);

    // Rewind and Forward
    rewindBtn.addEventListener('click', () => seekVideo(-10));
    forwardBtn.addEventListener('click', () => seekVideo(10));

    // Volume control
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', () => {
        videoPlayer.volume = volumeSlider.value;
        updateMuteButton();
    });

    // Close button
    closeVideoPlayer.addEventListener('click', closePlayer);

    // Video events
    videoPlayer.addEventListener('timeupdate', updateProgress);
    videoPlayer.addEventListener('loadedmetadata', updateDuration);
    videoPlayer.addEventListener('ended', videoEnded);

    // Keyboard controls
    document.addEventListener('keydown', handleKeyboardControls);
}

function openVideoPlayer(index) {
    currentVideoIndex = index;
    const video = videos[index];
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoModal = document.getElementById('videoPlayerModal');

    videoTitle.textContent = `${video.title} - ${video.artist}`;
    
    if (video.type === 'local' && video.videoUrl) {
        // Local video playback
        videoPlayer.src = video.videoUrl;
        videoPlayer.style.display = 'block';
        if (youtubePlayer) {
            youtubePlayer.style.display = 'none';
        }
    } else if (video.type === 'youtube' && video.youtubeUrl) {
        // YouTube video - hide HTML5 player and show message
        videoPlayer.style.display = 'none';
        videoTitle.textContent += ' (YouTube - Abrir en nueva pestaña)';
        
        // Create a button to open YouTube
        const youtubeButton = document.createElement('button');
        youtubeButton.textContent = 'Abrir en YouTube';
        youtubeButton.className = 'control-btn';
        youtubeButton.style.marginTop = '10px';
        youtubeButton.onclick = () => {
            window.open(video.youtubeUrl, '_blank');
        };
        
        // Add button if not already there
        const existingButton = document.querySelector('.youtube-open-btn');
        if (existingButton) {
            existingButton.remove();
        }
        youtubeButton.className += ' youtube-open-btn';
        document.querySelector('.video-player-container').appendChild(youtubeButton);
    }

    videoModal.classList.remove('hide');
    
    if (video.type === 'local') {
        videoPlayer.load();
        videoPlayer.play();
        isPlaying = true;
    }
    
    updatePlayPauseButton();
}

function togglePlayPause() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    if (videoPlayer.paused) {
        videoPlayer.play();
        isPlaying = true;
    } else {
        videoPlayer.pause();
        isPlaying = false;
    }
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const icon = playPauseBtn.querySelector('i');
    icon.className = isPlaying ? 'fa fa-pause' : 'fa fa-play';
}

function seekVideo(seconds) {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    videoPlayer.currentTime += seconds;
}

function toggleMute() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    videoPlayer.muted = !videoPlayer.muted;
    updateMuteButton();
}

function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const icon = muteBtn.querySelector('i');
    const videoPlayer = document.getElementById('mainVideoPlayer');
    
    if (videoPlayer.muted || videoPlayer.volume === 0) {
        icon.className = 'fa fa-volume-off';
    } else if (videoPlayer.volume <= 0.5) {
        icon.className = 'fa fa-volume-down';
    } else {
        icon.className = 'fa fa-volume-up';
    }
}

function closePlayer() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const videoModal = document.getElementById('videoPlayerModal');
    
    videoPlayer.pause();
    videoModal.classList.add('hide');
    isPlaying = false;
    
    // Remove YouTube button if exists
    const youtubeButton = document.querySelector('.youtube-open-btn');
    if (youtubeButton) {
        youtubeButton.remove();
    }
}

function updateProgress() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const progress = document.getElementById('videoProgress');
    const currentTime = document.getElementById('currentTime');
    
    if (videoPlayer.duration) {
        const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progress.value = percent;
        
        // Update time display
        currentTime.textContent = formatTime(videoPlayer.currentTime);
    }
}

function updateDuration() {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const totalTime = document.getElementById('totalTime');
    
    if (videoPlayer.duration) {
        totalTime.textContent = formatTime(videoPlayer.duration);
    }
}

function videoEnded() {
    isPlaying = false;
    updatePlayPauseButton();
    // Auto-play next video after 2 seconds
    setTimeout(playNextVideo, 2000);
}

function playNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    openVideoPlayer(currentVideoIndex);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function handleKeyboardControls(event) {
    const videoPlayer = document.getElementById('mainVideoPlayer');
    const videoModal = document.getElementById('videoPlayerModal');
    
    if (videoModal.classList.contains('hide')) return;
    
    switch(event.key) {
        case ' ':
        case 'k':
            togglePlayPause();
            event.preventDefault();
            break;
        case 'm':
            toggleMute();
            event.preventDefault();
            break;
        case 'ArrowLeft':
            seekVideo(-5);
            event.preventDefault();
            break;
        case 'ArrowRight':
            seekVideo(5);
            event.preventDefault();
            break;
        case 'ArrowUp':
            videoPlayer.volume = Math.min(videoPlayer.volume + 0.1, 1);
            updateMuteButton();
            event.preventDefault();
            break;
        case 'ArrowDown':
            videoPlayer.volume = Math.max(videoPlayer.volume - 0.1, 0);
            updateMuteButton();
            event.preventDefault();
            break;
        case 'Escape':
            closePlayer();
            event.preventDefault();
            break;
        case 'n':
            playNextVideo();
            event.preventDefault();
            break;
    }
}

// Utility function to show robot messages
function mostrarMensajeRobot(mensaje, tipo) {
    const robotMessage = document.getElementById('robotMessage');
    if (!robotMessage) return;
    
    robotMessage.textContent = mensaje;
    robotMessage.className = `robot-message ${tipo}`;
    robotMessage.style.display = 'block';
    
    setTimeout(() => {
        robotMessage.style.display = 'none';
    }, 3000);
}

// Load videos from local storage
function loadVideosFromLocalStorage() {
    const storedVideos = localStorage.getItem('videos');
    if (storedVideos) {
        const parsedVideos = JSON.parse(storedVideos);
        // Clear existing videos and add stored ones
        videos.length = 0;
        parsedVideos.forEach(video => {
            videos.push(video);
        });
    }
}

// File upload functionality for videos
function setupUploadHandlers() {
    const videoUpload = document.getElementById('videoUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    
    videoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check if file is a video file
        if (!file.type.startsWith('video/')) {
            uploadStatus.textContent = 'Por favor, selecciona un archivo de video válido';
            uploadStatus.style.color = 'red';
            return;
        }
        
        uploadStatus.textContent = 'Subiendo archivo...';
        uploadStatus.style.color = '#666';
        
        // Create a URL for the uploaded file
        const fileURL = URL.createObjectURL(file);
        
        // Add the uploaded file to the videos array
        const newVideo = {
            id: videos.length + 1,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            artist: 'Usuario',
            description: 'Video subido por el usuario',
            thumbnail: 'img/logo_puzzleplay.png',
            videoUrl: fileURL,
            youtubeUrl: '',
            duration: '--:--',
            type: 'local'
        };
        
        videos.push(newVideo);
        
        // Save to local storage
        localStorage.setItem('videos', JSON.stringify(videos));
        
        // Reload the gallery to show the new video
        loadVideoGallery();
        
        uploadStatus.textContent = '¡Video subido exitosamente!';
        uploadStatus.style.color = 'green';
        
        // Clear the file input
        videoUpload.value = '';
        
        // Reset status message after 3 seconds
        setTimeout(() => {
            uploadStatus.textContent = '';
        }, 3000);
    });
}
