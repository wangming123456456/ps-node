function te(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function w(){return te().React}var $=((...e)=>w().useState(...e)),N=((...e)=>w().useEffect(...e));var J=((...e)=>w().useRef(...e));var ne=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */

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
`;var Ue="http://localhost:23310";function T(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function L(e){return(e??"").trim().replace(/\/+$/,"")||Ue}async function re(e){let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function oe(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function x(e,t,n,o=12e4){let r=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:s}=await oe(r,"\u6295\u9012\u547D\u4EE4"),d=Date.now()+o;for(;Date.now()<d;){let i=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(s)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(i.status===204)continue;let c=await oe(i,"\u7B49\u5F85 PS");if(!c.ok)throw new Error(c.error||"PS \u8FD4\u56DE\u5931\u8D25");return c.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}async function ae(e,t,n=25e3){let o=await fetch(`${e.baseUrl}/api/ps/next?timeout=${n}`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:t});if(o.status===204)return null;if(!o.ok)throw new Error(`\u4E2D\u7EE7\u8FD4\u56DE ${o.status}`);return await o.json()}async function se(e,t,n){let o=await fetch(`${e.baseUrl}/api/ps/result`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({id:t,...n})});if(!o.ok)throw new Error(`\u56DE\u586B\u8BF7\u6C42\u7ED3\u679C\u5931\u8D25\uFF08${o.status}\uFF09`)}var de="settings.v1",Ae=2048;async function h(e){let t=await e.storage.get(de)??{},n=T();return{baseUrl:L(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:Ae,doc:t.doc||""}}async function le(e,t){let n={...await h(e),...t};return await e.storage.set(de,n),n}function C(e){return{baseUrl:e.baseUrl,token:e.token}}function E(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function H(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function ce(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ue(e){return e instanceof Error?e.message:String(e)}function B(e){let t=ue(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function ie(e,t,n,o,r){return x(C(e),"push",{image:t,mode:"layer",doc:n,layerName:o,selection:r})}async function Me(e,t){return x(C(e),"push",{image:t,mode:"newDoc",layerName:ge()})}async function pe(e,t){return x(C(e),"pull",{doc:t,maxEdge:e.maxEdge})}function me(e,t){e.updateMetadata({psStatus:"error",psError:ue(t)})}function fe(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function ge(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function xe(e){try{return await re(C(e))}catch{return null}}async function he(e){return(await x(C(e),"docs",{})).docs}async function O(e){if(!e)return"";if(e.startsWith("data:"))return e;let t=await fetch(e);if(!t.ok)throw new Error(`\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\uFF08${t.status}\uFF09`);let n=await t.blob();return await new Promise((o,r)=>{let s=new FileReader;s.onload=()=>o(typeof s.result=="string"?s.result:""),s.onerror=()=>r(new Error("\u8BFB\u53D6\u56FE\u7247\u5931\u8D25")),s.readAsDataURL(n)})}async function Ie(e){let t=o=>{let r=o.metadata?.content;return typeof r=="string"?r:""},n=[...e.getUpstream(),...e.getDownstream(),e.node];for(let o of n){let r=t(o);if(r)try{return await O(r)}catch{continue}}return""}async function ye(e,t){let n=await Ie(e);if(!n){e.updateMetadata({psStatus:"error",psError:"\u6CA1\u6709\u53EF\u63A8\u9001\u7684\u56FE\uFF1A\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9\uFF0C\u6216\u5148\u4ECE PS \u53D6\u56DE"});return}fe(e,"pushing");let o=ge(),r=e.node.metadata?.psSelection||void 0;try{let s=t.doc||E(e),d;try{d=await ie(t,n,s||void 0,o,r)}catch(i){if(!B(i))throw i;try{d=await ie(t,n,void 0,o,r)}catch(c){if(!B(c))throw c;d=await Me(t,n)}}e.updateMetadata({content:n,psStatus:"inPS",psDoc:d.doc,psLayer:d.layer??"",psError:""})}catch(s){me(e,s)}}async function be(e,t){fe(e,"pulling");try{let n;try{n=await pe(t,t.doc||void 0)}catch(o){if(!B(o))throw o;n=await pe(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:"",psSelection:n.selection??null})}catch(n){me(e,n)}}var j=e=>new Promise(t=>setTimeout(t,e));function ze(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function De(e){return e instanceof Error?e.message:String(e)}async function $e(e,t){let n=t.payload??{};try{if(t.command==="ping")return{ok:!0,data:{pong:!0}};if(t.command==="models")return{ok:!0,data:{models:e.ai.listModels("image"),defaultModel:e.ai.defaultModel("image")}};if(t.command==="latest")return{ok:!0,data:{image:ze(e,"content"),doc:E(e)}};if(t.command==="sync"){let o=typeof n.image=="string"?n.image:"";return o?(e.updateMetadata({content:o,psStatus:"inPS",psDoc:typeof n.doc=="string"&&n.doc?n.doc:E(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{synced:!0}}):{ok:!1,error:"\u7F3A\u5C11\u56FE\u7247\u6570\u636E"}}if(t.command==="generate"){let o=typeof n.prompt=="string"?n.prompt.trim():"";if(!o)return{ok:!1,error:"\u63D0\u793A\u8BCD\u4E3A\u7A7A"};let r=typeof n.reference=="string"&&n.reference?[n.reference]:[],s=typeof n.model=="string"&&n.model?n.model:void 0,i=(await e.ai.generateImage(o,{model:s,references:r})).images[0];return i?(e.updateMetadata({content:i,psStatus:"done",psDoc:typeof n.doc=="string"&&n.doc?n.doc:E(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{image:i}}):{ok:!1,error:"AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247"}}return{ok:!1,error:`\u672A\u77E5\u8BF7\u6C42\uFF1A${t.command}`}}catch(o){return{ok:!1,error:`\u751F\u6210\u5931\u8D25\uFF1A${De(o)}`}}}function ve(e){let t=!1,n=new AbortController;return(async()=>{for(;!t;)try{let r=e();if(!r){await j(1e3);continue}let s=await h(r),d={baseUrl:s.baseUrl,token:s.token},i=null;try{i=await ae(d,n.signal)}catch{if(t)return;await j(2e3);continue}if(!i)continue;let c=await $e(e()??r,i);await se(d,i.id,c)}catch{if(t)return;await j(2e3)}})(),()=>{t=!0,n.abort()}}var Je=[1024,1536,2048,0];function Be(e){let t={"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg};return Object.entries(t).map(([n,o])=>`${n}:${o}`).join(";")}function p(e,t,n){let o=document.createElement(e);return t&&(o.className=t),n!==void 0&&(o.textContent=n),o}var y=null;function He(){y&&(y.close(),y=null)}function U(e){He();let t=p("div","ps-modal");t.setAttribute("style",Be(e.theme)+";");let n=p("div","ps-modal__backdrop"),o=p("div","ps-modal__card"),r=p("div","ps-modal__head"),s=p("span","ps-status"),d=p("span","ps-dot"),i=p("span","ps-status__text","\u8FDE\u63A5\u4E2D\u2026");s.append(d,i);let c=p("button","ps-textbtn","\u5237\u65B0\u6587\u6863");c.type="button";let S=p("button","ps-modal__close","\xD7");S.type="button",S.title="\u5173\u95ED",r.append(s,p("span","ps-spacer"),c,S);let G=p("div","ps-modal__body"),Ee=p("div","ps-modal__label","\u76EE\u6807\u6587\u6863"),m=p("select","ps-select"),A=document.createElement("option");A.value="",A.textContent="\u8DDF\u968F\u5F53\u524D\u6587\u6863",m.appendChild(A);let Re=p("div","ps-modal__label","\u8F93\u51FA\u5C3A\u5BF8"),M=p("div","ps-seg");M.setAttribute("role","group");let X=Je.map(a=>{let l=p("button","",a===0?"\u539F\u56FE":String(a));return l.type="button",l.dataset.value=String(a),M.appendChild(l),l}),_e=p("div","ps-modal__hint","\u6709\u9009\u533A\u65F6\uFF1A\u53D6\u56DE=\u53EA\u53D6\u9009\u533A\uFF0C\u63A8\u9001=\u8D34\u56DE\u9009\u533A\uFF1B\u6CA1\u9009\u533A\u65F6\u53D6\u6574\u5E45\u56FE\u3002"),I=document.createElement("details");I.className="ps-details";let W=document.createElement("summary");W.textContent="\u4E2D\u7EE7\u5730\u5740";let K=p("div","ps-details__body"),b=p("input","ps-input");b.placeholder="http://localhost:23310";let v=p("input","ps-input");v.placeholder="token\uFF08\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u53EF\u7559\u7A7A\uFF09";let V=p("div","ps-modal__row"),z=p("button","ps-textbtn","\u6D4B\u8BD5\u8FDE\u63A5");z.type="button",V.append(p("span","ps-spacer"),z),K.append(b,v,V),I.append(W,K),G.append(Ee,m,Re,M,_e,I),o.append(r,G),t.append(n,o),document.body.appendChild(t);let f=null,q=!1,R=()=>{q||(q=!0,document.removeEventListener("keydown",Y,!0),t.remove(),y&&y.root===t&&(y=null))},Y=a=>{a.key==="Escape"&&R()},Q=a=>{f=a,b.value=a.baseUrl,v.value=a.token,X.forEach(l=>{let P=Number(l.dataset.value)===a.maxEdge;l.setAttribute("aria-pressed",P?"true":"false")})},_=async a=>{let l=await le(e,a);Q(l)},Ne=(a,l)=>{m.innerHTML="";let P=document.createElement("option");P.value="",P.textContent="\u8DDF\u968F\u5F53\u524D\u6587\u6863",m.appendChild(P);let ee=!1;for(let g of a){let D=document.createElement("option");D.value=g.name,D.textContent=`${g.name} \xB7 ${g.width}\xD7${g.height}`,m.appendChild(D),g.name===l&&(ee=!0)}if(l&&!ee&&l!==""){let g=document.createElement("option");g.value=l,g.textContent=l,m.appendChild(g)}m.value=l||""},Z=async()=>{if(f){d.className="ps-dot",i.textContent="\u5237\u65B0\u4E2D\u2026";try{let a=await he(f);Ne(a,f.doc),d.className="ps-dot ps-dot--ok",i.textContent="PS \u5728\u7EBF"}catch(a){d.className="ps-dot ps-dot--error",i.textContent=`\u672A\u8FDE\u63A5\uFF1A${a instanceof Error?a.message:String(a)}`}}};m.addEventListener("change",()=>void _({doc:m.value})),X.forEach(a=>{a.addEventListener("click",()=>{f&&_({maxEdge:Number(a.dataset.value)})})}),b.addEventListener("blur",()=>{f&&b.value.trim()!==f.baseUrl&&_({baseUrl:b.value.trim()})}),v.addEventListener("blur",()=>{f&&v.value!==f.token&&_({token:v.value})}),z.addEventListener("click",async()=>{let a=await xe(await h(e));d.className=a?.ok?"ps-dot ps-dot--ok":"ps-dot ps-dot--error",i.textContent=a?.ok?a.photoshop?.connected?"PS \u5728\u7EBF":"\u4E2D\u7EE7\u5728\u7EBF\uFF0CPS \u672A\u8FDE\u63A5":"\u4E2D\u7EE7\u672A\u8FDE\u63A5"}),c.addEventListener("click",()=>void Z()),S.addEventListener("click",R),n.addEventListener("click",R),document.addEventListener("keydown",Y,!0),y={root:t,close:R},(async()=>{let a=await h(e);Q(a),await Z()})()}var Oe=Symbol.for("infinite-canvas.jsx.fragment");function je(e,t,n){let o=w(),r=e===Oe?o.Fragment:e,s=n===void 0?t:{...t??{},key:n};return o.createElement(r,s)}function u(e,t,n){return je(e,t,n)}var k=u;var Fe={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"};var F=new Set(["pushing","pulling"]),Ge=12e4;function Xe(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function We(e){return e==="error"?"ps-dot ps-dot--error":F.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function Ke(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function Ve(e){if(!F.has(H(e)))return!1;let t=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0;return!!t&&Date.now()-t>Ge}function qe(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,o]=$(0);return N(()=>{if(!t)return;let r=window.setInterval(()=>o(s=>s+1),500);return()=>window.clearInterval(r)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function Ye(){return k("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[u("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),u("circle",{cx:"9",cy:"9",r:"1.5"}),u("path",{d:"m21 15-5-5L5 20"})]})}function ke({ctx:e}){let t=Ke(e,"content"),n=Ve(e),o=n?"error":H(e),r=n?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":ce(e),s=F.has(o),d=qe(e,s),i=J(e);return i.current=e,N(()=>ve(()=>i.current),[]),k("div",{className:"ps-root ps-node",style:Xe(e.theme),children:[t?u("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):k("div",{className:"ps-node__empty",children:[u(Ye,{}),u("span",{children:"\u4ECE PS \u53D6\u56DE\u753B\u9762"})]}),k("div",{className:"ps-node__status",children:[u("span",{className:We(o)}),u("span",{children:Fe[o]??o}),s&&d>0?k("span",{className:"ps-node__timer",children:[d,"s"]}):null]}),r?u("div",{className:"ps-node__error",title:r,children:r}):null]})}function we(e,t,n,o,r){return{id:t,title:n,label:n,icon:o,onClick:()=>{h(e).then(s=>r(e,s))}}}function Se(e){return[we(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",ye),we(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",be),{id:"ps-settings",title:"\u8BBE\u7F6E",label:"\u8BBE\u7F6E",icon:"\u2699\uFE0F",onClick:()=>U(e)}]}async function Pe(e){let t=await e.get("settings.v1")??{},n=T();return{baseUrl:L(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:2048,doc:t.doc||""}}function Qe(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function Ze(e){let t=typeof e.node.metadata?.content=="string"?e.node.metadata.content:"";if(!t)throw new Error("\u8FD9\u4E2A\u8282\u70B9\u8FD8\u6CA1\u6709\u56FE\u7247");let n=await O(t),o=await Pe(e.storage),r=await x({baseUrl:o.baseUrl,token:o.token},"push",{image:n,mode:"layer",doc:o.doc||void 0,layerName:Qe()});e.updateMetadata(e.node.id,{content:n,psDoc:r.doc,psLayer:r.layer??"",psStatus:"inPS"})}async function et(e){let t=await Pe(e.storage),n=await x({baseUrl:t.baseUrl,token:t.token},"pull",{doc:t.doc||void 0,maxEdge:t.maxEdge});e.updateMetadata(e.node.id,{content:n.image,status:"success",naturalWidth:n.width??e.node.metadata?.naturalWidth,naturalHeight:n.height??e.node.metadata?.naturalHeight})}function Ce(e){return e.type!=="image"?[]:[{id:"push-to-ps",label:"\u63A8\u9001\u5230 PS",icon:"\u2B06\uFE0F",run:Ze},{id:"pull-from-ps",label:"\u4ECE PS \u53D6\u56DE",icon:"\u2B07\uFE0F",run:et}]}var $t={id:"ps",name:"PS \u8282\u70B9",version:"0.1.13",description:"\u753B\u5E03 \u2194 Photoshop \u901A\u9053\uFF1A\u4EFB\u610F\u56FE\u7247\u8282\u70B9\u53F3\u952E\u5373\u53EF\u63A8\u9001\u5230 PS / \u4ECE PS \u53D6\u56DE",css:ne,nodeActions:Ce,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03 \u2194 PS \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE / \u8BBE\u7F6E\uFF1B\u751F\u6210\u6539\u56FE\u7528\u56FE\u7247\u8282\u70B9",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},onDoubleClick:e=>(U(e),!0),toolbar:Se,Content:ke}]};export{$t as default};
