function H(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function f(){return H().React}var u=((...e)=>f().useState(...e)),y=((...e)=>f().useEffect(...e));var k=((...e)=>f().useCallback(...e));var W=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */

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
`;var he="http://localhost:23310";function K(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function Y(e){return(e??"").trim().replace(/\/+$/,"")||he}async function Z(e){let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function V(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function h(e,t,n,s=12e4){let r=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:i}=await V(r,"\u6295\u9012\u547D\u4EE4"),d=Date.now()+s;for(;Date.now()<d;){let l=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(i)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(l.status===204)continue;let g=await V(l,"\u7B49\u5F85 PS");if(!g.ok)throw new Error(g.error||"PS \u8FD4\u56DE\u5931\u8D25");return g.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}var Q="settings.v1",xe=2048,ee="\u5728\u4FDD\u6301\u6784\u56FE\u3001\u4E3B\u4F53\u548C\u6587\u5B57\u4E0D\u53D8\u7684\u524D\u63D0\u4E0B\u63D0\u5347\u753B\u9762\u8D28\u611F\uFF1A\u76AE\u80A4\u7EC6\u817B\u3001\u5149\u5F71\u67D4\u548C\u3001\u7EC6\u8282\u6E05\u6670\uFF0C\u8F93\u51FA\u9AD8\u8D28\u91CF\u7CBE\u4FEE\u56FE\u3002";async function m(e){let t=await e.storage.get(Q)??{},n=K();return{baseUrl:Y(t.baseUrl||n.baseUrl),token:t.token||n.token||"",maxEdge:typeof t.maxEdge=="number"?t.maxEdge:xe,doc:t.doc||"",prompt:typeof t.prompt=="string"&&t.prompt.trim()?t.prompt:ee}}async function te(e,t){let n={...await m(e),...t};return await e.storage.set(Q,n),n}function x(e){return{baseUrl:e.baseUrl,token:e.token}}function ve(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function I(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function T(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ne(e){return e instanceof Error?e.message:String(e)}function P(e){let t=ne(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function q(e,t,n,s){return h(x(e),"push",{image:t,mode:"layer",doc:n,layerName:s})}async function be(e,t){return h(x(e),"push",{image:t,mode:"newDoc",layerName:z()})}async function C(e,t){return h(x(e),"pull",{doc:t,maxEdge:e.maxEdge})}function A(e,t){e.updateMetadata({psStatus:"error",psError:ne(t)})}function D(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function z(){return`AI \u4F18\u5316 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function oe(e){try{return await Z(x(e))}catch{return null}}async function ae(e){return(await h(x(e),"docs",{})).docs}async function U(e,t){let n=typeof e.node.metadata?.content=="string"?e.node.metadata.content:"";if(!n){e.updateMetadata({psStatus:"error",psError:"\u8282\u70B9\u91CC\u6CA1\u6709\u56FE\uFF1A\u5148\u4ECE PS \u53D6\u56DE\uFF0C\u6216\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9"});return}D(e,"pushing");let s=z();try{let r=t.doc||ve(e),i;try{i=await q(t,n,r||void 0,s)}catch(d){if(!P(d))throw d;try{i=await q(t,n,void 0,s)}catch(l){if(!P(l))throw l;i=await be(t,n)}}e.updateMetadata({psStatus:"inPS",psDoc:i.doc,psLayer:i.layer??"",psError:""})}catch(r){A(e,r)}}async function M(e,t){D(e,"pulling");try{let n;try{n=await C(t,t.doc||void 0)}catch(s){if(!P(s))throw s;n=await C(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:""})}catch(n){A(e,n)}}async function L(e,t){D(e,"optimizing");try{let n=await(async()=>{try{return await C(t,t.doc||void 0)}catch(d){if(!P(d))throw d;return await C(t,void 0)}})(),r=(await e.ai.generateImage(t.prompt.trim()||ee,{references:[n.image]})).images[0];if(!r)throw new Error("AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247");let i=await h(x(t),"push",{image:r,mode:"layer",doc:n.doc,layerName:z()});e.updateMetadata({content:r,psStatus:"done",psDoc:i.doc,psLayer:i.layer??"",psError:""})}catch(n){A(e,n)}}var we=Symbol.for("infinite-canvas.jsx.fragment");function ke(e,t,n){let s=f(),r=e===we?s.Fragment:e,i=n===void 0?t:{...t??{},key:n};return s.createElement(r,i)}function a(e,t,n){return ke(e,t,n)}var p=a;var Pe={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",optimizing:"AI \u4F18\u5316\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"},Ce={pushing:"\u63A8\u9001\u5230 PS",pulling:"\u4ECE PS \u53D6\u56DE",optimizing:"AI \u4F18\u5316"},F=new Set(["pushing","pulling","optimizing"]),Se=[1024,1536,2048,0];function se(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function Re(e){return e==="error"?"ps-dot ps-dot--error":F.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function O(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function re(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,s]=u(0);return y(()=>{if(!t)return;let r=window.setInterval(()=>s(i=>i+1),500);return()=>window.clearInterval(r)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function Ee(e){let[t,n]=u(null);y(()=>{let r=!0;return m(e).then(i=>{r&&n(i)}),()=>{r=!1}},[e]);let s=k(async r=>{let i=await te(e,r);return n(i),i},[e]);return{settings:t,update:s}}function Ne(){return p("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[a("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),a("circle",{cx:"9",cy:"9",r:"1.5"}),a("path",{d:"m21 15-5-5L5 20"})]})}function ie({ctx:e}){let t=O(e,"content"),n=I(e),s=T(e),r=[O(e,"psDoc"),O(e,"psLayer")].filter(Boolean).join(" \xB7 "),i=F.has(n),d=re(e,i);return p("div",{className:"ps-root ps-node","data-canvas-no-zoom":!0,onMouseDown:l=>l.stopPropagation(),onWheel:l=>l.stopPropagation(),style:se(e.theme),children:[t?a("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):p("div",{className:"ps-node__empty",children:[a(Ne,{}),a("span",{children:"\u4ECE PS \u53D6\u56DE\uFF0C\u6216\u63A5\u4E00\u4E2A\u4E0A\u6E38\u56FE\u7247"})]}),p("div",{className:"ps-node__head",children:[a("span",{className:Re(n)}),a("span",{children:Pe[n]??n}),i&&d>0?p("span",{className:"ps-node__timer",children:[d,"s"]}):null]}),s||r?p("div",{className:"ps-node__foot",children:[s?a("span",{className:"ps-node__error",title:s,children:s}):null,r?a("span",{className:"ps-node__meta",title:r,children:r}):null]}):null]})}function pe({ctx:e}){let{settings:t,update:n}=Ee(e),[s,r]=u(""),[i,d]=u(""),[l,g]=u(""),[J,le]=u([]),[S,R]=u("idle"),[B,E]=u("\u68C0\u6D4B\u4E2D\u2026"),[ue,X]=u(!1),$=I(e),N=T(e),G=F.has($),ce=re(e,G),b=!t||ue;y(()=>{t&&(r(t.baseUrl),d(t.token),g(t.prompt))},[t]);let w=k(async o=>{R("loading");try{let c=await ae(o);le(c),R("ready"),E("\u5DF2\u8FDE\u63A5 \xB7 PS \u5728\u7EBF")}catch(c){R("error"),E(`\u672A\u8FDE\u63A5\uFF1A${c instanceof Error?c.message:String(c)}`)}},[]);y(()=>{t&&w(t)},[t,w]);let _=async o=>{X(!0);try{await o(e,await m(e))}finally{X(!1);let c=await m(e);w(c)}},me=async()=>{if(!t)return;let o=await oe(await m(e));E(o?.ok?o.photoshop?.connected?"\u5DF2\u8FDE\u63A5 \xB7 PS \u5728\u7EBF":"\u5DF2\u8FDE\u63A5 \xB7 PS \u672A\u8FDE\u63A5":"\u672A\u8FDE\u63A5")},v=t?.doc??"",ge=J.some(o=>o.name===v)||!v?null:a("option",{value:v,children:v});return p("div",{className:"ps-root ps-panel","data-canvas-no-zoom":!0,onMouseDown:o=>o.stopPropagation(),style:se(e.theme),children:[p("div",{className:"ps-row ps-row--between",children:[p("span",{className:"ps-status",children:[a("span",{className:S==="error"?"ps-dot ps-dot--error":"ps-dot ps-dot--ok"}),a("span",{className:"ps-hint",title:B,children:B})]}),a("button",{type:"button",className:"ps-textbtn",disabled:!t||S==="loading",onClick:()=>t&&void w(t),children:S==="loading"?"\u5237\u65B0\u4E2D\u2026":"\u5237\u65B0\u6587\u6863"})]}),p("div",{className:"ps-row",children:[p("select",{className:"ps-select",value:v,disabled:b,onChange:o=>void n({doc:o.target.value}),children:[a("option",{value:"",children:"\u8DDF\u968F\u5F53\u524D\u6587\u6863"}),ge,J.map(o=>p("option",{value:o.name,children:[o.name," \xB7 ",o.width,"\xD7",o.height]},o.name))]}),a("div",{className:"ps-seg",role:"group","aria-label":"\u8F93\u51FA\u5C3A\u5BF8",children:Se.map(o=>a("button",{type:"button","aria-pressed":t?.maxEdge===o,onClick:()=>void n({maxEdge:o}),children:o===0?"\u539F\u56FE":o},o))})]}),p("details",{className:"ps-details",children:[a("summary",{children:"AI \u63D0\u793A\u8BCD"}),a("div",{className:"ps-details__body",children:a("textarea",{className:"ps-textarea",value:l,placeholder:"AI \u4F18\u5316\u7528\u7684\u63D0\u793A\u8BCD",onChange:o=>g(o.target.value),onBlur:()=>l!==t?.prompt&&void n({prompt:l}),onWheel:o=>o.stopPropagation()})})]}),p("div",{className:"ps-actions",children:[a("button",{type:"button",className:"ps-primary",disabled:b,onClick:()=>void _(U),children:"\u63A8\u9001"}),a("button",{type:"button",className:"ps-ghost",disabled:b,onClick:()=>void _(M),children:"\u53D6\u56DE"}),a("button",{type:"button",className:"ps-ghost",disabled:b,onClick:()=>void _(L),children:"AI \u4F18\u5316"})]}),G?p("div",{className:"ps-hint",children:[Ce[$]??"\u8FD0\u884C\u4E2D"," \xB7 ",ce,"s"]}):N?a("div",{className:"ps-error",title:N,children:N}):null,p("details",{className:"ps-details",children:[a("summary",{children:"\u4E2D\u7EE7\u8BBE\u7F6E"}),p("div",{className:"ps-details__body",children:[a("input",{className:"ps-input",value:s,placeholder:"http://localhost:23310",onChange:o=>r(o.target.value),onBlur:()=>s!==t?.baseUrl&&void n({baseUrl:s})}),a("input",{className:"ps-input",value:i,placeholder:"token\uFF08\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u53EF\u7559\u7A7A\uFF09",onChange:o=>d(o.target.value),onBlur:()=>i!==t?.token&&void n({token:i})}),p("div",{className:"ps-row",children:[a("span",{className:"ps-spacer"}),a("button",{type:"button",className:"ps-textbtn",disabled:!t,onClick:()=>void me(),children:"\u6D4B\u8BD5\u8FDE\u63A5"})]})]})]})]})}function j(e,t,n,s,r){return{id:t,title:n,label:n,icon:s,onClick:()=>{m(e).then(i=>r(e,i))}}}function de(e){return[j(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",U),j(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",M),j(e,"ps-optimize","AI \u4F18\u5316","\u2728",L)]}var et={id:"ps",name:"PS \u8282\u70B9",version:"0.1.2",description:"\u628A\u753B\u5E03\u7684\u56FE\u63A8\u8FDB Photoshop\uFF0C\u6539\u5B8C\u518D\u53D6\u56DE\u6216 AI \u4F18\u5316",css:W,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03\u53D1\u8D77\u3001PS \u843D\u5730\uFF1A\u63A8\u9001 / \u53D6\u56DE / AI \u4F18\u5316",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",autoOpenPanel:!0,resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},onDoubleClick:e=>(e.openPanel(),!0),toolbar:de,Content:ie,Panel:pe}]};export{et as default};
