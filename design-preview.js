/* Design showcase interactions only. No account, database, authentication or funds movement. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const toast=(message)=>{const t=$('#preview-toast');t.textContent=message;t.classList.add('show');clearTimeout(window._gcToast);window._gcToast=setTimeout(()=>t.classList.remove('show'),2800)};
const labels={login:'Login Page',signup:'Signup Page',dashboard:'Dashboard',trade:'Trading Page',wallet:'Wallet Page',p2p:'P2P Trading Page',profile:'Profile & Settings Page',security:'Security & 2FA Page','2fa':'2FA Setup Modal',markets:'Markets Page',kyc:'KYC Verification Page',settings:'Settings Page',history:'Order History Page',deposit:'Deposit UI',withdraw:'Withdraw UI',transfer:'Transfer UI'};
function openScreen(view){const modal=$('#screen-modal'),frame=$('#screen-iframe');const v=labels[view]?view:'dashboard';$('#modal-label').textContent=labels[v]+' · Interactive Preview';frame.src='app-preview.html?view='+encodeURIComponent(v);modal.hidden=false;document.body.style.overflow='hidden';$('#close-modal').focus()}
function closeScreen(){const modal=$('#screen-modal');modal.hidden=true;$('#screen-iframe').src='about:blank';document.body.style.overflow=''}
document.addEventListener('click',e=>{
 const open=e.target.closest('[data-open-screen]');if(open){e.preventDefault();openScreen(open.dataset.openScreen);return}
 const info=e.target.closest('[data-auth-info]');if(info){e.preventDefault();toast(info.dataset.authInfo);return}
 if(e.target.closest('#close-modal')){closeScreen();return}
 if(e.target.closest('#open-new-tab')){const src=$('#screen-iframe').src;if(src&&src!=='about:blank')window.open(src,'_blank','noopener');return}
});
document.addEventListener('submit',e=>{if(e.target.matches('.preview-form')){e.preventDefault();toast('Design preview only — form data was not sent or saved.')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#screen-modal').hidden)closeScreen()});
$('#screen-modal').addEventListener('click',e=>{if(e.target.id==='screen-modal')closeScreen()});
document.addEventListener('click',e=>{const pass=e.target.closest('.password-field svg');if(!pass)return;const input=pass.parentElement.querySelector('input');input.type=input.type==='password'?'text':'password'});
if(window.lucide)lucide.createIcons();
})();