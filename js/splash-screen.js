// 启动页面功能 - 每次刷新都显示
class SplashScreen {
    constructor() {
        this.init();
    }
    
    init() {
        // 等待DOM完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupSplashScreen();
            });
        } else {
            this.setupSplashScreen();
        }
    }
    
    setupSplashScreen() {
        // 获取元素
        this.splashScreen = document.getElementById('splash-screen');
        this.enterButton = document.getElementById('enter-button');
        this.mainContent = document.getElementById('main-content');
        
        // 检查元素是否存在
        if (!this.splashScreen || !this.enterButton || !this.mainContent) {
            console.error('启动页面元素未找到！');
            this.showMainContentDirectly();
            return;
        }
        
        console.log('启动页面元素加载成功，显示启动页面');
        
        // 总是显示启动页面（移除状态检查）
        this.showSplashScreen();
        
        // 绑定进入按钮点击事件
        this.enterButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('进入按钮被点击');
            this.enterMainPage();
        });
        
        // 绑定键盘事件（按Enter键也可以进入）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.splashScreen && !this.splashScreen.classList.contains('hidden')) {
                console.log('按Enter键进入');
                this.enterMainPage();
            }
        });
        
        // 绑定空格键事件
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.splashScreen && !this.splashScreen.classList.contains('hidden')) {
                console.log('按空格键进入');
                e.preventDefault(); // 防止页面滚动
                this.enterMainPage();
            }
        });
        
        // 防止按钮被多次点击
        this.preventMultipleClicks();
        
        // 添加自动进入倒计时（可选功能）
        this.startAutoEnterCountdown();
    }
    
    showSplashScreen() {
        if (this.splashScreen && this.mainContent) {
            this.splashScreen.style.display = 'flex'; // 确保显示
            this.splashScreen.classList.remove('hidden');
            this.mainContent.style.display = 'none';
            
            // 添加按钮脉冲动画
            this.enterButton.classList.add('pulse');
        }
    }
    
    enterMainPage() {
        console.log('开始进入主页面');
        
        // 防止重复点击
        if (this.isEntering) return;
        this.isEntering = true;
        
        // 移除按钮脉冲动画和倒计时
        this.enterButton.classList.remove('pulse');
        this.clearAutoEnterCountdown();
        
        // 添加退出动画
        this.splashScreen.classList.add('hidden');
        
        // 延迟显示主内容
        setTimeout(() => {
            this.showMainContent();
            this.isEntering = false;
        }, 800);
    }
    
    showMainContent() {
        console.log('显示主内容');
        
        if (this.splashScreen && this.mainContent) {
            this.splashScreen.style.display = 'none';
            this.mainContent.style.display = 'block';
        }
        
        // 触发内容加载事件
        this.triggerContentLoad();
    }
    
    showMainContentDirectly() {
        console.log('直接显示主内容（备用方案）');
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
        
        this.triggerContentLoad();
    }
    
    triggerContentLoad() {
        console.log('触发内容加载');
        
        // 延迟执行，确保DOM已更新
        setTimeout(() => {
            // 重新加载天气
            if (typeof getRealWeather === 'function') {
                console.log('重新加载天气');
                getRealWeather();
            }
            
            // 重新加载新闻
            if (typeof newsSystem !== 'undefined' && typeof newsSystem.loadNews === 'function') {
                console.log('重新加载新闻');
                newsSystem.loadNews();
            }
            
            // 重新加载时间显示
            if (typeof updateTime === 'function') {
                updateTime();
            }
            
            // 触发自定义事件
            window.dispatchEvent(new CustomEvent('mainContentLoaded'));
        }, 100);
    }
    
    preventMultipleClicks() {
        let clickTimer = null;
        const originalClickHandler = this.enterButton.onclick;
        
        this.enterButton.onclick = (e) => {
            if (clickTimer) return;
            
            clickTimer = setTimeout(() => {
                clickTimer = null;
            }, 1000);
            
            if (originalClickHandler) {
                originalClickHandler.call(this.enterButton, e);
            }
        };
    }
    
    // 可选：自动进入倒计时功能
    // startAutoEnterCountdown() {
    //     // 5秒后自动进入
    //     this.autoEnterTimer = setTimeout(() => {
    //         console.log('自动进入主页面');
    //         this.enterMainPage();
    //     }, 5000);
        
    //     // 显示倒计时提示
    //     this.showCountdown();
    // }
    
    showCountdown() {
        // 创建倒计时显示元素
        const countdownEl = document.createElement('div');
        countdownEl.className = 'auto-enter-countdown';
        countdownEl.innerHTML = '5秒后自动进入...';
        countdownEl.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            text-align: center;
        `;
        
        this.splashScreen.appendChild(countdownEl);
        
        // 更新倒计时
        let countdown = 5;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownEl.innerHTML = `${countdown}秒后自动进入...`;
            } else {
                clearInterval(countdownInterval);
                countdownEl.remove();
            }
        }, 1000);
        
        this.countdownInterval = countdownInterval;
    }
    
    clearAutoEnterCountdown() {
        if (this.autoEnterTimer) {
            clearTimeout(this.autoEnterTimer);
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // 移除倒计时显示元素
        const countdownEl = this.splashScreen.querySelector('.auto-enter-countdown');
        if (countdownEl) {
            countdownEl.remove();
        }
    }
}

// 初始化启动页面
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化启动页面');
    new SplashScreen();
});

// 备用初始化方案 - 确保启动页面正常工作
window.addEventListener('load', function() {
    console.log('页面完全加载完成');
    
    // 如果启动页面意外隐藏，强制显示
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');
        
        if (splashScreen && splashScreen.style.display === 'none') {
            console.log('检测到启动页面被隐藏，重新显示');
            splashScreen.style.display = 'flex';
            mainContent.style.display = 'none';
        }
    }, 100);
});