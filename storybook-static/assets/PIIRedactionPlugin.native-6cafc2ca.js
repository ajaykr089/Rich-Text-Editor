const x=".rte-content, .editora-content",ae="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",we="__editoraCommandEditorRoot",Ee="rte-pii-redaction-styles",u="rte-pii-redaction-panel",k="pii-redaction",v="piiRedaction",$=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',pe=typeof NodeFilter<"u"?NodeFilter.SHOW_TEXT:4,Oe=["email","phone","ssn","credit-card","ipv4","api-key","jwt"],ze={panelTitle:"PII Redaction",panelAriaLabel:"PII redaction panel",scanText:"Scan PII",redactAllText:"Redact All",redactText:"Redact",locateText:"Locate",realtimeOnText:"Realtime On",realtimeOffText:"Realtime Off",closeText:"Close",noFindingsText:"No PII detected in the document.",summaryPrefix:"Findings",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+I/U/M/Y",readonlyRedactionText:"Editor is read-only. Reopen editable mode to redact.",matchLabel:"Detected",maskedLabel:"Masked",excerptLabel:"Context"},Fe={email:{label:"Email",severity:"medium",pattern:/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi},phone:{label:"Phone",severity:"medium",pattern:/\b(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b/g},ssn:{label:"SSN",severity:"high",pattern:/\b\d{3}-\d{2}-\d{4}\b/g},"credit-card":{label:"Credit Card",severity:"high",pattern:/\b(?:\d[ -]*?){13,19}\b/g,validator:e=>We(e)},ipv4:{label:"IPv4",severity:"low",pattern:/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g},"api-key":{label:"API Key",severity:"high",pattern:/\b(?:sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z\-_]{35}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g},jwt:{label:"JWT",severity:"high",pattern:/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g}},f=new WeakMap,I=new WeakMap,E=new WeakMap,S=new WeakMap,te=new WeakMap,de=new WeakMap,Q=new WeakMap,m=new Map,V=new WeakMap,W=new Set,j=new Set;let G=0,He=0,ve=0,M=null,g=null,L=null,D=null,_=null,R=null,N=null;function b(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Be(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function Y(e){const t=e.flags.includes("g")?e.flags:`${e.flags}g`;return new RegExp(e.source,t)}function be(e){return new RegExp(e.source,e.flags)}function X(e,t,n){return Math.max(t,Math.min(n,e))}function Ke(e,t){return e==="high"||e==="medium"||e==="low"?e:t}function qe(e){const t=(e||"*").slice(0,1)||"*";return/[A-Za-z0-9._%+\-\s]/.test(t)?"*":t}function $e(e){let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function We(e){const t=e.replace(/\D/g,"");if(t.length<13||t.length>19)return!1;let n=0,r=!1;for(let o=t.length-1;o>=0;o-=1){let i=Number(t[o]);r&&(i*=2,i>9&&(i-=9)),n+=i,r=!r}return n%10===0}function je(e,t){const n=Fe[e];if(typeof t=="boolean")return{type:e,label:n.label,severity:n.severity,enabled:t,pattern:Y(n.pattern),validator:n.validator};if(!t)return{type:e,label:n.label,severity:n.severity,enabled:!0,pattern:Y(n.pattern),validator:n.validator};const r=t.pattern instanceof RegExp?Y(t.pattern):Y(n.pattern);return{type:e,label:n.label,severity:Ke(t.severity,n.severity),enabled:t.enabled!==!1,pattern:r,validator:n.validator}}function ee(e={}){const t=Oe.map(r=>{var o;return je(r,(o=e.detectors)==null?void 0:o[r])}),n=t.map(r=>`${r.type}:${r.enabled?"1":"0"}:${r.severity}:${r.pattern.source}:${r.pattern.flags}`).join("|");return{enableRealtime:e.enableRealtime!==!1,debounceMs:X(Number(e.debounceMs??220),60,3e3),maxFindings:X(Number(e.maxFindings??140),1,500),maskChar:qe(e.maskChar),revealStart:X(Number(e.revealStart??2),0,12),revealEnd:X(Number(e.revealEnd??2),0,12),redactionMode:e.redactionMode==="mask"?"mask":"token",redactionToken:(e.redactionToken||"REDACTED").trim()||"REDACTED",skipInCodeBlocks:e.skipInCodeBlocks!==!1,labels:{...ze,...e.labels||{}},normalizeText:e.normalizeText||Be,detectors:t,detectorSignature:n}}function ce(e){const t={};return e.detectors.forEach(n=>{t[n.type]={enabled:n.enabled,severity:n.severity,pattern:n.pattern}}),{enableRealtime:e.enableRealtime,debounceMs:e.debounceMs,maxFindings:e.maxFindings,maskChar:e.maskChar,revealStart:e.revealStart,revealEnd:e.revealEnd,redactionMode:e.redactionMode,redactionToken:e.redactionToken,skipInCodeBlocks:e.skipInCodeBlocks,labels:{...e.labels},normalizeText:e.normalizeText,detectors:t}}function ge(e){return e.closest(ae)||e}function Ze(e){const t=e.closest("[data-editora-editor]");if(t&&z(t)===e)return t;let n=e;for(;n;){if(n.matches(ae)&&(n===e||z(n)===e))return n;n=n.parentElement}return ge(e)}function z(e){if(!e)return null;if(e.matches(x))return e;const t=e.querySelector(x);return t instanceof HTMLElement?t:null}function Ve(){if(typeof window>"u")return null;const e=window[we];if(!(e instanceof HTMLElement))return null;window[we]=null;const t=z(e);if(t)return t;const n=e.closest(ae);if(n){const o=z(n);if(o)return o}const r=e.closest(x);return r instanceof HTMLElement?r:null}function J(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function Ue(e){const t=ge(e);if(J(t))return!0;const n=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return J(n)?!0:J(document.documentElement)||J(document.body)}function ne(e,t){e.classList.remove("rte-pii-redaction-theme-dark"),Ue(t)&&e.classList.add("rte-pii-redaction-theme-dark")}function re(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function me(e){const t=te.get(e);typeof t=="number"&&(window.clearTimeout(t),j.delete(t),te.delete(e))}function U(e){return e.getAttribute("contenteditable")==="false"||e.getAttribute("data-readonly")==="true"}function le(e=0){return{total:0,high:0,medium:0,low:0,redactedCount:e,byType:{email:0,phone:0,ssn:0,"credit-card":0,ipv4:0,"api-key":0,jwt:0}}}function q(){Array.from(W).forEach(t=>{t.isConnected||Te(t)})}function Ge(e){var t,n,r,o;for(let i=0;i<e.length;i+=1){const a=e[i];if(!(a.type!=="childList"||a.removedNodes.length===0))for(let l=0;l<a.removedNodes.length;l+=1){const c=a.removedNodes[l];if(c.nodeType!==Node.ELEMENT_NODE)continue;const s=c;if((t=s.matches)!=null&&t.call(s,x)||(n=s.matches)!=null&&n.call(s,`.${u}`)||(r=s.querySelector)!=null&&r.call(s,x)||(o=s.querySelector)!=null&&o.call(s,`.${u}`))return!0}}return!1}function T(e,t=!0){if(q(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const i=e.editorElement,a=z(i);if(a)return a}const n=Ve();if(n)return n;const r=window.getSelection();if(r&&r.rangeCount>0){const i=re(r.getRangeAt(0).startContainer),a=i==null?void 0:i.closest(x);if(a)return a}const o=document.activeElement;if(o){if(o.matches(x))return o;const i=o.closest(x);if(i)return i}return g&&g.isConnected?g:(g&&!g.isConnected&&(g=null),t?document.querySelector(x):null)}function Te(e){var t;me(e),(t=m.get(e))==null||t.remove(),m.delete(e),V.delete(e),f.delete(e),I.delete(e),E.delete(e),S.delete(e),de.delete(e),Q.delete(e),W.delete(e),g===e&&(g=null)}function C(e,t,n){const r=Ze(e);Array.from(r.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(i=>{i.classList.toggle("active",n),i.setAttribute("data-active",n?"true":"false"),i.setAttribute("aria-pressed",n?"true":"false")})}function w(e,t){f.has(e)||f.set(e,t),I.has(e)||I.set(e,[]),E.has(e)||E.set(e,le(0)),S.has(e)||S.set(e,t.enableRealtime),W.add(e)}function ie(e){return V.get(e)===!0}function Ie(e,t,n,r){if(!e)return e;if(e.length<=n+r)return t.repeat(e.length);const o=e.slice(0,n),i=r>0?e.slice(e.length-r):"";return`${o}${t.repeat(Math.max(1,e.length-n-r))}${i}`}function se(e,t,n){const r=e.replace(/\D/g,"");if(r.length===0)return e;let o=0;const i=Math.max(0,r.length-n);return e.split("").map(a=>/\d/.test(a)?(o+=1,o<=i?t:a):a).join("")}function Ye(e,t){const n=e.indexOf("@");if(n<=0)return e;const r=e.slice(0,n),o=e.slice(n+1);return r.length<=2?`${r[0]||""}${t}[at]${o}`:`${r[0]}${t.repeat(Math.max(1,r.length-2))}${r[r.length-1]}[at]${o}`}function Xe(e,t){const n=e.split(".");return n.length!==4?e:`${n[0]}.${n[1]}.${n[2]}.${t.repeat(Math.max(1,n[3].length))}`}function Ce(e,t,n){return e&&(t==="email"?Ye(e,n.maskChar):t==="phone"||t==="ssn"||t==="credit-card"?se(e,n.maskChar,4):t==="ipv4"?Xe(e,n.maskChar):t==="api-key"||t==="jwt"?Ie(e,n.maskChar,0,0):Ie(e,n.maskChar,n.revealStart,n.revealEnd))}function Re(e,t,n){return n.redactionMode==="mask"?Ce(e,t,n):`[${n.redactionToken}:${t.toUpperCase()}]`}function Je(e){return ve+=1,`pii-${e}-${Date.now().toString(36)}-${ve.toString(36)}`}function he(e,t){var n;return t.skipInCodeBlocks?!!((n=e.parentElement)!=null&&n.closest("code, pre, kbd, samp")):!1}function Qe(e,t){return t.some(n=>e.start<n.end&&n.start<e.end)}function et(e,t,n){const r=[];t.filter(a=>a.enabled).forEach(a=>{const l=be(a.pattern);let c=l.exec(e);for(;c&&r.length<n*5;){const s=c[0]||"",d=c.index,p=d+s.length;s&&p>d&&(!a.validator||a.validator(s))&&r.push({type:a.type,severity:a.severity,value:s,start:d,end:p}),l.lastIndex===c.index&&(l.lastIndex+=1),c=l.exec(e)}}),r.sort((a,l)=>a.start!==l.start?a.start-l.start:l.end-a.end);const i=[];for(let a=0;a<r.length&&!(i.length>=n);a+=1){const l=r[a];Qe({start:l.start,end:l.end},i)||i.push(l)}return i}function ue(e,t=120){return e.length<=t?e:`${e.slice(0,t-1).trimEnd()}...`}function tt(e,t,n){const r=Math.max(0,t-28),o=Math.min(e.length,n+28);return ue(e.slice(r,o).trim(),180)}function nt(e,t){const n=le(t);return n.total=e.length,e.forEach(r=>{n.byType[r.type]+=1,r.severity==="high"?n.high+=1:r.severity==="medium"?n.medium+=1:n.low+=1}),n}function oe(e,t){const n=e.querySelector(".rte-pii-redaction-live");n&&(n.textContent=t)}function F(e,t,n){const r=t.querySelector('[data-action="toggle-realtime"]');if(!r)return;const o=H(e,n);r.textContent=o?n.labels.realtimeOnText:n.labels.realtimeOffText,r.setAttribute("aria-pressed",o?"true":"false"),C(e,"togglePIIRealtime",o)}function rt(e,t){e.setAttribute("aria-label",t.labels.panelAriaLabel);const n=e.querySelector(".rte-pii-redaction-title");n&&(n.textContent=t.labels.panelTitle);const r=e.querySelector('[data-action="close"]');r&&r.setAttribute("aria-label",t.labels.closeText);const o=e.querySelector('[data-action="run-scan"]');o&&(o.textContent=t.labels.scanText);const i=e.querySelector('[data-action="redact-all"]');i&&(i.textContent=t.labels.redactAllText);const a=e.querySelector(".rte-pii-redaction-shortcut");a&&(a.textContent=t.labels.shortcutText)}function B(e){const t=m.get(e);if(!t)return;const n=f.get(e)||M;if(!n)return;const r=I.get(e)||[],o=E.get(e)||le(0),i=U(e),a=t.querySelector(".rte-pii-redaction-count"),l=t.querySelector(".rte-pii-redaction-summary"),c=t.querySelector(".rte-pii-redaction-list"),s=t.querySelector('[data-action="redact-all"]');if(!(!a||!l||!c||!s)){if(a.textContent=String(o.total),l.textContent=`${n.labels.summaryPrefix}: ${o.total} | High ${o.high} | Medium ${o.medium} | Low ${o.low} | Redacted ${o.redactedCount}`,s.disabled=i||r.length===0,i?oe(t,n.labels.readonlyRedactionText):oe(t,`${o.total} PII findings detected.`),F(e,t,n),r.length===0){c.innerHTML=`<li class="rte-pii-redaction-empty">${b(n.labels.noFindingsText)}</li>`;return}c.innerHTML=r.map(d=>{const p=d.type.toUpperCase(),A=d.suggestion||"Redact this finding before export/share.",P=`${n.labels.locateText}: ${d.match}`,K=`${n.labels.redactText}: ${d.match}`,y=i?'disabled aria-disabled="true"':"";return`
        <li class="rte-pii-redaction-item rte-pii-redaction-item-${d.severity}">
          <button
            type="button"
            class="rte-pii-redaction-item-btn"
            data-action="locate-finding"
            data-finding-id="${b(d.id)}"
            data-role="finding-button"
            aria-label="${b(P)}"
          >
            <span class="rte-pii-redaction-badge">${b(d.severity.toUpperCase())}</span>
            <span class="rte-pii-redaction-type">${b(p)}</span>
          </button>
          <p class="rte-pii-redaction-line"><strong>${b(n.labels.matchLabel)}:</strong> ${b(ue(d.match,80))}</p>
          <p class="rte-pii-redaction-line"><strong>${b(n.labels.maskedLabel)}:</strong> ${b(ue(d.masked,80))}</p>
          ${d.excerpt?`<p class="rte-pii-redaction-line"><strong>${b(n.labels.excerptLabel)}:</strong> ${b(d.excerpt)}</p>`:""}
          <p class="rte-pii-redaction-help">${b(A)}</p>
          <div class="rte-pii-redaction-item-actions">
            <button type="button" class="rte-pii-redaction-btn" data-action="redact-finding" data-finding-id="${b(d.id)}" aria-label="${b(K)}" ${y}>${b(n.labels.redactText)}</button>
          </div>
        </li>
      `}).join("")}}function fe(e,t){if(!t.classList.contains("show"))return;const r=ge(e).getBoundingClientRect(),o=Math.min(window.innerWidth-20,390),i=Math.max(10,window.innerWidth-o-10),a=Math.min(Math.max(10,r.right-o),i),l=Math.max(10,Math.min(window.innerHeight-10-280,r.top+10));t.style.width=`${o}px`,t.style.left=`${a}px`,t.style.top=`${l}px`,t.style.maxHeight=`${Math.max(260,window.innerHeight-20)}px`}function H(e,t){const n=S.get(e);return typeof n=="boolean"?n:t?t.enableRealtime:!0}function Se(e,t){if(t===e.innerHTML)return;const n=window.execEditorCommand||window.executeEditorCommand;if(typeof n=="function")try{n("recordDomTransaction",e,t,e.innerHTML)}catch{}}function Ae(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Me(e,t){e.dispatchEvent(new CustomEvent("editora:pii-redacted",{bubbles:!0,detail:{redactedCount:t}}))}function Pe(e,t){return(I.get(e)||[]).find(r=>r.id===t)}function it(e){const t=m.get(e);if(t)return t;const n=f.get(e)||M||ee(),r=`rte-pii-redaction-panel-${He++}`,o=document.createElement("section");return o.className=u,o.id=r,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",n.labels.panelAriaLabel),o.innerHTML=`
    <header class="rte-pii-redaction-header">
      <h2 class="rte-pii-redaction-title">${b(n.labels.panelTitle)}</h2>
      <button type="button" class="rte-pii-redaction-icon-btn" data-action="close" aria-label="${b(n.labels.closeText)}">✕</button>
    </header>
    <div class="rte-pii-redaction-body">
      <div class="rte-pii-redaction-topline">
        <p class="rte-pii-redaction-summary" aria-live="polite"></p>
        <span class="rte-pii-redaction-count" aria-hidden="true">0</span>
      </div>
      <div class="rte-pii-redaction-controls" role="toolbar" aria-label="PII redaction controls">
        <button type="button" class="rte-pii-redaction-btn rte-pii-redaction-btn-primary" data-action="run-scan">${b(n.labels.scanText)}</button>
        <button type="button" class="rte-pii-redaction-btn" data-action="redact-all">${b(n.labels.redactAllText)}</button>
        <button type="button" class="rte-pii-redaction-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <ul class="rte-pii-redaction-list" role="list" aria-label="Detected PII findings"></ul>
      <p class="rte-pii-redaction-shortcut">${b(n.labels.shortcutText)}</p>
      <span class="rte-pii-redaction-live" aria-live="polite"></span>
    </div>
  `,o.addEventListener("click",i=>{const a=i.target,l=a==null?void 0:a.closest("[data-action]");if(!l)return;const c=l.getAttribute("data-action")||"",s=f.get(e)||M||n;if(f.set(e,s),w(e,s),c==="close"){Z(e,!0);return}if(c==="run-scan"){h(e,s,!0);return}if(c==="toggle-realtime"){const d=!H(e,s);S.set(e,d),F(e,o,s),d&&h(e,s,!0);return}if(c==="redact-all"){xe(e,s);return}if(c==="locate-finding"){const d=l.getAttribute("data-finding-id")||"",p=Pe(e,d);if(!p)return;lt(e,p,s);return}if(c==="redact-finding"){const d=l.getAttribute("data-finding-id")||"";_e(e,d,s)}}),o.addEventListener("keydown",i=>{if(i.key==="Escape"){i.preventDefault(),Z(e,!0);return}if(i.key!=="ArrowDown"&&i.key!=="ArrowUp")return;const a=Array.from(o.querySelectorAll('[data-role="finding-button"]'));if(a.length===0)return;const l=document.activeElement,c=a.findIndex(p=>p===l);if(c===-1)return;i.preventDefault();const s=i.key==="ArrowDown"?1:-1,d=(c+s+a.length)%a.length;a[d].focus()}),ne(o,e),document.body.appendChild(o),m.set(e,o),V.set(e,!1),B(e),o}function Z(e,t=!1){const n=m.get(e);n&&(n.classList.remove("show"),V.set(e,!1),C(e,"togglePIIRedactionPanel",!1),t&&e.focus({preventScroll:!0}))}function O(e){q();const t=it(e);m.forEach((r,o)=>{o!==e&&Z(o,!1)}),t.classList.add("show"),V.set(e,!0),C(e,"togglePIIRedactionPanel",!0),ne(t,e),fe(e,t),B(e);const n=t.querySelector('[data-action="run-scan"]');n==null||n.focus()}function Le(e,t){const n=ie(e);return(typeof t=="boolean"?t:!n)?O(e):Z(e),!0}function ot(e,t){const n=t.normalizeText(e.innerText||e.textContent||""),r=e.innerHTML;return`${n.length}:${$e(n)}:${r.length}:${$e(r)}:${t.detectorSignature}`}function at(e,t){const n=[],r=be(e.pattern);let o=r.exec(t);for(;o;){const i=o[0]||"",a=o.index,l=a+i.length;i&&l>a&&(!e.validator||e.validator(i))&&n.push({value:i,start:a,end:l}),r.lastIndex===o.index&&(r.lastIndex+=1),o=r.exec(t)}return n}function De(e,t,n){const r=n.detectors.find(c=>c.type===t.type&&c.enabled);if(!r)return null;const o=t.match.toLowerCase();let i=0;const a=document.createTreeWalker(e,pe,null);let l=a.nextNode();for(;l;){if(!he(l,n)){const c=at(r,l.data);for(let s=0;s<c.length;s+=1){const d=c[s];if(d.value.toLowerCase()===o&&(i+=1,i===t.occurrence)){const p=document.createRange();return p.setStart(l,d.start),p.setEnd(l,d.end),p}}}l=a.nextNode()}return null}function lt(e,t,n){const r=De(e,t,n);if(!r)return!1;const o=window.getSelection();if(!o)return!1;o.removeAllRanges(),o.addRange(r);const i=re(r.startContainer);return i==null||i.scrollIntoView({behavior:"smooth",block:"center",inline:"nearest"}),e.focus({preventScroll:!0}),!0}async function h(e,t,n=!1){var p;w(e,t);const r=ot(e,t);if(!n&&de.get(e)===r)return I.get(e)||[];const o=(Q.get(e)||0)+1;Q.set(e,o);const i=[],a=new Map,l=document.createTreeWalker(e,pe,null);let c=l.nextNode();for(;c&&i.length<t.maxFindings;){const A=c.data||"";if(A.trim()&&!he(c,t)){const P=et(A,t.detectors,t.maxFindings-i.length);for(let K=0;K<P.length&&!(i.length>=t.maxFindings);K+=1){const y=P[K],ye=`${y.type}:${y.value.toLowerCase()}`,ke=(a.get(ye)||0)+1;a.set(ye,ke),i.push({id:Je(y.type),type:y.type,severity:y.severity,match:y.value,masked:Ce(y.value,y.type,t),occurrence:ke,excerpt:tt(A,y.start,y.end),suggestion:"Review and redact this value before external sharing."})}}c=l.nextNode()}if(Q.get(e)!==o)return I.get(e)||[];const s=((p=E.get(e))==null?void 0:p.redactedCount)||0,d=nt(i,s);return de.set(e,r),I.set(e,i),E.set(e,d),B(e),e.dispatchEvent(new CustomEvent("editora:pii-scan",{bubbles:!0,detail:{findings:i,stats:d}})),i}function ct(e,t){let n=e,r=0;return t.detectors.filter(i=>i.enabled).forEach(i=>{const a=be(i.pattern);n=n.replace(a,l=>i.validator&&!i.validator(l)?l:(r+=1,Re(l,i.type,t)))}),{nextValue:n,count:r}}async function _e(e,t,n){var s;if(U(e)){const d=m.get(e);return d&&oe(d,n.labels.readonlyRedactionText),!1}const r=Pe(e,t);if(!r)return!1;const o=De(e,r,n);if(!o)return!1;const i=e.innerHTML,a=Re(r.match,r.type,n);if(o.startContainer===o.endContainer&&o.startContainer.nodeType===Node.TEXT_NODE){const d=o.startContainer,p=d.data,A=o.startOffset,P=o.endOffset;d.data=`${p.slice(0,A)}${a}${p.slice(P)}`}else o.deleteContents(),o.insertNode(document.createTextNode(a));Ae(e),Se(e,i);const l=((s=E.get(e))==null?void 0:s.redactedCount)||0;await h(e,n,!0);const c=E.get(e);return c&&(c.redactedCount=l+1,B(e)),Me(e,1),!0}async function xe(e,t){var s;if(U(e)){const d=m.get(e);return d&&oe(d,t.labels.readonlyRedactionText),0}(I.get(e)||[]).length===0&&await h(e,t,!0);const r=e.innerHTML;let o=0;const i=document.createTreeWalker(e,pe,null);let a=i.nextNode();for(;a;){if(he(a,t)){a=i.nextNode();continue}const d=a.data||"";if(!d){a=i.nextNode();continue}const p=ct(d,t);p.count>0&&p.nextValue!==d&&(a.data=p.nextValue,o+=p.count),a=i.nextNode()}if(o===0)return 0;Ae(e),Se(e,r);const l=((s=E.get(e))==null?void 0:s.redactedCount)||0;await h(e,t,!0);const c=E.get(e);return c&&(c.redactedCount=l+o,B(e)),Me(e,o),o}function Ne(e){const t=f.get(e)||M;if(!t||!H(e,t)||U(e))return;me(e);const n=window.setTimeout(()=>{j.delete(n),te.delete(e),h(e,t,!1)},t.debounceMs);j.add(n),te.set(e,n)}function st(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="i"}function dt(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="u"}function ut(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="m"}function ft(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="y"}function pt(e){var r;const t=re(e.target);if(t){const o=t.closest(x);if(o)return o;const i=t.closest(ae);if(i){const l=z(i);if(l)return l}const a=t.closest(`.${u}`);if(a){const l=Array.from(m.entries()).find(([,c])=>c===a);if(l)return l[0]}}const n=window.getSelection();if(n&&n.rangeCount>0){const o=(r=re(n.getRangeAt(0).startContainer))==null?void 0:r.closest(x);if(o)return o}return null}function bt(){if(typeof document>"u"||document.getElementById(Ee))return;const e=document.createElement("style");e.id=Ee,e.textContent=`
    .rte-toolbar-group-items.${k},
    .editora-toolbar-group-items.${k},
    .rte-toolbar-group-items.${v},
    .editora-toolbar-group-items.${v} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${k} .rte-toolbar-button,
    .editora-toolbar-group-items.${k} .editora-toolbar-button,
    .rte-toolbar-group-items.${v} .rte-toolbar-button,
    .editora-toolbar-group-items.${v} .editora-toolbar-button {
      border: none;
      border-radius: 0;
      border-right: 1px solid #ccc;
    }

    .rte-toolbar-group-items.${k} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${k} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${v} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${v} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="togglePIIRealtime"].active,
    .editora-toolbar-button[data-command="togglePIIRealtime"].active {
      background-color: #ccc;
    }

    ${$} .rte-toolbar-group-items.${k},
    ${$} .editora-toolbar-group-items.${k},
    ${$} .rte-toolbar-group-items.${v},
    ${$} .editora-toolbar-group-items.${v},
    .${u}.rte-pii-redaction-theme-dark {
      border-color: #566275;
    }
    ${$} .rte-toolbar-group-items.${k} .rte-toolbar-button svg,
    ${$} .editora-toolbar-group-items.${k} .editora-toolbar-button svg,
    ${$} .rte-toolbar-group-items.${v} .rte-toolbar-button svg,
    ${$} .editora-toolbar-group-items.${v} .editora-toolbar-button svg
    {
      fill: none;
    }
    ${$} .rte-toolbar-group-items.${k} .rte-toolbar-button,
    ${$} .editora-toolbar-group-items.${k} .editora-toolbar-button
    {
      border-color: #566275;
    }
    .${u} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(390px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #111827;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
      overflow: hidden;
    }

    .${u}.show {
      display: flex;
      flex-direction: column;
    }

    .${u}.rte-pii-redaction-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 20px 46px rgba(2, 6, 23, 0.68);
    }

    .rte-pii-redaction-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-pii-redaction-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-pii-redaction-icon-btn {
      width: 34px;
      height: 34px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-pii-redaction-icon-btn:hover,
    .rte-pii-redaction-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-icon-btn:hover,
    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-pii-redaction-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-pii-redaction-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-pii-redaction-summary {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
      flex: 1;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-summary {
      color: #94a3b8;
    }

    .rte-pii-redaction-count {
      min-width: 32px;
      height: 32px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-count {
      border-color: #334155;
      background: #111827;
      color: #cbd5e1;
    }

    .rte-pii-redaction-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rte-pii-redaction-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      height: 34px;
      padding: 0 10px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-pii-redaction-btn:hover,
    .rte-pii-redaction-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .rte-pii-redaction-btn:disabled {
      opacity: 0.56;
      cursor: not-allowed;
    }

    .rte-pii-redaction-btn-primary {
      border-color: #0284c7;
      background: #0ea5e9;
      color: #f8fafc;
    }

    .rte-pii-redaction-btn-primary:hover,
    .rte-pii-redaction-btn-primary:focus-visible {
      border-color: #0369a1;
      background: #0284c7;
      color: #ffffff;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-btn:hover,
    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-pii-redaction-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: min(55vh, 420px);
      overflow: auto;
    }

    .rte-pii-redaction-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
      background: #ffffff;
      display: grid;
      gap: 6px;
    }

    .rte-pii-redaction-item-high {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .rte-pii-redaction-item-medium {
      border-color: #fcd34d;
      background: #fffbeb;
    }

    .rte-pii-redaction-item-low {
      border-color: #93c5fd;
      background: #eff6ff;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-item {
      border-color: #334155;
      background: #0b1220;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-item-high {
      border-color: #7f1d1d;
      background: #2b0b11;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-item-medium {
      border-color: #78350f;
      background: #2b1907;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-item-low {
      border-color: #1d4ed8;
      background: #0a162f;
    }

    .rte-pii-redaction-item-btn {
      border: none;
      background: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
      padding: 0;
      color: inherit;
      cursor: pointer;
    }

    .rte-pii-redaction-item-btn:focus-visible {
      outline: 2px solid #0284c7;
      outline-offset: 3px;
      border-radius: 6px;
    }

    .rte-pii-redaction-badge {
      border-radius: 999px;
      border: 1px solid currentColor;
      padding: 1px 8px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.3;
      text-transform: uppercase;
      opacity: 0.86;
    }

    .rte-pii-redaction-type {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.03em;
    }

    .rte-pii-redaction-line,
    .rte-pii-redaction-help {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #334155;
      word-break: break-word;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-line,
    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-help {
      color: #94a3b8;
    }

    .rte-pii-redaction-item-actions {
      display: flex;
      justify-content: flex-end;
    }

    .rte-pii-redaction-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      color: #475569;
      background: #f8fafc;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-empty {
      border-color: #334155;
      background: #0b1220;
      color: #94a3b8;
    }

    .rte-pii-redaction-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${u}.rte-pii-redaction-theme-dark .rte-pii-redaction-shortcut {
      color: #94a3b8;
    }

    .rte-pii-redaction-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .${u} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-pii-redaction-list {
        max-height: 45vh;
      }
    }
  `,document.head.appendChild(e)}function gt(e){M=e,L||(L=t=>{q();const n=t.target,r=n==null?void 0:n.closest(x);if(!r)return;g=r;const o=f.get(r)||e;w(r,o),f.set(r,o),C(r,"togglePIIRedactionPanel",ie(r)),C(r,"togglePIIRealtime",H(r,o));const i=m.get(r);i&&(ne(i,r),fe(r,i),F(r,i,o))},document.addEventListener("focusin",L,!0)),D||(D=t=>{const n=t.target,r=n==null?void 0:n.closest(x);r&&(g=r,Ne(r))},document.addEventListener("input",D,!0)),_||(_=t=>{if(t.defaultPrevented)return;const n=t.target;if(n!=null&&n.closest(`.${u} input, .${u} textarea, .${u} select`))return;const r=pt(t);if(!r)return;const o=f.get(r)||M||e;if(w(r,o),f.set(r,o),g=r,t.key==="Escape"&&ie(r)){t.preventDefault(),Z(r,!0);return}if(st(t)){t.preventDefault(),t.stopPropagation(),Le(r);return}if(dt(t)){t.preventDefault(),t.stopPropagation(),h(r,o,!0),O(r);return}if(ut(t)){t.preventDefault(),t.stopPropagation(),U(r)||(xe(r,o),O(r));return}if(ft(t)){t.preventDefault(),t.stopPropagation();const i=!H(r,o);S.set(r,i);const a=m.get(r);a&&F(r,a,o),C(r,"togglePIIRealtime",i),i&&h(r,o,!0)}},document.addEventListener("keydown",_,!0)),R||(R=()=>{q(),m.forEach((t,n)=>{!n.isConnected||!t.isConnected||(ne(t,n),fe(n,t))})},window.addEventListener("scroll",R,!0),window.addEventListener("resize",R)),!N&&typeof MutationObserver<"u"&&document.body&&(N=new MutationObserver(t=>{Ge(t)&&q()}),N.observe(document.body,{childList:!0,subtree:!0}))}function mt(){L&&(document.removeEventListener("focusin",L,!0),L=null),D&&(document.removeEventListener("input",D,!0),D=null),_&&(document.removeEventListener("keydown",_,!0),_=null),R&&(window.removeEventListener("scroll",R,!0),window.removeEventListener("resize",R),R=null),N&&(N.disconnect(),N=null),m.forEach(e=>e.remove()),m.clear(),W.forEach(e=>me(e)),W.clear(),M=null,g=null}const ht=(e={})=>{const t=ee(e),n=new Set;return bt(),{name:"piiRedaction",toolbar:[{id:"piiRedactionGroup",label:"PII Redaction",type:"group",command:"piiRedaction",items:[{id:"piiRedaction",label:"PII Redaction",command:"togglePIIRedactionPanel",shortcut:"Mod-Alt-Shift-i",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3.5 19 6.5v4.8c0 4.4-2.7 8.1-7 9.2-4.3-1.1-7-4.8-7-9.2V6.5l7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 11.6h6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="11.6" r="1.2" fill="currentColor"/></svg>'},{id:"piiScan",label:"Scan PII",command:"runPIIScan",shortcut:"Mod-Alt-Shift-u",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4.5" y="3.5" width="11" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 8.2h5M7.5 11.2h5M7.5 14.2h3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16.8" cy="16.8" r="2.8" stroke="currentColor" stroke-width="1.6"/><path d="m18.8 18.8 2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'},{id:"piiRedactAll",label:"Redact All PII",command:"redactAllPII",shortcut:"Mod-Alt-Shift-m",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 18h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7 6h10l-1 8H8L7 6Z" stroke="currentColor" stroke-width="1.7"/><path d="m9 9 6 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'},{id:"piiRealtime",label:"Toggle Realtime PII Scan",command:"togglePIIRealtime",shortcut:"Mod-Alt-Shift-y",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3v4M12 17v4M4 12h4M16 12h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/></svg>'}]}],commands:{piiRedaction:(r,o)=>{const i=T(o);if(!i)return!1;const a=f.get(i)||t;return w(i,a),f.set(i,a),g=i,O(i),h(i,a,!1),!0},togglePIIRedactionPanel:(r,o)=>{const i=T(o);if(!i)return!1;const a=f.get(i)||t;w(i,a),f.set(i,a),g=i;const l=Le(i,typeof r=="boolean"?r:void 0);return ie(i)&&h(i,a,!1),l},runPIIScan:async(r,o)=>{const i=T(o);if(!i)return!1;const a=f.get(i)||t;return w(i,a),f.set(i,a),g=i,await h(i,a,!0),O(i),!0},redactAllPII:async(r,o)=>{const i=T(o);if(!i)return!1;const a=f.get(i)||t;w(i,a),f.set(i,a),g=i;const l=await xe(i,a);return l>0&&O(i),l>0},redactPIIFinding:async(r,o)=>{const i=T(o);if(!i||typeof r!="string"||!r)return!1;const a=f.get(i)||t;return w(i,a),f.set(i,a),g=i,_e(i,r,a)},togglePIIRealtime:(r,o)=>{const i=T(o);if(!i)return!1;const a=f.get(i)||t;w(i,a),f.set(i,a);const l=typeof r=="boolean"?r:!H(i,a);S.set(i,l);const c=m.get(i);return c&&F(i,c,a),C(i,"togglePIIRealtime",l),l&&h(i,a,!0),!0},getPIIRedactionFindings:(r,o)=>{const i=T(o);if(!i)return!1;const a=I.get(i)||[],l=E.get(i)||le(0),c=a.map(d=>({...d})),s={...l,byType:{...l.byType}};if(typeof r=="function")try{r(c,s)}catch{}return i.__piiRedactionFindings=c,i.dispatchEvent(new CustomEvent("editora:pii-findings",{bubbles:!0,detail:{findings:c,stats:s}})),!0},setPIIRedactionOptions:(r,o)=>{const i=T(o);if(!i||!r||typeof r!="object")return!1;const a=f.get(i)||t,l=ee({...ce(a),...r,labels:{...a.labels,...r.labels||{}},detectors:{...ce(a).detectors||{},...r.detectors||{}},normalizeText:r.normalizeText||a.normalizeText});f.set(i,l),typeof r.enableRealtime=="boolean"&&S.set(i,r.enableRealtime);const c=m.get(i);return c&&(rt(c,l),B(i),F(i,c,l)),h(i,l,!0),!0}},keymap:{"Mod-Alt-Shift-i":"togglePIIRedactionPanel","Mod-Alt-Shift-I":"togglePIIRedactionPanel","Mod-Alt-Shift-u":"runPIIScan","Mod-Alt-Shift-U":"runPIIScan","Mod-Alt-Shift-m":"redactAllPII","Mod-Alt-Shift-M":"redactAllPII","Mod-Alt-Shift-y":"togglePIIRealtime","Mod-Alt-Shift-Y":"togglePIIRealtime"},init:function(o){G+=1;const i=this&&typeof this.__pluginConfig=="object"?ee({...ce(t),...this.__pluginConfig}):t;gt(i);const a=T(o!=null&&o.editorElement?{editorElement:o.editorElement}:void 0,!1);a&&(g=a,n.add(a),w(a,i),f.set(a,i),C(a,"togglePIIRedactionPanel",!1),C(a,"togglePIIRealtime",i.enableRealtime),i.enableRealtime&&Ne(a))},destroy:()=>{n.forEach(r=>Te(r)),n.clear(),G=Math.max(0,G-1),!(G>0)&&(j.forEach(r=>{window.clearTimeout(r)}),j.clear(),mt())}}};export{ht as P};
