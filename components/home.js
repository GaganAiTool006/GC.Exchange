window.renderHome = function(params) {
    // Select a few coins to render in the mini-ticker row
    const tickerKeys = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'];
    
    let tickerCardsHTML = '';
    tickerKeys.forEach(key => {
        const item = state.tickers[key];
        if (!item) return;
        
        const isPositive = item.change24h >= 0;
        const sign = isPositive ? '+' : '';
        const classColor = isPositive ? 'text-green' : 'text-red';
        
        tickerCardsHTML += `
            <div class="ticker-card" id="home-card-${item.symbol}" onclick="window.location.hash='#trade?pair=${item.symbol}/USDT'">
                <div class="ticker-header">
                    <span class="ticker-pair">${item.symbol}/USDT</span>
                    <span class="ticker-change ${classColor}">${sign}${item.change24h.toFixed(2)}%</span>
                </div>
                <div class="ticker-price" id="home-price-${item.symbol}">$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="ticker-vol">Vol: $${(item.volume24h * item.price / 1000).toFixed(1)}K</div>
            </div>
        `;
    });

    // Create the select options for quick swap
    let tokenOptionsHTML = '';
    const availableSymbols = Object.keys(state.user.balances);
    availableSymbols.forEach(sym => {
        tokenOptionsHTML += `<option value="${sym}">${sym}</option>`;
    });

    // Render some hot list items for market preview
    let tableRowsHTML = '';
    const hotKeys = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'DOGE/USDT'];
    hotKeys.forEach(key => {
        const item = state.tickers[key];
        if (!item) return;
        const isPositive = item.change24h >= 0;
        const classColor = isPositive ? 'text-green' : 'text-red';
        const sign = isPositive ? '+' : '';
        
        tableRowsHTML += `
            <tr onclick="window.location.hash='#trade?pair=${item.symbol}/USDT'" style="cursor: pointer;">
                <td>
                    <div class="coin-cell">
                        <div class="coin-icon" style="background-color: ${item.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: #000;">
                            ${item.symbol[0]}
                        </div>
                        <div>
                            <span class="coin-symbol">${item.symbol}</span>
                            <span class="coin-name">${item.name}</span>
                        </div>
                    </div>
                </td>
                <td id="home-table-price-${item.symbol}" class="ticker-val-cell">$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                <td id="home-table-change-${item.symbol}" class="${classColor}">${sign}${item.change24h.toFixed(2)}%</td>
                <td>$${(item.volume24h * item.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>
                    <button class="action-btn-sm" onclick="event.stopPropagation(); window.location.hash='#trade?pair=${item.symbol}/USDT'">Trade</button>
                </td>
            </tr>
        `;
    });

    return `
        <div class="home-container">
            <!-- Hero Banner -->
            <section class="hero-section">
                <div class="hero-text">
                    <h1>Buy, Trade, and Hold <span>350+</span> Cryptocurrencies on Binance</h1>
                    <p>Join the world's largest crypto exchange. Get started with lowest transaction fees, advanced charts, and 24/7 client support.</p>
                    <div class="hero-ctas">
                        <a href="#auth?tab=register" class="btn-primary">Sign Up Now</a>
                        <a href="#markets" class="btn-secondary">View Markets</a>
                    </div>
                </div>

                <!-- Quick Swap Box -->
                <div class="quick-swap-card">
                    <h3>Quick Swap</h3>
                    <div class="swap-input-group">
                        <div>
                            <label for="swap-from-amount">From</label>
                            <input type="number" id="swap-from-amount" value="1.0" step="any" min="0">
                        </div>
                        <div class="token-select">
                            <select id="swap-from-token">
                                <option value="USDT" selected>USDT</option>
                                ${tokenOptionsHTML}
                            </select>
                        </div>
                    </div>

                    <div class="swap-divider">
                        <button class="btn-swap-arrow" id="btn-swap-tokens" aria-label="Swap Tokens">
                            <i data-lucide="arrow-down-up"></i>
                        </button>
                    </div>

                    <div class="swap-input-group">
                        <div>
                            <label for="swap-to-amount">To</label>
                            <input type="number" id="swap-to-amount" value="0" readonly>
                        </div>
                        <div class="token-select">
                            <select id="swap-to-token">
                                <option value="BTC" selected>BTC</option>
                                ${tokenOptionsHTML}
                            </select>
                        </div>
                    </div>

                    <div class="swap-rate-info">
                        <span>Price Reference</span>
                        <span id="swap-rate-text">1 USDT &asymp; 0.000015 BTC</span>
                    </div>

                    <button class="btn-swap-action" id="btn-swap-execute">Convert Now</button>
                </div>
            </section>

            <!-- Ticker Grid -->
            <section class="ticker-cards-row" id="home-tickers-row">
                ${tickerCardsHTML}
            </section>

            <!-- Markets Preview Table -->
            <section class="market-preview-section">
                <div class="preview-header">
                    <h2>Popular Markets</h2>
                    <a href="#markets" class="view-all-link">View All Markets <i data-lucide="chevron-right"></i></a>
                </div>
                <div class="market-table-container">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>24h Change</th>
                                <th>24h Volume</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="home-market-rows">
                            ${tableRowsHTML}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `;
}

window.initHome = function() {
    const fromInput = document.getElementById('swap-from-amount');
    const toInput = document.getElementById('swap-to-amount');
    const fromToken = document.getElementById('swap-from-token');
    const toToken = document.getElementById('swap-to-token');
    const swapBtn = document.getElementById('btn-swap-tokens');
    const convertBtn = document.getElementById('btn-swap-execute');
    const rateText = document.getElementById('swap-rate-text');

    function calculateConvert() {
        const fromVal = parseFloat(fromInput.value) || 0;
        const from = fromToken.value;
        const to = toToken.value;

        if (from === to) {
            toInput.value = fromVal;
            rateText.textContent = `1 ${from} = 1 ${to}`;
            return;
        }

        // Get prices relative to USDT
        let fromPriceInUSDT = 1;
        if (from !== 'USDT') {
            const pair = `${from}/USDT`;
            if (state.tickers[pair]) fromPriceInUSDT = state.tickers[pair].price;
        }

        let toPriceInUSDT = 1;
        if (to !== 'USDT') {
            const pair = `${to}/USDT`;
            if (state.tickers[pair]) toPriceInUSDT = state.tickers[pair].price;
        }

        const rate = fromPriceInUSDT / toPriceInUSDT;
        toInput.value = (fromVal * rate).toFixed(6);
        rateText.textContent = `1 ${from} &asymp; ${rate.toFixed(6)} ${to}`;
    }

    // Set initial values properly
    // Prevent self-selection duplicate
    function handleSelectChange(changedSelect) {
        if (fromToken.value === toToken.value) {
            const symbols = Object.keys(state.user.balances);
            const otherToken = symbols.find(sym => sym !== changedSelect.value) || 'USDT';
            if (changedSelect === fromToken) {
                toToken.value = otherToken;
            } else {
                fromToken.value = otherToken;
            }
        }
        calculateConvert();
    }

    if (fromInput) {
        fromInput.addEventListener('input', calculateConvert);
        fromToken.addEventListener('change', () => handleSelectChange(fromToken));
        toToken.addEventListener('change', () => handleSelectChange(toToken));
        
        swapBtn.addEventListener('click', () => {
            const tempVal = fromToken.value;
            fromToken.value = toToken.value;
            toToken.value = tempVal;
            calculateConvert();
        });

        convertBtn.addEventListener('click', () => {
            if (!state.user.isLoggedIn) {
                alert('Please login to swap tokens.');
                window.location.hash = '#auth';
                return;
            }

            const from = fromToken.value;
            const to = toToken.value;
            const fromAmt = parseFloat(fromInput.value) || 0;
            const toAmt = parseFloat(toInput.value) || 0;

            if (fromAmt <= 0) {
                alert('Please enter a valid amount.');
                return;
            }

            if (state.user.balances[from] < fromAmt) {
                alert(`Insufficient ${from} balance. Your current balance is ${state.user.balances[from].toFixed(4)} ${from}.`);
                return;
            }

            // Perform transaction
            state.user.balances[from] -= fromAmt;
            state.user.balances[to] = (state.user.balances[to] || 0) + toAmt;
            
            // Add transaction to history
            state.orderHistory.unshift({
                id: 'c' + Date.now().toString().slice(-6),
                time: new Date().toISOString().replace('T', ' ').slice(0, 19),
                pair: `${to}/${from}`,
                type: 'Convert',
                side: 'Buy',
                price: (fromAmt / toAmt),
                amount: toAmt,
                total: fromAmt,
                status: 'Filled'
            });

            alert(`Swap Successful! Converted ${fromAmt} ${from} to ${toAmt.toFixed(6)} ${to}.`);
            fromInput.value = '1.0';
            calculateConvert();
            
            // Save state
            localStorage.setItem('binance_clone_state', JSON.stringify({
                user: state.user,
                favorites: state.favorites,
                openOrders: state.openOrders,
                orderHistory: state.orderHistory,
                p2pOrders: state.p2pOrders,
                theme: state.theme
            }));
            
            // Update header balance
            const balLabel = document.getElementById('header-balance-val');
            if (balLabel) {
                let totalUSD = state.user.balances.USDT;
                for (const [symbol, amount] of Object.entries(state.user.balances)) {
                    if (symbol === 'USDT') continue;
                    const pair = `${symbol}/USDT`;
                    if (state.tickers[pair]) {
                        totalUSD += amount * state.tickers[pair].price;
                    }
                }
                balLabel.textContent = `$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        });

        calculateConvert();
    }

    // Set up custom update listener for prices
    window.addEventListener('tickerUpdate', handleLiveTickersHome);
}

// Clean up event listener when leaving page
function handleLiveTickersHome(e) {
    const changes = e.detail;
    changes.forEach(change => {
        const symbolOnly = change.pair.split('/')[0];
        
        // Update mini-cards prices
        const priceLabel = document.getElementById(`home-price-${symbolOnly}`);
        const homeCard = document.getElementById(`home-card-${symbolOnly}`);
        if (priceLabel && homeCard) {
            priceLabel.textContent = `$${change.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            // Add glow animations
            homeCard.classList.remove('flash-green-anim', 'flash-red-anim');
            void homeCard.offsetWidth; // trigger reflow
            homeCard.classList.add(change.isUp ? 'flash-green-anim' : 'flash-red-anim');
        }

        // Update popular markets table
        const tablePrice = document.getElementById(`home-table-price-${symbolOnly}`);
        const tableChange = document.getElementById(`home-table-change-${symbolOnly}`);
        if (tablePrice && tableChange) {
            tablePrice.textContent = `$${change.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
            
            const isPositive = change.change24h >= 0;
            const sign = isPositive ? '+' : '';
            tableChange.textContent = `${sign}${change.change24h.toFixed(2)}%`;
            tableChange.className = isPositive ? 'text-green' : 'text-red';
            
            // Add flash colors to the price cell
            tablePrice.classList.remove('flash-green-anim', 'flash-red-anim');
            void tablePrice.offsetWidth;
            tablePrice.classList.add(change.isUp ? 'flash-green-anim' : 'flash-red-anim');
        }
    });
}

// Make sure to remove window event listeners upon reload/destroy if needed, but in client SPAs, routing recreates window listeners.
// To avoid duplication, we remove previous listener before registering.
const prevTickerHandler = window.binanceHomeTickerHandler;
if (prevTickerHandler) {
    window.removeEventListener('tickerUpdate', prevTickerHandler);
}
window.binanceHomeTickerHandler = handleLiveTickersHome;
