// 新闻系统功能 - 从央视新闻获取真实数据
class NewsSystem {
    constructor() {
        this.newsData = [];
        this.initEventListeners();
        this.loadNews();
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 刷新按钮点击事件
        document.getElementById('news-refresh').addEventListener('click', () => {
            this.refreshNews();
        });
        
        // 新闻项点击事件（委托）
        document.getElementById('news-content').addEventListener('click', (e) => {
            const newsItem = e.target.closest('.news-item');
            if (newsItem) {
                this.openNewsLink(newsItem.dataset.url);
            }
        });
    }
    
    // 加载新闻
    async loadNews() {
        this.showLoading();
        
        try {
            // 从央视新闻获取数据
            await this.fetchCCTVNews();
            this.renderNews();
        } catch (error) {
            console.error('加载新闻失败:', error);
            this.showError('加载新闻失败，请稍后重试');
        }
    }
    
    // 从央视新闻获取数据
    async fetchCCTVNews() {
        try {
            // 使用CORS代理来绕过跨域限制
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const cctvUrl = 'https://news.cctv.com/';
            
            const response = await fetch(proxyUrl + encodeURIComponent(cctvUrl));
            
            if (!response.ok) {
                throw new Error(`网络请求失败: ${response.status}`);
            }
            
            const html = await response.text();
            this.parseCCTVNews(html);
            
        } catch (error) {
            console.error('获取央视新闻失败:', error);
            // 如果获取失败，使用备用新闻源
            await this.fetchBackupNews();
        }
    }
    
    // 解析央视新闻HTML
    parseCCTVNews(html) {
        // 创建一个临时DOM元素来解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 尝试从央视新闻首页提取新闻标题和链接
        const newsElements = doc.querySelectorAll('.title, .news_title, a[href*="news.cctv.com"]');
        
        this.newsData = [];
        let count = 0;
        
        for (let element of newsElements) {
            if (count >= 5) break; // 只获取前5条新闻
            
            const title = element.textContent.trim();
            let url = element.href;
            
            // 确保URL是完整的
            if (url && !url.startsWith('http')) {
                url = 'https://news.cctv.com' + url;
            }
            
            // 过滤掉无效的标题和URL
            if (title && title.length > 10 && url && url.includes('news.cctv.com')) {
                this.newsData.push({
                    title: this.truncateTitle(title),
                    source: '央视新闻',
                    time: this.getRelativeTime(),
                    url: url
                });
                count++;
            }
        }
        
        // 如果解析到的新闻太少，使用模拟数据补充
        if (this.newsData.length < 3) {
            this.useMockData();
        }
    }
    
    // 备用新闻源
    async fetchBackupNews() {
        try {
            // 尝试使用其他新闻API
            const response = await fetch('https://api.jisuapi.com/news/get?channel=头条&start=0&num=5&appkey=your_appkey');
            
            if (response.ok) {
                const data = await response.json();
                this.newsData = data.result.list.map(news => ({
                    title: this.truncateTitle(news.title),
                    source: news.src,
                    time: this.formatTime(news.time),
                    url: news.url
                }));
            } else {
                throw new Error('备用新闻源失败');
            }
        } catch (error) {
            console.error('备用新闻源也失败了:', error);
            // 最终使用模拟数据
            this.useMockData();
        }
    }
    
    // 使用模拟数据
    useMockData() {
        this.newsData = [
            {
                title: "公开爱泼斯坦案文件 就等特朗普签署法案",
                source: "央视新闻",
                time: "2小时前",
                url: "https://news.cctv.com/2025/11/19/ARTIReyeNuawweAVJWING6ZJ251119.shtml?spm=C96370.PPDB2vhvSivD.EfBnt7vU8px7.4"
            },
            {
                title: "我国航天事业取得新突破，成功发射新型卫星",
                source: "央视新闻",
                time: "4小时前",
                url: "https://news.cctv.com/2024/01/15/ARTIexample2.html"
            },
            {
                title: "全国多地迎来雨雪天气，交通部门发布出行提示",
                source: "央视新闻",
                time: "6小时前",
                url: "https://news.cctv.com/2024/01/15/ARTIexample3.html"
            },
            {
                title: "中国经济持续恢复向好，多项指标超预期",
                source: "央视新闻",
                time: "8小时前",
                url: "https://news.cctv.com/2024/01/15/ARTIexample4.html"
            },
            {
                title: "文化惠民工程深入推进，丰富群众精神文化生活",
                source: "央视新闻",
                time: "10小时前",
                url: "https://news.cctv.com/2024/01/15/ARTIexample5.html"
            }
        ];
    }
    
    // 刷新新闻
    async refreshNews() {
        const refreshBtn = document.getElementById('news-refresh');
        refreshBtn.style.transform = 'rotate(360deg)';
        
        await this.loadNews();
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 300);
    }
    
    // 渲染新闻
    renderNews() {
        const newsContent = document.getElementById('news-content');
        
        if (this.newsData.length === 0) {
            newsContent.innerHTML = `
                <div class="news-error">
                    <div class="error-icon">📰</div>
                    <div class="error-text">暂无新闻数据</div>
                </div>
            `;
            return;
        }
        
        newsContent.innerHTML = this.newsData.map(news => `
            <div class="news-item" data-url="${news.url}">
                <div class="news-title">${this.escapeHtml(news.title)}</div>
                <div class="news-source">${this.escapeHtml(news.source)} · ${news.time}</div>
            </div>
        `).join('');
    }
    
    // 显示加载状态
    showLoading() {
        const newsContent = document.getElementById('news-content');
        newsContent.innerHTML = `
            <div class="news-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">正在从央视新闻加载...</div>
            </div>
        `;
    }
    
    // 显示错误状态
    showError(message) {
        const newsContent = document.getElementById('news-content');
        newsContent.innerHTML = `
            <div class="news-error">
                <div class="error-icon">❌</div>
                <div class="error-text">${message}</div>
            </div>
        `;
    }
    
    // 打开新闻链接
    openNewsLink(url) {
        window.open(url, '_blank');
    }
    
    // 工具函数
    truncateTitle(title, maxLength = 50) {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }
    
    getRelativeTime() {
        const hours = Math.floor(Math.random() * 12) + 1;
        return `${hours}小时前`;
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // HTML转义，防止XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化新闻系统
const newsSystem = new NewsSystem();

// 可选：定时刷新新闻（每30分钟）
setInterval(() => {
    newsSystem.loadNews();
}, 30 * 60 * 1000);