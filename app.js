// ---- CONFIG: paste your Supabase project values ----
const SUPABASE_URL='https://hfqzuhlvvzxjrfsrsinw.supabase.co', SUPABASE_KEY='sb_publishable_IGBpCd0-nWbKebt_aSTGPA_6Ogyp8bi';
const db=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=n=>`<i data-lucide="${n}"></i>`;
const sha=async p=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const me=()=>JSON.parse(localStorage.getItem('lms_user')||'null');
const setMe=u=>localStorage.setItem('lms_user',JSON.stringify(u));
const home=u=>u.role==='admin'?'admin.html':'app.html';
const drv=u=>{const m=String(u||'').match(/[-\w]{25,}/);return u&&u.includes('drive.google')&&m?`https://drive.google.com/thumbnail?id=${m[0]}&sz=w200`:u};
const avatar=(u,c='')=>`<span class="av ${c}">${esc((u.name||'?')[0].toUpperCase())}${u.photo_url?`<img src="${esc(drv(u.photo_url))}" alt="" onerror="this.remove()">`:''}</span>`;
const fmt=d=>d?new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'';
const head=(t,s,x='')=>`<div class="head"><div><h1>${t}</h1><p class="mut">${s||''}</p></div><div class="row">${x}</div></div>`;
const cnt=async(t,m={})=>(await db.from(t).select('*',{count:'exact',head:true}).match(m)).count||0;
document.documentElement.dataset.theme=localStorage.getItem('lms_theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
function toast(m,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2600)}
function toggleTheme(){const d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;localStorage.setItem('lms_theme',n)}
function guard(role){const u=me();if(!u){location.replace('index.html');return}if(u.role!==role){location.replace(home(u));return}return u}

function modal(title,body,onOk){
  const m=document.createElement('div');m.className='modal';
  m.innerHTML=`<form class="card"><h2>${title}</h2>${body}<div class="row end"><button type="button" class="btn line" data-x>Cancel</button><button class="btn">Save</button></div></form>`;
  document.body.append(m);lucide.createIcons();
  m.onclick=e=>{if(e.target===m||e.target.closest('[data-x]'))m.remove()};
  m.querySelector('form').onsubmit=async e=>{e.preventDefault();try{await onOk(Object.fromEntries(new FormData(e.target)));m.remove()}catch(x){toast(x.message,1)}};
}
const field=([k,l,t,req,o],v='')=>`<label>${l}${req?' *':''}${t==='textarea'?`<textarea class="in" name="${k}" ${req?'required':''}>${esc(v)}</textarea>`:t==='select'?`<select class="in" name="${k}">${o.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join('')}</select>`:`<input class="in" name="${k}" type="${t||'text'}" value="${esc(v)}" ${req?'required':''}>`}</label>`;

// Generic table. o={title,sub,table,select,cols:[[key,label,type,fn]],fields,rw,pre}
async function crud(el,o){
  let rows=[],q='';
  el.innerHTML=head(o.title,o.sub,`<input class="in" id="q" placeholder="Search" aria-label="Search">${o.rw?`<button class="btn" id="add">${ic('plus')}Add new</button>`:''}`)+'<div class="card tbl" id="t"></div>';
  const cell=(c,r)=>{const[k,,t,f]=c,v=f?f(r):r[k];return t==='link'?`<a class="lnk" href="${esc(v)}" target="_blank" rel="noopener">Open ${ic('external-link')}</a>`:t==='img'?avatar(r):t==='date'?fmt(v):t==='badge'?`<span class="badge">${esc(v)}</span>`:esc(v)};
  const draw=()=>{const f=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));
    $('#t',el).innerHTML=f.length?`<table><thead><tr>${o.cols.map(c=>`<th>${c[1]}</th>`).join('')}${o.rw?'<th></th>':''}</tr></thead><tbody>${f.map(r=>`<tr>${o.cols.map(c=>`<td>${cell(c,r)}</td>`).join('')}${o.rw?`<td class="act"><button class="btn ghost icon" data-e="${r.id}" aria-label="Edit">${ic('pencil')}</button><button class="btn ghost icon" data-d="${r.id}" aria-label="Delete">${ic('trash-2')}</button></td>`:''}</tr>`).join('')}</tbody></table>`:`<div class="empty">${rows.length?'No matches found.':'Nothing here yet.'}</div>`;
    lucide.createIcons()};
  const load=async()=>{const{data,error}=await db.from(o.table).select(o.select||'*').order('created_at',{ascending:false});if(error)toast(error.message,1);rows=data||[];draw()};
  const form=(r={})=>{const id=r.id;modal(id?'Edit':'Add new',o.fields.map(f=>field(f,r[f[0]])).join(''),async d=>{
    if(o.pre)await o.pre(d,!id);for(const k in d)if(d[k]==='')d[k]=null;
    const{error}=id?await db.from(o.table).update(d).eq('id',id):await db.from(o.table).insert(d);if(error)throw error;toast('Saved');load()})};
  $('#q',el).oninput=e=>{q=e.target.value.toLowerCase();draw()};
  if(o.rw){$('#add',el).onclick=()=>form();
    el.onclick=async e=>{const b=e.target.closest('button[data-e],button[data-d]');if(!b)return;
      if(b.dataset.e)form(rows.find(r=>r.id===b.dataset.e));
      else if(confirm('Delete this item? This cannot be undone.')){const{error}=await db.from(o.table).delete().eq('id',b.dataset.d);error?toast(error.message,1):(toast('Deleted'),load())}}}
  load();
}

// App shell: items=[[id,label,icon]], pages={id:fn(view)}
function shell(u,items,pages){
  document.body.innerHTML=`<div class="app"><aside id="sb"><div class="brand">${ic('graduation-cap')}Learnly</div><nav>${items.map(([id,l,i])=>`<a href="#${id}" data-id="${id}">${ic(i)}${l}</a>`).join('')}</nav></aside><div class="main"><header><button class="btn ghost icon" id="menu" aria-label="Menu">${ic('menu')}</button><div class="sp"></div><button class="btn ghost icon" id="theme" aria-label="Toggle theme">${ic('sun-moon')}</button><div class="who">${avatar(u)}<div><b>${esc(u.name)}</b><small>${u.role}</small></div></div><button class="btn ghost icon" id="out" aria-label="Sign out">${ic('log-out')}</button></header><main id="view"></main></div></div>`;
  $('#menu').onclick=()=>$('#sb').classList.toggle('open');$('#theme').onclick=toggleTheme;
  $('#out').onclick=()=>{localStorage.removeItem('lms_user');location.href='index.html'};
  const go=async()=>{const id=pages[location.hash.slice(1)]?location.hash.slice(1):items[0][0];
    document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.id===id));$('#sb').classList.remove('open');
    const v=$('#view');v.onclick=v.onchange=v.onsubmit=null;await pages[id](v);lucide.createIcons()};
  addEventListener('hashchange',go);go();lucide.createIcons();
}
