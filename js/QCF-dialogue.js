// Cirno台词系统 - 增强版
class CirnoDialogue {
    constructor() {
        console.log('CirnoDialogue 初始化开始');

        this.dialogues = [
            { text: "人生最是游戏妙，神行太保此方笑。神作必须买三套，一看一藏一传教。", type: "angry" },
            { text: "干嘛为那一斤两斤或喜或悲的呢……所以说你们女人啊～", type: "confident" },
            { text: "一言以蔽之，就是“爱”", type: "proud" },
            { text: "贫乳是稀有价值!!", type: "teasing" },
            { text: "WWWWWWWW", type: "battle" }
        ];

        // 添加以下点击计数器属性
        this.clickCount = 0;
        this.lastClickTime = 0;
        this.clickTimeout = null;
        this.isLoginModalActive = false;
        
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    
    init() {
        console.log('开始初始化台词系统');
        
        // 获取元素
        this.gifElement = document.getElementById('cirno-gif');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueContent = document.getElementById('dialogue-content');

        console.log('找到的元素:', {
            gif: this.gifElement,
            box: this.dialogueBox,
            content: this.dialogueContent
        });
        
        if (!this.gifElement) {
            console.error('错误: 未找到 cirno-gif 元素');
            // 添加调试边框
            const gifContainers = document.querySelectorAll('.left-corner-gif');
            gifContainers.forEach(container => {
                container.classList.add('debug-gif');
                console.log('找到的GIF容器:', container);
            });
            return;
        }
        
        if (!this.dialogueBox) {
            console.error('错误: 未找到 dialogue-box 元素');
            return;
        }
        
        if (!this.dialogueContent) {
            console.error('错误: 未找到 dialogue-content 元素');
            return;
        }
        
        this.setupEventListeners();
        console.log('台词系统初始化完成');
    }
    
    setupEventListeners() {
        this.gifElement.addEventListener('click', (e) => {
            console.log('GIF被点击', e);
            this.handleGifClick(); // 改为调用新的处理函数
        });
        
        this.gifElement.style.cursor = 'pointer';
        this.gifElement.title = '点击查看泉此方的台词';
        
        // 添加点击动画
        this.gifElement.addEventListener('mousedown', () => {
            this.gifElement.style.transform = 'scale(0.95)';
        });
        
        this.gifElement.addEventListener('mouseup', () => {
            this.gifElement.style.transform = 'scale(1)';
        });
        
        this.gifElement.addEventListener('mouseleave', () => {
            this.gifElement.style.transform = 'scale(1)';
        });
    }
    
    // 新增：处理GIF点击函数
    handleGifClick() {
        const currentTime = Date.now();
        
        // 如果距离上次点击超过3秒，重置计数器
        if (currentTime - this.lastClickTime > 3000) {
            this.clickCount = 0;
        }
        
        this.lastClickTime = currentTime;
        this.clickCount++;
        
        console.log(`点击次数: ${this.clickCount}`);
        
        // 清除之前的超时
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
        }
        
        // 设置3秒后重置计数器
        this.clickTimeout = setTimeout(() => {
            this.clickCount = 0;
        }, 3000);
        
        // 检查是否达到20次点击
        if (this.clickCount >= 20) {
            console.log('达到20次点击，触发隐藏功能');
            this.clickCount = 0; // 重置计数器
            this.showLoginModal();
            return; // 不显示普通台词
        }
        
        // 正常显示台词
        this.showRandomDialogue();
    }

    // 新增：显示登录模态框
    showLoginModal() {
        if (this.isLoginModalActive) return;
        
        this.isLoginModalActive = true;
        
        // 创建登录模态框HTML
        const loginModal = document.createElement('div');
        loginModal.className = 'secret-login-modal';
        loginModal.innerHTML = `
            <div class="secret-login-content">
                <h3>隐藏功能已解锁！</h3>
                <p>隐藏入口</p>
                
                <div class="login-form">
                    <div class="form-group">
                        <label for="secret-username">用户名：</label>
                        <input type="text" id="secret-username" placeholder="请输入用户名">
                    </div>
                    <div class="form-group">
                        <label for="secret-password">密码：</label>
                        <input type="password" id="secret-password" placeholder="请输入密码">
                    </div>
                    
                    <div class="login-buttons">
                        <button class="login-btn" id="secret-login-btn">登录</button>
                        <button class="cancel-btn" id="secret-cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loginModal);
        
        // 添加事件监听器
        setTimeout(() => {
            document.getElementById('secret-login-btn').addEventListener('click', () => {
                this.handleLogin();
            });
            
            document.getElementById('secret-cancel-btn').addEventListener('click', () => {
                this.hideLoginModal();
            });
            
            // 点击模态框外部关闭
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    this.hideLoginModal();
                }
            });
            
            // 按Enter键登录
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.isLoginModalActive) {
                    this.handleLogin();
                }
                if (e.key === 'Escape' && this.isLoginModalActive) {
                    this.hideLoginModal();
                }
            });
        }, 100);
    }

    // 新增：处理登录逻辑
    handleLogin() {
        const username = document.getElementById('secret-username').value;
        const password = document.getElementById('secret-password').value;
        
        // 简单的验证逻辑（可以修改为更复杂的）
        if (username === 'patchouli' && password === '15532') {
            this.showSuccessMessage();
            setTimeout(() => {
                this.hideLoginModal();
                this.showHiddenContent();
            }, 1500);
        } else {
            this.showErrorMessage('用户名或密码错误！');
        }
    }

    showRandomDialogue() {
        console.log('显示随机台词');
        if (this.dialogueBox.classList.contains('show')) {
            this.hideDialogue();
            setTimeout(() => {
                this.displayNewDialogue();
            }, 300);
        } else {
            this.displayNewDialogue();
        }
    }

    // 新增：隐藏登录模态框
    hideLoginModal() {
        const modal = document.querySelector('.secret-login-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
        this.isLoginModalActive = false;
    }

    // 新增：显示成功消息
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'secret-message success';
        message.textContent = '登录成功';
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 2000);
    }

     // 新增：显示错误消息
    showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'secret-message error';
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 2000);
    }

    // 新增：显示隐藏内容（示例）
    showHiddenContent() {
    // 这里可以添加您想要的隐藏内容
    // 例如：显示一个特殊的图片、视频或文字
    
        const hiddenContent = document.createElement('div');
        hiddenContent.className = 'hidden-content';
        hiddenContent.innerHTML = `
            <div class="hidden-content-inner">
                <h2>隐藏内容解锁！</h2>
                <p>恭喜你发现了这个秘密功能！</p>
                <p>这里是只有连续点击20次泉此方才能看到的内容。</p>
                <a href="https://store.steampowered.com/app/698780/Doki_Doki_Literature_Club" target="_blank">
                    <img src="photo/C_Patchouli.jpg" alt="隐藏图片" style="max-width: 200px; border-radius: 10px; margin: 15px 0; cursor: pointer;">
                </a>
                <p>不敢想你怎么找到密码的Owo</p>
                <button class="close-hidden-btn">关闭</button>
            </div>
        `;
        
        document.body.appendChild(hiddenContent);
        
        setTimeout(() => {
            document.querySelector('.close-hidden-btn').addEventListener('click', () => {
                document.body.removeChild(hiddenContent);
            });
        }, 100);
    }
    
    displayNewDialogue() {
        const randomIndex = Math.floor(Math.random() * this.dialogues.length);
        const randomDialogue = this.dialogues[randomIndex];
        
        console.log('显示台词:', randomDialogue.text);
        this.dialogueContent.textContent = randomDialogue.text;
        
        // 根据台词类型添加不同的样式类
        this.dialogueBox.className = 'dialogue-box';
        this.dialogueBox.classList.add('show', randomDialogue.type);
        
        // 添加显示动画
        this.dialogueBox.style.animation = 'dialoguePop 0.3s ease';
        
        this.hideTimeout = setTimeout(() => {
            this.hideDialogue();
        }, 1800);
    }
    
    hideDialogue() {
        this.dialogueBox.style.animation = 'dialogueFadeOut 0.3s ease';
        setTimeout(() => {
            this.dialogueBox.classList.remove('show');
            this.dialogueBox.className = 'dialogue-box';
        }, 280);
        
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
    }
    
    addDialogue(newDialogue, type = 'normal') {
        this.dialogues.push({ text: newDialogue, type: type });
    }
    
    getAllDialogues() {
        return [...this.dialogues];
    }
}

// 初始化台词系统
console.log('准备初始化台词系统');
window.cirnoDialogue = new CirnoDialogue();