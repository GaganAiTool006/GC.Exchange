/* GC.Exchange multi-page frontend interactions. Demo only; no authentication or transactions. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function toast(message,type=''){let stack=$('#toast-stack');if(!stack){stack=document.createElement('div');stack.id='toast-stack';stack.className='toast-stack';document.body.append(stack)}const item=document.createElement('div');item.className='toast '+type;item.textContent=message;stack.append(item);window.setTimeout(()=>item.remove(),3200)}
function openModal(title,description,fields){const backdrop=$('#modal-backdrop');if(!backdrop){toast(description);return}$('#modal-content').innerHTML='<h2>'+title+'</h2><p>'+description+'</p><form id="preview-modal-form" class="form-grid">'+(fields||'<div class="field full"><label>Amount (preview)</label><input type="number" min="0" placeholder="0.00"></div>')+'<div class="field full"><button class="button primary" type="submit" style="width:100%">'+(title==='Search markets'?'Search markets':title==='Market filters'?'Apply filters':'Preview action')+'</button></div></form><div class="notice"><i data-lucide="info"></i><span>Frontend preview only. No data will be sent or saved and no funds will move.</span></div>';backdrop.hidden=false;if(window.lucide)lucide.createIcons();const form=$('#preview-modal-form');form.addEventListener('submit',e=>{e.preventDefault();if(title==='Search markets'){const q=$('#home-search-query',form)?.value.trim();if(!q){toast('Enter a coin or trading pair to search.','error');return}window.location.href='markets.html?q='+encodeURIComponent(q);return}if(title==='Market filters'){const controls=$('select',form);const category=controls[0]?.value||'All assets';const quote=controls[1]?.value||'USDT';window.location.href='markets.html?category='+encodeURIComponent(category)+'&quote='+encodeURIComponent(quote);return}backdrop.hidden=true;toast('Preview only — nothing was submitted.');});if(title==='Search markets')$('#home-search-query',form)?.focus()}
function closeModal(){const b=$('#modal-backdrop');if(b)b.hidden=true}
document.addEventListener('click',e=>{
 const menu=e.target.closest('[data-menu-toggle]');if(menu){
  const subpage=document.body.classList.contains('reference-subpage');
  const tradePage=document.body.classList.contains('reference-trade-page');
  const homePage=document.body.classList.contains('reference-home');
  if(subpage||tradePage||homePage){
   const mobile=window.matchMedia('(max-width: 900px)').matches;
   if(mobile)document.body.classList.remove('menu-collapsed');
   const collapsedClass=homePage?'home-menu-collapsed':'menu-collapsed';
   const mobileClass=homePage?'home-mobile-menu-open':'mobile-menu-open';
   const cls=mobile?mobileClass:collapsedClass;
   document.body.classList.toggle(cls);
   const open=document.body.classList.contains(cls);
   menu.setAttribute('aria-expanded',open?'true':'false');
   menu.setAttribute('aria-label',mobile?(open?'Close navigation':'Open navigation'):(open?'Expand navigation':'Collapse navigation'));
   menu.title=menu.getAttribute('aria-label');
   menu.innerHTML='<i data-lucide="'+(mobile?(open?'x':'menu'):(open?'panel-left-open':'panel-left-close'))+'"></i>';
   if(window.lucide)lucide.createIcons();
   try{localStorage.setItem(homePage?'gc-exchange-home-menu-collapsed':'gc-exchange-menu-collapsed',!mobile&&open?'1':'0')}catch(_){}
  }else{$('#sidebar')?.classList.toggle('open')}
  return;
 }
 const mobile=e.target.closest('[data-mobile-nav]');if(mobile){$('#mobile-nav')?.classList.toggle('open');return}
 const theme=e.target.closest('[data-theme-toggle]');if(theme){
  document.body.classList.toggle('light-theme');
  try{localStorage.setItem('gc-exchange-preview-theme',document.body.classList.contains('light-theme')?'light':'dark')}catch(_){}
  toast('Theme changed for this browser preview.');return
 }
 const tab=e.target.closest('[data-tab]');if(tab){
  const wrap=tab.closest('[data-tabs]')||tab.parentElement;
  if(tab.closest('.chart-range-tabs')&&document.body.classList.contains('reference-dashboard-home')){setHomeRange(tab.textContent.trim());}
  $('.chart-range-tabs [data-tab]').forEach(x=>x.classList.toggle('active',x===tab));
  $('[data-tab]',wrap).forEach(x=>x.classList.toggle('active',x===tab));
  if(tab.closest('.trade-side-tabs')){
   const isSell=tab.classList.contains('sell');
   const submit=document.querySelector('.trade-submit');
   if(submit)submit.innerHTML=(isSell?'Preview sell order':'Preview buy order')+' <i data-lucide="'+(isSell?'arrow-down-right':'arrow-up-right')+'"></i>';
   const form=document.querySelector('.trade-form-fields');
   if(form)form.dataset.orderSide=isSell?'sell':'buy';
   if(window.lucide)lucide.createIcons();
  }
  const target=tab.dataset.target;if(target){$('[data-tab-panel]').forEach(p=>p.hidden=p.dataset.tabPanel!==target)}
  return
 }
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
document.addEventListener('submit',e=>{if(e.target.matches('[data-demo-form]')){e.preventDefault();if(e.target.matches('.trade-form-fields')){return}if(!e.target.matches('.mint-exchange-form'))toast(e.target.dataset.message||'Design preview only — form data was not sent or saved.')}});
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
/* Demo-only animated chart entrance and simulated price ticks. No live market feed. */
function animateOnLoad(){
 document.body.classList.add('ui-ready');
 document.querySelectorAll('.usage-main-line,.usage-shadow-line').forEach(el=>{try{const n=el.getTotalLength();el.style.strokeDasharray=String(n);el.style.strokeDashoffset=String(n);el.getBoundingClientRect();el.style.transition='stroke-dashoffset 1500ms cubic-bezier(.22,.7,.2,1)';el.style.strokeDashoffset='0'}catch(_){}});
 document.querySelectorAll('.lime-bar').forEach((bar,i)=>{bar.style.transformOrigin='bottom';bar.style.transform='scaleY(.04)';bar.style.transition='transform 700ms cubic-bezier(.2,.75,.25,1) '+(i*55)+'ms';requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.transform='scaleY(1)'))});
 document.querySelectorAll('.trade-candle-chart .candle-up,.trade-candle-chart .candle-down').forEach((el,i)=>{el.style.opacity='.35';el.style.transition='opacity 450ms ease '+(i*7)+'ms';requestAnimationFrame(()=>el.style.opacity='1')});
}
function pulseValue(el,dir){if(!el)return;el.classList.remove('price-tick-up','price-tick-down');void el.offsetWidth;el.classList.add(dir>0?'price-tick-up':'price-tick-down')}
function startDemoPriceTape(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const home=document.body.classList.contains('reference-dashboard-home'),trade=false;
 let btc=67432.21,eth=3248.56,sol=142.67;
 const fmt=(n,d=2)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
 const ticker=Array.from(document.querySelectorAll('.overview-ticker>span'));
 const tradePrice=document.querySelector('.trade-market-price strong'),tradeChange=document.querySelector('.trade-market-price span'),mid=document.querySelector('.trade-mid-price strong'),tradeStrip=document.querySelector('.trade-chart-price-strip'),bookRows=Array.from(document.querySelectorAll('.trade-book-row'));
 window.setInterval(()=>{
  btc=Math.max(1,btc*(1+(Math.random()-.48)*.00032));eth=Math.max(1,eth*(1+(Math.random()-.49)*.0005));sol=Math.max(1,sol*(1+(Math.random()-.5)*.0008));
  if(home&&ticker.length>=3){[btc,eth,sol].forEach((value,i)=>{const row=ticker[i],b=row.querySelector('b'),change=row.querySelector('em');const dir=Math.random()>.48?1:-1;if(b){b.textContent=fmt(value);pulseValue(b,dir)}if(change){change.className=dir>0?'up-change':'down-change';change.textContent=(dir>0?'↑ ':'↓ ')+(0.05+Math.random()*.9).toFixed(2)+'%';pulseValue(change,dir)}})}
  if(trade){const dir=btc>=67432.21?1:-1;if(tradePrice){tradePrice.textContent=String.fromCharCode(36)+fmt(btc);pulseValue(tradePrice,dir)}if(tradeChange){tradeChange.className=dir>0?'positive':'negative';tradeChange.textContent=(dir>0?'↗ +':'↘ ')+(Math.abs((btc/67432.21-1)*100)+1.82).toFixed(2)+'% (24h)';pulseValue(tradeChange,dir)}if(mid){mid.textContent=String.fromCharCode(36)+fmt(btc);pulseValue(mid,dir)}if(tradeStrip){const close=tradeStrip.querySelector('span:last-child');if(close){close.textContent=(dir>0?'+':'−')+fmt(Math.abs(btc-67021.40))+' ('+(dir>0?'+':'−')+Math.abs((btc/67021.40-1)*100).toFixed(2)+'%)';close.className=dir>0?'positive':'negative'}}bookRows.forEach((row,i)=>{const price=row.querySelector('span');if(price){const offset=row.classList.contains('sell')?(5-i)*9+5:(i+1)*9+1;price.textContent=fmt(btc+(row.classList.contains('sell')?offset:-offset),0);pulseValue(price,row.classList.contains('sell')?-dir:dir)}})}
 },2400);
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
try{
 if(localStorage.getItem('gc-exchange-preview-theme')==='light')document.body.classList.add('light-theme');
 if(window.matchMedia('(min-width: 901px)').matches){
 try{
  if(localStorage.getItem('gc-exchange-menu-collapsed')==='1'&&(document.body.classList.contains('reference-subpage')||document.body.classList.contains('reference-trade-page')))document.body.classList.add('menu-collapsed');
  if(localStorage.getItem('gc-exchange-home-menu-collapsed')==='1'&&document.body.classList.contains('reference-home'))document.body.classList.add('home-menu-collapsed');
 }catch(_){}
}
}catch(_){} 
if(location.pathname.endsWith('/markets.html')||location.pathname==='markets.html'){
 const params=new URLSearchParams(location.search),q=params.get('q');
 const input=$('[data-table-search]');
 if(input){if(q)input.value=q;applyMarketTableFilters(input)}
}

if(window.lucide)lucide.createIcons();
animateOnLoad();
startDemoPriceTape();

function initTradeDemo(){
 if(!document.body.classList.contains('reference-trade-page')||window.LightweightCharts)return;
 const one=s=>document.querySelector(s), all=s=>Array.from(document.querySelectorAll(s));
 const chart=one('.trade-candle-chart'), svg=chart&&chart.querySelector('svg');
 const price=one('.trade-market-price strong'), mid=one('.trade-mid-price strong');
 const priceInput=one('#order-price'), amountInput=one('#order-amount'), total=one('#order-total');
 const form=one('.trade-form-fields'), type=form&&form.querySelector('select'), submit=one('.trade-submit');
 if(!chart||!svg)return;
 let btc=67432.21, previous=btc, orderSide='buy';
 const fmt=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const candles=all('.trade-candle-chart rect.candle-up, .trade-candle-chart rect.candle-down');
 const wicks=all('.trade-candle-chart line.candle-wick'), volumes=all('.trade-volume-bar');
 const rows=all('.trade-book-row');
 const tip=document.createElement('div');
 tip.className='trade-hover-tooltip';tip.hidden=true;
 tip.innerHTML='<b>BTC / USDT</b><span>Price: —</span><span>Time: —</span><span>Volume: —</span>';
 chart.appendChild(tip);
 function calcTotal(){
  const p=Number(priceInput&&priceInput.value)||0, a=Number(amountInput&&amountInput.value)||0;
  if(total)total.textContent='$'+fmt(p*a);
 }
 function paintPrice(up){
  [price,mid].forEach(el=>{if(!el)return;el.textContent='$'+fmt(btc);el.classList.remove('price-tick-up','price-tick-down');void el.offsetWidth;el.classList.add(up?'price-tick-up':'price-tick-down')});
  const change=one('.trade-market-price span');
  if(change){change.className=up?'positive':'negative';change.textContent=(up?'↗ +':'↘ ')+(0.1+Math.random()*1.8).toFixed(2)+'% (24h)'}
  const strip=all('.trade-chart-price-strip span');
  if(strip.length>=4){strip[0].innerHTML='O <b>'+fmt(previous)+'</b>';strip[1].innerHTML='H <b>'+fmt(Math.max(previous,btc)+Math.random()*8)+'</b>';strip[2].innerHTML='L <span class="red">'+fmt(Math.min(previous,btc)-Math.random()*8)+'</span>';strip[3].innerHTML='C <b>'+fmt(btc)+'</b>'}
  if(type&&type.value==='Market'&&priceInput&&document.activeElement!==priceInput)priceInput.value=btc.toFixed(2);
  calcTotal();
 }
 function tick(){
  previous=btc;
  const delta=(Math.random()<.49?-1:1)*(0.00012+Math.random()*0.00072);
  btc=Math.max(100,btc*(1+delta));
  const up=btc>=previous;
  paintPrice(up);
  candles.forEach((r,i)=>{
   const y=Math.max(35,Math.min(292,Number(r.getAttribute('y'))+(Math.random()-.49)*34));
   const height=3+Math.random()*14, green=Math.random()>.47;
   r.setAttribute('y',y.toFixed(2));r.setAttribute('height',height.toFixed(2));
   r.classList.toggle('candle-up',green);r.classList.toggle('candle-down',!green);
   const wick=wicks[i];
   if(wick){wick.setAttribute('y1',Math.max(18,y-5-Math.random()*13));wick.setAttribute('y2',Math.min(320,y+height+5+Math.random()*12));wick.classList.toggle('candle-up',green);wick.classList.toggle('candle-down',!green)}
  });
  volumes.forEach(v=>{const height=7+Math.random()*39;v.setAttribute('height',height.toFixed(1));v.setAttribute('y',(386-height).toFixed(1));v.classList.toggle('down',Math.random()<.48)});
  rows.forEach((row,i)=>{
   const spans=row.querySelectorAll('span'),sell=row.classList.contains('sell');
   const p=btc+(sell?1:-1)*(8+i*9+Math.random()*5), qty=.05+Math.random()*.42;
   if(spans[0])spans[0].textContent=Math.round(p).toLocaleString('en-US');
   if(spans[1])spans[1].textContent=qty.toFixed(3);
   if(spans[2])spans[2].textContent=Math.round(p*qty).toLocaleString('en-US');
   row.style.setProperty('--depth',(22+Math.random()*70).toFixed(0)+'%');
  });
  const live=one('.trade-live-ticker');
  if(live)live.textContent='Demo price updates every 1.5 seconds';
 }
 chart.addEventListener('pointermove',e=>{
  const r=chart.getBoundingClientRect();
  tip.style.left=Math.max(8,Math.min(r.width-178,e.clientX-r.left+12))+'px';
  tip.style.top=Math.max(8,Math.min(r.height-88,e.clientY-r.top+12))+'px';
  const spans=tip.querySelectorAll('span');
  spans[0].textContent='Price: $'+fmt(btc);
  spans[1].textContent='Time: '+new Date().toLocaleTimeString();
  spans[2].textContent='Volume: '+(0.1+Math.random()*2).toFixed(3)+' BTC';
  tip.hidden=false;
 });
 chart.addEventListener('pointerleave',()=>tip.hidden=true);
 chart.addEventListener('click',e=>{
  if(e.target.closest('button')||!priceInput||type&&type.value==='Market')return;
  const r=chart.getBoundingClientRect(),ratio=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  priceInput.value=(btc*(1.003-ratio*.006)).toFixed(2);calcTotal();
 });
 all('.trade-chart-tools [data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  all('.trade-chart-tools [data-tab]').forEach(b=>b.classList.toggle('active',b===btn));
  chart.dataset.interval=btn.textContent.trim();
  const speed={'1m':800,'15m':1500,'1H':2200,'4H':2800,'1D':3500,'1W':4200};
  if(window.gcTradeTimer)clearInterval(window.gcTradeTimer);
  window.gcTradeTimer=setInterval(tick,speed[chart.dataset.interval]||1500);
 }));
 all('.book-modes button').forEach((btn,i)=>btn.addEventListener('click',()=>{
  rows.forEach(row=>{row.hidden=i===1?!row.classList.contains('sell'):i===2?!row.classList.contains('buy'):false});
  all('.book-modes button').forEach(b=>b.classList.toggle('active',b===btn));
 }));
 all('.trade-side-tabs [data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  orderSide=btn.classList.contains('sell')||btn.textContent.trim().toLowerCase()==='sell'?'sell':'buy';
  if(form)form.dataset.orderSide=orderSide;
  all('.trade-side-tabs [data-tab]').forEach(b=>b.classList.toggle('active',b===btn));
  if(submit){submit.classList.toggle('sell',orderSide==='sell');submit.innerHTML='Preview '+orderSide+' order <i data-lucide="'+(orderSide==='sell'?'arrow-down-right':'arrow-up-right')+'"></i>';if(window.lucide)lucide.createIcons()}
 }));
 if(type)type.addEventListener('change',()=>{if(type.value==='Market'&&priceInput)priceInput.value=btc.toFixed(2);if(priceInput)priceInput.readOnly=type.value==='Market';calcTotal()});
 [priceInput,amountInput].forEach(el=>{if(el)el.addEventListener('input',calcTotal)});
 if(form)form.addEventListener('submit',e=>{
  e.preventDefault();
  const p=Number(priceInput&&priceInput.value)||0,a=Number(amountInput&&amountInput.value)||0;
  if(p<=0||a<=0){toast('Enter a valid price and amount.','error');return}
  const panel=one('.trade-recent-card')||one('.trade-left-column');
  if(!panel)return;
  let list=panel.querySelector('.trade-demo-orders');
  if(!list){list=document.createElement('div');list.className='trade-demo-orders';list.style.cssText='padding:12px;display:grid;gap:8px';panel.appendChild(list)}
  const order={side:orderSide,price:p,amount:a,total:p*a,time:new Date().toISOString()};
  const row=document.createElement('div');row.className='trade-demo-order';row.style.cssText='display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px;border:1px solid var(--line);border-radius:8px';
  const label=document.createElement('b');label.textContent=orderSide.toUpperCase()+' · '+a+' BTC';
  const val=document.createElement('span');val.textContent='$'+fmt(p*a);
  const note=document.createElement('small');note.textContent='Demo preview only — no real trade';
  row.append(label,val,note);list.prepend(row);while(list.children.length>5)list.lastElementChild.remove();
  try{const key='gc-exchange-demo-orders';const saved=JSON.parse(localStorage.getItem(key)||'[]');saved.unshift(order);localStorage.setItem(key,JSON.stringify(saved.slice(0,20)))}catch(_){}
  toast('Demo '+orderSide.toUpperCase()+' order saved in this browser only. No real trade was placed.');
 });
 if(form)form.dataset.orderSide='buy';
 try{
  const saved=JSON.parse(localStorage.getItem('gc-exchange-demo-orders')||'[]');
  if(saved.length){
   const panel=one('.trade-recent-card')||one('.trade-left-column');
   if(panel){
    let list=panel.querySelector('.trade-demo-orders');
    if(!list){list=document.createElement('div');list.className='trade-demo-orders';list.style.cssText='padding:12px;display:grid;gap:8px';panel.appendChild(list)}
    saved.slice(0,5).forEach(order=>{
     const row=document.createElement('div');row.className='trade-demo-order';row.style.cssText='display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px;border:1px solid var(--line);border-radius:8px';
     const label=document.createElement('b');label.textContent=String(order.side||'buy').toUpperCase()+' · '+Number(order.amount||0).toLocaleString()+' BTC';
     const val=document.createElement('span');val.textContent='$'+fmt(Number(order.total)||0);
     const note=document.createElement('small');note.textContent='Saved demo · '+(order.time?new Date(order.time).toLocaleString():'previous session');
     row.append(label,val,note);list.appendChild(row);
    });
   }
  }
 }catch(_){}
 calcTotal();tick();
 if(window.gcTradeTimer)clearInterval(window.gcTradeTimer);
 window.gcTradeTimer=setInterval(tick,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initTradeDemo,{once:true});else initTradeDemo();
})();

/* Shared mobile navigation and live public market feed */
(function(){
 'use strict';
 const navItems=[
  {href:'index.html',label:'Home',icon:'house',match:['index.html','']},
  {href:'markets.html',label:'Markets',icon:'chart-no-axes-combined',match:['markets.html']},
  {href:'trade.html',label:'Trade',icon:'candlestick-chart',match:['trade.html']},
  {href:'wallet.html',label:'Wallet',icon:'wallet',match:['wallet.html']},
  {href:'profile.html',label:'Profile',icon:'user-round',match:['profile.html']}
 ];
 function mountMobileNav(){
  if(document.querySelector('.gc-mobile-bottom-nav'))return;
  const file=location.pathname.split('/').pop()||'index.html';
  const active=navItems.find(x=>x.match.includes(file))||navItems[0];
  const nav=document.createElement('nav');nav.className='gc-mobile-bottom-nav';nav.setAttribute('aria-label','Mobile main navigation');
  nav.innerHTML=navItems.map(item=>'<a href="'+item.href+'"'+(item===active?' class="active" aria-current="page"':'')+'><i data-lucide="'+item.icon+'"></i><span>'+item.label+'</span></a>').join('');
  document.body.appendChild(nav);if(window.lucide)window.lucide.createIcons();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountMobileNav,{once:true});else mountMobileNav();
})();
(function(){
 'use strict';
 if(!document.body.classList.contains('reference-trade-page'))return;
 const host=document.querySelector('.trade-candle-chart');
 if(!host||!window.LightweightCharts)return;
 document.body.classList.add('gc-live-chart');
 const wrap=document.createElement('div');wrap.className='gc-live-chart';wrap.id='gc-live-btc-chart';
 const status=document.createElement('div');status.className='gc-live-chart-status';status.innerHTML='<i></i><span>Connecting to Binance public market data…</span>';
 wrap.appendChild(status);host.insertBefore(wrap,host.firstChild);
 const chart=window.LightweightCharts.createChart(wrap,{
  width:host.clientWidth,height:360,
  layout:{background:{color:'transparent'},textColor:'#91a7c6',fontFamily:'Inter, sans-serif'},
  grid:{vertLines:{color:'rgba(105,139,177,.10)'},horzLines:{color:'rgba(105,139,177,.10)'}},
  rightPriceScale:{borderColor:'rgba(105,139,177,.22)'},
  timeScale:{borderColor:'rgba(105,139,177,.22)',timeVisible:true,secondsVisible:false},
  crosshair:{mode:0},handleScroll:true,handleScale:true
 });
 const candles=chart.addCandlestickSeries({upColor:'#22c997',downColor:'#f06479',borderUpColor:'#22c997',borderDownColor:'#f06479',wickUpColor:'#22c997',wickDownColor:'#f06479',priceLineVisible:true});
 const volume=chart.addHistogramSeries({priceFormat:{type:'volume'},priceScaleId:'volume',scaleMargins:{top:.82,bottom:0}});
 chart.priceScale('volume').applyOptions({scaleMargins:{top:.82,bottom:0}});
 let socket=null,interval='15m',lastPrice=0,closed=false;
 const pair='BTCUSDT';
 const fmt=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 function setStatus(message,state){status.className='gc-live-chart-status '+(state||'');status.querySelector('span').textContent=message}
 function renderPrice(price,change){
  lastPrice=price;
  const strong=document.querySelector('.trade-market-price strong');if(strong)strong.textContent='$'+fmt(price);
  const mid=document.querySelector('.trade-mid-price strong');if(mid)mid.textContent='$'+fmt(price);
  const changeEl=document.querySelector('.trade-market-price span');
  if(changeEl&&typeof change==='number'){changeEl.className=change>=0?'positive':'negative';changeEl.textContent=(change>=0?'↗ +':'↘ ')+Math.abs(change).toFixed(2)+'% (24h)'}
  const input=document.querySelector('#order-price'),type=document.querySelector('.trade-form-fields select');
  if(input&&type&&type.value==='Market'&&document.activeElement!==input)input.value=price.toFixed(2);
  const total=document.querySelector('#order-total'),amount=Number(document.querySelector('#order-amount')?.value||0);
  if(total)total.textContent='$'+fmt(price*amount);
 }
 async function loadTicker(){
  try{const r=await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol='+pair);if(!r.ok)throw new Error('Ticker request failed');const d=await r.json();renderPrice(Number(d.lastPrice),Number(d.priceChangePercent));
   const stats=document.querySelectorAll('.trade-market-stats span b');
   if(stats[0])stats[0].textContent='$'+fmt(Number(d.highPrice));
   if(stats[1])stats[1].textContent='$'+fmt(Number(d.lowPrice));
   if(stats[2])stats[2].textContent=Number(d.volume).toLocaleString('en-US',{maximumFractionDigits:2});
   if(stats[3])stats[3].textContent='$'+Number(d.quoteVolume).toLocaleString('en-US',{maximumFractionDigits:0});
  }catch(e){setStatus('Live ticker unavailable — retrying','error')}
 }
 async function loadHistory(){
  setStatus('Loading BTC/USDT candles…');
  try{
   const r=await fetch('https://api.binance.com/api/v3/klines?symbol='+pair+'&interval='+interval+'&limit=500');
   if(!r.ok)throw new Error('Binance returned HTTP '+r.status);
   const data=await r.json();
   const candleData=data.map(k=>({time:Math.floor(k[0]/1000),open:+k[1],high:+k[2],low:+k[3],close:+k[4]}));
   const volumeData=data.map(k=>({time:Math.floor(k[0]/1000),value:+k[5],color:+k[4]>=+k[1]?'rgba(34,201,151,.38)':'rgba(240,100,121,.38)'}));
   candles.setData(candleData);volume.setData(volumeData);chart.timeScale().fitContent();
   const last=candleData[candleData.length-1];if(last)renderPrice(last.close);
   setStatus('LIVE · Binance public data','live');connectSocket();
  }catch(e){setStatus('Could not load live candles','error');const msg=document.createElement('div');msg.className='gc-live-chart-error';msg.textContent='Binance market data could not be reached from this connection. Please retry or check network access.';wrap.appendChild(msg)}
 }
 function connectSocket(){
  if(socket){socket.onclose=null;socket.close()}
  const stream=pair.toLowerCase()+'@kline_'+interval;
  socket=new WebSocket('wss://stream.binance.com:9443/ws/'+stream);
  socket.onopen=()=>setStatus('LIVE · BTC/USDT · Binance','live');
  socket.onmessage=e=>{
   try{
    const k=JSON.parse(e.data).k;if(!k)return;
    const bar={time:Math.floor(k.t/1000),open:+k.o,high:+k.h,low:+k.l,close:+k.c};
    candles.update(bar);volume.update({time:bar.time,value:+k.v,color:bar.close>=bar.open?'rgba(34,201,151,.38)':'rgba(240,100,121,.38)'});
    renderPrice(bar.close);
   }catch(_){}
  };
  socket.onerror=()=>setStatus('Reconnecting live feed…','error');
  socket.onclose=()=>{if(!closed){setStatus('Live feed disconnected — retrying','error');setTimeout(()=>{if(!closed)connectSocket()},3000)}};
 }
 document.querySelectorAll('.trade-chart-tools [data-tab]').forEach(btn=>{
  btn.addEventListener('click',()=>{
   const value=btn.textContent.trim();if(!['1m','15m','1H','4H','1D','1W'].includes(value))return;
   interval=({'1H':'1h','4H':'4h','1D':'1d','1W':'1w'})[value]||value;
   if(socket){socket.onclose=null;socket.close();socket=null}
   wrap.querySelector('.gc-live-chart-error')?.remove();loadHistory();
  });
 });
 const resize=()=>chart.applyOptions({width:host.clientWidth,height:wrap.clientHeight||360});
 if(window.ResizeObserver){new ResizeObserver(resize).observe(host)}else window.addEventListener('resize',resize);
 loadHistory();loadTicker();const tickerTimer=setInterval(loadTicker,15000);
 window.addEventListener('pagehide',()=>{closed=true;clearInterval(tickerTimer);if(socket){socket.onclose=null;socket.close()}chart.remove()},{once:true});
})();

/* Homepage BTC/USDT chart — Kraken public REST + WebSocket (no API key) */
(function(){
 'use strict';
 const root=document.getElementById('gc-home-btc-chart');
 if(!root)return;
 const status=document.querySelector('[data-home-chart-status]');
 const priceNode=document.querySelector('[data-home-btc-price]');
 const changeNode=document.querySelector('[data-home-btc-change]');
 const fmt=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 let chart=null,candle=null,socket=null,interval=15,closed=false,retryTimer=null;
 function setStatus(msg,state){if(!status)return;status.className='gc-home-chart-status '+(state||'');status.querySelector('span').textContent=msg}
 function price(pctPrice,pctChange){if(priceNode&&Number.isFinite(pctPrice))priceNode.textContent='$'+fmt(pctPrice);if(changeNode&&Number.isFinite(pctChange)){changeNode.style.color=pctChange>=0?'#22c997':'#f06479';changeNode.textContent=(pctChange>=0?'+':'')+pctChange.toFixed(2)+'% (24h)'}}
 function initChart(){
  if(!window.LightweightCharts){setStatus('Chart library did not load — retrying','error');return false}
  if(chart)return true;
  chart=window.LightweightCharts.createChart(root,{width:Math.max(280,root.clientWidth),height:root.clientHeight||250,layout:{background:{color:'transparent'},textColor:'#91a7c6',fontFamily:'Inter, sans-serif'},grid:{vertLines:{color:'rgba(105,139,177,.10)'},horzLines:{color:'rgba(105,139,177,.10)'}},rightPriceScale:{borderColor:'rgba(105,139,177,.2)'},timeScale:{borderColor:'rgba(105,139,177,.2)' ,timeVisible:true,secondsVisible:false},crosshair:{mode:0},handleScroll:true,handleScale:true});
  candle=chart.addCandlestickSeries({upColor:'#22c997',downColor:'#f06479',borderUpColor:'#22c997',borderDownColor:'#f06479',wickUpColor:'#22c997',wickDownColor:'#f06479',priceLineVisible:true});return true;
 }
 const intervalMap={1:1,5:5,15:15,60:60,360:360,1440:1440};
 async function history(){
  if(!initChart())return;
  setStatus('Loading free Kraken BTC/USD market candles…');
  try{
   const response=await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval='+interval,{cache:'no-store'});
   if(!response.ok)throw new Error('Kraken HTTP '+response.status);
   const payload=await response.json();if(payload.error&&payload.error.length)throw new Error(payload.error.join(', '));
   const key=Object.keys(payload.result).find(k=>k!=='last');const rows=payload.result[key]||[];
   if(!rows.length)throw new Error('No candle data returned');
   const bars=rows.map(k=>({time:Number(k[0]),open:+k[1],high:+k[2],low:+k[3],close:+k[4]})).filter(k=>Number.isFinite(k.time)&&Number.isFinite(k.close));
   candle.setData(bars);chart.timeScale().fitContent();price(bars[bars.length-1].close);
   setStatus('LIVE · Kraken public market data','live');connect();
  }catch(err){setStatus('Kraken feed unavailable — trying Binance backup','error');await binanceFallback()}
 }
 async function binanceFallback(){
  try{
   const map={1:'1m',5:'5m',15:'15m',60:'1h',360:'6h',1440:'1d'};
   const response=await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval='+map[interval]+'&limit=300',{cache:'no-store'});
   if(!response.ok)throw new Error('Binance HTTP '+response.status);
   const rows=await response.json();if(!Array.isArray(rows)||!rows.length)throw new Error('Empty backup data');
   const bars=rows.map(k=>({time:Math.floor(k[0]/1000),open:+k[1],high:+k[2],low:+k[3],close:+k[4]}));
   candle.setData(bars);chart.timeScale().fitContent();price(bars[bars.length-1].close);
   setStatus('LIVE · Binance public backup (Kraken unavailable)','live');connectBinance(map[interval]);
  }catch(err){setStatus('Live market API unavailable — check network or hosting restrictions','error')}
 }
 function connect(){
  if(socket){socket.onclose=null;socket.close()}
  socket=new WebSocket('wss://ws.kraken.com/v2');
  socket.onopen=()=>{socket.send(JSON.stringify({method:'subscribe',params:{channel:'ohlc',symbol:['BTC/USD'],interval:interval===1?1:interval===5?5:interval===15?15:interval===60?60:interval===360?360:1440}}));setStatus('LIVE · Kraken BTC/USD WebSocket','live')};
  socket.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.channel!=='ohlc'||!m.data)return;m.data.forEach(k=>{const b={time:Math.floor(Date.parse(k.interval_begin)/1000),open:+k.open,high:+k.high,low:+k.low,close:+k.close};if(Number.isFinite(b.time)&&Number.isFinite(b.close))candle.update(b);price(b.close)})}catch(_){}};
  socket.onerror=()=>setStatus('Kraken stream reconnecting…','error');
  socket.onclose=()=>{if(!closed){setStatus('Kraken stream disconnected — reconnecting','error');retryTimer=setTimeout(()=>{if(!closed)connect()},3500)}};
 }
 function connectBinance(iv){
  if(socket){socket.onclose=null;socket.close()}
  socket=new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_'+iv);
  socket.onopen=()=>setStatus('LIVE · Binance BTC/USDT WebSocket backup','live');
  socket.onmessage=e=>{try{const k=JSON.parse(e.data).k,b={time:Math.floor(k.t/1000),open:+k.o,high:+k.h,low:+k.l,close:+k.c};candle.update(b);price(b.close)}catch(_){}};
  socket.onclose=()=>{if(!closed){setStatus('Backup stream disconnected — retrying','error');retryTimer=setTimeout(()=>{if(!closed)connectBinance(iv)},3500)}};
 }
 document.querySelectorAll('[data-home-timeframes] [data-interval]').forEach(btn=>btn.addEventListener('click',()=>{const v=btn.dataset.interval;interval=({ '1m':1,'15m':15,'1h':60,'4h':60,'1d':1440})[v]||15;document.querySelectorAll('[data-home-timeframes] [data-interval]').forEach(b=>b.classList.toggle('active',b===btn));if(socket){socket.onclose=null;socket.close();socket=null}history()}));
 const resize=()=>{if(chart)chart.applyOptions({width:Math.max(280,root.clientWidth),height:root.clientHeight||250})};
 if(window.ResizeObserver)new ResizeObserver(resize).observe(root.parentElement);else window.addEventListener('resize',resize);
 if(!initChart())return;
 history();
 window.addEventListener('pagehide',()=>{closed=true;clearTimeout(retryTimer);if(socket){socket.onclose=null;socket.close()}if(chart)chart.remove()},{once:true});
})();
