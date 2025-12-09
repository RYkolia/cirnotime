// 暗色模式功能 - 修复背景图片问题
class DarkMode {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.toggle = document.getElementById('dark-mode-toggle');
        this.button = document.getElementById('dark-mode-button');
        this.ripple = document.querySelector('.dark-mode-ripple');
        this.icon = document.querySelector('.dark-mode-icon');
        
        // 背景图片路径 - 请确保这些路径正确
        this.lightBg = 'Yuki.avif'; // 亮色模式背景
        this.darkBg = 'd-Yuki.jpg'; // 暗色模式背景
        
        this.init();
    }
    
    init() {
        // 应用保存的模式
        this.applyMode();
        
        // 添加点击事件
        this.button.addEventListener('click', () => {
            this.toggleMode();
        });
    }
    
    toggleMode() {
        this.isDarkMode = !this.isDarkMode;
        
        // 保存到localStorage
        localStorage.setItem('darkMode', this.isDarkMode);
        
        // 触发涟漪动画
        this.triggerRipple();
        
        // 应用模式
        this.applyMode();
    }
    
    applyMode() {
        if (this.isDarkMode) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    }
    
    enableDarkMode() {
        // 添加暗色模式类
        document.body.classList.add('dark-mode');
        
        // 使用CSS变量设置背景图片
        document.body.style.setProperty('--background-image', `url('${this.darkBg}')`);
        
        // 更新图标
        this.icon.textContent = '☀️';
    }
    
    enableLightMode() {
        // 移除暗色模式类
        document.body.classList.remove('dark-mode');
        
        // 使用CSS变量设置背景图片
        document.body.style.setProperty('--background-image', `url('${this.lightBg}')`);
        
        // 更新图标
        this.icon.textContent = '🌙';
    }
    
    triggerRipple() {
        // 添加active类触发涟漪动画
        this.toggle.classList.add('active');
        
        // 动画结束后移除active类
        setTimeout(() => {
            this.toggle.classList.remove('active');
        }, 500);
    }
}

// 初始化暗色模式
const darkMode = new DarkMode();