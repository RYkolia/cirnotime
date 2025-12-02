// 留言板功能 - 添加滚轮模块
class MessageBoard {
    constructor() {
        this.messages = this.loadMessages();
        this.initEventListeners();
        this.renderMessages();
        // 延迟设置滚动控制，确保DOM已加载
        setTimeout(() => {
            this.setupScrollControls();
        }, 100);
    }
    
    // 从localStorage加载留言
    loadMessages() {
        const savedMessages = localStorage.getItem('messageBoard');
        if (savedMessages) {
            return JSON.parse(savedMessages);
        } else {
            // 默认示例留言
            return [
                {
                    id: 1,
                    content: '欢迎留言！这是一个示例留言。',
                    time: new Date().toLocaleString('zh-CN'),
                    timestamp: Date.now()
                }
            ];
        }
    }
    
    // 保存留言到localStorage
    saveMessages() {
        localStorage.setItem('messageBoard', JSON.stringify(this.messages));
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 添加留言按钮
        document.getElementById('add-message-btn').addEventListener('click', () => {
            this.toggleInputArea();
        });
        
        // 发送留言按钮
        document.getElementById('submit-message').addEventListener('click', () => {
            this.addMessage();
        });
        
        // 按Enter发送留言（Ctrl+Enter）
        document.getElementById('message-input').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addMessage();
            }
        });
    }
    
    // 设置滚动控制
    setupScrollControls() {
        const container = document.getElementById('messages-container');
        if (!container) {
            console.error('messages-container not found');
            return;
        }
        
        // 创建滚动按钮
        this.createScrollButtons(container);
        
        // 监听滚动事件
        container.addEventListener('scroll', () => {
            this.updateScrollButtons();
        });
        
        // 初始更新按钮状态
        setTimeout(() => {
            this.updateScrollButtons();
        }, 100);
    }
    
    // 创建滚动按钮
    createScrollButtons(container) {
        // 滚动到顶部按钮
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top-message';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.title = '滚动到顶部';
        scrollToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
        
        // 滚动到底部按钮
        const scrollToBottomBtn = document.createElement('button');
        scrollToBottomBtn.className = 'scroll-to-bottom-message';
        scrollToBottomBtn.innerHTML = '↓';
        scrollToBottomBtn.title = '滚动到底部';
        scrollToBottomBtn.addEventListener('click', () => {
            this.scrollToBottom();
        });
        
        // 添加按钮到容器
        const messageBoard = container.closest('.message-board');
        if (messageBoard) {
            messageBoard.appendChild(scrollToTopBtn);
            messageBoard.appendChild(scrollToBottomBtn);
        }
    }
    
    // 更新滚动按钮状态
    updateScrollButtons() {
        const container = document.getElementById('messages-container');
        const scrollTopBtn = document.querySelector('.scroll-to-top-message');
        const scrollBottomBtn = document.querySelector('.scroll-to-bottom-message');
        
        if (!container || !scrollTopBtn || !scrollBottomBtn) return;
        
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        // 显示/隐藏顶部按钮
        if (scrollTop > 50) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        // 显示/隐藏底部按钮
        if (scrollTop + clientHeight < scrollHeight - 50) {
            scrollBottomBtn.classList.add('visible');
        } else {
            scrollBottomBtn.classList.remove('visible');
        }
    }
    
    // 滚动到顶部
    scrollToTop() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    // 滚动到底部
    scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
    
    // 切换输入区域显示
    toggleInputArea() {
        const inputArea = document.querySelector('.message-input-area');
        if (inputArea) {
            inputArea.classList.toggle('active');
            
            // 如果显示输入区域，聚焦到输入框
            if (inputArea.classList.contains('active')) {
                document.getElementById('message-input').focus();
            }
        }
    }
    
    // 添加新留言
    addMessage() {
        const messageInput = document.getElementById('message-input');
        const content = messageInput.value.trim();
        
        if (content) {
            const newMessage = {
                id: Date.now(),
                content: content,
                time: new Date().toLocaleString('zh-CN'),
                timestamp: Date.now()
            };
            
            this.messages.unshift(newMessage); // 添加到开头
            this.saveMessages();
            this.renderMessages();
            
            // 清空输入框并隐藏输入区域
            messageInput.value = '';
            this.toggleInputArea();
            
            // 显示成功提示
            this.showMessage('留言发布成功！');
            
            // 更新滚动按钮状态
            setTimeout(() => {
                this.updateScrollButtons();
            }, 100);
        }
    }
    
    // 渲染留言列表
    renderMessages() {
        const container = document.getElementById('messages-container');
        if (!container) return;
        
        if (this.messages.length === 0) {
            container.innerHTML = '<div class="messages-empty">暂无留言，点击+按钮添加第一条留言</div>';
            return;
        }
        
        container.innerHTML = this.messages.map(message => `
            <div class="message-item">
                <div class="message-content">${this.escapeHtml(message.content)}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `).join('');
        
        // 自动滚动到最新留言
        container.scrollTop = 0;
    }
    
    // 显示消息提示
    showMessage(text) {
        // 创建提示元素
        const messageEl = document.createElement('div');
        messageEl.textContent = text;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 0.8rem;
        `;
        
        document.body.appendChild(messageEl);
        
        // 1.5秒后移除
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 1500);
    }
    
    // HTML转义，防止XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化留言板
const messageBoard = new MessageBoard();