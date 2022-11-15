(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))h(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&h(s)}).observe(document,{childList:!0,subtree:!0});function u(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerpolicy&&(e.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?e.credentials="include":o.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function h(o){if(o.ep)return;o.ep=!0;const e=u(o);fetch(o.href,e)}})();Date.prototype.format=function(l){return l.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP/g,r=>{const u=this.getHours(),h=u>12;switch(r){case"YYYY":return this.getFullYear().toString().padStart(2,0);case"MM":return this.getMonth().toString().padStart(2,0);case"dd":return this.getDate().toString().padStart(2,0);case"HH":return u.toString().padStart(2,0);case"mm":return this.getMinutes().toString().padStart(2,0);case"ss":return this.getSeconds().toString().padStart(2,0);case"SSS":return this.getMilliseconds().toString().padStart(3,0);case"AP":return h?"PM":"AM";default:return r}})};const y=function(){};Object.entries(console).forEach(([l,r])=>{l==="memory"?y[l]=r:y[l]=r.bind(y,"[DEV] ::")});const w=function l({id:r,memo:u,amount:h,inout:o,category:e,tags:s,from:t,to:n,created_at:a,updated_at:d}){this.id=r!=null?r:l.id,this.memo=u!=null?u:"memo"+l.id,this.amount=h!=null?h:0,this.inout=o!=null?o:!1,this.category=e!=null?e:"",this.tags=s!=null?s:[],this.from=t!=null?t:"",this.to=n!=null?n:"",this.created_at=a!=null?a:new Date().getTime(),this.updated_at=d!=null?d:new Date().getTime(),r!=null||l.id++,r==null?l.id++:l.id=r+1};w.id=0;const $=function l({id:r,name:u,data:h,created_at:o,updated_at:e}){this.id=r!=null?r:l.id,this.name=u!=null?u:"page"+l.id,this.data=h!=null?h:[],this.created_at=o!=null?o:new Date().getTime(),this.updated_at=e!=null?e:new Date().getTime(),r==null?l.id++:l.id=r+1};$.id=0;const L=function(){function l(){let e=null;this.init=(s,t)=>{e=t,window.addEventListener("click",this.handleAddPage),window.addEventListener("click",this.handleSelectPage),window.addEventListener("click",this.handleSubmit),window.addEventListener("click",this.handleDeleteItem)},this.handleSelectPage=s=>{s.preventDefault();const t=s.target;t.nodeName!=="BUTTON"||t.classList.contains("create")||!t.classList.contains("sheet")||e.changeCurrent(Number(t.dataset.pageId))},this.handleAddPage=s=>{s.preventDefault();const t=s.target;t.nodeName!=="BUTTON"||!t.classList.contains("create")||!t.classList.contains("sheet")||e.addPage()},this.handleSubmit=s=>{s.preventDefault();const t=s.target,n=t.closest("form#submit.item");if(!n||t.nodeName!=="BUTTON")return;const a=n.querySelector("textarea"),d=a.value,m=document.querySelector("#inout"),g=document.querySelector("#amount"),p=document.querySelector("#category"),v=document.querySelector("#tags"),b=document.querySelector("#from"),f=document.querySelector("#to");e.addItem({memo:d.trim(),inout:m.value,amount:Number(g.value),category:p.value,tags:v.value.split(/,\s*/g).filter(S=>S),from:b.value,to:f.value}),a.value="",m.value="0",g.value="0",p.value="",v.value="",b.value="",f.value=""},this.handleDeleteItem=s=>{s.preventDefault();const t=s.target;t.nodeName!=="BUTTON"||!t.classList.contains("del")||e.deleteItem(Number(t.dataset.itemId))}}function r(){let e=null;this.init=(s,t)=>{e=t},this.changeCurrent=s=>{e.changeCurrent(s)},this.selectPage=s=>{e.selectPage(s)},this.selectItem=s=>{e.selectItem(s)},this.addPage=(s={})=>{e.addPage(s)},this.addItem=(s={})=>{e.addItem(s)},this.updatePage=s=>{e.updatePage(s)},this.updateItem=(s,t)=>{e.updateItem(s,t)},this.deletePage=s=>{e.deletePage(s)},this.deleteItem=s=>{e.deleteItem(s)}}function u(){let e={current:0,purpose:5e5,pages:[]},s=null;this.init=(t,n)=>{s=n,this.load()},this.changeCurrent=t=>{e.current=t,this.save()},this.selectPage=t=>{var n;for(let a of e.pages)if(a.id===((n=e.current)!=null?n:Number(t)))return a},this.selectItem=t=>{const n=this.selectPage(e.current);for(let a of n.data)if(a.id===Number(t))return a},this.addPage=t=>{e.pages.push(new $(t)),this.save()},this.addItem=t=>{const n=this.selectPage(e.current);n&&n.data.push(new w(t)),this.save()},this.updatePage=t=>{for(let n of e)if(n.id===t.id){Object.assign(n,this.filterFalsyValues(t));break}this.save()},this.updateItem=(t,n)=>{const a=this.selectItem(t,a.id);a&&Object.assign(a,this.filterFalsyValues(n)),this.save()},this.deletePage=t=>{this.findIndex(e,t)>-1&&e.splice(i,1),this.save()},this.deleteItem=t=>{const n=this.selectPage(e.current);let a=this.findIndex(n.data,t);confirm(`[${n.data[a].inout?"\uC785\uAE08":"\uCD9C\uAE08"}] "${n.data[a].amount.toLocaleString()}\uC6D0" \uB808\uCF54\uB4DC\uB97C \uC9C0\uC6B0\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`)&&(a>-1&&n.data.splice(a,1),this.save())},this.findIndex=(t,n)=>{for(let a in t)if(t[a].id===n)return a;return-1},this.filterFalsyValues=t=>Object.fromEntries(Object.entries(t).filter(([n,a])=>a==null)),this.load=()=>{localStorage.getItem("accountbook")||localStorage.setItem("accountbook",JSON.stringify(e));const t=JSON.parse(localStorage.getItem("accountbook")),n=Object.keys(e),a=Object.keys(t),d=[];if(n.length<a.length){for(let m of a)if(!e[m])d.push(m);else continue;for(let m of d)delete t[m]}Object.assign(e,{...t,pages:t.pages.map(m=>new $(Object.assign(m,{data:m.data.map(g=>new w(g))})))}),this.save()},this.save=()=>{localStorage.setItem("accountbook",JSON.stringify(e)),this.update()},this.update=()=>{s.update(e)}}function h(){let e=null,s=null;this.init=(t,n)=>{e=t,s=n,this.render()},this.render=()=>{s.render(e.ui)},this.update=t=>{const{page:n,item:a,column:d}=e;s.update({page:n,item:a,column:d},t)}}function o(){let e=null,s=null,t=null,n=null,a=null;this.init=d=>{},this.$=d=>document.querySelector(d),this.render=d=>{e=this.$("#app"),e.innerHTML=d||"",s=this.$("#purpose"),t=this.$("#thead"),n=this.$("#tbody"),a=this.$("#sheets")},this.update=({page:d,item:m,column:g},p)=>{var S;let v=0,b=0,f=0;for(let c of[...a.children])c.classList.contains("create")||c.remove();for(let c of[...t.children])c.remove();for(let c of[...n.children])c.classList.contains("total")||c.remove();s.innerHTML="";for(let c of p.pages)this.$(".create.sheet").insertAdjacentHTML("beforebegin",d(c));this.$("#purpose").insertAdjacentHTML("beforeend",p.purpose.toLocaleString()),this.$("#thead").insertAdjacentHTML("beforeend",g());for(let c of p.pages[p.current].data)this.$("#tbody").insertAdjacentHTML("beforeend",m(c)),Boolean(Number(c.inout))?(b+=c.amount,v+=c.amount):(f-=c.amount,v-=c.amount);this.$("#total").innerHTML=`
      <hr />
      <div>
        ${v.toLocaleString()} won
      </div>
      <hr />
      <div>
        ${p.purpose.toLocaleString()} ${f<0?"-":"+"} ${Math.abs(f).toLocaleString()} = ${(p.purpose+f).toLocaleString()} won
      </div>
      `,document.querySelectorAll(".sheet[page-id]").forEach(c=>c.classList.remove("selected")),(S=this.$(`.sheet[data-page-id="${p.current}"]`))==null||S.classList.add("selected")},this.filter=()=>{}}return{init(e){const s=new o,t=new h,n=new u,a=new r,d=new l;s.init(e.view),t.init(e.template,s),n.init(e.model,t),a.init(e.curd,n),d.init(e.controller,a)}}}();L.init({view:{},template:{ui:`
    <div id="wrap">
      <div id="header">\uAC00\uACC4\uBD80 (<span id="purpose"></span>)</div>
      <div id="wrapper">
        <div id="board-wrap">
          <div id="board">
            <table id="table">
              <thead id="thead"></thead>
              <tbody id="tbody"></tbody>
            </table>
            <div id="total" class="total"></div>
          </div>
          <div id="sheets">
            <button class="create sheet"></button>
          </div>
        </div>
        <div id="insert">
          <div class="item">
            <select id="inout" class="input">
              <option value="1">\uC785\uAE08</option>
              <option value="0" selected>\uCD9C\uAE08</option>
            </select>
            <input id="amount" class="input" type="number" min="0" step="10" placeholder="1000" />
            <input id="category" class="input" type="text" placeholder="\uC77C\uC0C1" />
            <input id="tags" class="input" type="text" placeholder="\uC2DD\uB300, \uAC1C\uC778" />
            <input id="from" class="input" type="text" placeholder="From" />
            <input id="to" class="input" type="text" placeholder="To" />
          </div>
          <form id="submit" class="item" onsubmin="return false">
            <textarea class="input" name="memo" id="memo" cols="30" rows="10"></textarea>
            <button id="write" class="btn" type="submit">write</button>
          </form>
        </div>
      </div>
    </div>
    <div id="footer">
      <p>
        Copyright ${new Date().getFullYear()}. kimson. All rights reserved.
      </p>
    </div>
    `,item:({id:l,memo:r,amount:u,inout:h,category:o,tags:e,from:s,to:t,created_at:n,updated_at:a})=>`
    <tr class="record">
      <td><button class="del" data-item-id="${l}">\u274C</button></td>
      <!-- <span class="">${l}</span> -->
      <td class="memo">${r}</td>
      <td class="amount">${u.toLocaleString()} \u20A9</td>
      <td class="inout">${Boolean(Number(h))?"\uC785\uAE08":"\uCD9C\uAE08"}</td>
      <td class="category">${o}</td>
      ${e.length>0?`<td class="tags">${e.map(d=>`<span class="tag">${d}</span>`).join("")}</td>`:""}
      <td class="from">${s}</td>
      <td class="to">${t}</td>
      <td class="timestamp">${new Date(n<a?a:n).format("YYYY-MM-dd HH:mm")}</td>
    </tr>`,page:({id:l,name:r})=>`<button class="sheet" data-page-id="${l}">${r}</button>`,column:()=>`
    <tr class="record fields">
      <td>del</td>
      <!-- <span>12</span> -->
      <td class="block memo">memo</td>
      <td class="block amount">amount</td>
      <td class="block inout">inout</td>
      <td class="block category">category</td>
      <td class="block tags">tags</td>
      <td class="block from">from</td>
      <td class="block to">to</td>
      <td class="block timestamp">timestamp</td>
    </tr>`},model:{},crud:{},controller:{}});
