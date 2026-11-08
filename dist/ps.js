function Q(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function v(){return Q().React}var z=((...e)=>v().useState(...e)),N=((...e)=>v().useEffect(...e));var D=((...e)=>v().useRef(...e));var Z=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */

.ps-root {
    color: var(--ps-text);
    font-size: 12px;
    line-height: 1.5;
    font-family: inherit;
    -webkit-font-smoothing: antialiased;
}

/* ---------------- \u8282\u70B9\u5361\u7247 ---------------- */

.ps-node {
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 22px;
}

.ps-node__image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
}

.ps-node__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: var(--ps-placeholder);
    font-size: 11px;
    text-align: center;
}

.ps-node__status {
    position: absolute;
    left: 12px;
    bottom: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ps-muted);
    font-size: 11px;
    pointer-events: none;
}

.ps-node__timer {
    font-variant-numeric: tabular-nums;
}

.ps-node__error {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 26px;
    color: #ef4444;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
}

/* ---------------- \u72B6\u6001\u70B9 ---------------- */

.ps-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ps-muted);
    flex: none;
}

.ps-dot--ok {
    background: #22c55e;
}

.ps-dot--busy {
    background: #f59e0b;
}

.ps-dot--error {
    background: #ef4444;
}

/* ---------------- \u9762\u677F ---------------- */

.ps-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 4px;
}

.ps-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 24px;
}

.ps-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ps-muted);
    min-width: 0;
}

.ps-status__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
}

.ps-textbtn {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ps-muted);
    font: inherit;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
}

.ps-textbtn:hover:not(:disabled) {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-textbtn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.ps-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.ps-select {
    height: 32px;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    padding: 0 10px;
    border: 1px solid var(--ps-stroke);
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
}

.ps-select:focus {
    outline: none;
    border-color: var(--ps-muted);
}

.ps-select option {
    background: var(--ps-panel);
    color: var(--ps-text);
}

.ps-seg {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    flex: none;
}

.ps-seg button {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ps-muted);
    font: inherit;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-variant-numeric: tabular-nums;
}

.ps-seg button:hover {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-seg button[aria-pressed="true"] {
    color: var(--ps-text);
    font-weight: 600;
}

.ps-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 30px;
}

.ps-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 10px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ps-muted);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
}

.ps-action:hover:not(:disabled) {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-action--strong {
    color: var(--ps-text);
    font-weight: 600;
}

.ps-action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.ps-icon {
    width: 14px;
    height: 14px;
    flex: none;
}

.ps-spacer {
    flex: 1;
}

.ps-hint {
    color: var(--ps-muted);
    font-size: 11px;
    line-height: 1.6;
    min-width: 0;
}

.ps-hint--nowrap {
    max-width: 55%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ps-hint--tip {
    white-space: normal;
}

.ps-error {
    color: #ef4444;
    font-size: 11px;
}

/* ---------------- \u8BBE\u7F6E\u6D6E\u5C42 ---------------- */

.ps-modal {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ps-text);
    font-size: 12px;
    line-height: 1.5;
    font-family: inherit;
    -webkit-font-smoothing: antialiased;
}

.ps-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.28);
}

.ps-modal__card {
    position: relative;
    width: 360px;
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--ps-stroke);
    border-radius: 12px;
    background: var(--ps-panel);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

.ps-modal__head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.ps-modal__close {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ps-muted);
    font-size: 16px;
    line-height: 1;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    cursor: pointer;
    flex: none;
}

.ps-modal__close:hover {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-modal__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ps-modal__label {
    color: var(--ps-muted);
    font-size: 11px;
}

.ps-modal__hint {
    color: var(--ps-muted);
    font-size: 11px;
    line-height: 1.6;
}

.ps-modal__row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.ps-modal .ps-select {
    height: 32px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 9px;
    border: 1px solid var(--ps-stroke);
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
}

.ps-modal .ps-input {
    height: 30px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 9px;
    border: 1px solid var(--ps-stroke);
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
}

.ps-modal .ps-select:focus,
.ps-modal .ps-input:focus {
    outline: none;
    border-color: var(--ps-muted);
}

.ps-modal .ps-select option {
    background: var(--ps-panel);
    color: var(--ps-text);
}

.ps-modal .ps-seg {
    display: inline-flex;
    align-items: center;
    gap: 2px;
}

.ps-modal .ps-seg button {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ps-muted);
    font: inherit;
    font-size: 11px;
    padding: 4px 9px;
    border-radius: 6px;
    cursor: pointer;
    font-variant-numeric: tabular-nums;
}

.ps-modal .ps-seg button:hover {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-modal .ps-seg button[aria-pressed="true"] {
    color: var(--ps-text);
    font-weight: 600;
}

.ps-modal .ps-textbtn {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ps-muted);
    font: inherit;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
}

.ps-modal .ps-textbtn:hover {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-modal .ps-details > summary {
    list-style: none;
    cursor: pointer;
    color: var(--ps-muted);
    font-size: 11px;
    padding: 2px 0;
    user-select: none;
}

.ps-modal .ps-details > summary::-webkit-details-marker {
    display: none;
}

.ps-modal .ps-details > summary::before {
    content: "\u203A";
    display: inline-block;
    width: 12px;
}

.ps-modal .ps-details[open] > summary::before {
    transform: rotate(90deg);
}

.ps-modal .ps-details__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0 2px;
}


.ps-details {
    border-radius: 8px;
}

.ps-details > summary {
    list-style: none;
    cursor: pointer;
    color: var(--ps-muted);
    font-size: 11px;
    padding: 2px 0;
    user-select: none;
}

.ps-details > summary::-webkit-details-marker {
    display: none;
}

.ps-details > summary::before {
    content: "\u203A";
    display: inline-block;
    width: 12px;
    transition: transform 0.15s ease;
}

.ps-details[open] > summary {
    color: var(--ps-text);
}

.ps-details[open] > summary::before {
    transform: rotate(90deg);
}

.ps-details__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0 2px;
}

.ps-input {
    height: 30px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 0 10px;
    border: 1px solid var(--ps-stroke);
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
}

.ps-input:focus {
    outline: none;
    border-color: var(--ps-muted);
}
`;var Ne="http://localhost:23310";function te(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function ne(e){return(e??"").trim().replace(/\/+$/,"")||Ne}async function oe(e){let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function ee(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function C(e,t,n,o=12e4){let r=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:a}=await ee(r,"\u6295\u9012\u547D\u4EE4"),d=Date.now()+o;for(;Date.now()<d;){let i=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(a)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(i.status===204)continue;let c=await ee(i,"\u7B49\u5F85 PS");if(!c.ok)throw new Error(c.error||"PS \u8FD4\u56DE\u5931\u8D25");return c.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}async function re(e,t,n=25e3){let o=await fetch(`${e.baseUrl}/api/ps/next?timeout=${n}`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:t});if(o.status===204)return null;if(!o.ok)throw new Error(`\u4E2D\u7EE7\u8FD4\u56DE ${o.status}`);return await o.json()}async function se(e,t,n){let o=await fetch(`${e.baseUrl}/api/ps/result`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({id:t,...n})});if(!o.ok)throw new Error(`\u56DE\u586B\u8BF7\u6C42\u7ED3\u679C\u5931\u8D25\uFF08${o.status}\uFF09`)}var pe="settings.v1",Te=2048;async function x(e){let t=await e.storage.get(pe)??{},n=te();return{baseUrl:ne(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:Te,doc:t.doc||""}}async function de(e,t){let n={...await x(e),...t};return await e.storage.set(pe,n),n}function P(e){return{baseUrl:e.baseUrl,token:e.token}}function E(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function $(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function le(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ce(e){return e instanceof Error?e.message:String(e)}function J(e){let t=ce(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function ae(e,t,n,o,r){return C(P(e),"push",{image:t,mode:"layer",doc:n,layerName:o,selection:r})}async function Le(e,t){return C(P(e),"push",{image:t,mode:"newDoc",layerName:fe()})}async function ie(e,t){return C(P(e),"pull",{doc:t,maxEdge:e.maxEdge})}function ue(e,t){e.updateMetadata({psStatus:"error",psError:ce(t)})}function me(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function fe(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function ge(e){try{return await oe(P(e))}catch{return null}}async function xe(e){return(await C(P(e),"docs",{})).docs}async function Ie(e){if(!e)return"";if(e.startsWith("data:"))return e;let t=await fetch(e);if(!t.ok)throw new Error(`\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\uFF08${t.status}\uFF09`);let n=await t.blob();return await new Promise((o,r)=>{let a=new FileReader;a.onload=()=>o(typeof a.result=="string"?a.result:""),a.onerror=()=>r(new Error("\u8BFB\u53D6\u56FE\u7247\u5931\u8D25")),a.readAsDataURL(n)})}async function Me(e){let t=o=>{let r=o.metadata?.content;return typeof r=="string"?r:""},n=[...e.getUpstream(),...e.getDownstream(),e.node];for(let o of n){let r=t(o);if(r)try{return await Ie(r)}catch{continue}}return""}async function he(e,t){let n=await Me(e);if(!n){e.updateMetadata({psStatus:"error",psError:"\u6CA1\u6709\u53EF\u63A8\u9001\u7684\u56FE\uFF1A\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9\uFF0C\u6216\u5148\u4ECE PS \u53D6\u56DE"});return}me(e,"pushing");let o=fe(),r=e.node.metadata?.psSelection||void 0;try{let a=t.doc||E(e),d;try{d=await ae(t,n,a||void 0,o,r)}catch(i){if(!J(i))throw i;try{d=await ae(t,n,void 0,o,r)}catch(c){if(!J(c))throw c;d=await Le(t,n)}}e.updateMetadata({content:n,psStatus:"inPS",psDoc:d.doc,psLayer:d.layer??"",psError:""})}catch(a){ue(e,a)}}async function ye(e,t){me(e,"pulling");try{let n;try{n=await ie(t,t.doc||void 0)}catch(o){if(!J(o))throw o;n=await ie(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:"",psSelection:n.selection??null})}catch(n){ue(e,n)}}var B=e=>new Promise(t=>setTimeout(t,e));function Ae(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function Ue(e){return e instanceof Error?e.message:String(e)}async function ze(e,t){let n=t.payload??{};try{if(t.command==="ping")return{ok:!0,data:{pong:!0}};if(t.command==="models")return{ok:!0,data:{models:e.ai.listModels("image"),defaultModel:e.ai.defaultModel("image")}};if(t.command==="latest")return{ok:!0,data:{image:Ae(e,"content"),doc:E(e)}};if(t.command==="sync"){let o=typeof n.image=="string"?n.image:"";return o?(e.updateMetadata({content:o,psStatus:"inPS",psDoc:typeof n.doc=="string"&&n.doc?n.doc:E(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{synced:!0}}):{ok:!1,error:"\u7F3A\u5C11\u56FE\u7247\u6570\u636E"}}if(t.command==="generate"){let o=typeof n.prompt=="string"?n.prompt.trim():"";if(!o)return{ok:!1,error:"\u63D0\u793A\u8BCD\u4E3A\u7A7A"};let r=typeof n.reference=="string"&&n.reference?[n.reference]:[],a=typeof n.model=="string"&&n.model?n.model:void 0,i=(await e.ai.generateImage(o,{model:a,references:r})).images[0];return i?(e.updateMetadata({content:i,psStatus:"done",psDoc:typeof n.doc=="string"&&n.doc?n.doc:E(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{image:i}}):{ok:!1,error:"AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247"}}return{ok:!1,error:`\u672A\u77E5\u8BF7\u6C42\uFF1A${t.command}`}}catch(o){return{ok:!1,error:`\u751F\u6210\u5931\u8D25\uFF1A${Ue(o)}`}}}function be(e){let t=!1,n=new AbortController;return(async()=>{for(;!t;)try{let r=e();if(!r){await B(1e3);continue}let a=await x(r),d={baseUrl:a.baseUrl,token:a.token},i=null;try{i=await re(d,n.signal)}catch{if(t)return;await B(2e3);continue}if(!i)continue;let c=await ze(e()??r,i);await se(d,i.id,c)}catch{if(t)return;await B(2e3)}})(),()=>{t=!0,n.abort()}}var De=[1024,1536,2048,0];function Je(e){let t={"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg};return Object.entries(t).map(([n,o])=>`${n}:${o}`).join(";")}function p(e,t,n){let o=document.createElement(e);return t&&(o.className=t),n!==void 0&&(o.textContent=n),o}var h=null;function $e(){h&&(h.close(),h=null)}function T(e){$e();let t=p("div","ps-modal");t.setAttribute("style",Je(e.theme)+";");let n=p("div","ps-modal__backdrop"),o=p("div","ps-modal__card"),r=p("div","ps-modal__head"),a=p("span","ps-status"),d=p("span","ps-dot"),i=p("span","ps-status__text","\u8FDE\u63A5\u4E2D\u2026");a.append(d,i);let c=p("button","ps-textbtn","\u5237\u65B0\u6587\u6863");c.type="button";let k=p("button","ps-modal__close","\xD7");k.type="button",k.title="\u5173\u95ED",r.append(a,p("span","ps-spacer"),c,k);let H=p("div","ps-modal__body"),Se=p("div","ps-modal__label","\u76EE\u6807\u6587\u6863"),m=p("select","ps-select"),L=document.createElement("option");L.value="",L.textContent="\u8DDF\u968F\u5F53\u524D\u6587\u6863",m.appendChild(L);let Ce=p("div","ps-modal__label","\u8F93\u51FA\u5C3A\u5BF8"),I=p("div","ps-seg");I.setAttribute("role","group");let j=De.map(s=>{let l=p("button","",s===0?"\u539F\u56FE":String(s));return l.type="button",l.dataset.value=String(s),I.appendChild(l),l}),Pe=p("div","ps-modal__hint","\u6709\u9009\u533A\u65F6\uFF1A\u53D6\u56DE=\u53EA\u53D6\u9009\u533A\uFF0C\u63A8\u9001=\u8D34\u56DE\u9009\u533A\uFF1B\u6CA1\u9009\u533A\u65F6\u53D6\u6574\u5E45\u56FE\u3002"),M=document.createElement("details");M.className="ps-details";let F=document.createElement("summary");F.textContent="\u4E2D\u7EE7\u5730\u5740";let G=p("div","ps-details__body"),y=p("input","ps-input");y.placeholder="http://localhost:23310";let b=p("input","ps-input");b.placeholder="token\uFF08\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u53EF\u7559\u7A7A\uFF09";let X=p("div","ps-modal__row"),A=p("button","ps-textbtn","\u6D4B\u8BD5\u8FDE\u63A5");A.type="button",X.append(p("span","ps-spacer"),A),G.append(y,b,X),M.append(F,G),H.append(Se,m,Ce,I,Pe,M),o.append(r,H),t.append(n,o),document.body.appendChild(t);let f=null,W=!1,R=()=>{W||(W=!0,document.removeEventListener("keydown",K,!0),t.remove(),h&&h.root===t&&(h=null))},K=s=>{s.key==="Escape"&&R()},V=s=>{f=s,y.value=s.baseUrl,b.value=s.token,j.forEach(l=>{let S=Number(l.dataset.value)===s.maxEdge;l.setAttribute("aria-pressed",S?"true":"false")})},_=async s=>{let l=await de(e,s);V(l)},Ee=(s,l)=>{m.innerHTML="";let S=document.createElement("option");S.value="",S.textContent="\u8DDF\u968F\u5F53\u524D\u6587\u6863",m.appendChild(S);let Y=!1;for(let g of s){let U=document.createElement("option");U.value=g.name,U.textContent=`${g.name} \xB7 ${g.width}\xD7${g.height}`,m.appendChild(U),g.name===l&&(Y=!0)}if(l&&!Y&&l!==""){let g=document.createElement("option");g.value=l,g.textContent=l,m.appendChild(g)}m.value=l||""},q=async()=>{if(f){d.className="ps-dot",i.textContent="\u5237\u65B0\u4E2D\u2026";try{let s=await xe(f);Ee(s,f.doc),d.className="ps-dot ps-dot--ok",i.textContent="PS \u5728\u7EBF"}catch(s){d.className="ps-dot ps-dot--error",i.textContent=`\u672A\u8FDE\u63A5\uFF1A${s instanceof Error?s.message:String(s)}`}}};m.addEventListener("change",()=>void _({doc:m.value})),j.forEach(s=>{s.addEventListener("click",()=>{f&&_({maxEdge:Number(s.dataset.value)})})}),y.addEventListener("blur",()=>{f&&y.value.trim()!==f.baseUrl&&_({baseUrl:y.value.trim()})}),b.addEventListener("blur",()=>{f&&b.value!==f.token&&_({token:b.value})}),A.addEventListener("click",async()=>{let s=await ge(await x(e));d.className=s?.ok?"ps-dot ps-dot--ok":"ps-dot ps-dot--error",i.textContent=s?.ok?s.photoshop?.connected?"PS \u5728\u7EBF":"\u4E2D\u7EE7\u5728\u7EBF\uFF0CPS \u672A\u8FDE\u63A5":"\u4E2D\u7EE7\u672A\u8FDE\u63A5"}),c.addEventListener("click",()=>void q()),k.addEventListener("click",R),n.addEventListener("click",R),document.addEventListener("keydown",K,!0),h={root:t,close:R},(async()=>{let s=await x(e);V(s),await q()})()}var Be=Symbol.for("infinite-canvas.jsx.fragment");function Oe(e,t,n){let o=v(),r=e===Be?o.Fragment:e,a=n===void 0?t:{...t??{},key:n};return o.createElement(r,a)}function u(e,t,n){return Oe(e,t,n)}var w=u;var He={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"};var O=new Set(["pushing","pulling"]),je=12e4;function Fe(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function Ge(e){return e==="error"?"ps-dot ps-dot--error":O.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function Xe(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function We(e){if(!O.has($(e)))return!1;let t=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0;return!!t&&Date.now()-t>je}function Ke(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,o]=z(0);return N(()=>{if(!t)return;let r=window.setInterval(()=>o(a=>a+1),500);return()=>window.clearInterval(r)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function Ve(){return w("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[u("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),u("circle",{cx:"9",cy:"9",r:"1.5"}),u("path",{d:"m21 15-5-5L5 20"})]})}function we({ctx:e}){let t=Xe(e,"content"),n=We(e),o=n?"error":$(e),r=n?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":le(e),a=O.has(o),d=Ke(e,a),i=D(e);return i.current=e,N(()=>be(()=>i.current),[]),w("div",{className:"ps-root ps-node",style:Fe(e.theme),children:[t?u("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):w("div",{className:"ps-node__empty",children:[u(Ve,{}),u("span",{children:"\u4ECE PS \u53D6\u56DE\u753B\u9762"})]}),w("div",{className:"ps-node__status",children:[u("span",{className:Ge(o)}),u("span",{children:He[o]??o}),a&&d>0?w("span",{className:"ps-node__timer",children:[d,"s"]}):null]}),r?u("div",{className:"ps-node__error",title:r,children:r}):null]})}function ve(e,t,n,o,r){return{id:t,title:n,label:n,icon:o,onClick:()=>{x(e).then(a=>r(e,a))}}}function ke(e){return[ve(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",he),ve(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",ye),{id:"ps-settings",title:"\u8BBE\u7F6E",label:"\u8BBE\u7F6E",icon:"\u2699\uFE0F",onClick:()=>T(e)}]}var Nt={id:"ps",name:"PS \u8282\u70B9",version:"0.1.12",description:"\u753B\u5E03 \u2194 Photoshop \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE\uFF0C\u8BBE\u7F6E\u6536\u8FDB\u5DE5\u5177\u680F\u9F7F\u8F6E",css:Z,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03 \u2194 PS \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE / \u8BBE\u7F6E\uFF1B\u751F\u6210\u6539\u56FE\u7528\u56FE\u7247\u8282\u70B9",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},onDoubleClick:e=>(T(e),!0),toolbar:ke,Content:we}]};export{Nt as default};
