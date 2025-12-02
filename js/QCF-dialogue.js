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
            this.showRandomDialogue();
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