let balancesHidden = false;

window.renderWallet = function(params) {
    // Computes balances values in USDT/USD
    let totals = calculateAssetValues();
    const isDark = state.theme === 'dark';

    // Renders asset table rows
    let tableRowsHTML = '';
    for (const [symbol, amount] of Object.entries(state.user.balances)) {
        const valUSD = totals.values[symbol] || 0;
        const percent = totals.totalUSD > 0 ? (valUSD / totals.totalUSD) * 100 : 0;
        
        const displayAmt = balancesHidden ? '******' : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
        const displayUSD = balancesHidden ? '******' : `$${valUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        tableRowsHTML += `
            <tr>
                <td>
                    <div class="coin-cell">
                        <div class="coin-icon" style="background-color: ${state.tickers[symbol+'/USDT'] ? state.tickers[symbol+'/USDT'].color : '#f0b90b'}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: #000;">
                            ${symbol[0]}
                        </div>
                        <div>
                            <span class="coin-symbol">${symbol}</span>
                            <span class="coin-name">${getCoinName(symbol)}</span>
                        </div>
                    </div>
                </td>
                <td>${displayAmt}</td>
                <td>${displayAmt}</td>
                <td>${balancesHidden ? '******' : '0.00'}</td>
                <td>${displayUSD}</td>
                <td>
                    <button class="action-btn-sm" onclick="triggerDepositModal('${symbol}')">Deposit</button>
                    <button class="action-btn-sm" style="margin-left: 6px;" onclick="triggerWithdrawModal('${symbol}')">Withdraw</button>
                </td>
            </tr>
        `;
    }

    // Build the SVG Allocation Donut chart dynamically
    const chartSVG = generateDonutChartSVG(totals.percentages);

    const btcPrice = state.tickers['BTC/USDT'].price;
    const estBTC = totals.totalUSD / btcPrice;

    const displayBtcTotal = balancesHidden ? '******' : `${estBTC.toFixed(6)} BTC`;
    const displayUSDTotal = balancesHidden ? '******' : `$${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return `
        <div class="wallet-container">
            <!-- Summary Portfolio Card -->
            <div class="wallet-summary-card">
                <div class="wallet-details">
                    <h2>Estimated Balance 
                        <button id="btn-toggle-balances" style="background:none; border:none; padding: 2px;" aria-label="Hide/Show Balances">
                            <i data-lucide="${balancesHidden ? 'eye-off' : 'eye'}" style="width: 18px; height: 18px; color: var(--text-secondary); vertical-align: middle;"></i>
                        </button>
                    </h2>
                    <div class="wallet-balance-row">
                        <div class="wallet-btc-balance">${displayBtcTotal}</div>
                        <div class="wallet-fiat-balance">&asymp; ${displayUSDTotal}</div>
                    </div>
                    <div class="wallet-actions">
                        <button class="btn-deposit" id="btn-wallet-deposit">Deposit</button>
                        <button class="btn-withdraw" id="btn-wallet-withdraw">Withdraw</button>
                    </div>
                </div>

                <!-- Asset Allocation Donut Chart -->
                <div class="wallet-allocation">
                    <div class="wallet-chart-wrapper">
                        ${chartSVG}
                    </div>
                    <div class="allocation-legend">
                        ${generateLegendHTML(totals.percentages)}
                    </div>
                </div>
            </div>

            <!-- Assets Table Card -->
            <div class="wallet-assets-card">
                <h3>Asset Balances</h3>
                <div class="market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th>Coin</th>
                                <th>Total Balance</th>
                                <th>Available Balance</th>
                                <th>In Order</th>
                                <th>Est. Value (USDT)</th>
                                <th>Actions</th>
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
                    <h3>Deposit Crypto</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="deposit-coin-select">Select Coin</label>
                        <select class="form-control-select" id="deposit-coin-select">
                            <!-- Populate dynamically -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="deposit-network-select">Select Network</label>
                        <select class="form-control-select" id="deposit-network-select">
                            <option value="bsc">BNB Smart Chain (BEP20)</option>
                            <option value="eth">Ethereum (ERC20)</option>
                            <option value="trx" selected>Tron (TRC20)</option>
                        </select>
                    </div>
                    <div class="address-deposit-box">
                        <div class="qr-code-placeholder">
                            <!-- SVG QR code simulation -->
                            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="white"/>
                                <!-- Simulated QR squares -->
                                <rect x="5" y="5" width="20" height="20" fill="black"/>
                                <rect x="10" y="10" width="10" height="10" fill="white"/>
                                <rect x="75" y="5" width="20" height="20" fill="black"/>
                                <rect x="80" y="10" width="10" height="10" fill="white"/>
                                <rect x="5" y="75" width="20" height="20" fill="black"/>
                                <rect x="10" y="80" width="10" height="10" fill="white"/>
                                <!-- Random matrix blocks -->
                                <rect x="35" y="15" width="15" height="5" fill="black"/>
                                <rect x="40" y="30" width="10" height="10" fill="black"/>
                                <rect x="15" y="45" width="25" height="10" fill="black"/>
                                <rect x="50" y="60" width="15" height="20" fill="black"/>
                                <rect x="70" y="40" width="20" height="15" fill="black"/>
                                <rect x="75" y="75" width="10" height="15" fill="black"/>
                            </svg>
                        </div>
                        <div class="wallet-address-display">
                            <span id="deposit-address-val">TYD97Fe9Pmn8837aLqWnmc9381k76Pqa97A</span>
                            <button class="btn-copy-address" id="btn-copy-address" aria-label="Copy Address">
                                <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
                            </button>
                        </div>
                        <span style="font-size: 11px; color: var(--text-secondary);">Send only the selected network token to this deposit address. Sending other tokens may result in permanent loss.</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdraw Overlay Modal -->
        <div class="modal-overlay hidden" id="withdraw-modal">
            <div class="modal-card">
                <button class="modal-close" id="btn-close-withdraw"><i data-lucide="x"></i></button>
                <div class="modal-header">
                    <h3>Withdraw Crypto</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="withdraw-coin-select">Select Coin</label>
                        <select class="form-control-select" id="withdraw-coin-select">
                            <!-- Populate dynamically -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="withdraw-address">Recipient Address</label>
                        <input type="text" class="form-control-input" id="withdraw-address" placeholder="Enter recipient wallet address">
                    </div>
                    <div class="form-group">
                        <label for="withdraw-network-select">Select Network</label>
                        <select class="form-control-select" id="withdraw-network-select">
                            <option value="bsc">BNB Smart Chain (BEP20) [Fee: 0.10 USDT]</option>
                            <option value="eth">Ethereum (ERC20) [Fee: 3.50 USDT]</option>
                            <option value="trx" selected>Tron (TRC20) [Fee: 1.00 USDT]</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <div style="display:flex; justify-content:space-between;">
                            <label for="withdraw-amount">Amount</label>
                            <span style="font-size: 11px; color: var(--text-secondary);" id="withdraw-max-label">Avbl: 0.00</span>
                        </div>
                        <div style="position:relative;">
                            <input type="number" class="form-control-input" id="withdraw-amount" placeholder="0.00" step="any" min="0">
                            <button id="btn-withdraw-max" style="position:absolute; right:12px; top:10px; font-weight:600; color:var(--primary); font-size:12px;">MAX</button>
                        </div>
                    </div>
                    <button class="btn-modal-action" id="btn-execute-withdraw">Submit Withdrawal</button>
                </div>
            </div>
        </div>
    `;
}

window.initWallet = function(params) {
    // Balances Hide Toggle
    const toggleBtn = document.getElementById('btn-toggle-balances');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            balancesHidden = !balancesHidden;
            // Reload wallet view to redraw fields with hidden/shown states
            window.location.reload();
        });
    }

    // Modal wires
    const depModal = document.getElementById('deposit-modal');
    const withModal = document.getElementById('withdraw-modal');
    
    const depBtn = document.getElementById('btn-wallet-deposit');
    const withBtn = document.getElementById('btn-wallet-withdraw');
    
    const depClose = document.getElementById('btn-close-deposit');
    const withClose = document.getElementById('btn-close-withdraw');

    if (depBtn && depModal) {
        depBtn.addEventListener('click', () => triggerDepositModal('USDT'));
        depClose.addEventListener('click', () => depModal.classList.add('hidden'));
    }

    if (withBtn && withModal) {
        withBtn.addEventListener('click', () => triggerWithdrawModal('USDT'));
        withClose.addEventListener('click', () => withModal.classList.add('hidden'));
    }

    // Copy address box
    const copyBtn = document.getElementById('btn-copy-address');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const addrText = document.getElementById('deposit-address-val').textContent;
            navigator.clipboard.writeText(addrText).then(() => {
                alert('Deposit address copied to clipboard!');
            }).catch(e => {
                console.error(e);
            });
        });
    }

    // Modal forms coin selectors populating
    const depCoinSelect = document.getElementById('deposit-coin-select');
    const withCoinSelect = document.getElementById('withdraw-coin-select');
    let coinOptions = '';
    
    Object.keys(state.user.balances).forEach(sym => {
        coinOptions += `<option value="${sym}">${sym}</option>`;
    });

    if (depCoinSelect) depCoinSelect.innerHTML = coinOptions;
    if (withCoinSelect) {
        withCoinSelect.innerHTML = coinOptions;
        withCoinSelect.addEventListener('change', (e) => {
            updateWithdrawMaxLabel(e.target.value);
        });
    }

    // Withdraw max btn
    const maxBtn = document.getElementById('btn-withdraw-max');
    if (maxBtn) {
        maxBtn.addEventListener('click', () => {
            const sym = withCoinSelect.value;
            const bal = state.user.balances[sym] || 0;
            document.getElementById('withdraw-amount').value = bal;
        });
    }

    // Execute withdrawal trigger
    const submitWithBtn = document.getElementById('btn-execute-withdraw');
    if (submitWithBtn) {
        submitWithBtn.addEventListener('click', processWithdrawal);
    }
}

// Open Deposit Modal with pre-selected coin
window.triggerDepositModal = function(coin) {
    const depModal = document.getElementById('deposit-modal');
    const depCoinSelect = document.getElementById('deposit-coin-select');
    
    if (depModal && depCoinSelect) {
        depCoinSelect.value = coin;
        depModal.classList.remove('hidden');
    }
};

// Open Withdraw Modal with pre-selected coin
window.triggerWithdrawModal = function(coin) {
    const withModal = document.getElementById('withdraw-modal');
    const withCoinSelect = document.getElementById('withdraw-coin-select');
    
    if (withModal && withCoinSelect) {
        withCoinSelect.value = coin;
        updateWithdrawMaxLabel(coin);
        withModal.classList.remove('hidden');
    }
};

function updateWithdrawMaxLabel(coin) {
    const maxLabel = document.getElementById('withdraw-max-label');
    if (maxLabel) {
        const bal = state.user.balances[coin] || 0;
        maxLabel.textContent = `Avbl: ${bal.toFixed(4)} ${coin}`;
    }
}

function processWithdrawal() {
    const coinSelect = document.getElementById('withdraw-coin-select');
    const addressInput = document.getElementById('withdraw-address');
    const amountInput = document.getElementById('withdraw-amount');
    
    const coin = coinSelect.value;
    const address = addressInput.value.trim();
    const amount = parseFloat(amountInput.value) || 0;
    const userBalance = state.user.balances[coin] || 0;

    if (address === '') {
        alert('Please enter a recipient wallet address.');
        return;
    }

    if (amount <= 0) {
        alert('Please enter a valid withdrawal amount.');
        return;
    }

    if (userBalance < amount) {
        alert(`Insufficient ${coin} balance. Current balance is ${userBalance} ${coin}.`);
        return;
    }

    // Deduct balance
    state.user.balances[coin] -= amount;

    // Log transaction
    state.orderHistory.unshift({
        id: 'w' + Date.now().toString().slice(-6),
        time: new Date().toISOString().replace('T', ' ').slice(0, 19),
        pair: `${coin}/WITHDRAW`,
        type: 'Withdrawal',
        side: 'Sell',
        price: 0,
        amount: amount,
        total: amount,
        status: 'Processing'
    });

    // Save and reload state
    localStorage.setItem('binance_clone_state', JSON.stringify({
        user: state.user,
        favorites: state.favorites,
        openOrders: state.openOrders,
        orderHistory: state.orderHistory,
        p2pOrders: state.p2pOrders,
        theme: state.theme
    }));

    alert(`Withdrawal request submitted! Sent ${amount} ${coin} to ${address}.`);
    
    // Close modal & reload page to update view
    document.getElementById('withdraw-modal').classList.add('hidden');
    
    // Update header balance
    updateHeaderBalance();
    
    // Reroute back to wallet to draw updated values
    routerReload();
}

function routerReload() {
    // Simply trigger router hash refresh
    const hash = window.location.hash;
    window.location.hash = '';
    window.location.hash = hash;
}

// Asset Calculations Helper
function calculateAssetValues() {
    let totalUSD = state.user.balances.USDT;
    let values = { USDT: state.user.balances.USDT };

    for (const [symbol, amount] of Object.entries(state.user.balances)) {
        if (symbol === 'USDT') continue;
        const pair = `${symbol}/USDT`;
        if (state.tickers[pair]) {
            const val = amount * state.tickers[pair].price;
            values[symbol] = val;
            totalUSD += val;
        } else {
            values[symbol] = 0;
        }
    }

    // Percentages
    let percentages = {};
    for (const [symbol, valUSD] of Object.entries(values)) {
        percentages[symbol] = totalUSD > 0 ? (valUSD / totalUSD) * 100 : 0;
    }

    return {
        totalUSD,
        values,
        percentages
    };
}

function getCoinName(symbol) {
    if (symbol === 'USDT') return 'Tether USD';
    const pair = `${symbol}/USDT`;
    return state.tickers[pair] ? state.tickers[pair].name : symbol;
}

// Generate Legend HTML
function generateLegendHTML(percentages) {
    let html = '';
    for (const [symbol, pct] of Object.entries(percentages)) {
        if (pct === 0) continue;
        const color = symbol === 'USDT' ? '#0ecb81' : (state.tickers[symbol+'/USDT'] ? state.tickers[symbol+'/USDT'].color : '#fcd535');
        html += `
            <div class="legend-item">
                <div class="legend-color-box" style="background-color: ${color};"></div>
                <span>${symbol}: ${pct.toFixed(1)}%</span>
            </div>
        `;
    }
    return html;
}

// Generate SVG Donut Chart
function generateDonutChartSVG(percentages) {
    let cumulativePercent = 0;
    let paths = '';
    
    // Filters out zero balance values
    const entries = Object.entries(percentages).filter(([_, pct]) => pct > 0);
    
    if (entries.length === 0) {
        return `
            <svg class="donut-chart" viewBox="0 0 42 42" width="100%" height="100%">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" stroke-width="4.5"></circle>
            </svg>
            <div class="chart-center-text">
                <span class="title">Assets</span>
                <span class="value">$0.00</span>
            </div>
        `;
    }

    // SVG parameters
    // Radius 15.91549430918954 makes the circumference exactly 100!
    // This allows stroke-dasharray and stroke-dashoffset to easily represent percentages!
    const radius = 15.91549430918954;
    const rval = 21;

    entries.forEach(([symbol, pct]) => {
        const color = symbol === 'USDT' ? '#0ecb81' : (state.tickers[symbol+'/USDT'] ? state.tickers[symbol+'/USDT'].color : '#fcd535');
        
        const strokeDasharray = `${pct} ${100 - pct}`;
        const strokeDashoffset = 100 - cumulativePercent + 25; // +25 to offset starting angle from bottom to top
        
        paths += `
            <circle cx="${rval}" cy="${rval}" r="${radius}" 
                    fill="transparent" 
                    stroke="${color}" 
                    stroke-width="5" 
                    stroke-dasharray="${strokeDasharray}" 
                    stroke-dashoffset="${strokeDashoffset}">
            </circle>
        `;
        cumulativePercent += pct;
    });

    let totals = calculateAssetValues();
    const displayCenterVal = balancesHidden ? '******' : `$${totals.totalUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

    return `
        <svg class="donut-chart" viewBox="0 0 42 42" width="100%" height="100%">
            <!-- Grey track underlay -->
            <circle cx="21" cy="21" r="${radius}" fill="transparent" stroke="var(--border-light)" stroke-width="5"></circle>
            ${paths}
        </svg>
        <div class="chart-center-text">
            <span class="title">Total</span>
            <span class="value" style="font-size: 11px;">${displayCenterVal}</span>
        </div>
    `;
}
