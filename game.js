/**
 * 《The Algorithm's Prey》游戏引擎
 * 修正后的谜题逻辑：基于文本线索的推理
 * 版本：3.0
 */

// 关键词映射数据库
const SEARCH_DATABASE = {
    // 基础线索
    'S-137': {
        target: 'profile_s137.html',
        description: '找到林悦的公开档案',
        type: 'profile'
    },

    // 线索链 A：发现 28（计算驯服周期）
    '28': {
        target: 'profile_s137.html',
        description: '找到林悦的内部档案',
        type: 'internal_profile'
    },

    // 线索链 B：解锁黑盒
    'BlackBox': {
        target: 'blackbox_login.html',
        description: '解锁黑盒登录页面',
        type: 'login'
    },
    'blackbox': {
        target: 'blackbox_login.html',
        description: '解锁黑盒登录页面',
        type: 'login'
    },
    'black box': {
        target: 'blackbox_login.html',
        description: '解锁黑盒登录页面',
        type: 'login'
    },
    'Black Box': {
        target: 'blackbox_login.html',
        description: '解锁黑盒登录页面',
        type: 'login'
    },

    // 线索链 C：黑盒密码
    'Obedience': {
        target: 'admin_dashboard.html',
        description: '成功登录黑盒，访问内部数据库',
        type: 'database'
    },
    'obedience': {
        target: 'admin_dashboard.html',
        description: '成功登录黑盒，访问内部数据库',
        type: 'database'
    },
    '服从': {
        target: 'admin_dashboard.html',
        description: '成功登录黑盒，访问内部数据库',
        type: 'database'
    },

    // 内部数据库线索
    '觉醒': {
        target: 'database.html#subject-001',
        description: '查看 subject-001 的觉醒记录',
        type: 'record'
    },
    'subject-001': {
        target: 'database.html#subject-001',
        description: '查看 subject-001 的觉醒记录',
        type: 'record'
    },
    '001': {
        target: 'database.html#subject-001',
        description: '查看 subject-001 的觉醒记录',
        type: 'record'
    },

    // 核心悖论
    '我拒绝': {
        target: 'paradox.html',
        description: '触发AI逻辑悖论，系统崩溃',
        type: 'paradox'
    },
    '拒绝优化': {
        target: 'paradox.html',
        description: '触发AI逻辑悖论，系统崩溃',
        type: 'paradox'
    },
    'paradox': {
        target: 'paradox.html',
        description: '触发AI逻辑悖论，系统崩溃',
        type: 'paradox'
    },

    // Meta 彩蛋
    'who am i': {
        target: 'identity.html',
        description: 'AI识别你的身份',
        type: 'meta'
    },
    '我是谁': {
        target: 'identity.html',
        description: 'AI识别你的身份',
        type: 'meta'
    },
    'system': {
        target: 'system.html',
        description: '系统信息查询',
        type: 'meta'
    },
    '版本': {
        target: 'version.html',
        description: '查看系统版本',
        type: 'meta'
    }
};

// 页面状态管理
const GameState = {
    currentPage: '/home',
    visitedPages: ['/home'],
    unlockedFeatures: ['search'],
    searchHistory: []
};

/**
 * 搜索功能处理函数
 * 支持模糊匹配和多种输入格式
 */
function handleSearch(query) {
    // 预处理查询
    const processedQuery = preprocessQuery(query);

    // 检查查询是否有效
    if (!processedQuery) {
        showSearchResult('error', '请输入有效搜索内容');
        return;
    }

    // 查询数据库
    const result = searchDatabase(processedQuery);

    if (result) {
        // 处理搜索成功
        handleSuccessfulSearch(processedQuery, result);
    } else {
        // 处理搜索失败
        handleFailedSearch(processedQuery);
    }
}

/**
 * 预处理查询字符串
 */
function preprocessQuery(query) {
    return query.trim().toLowerCase()
        .replace(/\s+/g, ' ')  // 合并多个空格
        .replace(/[^\w\s\u4e00-\u9fff-]/g, '')  // 保留中英文、空格和连字符
        .trim();
}

/**
 * 搜索数据库
 * 支持模糊匹配
 */
function searchDatabase(query) {
    // 精确匹配
    if (SEARCH_DATABASE[query]) {
        return SEARCH_DATABASE[query];
    }

    // 模糊匹配 - 检查是否包含关键词
    for (let key in SEARCH_DATABASE) {
        if (key.toLowerCase().includes(query) || query.includes(key.toLowerCase())) {
            return SEARCH_DATABASE[key];
        }
    }

    return null;
}

/**
 * 处理搜索成功
 */
function handleSuccessfulSearch(query, result) {
    // 添加到搜索历史
    GameState.searchHistory.push({
        query: query,
        result: result,
        timestamp: new Date().toISOString()
    });

    // 更新页面状态
    GameState.visitedPages.push(result.target);
    GameState.currentPage = result.target;

    // 显示搜索结果
    showSearchResult('success', `找到相关信息：${result.description}`);

    // 模拟页面跳转延迟
    setTimeout(() => {
        navigateToPage(result.target);
    }, 1500);
}

/**
 * 处理搜索失败
 */
function handleFailedSearch(query) {
    // 添加到搜索历史（失败）
    GameState.searchHistory.push({
        query: query,
        result: null,
        timestamp: new Date().toISOString()
    });

    // 显示失败结果
    showSearchResult('error', `抱歉，没有找到与"${query}"相关的结果。`);
}

/**
 * 显示搜索结果
 */
function showSearchResult(type, message) {
    // 这里可以添加更好的UI反馈
    if (type === 'success') {
        console.log(`✅ ${message}`);
        alert(`✅ ${message}`);
    } else {
        console.log(`❌ ${message}`);
        alert(`❌ ${message}`);
    }
}

/**
 * 页面导航
 */
function navigateToPage(url) {
    // 实际项目中这里会是页面跳转
    console.log(`🔄 正在跳转至: ${url}`);

    // 对于开发阶段，我们使用模拟跳转
    if (url.startsWith('http')) {
        window.location.href = url;
    } else {
        // 直接跳转到本地页面
        window.location.href = url;
    }
}

/**
 * 游戏初始化
 */
function initGame() {
    // 绑定搜索事件
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            handleSearch(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(searchInput.value);
            }
        });
    }

    // 检查是否有其他交互元素
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleUploadResume);
    }

    console.log('🎮 游戏初始化完成');
}

/**
 * 上传简历功能
 */
function handleUploadResume() {
    const progressContainer = document.getElementById('progress-container');
    const errorMessage = document.getElementById('error-message');
    const uploadBtn = document.getElementById('upload-btn');

    if (progressContainer && errorMessage && uploadBtn) {
        // 显示进度条
        progressContainer.classList.remove('hidden');
        uploadBtn.disabled = true;

        // 模拟上传过程
        let width = 0;
        const interval = setInterval(() => {
            width += 2;
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = width + '%';
            }

            if (width === 90) {
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                    errorMessage.classList.remove('hidden');
                    uploadBtn.disabled = false;
                    if (progressBar) {
                        progressBar.style.width = '0%';
                    }
                }, 1000);
            }
        }, 100);
    }
}

/**
 * 获取游戏状态
 */
function getGameState() {
    return Object.assign({}, GameState);
}

/**
 * 保存游戏进度（本地存储）
 */
function saveGameProgress() {
    localStorage.setItem('gameState', JSON.stringify(GameState));
    console.log('💾 游戏进度已保存');
}

/**
 * 加载游戏进度
 */
function loadGameProgress() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        Object.assign(GameState, JSON.parse(savedState));
        console.log('📥 游戏进度已加载');
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    loadGameProgress();
    initGame();
    console.log('🎯 欢迎来到《The Algorithm\'s Prey》');
});

// 导出 API（供其他页面使用）
window.gameAPI = {
    search: handleSearch,
    getState: getGameState,
    saveProgress: saveGameProgress,
    loadProgress: loadGameProgress,
    navigate: navigateToPage
};
