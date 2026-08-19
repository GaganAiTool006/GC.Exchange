/* ============================================
   GK EXCHANGE - Wallet Component
   components/wallet.js
   ============================================ */

var _walletBalancesHidden = false;

window.renderWallet = function(container) {
    var coinMeta = {
        'USDT': { name: 'Tether USD', color: '#0ecb81' },
        'BTC': { name: 'Bitcoin', color: '#f7931a' },
        'ETH': { name: 'Ethereum', color: '#627eea' },
        'BNB': { name: 'BNB', color: '#f0b90b' },
        'SOL': { name: 'Solana', color: '#9945ff' },
        'XRP': { name: 'XRP', color: '#00aae4' },
        'ADA': { name: 'Cardano', color: '#3cc8c8' },
        'DOGE': { name: 'Dogecoin', color: '#c2a633' },
        'AVAX': { name: 'Avalanche', color: '#e84142' },
        'LTC': { name: 'Litecoin', color: '#bfbbbb' },
        'GKX': { name: 'GKX Exchange Token', color: '#f0b90b' }
    };

    // Calculate asset values in USD
    function getAssetUSDValue(coin, amount) {
        if (coin === 'USDT') return amount;
        if (coin === 'GKX') return amount * 0.45;
        var pair = coin + 'USDT';
        return state.tickers[pair] ? (amount * state.tickers[pair].price) : amount;
    }

    var totalUSD = 0;
    var assetBreakdown = [];

    Object.keys(state.wallet).forEach(function(coin) {
        var amt = state.wallet[coin] || 0;
        var valUSD = getAssetUSDValue(coin, amt);
        totalUSD += valUSD;
        if (amt > 0) {
            assetBreakdown.push({
                symbol: coin,
                amount: amt,
                valUSD: valUSD,
                name: (coinMeta[coin] ? coinMeta[coin].name : coin),
                color: (coinMeta[coin] ? coinMeta[coin].color : '#f0b90b')
            });
        }
    });

    // Sort by USD value descending
    assetBreakdown.sort(function(a, b) { return b.valUSD - a.valUSD; });

    var btcPrice = (state.tickers['BTCUSDT'] ? state.tickers['BTCUSDT'].price : 67000);
    var estBTC = totalUSD / btcPrice;

    var displayUSD = _walletBalancesHidden ? '******' : ('$' + formatNum(totalUSD, 2));
    var displayBTC = _walletBalancesHidden ? '******' : (formatBTC(estBTC) + ' BTC');

    // Build Donut SVG
    var radius = 15.91549430918954;
    var cumulativePercent = 0;
    var donutPaths = '';
    var legendHTML = '';

    if (totalUSD > 0) {
        assetBreakdown.forEach(function(item) {
            var pct = (item.valUSD / totalUSD) * 100;
            if (pct < 0.5) return;
            var strokeDash = pct.toFixed(2) + ' ' + (100 - pct).toFixed(2);
            var strokeOffset = (100 - cumulativePercent + 25).toFixed(2);
            donutPaths += `
                <circle cx="21" cy="21" r="${radius}" 
                        fill="transparent" 
                        stroke="${item.color}" 
                        stroke-width="5" 
                        stroke-dasharray="${strokeDash}" 
                        stroke-dashoffset="${strokeOffset}">
                </circle>
            `;
            cumulativePercent += pct;
            legendHTML += `
                <div class="legend-item" style="display:flex;align-items:center;gap:6px;">
                    <div style="width:10px;height:10px;border-radius:3px;background:${item.color};"></div>
                    <span style="font-size:11px;font-weight:600;">${item.symbol}: ${pct.toFixed(1)}%</span>
                </div>
            `;
        });
    }

    var chartSVG = `
        <svg class="donut-chart" viewBox="0 0 42 42" width="100%" height="100%">
            <circle cx="21" cy="21" r="${radius}" fill="transparent" stroke="var(--border-color)" stroke-width="5"></circle>
            ${donutPaths}
        </svg>
        <div class="chart-center-text">
            <span class="title">Total</span>
            <span class="value" style="font-size:12px;">${_walletBalancesHidden ? '***' : ('$' + formatNum(totalUSD, 0))}</span>
        </div>
    `;

    // Table rows
    var tableRowsHTML = Object.keys(state.wallet).map(function(coin) {
        var amt = state.wallet[coin] || 0;
        var valUSD = getAssetUSDValue(coin, amt);
        var meta = coinMeta[coin] || { name: coin, color: '#f0b90b' };
        var displayAmt = _walletBalancesHidden ? '******' : formatNum(amt, coin === 'USDT' || coin === 'DOGE' || coin === 'XRP' || coin === 'ADA' || coin === 'GKX' ? 2 : 6);
        var displayVal = _walletBalancesHidden ? '******' : ('$' + formatNum(valUSD, 2));

        return `
            <tr style="border-bottom:1px solid var(--border-light);">
                <td style="padding:14px;">
                    <div class="coin-cell" style="display:flex;align-items:center;gap:10px;">
                        <div class="coin-icon" style="background:${meta.color}22;color:${meta.color};width:32px;height:32px;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;">
                            ${coin.substring(0,2)}
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:14px;color:var(--text-primary);">${coin}</div>
                            <div style="font-size:11px;color:var(--text-secondary);">${meta.name}</div>
                        </div>
                    </div>
                </td>
                <td style="padding:14px;font-weight:700;font-family:var(--font-heading);">${displayAmt}</td>
                <td style="padding:14px;color:var(--text-primary);">${displayAmt}</td>
                <td style="padding:14px;color:var(--text-muted);">${_walletBalancesHidden ? '******' : '0.00'}</td>
                <td style="padding:14px;font-weight:700;color:var(--primary);">${displayVal}</td>
                <td style="padding:14px;text-align:right;">
                    <button class="action-btn-sm btn-open-deposit" data-coin="${coin}" style="background:var(--primary);color:var(--text-on-gold);font-weight:700;padding:5px 12px;border-radius:var(--radius-sm);font-size:11px;margin-right:6px;">Deposit</button>
                    <button class="action-btn-sm btn-open-withdraw" data-coin="${coin}" style="background:var(--bg-hover);border:1px solid var(--border-color);color:var(--text-primary);font-weight:600;padding:5px 12px;border-radius:var(--radius-sm);font-size:11px;">Withdraw</button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="wallet-container">
            <!-- Summary Portfolio Card -->
            <div class="wallet-summary-card">
                <div class="wallet-details">
                    <h2>Estimated Portfolio Value 
                        <button id="btn-toggle-balances" style="background:none; border:none; padding: 2px; cursor:pointer;" aria-label="Hide/Show Balances">
                            <i data-lucide="${_walletBalancesHidden ? 'eye-off' : 'eye'}" style="width: 18px; height: 18px; color: var(--text-secondary); vertical-align: middle;"></i>
                        </button>
                    </h2>
                    <div class="wallet-balance-row">
                        <div class="wallet-btc-balance" style="font-size:38px;">${displayUSD}</div>
                        <div class="wallet-fiat-balance">&asymp; ${displayBTC}</div>
                    </div>
                    <div class="wallet-actions">
                        <button class="btn-deposit" id="btn-wallet-deposit-main">⚡ Deposit Crypto</button>
                        <button class="btn-withdraw" id="btn-wallet-withdraw-main">Withdraw</button>
                        <button onclick="navigate('trade')" class="btn-withdraw" style="border-color:var(--border-gold);color:var(--primary);">Go to Trade</button>
                    </div>
                </div>

                <!-- Asset Allocation Donut Chart -->
                <div class="wallet-allocation">
                    <div class="wallet-chart-wrapper">
                        ${chartSVG}
                    </div>
                    <div class="allocation-legend">
                        ${legendHTML}
                    </div>
                </div>
            </div>

            <!-- Assets Table Card -->
            <div class="wallet-assets-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h3>Spot Asset Balances</h3>
                    <div style="font-size:12px;color:var(--text-muted);">
                        ${Object.keys(state.wallet).length} Assets Listed
                    </div>
                </div>
                <div class="market-table-container" style="overflow-x:auto;">
                    <table class="market-table" style="width:100%;border-collapse:collapse;font-size:13px;">
                        <thead>
                            <tr style="border-bottom:1px solid var(--border-light);text-align:left;color:var(--text-muted);font-size:11px;text-transform:uppercase;">
                                <th style="padding:12px 14px;">Coin</th>
                                <th style="padding:12px 14px;">Total Balance</th>
                                <th style="padding:12px 14px;">Available Balance</th>
                                <th style="padding:12px 14px;">In Orders</th>
                                <th style="padding:12px 14px;">Est. Value (USDT)</th>
                                <th style="padding:12px 14px;text-align:right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="wallet-assets-tbody">
                            ${tableRowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Deposit Overlay Modal -->
        <div class="modal-overlay hidden" id="deposit-modal">
            <div class="modal-card">
                <button class="modal-close" id="btn-close-deposit"><i data-lucide="x"></i></button>
                <div class="modal-header">
                    <h3>Deposit Cryptocurrency</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="deposit-coin-select">Select Asset</label>
                        <select class="form-control-select" id="deposit-coin-select">
                            ${Object.keys(state.wallet).map(function(c) { return '<option value="' + c + '">' + c + ' - ' + (coinMeta[c] ? coinMeta[c].name : c) + '</option>'; }).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="deposit-network-select">Select Deposit Network</label>
                        <select class="form-control-select" id="deposit-network-select">
                            <option value="bsc">BNB Smart Chain (BEP20) - Fast & Low Fee</option>
                            <option value="trx" selected>Tron (TRC20) - 0.5 USDT Fee</option>
                            <option value="eth">Ethereum (ERC20)</option>
                            <option value="sol">Solana Network (SPL)</option>
                        </select>
                    </div>
                    <div class="address-deposit-box">
                        <div class="qr-code-placeholder">
                            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="white"/>
                                <rect x="5" y="5" width="22" height="22" fill="black"/>
                                <rect x="9" y="9" width="14" height="14" fill="white"/>
                                <rect x="13" y="13" width="6" height="6" fill="black"/>
                                <rect x="73" y="5" width="22" height="22" fill="black"/>
                                <rect x="77" y="9" width="14" height="14" fill="white"/>
                                <rect x="81" y="13" width="6" height="6" fill="black"/>
                                <rect x="5" y="73" width="22" height="22" fill="black"/>
                                <rect x="9" y="77" width="14" height="14" fill="white"/>
                                <rect x="13" y="81" width="6" height="6" fill="black"/>
                                <rect x="35" y="15" width="15" height="5" fill="black"/>
                                <rect x="40" y="30" width="10" height="10" fill="black"/>
                                <rect x="15" y="45" width="25" height="10" fill="black"/>
                                <rect x="50" y="60" width="15" height="20" fill="black"/>
                                <rect x="70" y="40" width="20" height="15" fill="black"/>
                                <rect x="75" y="75" width="10" height="15" fill="black"/>
                            </svg>
                        </div>
                        <div class="wallet-address-display" style="display:flex;align-items:center;justify-content:space-between;width:100%;background:var(--bg-card);padding:10px 14px;border-radius:var(--radius-md);border:1px solid var(--border-color);">
                            <span id="deposit-address-val" style="font-family:monospace;font-size:12px;color:var(--primary);font-weight:700;">GKX98F72TYD97Fe9Pmn8837aLqWnmc9381k76P</span>
                            <button class="btn-copy-address" id="btn-copy-address" style="color:var(--text-primary);padding:4px;" title="Copy Address">
                                <i data-lucide="copy" style="width: 16px; height: 16px;"></i>
                            </button>
                        </div>
                        <span style="font-size: 11px; color: var(--text-secondary); text-align:left;">
                            ⚠️ Send only selected network cryptocurrency to this address. Credits are automatically verified in 12 blockchain confirmations.
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdraw Overlay Modal -->
        <div class="modal-overlay hidden" id="withdraw-modal">
            <div class="modal-card">
                <button class="modal-close" id="btn-close-withdraw"><i data-lucide="x"></i></button>
                <div class="modal-header">
                    <h3>Withdraw Cryptocurrency</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="withdraw-coin-select">Select Asset</label>
                        <select class="form-control-select" id="withdraw-coin-select">
                            ${Object.keys(state.wallet).map(function(c) { return '<option value="' + c + '">' + c + ' - ' + (coinMeta[c] ? coinMeta[c].name : c) + '</option>'; }).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="withdraw-address">Recipient Address</label>
                        <input type="text" class="form-control-input" id="withdraw-address" placeholder="Enter recipient wallet address (e.g. 0x... or T...)">
                    </div>
                    <div class="form-group">
                        <label for="withdraw-network-select">Transfer Network</label>
                        <select class="form-control-select" id="withdraw-network-select">
                            <option value="bsc">BNB Smart Chain (BEP20) [Fee: 0.10 USDT]</option>
                            <option value="trx" selected>Tron (TRC20) [Fee: 1.00 USDT]</option>
                            <option value="eth">Ethereum (ERC20) [Fee: 3.50 USDT]</option>
                            <option value="sol">Solana Network [Fee: 0.05 USDT]</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <div style="display:flex; justify-content:space-between;">
                            <label for="withdraw-amount">Amount</label>
                            <span style="font-size: 11px; color: var(--text-secondary);" id="withdraw-max-label">Avbl: 0.00</span>
                        </div>
                        <div style="position:relative;">
                            <input type="number" class="form-control-input" id="withdraw-amount" placeholder="0.00" step="any" min="0">
                            <button id="btn-withdraw-max" style="position:absolute; right:12px; top:12px; font-weight:700; color:var(--primary); font-size:12px;">MAX</button>
                        </div>
                    </div>
                    <button class="btn-auth-submit" id="btn-execute-withdraw" style="margin-top:10px;">Confirm Withdrawal</button>
                </div>
            </div>
        </div>
    `;

    // Balances Hide Toggle
    document.getElementById('btn-toggle-balances')?.addEventListener('click', function() {
        _walletBalancesHidden = !_walletBalancesHidden;
        window.renderWallet(container);
    });

    // Modals references
    const depModal = document.getElementById('deposit-modal');
    const withModal = document.getElementById('withdraw-modal');
    const depCoinSelect = document.getElementById('deposit-coin-select');
    const withCoinSelect = document.getElementById('withdraw-coin-select');
    const withMaxLabel = document.getElementById('withdraw-max-label');

    function openDeposit(coin) {
        if (depCoinSelect) depCoinSelect.value = coin || 'USDT';
        depModal?.classList.remove('hidden');
    }

    function openWithdraw(coin) {
        coin = coin || 'USDT';
        if (withCoinSelect) withCoinSelect.value = coin;
        var bal = state.wallet[coin] || 0;
        if (withMaxLabel) withMaxLabel.textContent = 'Avbl: ' + formatNum(bal, 4) + ' ' + coin;
        withModal?.classList.remove('hidden');
    }

    // Modal buttons
    document.getElementById('btn-wallet-deposit-main')?.addEventListener('click', function() { openDeposit('USDT'); });
    document.getElementById('btn-wallet-withdraw-main')?.addEventListener('click', function() { openWithdraw('USDT'); });
    document.getElementById('btn-close-deposit')?.addEventListener('click', function() { depModal?.classList.add('hidden'); });
    document.getElementById('btn-close-withdraw')?.addEventListener('click', function() { withModal?.classList.add('hidden'); });

    // Table item buttons
    document.querySelectorAll('.btn-open-deposit').forEach(function(btn) {
        btn.addEventListener('click', function() {
            openDeposit(btn.getAttribute('data-coin'));
        });
    });

    document.querySelectorAll('.btn-open-withdraw').forEach(function(btn) {
        btn.addEventListener('click', function() {
            openWithdraw(btn.getAttribute('data-coin'));
        });
    });

    withCoinSelect?.addEventListener('change', function(e) {
        var coin = e.target.value;
        var bal = state.wallet[coin] || 0;
        if (withMaxLabel) withMaxLabel.textContent = 'Avbl: ' + formatNum(bal, 4) + ' ' + coin;
    });

    // MAX button
    document.getElementById('btn-withdraw-max')?.addEventListener('click', function() {
        var coin = withCoinSelect ? withCoinSelect.value : 'USDT';
        var bal = state.wallet[coin] || 0;
        var amountInput = document.getElementById('withdraw-amount');
        if (amountInput) amountInput.value = bal;
    });

    // Copy address button
    document.getElementById('btn-copy-address')?.addEventListener('click', function() {
        var addr = document.getElementById('deposit-address-val')?.textContent || '';
        navigator.clipboard.writeText(addr).then(function() {
            showToast('📋 Deposit address copied to clipboard!', 'success');
        }).catch(function() {
            showToast('Address: ' + addr, 'info');
        });
    });

    // Submit withdrawal
    document.getElementById('btn-execute-withdraw')?.addEventListener('click', function() {
        var coin = withCoinSelect ? withCoinSelect.value : 'USDT';
        var addr = document.getElementById('withdraw-address')?.value.trim() || '';
        var amt = parseFloat(document.getElementById('withdraw-amount')?.value) || 0;
        var userBal = state.wallet[coin] || 0;

        if (!addr) {
            alert('Please enter a recipient wallet address.');
            return;
        }
        if (amt <= 0) {
            alert('Please enter a valid withdrawal amount.');
            return;
        }
        if (amt > userBal) {
            alert('Insufficient ' + coin + ' balance. You have ' + formatNum(userBal, 4) + ' ' + coin + ' available.');
            return;
        }

        // Deduct
        state.wallet[coin] = parseFloat((userBal - amt).toFixed(6));
        state.orders.push({
            id: 'w' + Date.now(),
            pair: coin + '/WITHDRAW',
            side: 'sell',
            price: 0,
            qty: amt,
            status: 'completed',
            type: 'withdrawal',
            time: Date.now()
        });

        saveState();
        updateHeaderBalance();
        withModal?.classList.add('hidden');
        showToast('✅ Withdrawal of ' + amt + ' ' + coin + ' submitted successfully!', 'success');
        window.renderWallet(container);
    });

    if (window.lucide) lucide.createIcons();
};
