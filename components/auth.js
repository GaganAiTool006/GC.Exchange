let activeTab = 'login'; // 'login' or 'register'

window.renderAuth = function(params) {
    if (params && params.tab) {
        activeTab = params.tab;
    } else {
        activeTab = 'login';
    }

    return `
        <div class="auth-wrapper">
            <div class="auth-container">
                <!-- Form Side -->
                <div class="auth-form-side">
                    <div class="auth-tabs">
                        <button class="auth-tab-btn ${activeTab === 'login' ? 'active' : ''}" id="tab-auth-login">Log In</button>
                        <button class="auth-tab-btn ${activeTab === 'register' ? 'active' : ''}" id="tab-auth-register">Register</button>
                    </div>

                    <div class="auth-inputs">
                        <div class="form-group">
                            <label for="auth-email" id="auth-label-email">Email or Phone Number</label>
                            <input type="email" class="form-control-input" id="auth-email" placeholder="Enter email address" required>
                        </div>
                        <div class="form-group">
                            <label for="auth-password">Password</label>
                            <input type="password" class="form-control-input" id="auth-password" placeholder="Enter password" required>
                        </div>
                    </div>

                    <a href="#" class="auth-forgot" id="forgot-password-link">Forgot password?</a>

                    <button class="btn-auth-submit" id="btn-auth-submit-action">${activeTab === 'login' ? 'Log In' : 'Create Account'}</button>

                    <div class="social-login-separator">or login with</div>

                    <div class="social-buttons">
                        <button class="btn-social" id="btn-social-google">
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button class="btn-social" id="btn-social-apple">
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" fill="currentColor"/>
                            </svg>
                            Apple
                        </button>
                    </div>
                </div>

                <!-- QR Scan Side -->
                <div class="auth-qr-side">
                    <div class="qr-login-box">
                        <!-- Simulated QR Code -->
                        <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="128" height="128" fill="white"/>
                            <!-- Corners -->
                            <rect x="8" y="8" width="24" height="24" fill="black"/>
                            <rect x="14" y="14" width="12" height="12" fill="white"/>
                            <rect x="96" y="8" width="24" height="24" fill="black"/>
                            <rect x="102" y="14" width="12" height="12" fill="white"/>
                            <rect x="8" y="96" width="24" height="24" fill="black"/>
                            <rect x="14" y="102" width="12" height="12" fill="white"/>
                            <!-- Inner patterns -->
                            <rect x="40" y="24" width="16" height="8" fill="black"/>
                            <rect x="48" y="48" width="24" height="16" fill="black"/>
                            <rect x="16" y="48" width="8" height="24" fill="black"/>
                            <rect x="80" y="40" width="8" height="32" fill="black"/>
                            <rect x="64" y="80" width="24" height="8" fill="black"/>
                            <rect x="96" y="88" width="16" height="16" fill="black"/>
                            <rect x="48" y="96" width="8" height="24" fill="black"/>
                            <rect x="80" y="96" width="8" height="16" fill="black"/>
                            <rect x="40" y="72" width="16" height="8" fill="black"/>
                        </svg>
                    </div>
                    <div class="qr-login-title">Log in with QR Code</div>
                    <div class="qr-login-desc">Scan this QR code with the Binance mobile app to log in instantly.</div>
                </div>
            </div>
        </div>
    `;
}

window.initAuth = function(params) {
    const tabLogin = document.getElementById('tab-auth-login');
    const tabRegister = document.getElementById('tab-auth-register');
    const authBtn = document.getElementById('btn-auth-submit-action');
    const forgotLink = document.getElementById('forgot-password-link');
    const emailLabel = document.getElementById('auth-label-email');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            activeTab = 'login';
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            authBtn.textContent = 'Log In';
            forgotLink.classList.remove('hidden');
            emailLabel.textContent = 'Email or Phone Number';
        });

        tabRegister.addEventListener('click', () => {
            activeTab = 'register';
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            authBtn.textContent = 'Create Account';
            forgotLink.classList.add('hidden');
            emailLabel.textContent = 'Email Address';
        });
    }

    // Submit handler
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email === '' || password === '') {
                alert('Please enter your email and password credentials.');
                return;
            }

            if (activeTab === 'login') {
                // Log in
                loginUser(email, password);
                alert(`Welcome back! Logged in as ${email}.`);
            } else {
                // Register
                alert(`Registration Successful! Account created for ${email}. You are now being logged in.`);
                loginUser(email, password);
            }
        });
    }

    // Social buttons mock handlers
    document.getElementById('btn-social-google')?.addEventListener('click', () => {
        loginUser('google.user@binance.com', 'googleoauth');
        alert('Logged in via Google Authentication.');
    });

    document.getElementById('btn-social-apple')?.addEventListener('click', () => {
        loginUser('apple.user@binance.com', 'appleoauth');
        alert('Logged in via Apple ID Authentication.');
    });
}
