function V(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function g(){return V().React}var c=((...e)=>g().useState(...e)),y=((...e)=>g().useEffect(...e));var k=((...e)=>g().useCallback(...e)),T=((...e)=>g().useRef(...e));var K=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */

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
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ps-node__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--ps-placeholder);
    text-align: center;
    line-height: 1.7;
    font-size: 12px;
}

.ps-node__image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    display: block;
}

.ps-node__head {
    position: absolute;
    top: 8px;
    left: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ps-muted);
    font-size: 11px;
    pointer-events: none;
}

.ps-node__timer {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
}

.ps-node__foot {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
    pointer-events: none;
}

.ps-node__meta {
    color: var(--ps-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ps-node__error {
    color: #ef4444;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    padding: 0 2px;
}

.ps-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.ps-row--between {
    justify-content: space-between;
}

.ps-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ps-muted);
    min-width: 0;
}

.ps-spacer {
    flex: 1;
}

.ps-textbtn {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--ps-muted);
    font: inherit;
    font-size: 12px;
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

.ps-select,
.ps-input {
    height: 32px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 0 8px;
    border: 1px solid var(--ps-stroke);
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
}

.ps-select:focus,
.ps-input:focus {
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
    padding: 5px 7px;
    border-radius: 6px;
    cursor: pointer;
    font-variant-numeric: tabular-nums;
}

.ps-seg button:hover {
    background: var(--ps-hover);
    color: var(--ps-text);
}

.ps-seg button[aria-pressed="true"] {
    background: var(--ps-active);
    color: var(--ps-text);
}

.ps-actions {
    display: flex;
    gap: 8px;
}

.ps-primary {
    flex: 1;
    height: 34px;
    border: 0;
    border-radius: 8px;
    background: var(--ps-text);
    color: var(--ps-panel);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.ps-primary:hover:not(:disabled) {
    opacity: 0.88;
}

.ps-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.ps-ghost {
    flex: 1;
    height: 34px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
}

.ps-ghost:hover:not(:disabled) {
    background: var(--ps-hover);
}

.ps-ghost:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.ps-hint {
    color: var(--ps-muted);
    font-size: 11px;
    line-height: 1.5;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ps-error {
    color: #ef4444;
    font-size: 11px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ---------------- \u6298\u53E0\u533A ---------------- */

.ps-details {
    border-radius: 8px;
}

.ps-details > summary {
    list-style: none;
    cursor: pointer;
    color: var(--ps-muted);
    font-size: 12px;
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

.ps-textarea {
    width: 100%;
    box-sizing: border-box;
    min-height: 66px;
    resize: vertical;
    padding: 8px;
    border: 1px solid var(--ps-stroke);
    border-radius: 8px;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: 12px;
    line-height: 1.6;
}

.ps-textarea:focus {
    outline: none;
    border-color: var(--ps-muted);
}
`;var Pe="http://localhost:23310";function Z(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function Q(e){return(e??"").trim().replace(/\/+$/,"")||Pe}async function ee(e){let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function Y(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function h(e,t,n,o=12e4){let a=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:s}=await Y(a,"\u6295\u9012\u547D\u4EE4"),l=Date.now()+o;for(;Date.now()<l;){let p=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(s)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(p.status===204)continue;let u=await Y(p,"\u7B49\u5F85 PS");if(!u.ok)throw new Error(u.error||"PS \u8FD4\u56DE\u5931\u8D25");return u.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}async function te(e,t,n=25e3){let o=await fetch(`${e.baseUrl}/api/ps/next?timeout=${n}`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:t});if(o.status===204)return null;if(!o.ok)throw new Error(`\u4E2D\u7EE7\u8FD4\u56DE ${o.status}`);return await o.json()}async function ne(e,t,n){let o=await fetch(`${e.baseUrl}/api/ps/result`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({id:t,...n})});if(!o.ok)throw new Error(`\u56DE\u586B\u8BF7\u6C42\u7ED3\u679C\u5931\u8D25\uFF08${o.status}\uFF09`)}var ae="settings.v1",Ce=2048,se="\u5728\u4FDD\u6301\u6784\u56FE\u3001\u4E3B\u4F53\u548C\u6587\u5B57\u4E0D\u53D8\u7684\u524D\u63D0\u4E0B\u63D0\u5347\u753B\u9762\u8D28\u611F\uFF1A\u76AE\u80A4\u7EC6\u817B\u3001\u5149\u5F71\u67D4\u548C\u3001\u7EC6\u8282\u6E05\u6670\uFF0C\u8F93\u51FA\u9AD8\u8D28\u91CF\u7CBE\u4FEE\u56FE\u3002";async function m(e){let t=await e.storage.get(ae)??{},n=Z();return{baseUrl:Q(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:Ce,doc:t.doc||"",prompt:typeof t.prompt=="string"&&t.prompt.trim()?t.prompt:se}}async function re(e,t){let n={...await m(e),...t};return await e.storage.set(ae,n),n}function x(e){return{baseUrl:e.baseUrl,token:e.token}}function A(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function D(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function U(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ie(e){return e instanceof Error?e.message:String(e)}function P(e){let t=ie(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function oe(e,t,n,o){return h(x(e),"push",{image:t,mode:"layer",doc:n,layerName:o})}async function Se(e,t){return h(x(e),"push",{image:t,mode:"newDoc",layerName:L()})}async function C(e,t){return h(x(e),"pull",{doc:t,maxEdge:e.maxEdge})}function M(e,t){e.updateMetadata({psStatus:"error",psError:ie(t)})}function z(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function L(){return`AI \u4F18\u5316 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function pe(e){try{return await ee(x(e))}catch{return null}}async function de(e){return(await h(x(e),"docs",{})).docs}async function J(e,t){let n=typeof e.node.metadata?.content=="string"?e.node.metadata.content:"";if(!n){e.updateMetadata({psStatus:"error",psError:"\u8282\u70B9\u91CC\u6CA1\u6709\u56FE\uFF1A\u5148\u4ECE PS \u53D6\u56DE\uFF0C\u6216\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9"});return}z(e,"pushing");let o=L();try{let a=t.doc||A(e),s;try{s=await oe(t,n,a||void 0,o)}catch(l){if(!P(l))throw l;try{s=await oe(t,n,void 0,o)}catch(p){if(!P(p))throw p;s=await Se(t,n)}}e.updateMetadata({psStatus:"inPS",psDoc:s.doc,psLayer:s.layer??"",psError:""})}catch(a){M(e,a)}}async function $(e,t){z(e,"pulling");try{let n;try{n=await C(t,t.doc||void 0)}catch(o){if(!P(o))throw o;n=await C(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:""})}catch(n){M(e,n)}}async function O(e,t){z(e,"optimizing");try{let n=await(async()=>{try{return await C(t,t.doc||void 0)}catch(l){if(!P(l))throw l;return await C(t,void 0)}})(),a=(await e.ai.generateImage(t.prompt.trim()||se,{references:[n.image]})).images[0];if(!a)throw new Error("AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247");let s=await h(x(t),"push",{image:a,mode:"layer",doc:n.doc,layerName:L()});e.updateMetadata({content:a,psStatus:"done",psDoc:s.doc,psLayer:s.layer??"",psError:""})}catch(n){M(e,n)}}var j=e=>new Promise(t=>setTimeout(t,e));function Re(e){return e instanceof Error?e.message:String(e)}async function Ee(e,t){let n=t.payload??{};try{if(t.command==="ping")return{ok:!0,data:{pong:!0}};if(t.command==="models")return{ok:!0,data:{models:e.ai.listModels("image"),defaultModel:e.ai.defaultModel("image")}};if(t.command==="generate"){let o=typeof n.prompt=="string"?n.prompt.trim():"";if(!o)return{ok:!1,error:"\u63D0\u793A\u8BCD\u4E3A\u7A7A"};let a=typeof n.reference=="string"&&n.reference?[n.reference]:[],s=typeof n.model=="string"&&n.model?n.model:void 0,p=(await e.ai.generateImage(o,{model:s,references:a})).images[0];return p?(e.updateMetadata({content:p,psStatus:"done",psDoc:typeof n.doc=="string"&&n.doc?n.doc:A(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{image:p}}):{ok:!1,error:"AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247"}}return{ok:!1,error:`\u672A\u77E5\u8BF7\u6C42\uFF1A${t.command}`}}catch(o){return{ok:!1,error:`\u751F\u6210\u5931\u8D25\uFF1A${Re(o)}`}}}function le(e){let t=!1,n=new AbortController;return(async()=>{for(;!t;)try{let a=e();if(!a){await j(1e3);continue}let s=await m(a),l={baseUrl:s.baseUrl,token:s.token},p=null;try{p=await te(l,n.signal)}catch{if(t)return;await j(2e3);continue}if(!p)continue;let u=await Ee(e()??a,p);await ne(l,p.id,u)}catch{if(t)return;await j(2e3)}})(),()=>{t=!0,n.abort()}}var Ne=Symbol.for("infinite-canvas.jsx.fragment");function _e(e,t,n){let o=g(),a=e===Ne?o.Fragment:e,s=n===void 0?t:{...t??{},key:n};return o.createElement(a,s)}function i(e,t,n){return _e(e,t,n)}var d=i;var Ie={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",optimizing:"AI \u4F18\u5316\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"},Te={pushing:"\u63A8\u9001\u5230 PS",pulling:"\u4ECE PS \u53D6\u56DE",optimizing:"AI \u4F18\u5316"},X=new Set(["pushing","pulling","optimizing"]),Ae=[1024,1536,2048,0];function ue(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function De(e){return e==="error"?"ps-dot ps-dot--error":X.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function F(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function ce(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,o]=c(0);return y(()=>{if(!t)return;let a=window.setInterval(()=>o(s=>s+1),500);return()=>window.clearInterval(a)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function Ue(e){let[t,n]=c(null);y(()=>{let a=!0;return m(e).then(s=>{a&&n(s)}),()=>{a=!1}},[e]);let o=k(async a=>{let s=await re(e,a);return n(s),s},[e]);return{settings:t,update:o}}function Me(){return d("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[i("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),i("circle",{cx:"9",cy:"9",r:"1.5"}),i("path",{d:"m21 15-5-5L5 20"})]})}function me({ctx:e}){let t=F(e,"content"),n=D(e),o=U(e),a=[F(e,"psDoc"),F(e,"psLayer")].filter(Boolean).join(" \xB7 "),s=X.has(n),l=ce(e,s),p=T(e);return p.current=e,y(()=>le(()=>p.current),[]),d("div",{className:"ps-root ps-node","data-canvas-no-zoom":!0,onMouseDown:u=>u.stopPropagation(),onWheel:u=>u.stopPropagation(),style:ue(e.theme),children:[t?i("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):d("div",{className:"ps-node__empty",children:[i(Me,{}),i("span",{children:"\u4ECE PS \u53D6\u56DE\uFF0C\u6216\u63A5\u4E00\u4E2A\u4E0A\u6E38\u56FE\u7247"})]}),d("div",{className:"ps-node__head",children:[i("span",{className:De(n)}),i("span",{children:Ie[n]??n}),s&&l>0?d("span",{className:"ps-node__timer",children:[l,"s"]}):null]}),o||a?d("div",{className:"ps-node__foot",children:[o?i("span",{className:"ps-node__error",title:o,children:o}):null,a?i("span",{className:"ps-node__meta",title:a,children:a}):null]}):null]})}function fe({ctx:e}){let{settings:t,update:n}=Ue(e),[o,a]=c(""),[s,l]=c(""),[p,u]=c(""),[S,ye]=c([]),[R,E]=c("idle"),[G,N]=c("\u68C0\u6D4B\u4E2D\u2026"),[he,H]=c(!1),W=D(e),_=U(e),q=X.has(W),xe=ce(e,q),w=!t||he;y(()=>{t&&(a(t.baseUrl),l(t.token),u(t.prompt))},[t]);let v=k(async r=>{E("loading");try{let f=await de(r);ye(f),E("ready"),N("\u5DF2\u8FDE\u63A5 \xB7 PS \u5728\u7EBF")}catch(f){E("error"),N(`\u672A\u8FDE\u63A5\uFF1A${f instanceof Error?f.message:String(f)}`)}},[]);y(()=>{t&&v(t)},[t,v]);let I=async r=>{H(!0);try{await r(e,await m(e))}finally{H(!1);let f=await m(e);v(f)}},be=async()=>{if(!t)return;let r=await pe(await m(e));N(r?.ok?r.photoshop?.connected?"\u5DF2\u8FDE\u63A5 \xB7 PS \u5728\u7EBF":"\u5DF2\u8FDE\u63A5 \xB7 PS \u672A\u8FDE\u63A5":"\u672A\u8FDE\u63A5")},b=t?.doc??"",we=S.some(r=>r.name===b)||!b?null:i("option",{value:b,children:b});return d("div",{className:"ps-root ps-panel","data-canvas-no-zoom":!0,onMouseDown:r=>r.stopPropagation(),style:ue(e.theme),children:[d("div",{className:"ps-row ps-row--between",children:[d("span",{className:"ps-status",children:[i("span",{className:R==="error"?"ps-dot ps-dot--error":"ps-dot ps-dot--ok"}),i("span",{className:"ps-hint",title:G,children:G})]}),i("button",{type:"button",className:"ps-textbtn",disabled:!t||R==="loading",onClick:()=>t&&void v(t),children:R==="loading"?"\u5237\u65B0\u4E2D\u2026":"\u5237\u65B0\u6587\u6863"})]}),d("div",{className:"ps-row",children:[d("select",{className:"ps-select",value:b,disabled:w,onChange:r=>void n({doc:r.target.value}),children:[i("option",{value:"",children:"\u8DDF\u968F\u5F53\u524D\u6587\u6863"}),we,S.map(r=>d("option",{value:r.name,children:[r.name," \xB7 ",r.width,"\xD7",r.height]},r.name))]}),i("div",{className:"ps-seg",role:"group","aria-label":"\u8F93\u51FA\u5C3A\u5BF8",children:Ae.map(r=>i("button",{type:"button","aria-pressed":t?.maxEdge===r,onClick:()=>void n({maxEdge:r}),children:r===0?"\u539F\u56FE":r},r))})]}),d("details",{className:"ps-details",children:[i("summary",{children:"AI \u63D0\u793A\u8BCD"}),i("div",{className:"ps-details__body",children:i("textarea",{className:"ps-textarea",value:p,placeholder:"AI \u4F18\u5316\u7528\u7684\u63D0\u793A\u8BCD",onChange:r=>u(r.target.value),onBlur:()=>p!==t?.prompt&&void n({prompt:p}),onWheel:r=>r.stopPropagation()})})]}),d("div",{className:"ps-actions",children:[i("button",{type:"button",className:"ps-primary",disabled:w,onClick:()=>void I(J),children:"\u63A8\u9001"}),i("button",{type:"button",className:"ps-ghost",disabled:w,onClick:()=>void I($),children:"\u53D6\u56DE"}),i("button",{type:"button",className:"ps-ghost",disabled:w,onClick:()=>void I(O),children:"AI \u4F18\u5316"})]}),q?d("div",{className:"ps-hint",children:[Te[W]??"\u8FD0\u884C\u4E2D"," \xB7 ",xe,"s"]}):_?i("div",{className:"ps-error",title:_,children:_}):null,d("details",{className:"ps-details",children:[i("summary",{children:"\u4E2D\u7EE7\u8BBE\u7F6E"}),d("div",{className:"ps-details__body",children:[i("input",{className:"ps-input",value:o,placeholder:"http://localhost:23310",onChange:r=>a(r.target.value),onBlur:()=>o!==t?.baseUrl&&void n({baseUrl:o})}),i("input",{className:"ps-input",value:s,placeholder:"token\uFF08\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u53EF\u7559\u7A7A\uFF09",onChange:r=>l(r.target.value),onBlur:()=>s!==t?.token&&void n({token:s})}),d("div",{className:"ps-row",children:[i("span",{className:"ps-spacer"}),i("button",{type:"button",className:"ps-textbtn",disabled:!t,onClick:()=>void be(),children:"\u6D4B\u8BD5\u8FDE\u63A5"})]})]})]})]})}function B(e,t,n,o,a){return{id:t,title:n,label:n,icon:o,onClick:()=>{m(e).then(s=>a(e,s))}}}function ge(e){return[B(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",J),B(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",$),B(e,"ps-optimize","AI \u4F18\u5316","\u2728",O)]}var lt={id:"ps",name:"PS \u8282\u70B9",version:"0.1.3",description:"\u628A\u753B\u5E03\u7684\u56FE\u63A8\u8FDB Photoshop\uFF0C\u6539\u5B8C\u518D\u53D6\u56DE\u6216 AI \u4F18\u5316",css:K,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03\u53D1\u8D77\u3001PS \u843D\u5730\uFF1A\u63A8\u9001 / \u53D6\u56DE / AI \u4F18\u5316",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",autoOpenPanel:!0,resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},onDoubleClick:e=>(e.openPanel(),!0),toolbar:ge,Content:me,Panel:fe}]};export{lt as default};
