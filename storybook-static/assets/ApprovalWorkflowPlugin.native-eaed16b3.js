const R=".rte-content, .editora-content",E='.rte-track-insert[data-track-change="insert"]',v='.rte-track-delete[data-track-change="delete"]',ie=`${E}, ${v}`,we="__editoraCommandEditorRoot",Te=new WeakMap,Y=new WeakMap,pe=new WeakMap,me=new Set;let Ce=!1,A=null,Se=!1,O={},Me=!1;const Je=typeof InputEvent<"u"&&typeof InputEvent.prototype=="object"&&"inputType"in InputEvent.prototype,Qe=new Set(["IMG","TABLE","VIDEO","AUDIO","SVG","MATH","HR","IFRAME","INPUT","TEXTAREA","SELECT","BUTTON","CANVAS"]);function et(e){if(!e)return null;const t=e.querySelector('[contenteditable="true"]');return t instanceof HTMLElement?t:null}function tt(){if(typeof window>"u")return null;const e=window[we];if(!(e instanceof HTMLElement))return null;window[we]=null;const t=e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||(e.matches("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")?e:null);if(t){const n=et(t);if(n)return n;if(t.getAttribute("contenteditable")==="true")return t}if(e.getAttribute("contenteditable")==="true")return e;const r=e.closest('[contenteditable="true"]');return r instanceof HTMLElement?r:null}function rt(e){if((e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const o=e.editorElement;if(o.getAttribute("contenteditable")==="true")return o;const a=o.querySelector('[contenteditable="true"]');if(a instanceof HTMLElement)return a}const t=tt();if(t&&document.contains(t))return t;const r=window.getSelection();if(r&&r.rangeCount>0){const o=r.getRangeAt(0).startContainer,a=o.nodeType===Node.ELEMENT_NODE?o:o.parentElement,l=a==null?void 0:a.closest(R);if(l)return l}const n=document.activeElement;if(n){if(n.matches(R))return n;const o=n.closest(R);if(o)return o}return A!=null&&A.isConnected?A:document.querySelector(R)}function ce(e,t){var n;D(e),he(e);let r=Te.get(e);return r||(r={enabled:!!t.enabledByDefault,author:((n=t.author)==null?void 0:n.trim())||"system",includeTimestamp:t.includeTimestamp!==!1},Te.set(e,r),r.enabled&&(ee(e,r),J(e,r.enabled))),Q(e,"toggleTrackChanges",r.enabled),r}function J(e,t){e.classList.toggle("rte-track-changes-enabled",t),t?e.setAttribute("data-track-changes","true"):e.removeAttribute("data-track-changes")}function nt(e){return e.closest("[data-editora-editor], .rte-editor, .editora-editor, editora-editor")||e}function Q(e,t,r){const n=nt(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("data-active",r?"true":"false"),a.setAttribute("aria-pressed",r?"true":"false"),a.setAttribute("title",r?"Track Changes (On)":"Track Changes (Off)")})}function ot(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function at(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function S(e,t){ot(e),at(e,t)}function lt(e,t){return e.startContainer===t.startContainer&&e.startOffset===t.startOffset&&e.endContainer===t.endContainer&&e.endOffset===t.endOffset}function Ie(e){return{author:e.author,timestamp:e.includeTimestamp?new Date().toISOString():""}}function st(e,t){const r=document.createElement("span");r.className="rte-track-insert",r.setAttribute("data-track-change","insert"),r.setAttribute("contenteditable","false");const n=Ie(t);return r.setAttribute("data-track-author",n.author),n.timestamp&&r.setAttribute("data-track-time",n.timestamp),r.appendChild(document.createTextNode(e)),r}function D(e){Array.from(e.querySelectorAll(E)).forEach(r=>{r.setAttribute("contenteditable","false")})}function N(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function it(e,t){const r=e.startContainer,n=e.startOffset;if(r.nodeType===Node.TEXT_NODE){const o=r,a=o.previousSibling||o.nextSibling;if(a instanceof HTMLElement&&a.matches(E)&&t.contains(a))return a}if(r.nodeType===Node.ELEMENT_NODE){const o=r,a=o.childNodes[n-1];if(a instanceof HTMLElement&&a.matches(E)&&t.contains(a))return a;const l=o.childNodes[n];if(l instanceof HTMLElement&&l.matches(E)&&t.contains(l))return l}return null}function Le(e,t,r){const n=t.lastChild;n&&n.nodeType===Node.TEXT_NODE?n.data+=r:t.appendChild(document.createTextNode(r)),B(e,t)}function ct(e,t){const r=document.createElement("span");r.className="rte-track-delete",r.setAttribute("data-track-change","delete"),r.setAttribute("contenteditable","false");const n=Ie(t);return r.setAttribute("data-track-author",n.author),n.timestamp&&r.setAttribute("data-track-time",n.timestamp),r.appendChild(e),r}function P(e){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const r=t.getRangeAt(0);return e.contains(r.commonAncestorContainer)?r:null}function ut(){Me||typeof document>"u"||(Me=!0,document.addEventListener("selectionchange",()=>{const e=window.getSelection();if(!e||e.rangeCount===0)return;const t=e.getRangeAt(0),r=N(t.startContainer),n=(r==null?void 0:r.closest(R))||null;n&&(pe.set(n,t.cloneRange()),A=n)},!0))}function B(e,t){if(!t.parentNode){e.focus({preventScroll:!0});return}const r=window.getSelection();if(!r)return;const n=document.createRange();n.setStartAfter(t),n.collapse(!0),r.removeAllRanges(),r.addRange(n),e.focus({preventScroll:!0})}function ge(e,t){if(!t.parentNode){e.focus({preventScroll:!0});return}const r=window.getSelection();if(!r)return;const n=document.createRange();n.setStartBefore(t),n.collapse(!0),r.removeAllRanges(),r.addRange(n),e.focus({preventScroll:!0})}function dt(e,t,r){const n=window.getSelection();if(!n)return;const o=document.createRange();o.setStart(t,Math.max(0,r)),o.collapse(!0),n.removeAllRanges(),n.addRange(o),e.focus({preventScroll:!0})}function _e(e){let t=P(e);if(!t){const l=pe.get(e);l&&e.contains(l.commonAncestorContainer)&&(t=l.cloneRange())}if(!t||!t.collapsed)return;const r=N(t.startContainer);if(!r)return;const n=r.closest(E);if(!n||!e.contains(n)||!n.parentNode)return;const o=window.getSelection();if(!o)return;const a=document.createRange();a.setStartAfter(n),a.collapse(!0),o.removeAllRanges(),o.addRange(a),e.focus({preventScroll:!0})}function qe(e,t){const r=e.innerHTML;D(e),_e(e),e.focus({preventScroll:!0});const n=t==="insertLineBreak"?"insertLineBreak":"insertParagraph",o=document.execCommand(n,!1);return D(e),S(e,r),o!==!1}function ft(e){const t=P(e);if(t&&t.collapsed)return t;const r=pe.get(e);return r&&r.collapsed&&e.contains(r.commonAncestorContainer)?r.cloneRange():null}function pt(e){return e.matches(E)||e.matches(v)?(e.textContent||"").replace(/\u200B/g,"").trim().length>0:Qe.has(e.tagName)}function Pe(e,t){if(t!=="insertParagraph")return!1;const r=ft(e);if(!r)return!1;const n=N(r.startContainer);if(!n)return!1;const o=n.closest("li");return!(o instanceof HTMLElement)||!e.contains(o)||(o.textContent||"").replace(/\u200B/g,"").trim().length>0?!1:!Array.from(o.querySelectorAll("*")).some(s=>pt(s))}function mt(e){const t=document.createRange(),r=window.getSelection();if(r&&r.rangeCount>0){const n=r.getRangeAt(0);if(e.contains(n.commonAncestorContainer))return t.setStart(n.endContainer,n.endOffset),t.collapse(!0),t}return t.selectNodeContents(e),t.collapse(!1),t}function gt(e){return(e.textContent||"").length>0?!0:Array.from(e.childNodes).some(r=>{if(r.nodeType!==Node.ELEMENT_NODE)return!1;const n=r;return["BR","IMG","TABLE","VIDEO","AUDIO","SVG","MATH"].includes(n.tagName)})}function bt(e){return Array.from(e.childNodes).some(t=>{if(t.nodeType===Node.TEXT_NODE)return(t.textContent||"").length>0;if(t.nodeType!==Node.ELEMENT_NODE)return!1;const r=t;return["BR","IMG","TABLE","VIDEO","AUDIO","SVG","MATH"].includes(r.tagName)})}function ht(e,t,r){if(!e.collapsed)return null;const n=e.startContainer,o=e.startOffset;let a=null;if(n.nodeType===Node.TEXT_NODE){const l=n;t==="backward"&&o===0?a=l.previousSibling:t==="forward"&&o===l.length&&(a=l.nextSibling)}else if(n.nodeType===Node.ELEMENT_NODE){const l=n;t==="backward"&&o>0?a=l.childNodes[o-1]||null:t==="forward"&&o<l.childNodes.length&&(a=l.childNodes[o]||null)}return!(a instanceof HTMLElement)||!a.matches(E)||!r.contains(a)?null:a}function vt(e,t){const r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),n=[];let o=r.nextNode();for(;o;){const a=o;a.data.length>0&&n.push(a),o=r.nextNode()}return n.length===0?null:t?n[n.length-1]:n[0]}function kt(e,t,r){const n=ht(t,r,e);return n?ue(e,n,r):!1}function ue(e,t,r){const n=t.parentNode;if(!n)return!1;const o=Array.prototype.indexOf.call(n.childNodes,t),a=vt(t,r==="backward");return a?(r==="backward"?a.data=a.data.slice(0,-1):a.data=a.data.slice(1),a.data.length===0&&a.remove(),bt(t)?(r==="backward"?B(e,t):ge(e,t),!0):(t.remove(),dt(e,n,o),!0)):!1}function Be(e){if(e.startContainer!==e.endContainer||e.startContainer.nodeType!==Node.ELEMENT_NODE)return null;const t=e.startContainer;return e.endOffset-e.startOffset!==1?null:t.childNodes[e.startOffset]||null}function be(e,t){const r=Be(e);return!(r instanceof HTMLElement)||!r.matches(v)||!t.contains(r)?null:r}function Et(e,t){const r=Be(e);return!(r instanceof HTMLElement)||!r.matches(E)||!t.contains(r)?null:r}function xt(e,t){var a,l;if(t.collapsed){const s=N(t.startContainer),c=s==null?void 0:s.closest(v);if(c&&e.contains(c)){const u=document.createRange();return u.setStartAfter(c),u.collapse(!0),u}return t}const r=be(t,e);if(r){const s=document.createRange();return s.setStartAfter(r),s.collapse(!0),s}const n=(a=N(t.startContainer))==null?void 0:a.closest(v),o=(l=N(t.endContainer))==null?void 0:l.closest(v);if(n&&o&&n===o&&e.contains(n)){const s=document.createRange();return s.setStartAfter(n),s.collapse(!0),s}return t}function yt(e,t){const n=Array.from(t.querySelectorAll(E)).filter(s=>{try{return e.intersectsNode(s)}catch{return!1}});if(n.length!==1)return null;const o=n[0],a=(e.toString()||"").replace(/\s+/g,""),l=(o.textContent||"").replace(/\s+/g,"");return!l||a!==l?null:o}function We(e,t,r){if(t.collapsed)return null;const n=t.cloneContents();if(!gt(n))return null;const o=ct(n,r);return t.deleteContents(),t.insertNode(o),B(e,o),o}function At(e,t,r){if(!t.collapsed)return t;const n=t.startContainer,o=t.startOffset;if(n.nodeType===Node.TEXT_NODE){const s=n;if(r==="backward"&&o>0){const c=t.cloneRange();return c.setStart(s,o-1),c}if(r==="forward"&&o<s.length){const c=t.cloneRange();return c.setEnd(s,o+1),c}}if(n.nodeType===Node.ELEMENT_NODE){const s=n;if(r==="backward"&&o>0)for(let c=o-1;c>=0;c-=1){const u=s.childNodes[c];if(!u||u instanceof HTMLElement&&u.matches(v))continue;const i=t.cloneRange();if(u.nodeType===Node.TEXT_NODE){const d=u;if(d.length===0)continue;i.setStart(d,d.length-1),i.setEnd(d,d.length)}else i.setStartBefore(u),i.setEndAfter(u);return i}if(r==="forward"&&o<s.childNodes.length)for(let c=o;c<s.childNodes.length;c+=1){const u=s.childNodes[c];if(!u||u instanceof HTMLElement&&u.matches(v))continue;const i=t.cloneRange();if(u.nodeType===Node.TEXT_NODE){const d=u;if(d.length===0)continue;i.setStart(d,0),i.setEnd(d,1)}else i.setStartBefore(u),i.setEndAfter(u);return i}}const a=window.getSelection();if(!a||typeof a.modify!="function")return null;const l=t.cloneRange();a.removeAllRanges(),a.addRange(l);try{if(a.modify("extend",r,"character"),a.rangeCount===0)return null;const s=a.getRangeAt(0).cloneRange();if(s.collapsed||!e.contains(s.commonAncestorContainer))return null;const c=be(s,e);return c?(r==="backward"?ge(e,c):B(e,c),null):s}catch{return null}finally{a.removeAllRanges(),a.addRange(l)}}function ze(e,t,r){let n=P(e);if(!n)return!1;const o=xt(e,n.cloneRange());if(!lt(o,n)){const d=window.getSelection();d&&(d.removeAllRanges(),d.addRange(o)),n=o}const a=e.innerHTML;n.collapsed||We(e,n.cloneRange(),t);const l=N(n.startContainer),s=l==null?void 0:l.closest(E);if(n.collapsed&&s&&e.contains(s))return Le(e,s,r),S(e,a),!0;const c=n.collapsed?it(n,e):null;if(c)return Le(e,c,r),S(e,a),!0;const u=mt(e),i=st(r,t);return u.insertNode(i),B(e,i),S(e,a),!0}function je(e,t,r){const n=P(e);if(!n)return!1;const o=r.includes("Backward")?"backward":"forward",a=e.innerHTML;if(n.collapsed&&kt(e,n.cloneRange(),o))return S(e,a),!0;const l=Et(n,e);if(l&&ue(e,l,o))return S(e,a),!0;if(!n.collapsed){const i=yt(n,e);if(i&&ue(e,i,o))return S(e,a),!0}const s=n.collapsed?At(e,n.cloneRange(),o):n.cloneRange();if(!s)return!1;const c=be(s,e);return c?(o==="backward"?ge(e,c):B(e,c),!0):We(e,s,t)?(he(e),S(e,a),!0):!1}function de(e){const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}}function he(e){Array.from(e.querySelectorAll(v)).forEach(n=>{n.setAttribute("contenteditable","false"),Array.from(n.querySelectorAll(v)).forEach(a=>{a!==n&&de(a)})});let r=!0;for(;r;)r=!1,Array.from(e.querySelectorAll(v)).forEach(o=>{if(!o.isConnected)return;let a=o.nextSibling;for(;a&&a.nodeType===Node.TEXT_NODE&&!(a.textContent||"").trim();)a=a.nextSibling;if(a instanceof HTMLElement&&a.matches(v)){for(;a.firstChild;)o.appendChild(a.firstChild);a.remove(),r=!0}o.firstChild||(o.remove(),r=!0)})}function Ke(e){return Array.from(e.querySelectorAll(ie))}function wt(e){const t=P(e);if(!t)return[];const r=new Set,n=t.startContainer.nodeType===Node.ELEMENT_NODE?t.startContainer:t.startContainer.parentElement,o=t.endContainer.nodeType===Node.ELEMENT_NODE?t.endContainer:t.endContainer.parentElement,a=n==null?void 0:n.closest(ie);a&&e.contains(a)&&r.add(a);const l=o==null?void 0:o.closest(ie);return l&&e.contains(l)&&r.add(l),Ke(e).filter(c=>{try{return t.intersectsNode(c)}catch{return!1}}).forEach(c=>r.add(c)),Array.from(r)}function X(e,t,r){const n=r==="all"?Ke(e):wt(e);if(n.length===0)return!1;const o=e.innerHTML;return n.forEach(a=>{if(!a.isConnected)return;const l=a.matches(E),s=a.matches(v);if(!(!l&&!s)){if(t==="accept"){l?de(a):a.remove();return}l?a.remove():(a.removeAttribute("contenteditable"),de(a))}}),he(e),S(e,o),!0}function Tt(e){if(!(e instanceof Node))return null;const t=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement;return(t==null?void 0:t.closest(R))||null}function Ct(){Se||typeof document>"u"||(Se=!0,document.addEventListener("focusin",e=>{if(!O.enabledByDefault)return;const t=Tt(e.target);if(!t)return;A=t;const r=ce(t,O);r.enabled?(ee(t,r),J(t,!0),Q(t,"toggleTrackChanges",!0)):D(t)},!0))}function St(e,t){return r=>{if(!t.enabled||e.getAttribute("data-track-changes")!=="true")return;A=e;const n=r.inputType||"";if(n==="insertParagraph"||n==="insertLineBreak"){if(Pe(e,n))return;r.preventDefault(),qe(e,n);return}if(n.startsWith("delete")){r.preventDefault(),je(e,t,n);return}if(n==="insertText"||n==="insertCompositionText"){const o=r.data||"";if(!o)return;r.preventDefault(),ze(e,t,o)}}}function Mt(e,t){return r=>{if(!t.enabled||e.getAttribute("data-track-changes")!=="true"||r.key!=="Enter"||Je)return;const n=r.shiftKey?"insertLineBreak":"insertParagraph";Pe(e,n)||(A=e,r.preventDefault(),r.stopPropagation(),qe(e,n))}}function Lt(e,t){return r=>{var o;if(r.__editoraSmartPasteHandled===!0||r.defaultPrevented||!t.enabled||e.getAttribute("data-track-changes")!=="true")return;const n=((o=r.clipboardData)==null?void 0:o.getData("text/plain"))||"";n&&(r.preventDefault(),A=e,ze(e,t,n))}}function Rt(e,t){return r=>{if(!t.enabled||e.getAttribute("data-track-changes")!=="true")return;const n=P(e);if(!n||n.collapsed)return;const o=n.toString();r.clipboardData&&(r.clipboardData.setData("text/plain",o),r.preventDefault()),A=e,je(e,t,"deleteByCut")}}function ee(e,t){if(Y.has(e))return;D(e);const r={beforeInput:St(e,t),keydown:Mt(e,t),paste:Lt(e,t),cut:Rt(e,t)};e.addEventListener("beforeinput",r.beforeInput),e.addEventListener("keydown",r.keydown),e.addEventListener("paste",r.paste),e.addEventListener("cut",r.cut),Y.set(e,r),me.add(e)}function Re(e){const t=Y.get(e);t&&(e.removeEventListener("beforeinput",t.beforeInput),e.removeEventListener("keydown",t.keydown),e.removeEventListener("paste",t.paste),e.removeEventListener("cut",t.cut),Y.delete(e),me.delete(e))}function Nt(){if(Ce||typeof document>"u")return;Ce=!0;const e=document.createElement("style");e.id="rte-track-changes-styles",e.textContent=`
    .rte-track-insert[data-track-change="insert"] {
      background: rgba(22, 163, 74, 0.2);
      color: inherit;
      text-decoration: underline;
      text-decoration-color: #16a34a;
      text-decoration-thickness: 2px;
      border-radius: 2px;
      padding: 0 1px;
      white-space: pre-wrap;
    }

    .rte-track-delete[data-track-change="delete"] {
      background: rgba(220, 38, 38, 0.16);
      color: inherit;
      text-decoration: line-through;
      text-decoration-color: #dc2626;
      text-decoration-thickness: 2px;
      border-radius: 2px;
      padding: 0 1px;
      white-space: pre-wrap;
      cursor: pointer;
    }

    .editora-theme-dark .rte-track-insert[data-track-change="insert"],
    .rte-theme-dark .rte-track-insert[data-track-change="insert"] {
      background: rgba(74, 222, 128, 0.2);
      text-decoration-color: #4ade80;
    }

    .editora-theme-dark .rte-track-delete[data-track-change="delete"],
    .rte-theme-dark .rte-track-delete[data-track-change="delete"] {
      background: rgba(248, 113, 113, 0.18);
      text-decoration-color: #f87171;
    }

    .rte-content[data-track-changes="true"],
    .editora-content[data-track-changes="true"] {
      caret-color: currentColor;
    }

    .rte-toolbar-group-items.track-changes,
    .editora-toolbar-group-items.track-changes {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }
    .rte-toolbar-group-items.track-changes .rte-toolbar-button,
    .editora-toolbar-group-items.track-changes .editora-toolbar-button {
      border: none;
      border-radius: 0px; 
    }
    .rte-toolbar-group-items.track-changes .rte-toolbar-button,
    .editora-toolbar-group-items.track-changes .editora-toolbar-button {
      border-right: 1px solid #ccc;
    }
    .rte-toolbar-group-items.track-changes .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.track-changes .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .rte-toolbar-group-items.track-changes,
    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .editora-toolbar-group-items.track-changes {
      border-color: #566275;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .rte-toolbar-group-items.track-changes .rte-toolbar-button,
    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .editora-toolbar-group-items.track-changes .editora-toolbar-button {
      border-right-color: #566275;
    }

    .rte-toolbar-button[data-command="toggleTrackChanges"].active,
    .editora-toolbar-button[data-command="toggleTrackChanges"].active {
      background-color: #ccc;
    }
  `,document.head.appendChild(e)}const er=(e={})=>{Nt(),ut(),O={...O,...e},Ct(),O.enabledByDefault&&typeof document<"u"&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:o=>window.setTimeout(o,0))(()=>{Array.from(document.querySelectorAll(R)).forEach(a=>{const l=ce(a,O);l.enabled?(ee(a,l),J(a,!0),Q(a,"toggleTrackChanges",!0)):D(a)})});const t=n=>{const o=rt(n);return o?(A=o,o):null},r=n=>{const o=t(n);if(!o)return null;const a=ce(o,e);return{editor:o,state:a}};return{name:"trackChanges",toolbar:[{label:"Track Changes",command:"toggleTrackChanges",type:"group",items:[{label:"Track Changes",command:"toggleTrackChanges",icon:'<svg width="24" height="24" focusable="false"><path d="M4 6h10a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h7a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h8a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm13.3-3.6 1.3 1.3 2.9-2.9a1 1 0 1 1 1.4 1.4l-3.6 3.6a1 1 0 0 1-1.4 0l-2-2a1 1 0 1 1 1.4-1.4Z"></path></svg>',shortcut:"Mod-Shift-t"},{label:"Accept All Changes",command:"acceptAllTrackChanges",icon:'<svg width="24" height="24" focusable="false"><path d="M9.2 16.2 5.8 12.8a1 1 0 1 1 1.4-1.4l2.1 2.1 7.5-7.5a1 1 0 1 1 1.4 1.4l-8.2 8.2a1 1 0 0 1-1.4 0Z"></path></svg>'},{label:"Reject All Changes",command:"rejectAllTrackChanges",icon:'<svg width="24" height="24" focusable="false"><path d="M7.8 7.8a1 1 0 0 1 1.4 0L12 10.6l2.8-2.8a1 1 0 1 1 1.4 1.4L13.4 12l2.8 2.8a1 1 0 1 1-1.4 1.4L12 13.4l-2.8 2.8a1 1 0 1 1-1.4-1.4l2.8-2.8-2.8-2.8a1 1 0 0 1 0-1.4Z"></path></svg>'}]}],commands:{toggleTrackChanges:(n,o)=>{const a=r(o);if(!a)return!1;const{editor:l,state:s}=a;return s.enabled=!s.enabled,s.enabled?ee(l,s):(Re(l),D(l),_e(l)),J(l,s.enabled),Q(l,"toggleTrackChanges",s.enabled),l.dispatchEvent(new CustomEvent("editora:track-changes-toggle",{bubbles:!0,detail:{enabled:s.enabled,author:s.author}})),s.enabled},acceptAllTrackChanges:(n,o)=>{const a=r(o);return a?X(a.editor,"accept","all"):!1},rejectAllTrackChanges:(n,o)=>{const a=r(o);return a?X(a.editor,"reject","all"):!1},acceptSelectedTrackChanges:(n,o)=>{const a=r(o);return a?X(a.editor,"accept","selection"):!1},rejectSelectedTrackChanges:(n,o)=>{const a=r(o);return a?X(a.editor,"reject","selection"):!1}},keymap:{"Mod-Shift-t":"toggleTrackChanges","Mod-Shift-T":"toggleTrackChanges"},destroy:()=>{Array.from(me).forEach(n=>Re(n))}}},y=".rte-content, .editora-content",le="[data-editora-editor], .rte-editor, .editora-editor, editora-editor",Ne="__editoraCommandEditorRoot",$e="rte-approval-workflow-styles",m="rte-approval-panel",k="approval",T="approvalWorkflow",b=':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)',$t={panelTitle:"Approval Workflow",panelAriaLabel:"Approval workflow panel",statusLabel:"Status",statusDraftText:"Draft",statusReviewText:"In Review",statusApprovedText:"Approved",requestReviewText:"Request Review",approveText:"Approve",reopenDraftText:"Reopen Draft",addCommentText:"Add Comment",actorLabel:"Actor",actorPlaceholder:"Reviewer name",commentLabel:"Comment",commentPlaceholder:"Add review note or sign-off context",closeText:"Close",commentsHeading:"Comments",signoffsHeading:"Sign-offs",noCommentsText:"No comments yet.",noSignoffsText:"No sign-offs yet.",summaryPrefix:"Workflow",lockedSuffix:"Locked",shortcutText:"Shortcuts: Ctrl/Cmd+Alt+Shift+A/R/P/D",approveCommentRequiredText:"Approval comment is required."},Dt={draft:"statusDraftText",review:"statusReviewText",approved:"statusApprovedText"},f=new WeakMap,te=new WeakMap,w=new Map,G=new WeakMap,j=new Set;let V=0,Ot=0,De=0,Oe=0,q=null,h=null,I=null,_=null,M=null;function p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ht(e){return e.replace(/\u00A0/g," ").replace(/\s+/g," ").trim()}function Fe(e){return e==="review"||e==="approved"?e:"draft"}function Z(e={}){return{defaultStatus:Fe(e.defaultStatus),lockOnApproval:e.lockOnApproval!==!1,maxHistoryEntries:Math.max(10,Math.min(500,Number(e.maxHistoryEntries??120))),requireCommentOnApprove:!!e.requireCommentOnApprove,defaultActor:(e.defaultActor||"system").trim()||"system",labels:{...$t,...e.labels||{}},normalizeText:e.normalizeText||Ht}}function ve(e){return e.closest(le)||e}function re(e){if(!e)return null;if(e.matches(y))return e;const t=e.querySelector(y);return t instanceof HTMLElement?t:null}function It(){if(typeof window>"u")return null;const e=window[Ne];if(!(e instanceof HTMLElement))return null;window[Ne]=null;const t=re(e);if(t)return t;const r=e.closest(le);if(r){const n=re(r);if(n)return n}return null}function _t(e){const t=e.closest("[data-editora-editor]");if(t&&re(t)===e)return t;let r=e;for(;r;){if(r.matches(le)&&(r===e||re(r)===e))return r;r=r.parentElement}return ve(e)}function U(e){return e?(e.getAttribute("data-theme")||e.getAttribute("theme")||"").toLowerCase()==="dark"?!0:e.classList.contains("dark")||e.classList.contains("editora-theme-dark")||e.classList.contains("rte-theme-dark"):!1}function qt(e){const t=ve(e);if(U(t))return!0;const r=t.closest("[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark");return U(r)?!0:U(document.documentElement)||U(document.body)}function ne(e,t){e.classList.remove("rte-approval-theme-dark"),qt(t)&&e.classList.add("rte-approval-theme-dark")}function Ge(e){return e?e.nodeType===Node.ELEMENT_NODE?e:e.parentElement:null}function x(e,t=!0){if(z(),(e==null?void 0:e.contentElement)instanceof HTMLElement)return e.contentElement;if((e==null?void 0:e.editorElement)instanceof HTMLElement){const a=e.editorElement;if(a.matches(y))return a;const l=a.querySelector(y);if(l instanceof HTMLElement)return l}const r=It();if(r)return r;const n=window.getSelection();if(n&&n.rangeCount>0){const a=Ge(n.getRangeAt(0).startContainer),l=a==null?void 0:a.closest(y);if(l)return l}const o=document.activeElement;if(o){if(o.matches(y))return o;const a=o.closest(y);if(a)return a}return h&&h.isConnected?h:(h&&!h.isConnected&&(h=null),t?document.querySelector(y):null)}function z(){Array.from(j).forEach(t=>{var r;t.isConnected||((r=w.get(t))==null||r.remove(),w.delete(t),G.delete(t),f.delete(t),te.delete(t),j.delete(t),h===t&&(h=null))})}function Pt(e){return e?!!(e.closest(`.${m}`)||e.closest(y)||e.closest(le)):!1}function Bt(){const e=window.getSelection();if(!e||e.rangeCount===0)return!1;const t=e.getRangeAt(0).startContainer,r=Ge(t);return!!(r!=null&&r.closest(y))}function H(e,t,r){const n=_t(e);Array.from(n.querySelectorAll(`.rte-toolbar-button[data-command="${t}"], .editora-toolbar-button[data-command="${t}"]`)).forEach(a=>{a.classList.toggle("active",r),a.setAttribute("aria-pressed",r?"true":"false"),a.setAttribute("data-active",r?"true":"false")})}function Xe(e,t,r){t!==null?e.setAttribute("contenteditable",t):e.setAttribute("contenteditable","true"),r!==null?e.setAttribute("data-readonly",r):e.removeAttribute("data-readonly")}function ke(e){e.dispatchEvent(new Event("input",{bubbles:!0}))}function Ee(e,t){if(t===e.innerHTML)return;const r=window.execEditorCommand||window.executeEditorCommand;if(typeof r=="function")try{r("recordDomTransaction",e,t,e.innerHTML)}catch{}}function xe(){return De+=1,`approval-comment-${Date.now().toString(36)}-${De.toString(36)}`}function Wt(){return Oe+=1,`approval-signoff-${Date.now().toString(36)}-${Oe.toString(36)}`}function Ve(e){return{status:e.status,locked:e.locked,comments:e.comments.map(t=>({...t})),signoffs:e.signoffs.map(t=>({...t})),updatedAt:e.updatedAt}}function zt(e,t){const r=Dt[e];return t.labels[r]||e}function Ue(e,t,r){if(e.setAttribute("data-approval-status",t.status),e.setAttribute("data-approval-locked",t.locked?"true":"false"),e.classList.toggle("rte-approval-locked-editor",t.locked),H(e,"toggleApprovalWorkflowPanel",Ae(e)),H(e,"requestApprovalReview",t.status==="review"),H(e,"approveDocument",t.status==="approved"),H(e,"reopenDraft",t.status==="draft"),t.status==="approved"&&r.lockOnApproval){t.locked||(t.preApprovalContentEditable=e.getAttribute("contenteditable"),t.preApprovalReadonly=e.getAttribute("data-readonly")),e.setAttribute("contenteditable","false"),e.setAttribute("data-readonly","true"),t.locked=!0;return}t.locked=!1,Xe(e,t.preApprovalContentEditable??t.originalContentEditable,t.preApprovalReadonly??t.originalReadonly),t.preApprovalContentEditable=null,t.preApprovalReadonly=null}function g(e,t){let r=te.get(e);return r||(r={status:t.defaultStatus,locked:!1,comments:[],signoffs:[],updatedAt:new Date().toISOString(),originalContentEditable:e.getAttribute("contenteditable"),originalReadonly:e.getAttribute("data-readonly"),preApprovalContentEditable:null,preApprovalReadonly:null},te.set(e,r),j.add(e),Ue(e,r,t),r)}function oe(e,t){return e.length<=t?e:e.slice(e.length-t)}function W(e,t){const r=e.querySelector(".rte-approval-live");r&&(r.textContent=t)}function jt(e,t){const r=Ve(t);e.__approvalWorkflowState=r,e.dispatchEvent(new CustomEvent("editora:approval-state-changed",{bubbles:!0,detail:{state:r}}))}function K(e){const t=w.get(e);if(!t)return;const r=f.get(e)||q;if(!r)return;const n=g(e,r),o=t.querySelector(".rte-approval-summary"),a=t.querySelector('[data-action="request-review"]'),l=t.querySelector('[data-action="approve"]'),s=t.querySelector('[data-action="reopen-draft"]'),c=t.querySelector(".rte-approval-comments-list"),u=t.querySelector(".rte-approval-signoffs-list");if(o){const i=zt(n.status,r);o.textContent=`${r.labels.summaryPrefix}: ${i} | Comments: ${n.comments.length} | Sign-offs: ${n.signoffs.length}${n.locked?` | ${r.labels.lockedSuffix}`:""}`}a&&(a.disabled=n.status!=="draft"),l&&(l.disabled=n.status==="approved"),s&&(s.disabled=n.status==="draft"),c&&(n.comments.length===0?c.innerHTML=`<li class="rte-approval-empty">${p(r.labels.noCommentsText)}</li>`:c.innerHTML=n.comments.slice().reverse().map(i=>`
            <li class="rte-approval-item rte-approval-item-${i.kind}" role="listitem">
              <div class="rte-approval-item-head">
                <span class="rte-approval-item-author">${p(i.author)}</span>
                <time class="rte-approval-item-time" datetime="${p(i.createdAt)}">${p(new Date(i.createdAt).toLocaleString())}</time>
              </div>
              <p class="rte-approval-item-message">${p(i.message)}</p>
            </li>
          `).join("")),u&&(n.signoffs.length===0?u.innerHTML=`<li class="rte-approval-empty">${p(r.labels.noSignoffsText)}</li>`:u.innerHTML=n.signoffs.slice().reverse().map(i=>`
            <li class="rte-approval-item" role="listitem">
              <div class="rte-approval-item-head">
                <span class="rte-approval-item-author">${p(i.author)}</span>
                <time class="rte-approval-item-time" datetime="${p(i.createdAt)}">${p(new Date(i.createdAt).toLocaleString())}</time>
              </div>
              <p class="rte-approval-item-message">${p(i.comment||"Approved")}</p>
            </li>
          `).join(""))}function se(e,t,r){t.updatedAt=new Date().toISOString(),Ue(e,t,r),K(e),jt(e,t)}function He(e,t,r,n){e.comments.push({id:xe(),author:r||t.defaultActor,message:n,kind:"system",createdAt:new Date().toISOString()}),e.comments=oe(e.comments,t.maxHistoryEntries)}function $(e,t,r,n){const o=g(e,r);if(o.status===t)return!1;const a=e.innerHTML;return o.status=t,t==="review"?He(o,r,n,"Review requested."):t==="draft"&&He(o,r,n,"Returned to draft."),se(e,o,r),ke(e),Ee(e,a),!0}function Ze(e,t,r,n){const o=n.normalizeText(t);if(!o)return!1;const a=n.normalizeText(r)||n.defaultActor,l=g(e,n),s=e.innerHTML;return l.comments.push({id:xe(),author:a,message:o,kind:"comment",createdAt:new Date().toISOString()}),l.comments=oe(l.comments,n.maxHistoryEntries),se(e,l,n),ke(e),Ee(e,s),!0}function ye(e,t,r,n){const o=t.normalizeText(r)||t.defaultActor,a=t.normalizeText(n);if(t.requireCommentOnApprove&&!a)return!1;const l=g(e,t),s=e.innerHTML;return l.status="approved",l.signoffs.push({id:Wt(),author:o,comment:a||void 0,createdAt:new Date().toISOString()}),l.signoffs=oe(l.signoffs,t.maxHistoryEntries),a&&(l.comments.push({id:xe(),author:o,message:a,kind:"system",createdAt:new Date().toISOString()}),l.comments=oe(l.comments,t.maxHistoryEntries)),se(e,l,t),ke(e),Ee(e,s),!0}function ae(e,t){return e.querySelector(`[data-field="${t}"]`)}function Kt(e){var n,o;const t=((n=ae(e,"actor"))==null?void 0:n.value)||"",r=((o=ae(e,"comment"))==null?void 0:o.value)||"";return{actor:t,comment:r}}function fe(e,t){if(!t.classList.contains("show"))return;const n=ve(e).getBoundingClientRect(),o=Math.min(window.innerWidth-20,420),a=Math.max(10,window.innerWidth-o-10),l=Math.min(Math.max(10,n.right-o),a),s=Math.max(10,Math.min(window.innerHeight-10-280,n.top+12));t.style.width=`${o}px`,t.style.left=`${l}px`,t.style.top=`${s}px`,t.style.maxHeight=`${Math.max(280,window.innerHeight-24)}px`}function Ft(e){const t=w.get(e);if(t)return t;const r=f.get(e)||q||Z(),n=`rte-approval-panel-${Ot++}`,o=document.createElement("section");return o.className=m,o.id=n,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","false"),o.setAttribute("aria-label",r.labels.panelAriaLabel),o.setAttribute("tabindex","-1"),o.innerHTML=`
    <header class="rte-approval-header">
      <h2 class="rte-approval-title">${p(r.labels.panelTitle)}</h2>
      <button type="button" class="rte-approval-icon-btn" data-action="close" aria-label="${p(r.labels.closeText)}">✕</button>
    </header>
    <div class="rte-approval-body">
      <p class="rte-approval-summary" aria-live="polite"></p>

      <div class="rte-approval-controls" role="toolbar" aria-label="Approval actions">
        <button type="button" class="rte-approval-btn" data-action="request-review">${p(r.labels.requestReviewText)}</button>
        <button type="button" class="rte-approval-btn rte-approval-btn-primary" data-action="approve">${p(r.labels.approveText)}</button>
        <button type="button" class="rte-approval-btn" data-action="reopen-draft">${p(r.labels.reopenDraftText)}</button>
      </div>

      <div class="rte-approval-form">
        <label class="rte-approval-label">
          ${p(r.labels.actorLabel)}
          <input type="text" data-field="actor" class="rte-approval-field" autocomplete="off" placeholder="${p(r.labels.actorPlaceholder)}" />
        </label>
        <label class="rte-approval-label">
          ${p(r.labels.commentLabel)}
          <textarea data-field="comment" class="rte-approval-field" rows="2" placeholder="${p(r.labels.commentPlaceholder)}"></textarea>
        </label>
        <button type="button" class="rte-approval-btn" data-action="add-comment">${p(r.labels.addCommentText)}</button>
      </div>

      <section class="rte-approval-section" aria-label="${p(r.labels.commentsHeading)}">
        <h3 class="rte-approval-section-title">${p(r.labels.commentsHeading)}</h3>
        <ul class="rte-approval-comments-list" role="list"></ul>
      </section>

      <section class="rte-approval-section" aria-label="${p(r.labels.signoffsHeading)}">
        <h3 class="rte-approval-section-title">${p(r.labels.signoffsHeading)}</h3>
        <ul class="rte-approval-signoffs-list" role="list"></ul>
      </section>

      <p class="rte-approval-shortcut">${p(r.labels.shortcutText)}</p>
      <span class="rte-approval-live" aria-live="polite"></span>
    </div>
  `,o.addEventListener("click",a=>{const l=a.target;if(!l)return;const s=l.closest("[data-action]");if(!s)return;const c=s.getAttribute("data-action")||"",u=f.get(e)||q||r;if(f.set(e,u),g(e,u),c==="close"){F(e,!0);return}const i=Kt(o);if(c==="request-review"){$(e,"review",u,i.actor||u.defaultActor)&&W(o,"Status changed to review.");return}if(c==="reopen-draft"){$(e,"draft",u,i.actor||u.defaultActor)&&W(o,"Status changed to draft.");return}if(c==="approve"){const d=ye(e,u,i.actor,i.comment);if(!d&&u.requireCommentOnApprove){W(o,u.labels.approveCommentRequiredText);return}if(d){const L=ae(o,"comment");L&&(L.value=""),W(o,"Document approved and signed off.")}return}if(c==="add-comment"){if(!Ze(e,i.comment,i.actor,u))return;const L=ae(o,"comment");L&&(L.value=""),W(o,"Comment added.");return}}),o.addEventListener("keydown",a=>{a.key==="Escape"&&(a.preventDefault(),F(e,!0))}),ne(o,e),document.body.appendChild(o),w.set(e,o),G.set(e,!1),K(e),o}function Ae(e){return G.get(e)===!0}function C(e){z();const t=Ft(e);w.forEach((r,n)=>{n!==e&&F(n,!1)}),t.classList.add("show"),G.set(e,!0),H(e,"toggleApprovalWorkflowPanel",!0),ne(t,e),fe(e,t),K(e)}function F(e,t=!1){const r=w.get(e);r&&(r.classList.remove("show"),G.set(e,!1),H(e,"toggleApprovalWorkflowPanel",!1),t&&e.focus({preventScroll:!0}))}function Ye(e,t){const r=Ae(e);return(typeof t=="boolean"?t:!r)?C(e):F(e),!0}function Gt(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="a"}function Xt(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="r"}function Vt(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="p"}function Ut(e){const t=e.key.toLowerCase();return(e.metaKey||e.ctrlKey)&&e.altKey&&e.shiftKey&&t==="d"}function Zt(e){q=e,I||(I=t=>{z();const r=t.target,n=r==null?void 0:r.closest(y);if(!n)return;h=n;const o=f.get(n)||e;f.set(n,o),g(n,o);const a=w.get(n);a&&(ne(a,n),fe(n,a))},document.addEventListener("focusin",I,!0)),_||(_=t=>{if(t.defaultPrevented)return;const r=Gt(t),n=Xt(t),o=Vt(t),a=Ut(t),l=t.key==="Escape";if(!l&&!r&&!n&&!o&&!a)return;z();const s=t.target,c=!!(s!=null&&s.closest(`.${m} input, .${m} textarea, .${m} select`));if(!Pt(s)&&!Bt())return;const i=x(void 0,!1);if(!i)return;const d=f.get(i)||q||e;f.set(i,d);const L=g(i,d);if(h=i,l&&Ae(i)){t.preventDefault(),F(i,!0);return}if(!c){if(r){t.preventDefault(),t.stopPropagation(),Ye(i);return}if(n){t.preventDefault(),t.stopPropagation(),$(i,"review",d,d.defaultActor)&&C(i);return}if(o){t.preventDefault(),t.stopPropagation(),ye(i,d,d.defaultActor,"Approved via keyboard shortcut.")&&C(i);return}a&&(t.preventDefault(),t.stopPropagation(),L.status!=="draft"&&$(i,"draft",d,d.defaultActor)&&C(i))}},document.addEventListener("keydown",_,!0)),M||(M=()=>{z(),w.forEach((t,r)=>{!r.isConnected||!t.isConnected||(ne(t,r),fe(r,t))})},window.addEventListener("scroll",M,!0),window.addEventListener("resize",M))}function Yt(e){const t=te.get(e);t&&(e.classList.remove("rte-approval-locked-editor"),e.removeAttribute("data-approval-status"),e.removeAttribute("data-approval-locked"),Xe(e,t.preApprovalContentEditable??t.originalContentEditable,t.preApprovalReadonly??t.originalReadonly))}function Jt(){I&&(document.removeEventListener("focusin",I,!0),I=null),_&&(document.removeEventListener("keydown",_,!0),_=null),M&&(window.removeEventListener("scroll",M,!0),window.removeEventListener("resize",M),M=null),w.forEach(e=>e.remove()),w.clear(),j.forEach(e=>Yt(e)),j.clear(),q=null,h=null}function Qt(){if(typeof document>"u"||document.getElementById($e))return;const e=document.createElement("style");e.id=$e,e.textContent=`
    .rte-toolbar-group-items.${k},
    .editora-toolbar-group-items.${k},
    .rte-toolbar-group-items.${T},
    .editora-toolbar-group-items.${T} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${k} .rte-toolbar-button,
    .editora-toolbar-group-items.${k} .editora-toolbar-button,
    .rte-toolbar-group-items.${T} .rte-toolbar-button,
    .editora-toolbar-group-items.${T} .editora-toolbar-button {
      border: none;
      border-radius: 0;
      border-right: 1px solid #ccc;
    }

    .rte-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    .editora-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    .rte-toolbar-button[data-command="reopenDraft"].active,
    .editora-toolbar-button[data-command="reopenDraft"].active {
      background-color: #ccc;
    }

    ${b} .rte-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    ${b} .editora-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    ${b} .rte-toolbar-button[data-command="reopenDraft"].active,
    ${b} .editora-toolbar-button[data-command="reopenDraft"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }

    .rte-toolbar-group-items.${k} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${k} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${T} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${T} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${b} .rte-toolbar-group-items.${k},
    ${b} .editora-toolbar-group-items.${k},
    ${b} .rte-toolbar-group-items.${T},
    ${b} .editora-toolbar-group-items.${T},
    .${m}.rte-approval-theme-dark {
      border-color: #566275;
    }
    ${b} .rte-toolbar-group-items.${k} .rte-toolbar-button svg,
    ${b} .editora-toolbar-group-items.${k} .editora-toolbar-button svg,
    ${b} .rte-toolbar-group-items.${T} .rte-toolbar-button svg,
    ${b} .editora-toolbar-group-items.${T} .editora-toolbar-button svg
    {
      fill: none;
    }

    ${b} .rte-toolbar-group-items.${k} .rte-toolbar-button,
    ${b} .editora-toolbar-group-items.${k} .editora-toolbar-button
    {
      border-color: #566275;
    }

    .rte-approval-locked-editor {
      background-image: repeating-linear-gradient(
        -45deg,
        rgba(30, 64, 175, 0.04),
        rgba(30, 64, 175, 0.04) 8px,
        rgba(30, 64, 175, 0.08) 8px,
        rgba(30, 64, 175, 0.08) 16px
      );
    }

    .${m} {
      position: fixed;
      z-index: 1500;
      right: 16px;
      top: 16px;
      width: min(420px, calc(100vw - 20px));
      max-height: calc(100vh - 24px);
      display: none;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);
      overflow: hidden;
    }

    .${m}.show {
      display: flex;
    }

    .${m}.rte-approval-theme-dark {
      background: #0f172a;
      color: #e2e8f0;
      border-color: #334155;
      box-shadow: 0 20px 40px rgba(2, 6, 23, 0.5);
    }

    .rte-approval-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .${m}.rte-approval-theme-dark .rte-approval-header {
      border-bottom-color: #334155;
      background: #111827;
    }

    .rte-approval-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    .rte-approval-icon-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      cursor: pointer;
      min-width: 34px;
      min-height: 34px;
      width: 34px;
      height: 34px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
    }

    .rte-approval-icon-btn:hover,
    .rte-approval-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${m}.rte-approval-theme-dark .rte-approval-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${m}.rte-approval-theme-dark .rte-approval-icon-btn:hover,
    .${m}.rte-approval-theme-dark .rte-approval-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-approval-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-approval-summary {
      margin: 0;
      font-size: 12px;
      color: #475569;
    }

    .${m}.rte-approval-theme-dark .rte-approval-summary {
      color: #94a3b8;
    }

    .rte-approval-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .rte-approval-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-approval-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rte-approval-btn:hover:not(:disabled),
    .rte-approval-btn:focus-visible:not(:disabled) {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .rte-approval-btn-primary {
      background: #1d4ed8;
      border-color: #1d4ed8;
      color: #ffffff;
    }

    .rte-approval-btn-primary:hover:not(:disabled),
    .rte-approval-btn-primary:focus-visible:not(:disabled) {
      background: #1e40af;
      border-color: #1e40af;
    }

    .${m}.rte-approval-theme-dark .rte-approval-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${m}.rte-approval-theme-dark .rte-approval-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-approval-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${m}.rte-approval-theme-dark .rte-approval-form {
      border-color: #334155;
    }

    .rte-approval-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .rte-approval-field {
      width: 100%;
      box-sizing: border-box;
      min-height: 30px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      font-size: 13px;
      padding: 6px 8px;
    }

    .rte-approval-field:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .${m}.rte-approval-theme-dark .rte-approval-field {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-approval-section {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${m}.rte-approval-theme-dark .rte-approval-section {
      border-color: #334155;
    }

    .rte-approval-section-title {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .rte-approval-comments-list,
    .rte-approval-signoffs-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 150px;
      overflow: auto;
    }

    .rte-approval-item {
      border: 1px solid #dbeafe;
      background: #eff6ff;
      border-radius: 8px;
      padding: 6px;
    }

    .rte-approval-item-comment {
      border-color: #e2e8f0;
      background: #f8fafc;
    }

    .${m}.rte-approval-theme-dark .rte-approval-item {
      border-color: #334155;
      background: #111827;
    }

    .rte-approval-item-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
    }

    .rte-approval-item-author {
      font-size: 12px;
      font-weight: 700;
    }

    .rte-approval-item-time {
      font-size: 11px;
      color: #64748b;
    }

    .${m}.rte-approval-theme-dark .rte-approval-item-time {
      color: #94a3b8;
    }

    .rte-approval-item-message {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      white-space: pre-wrap;
    }

    .rte-approval-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .${m}.rte-approval-theme-dark .rte-approval-empty {
      border-color: #334155;
      color: #94a3b8;
    }

    .rte-approval-shortcut {
      margin: 0;
      font-size: 11px;
      color: #64748b;
    }

    .${m}.rte-approval-theme-dark .rte-approval-shortcut {
      color: #94a3b8;
    }

    .rte-approval-live {
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
      .${m} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }
    }
  `,document.head.appendChild(e)}const tr=(e={})=>{const t=Z(e);return Qt(),{name:"approvalWorkflow",toolbar:[{id:"approvalWorkflowGroup",label:"Approval",type:"group",command:"approvalWorkflow",items:[{id:"approvalWorkflow",label:"Approval Workflow",command:"toggleApprovalWorkflowPanel",shortcut:"Mod-Alt-Shift-a",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m16.5 16 1.8 1.8 3.2-3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'},{id:"approvalRequestReview",label:"Request Review",command:"requestApprovalReview",shortcut:"Mod-Alt-Shift-r",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="M11 8v3l2 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.5 17.5 20 20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'},{id:"approvalApprove",label:"Approve",command:"approveDocument",shortcut:"Mod-Alt-Shift-p",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="3.8" y="3.8" width="16.4" height="16.4" rx="3" stroke="currentColor" stroke-width="1.4"/></svg>'},{id:"approvalReopen",label:"Reopen Draft",command:"reopenDraft",shortcut:"Mod-Alt-Shift-d",icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8 8H4v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M5 12a7 7 0 1 0 2-4.95" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'}]}],commands:{approvalWorkflow:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;return f.set(o,a),g(o,a),h=o,C(o),K(o),!0},toggleApprovalWorkflowPanel:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;return f.set(o,a),g(o,a),h=o,Ye(o,typeof r=="boolean"?r:void 0)},requestApprovalReview:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;f.set(o,a),g(o,a);const l=$(o,"review",a,a.defaultActor);return C(o),l},approveDocument:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;f.set(o,a),g(o,a);const l=typeof r=="object"&&r?String(r.author||""):a.defaultActor,s=typeof r=="object"&&r?String(r.comment||""):typeof r=="string"?r:"",c=ye(o,a,l,s);return c&&C(o),c},reopenDraft:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;f.set(o,a),g(o,a);const l=$(o,"draft",a,a.defaultActor);return l&&C(o),l},addApprovalComment:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;f.set(o,a),g(o,a);const l=typeof r=="object"&&r?String(r.author||""):a.defaultActor,s=typeof r=="object"&&r?String(r.message||""):typeof r=="string"?r:"",c=Ze(o,s,l,a);return c&&C(o),c},setApprovalStatus:(r,n)=>{const o=x(n);if(!o||!r)return!1;const a=Fe(r),l=f.get(o)||t;f.set(o,l),g(o,l);const s=$(o,a,l,l.defaultActor);return s&&C(o),s},setApprovalWorkflowOptions:(r,n)=>{const o=x(n);if(!o||!r||typeof r!="object")return!1;const a=f.get(o)||t,l=Z({...a,...r,labels:{...a.labels,...r.labels||{}},normalizeText:r.normalizeText||a.normalizeText});f.set(o,l);const s=g(o,l);return se(o,s,l),!0},getApprovalWorkflowState:(r,n)=>{const o=x(n);if(!o)return!1;const a=f.get(o)||t;f.set(o,a);const l=g(o,a),s=Ve(l);if(typeof r=="function")try{r(s)}catch{}return o.__approvalWorkflowState=s,o.dispatchEvent(new CustomEvent("editora:approval-state",{bubbles:!0,detail:{state:s}})),!0}},keymap:{"Mod-Alt-Shift-a":"toggleApprovalWorkflowPanel","Mod-Alt-Shift-A":"toggleApprovalWorkflowPanel","Mod-Alt-Shift-r":"requestApprovalReview","Mod-Alt-Shift-R":"requestApprovalReview","Mod-Alt-Shift-p":"approveDocument","Mod-Alt-Shift-P":"approveDocument","Mod-Alt-Shift-d":"reopenDraft","Mod-Alt-Shift-D":"reopenDraft"},init:function(n){V+=1;const o=this&&typeof this.__pluginConfig=="object"?Z({...t,...this.__pluginConfig}):t;Zt(o);const a=x(n!=null&&n.editorElement?{editorElement:n.editorElement}:void 0,!1);a&&(f.set(a,o),g(a,o),h=a,K(a))},destroy:()=>{V=Math.max(0,V-1),!(V>0)&&Jt()}}};export{tr as A,er as T};
