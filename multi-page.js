/* GC.Exchange multi-page frontend interactions. Demo only; no authentication or transactions. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function toast(message,type=''){let stack=$('#toast-stack');if(!stack){stack=document.createElement('div');stack.id='toast-stack';stack.className='toast-stack';document.body.append(stack)}const item=document.createElement('div');item.className='toast '+type;item.textContent=message;stack.append(item);window.setTimeout(()=>item.remove(),3200)}
function openModal(title,description,fields){const backdrop=$('#modal-backdrop');if(!backdrop){toast(description);return}$('#modal-content').innerHTML='<h2>'+title+'</h2><p>'+description+'</p><form id="preview-modal-form" class="form-grid">'+(fields||'<div class="field full"><label>Amount (preview)</label><input type="number" min="0" placeholder="0.00"></div>')+'<div class="field full"><button class="button primary" type="submit" style="width:100%">'+(title==='Search markets'?'Search markets':title==='Market filters'?'Apply filters':'Preview action')+'</button></div></form><div class="notice"><i data-lucide="info"></i><span>Frontend preview only. No data will be sent or saved and no funds will move.</span></div>';backdrop.hidden=false;if(window.lucide)lucide.createIcons();const form=$('#preview-modal-form');form.addEventListener('submit',e=>{e.preventDefault();if(title==='Search markets'){const q=$('#home-search-query',form)?.value.trim();if(!q){toast('Enter a coin or trading pair to search.','error');return}window.location.href='markets.html?q='+encodeURIComponent(q);return}if(title==='Market filters'){const controls=$('select',form);const category=controls[0]?.value||'All assets';const quote=controls[1]?.value||'USDT';window.location.href='markets.html?category='+encodeURIComponent(category)+'&quote='+encodeURIComponent(quote);return}backdrop.hidden=true;toast('Preview only — nothing was submitted.');});if(title==='Search markets')$('#home-search-query',form)?.focus()}
function closeModal(){const b=$('#modal-backdrop');if(b)b.hidden=true}
document.addEventListener('click',e=>{
 const menu=e.target.closest('[data-menu-toggle]');if(menu){$('#sidebar')?.classList.toggle('open');return}
 const mobile=e.target.closest('[data-mobile-nav]');if(mobile){$('#mobile-nav')?.classList.toggle('open');return}
 const theme=e.target.closest('[data-theme-toggle]');if(theme){document.body.classList.toggle('light-theme');toast('Theme changed for this browser preview.');return}
 const tab=e.target.closest('[data-tab]');if(tab){const key=tab.dataset.tab;const wrap=tab.closest('[data-tabs]')||tab.parentElement;$$('[data-tab]',wrap).forEach(x=>x.classList.toggle('active',x===tab));const target=tab.dataset.target;if(target){$$('[data-tab-panel]').forEach(p=>p.hidden=p.dataset.tabPanel!==target)}return}
 const toggle=e.target.closest('[data-toggle]');if(toggle){toggle.classList.toggle('on');toggle.setAttribute('aria-pressed',toggle.classList.contains('on')?'true':'false');toast('Display preference toggled (preview only).');return}
 const act=e.target.closest('[data-modal]');if(act){const kind=act.dataset.modal;const configs={
 deposit:['Deposit assets','Review the deposit screen layout. No address is generated.','<div class="field full"><label>Asset</label><select><option>USDT — Tether</option><option>BTC — Bitcoin</option><option>ETH — Ethereum</option></select></div><div class="field full"><label>Network</label><select><option>Select network</option><option>Ethereum</option><option>Polygon</option><option>Bitcoin</option></select></div>'],
 withdraw:['Withdraw assets','Review the withdrawal form layout. No transaction is submitted.','<div class="field full"><label>Asset</label><select><option>USDT — Tether</option><option>BTC — Bitcoin</option><option>ETH — Ethereum</option></select></div><div class="field full"><label>Destination address</label><input placeholder="Enter sample address"></div><div class="field full"><label>Amount</label><input type="number" min="0" placeholder="0.00"></div>'],
 transfer:['Transfer assets','Preview an internal transfer form.','<div class="field full"><label>Recipient</label><input placeholder="Recipient ID or email"></div><div class="field full"><label>Amount</label><input type="number" min="0" placeholder="0.00"></div>'],
 convert:['Convert crypto','Preview a conversion interface.','<div class="field"><label>From</label><select><option>USDT</option><option>BTC</option><option>ETH</option></select></div><div class="field"><label>To</label><select><option>BTC</option><option>ETH</option><option>USDT</option></select></div><div class="field full"><label>Amount</label><input type="number" min="0" placeholder="0.00"></div>'],
 'p2p-ad':['Create P2P ad','Ad creation layout only. The ad is not published.','<div class="field"><label>Offer type</label><select><option>Buy</option><option>Sell</option></select></div><div class="field"><label>Asset</label><select><option>USDT</option><option>BTC</option><option>ETH</option></select></div><div class="field"><label>Price</label><input type="number" placeholder="0.00"></div><div class="field"><label>Payment method</label><select><option>Bank transfer</option><option>UPI</option><option>PayPal</option></select></div>'],
 'p2p-buy':['Review P2P offer','Sample offer only. No order will be placed.','<div class="field full"><label>Amount (USDT)</label><input type="number" min="0" placeholder="Enter amount"></div><div class="field full"><label>Payment method</label><select><option>Bank transfer</option><option>UPI</option></select></div>'],
 '2fa':['Set up two-factor authentication','This is a visual setup flow; no authenticator secret exists.','<div class="field full"><label>Authenticator code</label><input inputmode="numeric" placeholder="000 000"></div>'],
 password:['Change password','Visual-only password settings. Nothing is updated.','<div class="field full"><label>Current password</label><input type="password" placeholder="Current password"></div><div class="field full"><label>New password</label><input type="password" placeholder="New password"></div>'],
 'price-alert':['Create price alert','Preview an alert form; no alerts are saved.','<div class="field full"><label>Market</label><select><option>BTC/USDT</option><option>ETH/USDT</option><option>SOL/USDT</option></select></div><div class="field full"><label>Target price</label><input type="number" placeholder="0.00"></div>'],
 'home-search':['Search markets','Search sample crypto assets and pairs. Results will be filtered on the Markets page.','<div class="field full"><label>Coin or trading pair</label><input id="home-search-query" type="search" placeholder="Bitcoin, BTC / USDT, ETH..." required></div>'],
 'market-filters':['Market filters','Choose the type of sample assets you want to explore.','<div class="field full"><label>Market category</label><select><option>All assets</option><option>Top market cap</option><option>Top gainers</option><option>Top losers</option></select></div><div class="field full"><label>Quote asset</label><select><option>All quotes</option><option>USDT</option></select></div>'],
 'sector-info':['Trending sectors','Sector bars and percentages are illustrative design data. Explore the market list for individual sample assets.','<div class="field full"><label>Sector</label><select><option>Memes</option><option>AI</option><option>Privacy Coins</option><option>PEPE</option><option>DeFi</option><option>Gaming</option></select></div>']
 };const c=configs[kind]||['Preview action','This interface is for design review only.',''];openModal(c[0],c[1],c[2]);return}
 const toastBtn=e.target.closest('[data-toast]');if(toastBtn){toast(toastBtn.dataset.toast);return}
 if(e.target.closest('[data-modal-close]')||e.target.id==='modal-backdrop'){closeModal()}
});
document.addEventListener('submit',e=>{if(e.target.matches('[data-demo-form]')){e.preventDefault();if(!e.target.matches('.mint-exchange-form'))toast(e.target.dataset.message||'Design preview only — form data was not sent or saved.')}});
document.addEventListener('input',e=>{
 if(e.target.matches('[data-table-search]')){applyMarketTableFilters(e.target)}
 if(e.target.id==='order-price'||e.target.id==='order-amount'){const p=Number($('#order-price')?.value)||0;const a=Number($('#order-amount')?.value)||0;const out=$('#order-total');if(out)out.textContent='$'+(p*a).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#global-search')?.focus()}});

/* Reference-home interactions: chart ranges, swap calculator, theme and search */
const homeRates={BTC:67432.21,ETH:3248.56,TON:5.12,USDT:1,BNB:585.32,SOL:142.67};
const homeSymbols={BTC:'₿',ETH:'◆',TON:'T',USDT:'₮',BNB:'✦',SOL:'≋'};
const homeMainPaths={
 Today:'M5 120 C22 145 28 184 46 180 S70 216 89 209 S116 251 133 231 S156 194 176 207 S205 231 223 195 S248 181 265 161 S291 193 309 163 S332 147 350 119 S372 104 389 77 S414 89 432 63 S457 51 476 71 S503 119 521 110 S547 96 564 75 S590 55 610 77 S632 106 650 75 S682 82 705 69',
 'Last Week':'M5 185 C26 174 29 154 48 165 S75 197 92 180 S114 155 134 166 S161 203 179 171 S204 135 222 151 S251 179 269 143 S291 119 310 140 S334 158 351 123 S374 105 391 119 S415 141 434 104 S460 81 479 98 S506 117 524 91 S548 72 567 93 S590 123 609 95 S634 71 651 86 S682 65 705 55',
 'Last Month':'M5 206 C25 192 31 212 50 191 S74 168 91 184 S115 152 134 174 S157 198 178 166 S201 146 221 155 S245 121 266 141 S289 167 309 128 S332 107 352 129 S373 147 392 100 S414 82 433 93 S459 115 478 70 S501 54 523 82 S548 103 567 63 S589 81 608 58 S633 78 651 49 S683 58 705 40'
};
const homeShadowPaths={
 Today:'M5 71 C22 80 21 111 42 119 S64 151 81 145 S103 188 121 179 S146 211 163 192 S191 155 209 168 S239 194 255 161 S279 143 298 134 S326 161 345 131 S365 95 384 117 S410 149 428 123 S451 91 470 109 S498 149 515 129 S541 110 560 84 S591 121 609 102 S640 128 660 98 S690 82 705 92',
 'Last Week':'M5 105 C22 132 26 114 43 128 S67 157 85 143 S111 131 128 151 S151 173 171 149 S193 124 211 143 S234 169 253 132 S276 119 296 131 S319 141 340 112 S365 95 383 123 S405 139 425 114 S452 102 472 123 S495 140 513 113 S539 95 559 111 S583 126 603 98 S633 88 651 104 S683 90 705 75',
 'Last Month':'M5 85 C24 103 29 128 48 114 S71 148 90 129 S115 120 134 146 S156 166 177 130 S200 111 222 132 S246 141 266 109 S289 100 307 123 S332 137 351 99 S374 74 394 95 S416 112 438 77 S461 61 481 91 S503 112 524 79 S546 63 568 91 S592 101 612 72 S637 58 656 79 S686 65 705 57'
};
function setHomeRange(label){
 const main=$('.usage-main-line'),shadow=$('.usage-shadow-line'),fill=$('.usage-main-fill');
 const line=homeMainPaths[label]||homeMainPaths.Today;
 if(main)main.setAttribute('d',line);
 if(shadow)shadow.setAttribute('d',homeShadowPaths[label]||homeShadowPaths.Today);
 if(fill)fill.setAttribute('d',line+' L705 282 L5 282 Z');
 const mark=$('.usage-chart-marker span');
 if(mark)mark.textContent=label==='Today'?'+0.25%':label==='Last Week'?'+1.84%':'+6.42%';
 const foot=$('.usage-chart-foot span:last-child');
 if(foot)foot.textContent=label+' · Illustrative values';
}
function getHomePair(){
 const from=$('#mint-from'),to=$('#mint-to');
 return {from:from?.value||'ETH',to:to?.value||'TON'};
}
function applyMarketTableFilters(input){
 const table=$(input?.dataset?.tableSearch||'#market-table');
 if(!table)return;
 const params=new URLSearchParams(location.search);
 const q=(input?.value||params.get('q')||'').toLowerCase().trim();
 const category=params.get('category')||'All assets';
 const quote=params.get('quote')||'USDT';
 const rows=$('tbody tr',table);
 if(category==='Top market cap'){
  rows.sort((a,b)=>{
   const capValue=row=>{const txt=row.cells[4]?.textContent||'';const m=txt.match(/([\d.]+)\s*([TBMK]?)/i);if(!m)return 0;const k=(m[2]||'').toUpperCase();return Number(m[1])*({T:1e12,B:1e9,M:1e6,K:1e3}[k]||1)};
   return capValue(b)-capValue(a);
  }).forEach(r=>table.tBodies[0].appendChild(r));
 }
 rows.forEach(row=>{
  const change=row.querySelector('td:nth-child(4)');
  const pair=row.querySelector('td:nth-child(2)')?.textContent||'';
  const passQuery=!q||row.textContent.toLowerCase().includes(q);
  const passQuote=quote==='All quotes'||pair.includes('/ '+quote);
  const passCategory=category==='All assets'||category==='All quotes'||
   (category==='Top gainers'&&change?.classList.contains('positive'))||
   (category==='Top losers'&&change?.classList.contains('negative'))||
   category==='Top market cap';
  row.hidden=!(passQuery&&passQuote&&passCategory);
 });
 const empty=$('#market-search-empty');
 const visible=rows.filter(r=>!r.hidden).length;
 if(empty)empty.hidden=visible>0;
}
function formatHomeNumber(n){
 if(!Number.isFinite(n)||n<0)return '0';
 return n.toLocaleString('en-US',{maximumFractionDigits:n>=1000?2:6});
}
function updateHomeExchange(){
 const amount=$('.mint-asset-row input[aria-label="Amount to swap"]');
 const output=$('.mint-asset-row input[aria-label="Receive estimate"]');
 if(!amount||!output)return;
 const {from,to}=getHomePair();
 const n=Number(String(amount.value).replace(/,/g,'').trim());
 const converted=(Number.isFinite(n)&&n>=0)?n*(homeRates[from]||1)/(homeRates[to]||1):0;
 output.value=formatHomeNumber(converted);
 const sourceCard=$('#mint-from')?.closest('.mint-asset-box');
 const destCard=$('#mint-to')?.closest('.mint-asset-box');
 const applyMeta=(card,token)=>{
  if(!card)return;
  const sym=card.querySelector('.mint-asset-icon');
  const name=card.querySelector('.mint-asset-name');
  if(sym){sym.textContent=homeSymbols[token]||token.slice(0,1);sym.className='mint-asset-icon '+token.toLowerCase();}
  if(name)name.textContent=({BTC:'Bitcoin',ETH:'Ethereum',TON:'Toncoin',USDT:'Tether',BNB:'BNB',SOL:'Solana'})[token]||token;
 };
 applyMeta(sourceCard,from);applyMeta(destCard,to);
 const fee=$('.mint-fee b');
 if(fee)fee.textContent='Est. '+formatHomeNumber(converted*0.001)+' '+to;
}
function swapHomeAssets(){
 const from=$('#mint-from'),to=$('#mint-to');
 if(!from||!to)return;
 const oldFrom=from.value,oldTo=to.value;
 from.value=oldTo;to.value=oldFrom;
 if(from.value!==oldTo||to.value!==oldFrom){toast('Choose two different assets to swap.','error');return;}
 updateHomeExchange();
 toast('Assets swapped in the exchange preview.');
}
document.addEventListener('click',e=>{
 const swap=e.target.closest('[data-swap-home]');
 if(swap){swapHomeAssets();return;}
 const chartTab=e.target.closest('.reference-dashboard-home .chart-range-tabs [data-tab]');
 if(chartTab){setHomeRange(chartTab.textContent.trim());return;}
 const theme=e.target.closest('[data-theme-toggle]');
 if(theme){try{localStorage.setItem('gc-exchange-preview-theme',document.body.classList.contains('light-theme')?'light':'dark')}catch(_){}}
});
document.addEventListener('input',e=>{
 if(e.target.matches('.reference-dashboard-home .mint-asset-row input[aria-label="Amount to swap"]'))updateHomeExchange();
});
document.addEventListener('change',e=>{
 if(e.target.matches('.reference-dashboard-home #mint-from,.reference-dashboard-home #mint-to'))updateHomeExchange();
});
document.addEventListener('submit',e=>{
 if(e.target.matches('.reference-dashboard-home .mint-exchange-form')){
  e.preventDefault();
  updateHomeExchange();
  const amount=$('.mint-asset-row input[aria-label="Amount to swap"]')?.value||'0';
  const output=$('.mint-asset-row input[aria-label="Receive estimate"]')?.value||'0';
  const pair=getHomePair();
  toast('Preview: '+amount+' '+pair.from+' ≈ '+output+' '+pair.to+'. No assets were exchanged.');
 }
});
try{if(localStorage.getItem('gc-exchange-preview-theme')==='light')document.body.classList.add('light-theme')}catch(_){}
if(location.pathname.endsWith('/markets.html')||location.pathname==='markets.html'){
 const params=new URLSearchParams(location.search),q=params.get('q');
 const input=$('[data-table-search]');
 if(input){if(q)input.value=q;applyMarketTableFilters(input)}
}

if(window.lucide)lucide.createIcons();
})();