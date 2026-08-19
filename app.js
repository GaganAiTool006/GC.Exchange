/* ============================================
   GK EXCHANGE - Core Application Logic
   app.js
   ============================================ */

// ============ STATE ============
var GK_VERSION = '2.0.0';
var GK_NAME = 'GK Exchange';

var defaultState = {
    isLoggedIn: false,
    user: {
        email: '',
        displayName: '',
        uid: 'GKX' + Math.floor(Math.random() * 9000000 + 1000000),
        kycLevel: 2,
        vipLevel: 1,
        registered: new Date().toISOString(),
        twoFA: false,
        antiPhishing: false,
        loginHistory: []
    },
    tickers: {
        'BTCUSDT': { price: 67432.80, change: 2.34, high: 68200, low: 66100, vol: 28.4, volUSD: 1.9e9, name: 'Bitcoin' },
        'ETHUSDT': { price: 3812.50, change: 1.87, high: 3890, low: 3720, vol: 184.6, volUSD: 7.1e8, name: 'Ethereum' },
        'BNBUSDT': { price: 628.40, change: -0.92, high: 642, low: 618, vol: 512.3, volUSD: 3.2e8, name: 'BNB' },
        'SOLUSDT': { price: 187.30, change: 4.21, high: 192, low: 179, vol: 2834.1, volUSD: 5.3e8, name: 'Solana' },
        'XRPUSDT': { price: 0.6284, change: -1.12, high: 0.648, low: 0.612, vol: 84200000, volUSD: 5.3e7, name: 'XRP' },
        'ADAUSDT': { price: 0.5819, change: 0.78, high: 0.592, low: 0.571, vol: 62100000, volUSD: 3.6e7, name: 'Cardano' },
        'DOTUSDT': { price: 8.42, change: 2.15, high: 8.61, low: 8.21, vol: 1290000, volUSD: 1.1e7, name: 'Polkadot' },
        'DOGEUSDT': { price: 0.1843, change: 5.62, high: 0.189, low: 0.172, vol: 320000000, volUSD: 5.9e7, name: 'Dogecoin' },
        'AVAXUSDT': { price: 38.90, change: 3.14, high: 39.8, low: 37.2, vol: 3200000, volUSD: 1.2e8, name: 'Avalanche' },
        'LTCUSDT': { price: 84.30, change: -0.65, high: 86.1, low: 83.2, vol: 890000, volUSD: 7.5e7, name: 'Litecoin' }
    },
    currentPair: 'BTCUSDT',
    wallet: {
        BTC: 0.12450,
        ETH: 2.8432,
        BNB: 14.320,
        SOL: 28.45,
        USDT: 3241.80,
        XRP: 5000,
        ADA: 12000,
        DOGE: 50000,
        GKX: 10000
    },
    favorites: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
    orders: [],
    p2pAds: [],
    p2pOrders: [],
    paymentMethods: [
        { id: 'pm1', type: 'UPI', name: 'Google Pay', detail: '9876543210@gpay', color: '#4285f4', emoji: '📱' },
        { id: 'pm2', type: 'Bank Transfer', name: 'HDFC Bank', detail: 'AC: ****7823', color: '#e65c00', emoji: '🏦' },
        { id: 'pm3', type: 'Paytm', name: 'Paytm Wallet', detail: '9876543210', color: '#00baf2', emoji: '💙' }
    ],
    theme: 'dark',
    currentView: 'home',
    chartTimeframe: '1H'
};

// Load from localStorage
var state;
try {
    var saved = localStorage.getItem('gk_exchange_state');
    if (saved) {
        var parsed = JSON.parse(saved);
        state = Object.assign({}, defaultState, parsed);
        state.user = Object.assign({}, defaultState.user, parsed.user || {});
        state.wallet = Object.assign({}, defaultState.wallet, parsed.wallet || {});
        state.tickers = Object.assign({}, defaultState.tickers, parsed.tickers || {});
        state.favorites = parsed.favorites || defaultState.favorites;
        state.paymentMethods = parsed.paymentMethods || defaultState.paymentMethods;
        state.orders = parsed.orders || [];
        state.p2pOrders = parsed.p2pOrders || [];
    } else {
        state = JSON.parse(JSON.stringify(defaultState));
    }
} catch (e) {
    state = JSON.parse(JSON.stringify(defaultState));
}

window.state = state;

function saveState() {
    try { localStorage.setItem('gk_exchange_state', JSON.stringify(state)); } catch (e) {}
}
window.saveState = saveState;

// ============ THEME ============
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    saveState();
}
document.getElementById('theme-toggle-btn').addEventListener('click', function() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
});
applyTheme(state.theme || 'dark');

// ============ PRICE SIMULATION ============
var priceSimInterval = null;
function startPriceSim() {
    if (priceSimInterval) clearInterval(priceSimInterval);
    priceSimInterval = setInterval(function() {
        Object.keys(state.tickers).forEach(function(pair) {
            var t = state.tickers[pair];
            var move = (Math.random() - 0.498) * 0.0008;
            var newPrice = parseFloat((t.price * (1 + move)).toFixed(pair.includes('USDT') && t.price > 100 ? 2 : 4));
            var prevPrice = t.price;
            t.price = newPrice;
            t.change = parseFloat((t.change + (Math.random() - 0.5) * 0.05).toFixed(2));
            t.vol = parseFloat((t.vol * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2));
            if (newPrice > t.high) t.high = newPrice;
            if (newPrice < t.low) t.low = newPrice;
            window.dispatchEvent(new CustomEvent('tickerUpdate', { detail: { pair: pair, price: newPrice, prevPrice: prevPrice, ticker: t } }));
        });
        updateHeaderBalance();
    }, 1200);
}
startPriceSim();

// ============ WALLET HELPERS ============
function calcTotalUSDValue() {
    var total = state.wallet.USDT || 0;
    var pairs = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LTC'];
    pairs.forEach(function(coin) {
        if (state.wallet[coin] && state.tickers[coin + 'USDT']) {
            total += state.wallet[coin] * state.tickers[coin + 'USDT'].price;
        }
    });
    return total;
}
window.calcTotalUSDValue = calcTotalUSDValue;

function formatNum(n, d) { d = d === undefined ? 2 : d; return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
window.formatNum = formatNum;

function formatCurrency(n) { return '$' + formatNum(n, 2); }
window.formatCurrency = formatCurrency;

function formatBTC(n) { return parseFloat(n || 0).toFixed(6); }
window.formatBTC = formatBTC;

function timeAgo(ms) { var s = Math.floor((Date.now() - ms) / 1000); if (s < 60) return s + 's ago'; if (s < 3600) return Math.floor(s/60) + 'm ago'; return Math.floor(s/3600) + 'h ago'; }
window.timeAgo = timeAgo;

function updateHeaderBalance() {
    var el = document.getElementById('header-balance-val');
    if (el && state.isLoggedIn) el.textContent = formatCurrency(calcTotalUSDValue());
}

// ============ AUTH HELPERS ============
function updateAuthUI() {
    var loggedOut = document.getElementById('logged-out-view');
    var loggedIn = document.getElementById('logged-in-view');
    if (!loggedOut || !loggedIn) return;
    if (state.isLoggedIn) {
        loggedOut.classList.add('hidden');
        loggedIn.classList.remove('hidden');
        var nameOrEmail = state.user.displayName || state.user.email || 'Trader';
        var avatarLetter = nameOrEmail.charAt(0).toUpperCase();
        var avatarEl = document.getElementById('avatar-letter');
        if (avatarEl) avatarEl.textContent = avatarLetter;
        var bigAvatar = document.getElementById('dropdown-big-avatar');
        if (bigAvatar) bigAvatar.textContent = avatarLetter;
        var emailEl = document.getElementById('dropdown-user-email');
        if (emailEl) emailEl.textContent = state.user.email || 'user@gkexchange.com';
        updateHeaderBalance();
    } else {
        loggedOut.classList.remove('hidden');
        loggedIn.classList.add('hidden');
    }
}
window.updateAuthUI = updateAuthUI;

function loginUser(email, password, isRegister) {
    if (!email) email = 'trader@gkexchange.com';
    var cleanEmail = email.trim();
    var displayName = cleanEmail.split('@')[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    state.isLoggedIn = true;
    state.user.email = cleanEmail;
    state.user.displayName = displayName;
    if (!state.user.uid) {
        state.user.uid = 'GKX' + Math.floor(Math.random() * 9000000 + 1000000);
    }
    
    // Add to login history
    if (!Array.isArray(state.user.loginHistory)) {
        state.user.loginHistory = [];
    }
    state.user.loginHistory.unshift({
        time: new Date().toISOString(),
        ip: '103.212.' + Math.floor(Math.random() * 200 + 10) + '.' + Math.floor(Math.random() * 200 + 10),
        device: navigator.platform || 'Windows / Web Browser',
        location: 'Mumbai, India',
        status: 'Successful'
    });
    if (state.user.loginHistory.length > 20) {
        state.user.loginHistory.pop();
    }

    saveState();
    updateAuthUI();
    showToast(isRegister ? '🎉 Registration successful! Welcome to GK Exchange.' : '✅ Welcome back, ' + displayName + '!', 'success');
    navigate('wallet');
}
window.loginUser = loginUser;

function registerUser(email, password) {
    loginUser(email, password, true);
}
window.registerUser = registerUser;

function logoutUser() {
    state.isLoggedIn = false;
    state.user.email = '';
    saveState();
    updateAuthUI();
    navigate('home');
    showToast('Logged out successfully', 'info');
}
window.logoutUser = logoutUser;

document.getElementById('btn-logout').addEventListener('click', logoutUser);

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type) {
    type = type || 'success';
    var toast = document.createElement('div');
    toast.style.cssText = [
        'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9999',
        'background:' + (type === 'error' ? 'var(--red)' : type === 'info' ? 'var(--blue)' : type === 'warning' ? 'var(--primary)' : 'var(--green)'),
        'color:' + (type === 'warning' ? 'var(--text-on-gold)' : '#fff'),
        'padding:13px 22px', 'border-radius:10px', 'font-size:14px',
        'font-weight:600', 'box-shadow:0 8px 24px rgba(0,0,0,0.4)',
        'animation:fadeIn 0.3s ease', 'max-width:340px'
    ].join(';');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.animation = 'fadeIn 0.3s ease reverse'; setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300); }, 3000);
}
window.showToast = showToast;

// ============ ROUTER ============
function navigate(view, params) {
    params = params || {};
    var hash = '#' + view;
    var queryParts = [];
    if (params.tab) queryParts.push('tab=' + params.tab);
    if (params.sub) queryParts.push('sub=' + params.sub);
    if (params.pair) queryParts.push('pair=' + params.pair);
    if (queryParts.length > 0) hash += '?' + queryParts.join('&');
    window.location.hash = hash;
}
window.navigate = navigate;

function parseHash() {
    var hash = window.location.hash || '#home';
    var parts = hash.replace('#', '').split('?');
    var view = parts[0] || 'home';
    var params = {};
    if (parts[1]) {
        parts[1].split('&').forEach(function(p) {
            var kv = p.split('=');
            params[kv[0]] = kv[1];
        });
    }
    return { view: view, params: params };
}

function renderView() {
    var parsed = parseHash();
    var view = parsed.view;
    var params = parsed.params;
    var content = document.getElementById('app-content');
    if (!content) return;
    content.className = 'fade-in';

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
    var navEl = document.getElementById('nav-' + view);
    if (navEl) navEl.classList.add('active');
    if (view === 'p2p') { var p2pNav = document.getElementById('nav-p2p'); if (p2pNav) p2pNav.classList.add('active'); }

    switch (view) {
        case 'home':
            if (window.renderHome) window.renderHome(content);
            break;
        case 'markets':
            if (window.renderMarkets) window.renderMarkets(content, params);
            break;
        case 'trade':
            if (params.pair && state.tickers[params.pair]) {
                state.currentPair = params.pair;
            }
            if (window.renderTrade) window.renderTrade(content);
            break;
        case 'wallet':
            if (!state.isLoggedIn) { 
                showToast('Please log in to access your Wallet', 'warning');
                navigate('auth', { tab: 'login' }); 
                return; 
            }
            if (window.renderWallet) window.renderWallet(content);
            break;
        case 'p2p':
            if (window.renderP2P) window.renderP2P(content, params.sub || 'listing', params);
            break;
        case 'profile':
            if (!state.isLoggedIn) { 
                showToast('Please log in to access your Profile', 'warning');
                navigate('auth', { tab: 'login' }); 
                return; 
            }
            if (window.renderProfile) window.renderProfile(content, params.tab || 'overview');
            break;
        case 'auth':
            if (window.renderAuth) window.renderAuth(content, params.tab || 'login');
            break;
        default:
            content.innerHTML = '<div style="text-align:center;padding:100px 20px;"><h2 style="font-family:var(--font-heading);font-size:48px;color:var(--primary);">404</h2><p style="color:var(--text-secondary);margin-top:8px;">Page not found</p><a href="#home" style="color:var(--primary);margin-top:16px;display:inline-block;font-weight:600;">← Back to Home</a></div>';
    }

    if (window.lucide) lucide.createIcons();
    updateAuthUI();
}

window.addEventListener('hashchange', renderView);
window.addEventListener('DOMContentLoaded', function() {
    if (!window.location.hash || window.location.hash === '#') {
        window.location.hash = '#home';
    }
    renderView();
});

// ============ GLOBAL SEARCH ============
document.getElementById('global-search-input').addEventListener('input', function() {
    var query = this.value.toLowerCase().trim();
    if (query.length > 1) {
        var matches = Object.keys(state.tickers).filter(function(p) { 
            var name = (state.tickers[p].name || '').toLowerCase();
            return p.toLowerCase().includes(query) || name.includes(query); 
        });
        if (matches.length > 0) {
            state.currentPair = matches[0];
            navigate('trade');
        }
    }
});
