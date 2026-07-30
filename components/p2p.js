let p2pMode = 'buy'; // 'buy' or 'sell'
let p2pActiveToken = 'USDT';
let p2pActiveFiat = 'USD';
let p2pActivePayment = 'all';

// Mock list of P2P ads
const mockP2PAds = {
    USD: [
        { id: 'ad1', merchant: 'SwiftExchanger', orders: 1845, completion: 99.4, price: 1.01, available: 18500, minLimit: 100, maxLimit: 5000, payments: ['Bank Transfer', 'Revolut'] },
        { id: 'ad2', merchant: 'Apex_Crypto', orders: 842, completion: 98.1, price: 1.02, available: 9400, minLimit: 50, maxLimit: 2000, payments: ['PayPal', 'Revolut'] },
        { id: 'ad3', merchant: 'GlobalTrader_Pro', orders: 3410, completion: 99.8, price: 1.03, available: 45000, minLimit: 500, maxLimit: 15000, payments: ['Bank Transfer'] }
    ],
    INR: [
        { id: 'ad4', merchant: 'PayCrypto_India', orders: 2510, completion: 98.9, price: 87.45, available: 12500, minLimit: 1000, maxLimit: 100000, payments: ['UPI', 'Bank Transfer'] },
        { id: 'ad5', merchant: 'Karan_OTC', orders: 934, completion: 97.4, price: 87.90, available: 6200, minLimit: 5000, maxLimit: 50000, payments: ['UPI', 'IMPS'] },
        { id: 'ad6', merchant: 'Royal_Fills', orders: 489, completion: 99.1, price: 88.10, available: 15800, minLimit: 10000, maxLimit: 150000, payments: ['Bank Transfer'] }
    ],
    EUR: [
        { id: 'ad7', merchant: 'EuroCrypto_Hub', orders: 1290, completion: 99.2, price: 0.94, available: 22000, minLimit: 100, maxLimit: 10000, payments: ['SEPA', 'Revolut'] },
        { id: 'ad8', merchant: 'VisaFastPay', orders: 450, completion: 96.5, price: 0.95, available: 4800, minLimit: 50, maxLimit: 1500, payments: ['SEPA', 'PayPal'] }
    ]
};

window.renderP2P = function(params) {
    // Generate Token Tabs
    const tokens = ['USDT', 'BTC', 'ETH', 'BNB'];
    let tokenTabsHTML = '';
    tokens.forEach(tok => {
        tokenTabsHTML += `
            <button class="p2p-token-tab ${p2pActiveToken === tok ? 'active' : ''}" data-token="${tok}">${tok}</button>
        `;
    });

    // Options for payments
    const payments = ['All', 'Bank Transfer', 'Revolut', 'PayPal', 'UPI', 'SEPA'];
    let paymentOptsHTML = '';
    payments.forEach(p => {
        paymentOptsHTML += `<option value="${p.toLowerCase()}" ${p2pActivePayment === p.toLowerCase() ? 'selected' : ''}>${p}</option>`;
    });

    return `
        <div class="p2p-container">
            <div class="p2p-header">
                <h1>P2P Trading</h1>
                <p style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">Buy and sell crypto assets locally using multiple payment methods.</p>
            </div>

            <!-- Toggles Section -->
            <div class="p2p-toggle-bar">
                <div class="p2p-action-toggles">
                    <button class="p2p-action-btn buy-p2p ${p2pMode === 'buy' ? 'active' : ''}" data-mode="buy">Buy</button>
                    <button class="p2p-action-btn sell-p2p ${p2pMode === 'sell' ? 'active' : ''}" data-mode="sell">Sell</button>
                </div>
                <div class="p2p-tokens-list">
                    ${tokenTabsHTML}
                </div>
            </div>

            <!-- Filters Area -->
            <div class="p2p-filters-row">
                <div class="p2p-filter-item">
                    <label for="p2p-amount">Amount</label>
                    <input type="number" class="p2p-filter-input" id="p2p-amount" placeholder="Enter amount...">
                </div>
                <div class="p2p-filter-item">
                    <label for="p2p-fiat">Fiat Currency</label>
                    <select class="p2p-filter-select" id="p2p-fiat">
                        <option value="USD" ${p2pActiveFiat === 'USD' ? 'selected' : ''}>USD ($)</option>
                        <option value="INR" ${p2pActiveFiat === 'INR' ? 'selected' : ''}>INR (₹)</option>
                        <option value="EUR" ${p2pActiveFiat === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                    </select>
                </div>
                <div class="p2p-filter-item">
                    <label for="p2p-payment">Payment Method</label>
                    <select class="p2p-filter-select" id="p2p-payment">
                        ${paymentOptsHTML}
                    </select>
                </div>
                <button class="action-btn-sm" id="btn-p2p-reset" style="height: 38px; padding: 0 16px;">Reset</button>
            </div>

            <!-- Ads List Card -->
            <div class="p2p-ads-card">
                <div class="market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th>Advertiser</th>
                                <th>Price</th>
                                <th>Available / Limit</th>
                                <th>Payment Method</th>
                                <th style="text-align: right;">Trade Status</th>
                            </tr>
                        </thead>
                        <tbody id="p2p-ads-tbody">
                            <!-- Generated dynamically by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Deal Execution Modal Overlay -->
        <div class="modal-overlay hidden" id="p2p-deal-modal">
            <div class="modal-card">
                <button class="modal-close" id="btn-close-p2p-deal"><i data-lucide="x"></i></button>
                <div class="modal-header">
                    <h3 id="p2p-deal-title">Buy USDT</h3>
                </div>
                <div class="modal-body">
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between;">
                        <span>Price Reference:</span>
                        <strong id="p2p-deal-ref-price" class="text-green">1.02 USD</strong>
                    </div>
                    <div class="form-group">
                        <label for="p2p-deal-fiat-amt" id="p2p-deal-fiat-label">I Want to Pay (USD)</label>
                        <div style="position:relative;">
                            <input type="number" class="form-control-input" id="p2p-deal-fiat-amt" placeholder="0.00">
                            <span style="position:absolute; right:12px; top:10px; font-weight:600; color:var(--text-secondary);" id="p2p-deal-fiat-symbol">USD</span>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 12px;">
                        <label for="p2p-deal-crypto-amt" id="p2p-deal-crypto-label">I Will Receive (USDT)</label>
                        <div style="position:relative;">
                            <input type="number" class="form-control-input" id="p2p-deal-crypto-amt" placeholder="0.00" readonly>
                            <span style="position:absolute; right:12px; top:10px; font-weight:600; color:var(--text-secondary);" id="p2p-deal-crypto-symbol">USDT</span>
                        </div>
                    </div>
                    <div style="background-color: var(--bg-hover); padding: 12px; border-radius: var(--border-radius-sm); font-size: 11px; color: var(--text-secondary); margin-top: 16px;">
                        <strong>Merchant Terms:</strong>
                        <p style="margin-top: 4px;" id="p2p-deal-terms">Terms: Bank transfer only. Please write your transaction ID. Do not include crypto related words in remark.</p>
                    </div>
                    <button class="btn-modal-action" id="btn-submit-p2p-deal" style="margin-top: 20px;">Confirm Purchase</button>
                </div>
            </div>
        </div>
    `;
}

window.initP2P = function(params) {
    p2pMode = 'buy';
    p2pActiveToken = 'USDT';
    p2pActiveFiat = 'USD';
    p2pActivePayment = 'all';

    // Wire actions toggles Buy/Sell
    document.querySelectorAll('.p2p-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.p2p-action-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            p2pMode = btn.dataset.mode;
            renderP2PAds();
        });
    });

    // Wire Token Tabs selectors
    document.querySelectorAll('.p2p-token-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.p2p-token-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            p2pActiveToken = tab.dataset.token;
            renderP2PAds();
        });
    });

    // Wire filters inputs
    const filterFiat = document.getElementById('p2p-fiat');
    const filterPayment = document.getElementById('p2p-payment');
    const filterAmount = document.getElementById('p2p-amount');
    const resetBtn = document.getElementById('btn-p2p-reset');

    if (filterFiat) {
        filterFiat.addEventListener('change', (e) => {
            p2pActiveFiat = e.target.value;
            renderP2PAds();
        });
    }

    if (filterPayment) {
        filterPayment.addEventListener('change', (e) => {
            p2pActivePayment = e.target.value;
            renderP2PAds();
        });
    }

    if (filterAmount) {
        filterAmount.addEventListener('input', () => {
            renderP2PAds();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (filterAmount) filterAmount.value = '';
            if (filterFiat) {
                filterFiat.value = 'USD';
                p2pActiveFiat = 'USD';
            }
            if (filterPayment) {
                filterPayment.value = 'all';
                p2pActivePayment = 'all';
            }
            renderP2PAds();
        });
    }

    // Modal close hooks
    const dealModal = document.getElementById('p2p-deal-modal');
    const closeDeal = document.getElementById('btn-close-p2p-deal');
    if (closeDeal && dealModal) {
        closeDeal.addEventListener('click', () => {
            dealModal.classList.add('hidden');
        });
    }

    // Bind math converter inside the Modal form
    setupP2PModalFormMath();

    renderP2PAds();
}

function renderP2PAds() {
    const tbody = document.getElementById('p2p-ads-tbody');
    if (!tbody) return;

    const ads = mockP2PAds[p2pActiveFiat] || [];
    const filterAmtVal = parseFloat(document.getElementById('p2p-amount')?.value) || 0;

    // Filter local ads list
    const filteredAds = ads.filter(ad => {
        // Payment filter
        if (p2pActivePayment !== 'all') {
            const hasPayment = ad.payments.some(pay => pay.toLowerCase() === p2pActivePayment);
            if (!hasPayment) return false;
        }

        // Amount limit filter
        if (filterAmtVal > 0) {
            if (filterAmtVal < ad.minLimit || filterAmtVal > ad.maxLimit) return false;
        }

        return true;
    });

    if (filteredAds.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    No merchant advertisements match the selected filters.
                </td>
            </tr>
        `;
        return;
    }

    // Currency signs
    const fiatSign = p2pActiveFiat === 'INR' ? '₹' : (p2pActiveFiat === 'EUR' ? '€' : '$');

    let html = '';
    filteredAds.forEach(ad => {
        // Adjust price dynamically depending on selected token factor
        let factor = 1.0;
        if (p2pActiveToken === 'BTC') factor = state.tickers['BTC/USDT'].price;
        if (p2pActiveToken === 'ETH') factor = state.tickers['ETH/USDT'].price;
        if (p2pActiveToken === 'BNB') factor = state.tickers['BNB/USDT'].price;

        const basePrice = ad.price * factor;
        
        let paymentsHTML = '';
        ad.payments.forEach(p => {
            paymentsHTML += `<span class="payment-badge">${p}</span>`;
        });

        const btnClass = p2pMode === 'buy' ? 'buy-bg' : 'sell-bg';
        const btnLabel = p2pMode === 'buy' ? `Buy ${p2pActiveToken}` : `Sell ${p2pActiveToken}`;

        html += `
            <tr>
                <td>
                    <div class="merchant-info">
                        <span class="merchant-name">${ad.merchant} <i data-lucide="shield-check" style="fill: var(--primary); color: #0b0e11;"></i></span>
                        <span class="merchant-stats">${ad.orders} orders | ${ad.completion}% completion</span>
                    </div>
                </td>
                <td>
                    <div class="p2p-price-cell">${fiatSign}${basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span>/ ${p2pActiveToken}</span></div>
                </td>
                <td>
                    <div style="font-size: 13px;">Available: <span style="font-weight:600;">${ad.available.toLocaleString()} ${p2pActiveToken}</span></div>
                    <div style="font-size: 11px; color: var(--text-secondary);">Limit: ${fiatSign}${ad.minLimit.toLocaleString()} - ${fiatSign}${ad.maxLimit.toLocaleString()}</div>
                </td>
                <td>${paymentsHTML}</td>
                <td style="text-align: right;">
                    <button class="btn-p2p-action ${btnClass}" onclick="openP2PDealModal('${ad.id}', ${basePrice}, ${ad.minLimit}, ${ad.maxLimit})">${btnLabel}</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Global hook to launch modal
let activeDealData = null;
window.openP2PDealModal = function(adId, price, minLimit, maxLimit) {
    if (!state.user.isLoggedIn) {
        alert('Please login to place P2P trades.');
        window.location.hash = '#auth';
        return;
    }

    const modal = document.getElementById('p2p-deal-modal');
    if (!modal) return;

    activeDealData = { adId, price, minLimit, maxLimit };

    const title = document.getElementById('p2p-deal-title');
    const refPrice = document.getElementById('p2p-deal-ref-price');
    const fiatLabel = document.getElementById('p2p-deal-fiat-label');
    const fiatSymbol = document.getElementById('p2p-deal-fiat-symbol');
    const cryptoLabel = document.getElementById('p2p-deal-crypto-label');
    const cryptoSymbol = document.getElementById('p2p-deal-crypto-symbol');
    const terms = document.getElementById('p2p-deal-terms');
    const submitBtn = document.getElementById('btn-submit-p2p-deal');

    const actionText = p2pMode === 'buy' ? 'Buy' : 'Sell';
    
    title.textContent = `${actionText} ${p2pActiveToken}`;
    
    const fiatSign = p2pActiveFiat === 'INR' ? '₹' : (p2pActiveFiat === 'EUR' ? '€' : '$');
    refPrice.textContent = `${fiatSign}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${p2pActiveToken}`;
    refPrice.className = p2pMode === 'buy' ? 'text-green' : 'text-red';
    
    fiatLabel.textContent = p2pMode === 'buy' ? `I want to Pay (${p2pActiveFiat})` : `I will Receive (${p2pActiveFiat})`;
    fiatSymbol.textContent = p2pActiveFiat;
    cryptoLabel.textContent = p2pMode === 'buy' ? `I will Receive (${p2pActiveToken})` : `I want to Sell (${p2pActiveToken})`;
    cryptoSymbol.textContent = p2pActiveToken;

    terms.textContent = p2pMode === 'buy' 
        ? `Ensure transfer is sent from your matching name account. Complete transaction within 15 minutes.`
        : `Transfer details will be visible after confirmation. Only release crypto asset AFTER verifying the bank credit.`;

    submitBtn.textContent = p2pMode === 'buy' ? `Confirm Purchase` : `Confirm Sell`;
    submitBtn.className = p2pMode === 'buy' ? 'btn-modal-action buy-btn' : 'btn-modal-action sell-btn';
    if (p2pMode === 'buy') {
        submitBtn.style.backgroundColor = 'var(--green)';
    } else {
        submitBtn.style.backgroundColor = 'var(--red)';
    }

    // Reset fields
    document.getElementById('p2p-deal-fiat-amt').value = '';
    document.getElementById('p2p-deal-crypto-amt').value = '';

    modal.classList.remove('hidden');
};

function setupP2PModalFormMath() {
    const fiatInput = document.getElementById('p2p-deal-fiat-amt');
    const cryptoInput = document.getElementById('p2p-deal-crypto-amt');
    const submitBtn = document.getElementById('btn-submit-p2p-deal');

    if (fiatInput) {
        fiatInput.addEventListener('input', () => {
            if (!activeDealData) return;
            const val = parseFloat(fiatInput.value) || 0;
            cryptoInput.value = (val / activeDealData.price).toFixed(6);
        });

        // Submit Action
        submitBtn.addEventListener('click', () => {
            if (!activeDealData) return;
            
            const fiatAmt = parseFloat(fiatInput.value) || 0;
            const cryptoAmt = parseFloat(cryptoInput.value) || 0;

            // Validate Limits
            if (fiatAmt < activeDealData.minLimit || fiatAmt > activeDealData.maxLimit) {
                alert(`Transaction amount must be between ${activeDealData.minLimit} and ${activeDealData.maxLimit} ${p2pActiveFiat}.`);
                return;
            }

            // If Selling, validate crypto balance
            if (p2pMode === 'sell') {
                const userCryptoBal = state.user.balances[p2pActiveToken] || 0;
                if (userCryptoBal < cryptoAmt) {
                    alert(`Insufficient ${p2pActiveToken} balance to sell. Current: ${userCryptoBal} ${p2pActiveToken}.`);
                    return;
                }
                
                // Subtract crypto asset, add mock fiat equivalent
                state.user.balances[p2pActiveToken] -= cryptoAmt;
                state.user.balances.USDT += (cryptoAmt * state.tickers[p2pActiveToken+'/USDT']?.price) || (cryptoAmt);
            } else {
                // Buying: Add crypto asset to wallet (USDT, BTC, etc.)
                state.user.balances[p2pActiveToken] = (state.user.balances[p2pActiveToken] || 0) + cryptoAmt;
            }

            // Log history
            state.orderHistory.unshift({
                id: 'p2p-' + Date.now().toString().slice(-6),
                time: new Date().toISOString().replace('T', ' ').slice(0, 19),
                pair: `${p2pActiveToken}/P2P`,
                type: `P2P ${p2pMode === 'buy' ? 'Buy' : 'Sell'}`,
                side: p2pMode === 'buy' ? 'Buy' : 'Sell',
                price: activeDealData.price,
                amount: cryptoAmt,
                total: fiatAmt,
                status: 'Filled'
            });

            // Save state
            localStorage.setItem('binance_clone_state', JSON.stringify({
                user: state.user,
                favorites: state.favorites,
                openOrders: state.openOrders,
                orderHistory: state.orderHistory,
                p2pOrders: state.p2pOrders,
                theme: state.theme
            }));

            alert(`P2P Transaction Successful! Order status: Filled. Assets modified in your Wallet.`);
            
            // Close modal
            document.getElementById('p2p-deal-modal').classList.add('hidden');
            
            updateHeaderBalance();
        });
    }
}
