/* ============================================
   GK EXCHANGE - Home Component
   components/home.js
   ============================================ */

window.renderHome = function(container) {
    var t = state.tickers;
    var topPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];

    function tickerCard(pair) {
        var tk = t[pair];
        if (!tk) return '';
        var isUp = tk.change >= 0;
        var base = pair.replace('USDT', '');
        var coinColors = { BTC: '#f7931a', ETH: '#627eea', BNB: '#f0b90b', SOL: '#9945ff', XRP: '#00aae4', ADA: '#3cc8c8', DOGE: '#c2a633', DOT: '#e6007a', AVAX: '#e84142', LTC: '#bfbbbb' };
        var color = coinColors[base] || 'var(--primary)';
        return '<div class="ticker-card" id="home-ticker-' + pair + '" onclick="navigate(\'trade\')" style="cursor:pointer;">' +
            '<div class="ticker-header">' +
                '<div class="coin-cell">' +
                    '<div class="coin-icon" style="background:' + color + '22;color:' + color + ';">' + base.substring(0,2) + '</div>' +
                    '<div class="coin-symbol">' + base + '</div>' +
                '</div>' +
                '<span class="ticker-change ' + (isUp ? 'positive' : 'negative') + '">' + (isUp ? '+' : '') + tk.change.toFixed(2) + '%</span>' +
            '</div>' +
            '<div class="ticker-price" id="ht-price-' + pair + '" style="color:' + (isUp ? 'var(--green)' : 'var(--red)') + ';">$' + formatNum(tk.price) + '</div>' +
            '<div class="ticker-vol">Vol: $' + (tk.volUSD ? (tk.volUSD / 1e6).toFixed(1) + 'M' : '--') + '</div>' +
        '</div>';
    }

    function marketRow(pair, idx) {
        var tk = t[pair];
        if (!tk) return '';
        var isUp = tk.change >= 0;
        var base = pair.replace('USDT', '');
        var coinColors = { BTC: '#f7931a', ETH: '#627eea', BNB: '#f0b90b', SOL: '#9945ff', XRP: '#00aae4', ADA: '#3cc8c8', DOGE: '#c2a633', DOT: '#e6007a', AVAX: '#e84142', LTC: '#bfbbbb' };
        var color = coinColors[base] || 'var(--primary)';
        return '<tr>' +
            '<td>' + (idx + 1) + '</td>' +
            '<td><div class="coin-cell"><div class="coin-icon" style="background:' + color + '22;color:' + color + ';">' + base.substring(0,2) + '</div><div><div class="coin-symbol">' + base + '/USDT</div><div class="coin-name">Market Cap Rank</div></div></div></td>' +
            '<td style="font-weight:700;color:' + (isUp ? 'var(--green)' : 'var(--red)') + ';">$' + formatNum(tk.price) + '</td>' +
            '<td class="' + (isUp ? 'text-green' : 'text-red') + '" style="font-weight:700;">' + (isUp ? '+' : '') + tk.change.toFixed(2) + '%</td>' +
            '<td>$' + (tk.volUSD ? (tk.volUSD / 1e6).toFixed(1) + 'M' : '--') + '</td>' +
            '<td><button class="action-btn-sm" onclick="event.stopPropagation();state.currentPair=\'' + pair + '\';navigate(\'trade\')">Trade</button></td>' +
        '</tr>';
    }

    container.innerHTML =
        '<div class="home-container">' +
        // Hero
        '<section class="hero-section">' +
            '<div class="hero-text">' +
                '<h1>Trade <span class="gradient-text">Crypto</span><br>Like a <span class="gold">Pro</span></h1>' +
                '<p>GK Exchange gives you professional-grade trading tools, institutional security, and the lowest fees in India. Join 2M+ traders today.</p>' +
                '<div class="hero-ctas">' +
                    (state.isLoggedIn ?
                        '<a href="#trade" class="btn-primary-hero">Open Trade Terminal</a><a href="#wallet" class="btn-secondary-hero">View Portfolio</a>' :
                        '<a href="#auth?tab=register" class="btn-primary-hero">Start Trading Free</a><a href="#markets" class="btn-secondary-hero">View Markets</a>'
                    ) +
                '</div>' +
                '<div class="hero-stats">' +
                    '<div class="hero-stat-item"><span class="hero-stat-num">₹2.4T+</span><span class="hero-stat-label">24h Trading Volume</span></div>' +
                    '<div class="hero-stat-item"><span class="hero-stat-num">350+</span><span class="hero-stat-label">Cryptocurrencies</span></div>' +
                    '<div class="hero-stat-item"><span class="hero-stat-num">0.1%</span><span class="hero-stat-label">Maker/Taker Fee</span></div>' +
                '</div>' +
            '</div>' +
            '<div class="quick-swap-card">' +
                '<h3>⚡ Quick Swap</h3>' +
                '<div class="swap-input-group">' +
                    '<div><label>You Pay</label><input type="number" id="swap-from" value="1000" style="width:110px;"></div>' +
                    '<div class="token-select"><select id="swap-from-token"><option>USDT</option><option>BTC</option><option>ETH</option><option>BNB</option></select></div>' +
                '</div>' +
                '<div class="swap-divider"><button class="btn-swap-arrow" onclick="swapTokens()"><i data-lucide="arrow-up-down"></i></button></div>' +
                '<div class="swap-input-group">' +
                    '<div><label>You Get</label><input type="number" id="swap-to" value="' + (1000 / t.BTCUSDT.price).toFixed(6) + '" readonly style="width:110px;"></div>' +
                    '<div class="token-select"><select id="swap-to-token"><option>BTC</option><option>ETH</option><option>BNB</option><option>SOL</option></select></div>' +
                '</div>' +
                '<div class="swap-rate-info"><span>1 BTC = $' + formatNum(t.BTCUSDT.price) + '</span><span>Fee: 0.1%</span></div>' +
                '<button class="btn-swap-action" onclick="handleSwap()">Swap Now</button>' +
            '</div>' +
        '</section>' +

        // Ticker Cards
        '<section style="margin-bottom:48px;">' +
            '<div class="section-heading">' +
                '<h2>🔥 Top Movers</h2>' +
                '<a href="#markets" class="view-all-link">View All <i data-lucide="chevron-right" style="width:14px;height:14px;"></i></a>' +
            '</div>' +
            '<div class="ticker-cards-row">' + topPairs.map(tickerCard).join('') + '</div>' +
        '</section>' +

        // Market Preview
        '<section style="margin-bottom:48px;">' +
            '<div class="section-heading"><h2>📊 Market Overview</h2><a href="#markets" class="view-all-link">View All Markets</a></div>' +
            '<div class="market-preview-section">' +
                '<div class="market-table-container">' +
                    '<table class="market-table">' +
                        '<thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h Change</th><th>Volume</th><th>Action</th></tr></thead>' +
                        '<tbody>' + Object.keys(t).slice(0, 6).map(function(p, i) { return marketRow(p, i); }).join('') + '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>' +
        '</section>' +

        // Features
        '<section class="features-section">' +
            '<div class="section-heading"><h2>Why GK Exchange?</h2></div>' +
            '<div class="features-grid">' +
                featureCard('shield-check', 'Military-grade Security', 'SAFU fund with $1B insurance coverage. Cold storage, 2FA, anti-phishing codes and biometric login protect your assets 24/7.') +
                featureCard('zap', 'Ultra-Low Latency', 'Our matching engine processes 1.4 million orders per second with sub-millisecond execution for spot, futures, and options.') +
                featureCard('trending-up', 'Advanced Trading Tools', 'Professional candlestick charts, 100+ indicators, order books, depth charts, and algorithmic trading via API.') +
                featureCard('users', 'P2P Trading Hub', 'Trade directly with 50,000+ verified merchants. 0 fees, 1000+ payment methods including UPI, NEFT, IMPS, and more.') +
                featureCard('globe', 'Global Liquidity', 'Deep liquidity pools with tight spreads. Access institutional-grade liquidity on 350+ trading pairs round the clock.') +
                featureCard('phone', 'Mobile-First Design', 'Trade anywhere with our award-winning mobile apps. Full terminal features in the palm of your hand.') +
            '</div>' +
        '</section>' +

        // CTA Banner
        (state.isLoggedIn ? '' :
        '<section style="margin-bottom:60px;">' +
            '<div style="background:linear-gradient(135deg,#1a1505 0%,var(--bg-card) 50%,#1a1505 100%);border:1px solid var(--border-gold);border-radius:var(--radius-xl);padding:48px;text-align:center;box-shadow:var(--shadow-gold);">' +
                '<h2 style="font-family:var(--font-heading);font-size:36px;font-weight:900;margin-bottom:16px;">Ready to Start Trading?</h2>' +
                '<p style="color:var(--text-secondary);font-size:16px;margin-bottom:28px;max-width:500px;margin-left:auto;margin-right:auto;">Join 2 million+ traders on GK Exchange. Get started in under 2 minutes.</p>' +
                '<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">' +
                    '<a href="#auth?tab=register" class="btn-primary-hero">Create Free Account</a>' +
                    '<a href="#markets" class="btn-secondary-hero">Explore Markets</a>' +
                '</div>' +
            '</div>' +
        '</section>') +
        '</div>';

    // Live price updates
    window.addEventListener('tickerUpdate', function homeTickerHandler(e) {
        if (!document.getElementById('app-content')) { window.removeEventListener('tickerUpdate', homeTickerHandler); return; }
        var pair = e.detail.pair;
        var el = document.getElementById('ht-price-' + pair);
        if (el) {
            var isUp = e.detail.price >= e.detail.prevPrice;
            el.textContent = '$' + formatNum(e.detail.price);
            el.style.color = isUp ? 'var(--green)' : 'var(--red)';
            el.classList.remove('flash-green-anim', 'flash-red-anim');
            void el.offsetWidth;
            el.classList.add(isUp ? 'flash-green-anim' : 'flash-red-anim');
        }
    });

    if (window.lucide) lucide.createIcons();
};

function featureCard(icon, title, desc) {
    return '<div class="feature-card">' +
        '<div class="feature-icon"><i data-lucide="' + icon + '"></i></div>' +
        '<h3>' + title + '</h3>' +
        '<p>' + desc + '</p>' +
    '</div>';
}

window.swapTokens = function() {
    var fromTk = document.getElementById('swap-from-token');
    var toTk = document.getElementById('swap-to-token');
    if (!fromTk || !toTk) return;
    var tmp = fromTk.value;
    fromTk.value = toTk.value;
    toTk.value = tmp;
    updateSwapRate();
};

window.updateSwapRate = function() {
    var fromVal = parseFloat(document.getElementById('swap-from').value) || 0;
    var fromTk = document.getElementById('swap-from-token') ? document.getElementById('swap-from-token').value : 'USDT';
    var toTk = document.getElementById('swap-to-token') ? document.getElementById('swap-to-token').value : 'BTC';
    var fromPair = fromTk + 'USDT';
    var toPair = toTk + 'USDT';
    var fromUSD = fromTk === 'USDT' ? fromVal : (state.tickers[fromPair] ? fromVal * state.tickers[fromPair].price : fromVal);
    var toPrice = toTk === 'USDT' ? 1 : (state.tickers[toPair] ? state.tickers[toPair].price : 1);
    var toEl = document.getElementById('swap-to');
    if (toEl) toEl.value = ((fromUSD / toPrice) * 0.999).toFixed(toTk === 'USDT' ? 2 : 6);
};

window.handleSwap = function() {
    if (!state.isLoggedIn) { navigate('auth'); return; }
    showToast('Swap executed successfully! ✅', 'success');
};

document.addEventListener('input', function(e) {
    if (e.target && (e.target.id === 'swap-from' || e.target.id === 'swap-from-token' || e.target.id === 'swap-to-token')) {
        updateSwapRate();
    }
});
