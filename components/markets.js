/* ============================================
   GK EXCHANGE - Markets Component
   components/markets.js
   ============================================ */

var _marketActiveCategory = 'all';
var _marketSearchQuery = '';

window.renderMarkets = function(container, params) {
    if (params && params.search) {
        _marketSearchQuery = decodeURIComponent(params.search).toUpperCase();
    }

    var coinMeta = {
        'BTC': { name: 'Bitcoin', color: '#f7931a', cat: ['l1'] },
        'ETH': { name: 'Ethereum', color: '#627eea', cat: ['l1', 'defi'] },
        'BNB': { name: 'BNB', color: '#f0b90b', cat: ['l1'] },
        'SOL': { name: 'Solana', color: '#9945ff', cat: ['l1'] },
        'XRP': { name: 'XRP', color: '#00aae4', cat: ['l1'] },
        'ADA': { name: 'Cardano', color: '#3cc8c8', cat: ['l1'] },
        'DOT': { name: 'Polkadot', color: '#e6007a', cat: ['l1', 'defi'] },
        'DOGE': { name: 'Dogecoin', color: '#c2a633', cat: ['meme'] },
        'AVAX': { name: 'Avalanche', color: '#e84142', cat: ['l1', 'defi'] },
        'LTC': { name: 'Litecoin', color: '#bfbbbb', cat: ['l1'] }
    };

    container.innerHTML = `
        <div class="markets-container" style="max-width:1280px;margin:0 auto;padding:40px 24px;">
            <div class="markets-header-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px;">
                <div>
                    <h1 style="font-family:var(--font-heading);font-size:32px;font-weight:900;">Markets Overview</h1>
                    <p style="color:var(--text-secondary);font-size:14px;margin-top:4px;">Real-time cryptocurrency prices, volume, and 24h market performance</p>
                </div>
                <div class="markets-nav-bar" style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="market-tab-btn ${_marketActiveCategory === 'all' ? 'active' : ''}" data-cat="all">All Cryptos</button>
                    <button class="market-tab-btn ${_marketActiveCategory === 'favorites' ? 'active' : ''}" data-cat="favorites">⭐ Favorites</button>
                    <button class="market-tab-btn ${_marketActiveCategory === 'l1' ? 'active' : ''}" data-cat="l1">Layer 1</button>
                    <button class="market-tab-btn ${_marketActiveCategory === 'defi' ? 'active' : ''}" data-cat="defi">DeFi</button>
                    <button class="market-tab-btn ${_marketActiveCategory === 'meme' ? 'active' : ''}" data-cat="meme">Meme</button>
                    <button class="market-tab-btn ${_marketActiveCategory === 'gainers' ? 'active' : ''}" data-cat="gainers">🔥 Top Gainers</button>
                </div>
            </div>

            <div class="markets-table-card" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:24px;box-shadow:var(--shadow-md);">
                <div class="table-filter-bar" style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
                    <div class="market-search-box" style="display:flex;align-items:center;background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:8px 14px;gap:8px;min-width:260px;">
                        <i data-lucide="search" style="width:16px;height:16px;color:var(--text-muted);"></i>
                        <input type="text" id="market-search-input" placeholder="Search symbol or name..." value="${_marketSearchQuery}" style="font-size:13px;width:100%;color:var(--text-primary);">
                    </div>
                    <div style="font-size:12px;color:var(--text-muted);">
                        Showing live WebSocket prices (updated every 1.2s)
                    </div>
                </div>

                <div class="market-table-container" style="overflow-x:auto;">
                    <table class="market-table" style="width:100%;border-collapse:collapse;font-size:13px;">
                        <thead>
                            <tr style="border-bottom:1px solid var(--border-light);text-align:left;color:var(--text-muted);font-size:11px;text-transform:uppercase;">
                                <th style="width: 44px; padding:12px 10px;"></th>
                                <th style="padding:12px 14px;">Name</th>
                                <th style="padding:12px 14px;">Price</th>
                                <th style="padding:12px 14px;">24h Change</th>
                                <th style="padding:12px 14px;">24h High</th>
                                <th style="padding:12px 14px;">24h Low</th>
                                <th style="padding:12px 14px;">24h Volume</th>
                                <th style="padding:12px 14px;text-align:right;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="markets-tbody">
                            <!-- Injected by script -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    function renderMarketRows() {
        const tbody = document.getElementById('markets-tbody');
        if (!tbody) return;

        const pairs = Object.keys(state.tickers);
        const filtered = pairs.filter(function(pair) {
            const tk = state.tickers[pair];
            const base = pair.replace('USDT', '');
            const meta = coinMeta[base] || { name: base, color: '#f0b90b', cat: [] };
            
            // Search query filter
            if (_marketSearchQuery) {
                const q = _marketSearchQuery.toLowerCase();
                if (!pair.toLowerCase().includes(q) && !meta.name.toLowerCase().includes(q) && !base.toLowerCase().includes(q)) {
                    return false;
                }
            }

            // Category filter
            if (_marketActiveCategory === 'favorites') {
                return (state.favorites || []).includes(pair);
            } else if (_marketActiveCategory === 'l1') {
                return (meta.cat || []).includes('l1');
            } else if (_marketActiveCategory === 'defi') {
                return (meta.cat || []).includes('defi');
            } else if (_marketActiveCategory === 'meme') {
                return (meta.cat || []).includes('meme');
            } else if (_marketActiveCategory === 'gainers') {
                return tk.change > 0;
            }

            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="padding: 50px 20px; text-align: center; color: var(--text-secondary);">
                        <i data-lucide="inbox" style="width:36px;height:36px;margin-bottom:8px;opacity:0.5;"></i>
                        <div>No trading pairs found matching your criteria.</div>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        tbody.innerHTML = filtered.map(function(pair) {
            const tk = state.tickers[pair];
            const base = pair.replace('USDT', '');
            const meta = coinMeta[base] || { name: base, color: '#f0b90b' };
            const isFav = (state.favorites || []).includes(pair);
            const isUp = tk.change >= 0;
            const sign = isUp ? '+' : '';
            const colorClass = isUp ? 'text-green' : 'text-red';
            const priceFormatted = '$' + formatNum(tk.price, tk.price < 1 ? 4 : 2);
            const highFormatted = '$' + formatNum(tk.high, tk.high < 1 ? 4 : 2);
            const lowFormatted = '$' + formatNum(tk.low, tk.low < 1 ? 4 : 2);
            const volUSDFormatted = tk.volUSD ? ('$' + (tk.volUSD / 1e6).toFixed(1) + 'M') : ('$' + formatNum(tk.vol * tk.price));

            return `
                <tr style="border-bottom:1px solid var(--border-light);cursor:pointer;transition:background var(--transition-fast);" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='transparent'" onclick="state.currentPair='${pair}';navigate('trade');">
                    <td style="padding:14px 10px;" onclick="event.stopPropagation();">
                        <button class="btn-toggle-fav" data-pair="${pair}" style="background:none;border:none;cursor:pointer;font-size:16px;line-height:1;" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                            ${isFav ? '⭐' : '☆'}
                        </button>
                    </td>
                    <td style="padding:14px;">
                        <div class="coin-cell" style="display:flex;align-items:center;gap:10px;">
                            <div class="coin-icon" style="background:${meta.color}22;color:${meta.color};width:32px;height:32px;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;">
                                ${base.substring(0,2)}
                            </div>
                            <div>
                                <div style="font-weight:700;font-size:14px;color:var(--text-primary);">${base}<span style="color:var(--text-muted);font-size:12px;">/USDT</span></div>
                                <div style="font-size:11px;color:var(--text-secondary);">${meta.name}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding:14px;font-weight:700;font-family:var(--font-heading);" id="mk-price-${pair}">
                        ${priceFormatted}
                    </td>
                    <td style="padding:14px;font-weight:700;" class="${colorClass}" id="mk-change-${pair}">
                        ${sign}${tk.change.toFixed(2)}%
                    </td>
                    <td style="padding:14px;color:var(--text-secondary);" id="mk-high-${pair}">
                        ${highFormatted}
                    </td>
                    <td style="padding:14px;color:var(--text-secondary);" id="mk-low-${pair}">
                        ${lowFormatted}
                    </td>
                    <td style="padding:14px;color:var(--text-secondary);" id="mk-vol-${pair}">
                        ${volUSDFormatted}
                    </td>
                    <td style="padding:14px;text-align:right;" onclick="event.stopPropagation();">
                        <button class="action-btn-sm" style="background:var(--primary);color:var(--text-on-gold);font-weight:700;padding:6px 16px;border-radius:var(--radius-sm);font-size:12px;" onclick="state.currentPair='${pair}';navigate('trade');">
                            Trade
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Wire favorite buttons
        document.querySelectorAll('.btn-toggle-fav').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var p = btn.getAttribute('data-pair');
                if (!Array.isArray(state.favorites)) state.favorites = [];
                var idx = state.favorites.indexOf(p);
                if (idx > -1) {
                    state.favorites.splice(idx, 1);
                    showToast('Removed ' + p + ' from favorites', 'info');
                } else {
                    state.favorites.push(p);
                    showToast('Added ' + p + ' to favorites ⭐', 'success');
                }
                saveState();
                renderMarketRows();
            });
        });

        if (window.lucide) lucide.createIcons();
    }

    // Category button clicks
    document.querySelectorAll('.market-tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.market-tab-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            _marketActiveCategory = btn.getAttribute('data-cat');
            renderMarketRows();
        });
    });

    // Search input
    const searchInput = document.getElementById('market-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            _marketSearchQuery = e.target.value.trim();
            renderMarketRows();
        });
    }

    // Real-time price updates
    window.addEventListener('tickerUpdate', function marketTickerHandler(e) {
        if (!document.getElementById('markets-tbody')) {
            window.removeEventListener('tickerUpdate', marketTickerHandler);
            return;
        }
        var pair = e.detail.pair;
        var pEl = document.getElementById('mk-price-' + pair);
        var cEl = document.getElementById('mk-change-' + pair);
        if (pEl && cEl) {
            var isUp = e.detail.price >= e.detail.prevPrice;
            pEl.textContent = '$' + formatNum(e.detail.price, e.detail.price < 1 ? 4 : 2);
            cEl.textContent = (e.detail.ticker.change >= 0 ? '+' : '') + e.detail.ticker.change.toFixed(2) + '%';
            cEl.className = e.detail.ticker.change >= 0 ? 'text-green' : 'text-red';

            pEl.classList.remove('flash-green-anim', 'flash-red-anim');
            void pEl.offsetWidth;
            pEl.classList.add(isUp ? 'flash-green-anim' : 'flash-red-anim');
        }
    });

    renderMarketRows();
};
