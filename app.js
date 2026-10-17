(() => {
 let lang = 'zh';
 try { lang = localStorage.getItem('language') || 'zh'; } catch {}
 if (!['zh','en'].includes(lang)) lang='zh';
 let view = 'all';
 const statuses={published:['已发表','Published'],review:['在审','Under review'],stage2:['二阶段审稿','Stage 2 review'],revision:['小修','Minor revision']};
 const $=s=>document.querySelector(s);
 const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function renderPapers(){
  const list=window.PAPERS.filter(p=>view==='all'||(view==='published'?p.status==='published':view==='review'?p.status!=='published':(p.topics || [p.topic]).includes(view)));
  $('#paper-list').innerHTML=list.map(p=>`<article class="paper"><div class="paper-label"><span class="paper-code">${esc(p.name)}</span><span class="paper-year">${p.year}</span></div><div><h3>${esc(p.name)}: ${esc(p.title)}</h3><div class="paper-meta"><span class="venue">${esc(p.venue)}</span><span class="separator">·</span><span>${lang==='zh'?p.roleZh:p.roleEn}</span><span class="status ${p.status}">${statuses[p.status][lang==='zh'?0:1]}</span></div><details><summary>${lang==='zh'?'研究简介':'Overview'}</summary><p>${esc(lang==='zh'?p.abstractZh:p.abstractEn)}</p></details></div></article>`).join('');
  $('#paper-count').textContent=lang==='zh'?`${list.length} 篇工作`:`${list.length} works`;
  document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('selected',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view))});
 }
 function setLanguage(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-zh][data-en]').forEach(el=>el.textContent=el.dataset[lang]);
  $('#language').textContent=lang==='zh'?'EN':'中文';
  $('#language').setAttribute('aria-label',lang==='zh'?'Switch to English':'切换为中文');
  $('#theme').setAttribute('aria-label',lang==='zh'?'切换浅色或深色模式':'Toggle light or dark mode');
  $('#menu').setAttribute('aria-label',lang==='zh'?'展开或收起导航':'Toggle navigation');
  $('#navigation').setAttribute('aria-label',lang==='zh'?'主导航':'Main navigation');
  document.querySelector('.filters').setAttribute('aria-label',lang==='zh'?'论文筛选':'Filter publications');
  document.title=lang==='zh'?'梁秀健 · Xiujian Liang':'Xiujian Liang · 梁秀健';
  renderPapers();
 }
 $('#language').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';try{localStorage.setItem('language',lang)}catch{}setLanguage()});
 $('#theme').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;$('#theme').setAttribute('aria-pressed',String(theme==='dark'));try{localStorage.setItem('theme',theme)}catch{}});
 $('#theme').setAttribute('aria-pressed',String(document.documentElement.dataset.theme==='dark'));
 $('#menu').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open))});
 document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('#menu').setAttribute('aria-expanded','false')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('#menu').setAttribute('aria-expanded','false')}});
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;renderPapers()}));
 document.querySelectorAll('[data-filter]').forEach(a=>a.addEventListener('click',()=>{view=a.dataset.filter;renderPapers()}));
 if ('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)document.querySelectorAll('nav a').forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main>section[id]').forEach(s=>observer.observe(s))}
 setLanguage();
})();
