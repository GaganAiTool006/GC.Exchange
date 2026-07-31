/* ============================================
   GK EXCHANGE - P2P Component (All Sub-Pages)
   components/p2p.js
   ============================================ */

var _p2pAction = 'buy';
var _p2pToken = 'USDT';

var _mockMerchants = [
    { id: 'm1', name: 'ArjunTrader', verified: true, orders: 4821, rate: 99.8, avgTime: '3 min', online: true },
    { id: 'm2', name: 'PriyaTrades', verified: true, orders: 2340, rate: 98.9, avgTime: '5 min', online: true },
    { id: 'm3', name: 'CryptoKingVK', verified: false, orders: 876, rate: 97.4, avgTime: '8 min', online: false },
    { id: 'm4', name: 'SharmaExchange', verified: true, orders: 6102, rate: 99.2, avgTime: '2 min', online: true },
    { id: 'm5', name: 'AyeshaCrypto', verified: true, orders: 3450, rate: 99.5, avgTime: '4 min', online: true },
    { id: 'm6', name: 'FastTradePro', verified: true, orders: 8920, rate: 99.7, avgTime: '1 min', online: true }
];

var _mockP2PAds = {
    buy: [
        { merchant: _mockMerchants[0], price: 89.42, min: 1000, max: 100000, methods: ['UPI', 'IMPS'], token: 'USDT' },
        { merchant: _mockMerchants[3], price: 89.38, min: 5000, max: 500000, methods: ['NEFT', 'Bank Transfer'], token: 'USDT' },
        { merchant: _mockMerchants[4], price: 89.55, min: 2000, max: 200000, methods: ['UPI', 'Paytm'], token: 'USDT' },
        { merchant: _mockMerchants[5], price: 89.20, min: 10000, max: 1000000, methods: ['RTGS', 'NEFT'], token: 'USDT' },
        { merchant: _mockMerchants[1], price: 89.48, min: 500, max: 50000, methods: ['Paytm', 'PhonePe'], token: 'USDT' }
    ],
    sell: [
        { merchant: _mockMerchants[2], price: 89.10, min: 1000, max: 150000, methods: ['UPI', 'IMPS'], token: 'USDT' },
        { merchant: _mockMerchants[1], price: 89.05, min: 3000, max: 300000, methods: ['Bank Transfer'], token: 'USDT' },
        { merchant: _mockMerchants[0], price: 89.15, min: 1000, max: 100000, methods: ['UPI', 'Paytm'], token: 'USDT' },
        { merchant: _mockMerchants[3], price: 88.98, min: 5000, max: 200000, methods: ['NEFT', 'RTGS'], token: 'USDT' }
    ]
};

window.renderP2P = function(container, sub, params) {
    sub = sub || 'listing';
    var navTabs = [
        { id: 'listing', icon: 'shopping-cart', label: 'Buy / Sell' },
        { id: 'orders', icon: 'file-text', label: 'My Orders' },
        { id: 'myads', icon: 'megaphone', label: 'My Ads' },
        { id: 'postAd', icon: 'plus-circle', label: 'Post Ad' },
        { id: 'payment', icon: 'credit-card', label: 'Payment' }
    ];

    var navHtml = navTabs.map(function(tab) {
        return '<button class="p2p-nav-tab ' + (sub === tab.id ? 'active' : '') + '" onclick="navigate(\'p2p\',{sub:\'' + tab.id + '\'})">' +
            '<i data-lucide="' + tab.icon + '"></i>' + tab.label +
        '</button>';
    }).join('');

    var contentHtml = '';
    switch (sub) {
        case 'listing': contentHtml = renderP2PListing(params); break;
        case 'orders': contentHtml = renderP2POrders(params); break;
        case 'myads': contentHtml = renderMyAds(); break;
        case 'postAd': contentHtml = renderPostAd(); break;
        case 'payment': contentHtml = renderPaymentMethods(); break;
        default: contentHtml = renderP2PListing(params);
    }

    container.innerHTML =
        '<div class="p2p-container">' +
            '<div class="p2p-header"><h1>P2P Trading</h1><p>Trade crypto directly with verified merchants. 0 platform fees, 1000+ payment options.</p></div>' +
            '<div class="p2p-nav-tabs">' + navHtml + '</div>' +
            contentHtml +
        '</div>';

    if (window.lucide) lucide.createIcons();
};

// ---- LISTING PAGE ----
function renderP2PListing(params) {
    var ads = _mockP2PAds[_p2pAction] || [];
    var tokens = ['USDT', 'BTC', 'ETH', 'BNB'];

    return '<div class="p2p-toggle-bar">' +
        '<div class="p2p-action-toggles">' +
            '<button class="p2p-action-btn buy-p2p ' + (_p2pAction === 'buy' ? 'active' : '') + '" onclick="setP2PAction(\'buy\')">Buy</button>' +
            '<button class="p2p-action-btn sell-p2p ' + (_p2pAction === 'sell' ? 'active' : '') + '" onclick="setP2PAction(\'sell\')">Sell</button>' +
        '</div>' +
        '<div class="p2p-tokens-list">' + tokens.map(function(t) { return '<button class="p2p-token-tab ' + (t === _p2pToken ? 'active' : '') + '" onclick="setP2PToken(\'' + t + '\')">' + t + '</button>'; }).join('') + '</div>' +
    '</div>' +

    '<div class="p2p-filters-row">' +
        '<div class="p2p-filter-item"><label>Fiat Currency</label><select class="p2p-filter-select"><option>INR 🇮🇳</option><option>USD 🇺🇸</option><option>EUR 🇪🇺</option></select></div>' +
        '<div class="p2p-filter-item"><label>Amount</label><input type="number" placeholder="Enter amount..." class="p2p-filter-input"></div>' +
        '<div class="p2p-filter-item"><label>Payment Method</label><select class="p2p-filter-select"><option>All Methods</option><option>UPI</option><option>Bank Transfer</option><option>Paytm</option><option>IMPS</option><option>NEFT</option></select></div>' +
        '<div class="p2p-filter-item"><label>Merchant Type</label><select class="p2p-filter-select"><option>All Merchants</option><option>Verified Only</option></select></div>' +
    '</div>' +

    '<div class="p2p-ads-card">' +
        '<div class="market-table-container">' +
            '<table class="market-table">' +
                '<thead><tr><th>Merchant</th><th>Price</th><th>Available / Limit</th><th>Payment</th><th>Action</th></tr></thead>' +
                '<tbody>' +
                ads.map(function(ad, idx) {
                    return '<tr>' +
                        '<td><div class="merchant-info">' +
                            '<div class="merchant-name">' + ad.merchant.name +
                                (ad.merchant.verified ? ' <i data-lucide="badge-check" style="width:14px;height:14px;color:var(--blue);"></i>' : '') +
                                (ad.merchant.online ? ' <span style="width:7px;height:7px;background:var(--green);border-radius:50%;display:inline-block;"></span>' : '') +
                            '</div>' +
                            '<div class="merchant-stats">' + ad.merchant.orders + ' orders · ' + ad.merchant.rate + '% · ~' + ad.merchant.avgTime + '</div>' +
                        '</div></td>' +
                        '<td><div class="p2p-price-cell">' + ad.price.toFixed(2) + ' <span>INR/' + _p2pToken + '</span></div></td>' +
                        '<td style="font-size:12px;">' +
                            '<div style="color:var(--text-muted);">Avail: <b style="color:var(--text-primary);">∞ ' + _p2pToken + '</b></div>' +
                            '<div style="color:var(--text-muted);">Limit: ₹' + formatNum(ad.min) + ' - ₹' + formatNum(ad.max) + '</div>' +
                        '</td>' +
                        '<td>' + ad.methods.map(function(m) { return '<span class="payment-badge">' + m + '</span>'; }).join('') + '</td>' +
                        '<td><button class="btn-p2p-action ' + (_p2pAction === 'buy' ? 'buy-bg' : 'sell-bg') + '" onclick="openP2POrder(' + idx + ')">' + (_p2pAction === 'buy' ? 'Buy' : 'Sell') + ' ' + _p2pToken + '</button></td>' +
                    '</tr>';
                }).join('') +
                '</tbody>' +
            '</table>' +
        '</div>' +
    '</div>';
}

window.setP2PAction = function(action) {
    _p2pAction = action;
    navigate('p2p', { sub: 'listing' });
};
window.setP2PToken = function(token) {
    _p2pToken = token;
    navigate('p2p', { sub: 'listing' });
};

window.openP2POrder = function(idx) {
    if (!state.isLoggedIn) { navigate('auth'); showToast('Please login to trade P2P', 'warning'); return; }
    var ad = (_mockP2PAds[_p2pAction] || [])[idx];
    if (!ad) return;
    var orderId = 'P2P' + Date.now();
    var newOrder = {
        id: orderId,
        type: _p2pAction,
        token: _p2pToken,
        merchant: ad.merchant,
        price: ad.price,
        amount: 100,
        total: ad.price * 100,
        status: 'pending',
        step: 1,
        time: Date.now(),
        messages: [
            { from: 'merchant', text: 'Hello! Please transfer the amount and upload proof.', time: Date.now() - 60000 },
            { from: 'merchant', text: 'My UPI: ' + ad.merchant.name.toLowerCase() + '@gpay', time: Date.now() - 30000 }
        ]
    };
    state.p2pOrders.push(newOrder);
    saveState();
    navigate('p2p', { sub: 'orders', orderId: orderId });
};

// ---- ORDERS PAGE ----
function renderP2POrders(params) {
    var orderId = params && params.orderId;
    if (orderId) {
        var order = state.p2pOrders.find(function(o) { return o.id === orderId; });
        if (order) return renderOrderDetail(order);
    }

    if (!state.isLoggedIn) return '<div class="empty-state" style="margin-top:40px;"><i data-lucide="log-in"></i><p>Please <a href="#auth" style="color:var(--primary);">login</a> to view orders</p></div>';
    if (!state.p2pOrders.length) return '<div class="empty-state" style="margin-top:60px;"><i data-lucide="file-x"></i><p>No P2P orders yet</p><a href="#p2p" class="btn-modal-action" style="width:auto;display:inline-block;padding:10px 24px;margin-top:16px;">Start Trading</a></div>';

    return '<div>' +
        '<div class="market-table-container">' +
            '<table class="market-table">' +
                '<thead><tr><th>Order ID</th><th>Type</th><th>Token</th><th>Price</th><th>Merchant</th><th>Status</th><th>Time</th><th>Action</th></tr></thead>' +
                '<tbody>' +
                state.p2pOrders.slice().reverse().map(function(o) {
                    var statusColor = o.status === 'completed' ? 'var(--green)' : o.status === 'cancelled' ? 'var(--text-muted)' : 'var(--primary)';
                    return '<tr>' +
                        '<td style="font-size:11px;font-family:monospace;color:var(--text-muted);">' + o.id.slice(-8) + '</td>' +
                        '<td style="color:' + (o.type === 'buy' ? 'var(--green)' : 'var(--red)') + ';font-weight:700;">' + o.type.toUpperCase() + '</td>' +
                        '<td>' + o.token + '</td>' +
                        '<td>' + (o.price ? o.price.toFixed(2) : '--') + ' INR</td>' +
                        '<td style="font-weight:600;">' + (o.merchant ? o.merchant.name : '--') + '</td>' +
                        '<td><span style="color:' + statusColor + ';font-weight:700;text-transform:capitalize;">' + o.status + '</span></td>' +
                        '<td style="font-size:11px;color:var(--text-muted);">' + timeAgo(o.time) + '</td>' +
                        '<td><button class="action-btn-sm" onclick="viewP2POrder(\'' + o.id + '\')">View</button></td>' +
                    '</tr>';
                }).join('') +
                '</tbody>' +
            '</table>' +
        '</div>' +
    '</div>';
}

window.viewP2POrder = function(id) {
    navigate('p2p', { sub: 'orders', orderId: id });
};

function renderOrderDetail(order) {
    var steps = ['Order Placed', 'Payment Sent', 'Confirmed', 'Completed'];
    var stepsHtml = steps.map(function(s, i) {
        var stepNum = i + 1;
        var isDone = order.step > stepNum;
        var isActive = order.step === stepNum;
        return (i > 0 ? '<div class="status-line ' + (isDone ? 'done' : '') + '"></div>' : '') +
        '<div class="status-step ' + (isDone ? 'done' : (isActive ? 'active' : '')) + '">' +
            '<div class="status-step-circle">' + (isDone ? '<i data-lucide="check" style="width:14px;height:14px;"></i>' : stepNum) + '</div>' +
            '<span class="status-step-label">' + s + '</span>' +
        '</div>';
    }).join('');

    var messagesHtml = (order.messages || []).map(function(m) {
        var isMe = m.from === 'me';
        return '<div class="chat-msg ' + (isMe ? 'own' : '') + '">' +
            '<div class="chat-avatar ' + (isMe ? 'me' : 'merchant') + '">' + (isMe ? 'G' : (order.merchant.name.charAt(0) || 'M')) + '</div>' +
            '<div>' +
                '<div class="chat-bubble">' + m.text + '</div>' +
                '<div class="chat-time">' + timeAgo(m.time) + '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    return '<div class="p2p-order-detail">' +
        // Order Info
        '<div class="p2p-order-info-card">' +
            '<h3 style="font-family:var(--font-heading);font-size:20px;font-weight:800;margin-bottom:4px;">' + order.type.toUpperCase() + ' ' + order.token + '</h3>' +
            '<p style="color:var(--text-muted);font-size:12px;">Order: <code>' + order.id + '</code></p>' +
            '<div class="order-status-tracker">' + stepsHtml + '</div>' +
            '<div style="background:var(--bg-hover);border-radius:var(--radius-md);padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">' +
                '<div><div style="font-size:11px;color:var(--text-muted);">Token</div><div style="font-weight:700;">' + order.token + '</div></div>' +
                '<div><div style="font-size:11px;color:var(--text-muted);">Price</div><div style="font-weight:700;">' + (order.price || '--') + ' INR</div></div>' +
                '<div><div style="font-size:11px;color:var(--text-muted);">Amount</div><div style="font-weight:700;">' + order.amount + ' ' + order.token + '</div></div>' +
                '<div><div style="font-size:11px;color:var(--text-muted);">Total</div><div style="font-weight:700;color:var(--primary);">₹' + formatNum(order.total) + '</div></div>' +
                '<div><div style="font-size:11px;color:var(--text-muted);">Merchant</div><div style="font-weight:700;">' + (order.merchant ? order.merchant.name : '--') + '</div></div>' +
                '<div><div style="font-size:11px;color:var(--text-muted);">Status</div><div style="font-weight:700;text-transform:capitalize;color:var(--primary);">' + order.status + '</div></div>' +
            '</div>' +
            '<div style="margin-top:16px;display:flex;gap:10px;">' +
                (order.step === 1 ? '<button class="btn-modal-action" onclick="advanceP2POrder(\'' + order.id + '\')">I\'ve Paid ✓</button>' : '') +
                (order.step === 2 ? '<button class="btn-modal-action" onclick="advanceP2POrder(\'' + order.id + '\')">Confirm Receipt</button>' : '') +
                (order.status !== 'completed' && order.status !== 'cancelled' ? '<button class="btn-modal-action danger" onclick="cancelP2POrder(\'' + order.id + '\')" style="flex:0.4;">Cancel</button>' : '') +
                '<button class="btn-modal-action" onclick="navigate(\'p2p\',{sub:\'orders\'})" style="background:var(--bg-hover);color:var(--text-primary);flex:0.5;">← Back</button>' +
            '</div>' +
        '</div>' +

        // Chat
        '<div class="p2p-chat-card">' +
            '<h3 style="font-family:var(--font-heading);font-size:18px;font-weight:700;margin-bottom:4px;">Chat with ' + (order.merchant ? order.merchant.name : 'Merchant') + '</h3>' +
            '<p style="font-size:11px;color:var(--text-muted);">Responses may take up to 15 minutes</p>' +
            '<div class="p2p-chat-messages" id="chat-messages">' + messagesHtml + '</div>' +
            '<div class="chat-input-row">' +
                '<input type="text" class="chat-input" id="chat-input" placeholder="Type a message...">' +
                '<button class="btn-chat-send" onclick="sendChatMsg(\'' + order.id + '\')"><i data-lucide="send"></i> Send</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

window.advanceP2POrder = function(id) {
    var order = state.p2pOrders.find(function(o) { return o.id === id; });
    if (!order) return;
    order.step++;
    if (order.step > 4) { order.step = 4; order.status = 'completed'; showToast('🎉 Order completed!', 'success'); }
    else showToast('Order updated', 'success');
    saveState();
    navigate('p2p', { sub: 'orders', orderId: id });
};

window.cancelP2POrder = function(id) {
    var order = state.p2pOrders.find(function(o) { return o.id === id; });
    if (order) { order.status = 'cancelled'; saveState(); showToast('Order cancelled', 'info'); navigate('p2p', { sub: 'orders' }); }
};

window.sendChatMsg = function(orderId) {
    var input = document.getElementById('chat-input');
    var msg = input ? input.value.trim() : '';
    if (!msg) return;
    var order = state.p2pOrders.find(function(o) { return o.id === orderId; });
    if (!order) return;
    if (!order.messages) order.messages = [];
    order.messages.push({ from: 'me', text: msg, time: Date.now() });
    saveState();
    if (input) input.value = '';
    // Auto reply after 2s
    setTimeout(function() {
        var replies = ['Please wait, I\'ll verify the payment.', 'Thank you! Confirming now.', 'Payment received, releasing crypto.', 'Please provide the UTR number.', 'Done! Trade completed.'];
        order.messages.push({ from: 'merchant', text: replies[Math.floor(Math.random() * replies.length)], time: Date.now() });
        saveState();
        var chatEl = document.getElementById('chat-messages');
        if (chatEl) {
            var msgEl = document.createElement('div');
            msgEl.className = 'chat-msg';
            msgEl.innerHTML = '<div class="chat-avatar merchant">' + (order.merchant.name.charAt(0)) + '</div><div><div class="chat-bubble">' + order.messages[order.messages.length-1].text + '</div><div class="chat-time">Just now</div></div>';
            chatEl.appendChild(msgEl);
            chatEl.scrollTop = chatEl.scrollHeight;
        }
    }, 1500 + Math.random() * 1500);

    var chatEl = document.getElementById('chat-messages');
    if (chatEl) {
        var myMsg = document.createElement('div');
        myMsg.className = 'chat-msg own';
        myMsg.innerHTML = '<div class="chat-avatar me">G</div><div><div class="chat-bubble">' + msg + '</div><div class="chat-time">Just now</div></div>';
        chatEl.appendChild(myMsg);
        chatEl.scrollTop = chatEl.scrollHeight;
    }
};

// ---- MY ADS ----
function renderMyAds() {
    if (!state.isLoggedIn) return '<div class="empty-state" style="margin-top:40px;"><i data-lucide="log-in"></i><p>Please <a href="#auth" style="color:var(--primary);">login</a> to view ads</p></div>';

    var myAds = [
        { id: 'ad1', type: 'buy', token: 'USDT', price: 89.40, minLimit: 1000, maxLimit: 50000, methods: ['UPI'], status: 'online', orders: 12, completion: 94 },
        { id: 'ad2', type: 'sell', token: 'BTC', price: 5680000, minLimit: 10000, maxLimit: 500000, methods: ['Bank Transfer'], status: 'offline', orders: 8, completion: 100 }
    ];

    return '<div class="my-ads-container">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
            '<h2 style="font-family:var(--font-heading);font-size:22px;font-weight:800;">My Advertisements</h2>' +
            '<button class="btn-modal-action" style="width:auto;padding:10px 24px;" onclick="navigate(\'p2p\',{sub:\'postAd\'})"><i data-lucide="plus"></i> Post New Ad</button>' +
        '</div>' +
        '<div class="market-table-container">' +
            '<table class="market-table">' +
                '<thead><tr><th>Type</th><th>Token</th><th>Price</th><th>Limits</th><th>Payment</th><th>Orders</th><th>Completion</th><th>Status</th><th>Action</th></tr></thead>' +
                '<tbody>' +
                myAds.map(function(ad) {
                    return '<tr>' +
                        '<td style="color:' + (ad.type === 'buy' ? 'var(--green)' : 'var(--red)') + ';font-weight:700;">' + ad.type.toUpperCase() + '</td>' +
                        '<td>' + ad.token + '</td>' +
                        '<td style="font-weight:700;">' + formatNum(ad.price) + ' INR</td>' +
                        '<td style="font-size:12px;color:var(--text-muted);">₹' + formatNum(ad.minLimit) + ' - ₹' + formatNum(ad.maxLimit) + '</td>' +
                        '<td>' + ad.methods.map(function(m) { return '<span class="payment-badge">' + m + '</span>'; }).join('') + '</td>' +
                        '<td style="font-weight:700;">' + ad.orders + '</td>' +
                        '<td style="font-weight:700;color:var(--green);">' + ad.completion + '%</td>' +
                        '<td><span class="ad-status-badge ' + ad.status + '">' + ad.status + '</span></td>' +
                        '<td>' +
                            '<button class="btn-sm-edit">Edit</button>' +
                            '<button class="btn-sm-danger">Pause</button>' +
                        '</td>' +
                    '</tr>';
                }).join('') +
                '</tbody>' +
            '</table>' +
        '</div>' +
    '</div>';
}

// ---- POST AD ----
function renderPostAd() {
    if (!state.isLoggedIn) return '<div class="empty-state" style="margin-top:40px;"><i data-lucide="log-in"></i><p>Please <a href="#auth" style="color:var(--primary);">login</a> to post ads</p></div>';

    return '<div class="post-ad-container">' +
        '<h2 style="font-family:var(--font-heading);font-size:26px;font-weight:900;margin-bottom:24px;">Post a P2P Ad</h2>' +

        '<div class="form-section-card">' +
            '<div class="form-section-title"><span>1</span> Ad Type & Token</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>I want to</label>' +
                    '<div class="radio-group">' +
                        '<div class="radio-card selected" onclick="selectRadio(this,\'adtype\')" data-value="buy"><i data-lucide="arrow-down-circle" style="width:20px;height:20px;color:var(--green);margin-bottom:6px;"></i><br><b>Buy</b><br><small style="color:var(--text-muted);">Buy crypto</small></div>' +
                        '<div class="radio-card" onclick="selectRadio(this,\'adtype\')" data-value="sell"><i data-lucide="arrow-up-circle" style="width:20px;height:20px;color:var(--red);margin-bottom:6px;"></i><br><b>Sell</b><br><small style="color:var(--text-muted);">Sell crypto</small></div>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group"><label>Asset</label>' +
                    '<select class="form-control-select"><option>USDT</option><option>BTC</option><option>ETH</option><option>BNB</option><option>SOL</option></select>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="form-section-card">' +
            '<div class="form-section-title"><span>2</span> Pricing</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Price Type</label>' +
                    '<div class="radio-group">' +
                        '<div class="radio-card selected" onclick="selectRadio(this,\'pricetype\')" data-value="fixed"><b>Fixed</b><br><small style="color:var(--text-muted);">Set exact price</small></div>' +
                        '<div class="radio-card" onclick="selectRadio(this,\'pricetype\')" data-value="floating"><b>Floating</b><br><small style="color:var(--text-muted);">Market % premium</small></div>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group"><label>Fiat Currency</label><select class="form-control-select"><option>INR</option><option>USD</option><option>EUR</option></select></div>' +
            '</div>' +
            '<div class="form-group"><label>Your Price (INR per USDT)</label>' +
                '<input type="number" class="form-control-input" placeholder="e.g. 89.50" value="89.50">' +
            '</div>' +
            '<div style="background:var(--primary-light);border:1px solid var(--border-gold);border-radius:var(--radius-md);padding:12px;font-size:13px;margin-top:8px;">' +
                '💡 Market price: <b style="color:var(--primary);">₹89.32/USDT</b> · Your premium: <b style="color:var(--green);">+0.20%</b>' +
            '</div>' +
        '</div>' +

        '<div class="form-section-card">' +
            '<div class="form-section-title"><span>3</span> Trade Limits & Payment</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Total Amount (USDT)</label><input type="number" class="form-control-input" placeholder="e.g. 5000"></div>' +
                '<div class="form-group"><label>Order Limit (INR)</label><div style="display:flex;gap:8px;"><input type="number" class="form-control-input" placeholder="Min e.g. 1000"><input type="number" class="form-control-input" placeholder="Max e.g. 100000"></div></div>' +
            '</div>' +
            '<div class="form-group" style="margin-top:12px;"><label>Payment Methods</label>' +
                '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
                    state.paymentMethods.map(function(pm) {
                        return '<label style="display:flex;align-items:center;gap:6px;background:var(--bg-hover);padding:8px 12px;border-radius:var(--radius-sm);cursor:pointer;border:1px solid var(--border-color);">' +
                            '<input type="checkbox"> <span>' + pm.emoji + ' ' + pm.name + '</span>' +
                        '</label>';
                    }).join('') +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="form-section-card">' +
            '<div class="form-section-title"><span>4</span> Trade Terms</div>' +
            '<div class="form-group"><label>Payment Window</label><select class="form-control-select"><option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>1 hour</option></select></div>' +
            '<div class="form-group" style="margin-top:12px;"><label>Trade Remarks (shown to counterparty)</label><textarea class="form-control-input" rows="3" placeholder="e.g. Please transfer to my UPI ID and share screenshot..."></textarea></div>' +
        '</div>' +

        '<button class="btn-modal-action" onclick="submitAd()">📢 Post Advertisement</button>' +
    '</div>';
}

window.selectRadio = function(el, group) {
    el.closest('.radio-group').querySelectorAll('.radio-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
};

window.submitAd = function() {
    showToast('✅ Ad posted successfully!', 'success');
    navigate('p2p', { sub: 'myads' });
};

// ---- PAYMENT METHODS ----
function renderPaymentMethods() {
    if (!state.isLoggedIn) return '<div class="empty-state" style="margin-top:40px;"><i data-lucide="log-in"></i><p>Please <a href="#auth" style="color:var(--primary);">login</a></p></div>';

    var pms = state.paymentMethods || [];
    return '<div class="payment-methods-container">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">' +
            '<div><h2 style="font-family:var(--font-heading);font-size:22px;font-weight:800;">Payment Methods</h2>' +
            '<p style="font-size:13px;color:var(--text-secondary);margin-top:4px;">Methods used for P2P trading. Max 20 allowed.</p></div>' +
        '</div>' +
        pms.map(function(pm, idx) {
            return '<div class="payment-method-card">' +
                '<div class="pm-info">' +
                    '<div class="payment-method-icon" style="background:' + pm.color + '22;border:1px solid ' + pm.color + '44;">' + pm.emoji + '</div>' +
                    '<div class="pm-details">' +
                        '<div class="pm-name">' + pm.name + '</div>' +
                        '<div class="pm-sub">' + pm.type + ' · ' + pm.detail + '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<span style="color:var(--green);font-size:11px;font-weight:700;background:var(--green-light);padding:3px 8px;border-radius:var(--radius-full);">Active</span>' +
                    '<button class="btn-sm-edit" onclick="editPayment(' + idx + ')">Edit</button>' +
                    '<button class="btn-sm-danger" onclick="deletePayment(' + idx + ')">Remove</button>' +
                '</div>' +
            '</div>';
        }).join('') +
        '<button class="btn-add-payment" onclick="addPaymentMethod()"><i data-lucide="plus-circle"></i> Add Payment Method</button>' +
    '</div>';
}

window.editPayment = function(idx) { showToast('Edit payment method coming soon', 'info'); };
window.deletePayment = function(idx) {
    state.paymentMethods.splice(idx, 1);
    saveState();
    showToast('Payment method removed', 'success');
    navigate('p2p', { sub: 'payment' });
};
window.addPaymentMethod = function() {
    var methods = ['Google Pay', 'PhonePe', 'HDFC Bank', 'ICICI Bank', 'Amazon Pay'];
    var emojis = ['📱', '💜', '🏦', '🏛️', '🛒'];
    var types = ['UPI', 'UPI', 'Bank Transfer', 'Bank Transfer', 'UPI'];
    var colors = ['#4285f4', '#5f259f', '#e65c00', '#f58220', '#ff9900'];
    var r = Math.floor(Math.random() * methods.length);
    state.paymentMethods.push({ id: 'pm' + Date.now(), type: types[r], name: methods[r], detail: 'example@' + methods[r].toLowerCase().replace(' ',''), color: colors[r], emoji: emojis[r] });
    saveState();
    showToast('Payment method added!', 'success');
    navigate('p2p', { sub: 'payment' });
};
