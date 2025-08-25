// Audio Player JavaScript - PuzzlePlay Module
const songs = [
    {
        id: 1,
        title: "Melodía Relajante",
        artist: "PuzzlePlay Sounds",
        album: "Música para Jugar",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "3:45"
    },
    {
        id: 2,
        title: "Ritmo Divertido",
        artist: "PuzzlePlay Sounds",
        album: "Música para Jugar",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "4:20"
    },
    {
        id: 3,
        title: "Armonía Puzzle",
        artist: "PuzzlePlay Sounds",
        album: "Música para Jugar",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "2:55"
    },
    {
        id: 4,
        title: "Sintonía de Victoria",
        artist: "PuzzlePlay Sounds",
        album: "Música para Jugar",
        cover: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: "3:15"
    },
    {
        id: 5,
        title: "Melodía Mágica",
        artist: "PuzzlePlay Sounds",
        album: "Música para Jugar",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        duration: "4:10"
    },
    {
        id: 6,
        title: "Ritmo Puzzle",
        artist: "PuzzlePlay Sounds",
        album: "Música para Jugar",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        duration: "3:30"
    }
];

let currentSongIndex = 0;
let isPlaying = false;

// Initialize the audio player
document.addEventListener('DOMContentLoaded', function() {
    loadAudioGallery();
    setupEventListeners();
    setupUploadHandlers();
});

function loadAudioGallery() {
    const audioGrid = document.getElementById('audioGrid');
    audioGrid.innerHTML = '';

    songs.forEach((song, index) => {
        const audioCard = document.createElement('div');
        audioCard.className = 'audio-card';
        audioCard.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="audio-card-content">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <p><small>${song.duration}</small></p>
            </div>
        `;
        audioCard.addEventListener('click', () => openAudioPlayer(index));
        audioGrid.appendChild(audioCard);
    });
}

function setupEventListeners() {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevAudioBtn = document.getElementById('prevAudioBtn');
    const nextAudioBtn = document.getElementById('nextAudioBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const closeAudioPlayer = document.getElementById('closeAudioPlayer');

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', togglePlayPause);
    audioPlayer.addEventListener('click', togglePlayPause);

    // Navigation between songs
    prevAudioBtn.addEventListener('click', playPreviousSong);
    nextAudioBtn.addEventListener('click', playNextSong);

    // Volume control
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
        updateMuteButton();
    });

    // Close button
    closeAudioPlayer.addEventListener('click', closePlayer);

    // Audio events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', audioEnded);

    // Keyboard controls
    document.addEventListener('keydown', handleKeyboardControls);
}

function openAudioPlayer(index) {
    currentSongIndex = index;
    const song = songs[index];
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const audioTitle = document.getElementById('audioTitle');
    const audioModal = document.getElementById('audioPlayerModal');

    audioTitle.textContent = `${song.title} - ${song.artist}`;
    audioPlayer.src = song.audioUrl;
    
    audioModal.classList.remove('hide');
    audioPlayer.load();
    audioPlayer.play();
    isPlaying = true;
    updatePlayPauseButton();
}

function togglePlayPause() {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    if (audioPlayer.paused) {
        audioPlayer.play();
        isPlaying = true;
    } else {
        audioPlayer.pause();
        isPlaying = false;
    }
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const icon = playPauseBtn.querySelector('i');
    icon.className = isPlaying ? 'fa fa-pause' : 'fa fa-play';
}

function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    openAudioPlayer(currentSongIndex);
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    openAudioPlayer(currentSongIndex);
}

function toggleMute() {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    audioPlayer.muted = !audioPlayer.muted;
    updateMuteButton();
}

function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const icon = muteBtn.querySelector('i');
    const audioPlayer = document.getElementById('mainAudioPlayer');
    
    if (audioPlayer.muted || audioPlayer.volume === 0) {
        icon.className = 'fa fa-volume-off';
    } else if (audioPlayer.volume <= 0.5) {
        icon.className = 'fa fa-volume-down';
    } else {
        icon.className = 'fa fa-volume-up';
    }
}

function closePlayer() {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const audioModal = document.getElementById('audioPlayerModal');
    
    audioPlayer.pause();
    audioModal.classList.add('hide');
    isPlaying = false;
}

function updateProgress() {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const progress = document.getElementById('audioProgress');
    const currentTime = document.getElementById('currentTime');
    
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.value = percent;
        
        // Update time display
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
}

function updateDuration() {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const totalTime = document.getElementById('totalTime');
    
    if (audioPlayer.duration) {
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
}

function audioEnded() {
    isPlaying = false;
    updatePlayPauseButton();
    // Auto-play next song after 2 seconds
    setTimeout(playNextSong, 2000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function handleKeyboardControls(event) {
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const audioModal = document.getElementById('audioPlayerModal');
    
    if (audioModal.classList.contains('hide')) return;
    
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
            audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
            event.preventDefault();
            break;
        case 'ArrowRight':
            audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration);
            event.preventDefault();
            break;
        case 'ArrowUp':
            audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
            updateMuteButton();
            event.preventDefault();
            break;
        case 'ArrowDown':
            audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
            updateMuteButton();
            event.preventDefault();
            break;
        case 'Escape':
            closePlayer();
            event.preventDefault();
            break;
        case 'n':
            playNextSong();
            event.preventDefault();
            break;
        case 'p':
            playPreviousSong();
            event.preventDefault();
            break;
    }
}

// Utility function to show robot messages (if needed)
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

// File upload functionality
function setupUploadHandlers() {
    const audioUpload = document.getElementById('audioUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    
    audioUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check if file is an audio file
        if (!file.type.startsWith('audio/')) {
            uploadStatus.textContent = 'Por favor, selecciona un archivo de audio válido';
            uploadStatus.style.color = 'red';
            return;
        }
        
        uploadStatus.textContent = 'Subiendo archivo...';
        uploadStatus.style.color = '#666';
        
        // Create a URL for the uploaded file
        const fileURL = URL.createObjectURL(file);
        
        // Add the uploaded file to the songs array
        const newSong = {
            id: songs.length + 1,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            artist: 'Usuario',
            album: 'Archivos Subidos',
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
            audioUrl: fileURL,
            duration: '--:--'
        };
        
        songs.push(newSong);
        
        // Reload the gallery to show the new song
        loadAudioGallery();
        
        uploadStatus.textContent = '¡Archivo subido exitosamente!';
        uploadStatus.style.color = 'green';
        
        // Clear the file input
        audioUpload.value = '';
        
        // Reset status message after 3 seconds
        setTimeout(() => {
            uploadStatus.textContent = '';
        }, 3000);
    });
}
