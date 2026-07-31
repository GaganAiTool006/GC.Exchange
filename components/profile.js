/* ============================================
   GK EXCHANGE - Profile Component
   components/profile.js
   ============================================ */

window.renderProfile = function(container, activeTab) {
    activeTab = activeTab || 'overview';
    var user = state.user;
    var avatarLetter = (user.displayName || user.email || 'G').charAt(0).toUpperCase();

    var sidebarItems = [
        { id: 'overview', icon: 'user', label: 'Profile Overview' },
        { id: 'security', icon: 'shield', label: 'Security' },
        { id: 'kyc', icon: 'file-check', label: 'Identity Verification' },
        { id: 'vip', icon: 'star', label: 'VIP Level' },
        { id: 'activity', icon: 'activity', label: 'Login Activity' },
        { id: 'referral', icon: 'share-2', label: 'Referral Program' },
        { id: 'preferences', icon: 'settings', label: 'Preferences' }
    ];

    var sidebarHtml = sidebarItems.map(function(item) {
        return '<div class="profile-sidebar-item ' + (activeTab === item.id ? 'active' : '') + '" onclick="setProfileTab(\'' + item.id + '\')">' +
            '<i data-lucide="' + item.icon + '"></i>' + item.label +
        '</div>';
    }).join('');

    var contentHtml = '';
    switch (activeTab) {
        case 'overview': contentHtml = renderOverview(); break;
        case 'security': contentHtml = renderSecurity(); break;
        case 'kyc': contentHtml = renderKYC(); break;
        case 'vip': contentHtml = renderVIP(); break;
        case 'activity': contentHtml = renderActivity(); break;
        case 'referral': contentHtml = renderReferral(); break;
        case 'preferences': contentHtml = renderPreferences(); break;
        default: contentHtml = renderOverview();
    }

    container.innerHTML =
        '<div class="profile-container">' +
            // Header Card
            '<div class="profile-header-card">' +
                '<div class="profile-big-avatar" id="profile-avatar">' + avatarLetter + '</div>' +
                '<div class="profile-info">' +
                    '<div class="profile-name">' + (user.displayName || user.email.split('@')[0] || 'GK User') +
                        '<span class="verified-badge"><i data-lucide="check-circle"></i> Verified</span>' +
                    '</div>' +
                    '<div class="profile-email">' + (user.email || 'user@gkexchange.com') + '</div>' +
                    '<div class="profile-uid">UID: ' + (user.uid || 'GKX1234567') + '</div>' +
                    '<div class="profile-badges">' +
                        '<span class="profile-badge badge-vip">⭐ VIP ' + (user.vipLevel || 1) + '</span>' +
                        '<span class="profile-badge badge-kyc"><i data-lucide="shield-check" style="width:12px;height:12px;"></i> KYC Level ' + (user.kycLevel || 2) + '</span>' +
                        '<span class="profile-badge badge-p2p">P2P Active</span>' +
                    '</div>' +
                '</div>' +
                '<div class="profile-stats-row">' +
                    '<div class="profile-stat"><span class="profile-stat-num">₹' + formatNum(calcTotalUSDValue() * 83.4) + '</span><span class="profile-stat-label">Portfolio Value</span></div>' +
                    '<div class="profile-stat"><span class="profile-stat-num">' + state.orders.filter(function(o){return o.status==='filled';}).length + '</span><span class="profile-stat-label">Total Trades</span></div>' +
                    '<div class="profile-stat"><span class="profile-stat-num">' + state.p2pOrders.length + '</span><span class="profile-stat-label">P2P Orders</span></div>' +
                    '<div class="profile-stat"><span class="profile-stat-num">0.1%</span><span class="profile-stat-label">Trading Fee</span></div>' +
                '</div>' +
            '</div>' +

            // Grid
            '<div class="profile-grid">' +
                '<div class="profile-sidebar">' + sidebarHtml + '</div>' +
                '<div class="profile-content-card" id="profile-content">' + contentHtml + '</div>' +
            '</div>' +
        '</div>';

    if (window.lucide) lucide.createIcons();
};

window.setProfileTab = function(tab) {
    navigate('profile', { tab: tab });
};

// ---- OVERVIEW ----
function renderOverview() {
    var user = state.user;
    return '<div class="profile-section-title"><i data-lucide="user"></i> Profile Overview</div>' +
        '<div class="info-row"><span class="info-label">Display Name</span><span class="info-value">' + (user.displayName || 'Not set') + '<button class="btn-edit-info" onclick="editProfileField(\'displayName\')">Edit</button></span></div>' +
        '<div class="info-row"><span class="info-label">Email Address</span><span class="info-value">' + (user.email || '--') + '<span style="background:var(--green-light);color:var(--green);font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;">Verified</span></span></div>' +
        '<div class="info-row"><span class="info-label">Phone Number</span><span class="info-value"><span style="color:var(--text-muted);">Not set</span><button class="btn-edit-info" onclick="editProfileField(\'phone\')">Add</button></span></div>' +
        '<div class="info-row"><span class="info-label">User ID</span><span class="info-value"><code style="font-size:12px;">' + (user.uid || 'GKX1234567') + '</code></span></div>' +
        '<div class="info-row"><span class="info-label">Registration Date</span><span class="info-value">' + new Date(user.registered || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) + '</span></div>' +
        '<div class="info-row"><span class="info-label">VIP Level</span><span class="info-value"><span class="profile-badge badge-vip" style="font-size:12px;">⭐ VIP ' + (user.vipLevel || 1) + '</span></span></div>' +
        '<div class="info-row"><span class="info-label">KYC Level</span><span class="info-value"><span class="profile-badge badge-kyc" style="font-size:12px;">Level ' + (user.kycLevel || 2) + ' · Verified</span></span></div>' +
        '<div class="info-row"><span class="info-label">Preferred Language</span><span class="info-value">English (India)<button class="btn-edit-info">Change</button></span></div>' +
        '<div style="margin-top:24px;background:linear-gradient(135deg,var(--primary-light),transparent);border:1px solid var(--border-gold);border-radius:var(--radius-md);padding:16px;display:flex;justify-content:space-between;align-items:center;">' +
            '<div><div style="font-weight:700;font-size:14px;">Complete your profile</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">Add phone number and verify documents to unlock higher limits</div></div>' +
            '<button class="btn-edit-info" onclick="setProfileTab(\'kyc\')" style="white-space:nowrap;">Verify Now</button>' +
        '</div>';
}

// ---- SECURITY ----
function renderSecurity() {
    var user = state.user;
    var secItems = [
        { icon: 'lock', title: 'Login Password', desc: 'Last changed 30 days ago', enabled: true, color: '#4285f4', toggle: false },
        { icon: 'smartphone', title: 'Two-Factor Auth (2FA)', desc: 'Protect your account with Google Authenticator', enabled: user.twoFA || false, color: '#0ecb81', toggle: 'twoFA' },
        { icon: 'shield-alert', title: 'Anti-Phishing Code', desc: 'Code shown in all GK Exchange emails for verification', enabled: user.antiPhishing || false, color: '#f0b90b', toggle: 'antiPhishing' },
        { icon: 'monitor', title: 'Device Management', desc: '2 trusted devices authorized', enabled: true, color: '#8b5cf6', toggle: false },
        { icon: 'bell', title: 'Login Notifications', desc: 'Receive email alerts for new logins', enabled: true, color: '#ff9500', toggle: false },
        { icon: 'key', title: 'API Keys', desc: 'Manage API access for automated trading', enabled: false, color: '#e84142', toggle: false }
    ];

    return '<div class="profile-section-title"><i data-lucide="shield"></i> Security Settings</div>' +
        '<div style="background:var(--green-light);border:1px solid rgba(14,203,129,0.3);border-radius:var(--radius-md);padding:12px 16px;margin-bottom:20px;font-size:13px;display:flex;align-items:center;gap:10px;">' +
            '<i data-lucide="shield-check" style="width:18px;height:18px;color:var(--green);flex-shrink:0;"></i>' +
            '<span style="color:var(--green);font-weight:600;">Security Score: 72/100 · Good</span>' +
            '<span style="color:var(--text-secondary);margin-left:8px;">Enable 2FA to improve score</span>' +
        '</div>' +
        secItems.map(function(item) {
            return '<div class="security-item">' +
                '<div class="security-item-info">' +
                    '<div class="security-icon" style="background:' + item.color + '22;border:1px solid ' + item.color + '33;">' +
                        '<i data-lucide="' + item.icon + '" style="color:' + item.color + '"></i>' +
                    '</div>' +
                    '<div><div class="security-title">' + item.title + '</div><div class="security-desc">' + item.desc + '</div></div>' +
                '</div>' +
                (item.toggle ?
                    '<label class="toggle-switch">' +
                        '<input type="checkbox" ' + (item.enabled ? 'checked' : '') + ' onchange="toggleSecSetting(\'' + item.toggle + '\',this.checked)">' +
                        '<span class="toggle-slider"></span>' +
                    '</label>' :
                    '<button class="btn-edit-info">' + (item.enabled ? 'Manage' : 'Enable') + '</button>'
                ) +
            '</div>';
        }).join('') +
        '<div style="margin-top:20px;">' +
            '<button class="btn-modal-action danger" style="width:auto;padding:10px 24px;font-size:13px;" onclick="if(confirm(\'Logout all devices?\'))showToast(\'All sessions terminated\',\'success\')">Logout All Devices</button>' +
        '</div>';
}

window.toggleSecSetting = function(setting, val) {
    state.user[setting] = val;
    saveState();
    showToast(val ? setting + ' enabled ✅' : setting + ' disabled', val ? 'success' : 'info');
};

// ---- KYC ----
function renderKYC() {
    var user = state.user;
    var levels = [
        { level: 1, name: 'Basic', desc: 'Email verification', features: ['₹2L/day deposit', '₹1L/day withdrawal', 'Spot trading'], completed: true },
        { level: 2, name: 'Intermediate', desc: 'Government ID + Selfie', features: ['₹20L/day deposit', '₹10L/day withdrawal', 'P2P trading', 'Higher limits'], completed: (user.kycLevel || 0) >= 2 },
        { level: 3, name: 'Advanced', desc: 'Proof of address + Video KYC', features: ['Unlimited deposits', '₹1Cr/day withdrawal', 'OTC desk access', 'VIP benefits'], completed: (user.kycLevel || 0) >= 3 }
    ];

    return '<div class="profile-section-title"><i data-lucide="file-check"></i> Identity Verification (KYC)</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:24px;">Verify your identity to unlock higher trading limits and access all platform features.</p>' +
        levels.map(function(lv) {
            return '<div style="background:var(--bg-hover);border:1px solid ' + (lv.completed ? 'var(--green)' : 'var(--border-color)') + ';border-radius:var(--radius-md);padding:20px;margin-bottom:14px;">' +
                '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
                    '<div>' +
                        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
                            '<div style="width:32px;height:32px;border-radius:50%;background:' + (lv.completed ? 'var(--green)' : 'var(--border-color)') + ';display:flex;align-items:center;justify-content:center;color:' + (lv.completed ? '#fff' : 'var(--text-muted)') + ';font-weight:800;">' + lv.level + '</div>' +
                            '<div><div style="font-weight:800;font-size:15px;">Level ' + lv.level + ': ' + lv.name + '</div><div style="font-size:12px;color:var(--text-muted);">' + lv.desc + '</div></div>' +
                        '</div>' +
                        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">' + lv.features.map(function(f) { return '<span style="background:var(--bg-card);border:1px solid var(--border-color);padding:3px 10px;border-radius:var(--radius-full);font-size:11px;font-weight:600;">' + f + '</span>'; }).join('') + '</div>' +
                    '</div>' +
                    (lv.completed ?
                        '<span style="background:var(--green-light);color:var(--green);padding:6px 14px;border-radius:var(--radius-full);font-size:12px;font-weight:700;border:1px solid rgba(14,203,129,0.3);">✓ Completed</span>' :
                        '<button class="btn-modal-action" style="width:auto;padding:8px 20px;font-size:13px;" onclick="showToast(\'KYC verification launched\',\'info\')">Verify Now</button>'
                    ) +
                '</div>' +
            '</div>';
        }).join('');
}

// ---- VIP ----
function renderVIP() {
    var vipLevels = [
        { level: 0, name: 'Regular', vol: '< ₹1L', fee: '0.10%', active: false },
        { level: 1, name: 'VIP 1', vol: '₹1L+', fee: '0.09%', active: true },
        { level: 2, name: 'VIP 2', vol: '₹10L+', fee: '0.08%', active: false },
        { level: 3, name: 'VIP 3', vol: '₹50L+', fee: '0.07%', active: false },
        { level: 4, name: 'VIP 4', vol: '₹1Cr+', fee: '0.05%', active: false },
        { level: 5, name: 'VIP 5', vol: '₹5Cr+', fee: '0.03%', active: false }
    ];

    return '<div class="profile-section-title"><i data-lucide="star"></i> VIP Level</div>' +
        '<div style="background:linear-gradient(135deg,var(--bg-hover),var(--bg-card));border:1px solid var(--border-gold);border-radius:var(--radius-md);padding:20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">' +
            '<div>' +
                '<div style="font-size:12px;color:var(--text-muted);">Your Current Level</div>' +
                '<div style="font-family:var(--font-heading);font-size:28px;font-weight:900;color:var(--primary);">⭐ VIP ' + (state.user.vipLevel || 1) + '</div>' +
                '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">30-day volume: ₹2.4L · Maker fee: 0.09% · Taker fee: 0.10%</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
                '<div style="font-size:12px;color:var(--text-muted);">To reach VIP 2</div>' +
                '<div style="font-size:16px;font-weight:700;color:var(--text-primary);">₹7.6L more</div>' +
                '<div style="background:var(--border-color);border-radius:var(--radius-full);height:6px;width:120px;margin-top:6px;">' +
                    '<div style="background:var(--primary);height:100%;border-radius:var(--radius-full);width:24%;"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
        vipLevels.map(function(v) {
            return '<div style="background:' + (v.active ? 'var(--primary-light)' : 'var(--bg-hover)') + ';border:' + (v.active ? '2px solid var(--primary)' : '1px solid var(--border-color)') + ';border-radius:var(--radius-md);padding:16px;text-align:center;">' +
                '<div style="font-size:22px;margin-bottom:6px;">' + ['👤','⭐','🌟','💎','🏆','👑'][v.level] + '</div>' +
                '<div style="font-weight:800;font-size:14px;' + (v.active ? 'color:var(--primary);' : '') + '">' + v.name + '</div>' +
                '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">' + v.vol + '</div>' +
                '<div style="font-size:12px;font-weight:700;color:var(--green);margin-top:6px;">Fee: ' + v.fee + '</div>' +
                (v.active ? '<div style="margin-top:8px;font-size:10px;background:var(--primary);color:var(--text-on-gold);padding:2px 8px;border-radius:var(--radius-full);font-weight:700;">CURRENT</div>' : '') +
            '</div>';
        }).join('') + '</div>';
}

// ---- ACTIVITY ----
function renderActivity() {
    var loginHistory = [
        { device: 'Chrome on Windows', ip: '103.xx.xx.xx', location: 'Delhi, India', time: Date.now() - 1000 * 60 * 5, status: 'success' },
        { device: 'Safari on iPhone', ip: '49.xx.xx.xx', location: 'Mumbai, India', time: Date.now() - 1000 * 3600 * 8, status: 'success' },
        { device: 'Chrome on Android', ip: '157.xx.xx.xx', location: 'Bangalore, India', time: Date.now() - 1000 * 3600 * 48, status: 'success' },
        { device: 'Unknown Device', ip: '185.xx.xx.xx', location: 'Unknown', time: Date.now() - 1000 * 3600 * 72, status: 'failed' }
    ];

    return '<div class="profile-section-title"><i data-lucide="activity"></i> Login Activity</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:20px;">Recent login sessions. If you see suspicious activity, change your password immediately.</p>' +
        loginHistory.map(function(l) {
            return '<div style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">' +
                '<div style="display:flex;align-items:center;gap:12px;">' +
                    '<div style="width:40px;height:40px;background:' + (l.status === 'success' ? 'var(--green-light)' : 'var(--red-light)') + ';border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;">' +
                        '<i data-lucide="' + (l.status === 'success' ? 'check-circle' : 'alert-circle') + '" style="width:18px;height:18px;color:' + (l.status === 'success' ? 'var(--green)' : 'var(--red)') + ';"></i>' +
                    '</div>' +
                    '<div>' +
                        '<div style="font-weight:600;font-size:13px;">' + l.device + '</div>' +
                        '<div style="font-size:11px;color:var(--text-muted);">' + l.ip + ' · ' + l.location + '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:11px;color:var(--text-muted);">' + timeAgo(l.time) + '</div>' +
                    '<div style="font-size:11px;font-weight:700;color:' + (l.status === 'success' ? 'var(--green)' : 'var(--red)') + ';">' + (l.status === 'success' ? '✓ Success' : '✗ Failed') + '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '<button class="btn-sm-danger" style="margin-top:12px;" onclick="showToast(\'All sessions except current terminated\',\'success\')">Terminate All Other Sessions</button>';
}

// ---- REFERRAL ----
function renderReferral() {
    var refCode = 'GKX' + (state.user.uid || 'REF1234').slice(-6).toUpperCase();
    return '<div class="profile-section-title"><i data-lucide="share-2"></i> Referral Program</div>' +
        '<div style="background:linear-gradient(135deg,var(--bg-hover),var(--bg-card));border:1px solid var(--border-gold);border-radius:var(--radius-lg);padding:24px;margin-bottom:24px;">' +
            '<div style="font-family:var(--font-heading);font-size:22px;font-weight:900;margin-bottom:8px;">Earn up to <span style="color:var(--primary);">40%</span> commission!</div>' +
            '<p style="font-size:13px;color:var(--text-secondary);">Invite friends and earn a percentage of their trading fees for life. No caps, no expiry.</p>' +
            '<div style="background:var(--bg-card);border:1px dashed var(--border-gold);border-radius:var(--radius-md);padding:14px;margin-top:16px;display:flex;justify-content:space-between;align-items:center;">' +
                '<div>' +
                    '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Your Referral Code</div>' +
                    '<div style="font-family:monospace;font-size:22px;font-weight:900;color:var(--primary);letter-spacing:2px;margin-top:4px;">' + refCode + '</div>' +
                '</div>' +
                '<button class="btn-modal-action" style="width:auto;padding:10px 20px;" onclick="copyRefCode(\'' + refCode + '\')"><i data-lucide="copy" style="width:14px;height:14px;"></i> Copy</button>' +
            '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">' +
            '<div style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;text-align:center;"><div style="font-size:28px;font-weight:900;font-family:var(--font-heading);color:var(--primary);">0</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Friends Referred</div></div>' +
            '<div style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;text-align:center;"><div style="font-size:28px;font-weight:900;font-family:var(--font-heading);color:var(--green);">₹0</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Commission Earned</div></div>' +
            '<div style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;text-align:center;"><div style="font-size:28px;font-weight:900;font-family:var(--font-heading);color:var(--blue);">20%</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Your Commission Rate</div></div>' +
        '</div>' +
        '<div style="background:var(--bg-hover);border-radius:var(--radius-md);padding:16px;"><div style="font-weight:700;margin-bottom:12px;">How it works</div>' +
            ['Share your referral code with friends', 'Friend signs up and verifies their account', 'Friend starts trading on GK Exchange', 'You earn % of all their lifetime trading fees'].map(function(step, i) {
                return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:13px;">' +
                    '<div style="width:24px;height:24px;background:var(--primary);color:var(--text-on-gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;">' + (i+1) + '</div>' +
                    step + '</div>';
            }).join('') +
        '</div>';
}

window.copyRefCode = function(code) {
    navigator.clipboard.writeText(code).then(function() {
        showToast('Referral code copied!', 'success');
    }).catch(function() {
        showToast('Code: ' + code, 'info');
    });
};

// ---- PREFERENCES ----
function renderPreferences() {
    return '<div class="profile-section-title"><i data-lucide="settings"></i> Preferences</div>' +
        '<div class="info-row"><span class="info-label">Theme</span><span class="info-value">' +
            '<select onchange="applyTheme(this.value)" style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);">' +
                '<option value="dark" ' + (state.theme === 'dark' ? 'selected' : '') + '>🌙 Dark Mode</option>' +
                '<option value="light" ' + (state.theme === 'light' ? 'selected' : '') + '>☀️ Light Mode</option>' +
            '</select>' +
        '</span></div>' +
        '<div class="info-row"><span class="info-label">Default Trading Pair</span><span class="info-value">' +
            '<select onchange="state.currentPair=this.value;saveState();" style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);">' +
                Object.keys(state.tickers).map(function(p) { return '<option ' + (p === state.currentPair ? 'selected' : '') + '>' + p + '</option>'; }).join('') +
            '</select>' +
        '</span></div>' +
        '<div class="info-row"><span class="info-label">Language</span><span class="info-value">' +
            '<select style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);">' +
                '<option>English (India)</option><option>Hindi</option><option>Tamil</option><option>Telugu</option>' +
            '</select>' +
        '</span></div>' +
        '<div class="info-row"><span class="info-label">Currency Display</span><span class="info-value">' +
            '<select style="background:var(--bg-hover);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);">' +
                '<option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>' +
            '</select>' +
        '</span></div>' +
        '<div class="info-row"><span class="info-label">Email Notifications</span>' +
            '<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>' +
        '</div>' +
        '<div class="info-row"><span class="info-label">Push Notifications</span>' +
            '<label class="toggle-switch"><input type="checkbox"><span class="toggle-slider"></span></label>' +
        '</div>' +
        '<div class="info-row"><span class="info-label">Price Alerts Sound</span>' +
            '<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>' +
        '</div>' +
        '<button class="btn-modal-action" style="margin-top:20px;" onclick="showToast(\'Preferences saved!\',\'success\')">Save Preferences</button>';
}

window.editProfileField = function(field) {
    var val = prompt('Enter new ' + field + ':', state.user[field] || '');
    if (val !== null) {
        state.user[field] = val.trim();
        saveState();
        navigate('profile', { tab: 'overview' });
        showToast('Profile updated!', 'success');
    }
};
