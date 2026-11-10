function V(){let e=globalThis.InfiniteCanvasRuntime;if(!e)throw new Error("[plugin-sdk] Infinite Canvas \u8FD0\u884C\u65F6\u672A\u5C31\u7EEA:\u8BF7\u5728\u753B\u5E03\u5BBF\u4E3B\u4E2D\u52A0\u8F7D\u672C\u63D2\u4EF6");return e}function b(){return V().React}var U=((...e)=>b().useState(...e)),E=((...e)=>b().useEffect(...e));var T=((...e)=>b().useRef(...e));var q=`/* PS \u8282\u70B9 UI\uFF1A\u989C\u8272\u5168\u90E8\u6765\u81EA\u753B\u5E03\u4E3B\u9898\u53D8\u91CF\uFF08\u7531 JS \u6309 ctx.theme \u6CE8\u5165\uFF09\uFF0C\u4E0D\u786C\u7F16\u7801\u9ED1\u767D\u3002 */\r
\r
.ps-root {\r
    color: var(--ps-text);\r
    font-size: 12px;\r
    line-height: 1.5;\r
    font-family: inherit;\r
    -webkit-font-smoothing: antialiased;\r
}\r
\r
/* ---------------- \u8282\u70B9\u5361\u7247 ---------------- */\r
\r
.ps-node {\r
    position: relative;\r
    height: 100%;\r
    width: 100%;\r
    box-sizing: border-box;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    overflow: hidden;\r
    border-radius: 22px;\r
}\r
\r
.ps-node__image {\r
    max-width: 100%;\r
    max-height: 100%;\r
    object-fit: contain;\r
    display: block;\r
}\r
\r
.ps-node__empty {\r
    display: flex;\r
    flex-direction: column;\r
    align-items: center;\r
    gap: 6px;\r
    color: var(--ps-placeholder);\r
    font-size: 11px;\r
    text-align: center;\r
}\r
\r
.ps-node__status {\r
    position: absolute;\r
    left: 12px;\r
    bottom: 8px;\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 6px;\r
    color: var(--ps-muted);\r
    font-size: 11px;\r
    pointer-events: none;\r
}\r
\r
.ps-node__timer {\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
.ps-node__error {\r
    position: absolute;\r
    left: 12px;\r
    right: 12px;\r
    bottom: 26px;\r
    color: #ef4444;\r
    font-size: 11px;\r
    white-space: nowrap;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    pointer-events: none;\r
}\r
\r
/* ---------------- \u72B6\u6001\u70B9 ---------------- */\r
\r
.ps-dot {\r
    width: 6px;\r
    height: 6px;\r
    border-radius: 50%;\r
    background: var(--ps-muted);\r
    flex: none;\r
}\r
\r
.ps-dot--ok {\r
    background: #22c55e;\r
}\r
\r
.ps-dot--busy {\r
    background: #f59e0b;\r
}\r
\r
.ps-dot--error {\r
    background: #ef4444;\r
}\r
\r
/* ---------------- \u9762\u677F ---------------- */\r
\r
.ps-panel {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 10px;\r
    width: 100%;\r
    box-sizing: border-box;\r
    padding: 0 4px;\r
}\r
\r
.ps-bar {\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
    gap: 12px;\r
    min-height: 24px;\r
}\r
\r
.ps-status {\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 6px;\r
    color: var(--ps-muted);\r
    min-width: 0;\r
}\r
\r
.ps-status__text {\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
    font-size: 11px;\r
}\r
\r
.ps-textbtn {\r
    appearance: none;\r
    border: 0;\r
    background: transparent;\r
    color: var(--ps-muted);\r
    font: inherit;\r
    font-size: 11px;\r
    padding: 4px 8px;\r
    border-radius: 6px;\r
    cursor: pointer;\r
    white-space: nowrap;\r
}\r
\r
.ps-textbtn:hover:not(:disabled) {\r
    background: var(--ps-hover);\r
    color: var(--ps-text);\r
}\r
\r
.ps-textbtn:disabled {\r
    opacity: 0.4;\r
    cursor: not-allowed;\r
}\r
\r
.ps-controls {\r
    display: flex;\r
    align-items: center;\r
    gap: 12px;\r
    min-width: 0;\r
}\r
\r
.ps-select {\r
    height: 32px;\r
    flex: 1;\r
    min-width: 0;\r
    box-sizing: border-box;\r
    padding: 0 10px;\r
    border: 1px solid var(--ps-stroke);\r
    border-radius: 8px;\r
    background: transparent;\r
    color: var(--ps-text);\r
    font: inherit;\r
    font-size: 12px;\r
}\r
\r
.ps-select:focus {\r
    outline: none;\r
    border-color: var(--ps-muted);\r
}\r
\r
.ps-select option {\r
    background: var(--ps-panel);\r
    color: var(--ps-text);\r
}\r
\r
.ps-seg {\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 2px;\r
    flex: none;\r
}\r
\r
.ps-seg button {\r
    appearance: none;\r
    border: 0;\r
    background: transparent;\r
    color: var(--ps-muted);\r
    font: inherit;\r
    font-size: 11px;\r
    padding: 4px 8px;\r
    border-radius: 6px;\r
    cursor: pointer;\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
.ps-seg button:hover {\r
    background: var(--ps-hover);\r
    color: var(--ps-text);\r
}\r
\r
.ps-seg button[aria-pressed="true"] {\r
    color: var(--ps-text);\r
    font-weight: 600;\r
}\r
\r
.ps-actions {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
    min-height: 30px;\r
}\r
\r
.ps-action {\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 6px;\r
    height: 30px;\r
    padding: 0 10px;\r
    border: 0;\r
    border-radius: 8px;\r
    background: transparent;\r
    color: var(--ps-muted);\r
    font: inherit;\r
    font-size: 12px;\r
    cursor: pointer;\r
    white-space: nowrap;\r
}\r
\r
.ps-action:hover:not(:disabled) {\r
    background: var(--ps-hover);\r
    color: var(--ps-text);\r
}\r
\r
.ps-action--strong {\r
    color: var(--ps-text);\r
    font-weight: 600;\r
}\r
\r
.ps-action:disabled {\r
    opacity: 0.4;\r
    cursor: not-allowed;\r
}\r
\r
.ps-icon {\r
    width: 14px;\r
    height: 14px;\r
    flex: none;\r
}\r
\r
.ps-spacer {\r
    flex: 1;\r
}\r
\r
.ps-hint {\r
    color: var(--ps-muted);\r
    font-size: 11px;\r
    line-height: 1.6;\r
    min-width: 0;\r
}\r
\r
.ps-hint--nowrap {\r
    max-width: 55%;\r
    white-space: nowrap;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
}\r
\r
.ps-hint--tip {\r
    white-space: normal;\r
}\r
\r
.ps-error {\r
    color: #ef4444;\r
    font-size: 11px;\r
}\r
\r
/* ---------------- \u8BBE\u7F6E\u6D6E\u5C42 ---------------- */\r
\r
.ps-modal {\r
    position: fixed;\r
    inset: 0;\r
    z-index: 2147483000;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    color: var(--ps-text);\r
    font-size: 12px;\r
    line-height: 1.5;\r
    font-family: inherit;\r
    -webkit-font-smoothing: antialiased;\r
}\r
\r
.ps-modal__backdrop {\r
    position: absolute;\r
    inset: 0;\r
    background: rgba(0, 0, 0, 0.28);\r
}\r
\r
.ps-modal__card {\r
    position: relative;\r
    width: 360px;\r
    max-width: calc(100vw - 32px);\r
    box-sizing: border-box;\r
    display: flex;\r
    flex-direction: column;\r
    gap: 12px;\r
    padding: 14px;\r
    border: 1px solid var(--ps-stroke);\r
    border-radius: 12px;\r
    background: var(--ps-panel);\r
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);\r
}\r
\r
.ps-modal__head {\r
    display: flex;\r
    align-items: center;\r
    gap: 8px;\r
}\r
\r
.ps-modal__close {\r
    appearance: none;\r
    border: 0;\r
    background: transparent;\r
    color: var(--ps-muted);\r
    font-size: 16px;\r
    line-height: 1;\r
    width: 24px;\r
    height: 24px;\r
    border-radius: 6px;\r
    cursor: pointer;\r
    flex: none;\r
}\r
\r
.ps-modal__close:hover {\r
    background: var(--ps-hover);\r
    color: var(--ps-text);\r
}\r
\r
.ps-modal__body {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 8px;\r
}\r
\r
.ps-modal__label {\r
    color: var(--ps-muted);\r
    font-size: 11px;\r
}\r
\r
.ps-modal__hint {\r
    color: var(--ps-muted);\r
    font-size: 11px;\r
    line-height: 1.6;\r
}\r
\r
.ps-modal__row {\r
    display: flex;\r
    align-items: center;\r
    gap: 8px;\r
}\r
\r
.ps-modal .ps-select {\r
    height: 32px;\r
    width: 100%;\r
    box-sizing: border-box;\r
    padding: 0 9px;\r
    border: 1px solid var(--ps-stroke);\r
    border-radius: 8px;\r
    background: transparent;\r
    color: var(--ps-text);\r
    font: inherit;\r
    font-size: 12px;\r
}\r
\r
.ps-modal .ps-select:focus {\r
    outline: none;\r
    border-color: var(--ps-muted);\r
}\r
\r
.ps-modal .ps-select option {\r
    background: var(--ps-panel);\r
    color: var(--ps-text);\r
}\r
\r
.ps-modal .ps-seg {\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 2px;\r
}\r
\r
.ps-modal .ps-seg button {\r
    appearance: none;\r
    border: 0;\r
    background: transparent;\r
    color: var(--ps-muted);\r
    font: inherit;\r
    font-size: 11px;\r
    padding: 4px 9px;\r
    border-radius: 6px;\r
    cursor: pointer;\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
.ps-modal .ps-seg button:hover {\r
    background: var(--ps-hover);\r
    color: var(--ps-text);\r
}\r
\r
.ps-modal .ps-seg button[aria-pressed="true"] {\r
    color: var(--ps-text);\r
    font-weight: 600;\r
}\r
\r
.ps-modal .ps-textbtn {\r
    appearance: none;\r
    border: 0;\r
    background: transparent;\r
    color: var(--ps-muted);\r
    font: inherit;\r
    font-size: 11px;\r
    padding: 4px 8px;\r
    border-radius: 6px;\r
    cursor: pointer;\r
    white-space: nowrap;\r
}\r
\r
.ps-modal .ps-textbtn:hover {\r
    background: var(--ps-hover);\r
    color: var(--ps-text);\r
}\r
\r
.ps-modal__relay-text {\r
    min-width: 0;\r
    overflow: hidden;\r
    text-overflow: ellipsis;\r
    white-space: nowrap;\r
    color: var(--ps-muted);\r
    font-size: 11px;\r
    font-variant-numeric: tabular-nums;\r
}\r
\r
`;var Ne="http://localhost:23310";function Te(){let e=(typeof window>"u"?void 0:window.__RUNTIME_CONFIG__)?.psRelay;return{baseUrl:e?.url,token:e?.token}}function Ae(e){return(e??"").trim().replace(/\/+$/,"")||Ne}var Q="PS \u4E2D\u7EE7\u672A\u5C31\u7EEA\uFF1A\u786E\u8BA4\u753B\u5E03\u662F\u4ECE\u5BBF\u4E3B\u6253\u5F00\u7684\u3001canvas-agent \u5728\u8FD0\u884C\uFF0C\u7136\u540E\u5237\u65B0\u9875\u9762";function l(){let e=Te();return{baseUrl:Ae(e.baseUrl),token:e.token??""}}async function Z(e){if(!e.token)throw new Error(Q);let t=await fetch(`${e.baseUrl}/api/health`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:AbortSignal.timeout(3e3)});if(!t.ok)throw new Error(`\u4E2D\u7EE7\u672A\u54CD\u5E94\uFF08${t.status}\uFF09`);return await t.json()}async function Y(e,t){if(e.status===204)throw new Error(`${t}\u8D85\u65F6`);if(!e.ok)throw new Error(`${t}\u5931\u8D25\uFF08${e.status}\uFF09`);return await e.json()}async function h(e,t,n,o=12e4){if(!e.token)throw new Error(Q);let a=await fetch(`${e.baseUrl}/api/command`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({command:t,payload:n})}),{id:r}=await Y(a,"\u6295\u9012\u547D\u4EE4"),i=Date.now()+o;for(;Date.now()<i;){let d=await fetch(`${e.baseUrl}/api/result?id=${encodeURIComponent(r)}&timeout=25000`,{cache:"no-store",headers:{"x-relay-token":e.token}});if(d.status===204)continue;let u=await Y(d,"\u7B49\u5F85 PS");if(!u.ok)throw new Error(u.error||"PS \u8FD4\u56DE\u5931\u8D25");return u.data}throw new Error("\u7B49\u5F85 PS \u54CD\u5E94\u8D85\u65F6")}async function ee(e,t,n=25e3){let o=await fetch(`${e.baseUrl}/api/ps/next?timeout=${n}`,{cache:"no-store",headers:{"x-relay-token":e.token},signal:t});if(o.status===204)return null;if(!o.ok)throw new Error(`\u4E2D\u7EE7\u8FD4\u56DE ${o.status}`);return await o.json()}async function te(e,t,n){let o=await fetch(`${e.baseUrl}/api/ps/result`,{method:"POST",headers:{"content-type":"application/json","x-relay-token":e.token},body:JSON.stringify({id:t,...n})});if(!o.ok)throw new Error(`\u56DE\u586B\u8BF7\u6C42\u7ED3\u679C\u5931\u8D25\uFF08${o.status}\uFF09`)}var ae="settings.v1",Le=2048;async function y(e){let t=await e.storage.get(ae)??{};return{maxEdge:typeof t.maxEdge=="number"?t.maxEdge:Le,doc:t.doc||""}}async function re(e,t){let n={...await y(e),...t};return await e.storage.set(ae,n),n}function k(e){return typeof e.node.metadata?.psDoc=="string"?e.node.metadata.psDoc:""}function J(e){let t=e.node.metadata?.psStatus;return typeof t=="string"?t:"idle"}function se(e){return typeof e.node.metadata?.psError=="string"?e.node.metadata.psError:""}function ie(e){return e instanceof Error?e.message:String(e)}function $(e){let t=ie(e);return t.includes("\u6587\u6863\u4E0D\u5B58\u5728")||t.includes("\u6CA1\u6709\u6253\u5F00\u7684\u6587\u6863")}async function ne(e,t,n,o){return h(l(),"push",{image:e,mode:"layer",doc:t,layerName:n,selection:o})}async function Me(e){return h(l(),"push",{image:e,mode:"newDoc",layerName:ce()})}async function oe(e,t){return h(l(),"pull",{doc:t,maxEdge:e.maxEdge})}function pe(e,t){e.updateMetadata({psStatus:"error",psError:ie(t)})}function de(e,t){e.updateMetadata({psStatus:t,psError:"",psStartedAt:Date.now()})}function ce(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function le(){try{return await Z(l())}catch{return null}}async function ue(){return(await h(l(),"docs",{})).docs}async function A(e){if(!e)return"";if(e.startsWith("data:"))return e;let t=await fetch(e);if(!t.ok)throw new Error(`\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\uFF08${t.status}\uFF09`);let n=await t.blob();return await new Promise((o,a)=>{let r=new FileReader;r.onload=()=>o(typeof r.result=="string"?r.result:""),r.onerror=()=>a(new Error("\u8BFB\u53D6\u56FE\u7247\u5931\u8D25")),r.readAsDataURL(n)})}async function Ie(e){let t=o=>{let a=o.metadata?.content;return typeof a=="string"?a:""},n=[...e.getUpstream(),...e.getDownstream(),e.node];for(let o of n){let a=t(o);if(a)try{return await A(a)}catch{continue}}return""}async function me(e,t){let n=await Ie(e);if(!n){e.updateMetadata({psStatus:"error",psError:"\u6CA1\u6709\u53EF\u63A8\u9001\u7684\u56FE\uFF1A\u63A5\u4E00\u4E2A\u56FE\u7247\u8282\u70B9\uFF0C\u6216\u5148\u4ECE PS \u53D6\u56DE"});return}de(e,"pushing");let o=ce(),a=e.node.metadata?.psSelection||void 0;try{let r=t.doc||k(e),i;try{i=await ne(n,r||void 0,o,a)}catch(d){if(!$(d))throw d;try{i=await ne(n,void 0,o,a)}catch(u){if(!$(u))throw u;i=await Me(n)}}e.updateMetadata({content:n,psStatus:"inPS",psDoc:i.doc,psLayer:i.layer??"",psError:""})}catch(r){pe(e,r)}}async function fe(e,t){let n=e.node.metadata?.psSelection||void 0;await h(l(),"preview",{image:await A(t),doc:k(e),selection:n},8e3)}async function ge(e,t){de(e,"pulling");try{let n;try{n=await oe(t,t.doc||void 0)}catch(o){if(!$(o))throw o;n=await oe(t,void 0)}e.updateMetadata({content:n.image,psStatus:"done",psDoc:n.doc,psError:"",psSelection:n.selection??null})}catch(n){pe(e,n)}}var L=e=>new Promise(t=>setTimeout(t,e));function De(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function ze(e){return e instanceof Error?e.message:String(e)}async function Ue(e,t){let n=t.payload??{};try{if(t.command==="ping")return{ok:!0,data:{pong:!0}};if(t.command==="models")return{ok:!0,data:{models:e.ai.listModels("image"),defaultModel:e.ai.defaultModel("image")}};if(t.command==="latest")return{ok:!0,data:{image:De(e,"content"),doc:k(e)}};if(t.command==="sync"){let o=typeof n.image=="string"?n.image:"";return o?(e.updateMetadata({content:o,psStatus:"inPS",psDoc:typeof n.doc=="string"&&n.doc?n.doc:k(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{synced:!0}}):{ok:!1,error:"\u7F3A\u5C11\u56FE\u7247\u6570\u636E"}}if(t.command==="generate"){let o=typeof n.prompt=="string"?n.prompt.trim():"";if(!o)return{ok:!1,error:"\u63D0\u793A\u8BCD\u4E3A\u7A7A"};let a=typeof n.reference=="string"&&n.reference?[n.reference]:[],r=typeof n.model=="string"&&n.model?n.model:void 0,d=(await e.ai.generateImage(o,{model:r,references:a})).images[0];return d?(e.updateMetadata({content:d,psStatus:"done",psDoc:typeof n.doc=="string"&&n.doc?n.doc:k(e),psStartedAt:Date.now(),psError:""}),{ok:!0,data:{image:d}}):{ok:!1,error:"AI \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247"}}return{ok:!1,error:`\u672A\u77E5\u8BF7\u6C42\uFF1A${t.command}`}}catch(o){return{ok:!1,error:`\u751F\u6210\u5931\u8D25\uFF1A${ze(o)}`}}}function he(e){let t=!1,n=new AbortController;return(async()=>{for(;!t;)try{let a=e();if(!a){await L(1e3);continue}let r=l();if(!r.token){await L(2e3);continue}let i=null;try{i=await ee(r,n.signal)}catch{if(t)return;await L(2e3);continue}if(!i)continue;let d=await Ue(e()??a,i);await te(r,i.id,d)}catch{if(t)return;await L(2e3)}})(),()=>{t=!0,n.abort()}}var $e=[1024,1536,2048,0];function Je(e){let t={"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg};return Object.entries(t).map(([n,o])=>`${n}:${o}`).join(";")}function p(e,t,n){let o=document.createElement(e);return t&&(o.className=t),n!==void 0&&(o.textContent=n),o}var v=null;function Oe(){v&&(v.close(),v=null)}function xe(e){Oe();let t=p("div","ps-modal");t.setAttribute("style",Je(e.theme)+";");let n=p("div","ps-modal__backdrop"),o=p("div","ps-modal__card"),a=p("div","ps-modal__head"),r=p("span","ps-status"),i=p("span","ps-dot"),d=p("span","ps-status__text","\u8FDE\u63A5\u4E2D\u2026");r.append(i,d);let u=p("button","ps-textbtn","\u5237\u65B0\u6587\u6863");u.type="button";let x=p("button","ps-modal__close","\xD7");x.type="button",x.title="\u5173\u95ED",a.append(r,p("span","ps-spacer"),u,x);let S=p("div","ps-modal__body"),C=p("div","ps-modal__label","\u76EE\u6807\u6587\u6863"),f=p("select","ps-select"),M=document.createElement("option");M.value="",M.textContent="\u8DDF\u968F\u5F53\u524D\u6587\u6863",f.appendChild(M);let ke=p("div","ps-modal__label","\u8F93\u51FA\u5C3A\u5BF8"),I=p("div","ps-seg");I.setAttribute("role","group");let H=$e.map(s=>{let c=p("button","",s===0?"\u539F\u56FE":String(s));return c.type="button",c.dataset.value=String(s),I.appendChild(c),c}),Pe=p("div","ps-modal__hint","\u6709\u9009\u533A\u65F6\uFF1A\u53D6\u56DE=\u53EA\u53D6\u9009\u533A\uFF0C\u63A8\u9001=\u8D34\u56DE\u9009\u533A\uFF1B\u6CA1\u9009\u533A\u65F6\u53D6\u6574\u5E45\u56FE\u3002"),Se=p("div","ps-modal__label","\u4E2D\u7EE7"),B=p("div","ps-modal__row ps-modal__relay"),j=p("span","ps-modal__relay-text",""),D=p("button","ps-textbtn","\u6D4B\u8BD5\u8FDE\u63A5");D.type="button",B.append(j,p("span","ps-spacer"),D);let Ce=p("div","ps-modal__hint","\u5730\u5740\u548C token \u7531\u753B\u5E03\u5BBF\u4E3B\u6CE8\u5165\uFF0C\u4E0D\u7528\u624B\u586B\uFF1B\u663E\u793A\u300C\u672A\u6CE8\u5165\u300D\u8BF4\u660E canvas-agent \u6CA1\u5728\u8FD0\u884C\u3002");S.append(C,f,ke,I,Pe,Se,B,Ce),o.append(a,S),t.append(n,o),document.body.appendChild(t);let R=null,F=!1,_=()=>{F||(F=!0,document.removeEventListener("keydown",G,!0),t.remove(),v&&v.root===t&&(v=null))},G=s=>{s.key==="Escape"&&_()},X=s=>{R=s,H.forEach(w=>{let N=Number(w.dataset.value)===s.maxEdge;w.setAttribute("aria-pressed",N?"true":"false")});let c=l();j.textContent=c.token?c.baseUrl:"\u672A\u6CE8\u5165\uFF08canvas-agent \u672A\u8FD0\u884C\uFF09"},W=async s=>{let c=await re(e,s);X(c)},Ee=(s,c)=>{f.innerHTML="";let w=document.createElement("option");w.value="",w.textContent="\u8DDF\u968F\u5F53\u524D\u6587\u6863",f.appendChild(w);let N=!1;for(let g of s){let z=document.createElement("option");z.value=g.name,z.textContent=`${g.name} \xB7 ${g.width}\xD7${g.height}`,f.appendChild(z),g.name===c&&(N=!0)}if(c&&!N&&c!==""){let g=document.createElement("option");g.value=c,g.textContent=c,f.appendChild(g)}f.value=c||""},K=async()=>{if(R){i.className="ps-dot",d.textContent="\u5237\u65B0\u4E2D\u2026";try{let s=await ue();Ee(s,R.doc),i.className="ps-dot ps-dot--ok",d.textContent="PS \u5728\u7EBF"}catch(s){i.className="ps-dot ps-dot--error",d.textContent=`\u672A\u8FDE\u63A5\uFF1A${s instanceof Error?s.message:String(s)}`}}};f.addEventListener("change",()=>void W({doc:f.value})),H.forEach(s=>{s.addEventListener("click",()=>{R&&W({maxEdge:Number(s.dataset.value)})})}),D.addEventListener("click",async()=>{if(!l().token){i.className="ps-dot ps-dot--error",d.textContent="\u4E2D\u7EE7\u672A\u6CE8\u5165\uFF1A\u5148\u8BA9 canvas-agent \u8DD1\u8D77\u6765";return}let s=await le();i.className=s?.ok?"ps-dot ps-dot--ok":"ps-dot ps-dot--error",d.textContent=s?.ok?s.photoshop?.connected?"PS \u5728\u7EBF":"\u4E2D\u7EE7\u5728\u7EBF\uFF0CPS \u672A\u8FDE\u63A5":"\u4E2D\u7EE7\u672A\u8FDE\u63A5"}),u.addEventListener("click",()=>void K()),x.addEventListener("click",_),n.addEventListener("click",_),document.addEventListener("keydown",G,!0),v={root:t,close:_},(async()=>{let s=await y(e);X(s),await K()})()}var He=Symbol.for("infinite-canvas.jsx.fragment");function Be(e,t,n){let o=b(),a=e===He?o.Fragment:e,r=n===void 0?t:{...t??{},key:n};return o.createElement(a,r)}function m(e,t,n){return Be(e,t,n)}var P=m;var je={idle:"\u672A\u8FDE\u63A5",pushing:"\u63A8\u9001\u4E2D",inPS:"\u5DF2\u5728 PS",pulling:"\u53D6\u56DE\u4E2D",done:"\u5DF2\u5B8C\u6210",error:"\u51FA\u9519"};var O=new Set(["pushing","pulling"]),Fe=12e4;function Ge(e){return{"--ps-text":e.node.text,"--ps-muted":e.node.muted,"--ps-placeholder":e.node.placeholder,"--ps-panel":e.node.panel,"--ps-stroke":e.node.stroke,"--ps-hover":e.toolbar.itemHover,"--ps-active":e.toolbar.activeBg}}function Xe(e){return e==="error"?"ps-dot ps-dot--error":O.has(e)?"ps-dot ps-dot--busy":e==="inPS"||e==="done"?"ps-dot ps-dot--ok":"ps-dot"}function We(e,t){let n=e.node.metadata?.[t];return typeof n=="string"?n:""}function Ke(e){if(!O.has(J(e)))return!1;let t=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0;return!!t&&Date.now()-t>Fe}function Ve(e,t){let n=typeof e.node.metadata?.psStartedAt=="number"?e.node.metadata.psStartedAt:0,[,o]=U(0);return E(()=>{if(!t)return;let a=window.setInterval(()=>o(r=>r+1),500);return()=>window.clearInterval(a)},[t,n]),!t||!n?0:Math.max(0,Math.round((Date.now()-n)/1e3))}function qe(){return P("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[m("rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}),m("circle",{cx:"9",cy:"9",r:"1.5"}),m("path",{d:"m21 15-5-5L5 20"})]})}function ve({ctx:e}){let t=We(e,"content"),n=Ke(e),o=n?"error":J(e),a=n?"\u4E0A\u6B21\u64CD\u4F5C\u6CA1\u6709\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u63A8\u9001\u6216\u53D6\u56DE":se(e),r=O.has(o),i=Ve(e,r),d=T(e);d.current=e,E(()=>he(()=>d.current),[]);let u=T(Number(e.node.metadata?.generatedAt||0));return E(()=>{let x=Number(e.node.metadata?.generatedAt||0),S=typeof e.node.metadata?.content=="string"?e.node.metadata.content:"";!x||x===u.current||!S||(u.current=x,(async()=>{try{await fe(e,S),e.updateMetadata({psPreviewAt:Date.now(),psPreviewError:""})}catch(C){e.updateMetadata({psPreviewError:C instanceof Error?C.message:String(C)})}})())},[e.node.metadata?.generatedAt,e.node.metadata?.content]),P("div",{className:"ps-root ps-node",style:Ge(e.theme),children:[t?m("img",{className:"ps-node__image",src:t,alt:"",draggable:!1}):P("div",{className:"ps-node__empty",children:[m(qe,{}),m("span",{children:"\u4ECE PS \u53D6\u56DE\u753B\u9762"})]}),P("div",{className:"ps-node__status",children:[m("span",{className:Xe(o)}),m("span",{children:je[o]??o}),r&&i>0?P("span",{className:"ps-node__timer",children:[i,"s"]}):null]}),a?m("div",{className:"ps-node__error",title:a,children:a}):null]})}function ye(e,t,n,o,a){return{id:t,title:n,label:n,icon:o,onClick:()=>{y(e).then(r=>a(e,r))}}}function we(e){return[ye(e,"ps-push","\u63A8\u9001","\u2B06\uFE0F",me),ye(e,"ps-pull","\u53D6\u56DE","\u2B07\uFE0F",ge),{id:"ps-settings",title:"\u8BBE\u7F6E",label:"\u8BBE\u7F6E",icon:"\u2699\uFE0F",onClick:()=>xe(e)}]}function Ye(){return`\u753B\u5E03 ${new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}`}async function Qe(e){let t=typeof e.node.metadata?.content=="string"?e.node.metadata.content:"";if(!t)throw new Error("\u8FD9\u4E2A\u8282\u70B9\u8FD8\u6CA1\u6709\u56FE\u7247");let n=await A(t),o=await y(e),a=await h(l(),"push",{image:n,mode:"layer",doc:o.doc||void 0,layerName:Ye()});e.updateMetadata(e.node.id,{content:n,psDoc:a.doc,psLayer:a.layer??"",psStatus:"inPS"})}async function Ze(e){let t=await y(e),n=await h(l(),"pull",{doc:t.doc||void 0,maxEdge:t.maxEdge});e.updateMetadata(e.node.id,{content:n.image,status:"success",naturalWidth:n.width??e.node.metadata?.naturalWidth,naturalHeight:n.height??e.node.metadata?.naturalHeight})}function be(e){return e.type!=="image"?[]:[{id:"push-to-ps",label:"\u63A8\u9001\u5230 PS",icon:"\u2B06\uFE0F",run:Qe},{id:"pull-from-ps",label:"\u4ECE PS \u53D6\u56DE",icon:"\u2B07\uFE0F",run:Ze}]}var Ut={id:"ps",name:"PS \u8282\u70B9",version:"0.1.26",description:"\u753B\u5E03 \u2194 Photoshop \u901A\u9053\uFF1A\u4EFB\u610F\u56FE\u7247\u8282\u70B9\u53F3\u952E\u5373\u53EF\u63A8\u9001\u5230 PS / \u4ECE PS \u53D6\u56DE",css:q,nodeActions:be,nodes:[{type:"ps:layer",title:"Photoshop",icon:"\u{1F3A8}",description:"\u753B\u5E03 \u2194 PS \u901A\u9053\uFF1A\u63A8\u9001 / \u53D6\u56DE / \u8BBE\u7F6E\uFF1B\u8282\u70B9\u4E0A\u53EF\u76F4\u63A5\u7528\u753B\u5E03\u7684\u4FEE\u56FE\u5DE5\u5177",defaultSize:{width:340,height:380},defaultMetadata:{content:"",psStatus:"idle",psDoc:"",psLayer:"",psError:"",psStartedAt:0},minimapColor:"#31a8ff",editTarget:"self",resource:e=>{let t=typeof e.metadata?.content=="string"?e.metadata.content:"";return t?{kind:"image",url:t}:null},toolbar:we,Content:ve}]};export{Ut as default};
