// 日志系统功能
class LogSystem {
    constructor() {
        this.logs = this.loadLogs();
        this.initEventListeners();
        this.renderLogs();
        this.isAnimating = false;
        this.scrollThreshold = 50; // 滚动阈值
        
    }
    
    // 从localStorage加载日志
    loadLogs() {
        const savedLogs = localStorage.getItem('websiteEditLogs');
        return savedLogs ? JSON.parse(savedLogs) : [];
    }
    
    // 保存日志到localStorage
    saveLogs() {
        localStorage.setItem('websiteEditLogs', JSON.stringify(this.logs));
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 日志按钮点击事件
        document.getElementById('log-button').addEventListener('click', () => {
            this.toggleLogPanel();
        });
        
        // 关闭按钮点击事件
        document.getElementById('close-log').addEventListener('click', () => {
            this.hideLogPanel();
        });
        
        // 添加日志按钮点击事件
        document.getElementById('add-log').addEventListener('click', () => {
            this.addLog();
        });
        
        // 按Enter键添加日志（Ctrl+Enter）
        document.getElementById('log-input').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addLog();
            }
        });
        
        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            const logPanel = document.getElementById('log-panel');
            const logButton = document.getElementById('log-button');
            
            if (logPanel.classList.contains('active') && 
                !logPanel.contains(e.target) && 
                !logButton.contains(e.target)) {
                this.hideLogPanel();
            }
        });
        
        // 滚动事件监听
        this.initScrollListeners();
    }
    
    // 初始化滚动监听
    initScrollListeners() {
        const logList = document.getElementById('log-list');
        
        // 创建滚动按钮
        this.createScrollButtons();
        
        // 监听滚动事件
        logList.addEventListener('scroll', () => {
            this.updateScrollIndicators();
        });
        
        // 监听鼠标滚轮事件
        logList.addEventListener('wheel', (e) => {
            // 允许自然滚动
        }, { passive: true });
    }
    
    // 创建滚动按钮
    createScrollButtons() {
        const logList = document.getElementById('log-list');
        
        // 创建滚动到顶部按钮
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.title = '滚动到顶部';
        scrollToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
        
        // 创建滚动到底部按钮
        const scrollToBottomBtn = document.createElement('button');
        scrollToBottomBtn.className = 'scroll-to-bottom';
        scrollToBottomBtn.innerHTML = '↓';
        scrollToBottomBtn.title = '滚动到底部';
        scrollToBottomBtn.addEventListener('click', () => {
            this.scrollToBottom();
        });
        
        // 添加按钮到日志列表
        logList.parentNode.appendChild(scrollToTopBtn);
        logList.parentNode.appendChild(scrollToBottomBtn);
        
        // 初始更新滚动指示器
        setTimeout(() => {
            this.updateScrollIndicators();
        }, 100);
    }
    
    // 更新滚动指示器
    updateScrollIndicators() {
        const logList = document.getElementById('log-list');
        const scrollTopBtn = document.querySelector('.scroll-to-top');
        const scrollBottomBtn = document.querySelector('.scroll-to-bottom');
        
        if (!logList || !scrollTopBtn || !scrollBottomBtn) return;
        
        const scrollTop = logList.scrollTop;
        const scrollHeight = logList.scrollHeight;
        const clientHeight = logList.clientHeight;
        
        // 更新顶部阴影
        if (scrollTop > this.scrollThreshold) {
            logList.classList.add('scrollable-top');
            scrollTopBtn.classList.add('visible');
        } else {
            logList.classList.remove('scrollable-top');
            scrollTopBtn.classList.remove('visible');
        }
        
        // 更新底部阴影
        if (scrollTop + clientHeight < scrollHeight - this.scrollThreshold) {
            logList.classList.add('scrollable-bottom');
            scrollBottomBtn.classList.add('visible');
        } else {
            logList.classList.remove('scrollable-bottom');
            scrollBottomBtn.classList.remove('visible');
        }
    }
    
    // 滚动到顶部
    scrollToTop() {
        const logList = document.getElementById('log-list');
        logList.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 滚动到底部
    scrollToBottom() {
        const logList = document.getElementById('log-list');
        logList.scrollTo({
            top: logList.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    // 切换日志面板显示/隐藏
    toggleLogPanel() {
        if (this.isAnimating) return;
        
        const logPanel = document.getElementById('log-panel');
        if (logPanel.classList.contains('active')) {
            this.hideLogPanel();
        } else {
            this.showLogPanel();
        }
    }
    
    // 显示日志面板
    showLogPanel() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const logPanel = document.getElementById('log-panel');
        
        // 先设置display，然后添加active类触发动画
        logPanel.style.display = 'flex';
        
        // 使用requestAnimationFrame确保样式应用
        requestAnimationFrame(() => {
            logPanel.classList.add('active');
            
            // 动画结束后重置状态
            setTimeout(() => {
                this.isAnimating = false;
                // 更新滚动指示器
                this.updateScrollIndicators();
            }, 400);
        });
    }
    
    // 隐藏日志面板
    hideLogPanel() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const logPanel = document.getElementById('log-panel');
        
        // 移除active类触发关闭动画
        logPanel.classList.remove('active');
        
        // 动画结束后隐藏元素
        setTimeout(() => {
            logPanel.style.display = 'none';
            this.isAnimating = false;
        }, 400);
    }
    
    // 添加新日志
    addLog() {
        const logInput = document.getElementById('log-input');
        const text = logInput.value.trim();
        
        if (text) {
            const newLog = {
                id: Date.now(),
                timestamp: new Date().toLocaleString('zh-CN'),
                text: text
            };
            
            this.logs.unshift(newLog); // 添加到开头
            this.saveLogs();
            this.renderLogs();
            
            // 清空输入框
            logInput.value = '';
            
            // 显示成功提示
            this.showMessage('日志添加成功！');
            
            // 添加新日志的动画效果
            this.animateNewLog();
            
            // 滚动到顶部显示新日志
            this.scrollToTop();
        }
    }
    
    // 新日志添加动画
    animateNewLog() {
        const logItems = document.querySelectorAll('.log-item');
        if (logItems.length > 0) {
            const newLog = logItems[0];
            newLog.style.animation = 'newLogPulse 0.6s ease';
            
            setTimeout(() => {
                newLog.style.animation = '';
            }, 600);
        }
    }
    
    // 删除日志
    deleteLog(id) {
        this.logs = this.logs.filter(log => log.id !== id);
        this.saveLogs();
        this.renderLogs();
        this.showMessage('日志已删除！');
        
        // 更新滚动指示器
        setTimeout(() => {
            this.updateScrollIndicators();
        }, 100);
    }
    
    // 渲染日志列表
    renderLogs() {
        const logList = document.getElementById('log-list');
        
        if (this.logs.length === 0) {
            logList.innerHTML = '<div class="log-item"><div class="log-text" style="text-align: center; opacity: 0.7;">暂无日志记录</div></div>';
            return;
        }
        
        logList.innerHTML = this.logs.map(log => `
            <div class="log-item">
                <div class="log-time">${log.timestamp}</div>
                <div class="log-text">${this.escapeHtml(log.text)}</div>
                <button class="delete-log" onclick="logSystem.deleteLog(${log.id})">删除</button>
            </div>
        `).join('');
        
        // 更新滚动指示器
        setTimeout(() => {
            this.updateScrollIndicators();
        }, 100);
    }
    
    // 显示消息提示
    showMessage(message) {
        // 创建提示元素
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 0.9rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // 淡入效果
        requestAnimationFrame(() => {
            messageEl.style.opacity = '1';
        });
        
        // 2秒后淡出并移除
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }, 2000);
    }
    
    // HTML转义，防止XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化日志系统
const logSystem = new LogSystem();