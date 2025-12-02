function updateTime() {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const date = `${now.getFullYear()}年${String(now.getMonth()+1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 星期${['日','一','二','三','四','五','六'][now.getDay()]}`;
    
    document.getElementById('current-time').textContent = time;
    document.getElementById('current-date').textContent = date;
}

// 使用真实天气API获取数据
async function getRealWeather() {
    // 使用您提供的ID和KEY
    const userId = '10010009';
    const userKey = '9714cea90672308c1187416fa542bd19';
    
    try {
        // 根据文档构造API请求URL
        const apiUrl = `https://api.apihz.cn/api/tianqi/tqyb.php?id=${userId}&key=${userKey}`;
        
        console.log('正在请求天气数据...', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`网络请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API返回数据:', data); // 调试信息
        
        // 检查API返回状态
        if (data.code === 200) {
            updateWeatherDisplay(data);
        } else {
            // 如果API返回错误，使用模拟数据
            console.error('API返回错误:', data.msg);
            useMockWeather();
        }
    } catch (error) {
        console.error('获取天气数据失败:', error);
        // 如果API请求失败，使用模拟数据
        useMockWeather();
    }
}

// 更新天气显示
function updateWeatherDisplay(weatherData) {
    // 根据API文档的返回字段更新显示
    document.getElementById('weather-icon').textContent = getWeatherIcon(weatherData.weather1);
    document.getElementById('weather-temp').textContent = `${weatherData.temperature}°C`;
    
    // 显示天气变化，如果有weather2则显示"转"，否则只显示weather1
    if (weatherData.weather2 && weatherData.weather2 !== weatherData.weather1) {
        document.getElementById('weather-desc').textContent = `${weatherData.weather1}转${weatherData.weather2}`;
    } else {
        document.getElementById('weather-desc').textContent = weatherData.weather1;
    }
    
    document.getElementById('weather-location').textContent = weatherData.place || '未知地区';
}

// 使用模拟天气数据（备用）
function useMockWeather() {
    const mockWeather = {
        temperature: Math.round(Math.random() * 30 + 5),
        weather1: ['晴天', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
        weather2: ['多云', '晴', '阴天', '小雨'][Math.floor(Math.random() * 4)],
        place: '本地'
    };
    
    document.getElementById('weather-icon').textContent = getWeatherIcon(mockWeather.weather1);
    document.getElementById('weather-temp').textContent = `${mockWeather.temperature}°C`;
    
    if (mockWeather.weather2 !== mockWeather.weather1) {
        document.getElementById('weather-desc').textContent = `${mockWeather.weather1}转${mockWeather.weather2}`;
    } else {
        document.getElementById('weather-desc').textContent = mockWeather.weather1;
    }
    
    document.getElementById('weather-location').textContent = mockWeather.place;
}

// 根据天气描述返回对应的图标
function getWeatherIcon(weatherDesc) {
    if (!weatherDesc) return '🌤️';
    
    const iconMap = {
        '晴': '☀️',
        '多云': '⛅',
        '阴': '☁️',
        '雨': '🌧️',
        '小雨': '🌦️',
        '中雨': '🌧️',
        '大雨': '💦',
        '暴雨': '🌊',
        '雪': '❄️',
        '雾': '🌫️',
        '雷阵雨': '⛈️',
        '阵雨': '🌦️',
        '雷雨': '⛈️'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
        if (weatherDesc.includes(key)) {
            return icon;
        }
    }
    return '🌤️'; // 默认图标
}

// 初始化
updateTime();
getRealWeather(); // 使用真实API获取天气
setInterval(updateTime, 1000);
setInterval(getRealWeather, 600000); // 10分钟更新一次天气