// --- CENTRAL APPLICATION STATE ---
var state = {
    user: {
        isLoggedIn: true,
        email: 'user@binance.com',
        id: '593740284',
        balances: {
            USDT: 12500.00,
            BTC: 0.5234,
            BNB: 4.82,
            ETH: 1.85,
            SOL: 14.50,
            ADA: 250.00
        }
    },
    // Crypto Tickers Base Data
    tickers: {
        'BTC/USDT': { symbol: 'BTC', name: 'Bitcoin', price: 67450.50, change24h: 2.45, high24h: 68120.00, low24h: 65900.00, volume24h: 34120.50, color: '#f0b90b' },
        'ETH/USDT': { symbol: 'ETH', name: 'Ethereum', price: 3480.20, change24h: -1.15, high24h: 3590.00, low24h: 3410.50, volume24h: 182490.80, color: '#a3a9c9' },
        'BNB/USDT': { symbol: 'BNB', name: 'BNB', price: 585.30, change24h: 5.62, high24h: 590.20, low24h: 552.10, volume24h: 498302.10, color: '#f0b90b' },
        'SOL/USDT': { symbol: 'SOL', name: 'Solana', price: 182.45, change24h: 8.71, high24h: 185.00, low24h: 167.30, volume24h: 1248920.00, color: '#8c52ff' },
        'ADA/USDT': { symbol: 'ADA', name: 'Cardano', price: 0.485, change24h: -0.82, high24h: 0.510, low24h: 0.478, volume24h: 4219000.00, color: '#0033ad' },
        'XRP/USDT': { symbol: 'XRP', name: 'Ripple', price: 0.592, change24h: 0.12, high24h: 0.605, low24h: 0.584, volume24h: 8901200.00, color: '#23292f' },
        'DOT/USDT': { symbol: 'DOT', name: 'Polkadot', price: 6.85, change24h: -2.31, high24h: 7.12, low24h: 6.78, volume24h: 320900.00, color: '#e6007a' },
        'DOGE/USDT': { symbol: 'DOGE', name: 'Dogecoin', price: 0.134, change24h: 12.35, high24h: 0.142, low24h: 0.119, volume24h: 12903820.00, color: '#c2a633' }
    },
    favorites: ['BTC/USDT', 'BNB/USDT', 'SOL/USDT'],
    openOrders: [
        { id: '1', time: '2026-07-30 14:20:11', pair: 'BTC/USDT', type: 'Limit', side: 'Buy', price: 66000.00, amount: 0.05, total: 3300.00 }
    ],
    orderHistory: [
        { id: 'h1', time: '2026-07-30 11:15:42', pair: 'ETH/USDT', type: 'Market', side: 'Buy', price: 3450.00, amount: 0.1, total: 345.00, status: 'Filled' },
        { id: 'h2', time: '2026-07-30 09:30:10', pair: 'BNB/USDT', type: 'Limit', side: 'Sell', price: 580.00, amount: 1.5, total: 870.00, status: 'Filled' }
    ],
    p2pOrders: [],
    activeTradingPair: 'BTC/USDT',
    currentRoute: 'home',
    theme: 'dark'
};

// --- AUTHENTICATION HELPERS ---
window.loginUser = function(email, password) {
    state.user.isLoggedIn = true;
    state.user.email = email;
    state.user.balances.USDT = 12500.00;
    saveState();
    updateHeaderAuthUI();
    window.location.hash = '#wallet';
}

window.logoutUser = function() {
    state.user.isLoggedIn = false;
    state.user.email = '';
    saveState();
    updateHeaderAuthUI();
    window.location.hash = '#home';
}

function updateHeaderAuthUI() {
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userEmailText = document.getElementById('dropdown-user-email');
    
    if (state.user.isLoggedIn) {
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        userEmailText.textContent = state.user.email;
        updateHeaderBalance();
    } else {
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
    }
}

window.updateHeaderBalance = function() {
    if (!state.user.isLoggedIn) return;
    
    // Estimate total balance in USD
    let totalUSD = state.user.balances.USDT;
    for (const [symbol, amount] of Object.entries(state.user.balances)) {
        if (symbol === 'USDT') continue;
        const pair = `${symbol}/USDT`;
        if (state.tickers[pair]) {
            totalUSD += amount * state.tickers[pair].price;
        }
    }
    
    document.getElementById('header-balance-val').textContent = `$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// --- STATE PERSISTENCE ---
function saveState() {
    localStorage.setItem('binance_clone_state', JSON.stringify({
        user: state.user,
        favorites: state.favorites,
        openOrders: state.openOrders,
        orderHistory: state.orderHistory,
        p2pOrders: state.p2pOrders,
        theme: state.theme
    }));
}

function loadState() {
    const saved = localStorage.getItem('binance_clone_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.user = parsed.user || state.user;
            state.favorites = parsed.favorites || state.favorites;
            state.openOrders = parsed.openOrders || state.openOrders;
            state.orderHistory = parsed.orderHistory || state.orderHistory;
            state.p2pOrders = parsed.p2pOrders || state.p2pOrders;
            state.theme = parsed.theme || state.theme;
        } catch (e) {
            console.error('Error loading local state', e);
        }
    }
}

// --- REAL-TIME MARKET SIMULATOR ---
function startPriceSimulation() {
    setInterval(() => {
        const affectedPairs = [];
        
        for (const [pair, info] of Object.entries(state.tickers)) {
            // 70% chance of price fluctuation
            if (Math.random() > 0.3) {
                const percent = (Math.random() - 0.495) * 0.002; // Small bias or slight fluctuation (-0.09% to +0.1%)
                const oldPrice = info.price;
                const newPrice = oldPrice * (1 + percent);
                
                info.price = newPrice;
                info.change24h += percent * 100;
                
                // Track 24h high/low limits
                if (newPrice > info.high24h) info.high24h = newPrice;
                if (newPrice < info.low24h) info.low24h = newPrice;
                
                affectedPairs.push({
                    pair,
                    price: newPrice,
                    change24h: info.change24h,
                    isUp: newPrice >= oldPrice
                });
            }
        }
        
        // Dispatch custom event for active renders to update selectively
        if (affectedPairs.length > 0) {
            const event = new CustomEvent('tickerUpdate', { detail: affectedPairs });
            window.dispatchEvent(event);
            
            // Perform live updates depending on current page view
            if (state.currentRoute === 'markets' && typeof window.updateMarketsLive === 'function') {
                window.updateMarketsLive(affectedPairs);
            } else if (state.currentRoute === 'trade' && typeof window.updateTradeLive === 'function') {
                window.updateTradeLive(affectedPairs);
            }
            updateHeaderBalance();
        }
    }, 1500);
}

// --- CLIENT-SIDE ROUTER ---
const routes = {
    'home': { render: (params) => window.renderHome(params), init: (params) => window.initHome(params) },
    'markets': { render: (params) => window.renderMarkets(params), init: (params) => window.initMarkets(params) },
    'trade': { render: (params) => window.renderTrade(params), init: (params) => window.initTrade(params) },
    'wallet': { render: (params) => window.renderWallet(params), init: (params) => window.initWallet(params) },
    'p2p': { render: (params) => window.renderP2P(params), init: (params) => window.initP2P(params) },
    'auth': { render: (params) => window.renderAuth(params), init: (params) => window.initAuth(params) }
};

function router() {
    let hash = window.location.hash.slice(1) || 'home';
    
    // Parse query params if any (e.g. #auth?tab=register)
    let params = {};
    if (hash.includes('?')) {
        const parts = hash.split('?');
        hash = parts[0];
        const rawParams = parts[1].split('&');
        rawParams.forEach(p => {
            const kv = p.split('=');
            params[kv[0]] = kv[1];
        });
    }
    
    // Redirect / default handling
    if (!routes[hash]) {
        hash = 'home';
    }
    
    // If not logged in, redirect wallet to auth
    if (hash === 'wallet' && !state.user.isLoggedIn) {
        window.location.hash = '#auth';
        return;
    }
    
    state.currentRoute = hash;
    
    // Update Header Active Class
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNavItem = document.getElementById(`nav-${hash}`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Render view
    const appContent = document.getElementById('app-content');
    
    // Fade transition
    appContent.classList.remove('fade-in');
    void appContent.offsetWidth; // Trigger reflow
    appContent.innerHTML = routes[hash].render(params);
    appContent.classList.add('fade-in');
    
    // Run component specific JS logic after render
    routes[hash].init(params);
    
    // Initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// --- SETUP AND LISTENERS ---
function initApp() {
    // 1. Load data
    loadState();
    
    // 2. Setup theme
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            saveState();
        });
    }
    
    // 3. User logout button hook
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
    
    // 4. Register routing changes
    window.addEventListener('hashchange', router);
    
    // 5. Initialize auth UI
    updateHeaderAuthUI();
    
    // 6. Run router for initial hash
    router();
    
    // 7. Start ticker updates
    startPriceSimulation();
    
    // 8. Setup global search box
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                // Redirect to markets page with search parameter
                window.location.hash = `#markets?search=${encodeURIComponent(searchInput.value.trim())}`;
                searchInput.value = '';
            }
        });
    }
}

// Run initial configurations
window.addEventListener('DOMContentLoaded', initApp);
