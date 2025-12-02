// 音乐播放器功能
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        
        // 初始化事件监听
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 播放/暂停按钮
        document.getElementById('play-btn').addEventListener('click', () => {
            this.togglePlay();
        });
        
        // 上一首按钮
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousSong();
        });
        
        // 下一首按钮
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextSong();
        });
        
        // 音量控制
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // 进度条控制
        document.getElementById('progress-bar').addEventListener('click', (e) => {
            this.setProgress(e);
        });
        
        // 上传按钮
        document.getElementById('upload-btn').addEventListener('click', () => {
            document.getElementById('audio-file').click();
        });
        
        // 文件选择
        document.getElementById('audio-file').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
        
        // 播放列表按钮
        document.getElementById('playlist-btn').addEventListener('click', () => {
            this.togglePlaylist();
        });
        
        // 关闭播放列表
        document.getElementById('close-playlist').addEventListener('click', () => {
            this.hidePlaylist();
        });
        
        // 音频事件监听
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateSongInfo();
            this.updateProgress();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });
    }
    
    // 切换播放/暂停
    togglePlay() {
        if (this.playlist.length === 0) {
            document.getElementById('audio-file').click();
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    // 播放音乐
    play() {
        if (this.playlist.length === 0) return;
        
        this.audio.play();
        this.isPlaying = true;
        document.getElementById('play-btn').textContent = '⏸️';
    }
    
    // 暂停音乐
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        document.getElementById('play-btn').textContent = '▶️';
    }
    
    // 上一首
    previousSong() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadSong(this.currentIndex);
        this.play();
    }
    
    // 下一首
    nextSong() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadSong(this.currentIndex);
        this.play();
    }
    
    // 加载歌曲
    loadSong(index) {
        const song = this.playlist[index];
        this.audio.src = song.url;
        this.updateSongInfo();
        this.updatePlaylistUI();
    }
    
    // 设置音量
    setVolume(volume) {
        this.audio.volume = volume;
    }
    
    // 设置播放进度
    setProgress(e) {
        const progressBar = document.getElementById('progress-bar');
        const clickX = e.offsetX;
        const width = progressBar.clientWidth;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    // 更新进度条
    updateProgress() {
        const progress = document.getElementById('progress');
        const currentTime = document.getElementById('current-time-music');
        const totalTime = document.getElementById('total-time-music');
        
        if (this.audio.duration) {
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            progress.style.width = `${progressPercent}%`;
            
            // 更新时间显示
            currentTime.textContent = this.formatTime(this.audio.currentTime);
            totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    // 更新歌曲信息
    updateSongInfo() {
        const song = this.playlist[this.currentIndex];
        if (song) {
            document.getElementById('song-title').textContent = song.title;
            document.getElementById('song-artist').textContent = song.artist || '未知艺术家';
        }
    }
    
    // 处理文件上传
    handleFileUpload(files) {
        for (let file of files) {
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                const song = {
                    title: file.name.replace(/\.[^/.]+$/, ""), // 移除文件扩展名
                    artist: '未知艺术家',
                    url: url,
                    file: file
                };
                
                this.playlist.push(song);
            }
        }
        
        // 如果这是第一首歌，自动播放
        if (this.playlist.length === 1) {
            this.currentIndex = 0;
            this.loadSong(0);
            this.play();
        }
        
        this.updatePlaylistUI();
    }
    
    // 更新播放列表UI
    updatePlaylistUI() {
        const playlistItems = document.getElementById('playlist-items');
        
        if (this.playlist.length === 0) {
            playlistItems.innerHTML = '<div class="playlist-empty">暂无歌曲，请上传音乐文件</div>';
            return;
        }
        
        playlistItems.innerHTML = this.playlist.map((song, index) => `
            <div class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
        `).join('');
        
        // 添加点击事件
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.currentIndex = index;
                this.loadSong(index);
                this.play();
                this.updatePlaylistUI();
            });
        });
    }
    
    // 切换播放列表显示
    togglePlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.classList.toggle('active');
    }
    
    // 隐藏播放列表
    hidePlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.classList.remove('active');
    }
    
    // 格式化时间 (秒 -> 分:秒)
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// 初始化音乐播放器
const musicPlayer = new MusicPlayer();