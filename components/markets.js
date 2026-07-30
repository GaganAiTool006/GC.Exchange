let activeCategory = 'all';
let searchQuery = '';

window.renderMarkets = function(params) {
    // Check if query parameters passed search term
    if (params && params.search) {
        searchQuery = decodeURIComponent(params.search).toUpperCase();
    } else {
        searchQuery = '';
    }
    
    return `
        <div class="markets-container">
            <div class="markets-header-row">
                <h1>Markets Overview</h1>
                <div class="markets-nav-bar">
                    <button class="market-tab-btn ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">All Cryptos</button>
                    <button class="market-tab-btn ${activeCategory === 'favorites' ? 'active' : ''}" data-cat="favorites"><i data-lucide="star" style="width: 12px; height: 12px; display: inline; vertical-align: middle;"></i> Favorites</button>
                    <button class="market-tab-btn ${activeCategory === 'l1' ? 'active' : ''}" data-cat="l1">Layer 1</button>
                    <button class="market-tab-btn ${activeCategory === 'defi' ? 'active' : ''}" data-cat="defi">DeFi</button>
                    <button class="market-tab-btn ${activeCategory === 'meme' ? 'active' : ''}" data-cat="meme">Meme</button>
                </div>
            </div>

            <div class="markets-table-card">
                <div class="table-filter-bar">
                    <div class="market-search-box">
                        <i data-lucide="search"></i>
                        <input type="text" id="market-search-input" placeholder="Search symbol or name..." value="${searchQuery}">
                    </div>
                </div>

                <div class="market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;"></th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>24h Change</th>
                                <th>24h High</th>
                                <th>24h Low</th>
                                <th>24h Volume</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="markets-tbody">
                            <!-- Rows will be injected here by script -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

window.initMarkets = function(params) {
    activeCategory = 'all';
    
    // Wire tab buttons
    document.querySelectorAll('.market-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.market-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.cat;
            renderMarketRows();
        });
    });

    // Wire search input
    const searchInput = document.getElementById('market-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toUpperCase();
            renderMarketRows();
        });
    }

    renderMarketRows();
}

function getFilteredPairs() {
    const allTickers = Object.entries(state.tickers);
    
    return allTickers.filter(([pair, info]) => {
        // 1. Search Query Filter
        const matchesSearch = pair.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              info.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // 2. Category Filter
        if (activeCategory === 'favorites') {
            return state.favorites.includes(pair);
        } else if (activeCategory === 'l1') {
            // Layer 1 tags
            return ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOT'].includes(info.symbol);
        } else if (activeCategory === 'defi') {
            // DeFi mock tags
            return ['ETH', 'DOT'].includes(info.symbol);
        } else if (activeCategory === 'meme') {
            return ['DOGE'].includes(info.symbol);
        }
        
        return true;
    });
}

function renderMarketRows() {
    const tbody = document.getElementById('markets-tbody');
    if (!tbody) return;

    const filtered = getFilteredPairs();
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 40px; text-align: center; color: var(--text-secondary);">
                    No trading pairs match your search criteria.
                </td>
            </tr>
        `;
        return;
    }

    let rowsHTML = '';
    filtered.forEach(([pair, info]) => {
        const isFav = state.favorites.includes(pair);
        const isPositive = info.change24h >= 0;
        const sign = isPositive ? '+' : '';
        const classColor = isPositive ? 'text-green' : 'text-red';
        
        rowsHTML += `
            <tr onclick="window.location.hash='#trade?pair=${info.symbol}/USDT'" style="cursor: pointer;">
                <td onclick="event.stopPropagation();">
                    <i data-lucide="star" class="favorite-star ${isFav ? 'active' : ''}" data-pair="${pair}" style="fill: ${isFav ? 'var(--primary)' : 'none'}; width: 16px; height: 16px;"></i>
                </td>
                <td>
                    <div class="coin-cell">
                        <div class="coin-icon" style="background-color: ${info.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: #000;">
                            ${info.symbol[0]}
                        </div>
                        <div>
                            <span class="coin-symbol">${info.symbol}/USDT</span>
                            <span class="coin-name">${info.name}</span>
                        </div>
                    </div>
                </td>
                <td id="markets-price-${info.symbol}" class="ticker-val-cell">$${info.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                <td id="markets-change-${info.symbol}" class="${classColor}">${sign}${info.change24h.toFixed(2)}%</td>
                <td>$${info.high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>$${info.low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>$${(info.volume24h * info.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>
                    <button class="action-btn-sm" onclick="event.stopPropagation(); window.location.hash='#trade?pair=${info.symbol}/USDT'">Trade</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = rowsHTML;
    
    // Wire favorites click events
    document.querySelectorAll('.favorite-star').forEach(star => {
        star.addEventListener('click', (e) => {
            const pair = star.dataset.pair;
            const index = state.favorites.indexOf(pair);
            if (index > -1) {
                state.favorites.splice(index, 1);
                star.classList.remove('active');
                star.style.fill = 'none';
            } else {
                state.favorites.push(pair);
                star.classList.add('active');
                star.style.fill = 'var(--primary)';
            }
            
            // Save state
            localStorage.setItem('binance_clone_state', JSON.stringify({
                user: state.user,
                favorites: state.favorites,
                openOrders: state.openOrders,
                orderHistory: state.orderHistory,
                p2pOrders: state.p2pOrders,
                theme: state.theme
            }));
            
            // Re-render if we are in favorites category
            if (activeCategory === 'favorites') {
                renderMarketRows();
            }
        });
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Live update function triggered from app.js price updates
window.updateMarketsLive = function(changes) {
    changes.forEach(change => {
        const symbolOnly = change.pair.split('/')[0];
        
        // Update price cell
        const priceCell = document.getElementById(`markets-price-${symbolOnly}`);
        const changeCell = document.getElementById(`markets-change-${symbolOnly}`);
        
        if (priceCell && changeCell) {
            priceCell.textContent = `$${change.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
            
            const isPositive = change.change24h >= 0;
            const sign = isPositive ? '+' : '';
            changeCell.textContent = `${sign}${change.change24h.toFixed(2)}%`;
            changeCell.className = isPositive ? 'text-green' : 'text-red';

            // Flash glow classes
            priceCell.classList.remove('flash-green-anim', 'flash-red-anim');
            void priceCell.offsetWidth; // trigger reflow
            priceCell.classList.add(change.isUp ? 'flash-green-anim' : 'flash-red-anim');
        }
    });
}
