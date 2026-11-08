function B(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function g(){return B().React}var l=((...e)=>g().useState(...e)),y=((...e)=>g().useEffect(...e));var P=((...e)=>g().useCallback(...e)),S=((...e)=>g().useRef(...e));var j=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */

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

/* ---------------- \u6298\u53E0\u533A ---------------- */

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
`;var we="http://localhost:23310";function G(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function H(e){return(e??"").trim().replace(/\/+$/,"")||we}async function W(e){let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function X(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function x(e,t,n,o=12e4){let s=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:a}=await X(s,"\u6295\u9012\u547D\u4EE4"),p=Date.now()+o;for(;Date.now()<p;){let c=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(a)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(c.status===204)continue;let u=await X(c,"\u7B49\u5F85 PS");if(!u.ok)throw new Error(u.error||"PS \u8FD4\u56DE\u5931\u8D25");return u.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}async function V(e,t,n=25e3){let o=await fetch(`${e.baseUrl}/api/ps/next?timeout=${n}`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:t});if(o.status===204)return null;if(!o.ok)throw new Error(`\u4E2D\u7EE7\u8FD4\u56DE ${o.status}`);return await o.json()}async function q(e,t,n){let o=await fetch(`${e.baseUrl}/api/ps/result`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({id:t,...n})});if(!o.ok)throw new Error(`\u56DE\u586B\u8BF7\u6C42\u7ED3\u679C\u5931\u8D25\uFF08${o.status}\uFF09`)}var Q="settings.v1",ve=2048;async function m(e){let t=await e.storage.get(Q)??{},n=G();return{baseUrl:H(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:ve,doc:t.doc||""}}async function Z(e,t){let n={...await m(e),...t};return await e.storage.set(Q,n),n}function b(e){return{baseUrl:e.baseUrl,token:e.token}}function w(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function C(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function D(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ee(e){return e instanceof Error?e.message:String(e)}function I(e){let t=ee(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function K(e,t,n,o,s){return x(b(e),"push",{image:t,mode:"layer",doc:n,layerName:o,selection:s})}async function ke(e,t){return x(b(e),"push",{image:t,mode:"newDoc",layerName:oe()})}async function Y(e,t){return x(b(e),"pull",{doc:t,maxEdge:e.maxEdge})}function te(e,t){e.updateMetadata({psStatus:"error",psError:ee(t)})}function ne(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function oe(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function se(e){try{return await W(b(e))}catch{return null}}async function ae(e){return(await x(b(e),"docs",{})).docs}async function Pe(e){if(!e)return"";if(e.startsWith("data:"))return e;let t=await fetch(e);if(!t.ok)throw new Error(`\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\uFF08${t.status}\uFF09`);let n=await t.blob();return await new Promise((o,s)=>{let a=new FileReader;a.onload=()=>o(typeof a.result=="string"?a.result:""),a.onerror=()=>s(new Error("\u8BFB\u53D6\u56FE\u7247\u5931\u8D25")),a.readAsDataURL(n)})}async function Se(e){let t=o=>{let s=o.metadata?.content;return typeof s=="string"?s:""},n=[...e.getUpstream(),...e.getDownstream(),e.node];for(let o of n){let s=t(o);if(s)try{return await Pe(s)}catch{continue}}return""}async function U(e,t){let n=await Se(e);if(!n){e.updateMetadata({psStatus:"error",psError:"\u6CA1\u6709\u53EF\u63A8\u9001\u7684\u56FE\uFF1A\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9\uFF0C\u6216\u5148\u4ECE PS \u53D6\u56DE"});return}ne(e,"pushing");let o=oe(),s=e.node.metadata?.psSelection||void 0;try{let a=t.doc||w(e),p;try{p=await K(t,n,a||void 0,o,s)}catch(c){if(!I(c))throw c;try{p=await K(t,n,void 0,o,s)}catch(u){if(!I(u))throw u;p=await ke(t,n)}}e.updateMetadata({content:n,psStatus:"inPS",psDoc:p.doc,psLayer:p.layer??"",psError:""})}catch(a){te(e,a)}}async function A(e,t){ne(e,"pulling");try{let n;try{n=await Y(t,t.doc||void 0)}catch(o){if(!I(o))throw o;n=await Y(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:"",psSelection:n.selection??null})}catch(n){te(e,n)}}var M=e=>new Promise(t=>setTimeout(t,e));function Ce(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function Re(e){return e instanceof Error?e.message:String(e)}async function Ee(e,t){let n=t.payload??{};try{if(t.command==="ping")return{ok:!0,data:{pong:!0}};if(t.command==="models")return{ok:!0,data:{models:e.ai.listModels("image"),defaultModel:e.ai.defaultModel("image")}};if(t.command==="latest")return{ok:!0,data:{image:Ce(e,"content"),doc:w(e)}};if(t.command==="sync"){let o=typeof n.image=="string"?n.image:"";return o?(e.updateMetadata({content:o,psStatus:"inPS",psDoc:typeof n.doc=="string"&&n.doc?n.doc:w(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{synced:!0}}):{ok:!1,error:"\u7F3A\u5C11\u56FE\u7247\u6570\u636E"}}if(t.command==="generate"){let o=typeof n.prompt=="string"?n.prompt.trim():"";if(!o)return{ok:!1,error:"\u63D0\u793A\u8BCD\u4E3A\u7A7A"};let s=typeof n.reference=="string"&&n.reference?[n.reference]:[],a=typeof n.model=="string"&&n.model?n.model:void 0,c=(await e.ai.generateImage(o,{model:a,references:s})).images[0];return c?(e.updateMetadata({content:c,psStatus:"done",psDoc:typeof n.doc=="string"&&n.doc?n.doc:w(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{image:c}}):{ok:!1,error:"AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247"}}return{ok:!1,error:`\u672A\u77E5\u8BF7\u6C42\uFF1A${t.command}`}}catch(o){return{ok:!1,error:`\u751F\u6210\u5931\u8D25\uFF1A${Re(o)}`}}}function re(e){let t=!1,n=new AbortController;return(async()=>{for(;!t;)try{let s=e();if(!s){await M(1e3);continue}let a=await m(s),p={baseUrl:a.baseUrl,token:a.token},c=null;try{c=await V(p,n.signal)}catch{if(t)return;await M(2e3);continue}if(!c)continue;let u=await Ee(e()??s,c);await q(p,c.id,u)}catch{if(t)return;await M(2e3)}})(),()=>{t=!0,n.abort()}}var Ne=Symbol.for("infinite-canvas.jsx.fragment");function _e(e,t,n){let o=g(),s=e===Ne?o.Fragment:e,a=n===void 0?t:{...t??{},key:n};return o.createElement(s,a)}function r(e,t,n){return _e(e,t,n)}var d=r;var Te={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"},Ie={pushing:"\u63A8\u9001\u5230 PS",pulling:"\u4ECE PS \u53D6\u56DE"},R=new Set(["pushing","pulling"]),De=[1024,1536,2048,0];function pe(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function Ue(e){return e==="error"?"ps-dot ps-dot--error":R.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function Ae(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}var Me=12e4;function de(e){if(!R.has(C(e)))return!1;let t=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0;return!!t&&Date.now()-t>Me}function ce(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,o]=l(0);return y(()=>{if(!t)return;let s=window.setInterval(()=>o(a=>a+1),500);return()=>window.clearInterval(s)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function Le(e){let[t,n]=l(null),o=S(e);o.current=e,y(()=>{let a=!0;return m(o.current).then(p=>{a&&n(p)}),()=>{a=!1}},[e.node.id]);let s=P(async a=>{let p=await Z(o.current,a);return n(p),p},[]);return{settings:t,update:s}}function Je(){return d("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[r("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),r("circle",{cx:"9",cy:"9",r:"1.5"}),r("path",{d:"m21 15-5-5L5 20"})]})}function ze(){return d("svg",{className:"ps-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[r("path",{d:"M12 19V5"}),r("path",{d:"m5 12 7-7 7 7"})]})}function $e(){return d("svg",{className:"ps-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[r("path",{d:"M12 5v14"}),r("path",{d:"m19 12-7 7-7-7"})]})}function ue({ctx:e}){let t=Ae(e,"content"),n=de(e),o=n?"error":C(e),s=n?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":D(e),a=R.has(o),p=ce(e,a),c=S(e);return c.current=e,y(()=>re(()=>c.current),[]),d("div",{className:"ps-root ps-node",style:pe(e.theme),children:[t?r("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):d("div",{className:"ps-node__empty",children:[r(Je,{}),r("span",{children:"\u4ECE PS \u53D6\u56DE\u753B\u9762"})]}),d("div",{className:"ps-node__status",children:[r("span",{className:Ue(o)}),r("span",{children:Te[o]??o}),a&&p>0?d("span",{className:"ps-node__timer",children:[p,"s"]}):null]}),s?r("div",{className:"ps-node__error",title:s,children:s}):null]})}function le({ctx:e}){let{settings:t,update:n}=Le(e),[o,s]=l(""),[a,p]=l(""),[c,u]=l([]),[v,E]=l("idle"),[L,N]=l("\u8FDE\u63A5\u4E2D\u2026"),[fe,J]=l(!1),z=de(e),$=z?"error":C(e),_=z?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":D(e),O=R.has($),ge=ce(e,O),T=!t||fe;y(()=>{t&&(s(t.baseUrl),p(t.token))},[t]);let k=P(async i=>{E("loading");try{let f=await ae(i);u(f),E("ready"),N("PS \u5728\u7EBF")}catch(f){E("error"),N(`\u672A\u8FDE\u63A5\uFF1A${f instanceof Error?f.message:String(f)}`)}},[]);y(()=>{t&&k(t)},[t,k]);let F=async i=>{J(!0);try{await i(e,await m(e))}finally{J(!1);let f=await m(e);k(f)}},ye=async()=>{if(!t)return;let i=await se(await m(e));N(i?.ok?i.photoshop?.connected?"PS \u5728\u7EBF":"\u4E2D\u7EE7\u5728\u7EBF\uFF0CPS \u672A\u8FDE\u63A5":"\u4E2D\u7EE7\u672A\u8FDE\u63A5")},h=t?.doc??"",he=c.some(i=>i.name===h)||!h?null:r("option",{value:h,children:h});return d("div",{className:"ps-root ps-panel","data-canvas-no-zoom":!0,onMouseDown:i=>i.stopPropagation(),style:pe(e.theme),children:[d("div",{className:"ps-bar",children:[d("span",{className:"ps-status",children:[r("span",{className:v==="error"?"ps-dot ps-dot--error":"ps-dot ps-dot--ok"}),r("span",{className:"ps-status__text",title:L,children:L})]}),r("button",{type:"button",className:"ps-textbtn",disabled:!t||v==="loading",onClick:()=>t&&void k(t),children:v==="loading"?"\u5237\u65B0\u4E2D":"\u5237\u65B0\u6587\u6863"})]}),d("div",{className:"ps-controls",children:[d("select",{className:"ps-select",value:h,disabled:T,onChange:i=>void n({doc:i.target.value}),children:[r("option",{value:"",children:"\u8DDF\u968F\u5F53\u524D\u6587\u6863"}),he,c.map(i=>d("option",{value:i.name,children:[i.name," \xB7 ",i.width,"\xD7",i.height]},i.name))]}),r("div",{className:"ps-seg",role:"group","aria-label":"\u8F93\u51FA\u5C3A\u5BF8",children:De.map(i=>r("button",{type:"button","aria-pressed":t?.maxEdge===i,onClick:()=>void n({maxEdge:i}),children:i===0?"\u539F\u56FE":i},i))})]}),d("div",{className:"ps-actions",children:[d("button",{type:"button",className:"ps-action ps-action--strong",disabled:T,onClick:()=>void F(U),children:[r(ze,{}),"\u63A8\u9001"]}),d("button",{type:"button",className:"ps-action",disabled:T,onClick:()=>void F(A),children:[r($e,{}),"\u53D6\u56DE"]}),r("span",{className:"ps-spacer"}),O?d("span",{className:"ps-hint ps-hint--nowrap",children:[Ie[$]??"\u8FD0\u884C\u4E2D"," \xB7 ",ge,"s"]}):_?r("span",{className:"ps-error ps-hint--nowrap",title:_,children:_}):null]}),r("div",{className:"ps-hint ps-hint--tip",children:"\u6709\u9009\u533A\u65F6\uFF1A\u53D6\u56DE=\u53EA\u53D6\u9009\u533A\uFF0C\u63A8\u9001=\u8D34\u56DE\u9009\u533A\uFF1B\u6CA1\u9009\u533A\u65F6\u53D6\u6574\u5E45\u56FE\u3002\u751F\u6210 / \u6539\u56FE\u7528\u56FE\u7247\u8282\u70B9"}),d("details",{className:"ps-details",children:[r("summary",{children:"\u4E2D\u7EE7\u8BBE\u7F6E"}),d("div",{className:"ps-details__body",children:[r("input",{className:"ps-input",value:o,placeholder:"http://localhost:23310",onChange:i=>s(i.target.value),onBlur:()=>o!==t?.baseUrl&&void n({baseUrl:o})}),r("input",{className:"ps-input",value:a,placeholder:"token\uFF08\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u53EF\u7559\u7A7A\uFF09",onChange:i=>p(i.target.value),onBlur:()=>a!==t?.token&&void n({token:a})}),d("div",{className:"ps-row",children:[r("span",{className:"ps-spacer"}),r("button",{type:"button",className:"ps-textbtn",disabled:!t,onClick:()=>void ye(),children:"\u6D4B\u8BD5\u8FDE\u63A5"})]})]})]})]})}function ie(e,t,n,o,s){return{id:t,title:n,label:n,icon:o,onClick:()=>{m(e).then(a=>s(e,a))}}}function me(e){return[ie(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",U),ie(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",A)]}var ft={id:"ps",name:"PS \u8282\u70B9",version:"0.1.11",description:"\u753B\u5E03 \u2194 Photoshop \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE\uFF0C\u751F\u6210\u6539\u56FE\u4EA4\u7ED9\u56FE\u7247\u8282\u70B9",css:j,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03 \u2194 PS \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE\uFF1B\u751F\u6210\u6539\u56FE\u7528\u56FE\u7247\u8282\u70B9",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",autoOpenPanel:!0,resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},onDoubleClick:e=>(e.openPanel(),!0),toolbar:me,Content:ue,Panel:le}]};export{ft as default};
