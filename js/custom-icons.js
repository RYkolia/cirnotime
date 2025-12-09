// 自定义图标管理功能
class CustomIconsManager {
    constructor() {
        this.userIcons = this.loadIcons();
        this.initEventListeners();
        this.renderIcons();
        this.updateLayout();
        
        // 延迟初始化滚动检测，确保DOM已完全加载
        setTimeout(() => {
            this.initScrollDetection();
        }, 100);
    }
    
    // 从localStorage加载图标数据
    loadIcons() {
        const savedIcons = localStorage.getItem('userCustomIcons');
        return savedIcons ? JSON.parse(savedIcons) : [];
    }

    // 添加滚动检测方法
    initScrollDetection() {
        const buttonContainer = document.querySelector('.button-container');
        if (!buttonContainer) return;

        let scrollTimer;
        buttonContainer.addEventListener('scroll', () => {
            // 添加滚动动画类
            buttonContainer.classList.add('scrolling');
            
            // 清除之前的计时器
            clearTimeout(scrollTimer);
            
            // 设置新的计时器，在滚动停止后移除动画类
            scrollTimer = setTimeout(() => {
                buttonContainer.classList.remove('scrolling');
            }, 150);
        });
    }
    
    // 保存图标数据到localStorage
    saveIcons() {
        localStorage.setItem('userCustomIcons', JSON.stringify(this.userIcons));
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 添加按钮点击事件
        const addBtn = document.getElementById('floating-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddModal();
            });
        }
        
        // 模态框关闭事件
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideAddModal();
            });
        }
        
        const cancelAdd = document.getElementById('cancel-add');
        if (cancelAdd) {
            cancelAdd.addEventListener('click', () => {
                this.hideAddModal();
            });
        }
        
        // 确认添加事件
        const confirmAdd = document.getElementById('confirm-add');
        if (confirmAdd) {
            confirmAdd.addEventListener('click', () => {
                this.addNewIcon();
            });
        }
        
        // 点击模态框外部关闭
        const modal = document.getElementById('add-icon-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.hideAddModal();
                }
            });
        }
        
        // 按Enter键确认添加
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('add-icon-modal');
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Enter') {
                    this.addNewIcon();
                }
                if (e.key === 'Escape') {
                    this.hideAddModal();
                }
            }
        });
    }
    
    // 显示添加模态框
    showAddModal() {
        const modal = document.getElementById('add-icon-modal');
        const addBtn = document.getElementById('floating-add-btn');
        
        if (!modal || !addBtn) return;
        
        // 添加选中动画
        addBtn.classList.add('active');
        modal.classList.add('active');
        
        // 清空输入框
        const nameInput = document.getElementById('icon-name');
        const urlInput = document.getElementById('icon-url');
        const imageInput = document.getElementById('icon-image');
        
        if (nameInput) nameInput.value = '';
        if (urlInput) urlInput.value = '';
        if (imageInput) imageInput.value = '';
        
        // 聚焦到第一个输入框
        setTimeout(() => {
            if (nameInput) nameInput.focus();
        }, 100);
    }
    
    // 隐藏添加模态框
    hideAddModal() {
        const modal = document.getElementById('add-icon-modal');
        const addBtn = document.getElementById('floating-add-btn');
        
        if (modal) modal.classList.remove('active');
        
        // 移除选中动画
        setTimeout(() => {
            if (addBtn) addBtn.classList.remove('active');
        }, 300);
    }
    
    // 添加新图标
    addNewIcon() {
        const nameInput = document.getElementById('icon-name');
        const urlInput = document.getElementById('icon-url');
        const imageInput = document.getElementById('icon-image');
        
        if (!nameInput || !urlInput || !imageInput) return;
        
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const image = imageInput.value.trim();
        
        console.log('添加图标:', { name, url, image });
        
        // 验证输入
        if (!name) {
            this.showMessage('请输入图标名称');
            return;
        }
        
        if (!url) {
            this.showMessage('请输入图标链接');
            return;
        }
        
        if (!image) {
            this.showMessage('请输入图标图片URL');
            return;
        }
        
        // 验证URL格式
        if (!this.isValidUrl(url)) {
            this.showMessage('请输入有效的链接地址');
            return;
        }
        
        if (!this.isValidUrl(image)) {
            this.showMessage('请输入有效的图片链接');
            return;
        }
        
        const newIcon = {
            id: Date.now(),
            name: name,
            url: url,
            image: image,
            timestamp: new Date().toISOString()
        };
        
        this.userIcons.push(newIcon);
        this.saveIcons();
        this.renderIcons();
        this.hideAddModal();
        this.showMessage('图标添加成功！');
    }
    
    // 删除图标
    deleteIcon(iconId) {
        if (confirm('确定要删除这个图标吗？')) {
            this.userIcons = this.userIcons.filter(icon => icon.id !== iconId);
            this.saveIcons();
            this.renderIcons();
            this.showMessage('图标已删除');
        }
    }
    
    // 在 renderIcons 方法中调用更新顺序
    renderIcons() {
        const container = document.getElementById('user-icons-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.userIcons.forEach(icon => {
            const iconElement = this.createIconElement(icon);
            container.appendChild(iconElement);
        });
        
        // 更新布局和顺序
        this.updateLayout();
        this.updateIconOrder();
    }
    
    // 创建图标元素
    createIconElement(icon) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'user-icon-item';
        
        const iconLink = document.createElement('a');
        iconLink.href = icon.url;
        iconLink.target = '_blank';
        iconLink.className = 'icon-with-text';
        
        const imageButton = document.createElement('div');
        imageButton.className = 'image-button';
        
        const img = document.createElement('img');
        img.src = icon.image;
        img.alt = icon.name;
        img.onerror = () => {
            img.src = 'https://p1.ssl.qhmsg.com/dr/270_500_/t017fef093f1d96da34.jpg';
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-icon-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '删除图标';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.deleteIcon(icon.id);
        });
        
        const iconText = document.createElement('span');
        iconText.className = 'icon-text';
        iconText.textContent = icon.name;
        
        imageButton.appendChild(img);
        iconLink.appendChild(imageButton);
        iconLink.appendChild(iconText);
        iconWrapper.appendChild(iconLink);
        iconWrapper.appendChild(deleteBtn);
        
        return iconWrapper;
    }
    
    // 更新布局方法 - 重新设计为6个图标一行的网格布局
    updateLayout() {
        const buttonContainer = document.querySelector('.button-container');
        if (!buttonContainer) return;
        
        const totalIcons = 5 + this.userIcons.length;
        
        console.log('布局调试:');
        console.log('- 总图标数:', totalIcons);
        
        // 当图标超过6个时启用网格布局和滚动
        if (totalIcons > 6) {
            buttonContainer.classList.add('grid-layout', 'scroll-enabled');
            console.log('启用网格布局和滚动');
            
            // 计算需要多少行
            const rows = Math.ceil(totalIcons / 6);
            buttonContainer.style.setProperty('--grid-rows', rows);
            
        } else {
            buttonContainer.classList.remove('grid-layout', 'scroll-enabled');
            buttonContainer.style.removeProperty('--grid-rows');
            console.log('使用单行布局');
        }
        
        this.updateIconOrder();
    }

    // 更新图标顺序
    updateIconOrder() {
        const fixedIcons = document.querySelectorAll('.button-container > .icon-with-text');
        const userIcons = document.querySelectorAll('.user-icon-item');
        
        // 设置固定图标的顺序
        fixedIcons.forEach((icon, index) => {
            icon.style.order = index + 1;
        });
        
        // 设置用户图标的顺序（在固定图标之后）
        userIcons.forEach((icon, index) => {
            icon.style.order = fixedIcons.length + index + 1;
        });
    }
    
    // 验证URL格式
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // 显示消息提示
    showMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.textContent = text;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 0.9rem;
            pointer-events: none;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 2000);
    }
}

// 确保DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('main-content')) {
        const customIconsManager = new CustomIconsManager();
        console.log('自定义图标管理器已初始化');
        
        // 窗口大小改变时重新计算布局
        window.addEventListener('resize', () => {
            customIconsManager.updateLayout();
        });
        
        // 初始布局检查
        setTimeout(() => {
            customIconsManager.updateLayout();
        }, 100);
    }
});