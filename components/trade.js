/* ============================================
   GK EXCHANGE - Trade Component (with Canvas Chart)
   components/trade.js
   ============================================ */

var _chartCandles = [];
var _chartTimeframe = '1H';
var _chartInterval = null;
var _chartPair = null;
var _chartCanvas = null;
var _chartCtx = null;
var _tradeOrderBook = { asks: [], bids: [] };
var _tradeHistory = [];
var _activeOrderTab = 'openOrders';
var _chartDrawRAF = null;

// ============ CANVAS CHART ============
function generateCandles(pair, count) {
    var candles = [];
    var tk = state.tickers[pair];
    var basePrice = tk ? tk.price : 50000;
    var vol = basePrice * 0.008;
    var now = Date.now();
    var tfMs = { '1m': 60000, '5m': 300000, '15m': 900000, '1H': 3600000, '4H': 14400000, '1D': 86400000 };
    var ms = tfMs[_chartTimeframe] || 3600000;
    for (var i = count - 1; i >= 0; i--) {
        var open = basePrice + (Math.random() - 0.5) * vol * 4;
        var close = open + (Math.random() - 0.48) * vol * 3;
        var high = Math.max(open, close) + Math.random() * vol * 1.5;
        var low = Math.min(open, close) - Math.random() * vol * 1.5;
        candles.push({
            time: now - i * ms,
            open: parseFloat(open.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            volume: Math.random() * 20 + 5
        });
        basePrice = close;
    }
    return candles;
}

function addCandle() {
    if (!_chartCandles.length) return;
    var last = _chartCandles[_chartCandles.length - 1];
    var prevClose = last.close;
    var vol = prevClose * 0.003;
    var moveDir = Math.random() > 0.5 ? 1 : -1;
    var newClose = prevClose + moveDir * (Math.random() * vol);
    var newHigh = Math.max(last.high, newClose + Math.random() * vol * 0.5);
    var newLow = Math.min(last.low, newClose - Math.random() * vol * 0.5);
    // Update last candle in real time
    last.close = parseFloat(newClose.toFixed(2));
    last.high = parseFloat(newHigh.toFixed(2));
    last.low = parseFloat(newLow.toFixed(2));
    last.volume += Math.random() * 2;
}

function drawChart() {
    if (!_chartCanvas || !_chartCtx || !_chartCandles.length) return;
    var canvas = _chartCanvas;
    var ctx = _chartCtx;
    var W = canvas.width;
    var H = canvas.height;
    var volumeH = Math.floor(H * 0.18);
    var chartH = H - volumeH - 20;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0e1218';
    ctx.fillRect(0, 0, W, H);

    var visibleCount = Math.min(_chartCandles.length, Math.floor(W / 9));
    var candles = _chartCandles.slice(_chartCandles.length - visibleCount);
    if (!candles.length) return;

    var highs = candles.map(function(c) { return c.high; });
    var lows = candles.map(function(c) { return c.low; });
    var maxP = Math.max.apply(null, highs);
    var minP = Math.min.apply(null, lows);
    var priceRange = maxP - minP || 1;
    var vols = candles.map(function(c) { return c.volume; });
    var maxVol = Math.max.apply(null, vols) || 1;
    var padding = { left: 70, right: 60, top: 20, bottom: 10 };
    var cW = (W - padding.left - padding.right) / candles.length;
    var candleW = Math.max(1, cW * 0.65);

    function priceToY(price) {
        return padding.top + (1 - (price - minP) / priceRange) * chartH;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (var g = 0; g <= 5; g++) {
        var gy = padding.top + (g / 5) * chartH;
        ctx.beginPath(); ctx.moveTo(padding.left, gy); ctx.lineTo(W - padding.right, gy); ctx.stroke();
        var gridPrice = maxP - (g / 5) * priceRange;
        ctx.fillStyle = 'rgba(132,142,156,0.6)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('$' + formatNum(gridPrice, gridPrice > 100 ? 0 : 4), W - padding.right + 55, gy + 4);
    }

    // Volume bars (bottom)
    candles.forEach(function(c, i) {
        var x = padding.left + i * cW + (cW - candleW) / 2;
        var volBarH = (c.volume / maxVol) * volumeH * 0.85;
        var vy = H - volumeH + (volumeH - volBarH);
        ctx.fillStyle = c.close >= c.open ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)';
        ctx.fillRect(x, vy, candleW, volBarH);
    });

    // Candles
    candles.forEach(function(c, i) {
        var x = padding.left + i * cW;
        var cx = x + cW / 2;
        var isUp = c.close >= c.open;
        var color = isUp ? '#0ecb81' : '#f6465d';

        var openY = priceToY(c.open);
        var closeY = priceToY(c.close);
        var highY = priceToY(c.high);
        var lowY = priceToY(c.low);

        var bodyTop = Math.min(openY, closeY);
        var bodyH = Math.max(1, Math.abs(openY - closeY));
        var bx = x + (cW - candleW) / 2;

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, highY); ctx.lineTo(cx, bodyTop); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, bodyTop + bodyH); ctx.lineTo(cx, lowY); ctx.stroke();

        // Body
        if (isUp) {
            ctx.fillStyle = candleW > 3 ? color : 'transparent';
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.rect(bx, bodyTop, candleW, bodyH);
        ctx.fill();
        if (isUp && candleW > 3) ctx.stroke();
    });

    // Last price line
    var lastCandle = candles[candles.length - 1];
    if (lastCandle) {
        var lastY = priceToY(lastCandle.close);
        var isLastUp = lastCandle.close >= lastCandle.open;
        ctx.strokeStyle = isLastUp ? 'rgba(14,203,129,0.6)' : 'rgba(246,70,93,0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(padding.left, lastY); ctx.lineTo(W - padding.right, lastY); ctx.stroke();
        ctx.setLineDash([]);

        // Price tag
        ctx.fillStyle = isLastUp ? '#0ecb81' : '#f6465d';
        ctx.beginPath();
        ctx.roundRect(W - padding.right + 2, lastY - 9, 54, 18, 3);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('$' + formatNum(lastCandle.close, lastCandle.close > 100 ? 1 : 4), W - padding.right + 5, lastY + 4);
    }

    // Volume divider
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(padding.left, H - volumeH); ctx.lineTo(W - padding.right, H - volumeH); ctx.stroke();
}

function resizeChart() {
    if (!_chartCanvas) return;
    var parent = _chartCanvas.parentElement;
    if (!parent) return;
    _chartCanvas.width = parent.clientWidth;
    _chartCanvas.height = parent.clientHeight;
    drawChart();
}

function startChartAnimation() {
    if (_chartInterval) clearInterval(_chartInterval);
    _chartInterval = setInterval(function() {
        addCandle();
        if (_chartDrawRAF) cancelAnimationFrame(_chartDrawRAF);
        _chartDrawRAF = requestAnimationFrame(drawChart);
    }, 800);
}

// ============ ORDER BOOK ============
function generateOrderBook(pair) {
    var tk = state.tickers[pair];
    var basePrice = tk ? tk.price : 50000;
    var spread = basePrice * 0.0002;
    var asks = [], bids = [];
    for (var i = 0; i < 16; i++) {
        asks.push({ price: basePrice + spread * (i + 1) * (1 + Math.random() * 0.5), qty: +(Math.random() * 2.5 + 0.1).toFixed(4), total: 0 });
        bids.push({ price: basePrice - spread * (i + 1) * (1 + Math.random() * 0.5), qty: +(Math.random() * 3 + 0.1).toFixed(4), total: 0 });
    }
    asks.sort(function(a, b) { return a.price - b.price; });
    bids.sort(function(a, b) { return b.price - a.price; });
    asks.forEach(function(a, i) { a.total = asks.slice(0, i+1).reduce(function(s, x) { return s + x.qty; }, 0).toFixed(4); });
    bids.forEach(function(b, i) { b.total = bids.slice(0, i+1).reduce(function(s, x) { return s + x.qty; }, 0).toFixed(4); });
    return { asks: asks, bids: bids };
}

function updateOrderBook() {
    var ob = generateOrderBook(state.currentPair);
    _tradeOrderBook = ob;
    var askContainer = document.getElementById('ob-asks');
    var bidContainer = document.getElementById('ob-bids');
    if (!askContainer || !bidContainer) return;

    var maxAskQty = Math.max.apply(null, ob.asks.map(function(a) { return a.qty; }));
    var maxBidQty = Math.max.apply(null, ob.bids.map(function(b) { return b.qty; }));

    askContainer.innerHTML = ob.asks.slice(0, 12).reverse().map(function(a) {
        var w = (a.qty / maxAskQty * 100).toFixed(0);
        return '<div class="ob-row" onclick="setTradePrice(' + a.price.toFixed(2) + ')">' +
            '<span class="price-col text-red">' + formatNum(a.price, a.price < 1 ? 4 : 2) + '</span>' +
            '<span>' + a.qty + '</span>' +
            '<span>' + a.total + '</span>' +
            '<div class="depth-bar" style="width:' + w + '%;background:var(--red);"></div>' +
        '</div>';
    }).join('');

    bidContainer.innerHTML = ob.bids.slice(0, 12).map(function(b) {
        var w = (b.qty / maxBidQty * 100).toFixed(0);
        return '<div class="ob-row" onclick="setTradePrice(' + b.price.toFixed(2) + ')">' +
            '<span class="price-col text-green">' + formatNum(b.price, b.price < 1 ? 4 : 2) + '</span>' +
            '<span>' + b.qty + '</span>' +
            '<span>' + b.total + '</span>' +
            '<div class="depth-bar" style="width:' + w + '%;background:var(--green);"></div>' +
        '</div>';
    }).join('');
}

function generateTrade(pair) {
    var tk = state.tickers[pair];
    var p = tk ? tk.price : 50000;
    var isBuy = Math.random() > 0.48;
    return { price: p + (Math.random() - 0.5) * p * 0.001, qty: +(Math.random() * 2 + 0.01).toFixed(4), isBuy: isBuy, time: Date.now() };
}

function updateMarketTrades() {
    _tradeHistory.unshift(generateTrade(state.currentPair));
    if (_tradeHistory.length > 50) _tradeHistory.pop();
    var el = document.getElementById('market-trades-list');
    if (!el) return;
    el.innerHTML = _tradeHistory.slice(0, 24).map(function(tr) {
        var t = new Date(tr.time);
        return '<div class="mt-row">' +
            '<span class="price-col ' + (tr.isBuy ? 'text-green' : 'text-red') + '">' + formatNum(tr.price, tr.price < 1 ? 4 : 2) + '</span>' +
            '<span>' + tr.qty + '</span>' +
            '<span class="time-col">' + t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0') + ':' + t.getSeconds().toString().padStart(2,'0') + '</span>' +
        '</div>';
    }).join('');
}

// ============ RENDER TRADE ============
window.renderTrade = function(container) {
    _chartPair = state.currentPair;
    var tk = state.tickers[state.currentPair];
    var isUp = tk && tk.change >= 0;

    container.style.padding = '0';
    container.style.overflow = 'hidden';

    var pairOptions = Object.keys(state.tickers).map(function(p) {
        return '<option value="' + p + '" ' + (p === state.currentPair ? 'selected' : '') + '>' + p + '</option>';
    }).join('');

    container.innerHTML =
    '<div class="trade-container">' +
        // Tickers header bar
        '<div class="trade-tickers-header">' +
            '<div class="trade-current-pair">' +
                '<select id="pair-selector" onchange="changePair(this.value)">' + pairOptions + '</select>' +
            '</div>' +
            '<div class="trade-ticker-stat"><span class="label">Price</span><span class="value-price value ' + (isUp ? 'text-green' : 'text-red') + '" id="trade-header-price">' + (tk ? formatNum(tk.price) : '--') + '</span></div>' +
            '<div class="trade-ticker-stat"><span class="label">24h Change</span><span class="value ' + (isUp ? 'text-green' : 'text-red') + '" id="trade-header-change">' + (tk ? (isUp?'+':'') + tk.change.toFixed(2) + '%' : '--') + '</span></div>' +
            '<div class="trade-ticker-stat"><span class="label">24h High</span><span class="value" id="trade-header-high">' + (tk ? formatNum(tk.high) : '--') + '</span></div>' +
            '<div class="trade-ticker-stat"><span class="label">24h Low</span><span class="value" id="trade-header-low">' + (tk ? formatNum(tk.low) : '--') + '</span></div>' +
            '<div class="trade-ticker-stat"><span class="label">24h Volume</span><span class="value">' + (tk ? formatNum(tk.vol, 2) + ' ' + state.currentPair.replace('USDT','') : '--') + '</span></div>' +
        '</div>' +

        // Left Panel – Order Book
        '<div class="trade-panel left">' +
            '<div class="panel-header"><span>Order Book</span>' +
                '<div style="display:flex;gap:4px;">' +
                    '<button onclick="setObMode(\'both\')" class="chart-toolbar-btn active" id="ob-btn-both" title="Both">⠿</button>' +
                    '<button onclick="setObMode(\'bids\')" class="chart-toolbar-btn" id="ob-btn-bids" title="Bids">🟩</button>' +
                    '<button onclick="setObMode(\'asks\')" class="chart-toolbar-btn" id="ob-btn-asks" title="Asks">🟥</button>' +
                '</div>' +
            '</div>' +
            '<div class="ob-header"><span>Price(USDT)</span><span style="text-align:right;">Amount</span><span style="text-align:right;">Total</span></div>' +
            '<div class="orderbook-list">' +
                '<div id="ob-asks" style="color:var(--red);"></div>' +
                '<div class="ob-spread-row">' +
                    '<span class="ob-spread-price ' + (isUp ? 'text-green' : 'text-red') + '" id="ob-mid-price">' + (tk ? formatNum(tk.price) : '--') + '</span>' +
                    '<span class="ob-spread-val">Spread</span>' +
                    '<span class="ob-spread-val" id="ob-spread-val">--</span>' +
                '</div>' +
                '<div id="ob-bids" style="color:var(--green);"></div>' +
            '</div>' +
        '</div>' +

        // Center Panel - Chart + Forms
        '<div class="trade-center-panel">' +
            '<div class="trade-chart-section">' +
                '<div class="chart-toolbar">' +
                    ['1m','5m','15m','1H','4H','1D'].map(function(tf) {
                        return '<button class="chart-toolbar-btn' + (tf === _chartTimeframe ? ' active' : '') + '" onclick="setChartTimeframe(\'' + tf + '\')">' + tf + '</button>';
                    }).join('') +
                '</div>' +
                '<canvas id="gk-chart-canvas"></canvas>' +
            '</div>' +

            '<div class="trade-forms-section">' +
                '<div class="trade-forms-tabs">' +
                    '<button class="form-tab-btn active" id="ftab-limit" onclick="setFormTab(\'limit\')">Limit</button>' +
                    '<button class="form-tab-btn" id="ftab-market" onclick="setFormTab(\'market\')">Market</button>' +
                    '<button class="form-tab-btn" id="ftab-stopLimit" onclick="setFormTab(\'stopLimit\')">Stop-Limit</button>' +
                '</div>' +
                '<div class="trade-forms-grid">' +
                    // Buy Form
                    '<div class="trade-form">' +
                        '<div class="form-balance-row"><span style="color:var(--text-muted);">Avail.</span><span>' + formatNum(state.wallet.USDT) + ' USDT</span></div>' +
                        '<div class="trade-field-group"><div><label>Price</label><input type="number" id="buy-price" value="' + (tk ? tk.price.toFixed(2) : '0') + '"></div><span>USDT</span></div>' +
                        '<div class="trade-field-group"><div><label>Amount</label><input type="number" id="buy-amount" value="0.001"></div><span>' + state.currentPair.replace('USDT','') + '</span></div>' +
                        '<div class="slider-group">' +
                            ['25%','50%','75%','100%'].map(function(p) { return '<button class="slider-btn" onclick="setTradePercent(\'buy\',' + parseInt(p) + ')">' + p + '</button>'; }).join('') +
                        '</div>' +
                        '<div class="trade-field-group"><div><label>Total</label><input type="number" id="buy-total" readonly></div><span>USDT</span></div>' +
                        '<button class="btn-trade-execute buy-btn" onclick="executeTrade(\'buy\')">Buy ' + state.currentPair.replace('USDT','') + '</button>' +
                    '</div>' +
                    // Sell Form
                    '<div class="trade-form">' +
                        '<div class="form-balance-row"><span style="color:var(--text-muted);">Avail.</span><span>' + formatNum(state.wallet[state.currentPair.replace('USDT','')] || 0, 4) + ' ' + state.currentPair.replace('USDT','') + '</span></div>' +
                        '<div class="trade-field-group"><div><label>Price</label><input type="number" id="sell-price" value="' + (tk ? tk.price.toFixed(2) : '0') + '"></div><span>USDT</span></div>' +
                        '<div class="trade-field-group"><div><label>Amount</label><input type="number" id="sell-amount" value="0.001"></div><span>' + state.currentPair.replace('USDT','') + '</span></div>' +
                        '<div class="slider-group">' +
                            ['25%','50%','75%','100%'].map(function(p) { return '<button class="slider-btn" onclick="setTradePercent(\'sell\',' + parseInt(p) + ')">' + p + '</button>'; }).join('') +
                        '</div>' +
                        '<div class="trade-field-group"><div><label>Total</label><input type="number" id="sell-total" readonly></div><span>USDT</span></div>' +
                        '<button class="btn-trade-execute sell-btn" onclick="executeTrade(\'sell\')">Sell ' + state.currentPair.replace('USDT','') + '</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            // User Orders Panel
            '<div class="trade-user-panel">' +
                '<div class="user-panel-tabs">' +
                    '<button class="panel-tab-btn active" id="utab-openOrders" onclick="setOrderTab(\'openOrders\')">Open Orders (' + state.orders.filter(function(o){return o.status==='open';}).length + ')</button>' +
                    '<button class="panel-tab-btn" id="utab-history" onclick="setOrderTab(\'history\')">Order History</button>' +
                    '<button class="panel-tab-btn" id="utab-trades" onclick="setOrderTab(\'trades\')">My Trades</button>' +
                '</div>' +
                '<div class="user-panel-content" id="user-panel-content">' +
                    renderOrdersPanel('openOrders') +
                '</div>' +
            '</div>' +
        '</div>' +

        // Right Panel – Market Trades
        '<div class="trade-panel right">' +
            '<div class="panel-header">Recent Trades</div>' +
            '<div class="ob-header"><span>Price(USDT)</span><span style="text-align:right;">Qty</span><span style="text-align:right;">Time</span></div>' +
            '<div class="market-trades-list" id="market-trades-list"></div>' +
        '</div>' +
    '</div>';

    // Init chart canvas
    _chartCanvas = document.getElementById('gk-chart-canvas');
    if (_chartCanvas) {
        _chartCtx = _chartCanvas.getContext('2d');
        _chartCandles = generateCandles(state.currentPair, 80);
        resizeChart();
        startChartAnimation();
        window.addEventListener('resize', resizeChart);
    }

    // Populate OB & trades
    for (var i = 0; i < 20; i++) _tradeHistory.push(generateTrade(state.currentPair));
    updateOrderBook();
    updateMarketTrades();

    // Update totals on price change
    ['buy-price','buy-amount'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', calcBuyTotal);
    });
    ['sell-price','sell-amount'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', calcSellTotal);
    });
    calcBuyTotal(); calcSellTotal();

    // Live price updates
    var tradeTickerHandler = function(e) {
        if (!document.getElementById('gk-chart-canvas')) {
            window.removeEventListener('tickerUpdate', tradeTickerHandler);
            if (_chartInterval) { clearInterval(_chartInterval); _chartInterval = null; }
            return;
        }
        if (e.detail.pair !== state.currentPair) return;
        var tk2 = e.detail.ticker;
        var isUp2 = e.detail.price >= e.detail.prevPrice;
        var ph = document.getElementById('trade-header-price');
        if (ph) { ph.textContent = formatNum(e.detail.price); ph.className = 'value-price value ' + (isUp2 ? 'text-green' : 'text-red'); }
        var ch = document.getElementById('trade-header-change');
        if (ch) { ch.textContent = (tk2.change >= 0 ? '+' : '') + tk2.change.toFixed(2) + '%'; ch.className = 'value ' + (tk2.change >= 0 ? 'text-green' : 'text-red'); }
        var mp = document.getElementById('ob-mid-price');
        if (mp) { mp.textContent = formatNum(e.detail.price); mp.className = 'ob-spread-price ' + (isUp2 ? 'text-green' : 'text-red'); }
        updateOrderBook();
        updateMarketTrades();
    };
    window.addEventListener('tickerUpdate', tradeTickerHandler);

    if (window.lucide) lucide.createIcons();
};

function renderOrdersPanel(tab) {
    var openOrders = state.orders.filter(function(o) { return o.status === 'open'; });
    var histOrders = state.orders.filter(function(o) { return o.status !== 'open'; });
    if (!state.isLoggedIn) {
        return '<div class="empty-state"><i data-lucide="log-in"></i><p>Please <a href="#auth" style="color:var(--primary)">log in</a> to view orders</p></div>';
    }
    if (tab === 'openOrders') {
        if (!openOrders.length) return '<div class="empty-state"><i data-lucide="file-x"></i><p>No open orders</p></div>';
        return '<table class="orders-table"><thead><tr><th>Pair</th><th>Side</th><th>Price</th><th>Qty</th><th>Time</th><th>Action</th></tr></thead><tbody>' +
            openOrders.map(function(o) {
                return '<tr>' +
                    '<td>' + o.pair + '</td>' +
                    '<td style="color:' + (o.side === 'buy' ? 'var(--green)' : 'var(--red)') + ';font-weight:700;">' + o.side.toUpperCase() + '</td>' +
                    '<td>' + formatNum(o.price) + '</td>' +
                    '<td>' + o.qty + '</td>' +
                    '<td>' + timeAgo(o.time) + '</td>' +
                    '<td><button class="btn-cancel-order" onclick="cancelOrder(\'' + o.id + '\')">Cancel</button></td>' +
                '</tr>';
            }).join('') + '</tbody></table>';
    }
    if (tab === 'history') {
        if (!histOrders.length) return '<div class="empty-state"><i data-lucide="clock"></i><p>No order history</p></div>';
        return '<table class="orders-table"><thead><tr><th>Pair</th><th>Side</th><th>Price</th><th>Qty</th><th>Status</th></tr></thead><tbody>' +
            histOrders.slice(-20).reverse().map(function(o) {
                return '<tr>' +
                    '<td>' + o.pair + '</td>' +
                    '<td style="color:' + (o.side === 'buy' ? 'var(--green)' : 'var(--red)') + ';font-weight:700;">' + o.side.toUpperCase() + '</td>' +
                    '<td>' + formatNum(o.price) + '</td>' +
                    '<td>' + o.qty + '</td>' +
                    '<td><span style="color:' + (o.status === 'filled' ? 'var(--green)' : 'var(--text-muted)') + ';font-weight:600;">' + o.status + '</span></td>' +
                '</tr>';
            }).join('') + '</tbody></table>';
    }
    return '<div class="empty-state"><i data-lucide="list"></i><p>No trade history</p></div>';
}
window.renderOrdersPanel = renderOrdersPanel;

// ============ TRADE ACTIONS ============
window.setChartTimeframe = function(tf) {
    _chartTimeframe = tf;
    document.querySelectorAll('.chart-toolbar-btn').forEach(function(b) {
        if (['1m','5m','15m','1H','4H','1D'].indexOf(b.textContent) > -1) b.classList.remove('active');
    });
    event.target.classList.add('active');
    _chartCandles = generateCandles(state.currentPair, 80);
    drawChart();
};

window.changePair = function(pair) {
    state.currentPair = pair;
    saveState();
    _chartCandles = generateCandles(pair, 80);
    _tradeHistory = [];
    for (var i = 0; i < 20; i++) _tradeHistory.push(generateTrade(pair));
    updateOrderBook();
    updateMarketTrades();
    var tk = state.tickers[pair];
    if (tk) {
        var ph = document.getElementById('trade-header-price');
        if (ph) { ph.textContent = formatNum(tk.price); ph.className = 'value-price value ' + (tk.change >= 0 ? 'text-green' : 'text-red'); }
        ['buy-price','sell-price'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.value = tk.price.toFixed(2);
        });
        calcBuyTotal(); calcSellTotal();
    }
};

window.setTradePrice = function(price) {
    ['buy-price','sell-price'].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.value = price.toFixed(2);
    });
    calcBuyTotal(); calcSellTotal();
};

window.setTradePercent = function(side, pct) {
    var tk = state.tickers[state.currentPair];
    var price = tk ? tk.price : 1;
    if (side === 'buy') {
        var avail = state.wallet.USDT;
        var total = (avail * pct / 100) * 0.999;
        var qty = total / price;
        var qtyEl = document.getElementById('buy-amount'); if (qtyEl) qtyEl.value = qty.toFixed(4);
        var totEl = document.getElementById('buy-total'); if (totEl) totEl.value = total.toFixed(2);
    } else {
        var base = state.currentPair.replace('USDT','');
        var availBase = state.wallet[base] || 0;
        var qty2 = availBase * pct / 100;
        var qtyEl2 = document.getElementById('sell-amount'); if (qtyEl2) qtyEl2.value = qty2.toFixed(4);
        var totEl2 = document.getElementById('sell-total'); if (totEl2) totEl2.value = (qty2 * price).toFixed(2);
    }
    ['buy-price','sell-price'].forEach(function(id) {
        var el = document.getElementById(id); if (el && !el.value) el.value = price.toFixed(2);
    });
};

function calcBuyTotal() {
    var p = parseFloat(document.getElementById('buy-price') ? document.getElementById('buy-price').value : 0) || 0;
    var a = parseFloat(document.getElementById('buy-amount') ? document.getElementById('buy-amount').value : 0) || 0;
    var tot = document.getElementById('buy-total'); if (tot) tot.value = (p * a).toFixed(2);
}
function calcSellTotal() {
    var p = parseFloat(document.getElementById('sell-price') ? document.getElementById('sell-price').value : 0) || 0;
    var a = parseFloat(document.getElementById('sell-amount') ? document.getElementById('sell-amount').value : 0) || 0;
    var tot = document.getElementById('sell-total'); if (tot) tot.value = (p * a).toFixed(2);
}

window.executeTrade = function(side) {
    if (!state.isLoggedIn) { navigate('auth'); showToast('Please login to trade', 'warning'); return; }
    var priceEl = document.getElementById(side + '-price');
    var amtEl = document.getElementById(side + '-amount');
    if (!priceEl || !amtEl) return;
    var price = parseFloat(priceEl.value) || 0;
    var qty = parseFloat(amtEl.value) || 0;
    if (!price || !qty) { showToast('Enter valid price and amount', 'error'); return; }
    var total = price * qty;
    var base = state.currentPair.replace('USDT','');
    if (side === 'buy') {
        if (state.wallet.USDT < total) { showToast('Insufficient USDT balance', 'error'); return; }
        state.wallet.USDT = parseFloat((state.wallet.USDT - total).toFixed(4));
        state.wallet[base] = parseFloat(((state.wallet[base] || 0) + qty).toFixed(6));
    } else {
        if ((state.wallet[base] || 0) < qty) { showToast('Insufficient ' + base + ' balance', 'error'); return; }
        state.wallet[base] = parseFloat(((state.wallet[base] || 0) - qty).toFixed(6));
        state.wallet.USDT = parseFloat((state.wallet.USDT + total).toFixed(4));
    }
    var order = { id: 'o' + Date.now(), pair: state.currentPair, side: side, price: price, qty: qty, status: 'filled', type: 'limit', time: Date.now() };
    state.orders.push(order);
    saveState();
    showToast(side === 'buy' ? '✅ Buy order filled: ' + qty + ' ' + base : '✅ Sell order filled: ' + qty + ' ' + base, 'success');
    var upd = document.getElementById('user-panel-content');
    if (upd) upd.innerHTML = renderOrdersPanel(_activeOrderTab);
    if (window.lucide) lucide.createIcons();
};

window.cancelOrder = function(id) {
    var ord = state.orders.find(function(o) { return o.id === id; });
    if (ord) {
        if (ord.side === 'buy') state.wallet.USDT += ord.price * ord.qty;
        else state.wallet[ord.pair.replace('USDT','')] = (state.wallet[ord.pair.replace('USDT','')] || 0) + ord.qty;
        ord.status = 'cancelled';
        saveState();
    }
    var upd = document.getElementById('user-panel-content');
    if (upd) upd.innerHTML = renderOrdersPanel(_activeOrderTab);
    if (window.lucide) lucide.createIcons();
    showToast('Order cancelled', 'info');
};

window.setOrderTab = function(tab) {
    _activeOrderTab = tab;
    document.querySelectorAll('.panel-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    var btn = document.getElementById('utab-' + tab); if (btn) btn.classList.add('active');
    var content = document.getElementById('user-panel-content');
    if (content) content.innerHTML = renderOrdersPanel(tab);
    if (window.lucide) lucide.createIcons();
};

window.setFormTab = function(tab) {
    document.querySelectorAll('.form-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    var btn = document.getElementById('ftab-' + tab); if (btn) btn.classList.add('active');
};

window.setObMode = function(mode) {
    var asks = document.getElementById('ob-asks');
    var bids = document.getElementById('ob-bids');
    var spread = document.querySelector('.ob-spread-row');
    if (asks) asks.style.display = mode === 'bids' ? 'none' : 'block';
    if (bids) bids.style.display = mode === 'asks' ? 'none' : 'block';
    if (spread) spread.style.display = mode === 'asks' || mode === 'bids' ? 'none' : 'flex';
    ['both','bids','asks'].forEach(function(m) {
        var btn = document.getElementById('ob-btn-' + m);
        if (btn) btn.classList.toggle('active', m === mode);
    });
};
