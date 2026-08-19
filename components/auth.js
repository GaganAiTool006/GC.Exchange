/* ============================================
   GK EXCHANGE - Auth Component
   components/auth.js
   ============================================ */

window.renderAuth = function(container, activeTab) {
    activeTab = activeTab || 'login';

    container.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-container">
                <!-- Form Side -->
                <div class="auth-form-side">
                    <div class="auth-brand">
                        <div class="logo-icon" style="width:34px;height:34px;font-size:12px;background:var(--primary);color:var(--text-on-gold);display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:900;">
                            <span>GK</span>
                        </div>
                        <div>
                            <h3 style="font-family:var(--font-heading);font-weight:800;font-size:18px;">GK Exchange</h3>
                            <p style="font-size:11px;color:var(--text-secondary);">India's Premier Crypto Trading Platform</p>
                        </div>
                    </div>

                    <div class="auth-tabs">
                        <button class="auth-tab-btn ${activeTab === 'login' ? 'active' : ''}" id="tab-auth-login">Log In</button>
                        <button class="auth-tab-btn ${activeTab === 'register' ? 'active' : ''}" id="tab-auth-register">Register</button>
                    </div>

                    <!-- Quick Demo Login Banner -->
                    <div style="background:var(--primary-light);border:1px solid var(--border-gold);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;gap:10px;">
                        <div>
                            <div style="font-size:12px;font-weight:700;color:var(--primary);">⚡ Quick Demo Login</div>
                            <div style="font-size:11px;color:var(--text-secondary);">Instant 1-click access to full terminal</div>
                        </div>
                        <button id="btn-quick-demo-login" style="background:var(--primary);color:var(--text-on-gold);padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px var(--primary-glow);">
                            Instant Login
                        </button>
                    </div>

                    <form id="auth-main-form" onsubmit="event.preventDefault();">
                        <div class="auth-inputs">
                            <div class="form-group">
                                <label for="auth-email" id="auth-label-email">${activeTab === 'login' ? 'Email or Phone Number' : 'Email Address'}</label>
                                <input type="email" class="form-control-input" id="auth-email" placeholder="e.g. gagan@gkexchange.com" value="${activeTab === 'login' ? 'trader@gkexchange.com' : ''}" required autocomplete="email">
                            </div>
                            <div class="form-group">
                                <label for="auth-password">Password</label>
                                <input type="password" class="form-control-input" id="auth-password" placeholder="Enter password (min 6 characters)" value="${activeTab === 'login' ? 'Pass@12345' : ''}" required autocomplete="current-password">
                            </div>
                        </div>

                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                            <label style="font-size:12px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;cursor:pointer;">
                                <input type="checkbox" id="auth-remember-me" checked style="accent-color:var(--primary);"> Remember me
                            </label>
                            <a href="javascript:void(0)" class="auth-forgot" id="forgot-password-link" style="margin-bottom:0;">Forgot password?</a>
                        </div>

                        <button type="submit" class="btn-auth-submit" id="btn-auth-submit-action">
                            ${activeTab === 'login' ? 'Log In to Account' : 'Create Free Account'}
                        </button>
                    </form>

                    <div class="social-login-separator">or continue with</div>

                    <div class="social-buttons">
                        <button type="button" class="btn-social" id="btn-social-google">
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button type="button" class="btn-social" id="btn-social-apple">
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" fill="currentColor"/>
                            </svg>
                            Apple ID
                        </button>
                    </div>
                </div>

                <!-- QR Scan Side -->
                <div class="auth-qr-side">
                    <div class="qr-login-box">
                        <!-- Simulated QR Code -->
                        <svg width="130" height="130" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="128" height="128" fill="white"/>
                            <!-- Corners -->
                            <rect x="8" y="8" width="28" height="28" fill="black"/>
                            <rect x="14" y="14" width="16" height="16" fill="white"/>
                            <rect x="18" y="18" width="8" height="8" fill="black"/>
                            <rect x="92" y="8" width="28" height="28" fill="black"/>
                            <rect x="98" y="14" width="16" height="16" fill="white"/>
                            <rect x="102" y="18" width="8" height="8" fill="black"/>
                            <rect x="8" y="92" width="28" height="28" fill="black"/>
                            <rect x="14" y="98" width="16" height="16" fill="white"/>
                            <rect x="18" y="102" width="8" height="8" fill="black"/>
                            <!-- Inner patterns -->
                            <rect x="42" y="16" width="12" height="12" fill="black"/>
                            <rect x="60" y="16" width="24" height="8" fill="black"/>
                            <rect x="48" y="44" width="32" height="16" fill="black"/>
                            <rect x="16" y="48" width="12" height="24" fill="black"/>
                            <rect x="96" y="48" width="16" height="32" fill="black"/>
                            <rect x="64" y="80" width="24" height="12" fill="black"/>
                            <rect x="44" y="96" width="12" height="24" fill="black"/>
                            <rect x="76" y="96" width="12" height="16" fill="black"/>
                            <rect x="40" y="72" width="16" height="8" fill="black"/>
                        </svg>
                    </div>
                    <div class="qr-login-title">Log in with QR Code</div>
                    <div class="qr-login-desc">Scan with the GK Exchange Mobile App for instant biometric login.</div>
                    <button id="btn-qr-mock-scan" style="margin-top:14px;font-size:12px;color:var(--primary);font-weight:600;display:inline-flex;align-items:center;gap:4px;">
                        ⚡ Click to Simulate App Scan
                    </button>
                </div>
            </div>
        </div>
    `;

    // Elements
    const tabLogin = document.getElementById('tab-auth-login');
    const tabRegister = document.getElementById('tab-auth-register');
    const authBtn = document.getElementById('btn-auth-submit-action');
    const forgotLink = document.getElementById('forgot-password-link');
    const emailLabel = document.getElementById('auth-label-email');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const form = document.getElementById('auth-main-form');

    var currentTab = activeTab;

    function setTab(t) {
        currentTab = t;
        if (t === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            authBtn.textContent = 'Log In to Account';
            forgotLink.style.display = 'block';
            emailLabel.textContent = 'Email or Phone Number';
            if (!emailInput.value) emailInput.value = 'trader@gkexchange.com';
            if (!passwordInput.value) passwordInput.value = 'Pass@12345';
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            authBtn.textContent = 'Create Free Account';
            forgotLink.style.display = 'none';
            emailLabel.textContent = 'Email Address';
            emailInput.value = '';
            passwordInput.value = '';
            emailInput.focus();
        }
    }

    if (tabLogin) tabLogin.addEventListener('click', function() { setTab('login'); });
    if (tabRegister) tabRegister.addEventListener('click', function() { setTab('register'); });

    // Quick Demo Login Button
    document.getElementById('btn-quick-demo-login')?.addEventListener('click', function() {
        window.loginUser('trader.pro@gkexchange.com', 'demoPass123');
    });

    // Form submit
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            alert('Please enter your email address.');
            emailInput.focus();
            return;
        }
        if (!password || password.length < 4) {
            alert('Please enter a valid password (at least 4 characters).');
            passwordInput.focus();
            return;
        }

        if (currentTab === 'login') {
            window.loginUser(email, password);
        } else {
            window.registerUser(email, password);
        }
    });

    // Social buttons
    document.getElementById('btn-social-google')?.addEventListener('click', function() {
        window.loginUser('google.trader@gmail.com', 'google_oauth_token');
    });

    document.getElementById('btn-social-apple')?.addEventListener('click', function() {
        window.loginUser('apple.investor@icloud.com', 'apple_oauth_token');
    });

    // QR simulate
    document.getElementById('btn-qr-mock-scan')?.addEventListener('click', function() {
        window.loginUser('mobile.qr.user@gkexchange.com', 'qr_token_pass');
    });

    // Forgot password
    forgotLink?.addEventListener('click', function() {
        var email = prompt('Enter your registered email address for password reset instructions:', emailInput.value || '');
        if (email) {
            alert('Password reset link has been sent to ' + email + '. Check your inbox.');
        }
    });
};
