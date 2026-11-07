function F(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function g(){return F().React}var l=((...e)=>g().useState(...e)),y=((...e)=>g().useEffect(...e));var P=((...e)=>g().useCallback(...e)),T=((...e)=>g().useRef(...e));var j=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */

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
`;var we="http://localhost:23310";function G(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function H(e){return(e??"").trim().replace(/\/+$/,"")||we}async function W(e){let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function X(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function x(e,t,n,o=12e4){let a=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:r}=await X(a,"\u6295\u9012\u547D\u4EE4"),u=Date.now()+o;for(;Date.now()<u;){let d=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(r)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(d.status===204)continue;let m=await X(d,"\u7B49\u5F85 PS");if(!m.ok)throw new Error(m.error||"PS \u8FD4\u56DE\u5931\u8D25");return m.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}async function V(e,t,n=25e3){let o=await fetch(`${e.baseUrl}/api/ps/next?timeout=${n}`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:t});if(o.status===204)return null;if(!o.ok)throw new Error(`\u4E2D\u7EE7\u8FD4\u56DE ${o.status}`);return await o.json()}async function q(e,t,n){let o=await fetch(`${e.baseUrl}/api/ps/result`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({id:t,...n})});if(!o.ok)throw new Error(`\u56DE\u586B\u8BF7\u6C42\u7ED3\u679C\u5931\u8D25\uFF08${o.status}\uFF09`)}var Q="settings.v1",ve=2048;async function c(e){let t=await e.storage.get(Q)??{},n=G();return{baseUrl:H(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:ve,doc:t.doc||""}}async function Z(e,t){let n={...await c(e),...t};return await e.storage.set(Q,n),n}function b(e){return{baseUrl:e.baseUrl,token:e.token}}function w(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function C(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function D(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ee(e){return e instanceof Error?e.message:String(e)}function I(e){let t=ee(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function K(e,t,n,o){return x(b(e),"push",{image:t,mode:"layer",doc:n,layerName:o})}async function ke(e,t){return x(b(e),"push",{image:t,mode:"newDoc",layerName:oe()})}async function Y(e,t){return x(b(e),"pull",{doc:t,maxEdge:e.maxEdge})}function te(e,t){e.updateMetadata({psStatus:"error",psError:ee(t)})}function ne(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function oe(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function se(e){try{return await W(b(e))}catch{return null}}async function ae(e){return(await x(b(e),"docs",{})).docs}function Pe(e){let t=n=>{let o=n.metadata?.content;return typeof o=="string"?o:""};for(let n of e.getUpstream()){let o=t(n);if(o)return o}for(let n of e.getDownstream()){let o=t(n);if(o)return o}return t(e.node)}async function U(e,t){let n=Pe(e);if(!n){e.updateMetadata({psStatus:"error",psError:"\u6CA1\u6709\u53EF\u63A8\u9001\u7684\u56FE\uFF1A\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9\uFF0C\u6216\u5148\u4ECE PS \u53D6\u56DE"});return}ne(e,"pushing");let o=oe();try{let a=t.doc||w(e),r;try{r=await K(t,n,a||void 0,o)}catch(u){if(!I(u))throw u;try{r=await K(t,n,void 0,o)}catch(d){if(!I(d))throw d;r=await ke(t,n)}}e.updateMetadata({content:n,psStatus:"inPS",psDoc:r.doc,psLayer:r.layer??"",psError:""})}catch(a){te(e,a)}}async function M(e,t){ne(e,"pulling");try{let n;try{n=await Y(t,t.doc||void 0)}catch(o){if(!I(o))throw o;n=await Y(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:""})}catch(n){te(e,n)}}var A=e=>new Promise(t=>setTimeout(t,e));function Ce(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function Se(e){return e instanceof Error?e.message:String(e)}async function Re(e,t){let n=t.payload??{};try{if(t.command==="ping")return{ok:!0,data:{pong:!0}};if(t.command==="models")return{ok:!0,data:{models:e.ai.listModels("image"),defaultModel:e.ai.defaultModel("image")}};if(t.command==="latest")return{ok:!0,data:{image:Ce(e,"content"),doc:w(e)}};if(t.command==="sync"){let o=typeof n.image=="string"?n.image:"";return o?(e.updateMetadata({content:o,psStatus:"inPS",psDoc:typeof n.doc=="string"&&n.doc?n.doc:w(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{synced:!0}}):{ok:!1,error:"\u7F3A\u5C11\u56FE\u7247\u6570\u636E"}}if(t.command==="generate"){let o=typeof n.prompt=="string"?n.prompt.trim():"";if(!o)return{ok:!1,error:"\u63D0\u793A\u8BCD\u4E3A\u7A7A"};let a=typeof n.reference=="string"&&n.reference?[n.reference]:[],r=typeof n.model=="string"&&n.model?n.model:void 0,d=(await e.ai.generateImage(o,{model:r,references:a})).images[0];return d?(e.updateMetadata({content:d,psStatus:"done",psDoc:typeof n.doc=="string"&&n.doc?n.doc:w(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{image:d}}):{ok:!1,error:"AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247"}}return{ok:!1,error:`\u672A\u77E5\u8BF7\u6C42\uFF1A${t.command}`}}catch(o){return{ok:!1,error:`\u751F\u6210\u5931\u8D25\uFF1A${Se(o)}`}}}function re(e){let t=!1,n=new AbortController;return(async()=>{for(;!t;)try{let a=e();if(!a){await A(1e3);continue}let r=await c(a),u={baseUrl:r.baseUrl,token:r.token},d=null;try{d=await V(u,n.signal)}catch{if(t)return;await A(2e3);continue}if(!d)continue;let m=await Re(e()??a,d);await q(u,d.id,m)}catch{if(t)return;await A(2e3)}})(),()=>{t=!0,n.abort()}}var Ee=Symbol.for("infinite-canvas.jsx.fragment");function Ne(e,t,n){let o=g(),a=e===Ee?o.Fragment:e,r=n===void 0?t:{...t??{},key:n};return o.createElement(a,r)}function s(e,t,n){return Ne(e,t,n)}var p=s;var _e={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"},Te={pushing:"\u63A8\u9001\u5230 PS",pulling:"\u4ECE PS \u53D6\u56DE"},S=new Set(["pushing","pulling"]),Ie=[1024,1536,2048,0];function pe(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function De(e){return e==="error"?"ps-dot ps-dot--error":S.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function Ue(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}var Me=12e4;function de(e){if(!S.has(C(e)))return!1;let t=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0;return!!t&&Date.now()-t>Me}function ue(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,o]=l(0);return y(()=>{if(!t)return;let a=window.setInterval(()=>o(r=>r+1),500);return()=>window.clearInterval(a)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function Ae(e){let[t,n]=l(null);y(()=>{let a=!0;return c(e).then(r=>{a&&n(r)}),()=>{a=!1}},[e]);let o=P(async a=>{let r=await Z(e,a);return n(r),r},[e]);return{settings:t,update:o}}function Le(){return p("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[s("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),s("circle",{cx:"9",cy:"9",r:"1.5"}),s("path",{d:"m21 15-5-5L5 20"})]})}function Je(){return p("svg",{className:"ps-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[s("path",{d:"M12 19V5"}),s("path",{d:"m5 12 7-7 7 7"})]})}function ze(){return p("svg",{className:"ps-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[s("path",{d:"M12 5v14"}),s("path",{d:"m19 12-7 7-7-7"})]})}function le({ctx:e}){let t=Ue(e,"content"),n=de(e),o=n?"error":C(e),a=n?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":D(e),r=S.has(o),u=ue(e,r),d=T(e);return d.current=e,y(()=>re(()=>d.current),[]),p("div",{className:"ps-root ps-node",style:pe(e.theme),children:[t?s("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):p("div",{className:"ps-node__empty",children:[s(Le,{}),s("span",{children:"\u4ECE PS \u53D6\u56DE\u753B\u9762"})]}),p("div",{className:"ps-node__status",children:[s("span",{className:De(o)}),s("span",{children:_e[o]??o}),r&&u>0?p("span",{className:"ps-node__timer",children:[u,"s"]}):null]}),a?s("div",{className:"ps-node__error",title:a,children:a}):null]})}function ce({ctx:e}){let{settings:t,update:n}=Ae(e),[o,a]=l(""),[r,u]=l(""),[d,m]=l([]),[v,R]=l("idle"),[L,E]=l("\u8FDE\u63A5\u4E2D\u2026"),[fe,J]=l(!1),z=de(e),$=z?"error":C(e),N=z?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":D(e),O=S.has($),ge=ue(e,O),_=!t||fe;y(()=>{t&&(a(t.baseUrl),u(t.token))},[t]);let k=P(async i=>{R("loading");try{let f=await ae(i);m(f),R("ready"),E("PS \u5728\u7EBF")}catch(f){R("error"),E(`\u672A\u8FDE\u63A5\uFF1A${f instanceof Error?f.message:String(f)}`)}},[]);y(()=>{t&&k(t)},[t,k]);let B=async i=>{J(!0);try{await i(e,await c(e))}finally{J(!1);let f=await c(e);k(f)}},ye=async()=>{if(!t)return;let i=await se(await c(e));E(i?.ok?i.photoshop?.connected?"PS \u5728\u7EBF":"\u4E2D\u7EE7\u5728\u7EBF\uFF0CPS \u672A\u8FDE\u63A5":"\u4E2D\u7EE7\u672A\u8FDE\u63A5")},h=t?.doc??"",he=d.some(i=>i.name===h)||!h?null:s("option",{value:h,children:h});return p("div",{className:"ps-root ps-panel","data-canvas-no-zoom":!0,onMouseDown:i=>i.stopPropagation(),style:pe(e.theme),children:[p("div",{className:"ps-bar",children:[p("span",{className:"ps-status",children:[s("span",{className:v==="error"?"ps-dot ps-dot--error":"ps-dot ps-dot--ok"}),s("span",{className:"ps-status__text",title:L,children:L})]}),s("button",{type:"button",className:"ps-textbtn",disabled:!t||v==="loading",onClick:()=>t&&void k(t),children:v==="loading"?"\u5237\u65B0\u4E2D":"\u5237\u65B0\u6587\u6863"})]}),p("div",{className:"ps-controls",children:[p("select",{className:"ps-select",value:h,disabled:_,onChange:i=>void n({doc:i.target.value}),children:[s("option",{value:"",children:"\u8DDF\u968F\u5F53\u524D\u6587\u6863"}),he,d.map(i=>p("option",{value:i.name,children:[i.name," \xB7 ",i.width,"\xD7",i.height]},i.name))]}),s("div",{className:"ps-seg",role:"group","aria-label":"\u8F93\u51FA\u5C3A\u5BF8",children:Ie.map(i=>s("button",{type:"button","aria-pressed":t?.maxEdge===i,onClick:()=>void n({maxEdge:i}),children:i===0?"\u539F\u56FE":i},i))})]}),p("div",{className:"ps-actions",children:[p("button",{type:"button",className:"ps-action ps-action--strong",disabled:_,onClick:()=>void B(U),children:[s(Je,{}),"\u63A8\u9001"]}),p("button",{type:"button",className:"ps-action",disabled:_,onClick:()=>void B(M),children:[s(ze,{}),"\u53D6\u56DE"]}),s("span",{className:"ps-spacer"}),O?p("span",{className:"ps-hint ps-hint--nowrap",children:[Te[$]??"\u8FD0\u884C\u4E2D"," \xB7 ",ge,"s"]}):N?s("span",{className:"ps-error ps-hint--nowrap",title:N,children:N}):null]}),s("div",{className:"ps-hint ps-hint--tip",children:"\u751F\u6210 / \u6539\u56FE\u7528\u56FE\u7247\u8282\u70B9\uFF1A\u56FE\u7247\u8282\u70B9 \u2192 \u672C\u8282\u70B9\uFF08\u63A8\u9001\u7ED3\u679C\uFF09\uFF1B\u672C\u8282\u70B9 \u2192 \u56FE\u7247\u8282\u70B9\uFF08PS \u753B\u9762\u5F53\u53C2\u8003\uFF09"}),p("details",{className:"ps-details",children:[s("summary",{children:"\u4E2D\u7EE7\u8BBE\u7F6E"}),p("div",{className:"ps-details__body",children:[s("input",{className:"ps-input",value:o,placeholder:"http://localhost:23310",onChange:i=>a(i.target.value),onBlur:()=>o!==t?.baseUrl&&void n({baseUrl:o})}),s("input",{className:"ps-input",value:r,placeholder:"token\uFF08\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u53EF\u7559\u7A7A\uFF09",onChange:i=>u(i.target.value),onBlur:()=>r!==t?.token&&void n({token:r})}),p("div",{className:"ps-row",children:[s("span",{className:"ps-spacer"}),s("button",{type:"button",className:"ps-textbtn",disabled:!t,onClick:()=>void ye(),children:"\u6D4B\u8BD5\u8FDE\u63A5"})]})]})]})]})}function ie(e,t,n,o,a){return{id:t,title:n,label:n,icon:o,onClick:()=>{c(e).then(r=>a(e,r))}}}function me(e){return[ie(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",U),ie(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",M)]}var mt={id:"ps",name:"PS \u8282\u70B9",version:"0.1.8",description:"\u753B\u5E03 \u2194 Photoshop \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE\uFF0C\u751F\u6210\u6539\u56FE\u4EA4\u7ED9\u56FE\u7247\u8282\u70B9",css:j,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03 \u2194 PS \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE\uFF1B\u751F\u6210\u6539\u56FE\u7528\u56FE\u7247\u8282\u70B9",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",autoOpenPanel:!0,resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},onDoubleClick:e=>(e.openPanel(),!0),toolbar:me,Content:le,Panel:ce}]};export{mt as default};
