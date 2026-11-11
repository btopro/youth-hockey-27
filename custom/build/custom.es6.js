import{DDDSuper as _t}from"@haxtheweb/d-d-d/d-d-d.js";import"@haxtheweb/rpg-character/rpg-character.js";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oe=globalThis,_e=oe.ShadowRoot&&(oe.ShadyCSS===void 0||oe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Se=Symbol(),Ye=new WeakMap;let We=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(_e&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Ye.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ye.set(t,e))}return e}toString(){return this.cssText}};const St=r=>new We(typeof r=="string"?r:r+"",void 0,Se),jt=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new We(t,r,Se)},Mt=(r,e)=>{if(_e)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),i=oe.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},qe=_e?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return St(t)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Tt,defineProperty:Et,getOwnPropertyDescriptor:At,getOwnPropertyNames:Ct,getOwnPropertySymbols:Rt,getPrototypeOf:It}=Object,G=globalThis,Ve=G.trustedTypes,Pt=Ve?Ve.emptyScript:"",Ot=G.reactiveElementPolyfillSupport,ee=(r,e)=>r,je={toAttribute(r,e){switch(e){case Boolean:r=r?Pt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Ke=(r,e)=>!Tt(r,e),Je={attribute:!0,type:String,converter:je,reflect:!1,useDefault:!1,hasChanged:Ke};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);let q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Je){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Et(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=At(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){const o=i?.call(this);a?.call(this,n),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Je}static _$Ei(){if(this.hasOwnProperty(ee("elementProperties")))return;const e=It(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ee("properties"))){const t=this.properties,s=[...Ct(t),...Rt(t)];for(const i of s)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(qe(i))}else e!==void 0&&t.push(qe(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:je).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:je;this._$Em=i;const o=n.fromAttribute(t,a.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){const n=this.constructor;if(i===!1&&(a=this[e]),s??(s=n.getPropertyOptions(e)),!((s.hasChanged??Ke)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),a!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:n}=a,o=this[i];n!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,a,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[ee("elementProperties")]=new Map,q[ee("finalized")]=new Map,Ot?.({ReactiveElement:q}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const te=globalThis,Xe=r=>r,he=te.trustedTypes,Ze=he?he.createPolicy("lit-html",{createHTML:r=>r}):void 0,Qe="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,et="?"+N,Lt=`<${et}>`,F=document,se=()=>F.createComment(""),ie=r=>r===null||typeof r!="object"&&typeof r!="function",Me=Array.isArray,zt=r=>Me(r)||typeof r?.[Symbol.iterator]=="function",Te=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,tt=/-->/g,st=/>/g,H=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),it=/'/g,at=/"/g,nt=/^(?:script|style|textarea|title)$/i,Dt=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),y=Dt(1),V=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),rt=new WeakMap,Y=F.createTreeWalker(F,129);function ot(r,e){if(!Me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(e):e}const Gt=(r,e)=>{const t=r.length-1,s=[];let i,a=e===2?"<svg>":e===3?"<math>":"",n=ae;for(let o=0;o<t;o++){const h=r[o];let l,c,d=-1,u=0;for(;u<h.length&&(n.lastIndex=u,c=n.exec(h),c!==null);)u=n.lastIndex,n===ae?c[1]==="!--"?n=tt:c[1]!==void 0?n=st:c[2]!==void 0?(nt.test(c[2])&&(i=RegExp("</"+c[2],"g")),n=H):c[3]!==void 0&&(n=H):n===H?c[0]===">"?(n=i??ae,d=-1):c[1]===void 0?d=-2:(d=n.lastIndex-c[2].length,l=c[1],n=c[3]===void 0?H:c[3]==='"'?at:it):n===at||n===it?n=H:n===tt||n===st?n=ae:(n=H,i=void 0);const p=n===H&&r[o+1].startsWith("/>")?" ":"";a+=n===ae?h+Lt:d>=0?(s.push(l),h.slice(0,d)+Qe+h.slice(d)+N+p):h+N+(d===-2?o:p)}return[ot(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};let Ee=class kt{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,n=0;const o=e.length-1,h=this.parts,[l,c]=Gt(e,t);if(this.el=kt.createElement(l,s),Y.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=Y.nextNode())!==null&&h.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Qe)){const u=c[n++],p=i.getAttribute(d).split(N),f=/([.?@])?(.*)/.exec(u);h.push({type:1,index:a,name:f[2],strings:p,ctor:f[1]==="."?Ut:f[1]==="?"?Bt:f[1]==="@"?Ft:le}),i.removeAttribute(d)}else d.startsWith(N)&&(h.push({type:6,index:a}),i.removeAttribute(d));if(nt.test(i.tagName)){const d=i.textContent.split(N),u=d.length-1;if(u>0){i.textContent=he?he.emptyScript:"";for(let p=0;p<u;p++)i.append(d[p],se()),Y.nextNode(),h.push({type:2,index:++a});i.append(d[u],se())}}}else if(i.nodeType===8)if(i.data===et)h.push({type:2,index:a});else{let d=-1;for(;(d=i.data.indexOf(N,d+1))!==-1;)h.push({type:7,index:a}),d+=N.length-1}a++}}static createElement(e,t){const s=F.createElement("template");return s.innerHTML=e,s}};function K(r,e,t=r,s){if(e===V)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl;const a=ie(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=K(r,i._$AS(r,e.values),i,s)),e}let Nt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??F).importNode(t,!0);Y.currentNode=i;let a=Y.nextNode(),n=0,o=0,h=s[0];for(;h!==void 0;){if(n===h.index){let l;h.type===2?l=new Ae(a,a.nextSibling,this,e):h.type===1?l=new h.ctor(a,h.name,h.strings,this,e):h.type===6&&(l=new Ht(a,this,e)),this._$AV.push(l),h=s[++o]}n!==h?.index&&(a=Y.nextNode(),n++)}return Y.currentNode=F,i}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},Ae=class $t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),ie(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==V&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):zt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&ie(this._$AH)?this._$AA.nextSibling.data=e:this.T(F.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Ee.createElement(ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const a=new Nt(i,this),n=a.u(this.options);a.p(t),this.T(n),this._$AH=a}}_$AC(e){let t=rt.get(e.strings);return t===void 0&&rt.set(e.strings,t=new Ee(e)),t}k(e){Me(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new $t(this.O(se()),this.O(se()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const s=Xe(e).nextSibling;Xe(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},le=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,t=this,s,i){const a=this.strings;let n=!1;if(a===void 0)e=K(this,e,t,0),n=!ie(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const o=e;let h,l;for(e=a[0],h=0;h<a.length-1;h++)l=K(this,o[s+h],t,h),l===V&&(l=this._$AH[h]),n||(n=!ie(l)||l!==this._$AH[h]),l===v?e=v:e!==v&&(e+=(l??"")+a[h+1]),this._$AH[h]=l}n&&!i&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ut=class extends le{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}};class Bt extends le{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}}let Ft=class extends le{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??v)===V)return;const s=this._$AH,i=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ht=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}};const Yt=te.litHtmlPolyfillSupport;Yt?.(Ee,Ae),(te.litHtmlVersions??(te.litHtmlVersions=[])).push("3.3.3");const Wt=(r,e,t)=>{const s=t?.renderBefore??e;let i=s._$litPart$;if(i===void 0){const a=t?.renderBefore??null;s._$litPart$=i=new Ae(e.insertBefore(se(),a),a,void 0,t??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ne=globalThis;let re=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};re._$litElement$=!0,re.finalized=!0,ne.litElementHydrateSupport?.({LitElement:re});const qt=ne.litElementPolyfillSupport;qt?.({LitElement:re}),(ne.litElementVersions??(ne.litElementVersions=[])).push("4.2.2");/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const ce={third:{id:"third",label:"\u2153 ice (cross-ice)",width:66,length:85,goalLine:8,cornerRadius:12,blueLines:null,centerLine:!1},half:{id:"half",label:"\xBD ice",width:85,length:100,goalLine:10,cornerRadius:20,blueLines:null,centerLine:!0},full:{id:"full",label:"Full ice",width:85,length:200,goalLine:11,cornerRadius:28,blueLines:75,centerLine:!0},roller:{id:"roller",label:"Roller rink",width:85,length:185,goalLine:12,cornerRadius:26,blueLines:null,centerLine:!0}},ht={small:{width:4,depth:3},regulation:{width:6,depth:3.5}},de=[{id:"8U",label:"8U",ageIndex:0,surface:"third",skaters:3,net:"small",offsides:!1,icing:!1,checking:!1,buzzer:90,keepScore:!1,periodSeconds:120,periodMinutes:10,speed:.55,ai:.35,saveBase:.45,fights:!1,blurb:"Cross-ice, 3 on 3. More puck touches, more shots, more fun. No scoreboard: parents wave dollar bills instead."},{id:"10U",label:"10U",ageIndex:1,surface:"half",skaters:4,net:"small",offsides:!1,icing:!1,checking:!1,buzzer:90,keepScore:!1,periodSeconds:150,periodMinutes:12,speed:.65,ai:.45,saveBase:.5,fights:!1,blurb:"Half ice, 4 on 4. Small spaces build quick hands and quick decisions."},{id:"12U",label:"12U",ageIndex:2,surface:"half",skaters:3,net:"regulation",offsides:!1,icing:!1,checking:!1,buzzer:120,keepScore:!0,periodSeconds:180,periodMinutes:12,speed:.75,ai:.55,saveBase:.68,fights:!1,blurb:"Half ice, 3 on 3, and the scoreboard turns on."},{id:"14U",label:"14U",ageIndex:3,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:210,periodMinutes:15,speed:.85,ai:.65,saveBase:.7,fights:!1,blurb:"Full ice, 5 on 5, offsides and icing, and body checking begins."},{id:"16U",label:"16U",ageIndex:4,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:240,periodMinutes:15,speed:.92,ai:.75,saveBase:.72,fights:!1,blurb:"Faster, stronger, and the late bloomers are catching up."},{id:"18U",label:"18U",ageIndex:5,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:270,periodMinutes:17,speed:1,ai:.85,saveBase:.74,fights:!1,blurb:"Top speed. Look who the best players are now."},{id:"beer",label:"AAA & Beer League",ageIndex:5,surface:"full",skaters:5,net:"regulation",offsides:!0,icing:!0,checking:!0,buzzer:0,keepScore:!0,periodSeconds:270,periodMinutes:15,speed:.95,ai:.7,saveBase:.68,fights:!0,blurb:"Constant fights. Every fighter gets tossed until somebody runs out of players."}],J=r=>de.find(e=>e.id===r)||de[0],lt={standard:{id:"standard",label:"Standard",penalties:!0},jay:{id:"jay",label:"Jay mode (no penalties)",penalties:!1}},Ce=(r,e={})=>{const t=J(r),s=!!e.roller,i=ce[s?"roller":t.surface],a=lt[e.ruleset]||lt.standard,n=typeof e.strictness=="number"?Math.max(0,Math.min(1,e.strictness)):.5;return{level:t,levelId:t.id,ageIndex:t.ageIndex,roller:s,surface:i,net:ht[s?"regulation":t.net],skaters:s?4:t.skaters,offsides:s?!1:t.offsides&&!!i.blueLines,icing:s?!1:t.icing,checking:s?!1:t.checking,buzzer:t.buzzer,keepScore:t.keepScore,periods:3,periodSeconds:t.periodSeconds,periodMinutes:t.periodMinutes,minorSeconds:2/t.periodMinutes*t.periodSeconds,speed:t.speed,ai:t.ai,saveBase:t.saveBase,fights:t.fights,ruleset:a.id,penalties:a.penalties,strictness:n,faceoffs:i.id==="full"||i.id==="roller",needWinner:!!e.needWinner}};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const Vt=r=>{let e=2166136261;for(let t=0;t<r.length;t++)e^=r.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0},Re=r=>{let e=(typeof r=="string"?Vt(r):r>>>0)||1;const t=()=>{e=e+1831565813|0;let s=Math.imul(e^e>>>15,1|e);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296};return{next:t,range:(s,i)=>s+(i-s)*t(),int:(s,i)=>Math.floor(s+(i-s+1)*t()),chance:s=>t()<s,pick:s=>s[Math.floor(t()*s.length)],weighted:s=>{const i=s.reduce((n,o)=>n+o.weight,0);let a=t()*i;for(const n of s)if(a-=n.weight,a<=0)return n;return s[s.length-1]},shuffle:s=>{const i=s.slice();for(let a=i.length-1;a>0;a--){const n=Math.floor(t()*(a+1)),o=i[a];i[a]=i[n],i[n]=o}return i}}},Kt=["#f7dece","#f3d2a2","#d5ab88","#af7e57","#7c533e"],U=[{id:"sparkle-selects",name:"AAAA Sparkle Selects",short:"SPK",crest:"sparkle-selects",kits:{home:{jersey:"#ff3fa4",trim:"#ffde46",stripe:"#2e80ff",number:"#111111",helmet:"#ff3fa4",pants:"#111111"},away:{jersey:"#f4f7fc",trim:"#ff3fa4",stripe:"#ffde46",number:"#ff3fa4",helmet:"#ff3fa4",pants:"#111111"}}},{id:"b-squad",name:"B Squad",short:"BSQ",crest:"b-squad",kits:{home:{jersey:"#151217",trim:"#ff3fa4",stripe:"#7a7a7a",number:"#ff3fa4",helmet:"#ff3fa4",pants:"#151217"},away:{jersey:"#ff3fa4",trim:"#151217",stripe:"#7a7a7a",number:"#151217",helmet:"#151217",pants:"#151217"}}},{id:"saber-cats",name:"Saber Cats",short:"SAB",crest:"saber-cats",kits:{home:{jersey:"#111111",trim:"#8dff3a",stripe:"#6b6b70",number:"#8dff3a",helmet:"#111111",pants:"#111111"},away:{jersey:"#8dff3a",trim:"#111111",stripe:"#6b6b70",number:"#111111",helmet:"#111111",pants:"#111111"}}},{id:"icers",name:"Icers",short:"ICE",crest:"icers",kits:{home:{jersey:"#1d3a78",trim:"#ffffff",stripe:"#9fb3d1",number:"#ffffff",helmet:"#1d3a78",pants:"#1d3a78"},away:{jersey:"#f4f7fc",trim:"#1d3a78",stripe:"#9fb3d1",number:"#1d3a78",helmet:"#1d3a78",pants:"#1d3a78"}}}],z=r=>U.find(e=>e.id===r)||U[0],Jt=["Avery","Bo","Cam","Dez","Eli","Finn","Gigi","Hollis","Iggy","Jo","Kit","Lux","Mo","Nico","Ozzy","Pip","Quinn","Remy","Sasha","Teddy","Uma","Vic","Wren","Xan","Yuki","Zed","Bea","Gus","Ivy","Rory","Milo","Nell","Otis","Pia","Rex","Tova","Ash","Coco","Duke","Elle"],Xt=["Pucksworth","Snipeski","Bardown","Dangleton","Wristerly","Slapsky","Crossbarr","Zambonie","Benchley","Bluelino","Faceoffski","Breakaway","Toecurl","Glovesave","Iceberg","Kneepad","Backcheck","Tapeworth","Onetimer","Hatcher","Lacesley","Rinkman","Stickley","Mittens","Crease","Biscuit","Celly","Wheelson","Sauce","Cellydance","Pylon","Tilly","Skatesby","Edgework","Linemate","Wristwell","Puckett","Boardman","Gretz","Snowmore"],Ie=(r,e,t)=>Math.max(e,Math.min(t,r)),Zt=(r,e)=>r==="early"?18-7*e:r==="late"?-15+7*e:0,Qt=r=>{const e=Re(`roster:${r.id}`),t=e.shuffle(Jt),s=e.shuffle(Xt),i=new Set,a=()=>{let h=e.int(2,98);for(;i.has(h);)h=e.int(2,98);return i.add(h),h},n=e.shuffle(["early","early","early","late","late","late","steady","steady","steady","steady","steady","steady","steady"]),o=[];for(let h=0;h<15;h++){const l=h>=13,c=l?e.pick(["early","late","steady"]):n[h],d=c==="early"?e.int(60,95):c==="late"?e.int(5,40):e.int(20,65),u=Ie(e.int(30,95)+(c==="late"?10:c==="early"?-8:0),20,99);o.push({id:`${r.id}-${h}`,teamId:r.id,first:t[h],last:s[h],name:`${t[h]} ${s[h]}`,number:a(),position:l?"G":h<8?"F":"D",goalie:l,curve:c,talent:e.int(55,80),skin:e.pick(Kt),hand:e.chance(.65)?"L":"R",coachability:u,influence:d,fans:Array.from({length:e.int(1,8)},(p,f)=>`${r.id}-${h}-fan-${f}`),offsets:{speed:e.int(-8,8),shot:e.int(-8,8),pass:e.int(-8,8),hands:e.int(-8,8),check:e.int(-10,10),stamina:e.int(-8,8),reflex:e.int(-6,6),position:e.int(-6,6)}})}return o},Pe=new Map,es=r=>(Pe.has(r)||Pe.set(r,Qt(z(r))),Pe.get(r)),ts=(r,e)=>{const t=Ie(r.talent+Zt(r.curve,e),25,99),s={};for(const i of Object.keys(r.offsets))s[i]=Ie(t+r.offsets[i],20,99);return s.overall=t,s.coachability=r.coachability,s.influence=r.influence,s};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const X={tripping:{id:"tripping",label:"Tripping",minutes:2,signal:"Strikes the leg below the knee",explain:"Using your stick, knee or foot to make another player fall."},hooking:{id:"hooking",label:"Hooking",minutes:2,signal:"Tugs both arms toward the body",explain:"Using the blade of your stick to pull or hold back another player."},slashing:{id:"slashing",label:"Slashing",minutes:2,signal:"Chops one forearm across the other",explain:"Swinging your stick at another player, even if you only hit their stick or gloves."},holding:{id:"holding",label:"Holding",minutes:2,signal:"Grabs one wrist",explain:"Grabbing another player or their stick to slow them down."},interference:{id:"interference",label:"Interference",minutes:2,signal:"Crosses arms in front of the chest",explain:"Hitting, holding or blocking a player who does not have the puck."},"high-sticking":{id:"high-sticking",label:"High-sticking",minutes:2,signal:"Holds both fists up, one above the other",explain:"Carrying your stick above your shoulders and making contact with another player."},"cross-checking":{id:"cross-checking",label:"Cross-checking",minutes:2,signal:"Pushes both fists forward from the chest",explain:"Hitting another player with the shaft of your stick held in both hands."},roughing:{id:"roughing",label:"Roughing",minutes:2,signal:"Extends a clenched fist to the side",explain:"Extra pushing, shoving or punching, usually after the whistle."},"body-checking":{id:"body-checking",label:"Body checking",minutes:2,signal:"Pats the chest with a closed fist",explain:"Body checking is not allowed until 14U. Younger players learn body contact and angling first, so they are ready for it."},fighting:{id:"fighting",label:"Fighting",minutes:0,ejection:!0,signal:"Throws a punch in the air",explain:"Dropping the gloves earns a game misconduct: you are done for the night."}},ss=[{id:"hooking",weight:4},{id:"slashing",weight:3},{id:"tripping",weight:3},{id:"holding",weight:1},{id:"high-sticking",weight:1}],is=[{id:"interference",weight:3},{id:"holding",weight:3},{id:"hooking",weight:2},{id:"high-sticking",weight:1}],as=(r,e,t)=>{if(!r.penalties)return null;const s=t.rng,i=r.strictness*2,a=n=>s.chance(Math.min(.95,n*i));return e==="poke"?a(.005)?"slashing":null:e==="stick"?t.onCarrier?a(.15)?s.weighted(ss).id:null:a(.45)?s.weighted(is).id:null:e==="check"?r.checking?t.onCarrier?t.fromBehind?a(.35)?"cross-checking":null:a(.025)?"roughing":null:a(.6)?"interference":null:a(.8)?"body-checking":null:null};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const Oe=(r,e)=>r.slice().sort((t,s)=>e(s)-e(t))[0],ct=[{id:"bribe",weight:3,subject:r=>Oe(r.skaters(),e=>e.player.influence),title:"A parent wants a word",body:r=>`${r.player.first} ${r.player.last}'s parent slides you an envelope. "Just make sure #${r.player.number} gets more ice time. Power play. Every shift. You understand."`,choices:[{label:"Take the envelope",result:r=>`#${r.player.number} is double-shifting now. Watch the legs go, and listen to the crowd.`,apply:(r,e,t)=>{t.doubleShift=!0,t.exposure+=25,r.crowd.mood-=.3}},{label:"Ice time is earned",result:()=>"The envelope goes back. The bench notices, and so do the stands.",apply:r=>{r.crowd.mood+=.1}}]},{id:"interview",weight:3,subject:r=>Oe(r.skaters(),e=>e.stats.goals*3+e.stats.assists+e.player.influence/50),title:"Mid-game interview",body:r=>`The local stream catches #${r.player.number} ${r.player.first} in the hallway. "I just want to thank my grandparents for the new bike they bought me for my hat trick last game..."`,choices:[{label:"Keep talking about the bike",result:()=>"Exposure up. Somewhere a parent is already clipping this for an agent.",apply:(r,e,t)=>{t.exposure+=15,e.chemistry-=.05}},{label:'"...and my teammates set me up!"',result:()=>"The whole bench heard that. Watch the puck move.",apply:(r,e,t)=>{t.exposure=Math.max(0,t.exposure-10),e.chemistry+=.15}}]},{id:"showcase",weight:2,subject:r=>Oe(r.skaters(),e=>e.player.influence+(e.player.curve==="early"?30:0)),title:"The Elite Showcase package",body:r=>`A man in a quarter-zip hands ${r.player.first}'s parent a brochure: Elite Showcase, $4,800, "maximum exposure to scouts." They look at you. "Should we?"`,choices:[{label:"Buy the package",result:r=>`#${r.player.number} now plays for the cameras. Passing is for other people.`,apply:(r,e,t)=>{t.exposure+=30}},{label:"Save it for summer camp",result:r=>`#${r.player.number} relaxes, and it shows.`,apply:(r,e,t)=>{t.exposure=Math.max(0,t.exposure-10),t.boost+=4}}]},{id:"stands",weight:2,subject:()=>null,title:"Trouble in the stands",body:()=>"Two sets of parents are going at it over a missed offsides call. The kids are looking up from the bench.",choices:[{label:"Ask them to settle down",result:()=>"The rink manager walks over. Things cool off.",apply:r=>{r.crowd.mood+=.1,r.crowd.fightRate*=.5}},{label:"Not my problem",result:()=>"It is a little bit your problem. The next one comes sooner.",apply:r=>{r.crowd.mood-=.2,r.crowd.fightRate*=2}}]},{id:"oranges",weight:2,subject:()=>null,title:"Orange slices!",body:()=>"The grandparents brought orange slices for everyone. Nobody is talking about scouts. Somebody is doing an orange-peel smile.",choices:[{label:"Just have fun out there",result:()=>"Fresh legs, big smiles, and the puck starts moving.",apply:(r,e)=>{e.skaters().forEach(t=>{t.stamina=1}),e.chemistry+=.1,r.crowd.mood+=.1}}]}];/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const ue=(r,e,t)=>Math.max(e,Math.min(t,r)),E=(r,e)=>Math.hypot(r.x-e.x,r.y-e.y),B=(r,e,t,s)=>{const i=e-r.x,a=t-r.y;return{vx:i*(s||2.4),vy:a*(s||2.4)}},Z=(r,e)=>({x:r.cx,y:r.lineY+r.mouth*e}),dt=(r,e,t)=>{const s=t.x-e.x,i=t.y-e.y,a=s*s+i*i||1,n=ue(((r.x-e.x)*s+(r.y-e.y)*i)/a,0,1);return Math.hypot(r.x-(e.x+s*n),r.y-(e.y+i*n))},ns=(r,e)=>{const t=r.rules.surface,s=r.puck,i=r.ownNetFor(e.side),a=i.cx,n=s.x-a,o=s.y-i.lineY,h=Math.hypot(n,o)||1,l=ue(1.4+e.rating.position/100*2.4,1.4,4);let c=a+n/h*l,d=i.lineY+o/h*l;return(d-i.lineY)*i.mouth<.8&&(d=i.lineY+i.mouth*.8),c=ue(c,i.x0-1.5,i.x1+1.5),t.width<0?{vx:0,vy:0}:B(e,c,d,7)},pe=(r,e,t)=>{const s=r.rules.surface,i=e.attackDir(),a=i<0?s.blueLines:s.length-s.blueLines;return i<0?t<a:t>a},rs=(r,e,t,s)=>{if(!r.rules.offsides||!t.discipline)return s;const i=r.puck;if(pe(r,e,i.y))return s;const a=r.rules.surface,n=e.attackDir(),o=n<0?a.blueLines:a.length-a.blueLines;return pe(r,e,s.y)&&(s.y=o-n*2),s},Q=(r,e)=>r.clampToRink(e.x,e.y,1.5),os=(r,e,t,s)=>{const i=r.teams[r.other(e.side)].onIceSkaters();let a=null,n=.25;const o=E(e,Z(s,4));for(const h of t.onIceSkaters()){if(h===e||h.stun>0)continue;const l=Math.min(15,Math.min(...i.map(f=>E(f,h)).concat([15]))),c=Math.min(...i.map(f=>dt(f,e,h)).concat([10])),d=(o-E(h,Z(s,4)))/30,u=E(e,h);let p=l/15+d+(c<2.5?-.8:0)-(u>60?.4:0)+t.chemistry;r.rules.offsides&&pe(r,t,h.y)&&!pe(r,t,e.y)&&(p-=1),p>n&&(n=p,a=h)}return a},hs=(r,e,t,s)=>{const i=r.rng,a=r.netFor(e.side),n=r.teams[r.other(e.side)].onIceSkaters(),o=e.rating.coachability,h=E(e,{x:a.cx,y:a.lineY}),l=(e.y-a.lineY)*a.mouth>1.5,c=l&&Math.abs(e.x-a.cx)<h*.85,d=Math.min(...n.map(m=>E(m,e)).concat([99]));if(s){const m=(10+20*r.rules.speed)*(.8+e.rating.shot/260),g=r.time-(e.heldSince||0);if(c&&h<m&&g>.45){let k=.1+e.rating.shot/450+(h<m*.5?.22:0)+(d<4?.1:0);const $={x:a.cx,y:a.lineY};if(n.some(A=>dt(A,e,$)<1.8&&E(A,e)<h)&&(k*=.3),i.chance(k))return r.shoot(e,0),{vx:e.vx,vy:e.vy}}let b=(.2+o*.0035+t.chemistry)*(1-e.exposure/100*.8);if(d<6&&(b*=1.8),e.stamina<.35&&(b*=1.3),i.chance(ue(b,0,.95)*.55)){const k=os(r,e,t,a);if(k)return r.pass(e,k),{vx:e.vx,vy:e.vy}}if(r.rules.faceoffs&&d<4.5){const k=r.ownNetFor(e.side);if(E(e,Z(k,0))<40&&i.chance(.05))return r.dump(e),{vx:e.vx,vy:e.vy}}}let u=Z(a,Math.max(5,Math.min(12,h*.3)));l||(u={x:e.x<a.cx?a.x0-6:a.x1+6,y:a.lineY+a.mouth*8});const p=n.filter(m=>E(m,e)<10).sort((m,g)=>E(m,e)-E(g,e))[0];if(p){const m=p.x>e.x?-1:1;u={x:u.x+m*8,y:u.y}}const f=Q(r,u);return B(e,f.x,f.y,4)},ut=(r,e,t,s)=>{const i=r.rules.surface,a=t.attackDir(),n=r.netFor(e.side),o=t.onIceSkaters().filter(u=>r.puck.carrier!==u).sort((u,p)=>u.uid-p.uid).indexOf(e),h=s.x<i.width/2,l=[{x:h?i.width*.72:i.width*.28,y:s.y+a*12},{x:i.width/2+(h?4:-4),y:n.lineY+n.mouth*13},{x:h?i.width*.3:i.width*.7,y:s.y-a*16},{x:h?i.width*.68:i.width*.32,y:s.y-a*24}];let c=Object.assign({},l[Math.max(0,o)%l.length]);!e.discipline&&e.rating.coachability<45&&(c={x:(c.x+s.x)/2,y:(c.y+s.y)/2}),c.x+=Math.sin(r.time*1.3+e.uid)*2.5,c=rs(r,t,e,c);const d=Q(r,c);return B(e,d.x,d.y,2)},ls=(r,e,t,s)=>{const i=r.rng,a=r.puck.carrier,n=r.teams[r.other(e.side)],o=r.ownNetFor(e.side),h=Z(o,4),l=e.rating.coachability,c=t.onIceSkaters(),d=c.slice().sort((k,$)=>E(k,a)-E($,a)),u=!e.discipline&&r.rules.ageIndex<=1&&l<55;if(d[0]===e||u){const k=h.x-a.x,$=h.y-a.y,A=Math.hypot(k,$)||1,P=E(e,a);if(s&&P<4){const x=r.fromBehind(e,a),w=r.rules.checking?.04+e.rating.check/900:(100-l)/9e3,_=.012+(100-l)/4500+(x?.02:0),j=.12+.18*r.rules.ai,S=i.next(),O=!x||i.chance((100-l)/500),T=r.time>=(e.nextStickAt||0);S<w?P<3.3&&O&&r.bodyCheck(e,a):S<w+_?T&&(r.stickPlay(e,a),e.nextStickAt=r.time+10+l/6):S<w+_+j&&r.pokeCheck(e)}return B(e,a.x+k/A*2,a.y+$/A*2,4)}const p=c.filter(k=>k!==d[0]).sort((k,$)=>k.uid-$.uid),f=n.onIceSkaters().filter(k=>k!==a).sort((k,$)=>k.uid-$.uid),m=p.indexOf(e);if(f.length===0){const k=Q(r,{x:o.cx+(m%2?8:-8),y:o.lineY+o.mouth*10});return B(e,k.x,k.y,2)}const g=f[Math.max(0,m)%f.length];s&&E(e,g)<3&&(r.time>=(e.nextStickAt||0)&&i.chance((100-l)/4e5)?(r.stickPlay(e,g),e.nextStickAt=r.time+18+l/3):r.rules.checking&&i.chance((100-l)/12e3)&&r.bodyCheck(e,g));const b=Q(r,{x:g.x+(h.x-g.x)*.35,y:g.y+(h.y-g.y)*.35});return B(e,b.x,b.y,2.4)},cs=(r,e,t)=>{const s=r.puck,i=t.onIceSkaters().slice().sort((l,c)=>E(l,s)-E(c,s)).indexOf(e),a=!e.discipline&&e.rating.coachability<50;if(i===0||i===1&&a||r.rules.ageIndex===0&&a){const l=Q(r,{x:s.x+s.vx*.3,y:s.y+s.vy*.3});return B(e,l.x,l.y,5)}if(s.lastTouch&&s.lastTouch.side===e.side)return ut(r,e,t,s);const n=r.ownNetFor(e.side),o=Z(n,4),h=Q(r,{x:s.x+(o.x-s.x)*.45+(i%2?6:-6),y:s.y+(o.y-s.y)*.45});return B(e,h.x,h.y,2.4)},ds=(r,e,t)=>{const s=r.rng,i=r.teams[e.side],a=r.puck;e.aiTimer-=t;const n=e.aiTimer<=0;n&&(e.aiTimer=.32-.18*r.rules.ai+s.range(0,.08),s.chance(.12)&&(e.discipline=s.chance(.45+e.rating.coachability/180)));const o=a.carrier;return o===e?hs(r,e,i,n):o&&o.side===e.side?ut(r,e,i,o):o?ls(r,e,i,n):cs(r,e,i)},C=(r,e,t)=>Math.max(e,Math.min(t,r)),R=(r,e)=>Math.hypot(r.x-e.x,r.y-e.y),Le=1.2,us=2.1;class pt{constructor(e,t,s,i){this.game=e,this.side=t,this.def=z(s),this.kitName=i,this.kit=this.def.kits[i]||this.def.kits.home,this.score=0,this.shots=0,this.chemistry=0,this.box=[],this.lineIndex=0,this.lineTime=0;const a=e.rules.ageIndex;this.entities=es(s).map(n=>({uid:++e.uidCounter,id:n.id,side:t,player:n,rating:ts(n,a),isGoalie:n.goalie,x:0,y:0,vx:0,vy:0,dir:t==="home"?-Math.PI/2:Math.PI/2,onIce:!1,inBox:!1,ejected:!1,stun:0,slow:0,fighting:!1,stamina:1,exposure:n.influence,boost:0,doubleShift:!1,aiTimer:0,cooldown:{pass:0,shot:0,poke:0,stick:0,check:0,pickup:0},discipline:!0,controller:null,stats:{goals:0,assists:0,shots:0,passes:0,hits:0,pim:0,toi:0,touches:0,possession:0}})),this.goalie=this.entities.find(n=>n.isGoalie),this.goalie.onIce=!0}skaters(){return this.entities.filter(e=>!e.isGoalie&&!e.ejected)}onIceSkaters(){return this.entities.filter(e=>!e.isGoalie&&e.onIce)}available(){return this.skaters().filter(e=>!e.inBox)}strength(){const e=this.game.rules.skaters,t=Math.min(2,this.box.filter(s=>!X[s.type].ejection).length);return Math.max(1,Math.min(e-t,this.available().length))}attackDir(){const e=this.game.period%2===1;return this.side==="home"===e?-1:1}targetNetY(){const e=this.game.rules.surface;return this.attackDir()<0?e.goalLine:e.length-e.goalLine}ownNetY(){const e=this.game.rules.surface;return this.attackDir()<0?e.length-e.goalLine:e.goalLine}changeLine(e){const t=this.strength(),s=this.available();if(s.length===0)return;const i=this.onIceSkaters(),a=i.map(u=>({x:u.x,y:u.y,vx:u.vx,vy:u.vy,dir:u.dir}));i.forEach(u=>{u.onIce=!1});const n=s.filter(u=>u.doubleShift),o=s.filter(u=>!u.doubleShift),h=n.slice(0,t),l=Math.max(1,Math.ceil(o.length/t));this.lineIndex=(this.lineIndex+1)%l;let c=this.lineIndex*t;for(;h.length<t&&o.length>0;){const u=o[c%o.length];if(h.includes(u)||h.push(u),c++,c>this.lineIndex*t+o.length*2)break}h.forEach((u,p)=>{u.onIce=!0,e&&a[p]?Object.assign(u,a[p]):e&&this.game.placeAtBench(u)}),this.lineTime=0;const d=this.game.puck;d.carrier&&!d.carrier.onIce&&this.game.loosePuck(0,0),this.game.reassignControllers()}fillToStrength(){const e=this.strength();let t=this.onIceSkaters();const s=this.available().filter(i=>!i.onIce);for(;t.length<e&&s.length>0;){const i=s.shift();i.onIce=!0,this.game.placeAtBench(i),t=this.onIceSkaters()}for(;t.length>e;){const i=t.pop();i.onIce=!1,this.game.puck.carrier===i&&this.game.loosePuck(0,0)}this.game.reassignControllers()}}class ft{constructor(e={}){this.opts=e,this.rules=Ce(e.level||"8U",e),this.rng=Re(e.seed||`game:${e.home}:${e.away}:${e.level}`),this.events=[],this.time=0,this.period=1,this.clock=this.rules.periodSeconds,this.phase="faceoff",this.phaseTimer=1,this.crowd={mood:.6,fightRate:1},this.pending=[],this.intermission=null,this.result=null,this.buzzerTimer=this.rules.buzzer,this.nextRestart=null,this.fight=null,this.controllers=Object.assign({},e.controllers||{}),this.uidCounter=0,this.control={};const t=e.homeKit||"home";let s=e.awayKit||"away";this.teams={home:new pt(this,"home",e.home||"sparkle-selects",t),away:new pt(this,"away",e.away||"icers",s)},this.puck={x:0,y:0,z:0,vx:0,vy:0,vz:0,carrier:null,shot:null,pass:null,icing:null,lastTouch:null,chain:[],prevY:0};for(const i of["home","away"])this.teams[i].changeLine(!1);this.startFaceoff(this.centerDot())}emit(e,t){this.events.push(Object.assign({type:e,t:this.time,period:this.period,clock:this.clock},t||{}))}drainEvents(){const e=this.events;return this.events=[],e}other(e){return e==="home"?"away":"home"}allOnIce(){return[...this.teams.home.entities,...this.teams.away.entities].filter(e=>e.onIce)}findEntity(e){return[...this.teams.home.entities,...this.teams.away.entities].find(t=>t.uid===e)}centerDot(){const e=this.rules.surface;return{x:e.width/2,y:e.length/2}}clampToRink(e,t,s){const i=this.rules.surface,a=i.cornerRadius,n=i.width,o=i.length;let h=0,l=0,c=!1;const d=C(e,a,n-a),u=C(t,a,o-a);if((e<a||e>n-a)&&(t<a||t>o-a)){const p=e-d,f=t-u,m=Math.hypot(p,f),g=a-s;m>g&&(h=-p/m,l=-f/m,e=d+p/m*g,t=u+f/m*g,c=!0)}else e<s?(e=s,h=1,c=!0):e>n-s&&(e=n-s,h=-1,c=!0),t<s?(t=s,l=1,c=!0):t>o-s&&(t=o-s,l=-1,c=!0);return{x:e,y:t,nx:h,ny:l,hit:c}}nets(){const e=this.rules.surface,t=this.rules.net.width,s=this.rules.net.depth,i=e.width/2;return[{id:"top",cx:i,lineY:e.goalLine,x0:i-t/2,x1:i+t/2,y0:e.goalLine-s,y1:e.goalLine,mouth:1},{id:"bottom",cx:i,lineY:e.length-e.goalLine,x0:i-t/2,x1:i+t/2,y0:e.length-e.goalLine,y1:e.length-e.goalLine+s,mouth:-1}]}attackerOfNet(e){const t=this.teams.home.attackDir()<0;return e.id==="top"?t?"home":"away":t?"away":"home"}zoneDots(e,t){const s=this.rules.surface,i=this.teams[e],a=t==="defensive"?i.ownNetY():i.targetNetY(),n=a<s.length/2?1:-1,o=Math.min(20,s.length*.2),h=Math.min(22,s.width*.26),l=this.puck.x<s.width/2?-1:1;return{x:s.width/2+l*h,y:a+n*o}}placeAtBench(e){const t=this.rules.surface;e.x=3,e.y=t.length/2+(e.side==="home"?-6:6),e.vx=0,e.vy=0}startFaceoff(e){const t=this.rules.surface;this.phase="faceoff",this.phaseTimer=.9,this.nextRestart=null;const s=this.puck;s.carrier=null,s.shot=null,s.pass=null,s.icing=null,s.x=e.x,s.y=e.y,s.prevY=e.y,s.z=0,s.vx=0,s.vy=0,s.vz=0,this.faceoffDot=e;for(const i of["home","away"]){const a=this.teams[i],n=a.attackDir(),o=a.onIceSkaters(),h=[{x:0,y:2.5},{x:-14,y:5},{x:14,y:5},{x:-10,y:16},{x:10,y:16}];o.forEach((l,c)=>{const d=h[c%h.length],u=this.clampToRink(e.x+d.x,e.y-n*d.y,3);l.x=u.x,l.y=u.y,l.vx=0,l.vy=0,l.dir=n<0?-Math.PI/2:Math.PI/2,l.stun=0,l.slow=0}),this.placeGoalie(a)}this.emit("faceoff",{x:e.x,y:e.y}),t&&this.opts.debug&&this.emit("debug",{msg:"faceoff"})}placeGoalie(e){const t=e.goalie,s=this.rules.surface,i=e.ownNetY();t.x=s.width/2,t.y=i+(i<s.length/2?2.5:-2.5),t.vx=0,t.vy=0,t.stun=0}startRestart(e){const t=this.rules.surface,s=this.teams[e],i=this.teams[this.other(e)],a=s.attackDir(),n=s.ownNetY();this.phase="faceoff",this.phaseTimer=1.2,this.nextRestart=null;const o=this.puck;o.shot=null,o.pass=null,o.icing=null;const h=s.onIceSkaters(),l=Math.min(4.5,t.goalLine*.6);h.forEach((d,u)=>{if(u===0)d.x=t.width/2+5,d.y=n-a*l;else{const p=this.clampToRink(t.width*(u%2?.25:.75),n+a*(8+u*4),3);d.x=p.x,d.y=p.y}d.vx=0,d.vy=0,d.dir=a<0?-Math.PI/2:Math.PI/2}),i.onIceSkaters().forEach((d,u)=>{const p=this.clampToRink(t.width*(.2+.3*(u%3)),t.length/2+a*(4+u*3),3);d.x=p.x,d.y=p.y,d.vx=0,d.vy=0,d.dir=a<0?Math.PI/2:-Math.PI/2}),this.placeGoalie(s),this.placeGoalie(i);const c=h[0];c&&this.takePuck(c,!0),this.emit("restart",{side:e})}whistle(e,t,s){if(this.phase!=="play")return;this.phase="whistle",this.phaseTimer=1.4,this.nextRestart=t;const i=this.puck;i.carrier=null,i.shot=null,i.pass=null,i.icing=null,i.vx*=.3,i.vy*=.3,this.emit("whistle",Object.assign({reason:e},s||{})),this.assessPending(),this.rules.fights&&this.phase==="whistle"&&this.maybeFight(null,null,.2)}doRestart(){const e=this.nextRestart;if(!e){this.startFaceoff(this.centerDot());return}if(!this.rules.buzzer)for(const t of["home","away"]){const s=this.teams[t],i=s.onIceSkaters(),a=i.reduce((n,o)=>n+o.stamina,0)/Math.max(1,i.length);(s.lineTime>40||a<.62)&&s.changeLine(!1)}for(const t of["home","away"])this.teams[t].fillToStrength();e.type==="restart"&&!this.rules.faceoffs?this.startRestart(e.side):e.type==="restart"?this.startFaceoff(this.zoneDots(e.side,"defensive")):this.startFaceoff({x:e.x,y:e.y})}dropPuck(){const e=this.faceoffDot,t=this.teams.home.onIceSkaters()[0],s=this.teams.away.onIceSkaters()[0];if(this.phase="play",!t||!s)return;const i=t.rating.hands+t.boost,a=s.rating.hands+s.boost,n=this.rng.chance(i/(i+a))?t:s,o=this.teams[n.side].attackDir();this.puck.x=e.x,this.puck.y=e.y,this.puck.vx=this.rng.range(-6,6),this.puck.vy=-o*this.rng.range(10,16)*this.rules.speed,this.puck.lastTouch={side:n.side,uid:n.uid,y:e.y},this.puck.chain=[n.uid],n.cooldown.pickup=.3,this.emit("faceoff-won",{side:n.side,uid:n.uid})}takePuck(e,t){const s=this.puck,i=s.lastTouch?s.lastTouch.side:null;if(s.carrier=e,s.shot=null,s.pass=null,s.icing=null,s.z=0,s.vz=0,i!==e.side&&(s.chain=[]),s.chain[s.chain.length-1]!==e.uid&&s.chain.push(e.uid),s.chain.length>3&&s.chain.shift(),s.lastTouch={side:e.side,uid:e.uid,y:e.y},e.heldSince=this.time,e.stats.touches++,t||this.emit("pickup",{side:e.side,uid:e.uid}),this.pending.some(a=>a.offender.side===e.side)){this.whistle("penalty",this.penaltyRestart());return}this.reassignControllers()}loosePuck(e,t){const s=this.puck;s.carrier&&(s.carrier.cooldown.pickup=.45,s.lastTouch={side:s.carrier.side,uid:s.carrier.uid,y:s.carrier.y}),s.carrier=null,s.vx=e,s.vy=t}netFor(e){const t=this.teams[e].targetNetY();return this.nets().find(s=>s.lineY===t)}ownNetFor(e){const t=this.teams[e].ownNetY();return this.nets().find(s=>s.lineY===t)}shoot(e,t){const s=this.puck;if(s.carrier!==e||e.cooldown.shot>0)return;const i=this.teams[e.side],a=this.netFor(e.side),n=R(e,{x:a.cx,y:a.lineY}),o=e.rating.shot+e.boost,h=(1-o/100)*3.2+n*.035+(1-this.rules.ai)*.6,l=this.rules.net.width/2;let c=a.cx+(t||0)*l*.7+this.rng.range(-1,1)*(l*.55+h);const d=Math.abs(c-a.cx)<l-.25,u=a.lineY-a.mouth*1.5,p=c-s.x,f=u-s.y,m=Math.hypot(p,f)||1,g=(55+o*.45)*this.rules.speed;this.loosePuck(p/m*g,f/m*g),s.vz=this.rng.range(2,8),s.shot={uid:e.uid,side:e.side,power:g,rating:o,from:n,rolled:!1,onTarget:d},this.setIcingWatch(e),e.cooldown.shot=.6,e.cooldown.pickup=.35,d&&(e.stats.shots++,i.shots++),this.emit("shot",{side:e.side,uid:e.uid,onTarget:d,distance:Math.round(n)})}pass(e,t){const s=this.puck;if(s.carrier!==e||e.cooldown.pass>0||!t)return;const i=R(e,t),a=C(i*2.4+16,22,(38+(e.rating.pass+e.boost)*.32)*Math.sqrt(this.rules.speed)),n=i/a,o=(1-(e.rating.pass+e.boost)/100)*4+(1-this.rules.ai)*1.5,h=t.x+t.vx*n+this.rng.range(-o,o),l=t.y+t.vy*n+this.rng.range(-o,o),c=this.clampToRink(h,l,2),d=c.x-s.x,u=c.y-s.y,p=Math.hypot(d,u)||1;this.loosePuck(d/p*a,u/p*a),s.pass={from:e.uid,to:t.uid,side:e.side},this.setIcingWatch(e),e.cooldown.pass=.45,e.cooldown.pickup=.4,e.stats.passes++,this.emit("pass",{side:e.side,uid:e.uid,to:t.uid})}dump(e){const t=this.puck;if(t.carrier!==e)return;const s=this.rules.surface,i=this.teams[e.side],a=i.targetNetY()-i.attackDir()*(this.rng.chance(.5)?8:-2),n=(e.x<s.width/2?s.width-6:6)-t.x,o=a-t.y,h=Math.hypot(n,o)||1,l=(62+e.rating.shot*.4)*this.rules.speed;this.loosePuck(n/h*l,o/h*l),this.setIcingWatch(e),e.cooldown.pickup=.4,this.emit("dump",{side:e.side,uid:e.uid})}setIcingWatch(e){const t=this.puck;if(!this.rules.icing)return;const s=this.rules.surface,i=this.teams[e.side],a=i.attackDir()<0?e.y>s.length/2:e.y<s.length/2,n=i.strength()<this.teams[this.other(e.side)].strength();t.icing=a&&!n?{side:e.side}:null}nearestOpponent(e,t){let s=null,i=t;for(const a of this.teams[this.other(e.side)].onIceSkaters()){const n=R(e,a);n<i&&!a.fighting&&(i=n,s=a)}return s}fromBehind(e,t){const s=Math.cos(t.dir),i=Math.sin(t.dir),a=e.x-t.x,n=e.y-t.y,o=Math.hypot(a,n)||1;return(s*a+i*n)/o<-.5}pokeCheck(e){if(e.cooldown.poke>0)return;e.cooldown.poke=.7;const t=this.puck.carrier;if(this.emit("poke",{side:e.side,uid:e.uid}),!t||t.side===e.side||R(e,t)>4)return;const s=C(.32+(e.rating.hands-t.rating.hands)*.004,.1,.6);if(this.rng.chance(s)){const i=e.x-t.x,a=e.y-t.y;this.loosePuck(i*2+this.rng.range(-6,6),a*2+this.rng.range(-6,6)),this.emit("poked",{side:e.side,uid:e.uid,from:t.uid})}this.judge(e,"poke",t)}stickPlay(e,t){if(e.cooldown.stick>0)return;e.cooldown.stick=.9;const s=t&&R(e,t)<4.5?t:this.nearestOpponent(e,4.5);this.emit("stick",{side:e.side,uid:e.uid,target:s?s.uid:null}),s&&(this.puck.carrier===s?(s.slow=.5,this.rng.chance(.5)&&(this.loosePuck(s.vx*.4+this.rng.range(-8,8),s.vy*.4+this.rng.range(-8,8)),this.emit("poked",{side:e.side,uid:e.uid,from:s.uid}))):s.slow=1,this.judge(e,"stick",s))}bodyCheck(e,t){if(e.cooldown.check>0)return;e.cooldown.check=1.1;const s=t&&R(e,t)<3.4?t:this.nearestOpponent(e,3.4);if(!s){e.vx+=Math.cos(e.dir)*6,e.vy+=Math.sin(e.dir)*6,this.emit("whiff",{side:e.side,uid:e.uid});return}const i=this.puck.carrier===s,a=this.fromBehind(e,s),n=(.6+e.rating.check/100)*10*this.rules.speed,o=s.x-e.x,h=s.y-e.y,l=Math.hypot(o,h)||1;s.vx+=o/l*n,s.vy+=h/l*n,s.stun=.9,e.vx*=.4,e.vy*=.4,e.stats.hits++,i&&this.loosePuck(s.vx*.6+this.rng.range(-6,6),s.vy*.6+this.rng.range(-6,6));const c=this.rules.checking&&i&&!a;this.emit("hit",{side:e.side,uid:e.uid,target:s.uid,legal:c,onCarrier:i}),this.judge(e,"check",s),this.rules.fights&&this.maybeFight(e,s,.2),this.maybeStandsFight(e,s,.15)}judge(e,t,s){const i=as(this.rules,t,{onCarrier:this.puck.carrier===s||t==="check"&&s&&this.puck.lastTouch&&this.puck.lastTouch.uid===s.uid&&!this.puck.carrier,fromBehind:s?this.fromBehind(e,s):!1,rng:this.rng});i&&(this.pending.some(a=>a.offender===e)||(this.pending.push({offender:e,type:i,victim:s?s.uid:null,at:this.time,action:t}),this.emit("delayed-penalty",{side:e.side,uid:e.uid,penalty:i,action:t,human:!!e.controller}),this.puck.carrier&&this.puck.carrier.side===e.side&&this.whistle("penalty",this.penaltyRestart())))}penaltyRestart(){const e=this.pending[0]?this.pending[0].offender.side:"home";if(this.rules.faceoffs){const t=this.zoneDots(e,"defensive");return{type:"faceoff",x:t.x,y:t.y}}return{type:"restart",side:this.other(e)}}assessPending(){if(this.pending.length!==0){for(const e of this.pending){const t=X[e.type],s=e.offender,i=this.teams[s.side];s.stats.pim+=t.minutes,t.ejection?this.eject(s):(s.inBox=!0,s.onIce=!1,i.box.push({uid:s.uid,type:e.type,remaining:this.rules.minorSeconds})),this.emit("penalty",{side:s.side,uid:s.uid,number:s.player.number,name:s.player.name,penalty:e.type,label:t.label,signal:t.signal,explain:t.explain,minutes:t.minutes}),this.maybeStandsFight(s,e.victim?this.findEntity(e.victim):null,.25)}this.pending=[];for(const e of["home","away"])this.teams[e].fillToStrength()}}eject(e){e.ejected=!0,e.onIce=!1,e.fighting=!1,this.puck.carrier===e&&this.loosePuck(0,0),this.emit("ejection",{side:e.side,uid:e.uid,number:e.player.number,name:e.player.name})}maybeFight(e,t,s){if(!this.rules.fights||this.fight||!this.rng.chance(s))return;if(!e||!t){let n=null;for(const o of this.teams.home.onIceSkaters())for(const h of this.teams.away.onIceSkaters()){const l=R(o,h);(!n||l<n.d)&&(n={a:o,b:h,d:l})}if(!n||n.d>14)return;e=n.a,t=n.b}if(e.isGoalie||t.isGoalie)return;this.fight={a:e,b:t},e.fighting=!0,t.fighting=!0;const i=(e.x+t.x)/2,a=(e.y+t.y)/2;e.x=i-1.4,t.x=i+1.4,e.y=a,t.y=a,e.vx=e.vy=t.vx=t.vy=0,(this.puck.carrier===e||this.puck.carrier===t)&&this.loosePuck(0,0),this.phase==="play"&&(this.emit("whistle",{reason:"fight"}),this.puck.shot=null,this.puck.pass=null),this.phase="fight",this.phaseTimer=3.2,this.nextRestart={type:"faceoff",x:this.centerDot().x,y:this.centerDot().y},this.emit("fight",{a:e.uid,b:t.uid,home:e.side==="home"?e.uid:t.uid})}endFight(){const{a:e,b:t}=this.fight;this.fight=null;for(const i of[e,t])i.stats.pim+=5,this.emit("penalty",{side:i.side,uid:i.uid,number:i.player.number,name:i.player.name,penalty:"fighting",label:X.fighting.label,signal:X.fighting.signal,explain:X.fighting.explain,minutes:0}),this.eject(i);const s=["home","away"].filter(i=>this.teams[i].skaters().length<2);if(s.length>0){this.endGame(s.length===2?"called-both":"called",s.length===1?this.other(s[0]):null);return}for(const i of["home","away"])this.teams[i].fillToStrength();this.doRestart()}maybeStandsFight(e,t,s){!e||!t||this.rng.chance(Math.min(.9,s*this.crowd.fightRate))&&(this.emit("stands-fight",{a:e.uid,b:t.uid}),this.crowd.mood-=.03)}reassignControllers(){for(const e of Object.keys(this.controllers)){const t=this.controllers[e];this.teams[t];const s=this.control[e],i=this.puck.carrier,a=Object.keys(this.control).filter(n=>n!==e).map(n=>this.control[n]);if(i&&i.side===t&&!a.includes(i)){this.setControl(e,i);continue}s&&s.onIce&&!s.ejected||this.switchPlayer(e)}}setControl(e,t){const s=this.control[e];if(s!==t){s&&(s.controller=null);for(const i of Object.keys(this.control))this.control[i]===t&&(this.control[i]=null);this.control[e]=t,t.controller=e}}switchPlayer(e){const t=this.controllers[e],s=this.teams[t],i=Object.keys(this.control).filter(h=>h!==e).map(h=>this.control[h]),a=this.puck;let n=null,o=1/0;for(const h of s.onIceSkaters()){if(i.includes(h)||h===this.control[e])continue;const l=R(h,a);l<o&&(o=l,n=h)}n||(n=s.onIceSkaters().find(h=>!i.includes(h))),n&&this.setControl(e,n)}step(e,t){if(!(this.phase==="intermission"||this.phase==="final")){if(this.time+=e,this.phaseTimer-=e,this.phase==="faceoff"){this.updateMovement(e,t,!0),this.phaseTimer<=0&&(this.puck.carrier?this.phase="play":this.dropPuck());return}if(this.phase==="whistle"||this.phase==="goal"){this.updateMovement(e,t,!0),this.updatePuck(e,!0),this.phaseTimer<=0&&this.doRestart();return}if(this.phase==="fight"){this.phaseTimer<=0&&this.endFight();return}this.clock-=e,this.updateBox(e),this.rules.buzzer&&(this.buzzerTimer-=e,this.buzzerTimer<=0&&(this.buzzerTimer=this.rules.buzzer,this.emit("buzzer"),this.teams.home.changeLine(!0),this.teams.away.changeLine(!0)));for(const s of["home","away"])this.teams[s].lineTime+=e;this.handleInputs(t),this.updateMovement(e,t,!1),this.updatePuck(e,!1),this.pending.length&&this.time-this.pending[0].at>6&&this.whistle("penalty",this.penaltyRestart()),this.clock<=0&&this.phase==="play"&&this.endPeriod()}}updateBox(e){for(const t of["home","away"]){const s=this.teams[t];let i=!1;s.box=s.box.filter(a=>{if(a.remaining-=e,a.remaining<=0){const n=this.findEntity(a.uid);return n&&(n.inBox=!1),i=!0,this.emit("penalty-over",{side:t,uid:a.uid}),!1}return!0}),i&&s.fillToStrength()}}handleInputs(e){if(e)for(const t of Object.keys(this.controllers)){const s=e[t];let i=this.control[t];if(!(!s||(!i||!i.onIce)&&(this.switchPlayer(t),i=this.control[t],!i)||i.stun>0||i.fighting))if(this.puck.carrier===i)s.shoot?this.shoot(i,s.x):s.pass&&this.pass(i,this.pickPassTarget(i,s)),s.stick&&this.stickPlay(i);else{const a=this.puck.carrier&&this.puck.carrier.side===i.side;s.pass&&!a&&this.switchPlayer(t),s.shoot&&this.pokeCheck(i),s.check&&this.bodyCheck(i),s.stick&&this.stickPlay(i)}}}pickPassTarget(e,t){const s=this.teams[e.side];let i=t.x,a=t.y;!i&&!a&&(i=0,a=s.attackDir());const n=Math.hypot(i,a)||1;let o=null,h=-1/0;for(const l of s.onIceSkaters()){if(l===e)continue;const c=l.x-e.x,d=l.y-e.y,u=Math.hypot(c,d)||1,p=(c*i+d*a)/(u*n)*2-u/40;p>h&&(h=p,o=l)}return o}maxSpeed(e){const t=(17+(e.rating.speed+e.boost)*.13)*this.rules.speed;let s=.62+.38*e.stamina;return this.puck.carrier===e&&(s*=.92),e.slow>0&&(s*=.55),t*s}updateMovement(e,t,s){const i=this.allOnIce();for(const n of i){for(const u of Object.keys(n.cooldown))n.cooldown[u]=Math.max(0,n.cooldown[u]-e);n.stun=Math.max(0,n.stun-e),n.slow=Math.max(0,n.slow-e);let o=0,h=0,l=this.maxSpeed(n);if(n.fighting)continue;if(s&&this.phase==="faceoff"){n.vx=0,n.vy=0;continue}if(n.stun>0)n.vx*=Math.exp(-3*e),n.vy*=Math.exp(-3*e);else{let u;if(n.isGoalie)u=ns(this,n),l=14*Math.sqrt(this.rules.speed);else if(n.controller&&t&&t[n.controller]&&!s){const g=t[n.controller];u={vx:g.x*l,vy:g.y*l}}else s?u={vx:n.vx*.5,vy:n.vy*.5}:u=ds(this,n,e);o=u.vx,h=u.vy;const p=Math.hypot(o,h);p>l&&(o=o/p*l,h=h/p*l);const f=n.isGoalie?10:3.2,m=1-Math.exp(-f*e);n.vx+=(o-n.vx)*m,n.vy+=(h-n.vy)*m}n.x+=n.vx*e,n.y+=n.vy*e;const c=Math.hypot(n.vx,n.vy);if(c>1.2&&n.stun<=0)n.dir=Math.atan2(n.vy,n.vx);else if(n.controller&&t&&t[n.controller]){const u=t[n.controller];(u.x||u.y)&&(n.dir=Math.atan2(u.y,u.x))}if(!s&&!n.isGoalie){n.stats.toi+=e;const u=(.008+.02*(c/Math.max(1,l)))*(n.doubleShift?1.7:1)*(1.15-n.rating.stamina/200);n.stamina=C(n.stamina-u*e,.15,1)}const d=this.clampToRink(n.x,n.y,Le);d.hit&&(n.x=d.x,n.y=d.y,d.nx&&(n.vx*=-.2),d.ny&&(n.vy*=-.2)),this.collideNets(n,Le)}for(const n of["home","away"])for(const o of this.teams[n].entities)!o.onIce&&!o.isGoalie&&(o.stamina=C(o.stamina+.06*e,0,1));for(let n=0;n<i.length;n++)for(let o=n+1;o<i.length;o++){const h=i[n],l=i[o];if(h.fighting||l.fighting)continue;const c=l.x-h.x,d=l.y-h.y,u=Math.hypot(c,d),p=Le*2;if(u>0&&u<p){const f=(p-u)/2;h.x-=c/u*f,h.y-=d/u*f,l.x+=c/u*f,l.y+=d/u*f}}const a=this.puck.carrier;if(a&&a.onIce){const n=a,o=this.puck;o.x=n.x+Math.cos(n.dir)*1.7,o.y=n.y+Math.sin(n.dir)*1.7;const h=this.clampToRink(o.x,o.y,.4);o.x=h.x,o.y=h.y,o.vx=n.vx,o.vy=n.vy,n.stats.possession+=e}}collideNets(e,t){for(const s of this.nets())if(e.x>s.x0-t&&e.x<s.x1+t&&e.y>s.y0-t&&e.y<s.y1+t){const i=[{d:e.x-(s.x0-t),ax:"x",v:s.x0-t},{d:s.x1+t-e.x,ax:"x",v:s.x1+t},{d:e.y-(s.y0-t),ax:"y",v:s.y0-t},{d:s.y1+t-e.y,ax:"y",v:s.y1+t}].sort((a,n)=>a.d-n.d)[0];e[i.ax]=i.v,i.ax==="x"?e.vx*=-.2:e.vy*=-.2}}updatePuck(e,t){const s=this.puck;if(s.carrier){s.prevY=s.y;return}const i=s.x,a=s.y;s.x+=s.vx*e,s.y+=s.vy*e,s.z=Math.max(0,s.z+s.vz*e),s.vz=s.z>0?s.vz-30*e:0;const n=Math.hypot(s.vx,s.vy);if(n>0){const h=Math.max(0,n*Math.exp(-.22*e)-3*e);s.vx=s.vx/n*h,s.vy=s.vy/n*h}const o=this.clampToRink(s.x,s.y,.3);if(o.hit){s.x=o.x,s.y=o.y;const h=Math.hypot(o.nx,o.ny)||1,l=o.nx/h,c=o.ny/h,d=s.vx*l+s.vy*c;d<0&&(s.vx-=1.55*d*l,s.vy-=1.55*d*c,s.vx*=.85,s.vy*=.85,Math.abs(d)>14&&this.emit("boards",{speed:Math.abs(d)}))}if(t){s.prevY=s.y;return}for(const h of this.nets()){const l=h.mouth>0?a>h.lineY&&s.y<=h.lineY:a<h.lineY&&s.y>=h.lineY,c=l?(a-h.lineY)/(a-s.y||1):0,d=i+(s.x-i)*c;if(l&&d>h.x0&&d<h.x1&&s.z<4){this.goal(h);return}s.x>h.x0-.3&&s.x<h.x1+.3&&s.y>h.y0&&s.y<h.y1&&((h.mouth>0?a>=h.lineY:a<=h.lineY)?(s.y=h.lineY+h.mouth*.4,s.vy=-s.vy*.5):i<=h.x0-.3||i>=h.x1+.3?(s.x=i,s.vx=-s.vx*.5):(s.y=a,s.vy=-s.vy*.5),s.shot&&this.emit("post",{side:s.shot.side}))}this.checkGoalie(e),this.checkPickup(),this.checkOffside(a),this.checkIcing(a),s.prevY=s.y}checkGoalie(){const e=this.puck;if(!e.carrier)for(const t of["home","away"]){const s=this.teams[t].goalie,i=this.ownNetFor(t),a=1.8+s.rating.reflex/70,n=R(s,e);if(n>a)continue;const o=(i.lineY-e.y)*e.vy>0,h=Math.hypot(e.vx,e.vy)>18;if(e.shot&&e.shot.side!==t&&!e.shot.rolled&&o){e.shot.rolled=!0;const l=e.shot;let c=this.rules.saveBase+(s.rating.reflex+s.rating.position-120)*.0035-(l.rating-60)*.0028+l.from*.004;l.onTarget||(c+=.25),c=C(c,.28,.95),this.rng.chance(c)?this.save(s,l):l.beat=!0;return}if(!(e.shot&&e.shot.beat)&&!h&&n<a&&s.cooldown.pickup<=0){this.goalieTakes(s);return}}}save(e,t){const s=this.puck;e.stats.touches++,this.emit("save",{side:e.side,uid:e.uid,shooter:t.uid}),s.shot=null,s.icing=null;const i=this.teams[e.side];if(this.rng.chance(this.rules.faceoffs?.4:.35)){this.goalieTakes(e);return}const a=i.attackDir();s.vx=this.rng.range(-14,14)*this.rules.speed,s.vy=a*this.rng.range(6,14)*this.rules.speed,s.lastTouch={side:e.side,uid:e.uid,y:e.y}}goalieTakes(e){const t=this.puck;if(t.shot=null,t.icing=null,t.lastTouch={side:e.side,uid:e.uid,y:e.y},this.rules.faceoffs){t.vx=0,t.vy=0;const l=this.zoneDots(e.side,"defensive");this.emit("freeze",{side:e.side,uid:e.uid}),this.whistle("freeze",{type:"faceoff",x:l.x,y:l.y});return}const s=this.teams[e.side].onIceSkaters();if(s.length===0)return;const i=s.reduce((l,c)=>R(l,e)<R(c,e)?l:c),a=i.x-t.x,n=i.y-t.y,o=Math.hypot(a,n)||1,h=22*Math.sqrt(this.rules.speed);t.x=e.x+a/o*2.5,t.y=e.y+n/o*2.5,t.vx=a/o*h,t.vy=n/o*h,t.pass={from:e.uid,to:i.uid,side:e.side},e.cooldown.pickup=1.2,this.emit("goalie-pass",{side:e.side})}checkPickup(){const e=this.puck;if(e.carrier||e.z>1.5)return;let t=null,s=1/0;for(const i of this.allOnIce()){if(i.isGoalie||i.stun>0||i.fighting||i.cooldown.pickup>0)continue;const a=e.pass&&e.pass.to===i.uid,n=us+i.rating.hands/120+(a?1:0),o=R(i,e);o>n||Math.hypot(e.vx-i.vx,e.vy-i.vy)>(a?85:55)*Math.max(.6,this.rules.speed)||o<s&&(s=o,t=i)}t&&this.takePuck(t)}checkOffside(e){if(!this.rules.offsides)return;const t=this.puck;if(!t.lastTouch)return;const s=this.rules.surface,i=t.lastTouch.side,a=this.teams[i],n=a.attackDir(),o=n<0?s.blueLines:s.length-s.blueLines;if(!(n<0?e>=o&&t.y<o:e<=o&&t.y>o))return;const h=a.onIceSkaters().find(c=>n<0?c.y<o-1:c.y>o+1);if(!h)return;const l={x:t.x<s.width/2?s.width/2-22:s.width/2+22,y:o-n*5};this.emit("offside",{side:i,uid:h.uid}),this.whistle("offside",{type:"faceoff",x:l.x,y:l.y},{side:i})}checkIcing(e){const t=this.puck;if(!t.icing||t.carrier)return;const s=t.icing.side,i=this.teams[s],a=i.targetNetY();if(!(i.attackDir()<0?e>a&&t.y<=a:e<a&&t.y>=a))return;t.icing=null;const n=this.zoneDots(s,"defensive");this.emit("icing",{side:s}),this.whistle("icing",{type:"faceoff",x:n.x,y:n.y},{side:s})}goal(e){const t=this.puck,s=this.attackerOfNet(e),i=this.teams[s],a=this.teams[this.other(s)];i.score++;const n=t.chain.slice(),o=t.lastTouch&&t.lastTouch.side===s?t.lastTouch.uid:null,h=o?this.findEntity(o):null,l=[];if(h&&t.lastTouch.side===s)for(let u=n.length-2;u>=0&&l.length<2;u--){const p=this.findEntity(n[u]);p&&p.side===s&&p!==h&&!l.includes(p)&&l.push(p)}h&&h.stats.goals++,l.forEach(u=>u.stats.assists++);const c=i.strength()>a.strength();if(c){const u=a.box.findIndex(p=>!X[p.type].ejection);if(u>=0){const p=a.box.splice(u,1)[0],f=this.findEntity(p.uid);f&&(f.inBox=!1),this.emit("penalty-over",{side:a.side,uid:p.uid})}}this.pending=this.pending.filter(u=>u.offender.side===s);const d=h?h.exposure:0;this.emit("goal",{side:s,scorer:h?h.uid:null,scorerName:h?h.player.name:"Own goal",scorerNumber:h?h.player.number:null,assists:l.map(u=>u.uid),ppg:c,keepScore:this.rules.keepScore,viral:h?this.rng.chance(.25+d/200):!1,home:this.teams.home.score,away:this.teams.away.score}),h&&this.maybeStandsFight(h,a.goalie,.06),this.phase="goal",this.phaseTimer=2.6,t.carrier=null,t.shot=null,t.pass=null,t.icing=null,t.vx*=.2,t.vy*=.2,this.nextRestart=this.rules.faceoffs?{type:"faceoff",x:this.centerDot().x,y:this.centerDot().y}:{type:"restart",side:a.side},this.period>this.rules.periods&&this.endGame("overtime",s)}endPeriod(){this.emit("period-end",{period:this.period}),this.pending=[];const e=this.teams.home.score===this.teams.away.score;if(this.period<this.rules.periods){this.beginIntermission();return}if(this.period===this.rules.periods&&this.rules.needWinner&&e){this.period++,this.clock=this.rules.periodSeconds,this.emit("overtime"),this.startFaceoff(this.centerDot());return}if(this.period>this.rules.periods&&e){const t=this.teams.home.skaters().reduce((a,n)=>a+n.rating.shot,0)/this.teams.home.skaters().length,s=this.teams.away.skaters().reduce((a,n)=>a+n.rating.shot,0)/this.teams.away.skaters().length,i=this.rng.chance(C(.5+(t-this.teams.away.goalie.rating.reflex-(s-this.teams.home.goalie.rating.reflex))*.01,.2,.8));this.emit("shootout",{winner:i?"home":"away"}),this.endGame("shootout",i?"home":"away");return}this.endGame("final",null)}beginIntermission(){this.phase="intermission";const e=this.opts.focusSide||"home",t=this.teams[e],s=this.rng.weighted(ct),i=s.subject(t)||null;this.intermission={id:s.id,side:e,subject:i?i.uid:null,title:s.title,body:s.body(i),choices:s.choices.map(a=>a.label)},this.emit("intermission",Object.assign({},this.intermission)),this.opts.autoIntermission&&this.chooseIntermission(this.rng.int(0,s.choices.length-1))}chooseIntermission(e){if(!this.intermission)return null;const t=ct.find(o=>o.id===this.intermission.id),s=t.choices[C(e,0,t.choices.length-1)],i=this.teams[this.intermission.side],a=this.intermission.subject?this.findEntity(this.intermission.subject):null;s.apply(this,i,a),this.crowd.mood=C(this.crowd.mood,0,1),i.chemistry=C(i.chemistry,-.3,.5);const n=s.result(a);this.emit("intermission-choice",{id:t.id,choice:s.label,result:n}),this.intermission=null,this.period++,this.clock=this.rules.periodSeconds,this.buzzerTimer=this.rules.buzzer;for(const o of["home","away"])this.teams[o].changeLine(!1),this.teams[o].entities.forEach(h=>{h.onIce||(h.stamina=C(h.stamina+.4,0,1))});return this.emit("period-start",{period:this.period}),this.startFaceoff(this.centerDot()),n}endGame(e,t){const s=this.teams.home.score,i=this.teams.away.score;let a=t;!a&&s!==i&&(a=s>i?"home":"away"),this.phase="final",this.result={reason:e,winner:a||null,home:s,away:i,keepScore:this.rules.keepScore},this.emit("final",Object.assign({},this.result))}snapshot(){const e=this.puck,t=this.allOnIce().map(s=>({uid:s.uid,side:s.side,number:s.player.number,skin:s.player.skin,hand:s.player.hand,x:s.x,y:s.y,vx:s.vx,vy:s.vy,dir:s.dir,goalie:s.isGoalie,stun:s.stun>0,fighting:s.fighting,puck:e.carrier===s,controller:s.controller,exposure:s.exposure}));return{t:this.time,phase:this.phase,period:this.period,clock:Math.max(0,this.clock),surface:this.rules.surface.id,skaters:t,puck:{x:e.x,y:e.y,z:e.z,uid:e.carrier?e.carrier.uid:null},score:{home:this.teams.home.score,away:this.teams.away.score},strength:{home:this.teams.home.strength(),away:this.teams.away.strength()},box:{home:this.teams.home.box.map(s=>({uid:s.uid,remaining:s.remaining})),away:this.teams.away.box.map(s=>({uid:s.uid,remaining:s.remaining}))},delayed:this.pending.length?this.pending[0].offender.side:null,dir:{home:this.teams.home.attackDir(),away:this.teams.away.attackDir()}}}clockLabel(){const e=Math.max(0,this.clock/this.rules.periodSeconds*this.rules.periodMinutes*60),t=Math.floor(e/60),s=Math.floor(e%60);return`${t}:${s<10?"0":""}${s}`}}const ps=(r,e)=>{const t=new ft(Object.assign({autoIntermission:!0},r)),s=1/60;let i=0;const a=[],n=3600*60;for(;t.phase!=="final"&&i<n;){t.step(s,null);const o=t.drainEvents();for(const h of o)a.push(h);i++}return{game:t,events:a,result:t.result,steps:i}};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const fs=12,ms=15,gs={down:["....hhhh....","...hhhhhh...","...hffffh...","...vfefev...","....ffff....","..tjjjjjjt..",".gjjjjjjjjg.",".gjjssssjjg.","..jjjjjjjj..","..tttttttt..","..pppppppp.."],up:["....hhhh....","...hhhhhh...","...hhhhhh...","...hhhhhh...","....ffff....","..tjjjjjjt..",".gjjjjjjjjg.",".gjjjjjjjjg.","..jjjjjjjj..","..tttttttt..","..pppppppp.."],side:["....hhhh....","...hhhhhh...","...hhhfff...","...hhfefv...","....hfffv...","...jjjjjt...","..jjjjjjjg..","..jjjjjjjg..","..sssssss...","..ttttttt...","..ppppppp..."]},ys={down:[["..ppp..ppp..","..pp....pp..","..kk....kk..",".bbb....bbb."],["..ppp..ppp..","...pp..pp...","...kk..kk...","..bbb..bbb.."]],up:[["..ppp..ppp..","..pp....pp..","..kk....kk..",".bbb....bbb."],["..ppp..ppp..","...pp..pp...","...kk..kk...","..bbb..bbb.."]],side:[["...pp.pp....","...pp..pp...","...kk..kk...","..bbb..bbbb."],["..pp...pp...","..pp....pp..","..kk....kk..",".bbb....bbbb"]]},bs={down:["....hhhh....","...hhhhhh...","...hvvvvh...","...hvfvfh...","....vvvv....",".tjjjjjjjjt.","gjjjjjjjjjjg","gjjjsssjjjjg",".jjjjjjjjjj.",".tttttttttt.",".wwwwppwwww.",".wwww..wwww.",".wtww..wwtw.",".wwww..wwww.",".kkkk..kkkk."],up:["....hhhh....","...hhhhhh...","...hhhhhh...","...hhhhhh...","....hhhh....",".tjjjjjjjjt.","gjjjjjjjjjjg","gjjjjjjjjjjg",".jjjjjjjjjj.",".tttttttttt.",".wwwwppwwww.",".wwww..wwww.",".wtww..wwtw.",".wwww..wwww.",".kkkk..kkkk."]},xs={0:["###","#.#","#.#","#.#","###"],1:[".#.","##.",".#.",".#.","###"],2:["###","..#","###","#..","###"],3:["###","..#",".##","..#","###"],4:["#.#","#.#","###","..#","..#"],5:["###","#..","###","..#","###"],6:["###","#..","###","#.#","###"],7:["###","..#",".#.",".#.",".#."],8:["###","#.#","###","#.#","###"],9:["###","#.#","###","..#","###"]},vs=(r,e)=>{const t=parseInt(r.slice(1),16),s=Math.max(0,Math.min(255,(t>>16&255)+e)),i=Math.max(0,Math.min(255,(t>>8&255)+e)),a=Math.max(0,Math.min(255,(t&255)+e));return`#${(1<<24|s<<16|i<<8|a).toString(16).slice(1)}`},ze=r=>r.length===4?`#${r[1]}${r[1]}${r[2]}${r[2]}${r[3]}${r[3]}`:r,ws=(r,e)=>({h:r.helmet,f:e,e:"#222222",v:"#cfd8dc",j:r.jersey,t:r.trim,s:r.stripe,g:vs(ze(r.pants),30),p:r.pants,k:"#222222",b:"#e8eef2",w:"#f4f4f4"}),ks=(r,e)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(r,e);const t=globalThis.document.createElement("canvas");return t.width=r,t.height=e,t},$s=(r,e,t)=>{const s=r.getImageData(0,0,e,t).data,i=(n,o)=>n>=0&&o>=0&&n<e&&o<t&&s[(o*e+n)*4+3]>0,a=[];for(let n=0;n<t;n++)for(let o=0;o<e;o++)i(o,n)||(i(o-1,n)||i(o+1,n)||i(o,n-1)||i(o,n+1))&&a.push([o,n]);r.fillStyle="rgba(16, 20, 32, 0.75)",a.forEach(([n,o])=>r.fillRect(n,o,1,1))},De=new Map,_s=(r,e,t,s,i,a)=>{const n=`${r.jersey}${r.trim}${r.helmet}${r.stripe}${r.pants}|${e}|${t}|${s}|${i}|${a?1:0}`;if(De.has(n))return De.get(n);const o=14,h=17,l=ks(o,h),c=l.getContext("2d"),d=ws(r,e);let u;if(a?u=bs[t==="up"?"up":"down"]:u=gs[t].concat(ys[t][s%2]),u.forEach((p,f)=>{for(let m=0;m<p.length;m++){const g=p[m];g!=="."&&(c.fillStyle=d[g],c.fillRect(m+1,f+1,1,1))}}),t==="up"&&i!==void 0&&i!==null){const p=String(i).split(""),f=p.length*4-1;let m=1+Math.round((12-f)/2);c.fillStyle=r.number,p.forEach(g=>{xs[g].forEach((b,k)=>{for(let $=0;$<3;$++)b[$]==="#"&&c.fillRect(m+$,6+k,1,1)}),m+=4})}return $s(c,o,h),De.set(n,l),l},Ss=(r,e)=>{const t=parseInt(ze(r).slice(1),16),s=parseInt(ze(e).slice(1),16),i=(t>>16&255)-(s>>16&255),a=(t>>8&255)-(s>>8&255),n=(t&255)-(s&255);return Math.sqrt(i*i+a*a+n*n)};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const mt={A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],B:["####.","#...#","#...#","####.","#...#","#...#","####."],C:[".###.","#...#","#....","#....","#....","#...#",".###."],D:["####.","#...#","#...#","#...#","#...#","#...#","####."],E:["#####","#....","#....","####.","#....","#....","#####"],F:["#####","#....","#....","####.","#....","#....","#...."],G:[".###.","#...#","#....","#.###","#...#","#...#",".####"],H:["#...#","#...#","#...#","#####","#...#","#...#","#...#"],I:[".###.","..#..","..#..","..#..","..#..","..#..",".###."],J:["..###","...#.","...#.","...#.","...#.","#..#.",".##.."],K:["#...#","#..#.","#.#..","##...","#.#..","#..#.","#...#"],L:["#....","#....","#....","#....","#....","#....","#####"],M:["#...#","##.##","#.#.#","#.#.#","#...#","#...#","#...#"],N:["#...#","##..#","#.#.#","#..##","#...#","#...#","#...#"],O:[".###.","#...#","#...#","#...#","#...#","#...#",".###."],P:["####.","#...#","#...#","####.","#....","#....","#...."],Q:[".###.","#...#","#...#","#...#","#.#.#","#..#.",".##.#"],R:["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],S:[".####","#....","#....",".###.","....#","....#","####."],T:["#####","..#..","..#..","..#..","..#..","..#..","..#.."],U:["#...#","#...#","#...#","#...#","#...#","#...#",".###."],V:["#...#","#...#","#...#","#...#","#...#",".#.#.","..#.."],W:["#...#","#...#","#...#","#.#.#","#.#.#","##.##","#...#"],X:["#...#","#...#",".#.#.","..#..",".#.#.","#...#","#...#"],Y:["#...#","#...#",".#.#.","..#..","..#..","..#..","..#.."],Z:["#####","....#","...#.","..#..",".#...","#....","#####"],0:[".###.","#...#","#..##","#.#.#","##..#","#...#",".###."],1:["..#..",".##..","..#..","..#..","..#..","..#..",".###."],2:[".###.","#...#","....#","...#.","..#..",".#...","#####"],3:["####.","....#","....#",".###.","....#","....#","####."],4:["...#.","..##.",".#.#.","#..#.","#####","...#.","...#."],5:["#####","#....","####.","....#","....#","#...#",".###."],6:[".###.","#....","#....","####.","#...#","#...#",".###."],7:["#####","....#","...#.","..#..",".#...",".#...",".#..."],8:[".###.","#...#","#...#",".###.","#...#","#...#",".###."],9:[".###.","#...#","#...#",".####","....#","....#",".###."]," ":[".....",".....",".....",".....",".....",".....","....."],".":[".....",".....",".....",".....",".....",".##..",".##.."],",":[".....",".....",".....",".....",".##..","..#..",".#..."],":":[".....",".##..",".##..",".....",".##..",".##..","....."],"!":["..#..","..#..","..#..","..#..","..#..",".....","..#.."],"?":[".###.","#...#","....#","...#.","..#..",".....","..#.."],"-":[".....",".....",".....",".###.",".....",".....","....."],"'":["..#..","..#..",".#...",".....",".....",".....","....."],'"':[".#.#.",".#.#.",".....",".....",".....",".....","....."],$:["..#..",".####","#.#..",".###.","..#.#","####.","..#.."],"#":[".#.#.",".#.#.","#####",".#.#.","#####",".#.#.",".#.#."],"/":["....#","....#","...#.","..#..",".#...","#....","#...."],"&":[".##..","#..#.","#.#..",".#...","#.#.#","#..#.",".##.#"],"(":["...#.","..#..",".#...",".#...",".#...","..#..","...#."],")":[".#...","..#..","...#.","...#.","...#.","..#..",".#..."],"+":[".....","..#..","..#..","#####","..#..","..#..","....."],"%":["##..#","##..#","...#.","..#..",".#...","#..##","#..##"],"\xBD":["#....","#...#","#..#.","..#..",".#.##","#...#","...##"],"\u2153":["#....","#...#","#..#.","..#..",".#.##","#...#","...##"]},Ge=5,js=7,Ne=(r,e)=>{const t=e||1;return String(r).length*(Ge+1)*t-t},I=(r,e,t,s,i,a)=>{const n=a||{},o=n.scale||1,h=String(e).toUpperCase();let l=t;const c=Ne(h,o);n.align==="center"?l=Math.round(t-c/2):n.align==="right"&&(l=Math.round(t-c));const d=(u,p,f)=>{r.fillStyle=f;for(let m=0;m<h.length;m++){const g=mt[h[m]]||mt["?"];for(let b=0;b<js;b++){const k=g[b];for(let $=0;$<Ge;$++)k[$]==="#"&&r.fillRect(l+u+(m*(Ge+1)+$)*o,s+p+b*o,o,o)}}};return n.shadow&&d(o,o,n.shadow),d(0,0,i),c};/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const gt={"b-squad":{w:15,h:15,palette:{a:"#111",b:"#7a7a7a",c:"#ff3fa4"},rows:[".....ccccc.....","...cccaacccc...","..caaccccccac..",".caccaaaaacccc.","caacaaaaaaacaac","caaaacaaacaaaac","aaaaacaccaaaaaa","aaaaacacacaaaaa","aaaabcaccaaaaaa","caabacaaaabaaaa","caaabacaaabaaac",".caaabaaaaaaac.","..aaaaaaaaaca..","...caaaaacac...",".....caaacc...."]},icers:{w:21,h:12,palette:{a:"#1d3a78",b:"#9fb3d1",c:"#fff"},rows:["...cc............c...","....cc.........cc....",".....cc.......cc.....","..ccaccacccccccacccc.","..ccccaaccaacccacccc.",".ccccccccccacccccccca","accaaaacaaaaacaaacccc",".aa...ccaaaaacc...aa.",".caacca.caaaa..ccaac.",".....a..aabbaaa......","..........b...b......","..........a.........."]},"saber-cats":{w:18,h:17,palette:{a:"#111",b:"#6b6b70",c:"#8dff3a",d:"#f2f2f2"},rows:["....aaaaaaaa......","....aaaaaaaa......",".aaaadaaadaa......",".acaadddadaaa.....","aaacaaaaaabaaa....","aaaadaadaaaaaaa...","aaaaddaaaaacccaaaa","aaaadddaaaaaaaaaca","aaaaaaaaaaaaaacaca",".aadaaaaaaaaacaaaa",".accaddddaaaddaaa.","aadddddddaaddddca.","acdddddddadddddca.","acddddaacaaaaadda.","acaaccacaaaccddca.","aacaaaaaaaaaaaaca.",".aaa........aaaaa."]},"sparkle-selects":{w:16,h:15,palette:{a:"#111",b:"#2e80ff",c:"#ff3fa4",d:"#ffde46",e:"#fff"},rows:["eee...eeeeeeeee.","eceeeeeccccacae.","ecaecccccccccce.","eecccccccccccaee",".eacaccaddadddde",".eaddddddddcbdae",".eadddddddddddae",".eaaddddddaabbbe",".eddacabbabbbabe",".eaaaccaaaaaaaee",".eeeaacaaaaaeee.","...eeabbdaaee...","....edbbddee....","....eeddeee.....",".....eeee......."]}},fe=(r,e,t,s,i,a)=>{const n=gt[e];n&&(r.save(),typeof a=="number"&&(r.globalAlpha=a),n.rows.forEach((o,h)=>{for(let l=0;l<o.length;l++){const c=o[l];c!=="."&&(r.fillStyle=n.palette[c],r.fillRect(Math.round(t+l*i),Math.round(s+h*i),Math.ceil(i),Math.ceil(i)))}}),r.restore())},me={kb:"#ff5252",touch:"#ff5252",pad0:"#ff5252",pad1:"#40c4ff",pad2:"#69f0ae",pad3:"#ffd740"},Ue={kb:"1",touch:"1",pad0:"1",pad1:"2",pad2:"3",pad3:"4"},Be=16,Ms="#eef4f8",D="#d8343c",ge="#2a5bd7",Ts=(r,e)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(r,e);const t=globalThis.document.createElement("canvas");return t.width=r,t.height=e,t},yt=r=>{let e=r;return()=>(e=e*1103515245+12345&2147483647,e/2147483647)};class ye{constructor(e,t){this.canvas=e,this.ctx=e.getContext("2d"),this.ctx.imageSmoothingEnabled=!1,this.opts=Object.assign({hud:!0},t||{}),this.camY=null,this.stride=new Map,this.lastPos=new Map,this.rinkCache=new Map,this.teams=null,this.rules=null}setMatch(e,t){this.rules=e,this.teams=t,this.camY=null,this.stride.clear(),this.lastPos.clear()}get W(){return this.canvas.width}get H(){return this.canvas.height}get viewTop(){return this.opts.hud?Be:0}scaleFor(e){return this.opts.zoom?this.opts.zoom:Math.max(1,(this.W-60)/e.width)}rinkLayer(e,t,s){const i=`${e}|${t}|${s}|${this.rules?this.rules.net.width:6}`;if(this.rinkCache.has(i))return this.rinkCache.get(i);const a=ce[e],n=6,o=Math.round(a.width*t)+n*2,h=Math.round(a.length*t)+n*2,l=Ts(o,h),c=l.getContext("2d");c.imageSmoothingEnabled=!1;const d=x=>n+x*t,u=x=>n+x*t,p=a.cornerRadius*t,f=(x,w,_,j,S)=>{c.beginPath(),c.moveTo(x+S,w),c.arcTo(x+_,w,x+_,w+j,S),c.arcTo(x+_,w+j,x,w+j,S),c.arcTo(x,w+j,x,w,S),c.arcTo(x,w,x+_,w,S),c.closePath()};f(n-4,n-4,a.width*t+8,a.length*t+8,p+4),c.fillStyle="#2b3a55",c.fill(),f(n-2,n-2,a.width*t+4,a.length*t+4,p+2),c.fillStyle="#f2c94c",c.fill(),f(n,n,a.width*t,a.length*t,p),c.fillStyle=e==="roller"?"#d9dde6":Ms,c.fill(),c.save(),f(n,n,a.width*t,a.length*t,p),c.clip();const m=yt(7+a.length);for(let x=0;x<a.width*a.length/18;x++)c.fillStyle=m()>.5?"rgba(255,255,255,0.6)":"rgba(150,170,190,0.18)",c.fillRect(Math.floor(n+m()*a.width*t),Math.floor(n+m()*a.length*t),Math.ceil(m()*3),1);const g=(x,w,_)=>{c.fillStyle=w,c.fillRect(n,Math.round(u(x)-_/2),a.width*t,_)},b=(x,w,_,j,S)=>{c.beginPath(),c.arc(d(x),u(w),_*t,0,Math.PI*2),S?(c.fillStyle=j,c.fill()):(c.strokeStyle=j,c.lineWidth=1,c.stroke())},k=Math.max(2,Math.round(t));if(a.centerLine&&(g(a.length/2,D,k),b(a.width/2,a.length/2,15,ge)),b(a.width/2,a.length/2,.8,ge,!0),a.blueLines&&(g(a.blueLines,ge,k+1),g(a.length-a.blueLines,ge,k+1)),g(a.goalLine,D,1),g(a.length-a.goalLine,D,1),e==="full"||e==="roller"){const x=Math.min(20,a.length*.2);for(const w of[a.goalLine+x,a.length-a.goalLine-x])for(const _ of[a.width/2-22,a.width/2+22])b(_,w,15,D),b(_,w,1,D,!0);if(a.blueLines)for(const w of[a.blueLines+5,a.length-a.blueLines-5])for(const _ of[a.width/2-22,a.width/2+22])b(_,w,1,D,!0)}const $=this.rules?this.rules.net:ht.regulation,A=$.width===4?4.5:6;for(const[x,w]of[[a.goalLine,1],[a.length-a.goalLine,-1]])c.beginPath(),c.arc(d(a.width/2),u(x),A*t,w>0?0:Math.PI,w>0?Math.PI:Math.PI*2),c.closePath(),c.fillStyle="rgba(110, 180, 255, 0.45)",c.fill(),c.strokeStyle=D,c.lineWidth=1,c.stroke();if(s){const x=Math.max(1,Math.round(t*.55));fe(c,s,d(a.width/2)-8*x,u(a.length/2)-8*x,x,.35)}c.restore();for(const[x,w]of[[a.goalLine,-1],[a.length-a.goalLine,1]]){const _=d(a.width/2-$.width/2),j=d(a.width/2+$.width/2),S=u(x),O=u(x+w*$.depth),T=Math.min(S,O),M=Math.abs(O-S);c.fillStyle="rgba(255,255,255,0.85)",c.fillRect(Math.round(_),Math.round(T),Math.round(j-_),Math.round(M)),c.fillStyle="rgba(120,130,150,0.6)";for(let L=Math.round(T)+1;L<T+M;L+=2)for(let W=Math.round(_)+(L&2?1:0);W<j;W+=2)c.fillRect(W,L,1,1);c.strokeStyle=D,c.lineWidth=1,c.strokeRect(Math.round(_)+.5,Math.round(T)+.5,Math.round(j-_)-1,Math.round(M)-1),c.fillStyle=D,c.fillRect(Math.round(_)-1,Math.round(S)-1,2,2),c.fillRect(Math.round(j)-1,Math.round(S)-1,2,2)}const P={canvas:l,pad:n,scale:t,w:o,h};return this.rinkCache.set(i,P),P}drawStands(e,t){const s=this.ctx;s.fillStyle="#141826",s.fillRect(0,e,this.W,t);const i=yt(99),a=["#3a4466","#5a3a66","#665a3a","#3a665a","#6b2a3a","#2a4a6b"];for(let n=e;n<e+t;n+=3)for(let o=0;o<this.W;o+=3)i()>.55&&(s.fillStyle=a[Math.floor(i()*a.length)],s.fillRect(o,n,2,2))}draw(e,t){const s=t||{},i=this.ctx,a=ce[e.surface],n=this.scaleFor(a),o=this.teams?this.teams.home.crest:null,h=this.rinkLayer(e.surface,n,o),l=this.viewTop,c=this.H-l,d=h.w,u=h.h,p=Math.round((this.W-d)/2),f=s.follow||e.puck,m=f.y*n+h.pad-c/2,g=u-c;let b=g<=0?g/2:Math.max(0,Math.min(g,m));this.camY===null||s.snapCamera?this.camY=b:this.camY+=(b-this.camY)*Math.min(1,(s.dt||1/60)*6),b=Math.round(this.camY);let k=0;if(d>this.W){const M=f.x*n+h.pad-this.W/2;k=Math.round(Math.max(0,Math.min(d-this.W,M)))}const $=s.shake?Math.round(Math.sin(e.t*70)*s.shake):0,A=s.shake?Math.round(Math.cos(e.t*53)*s.shake):0,P=(d>this.W?-k:p)+$,x=l-b+A;i.save(),i.beginPath(),i.rect(0,l,this.W,c),i.clip(),this.drawStands(l,c),i.drawImage(h.canvas,P,x);const w=M=>Math.round(P+h.pad+M*n),_=M=>Math.round(x+h.pad+M*n),j=e.skaters.slice().sort((M,L)=>M.y-L.y),S=e.puck;let O=!1;const T=()=>{const M=w(S.x),L=_(S.y);S.z>.2&&(i.fillStyle="rgba(0,0,0,0.25)",i.fillRect(M-1,L,3,1));const W=Math.round(S.z*n*.6);i.fillStyle="#111111",i.fillRect(M-1,L-1-W,3,2),i.fillStyle="#5a5a5a",i.fillRect(M-1,L-1-W,3,1),O=!0};for(const M of j)!O&&S.y<M.y&&!S.uid&&T(),this.drawSkater(M,w(M.x),_(M.y),e,s.dt||1/60),S.uid===M.uid&&T();O||T(),i.restore(),this.opts.hud&&this.drawHud(e),s.banner&&this.drawBanner(s.banner,s.bannerColor,s.sub)}viewFor(e,t){if(e.goalie){const a=ce[t.surface];return{view:e.y>a.length/2?"up":"down",flip:!1}}const s=Math.cos(e.dir),i=Math.sin(e.dir);return Math.abs(i)>Math.abs(s)*.8?{view:i<0?"up":"down",flip:!1}:{view:"side",flip:s<0}}drawSkater(e,t,s,i,a){const n=this.ctx,o=this.teams?this.teams[e.side]:null,h=o?o.kit:{jersey:"#888",trim:"#fff",stripe:"#444",number:"#fff",helmet:"#222",pants:"#222"},l=this.lastPos.get(e.uid),c=l?Math.hypot(e.x-l.x,e.y-l.y):0;this.lastPos.set(e.uid,{x:e.x,y:e.y});const d=(this.stride.get(e.uid)||0)+(c<20?c:0);this.stride.set(e.uid,d);const u=Math.floor(d/2.2)%2,{view:p,flip:f}=this.viewFor(e,i),m=_s(h,e.skin,p,e.goalie?0:u,e.number,e.goalie),g=fs+2,b=ms+2;n.fillStyle="rgba(20, 40, 70, 0.22)",n.fillRect(t-4,s-1,9,2),e.controller&&me[e.controller]&&(n.fillStyle=me[e.controller],n.fillRect(t-5,s,11,1),n.fillRect(t-4,s+1,9,1));const k=p==="up",$=Math.cos(e.dir),A=Math.sin(e.dir),P=()=>{if(e.goalie){n.fillStyle="#8b5a2b";const T=t+(p==="up"?-6:3);n.fillRect(T,s-2,4,1);return}const w=t+(e.hand==="L"?-2:2),_=s-6,j=7;n.fillStyle="#a0522d";for(let T=0;T<j;T++)n.fillRect(Math.round(w+$*T),Math.round(_+A*T*.8+T*.5),1,1);const S=Math.round(w+$*j),O=Math.round(_+A*j*.8+j*.5);n.fillStyle="#222222",n.fillRect(S-1,O,3,1)};if(e.stun){n.save(),n.translate(t,s-3),n.rotate(Math.PI/2),n.drawImage(m,-Math.floor(g/2),-Math.floor(b/2)),n.restore();return}let x=0;if(e.fighting&&(x=Math.round(Math.sin(i.t*40+e.uid)*1.5)),k&&P(),f?(n.save(),n.translate(t+x,0),n.scale(-1,1),n.drawImage(m,-Math.floor(g/2),s-b+1),n.restore()):n.drawImage(m,t+x-Math.floor(g/2),s-b+1),k||P(),e.fighting){n.fillStyle="#ffffff";const w=Math.floor(i.t*12)%4;n.fillRect(t-6+w,s-b-2,2,2),n.fillRect(t+4-w,s-b,2,2)}if(e.controller&&Ue[e.controller]){const w=me[e.controller];I(n,Ue[e.controller],t,s-b-8,w,{align:"center",shadow:"#10131c"})}}drawHud(e){const t=this.ctx;t.fillStyle="#10131c",t.fillRect(0,0,this.W,Be),t.fillStyle="#f2c94c",t.fillRect(0,Be-1,this.W,1);const s=this.rules,i=this.teams;if(!s||!i)return;const a=s.keepScore,n=4;fe(t,i.home.crest,3,1,.8),I(t,i.home.short,19,n,i.home.kit.jersey==="#111111"||i.home.kit.jersey==="#151217"?i.home.kit.trim:i.home.kit.jersey,{shadow:"#000"}),fe(t,i.away.crest,this.W-16,1,.8),I(t,i.away.short,this.W-19,n,i.away.kit.jersey==="#111111"||i.away.kit.jersey==="#151217"?i.away.kit.trim:i.away.kit.jersey,{align:"right",shadow:"#000"}),a&&(I(t,e.score.home,42,n,"#ffffff",{shadow:"#000"}),I(t,e.score.away,this.W-42,n,"#ffffff",{align:"right",shadow:"#000"}));const o=e.period>s.periods?"OT":["1ST","2ND","3RD"][e.period-1]||`${e.period}`,h=Math.max(0,e.clock/s.periodSeconds*s.periodMinutes*60),l=Math.floor(h/60),c=Math.floor(h%60),d=`${l}:${c<10?"0":""}${c}`;I(t,`${o} ${d}`,this.W/2,n,"#f2c94c",{align:"center",shadow:"#000"});const u=[],p=e.strength.home,f=e.strength.away;if(p!==f){const m=p>f?i.home.short:i.away.short;u.push(`${m} POWER PLAY ${Math.max(p,f)}V${Math.min(p,f)}`)}if(e.delayed&&u.push(`DELAYED PENALTY ${i[e.delayed].short}`),u.length){const m=u.join("  "),g=Ne(m,1)+8;t.fillStyle="rgba(16, 19, 28, 0.8)",t.fillRect(Math.round(this.W/2-g/2),this.H-12,g,11),I(t,m,this.W/2,this.H-10,"#ffffff",{align:"center"})}}drawBanner(e,t,s){const i=this.ctx,a=String(e).split(`
`),n=2,o=a.length*9*n+(s?12:0)+8,h=Math.round(this.viewTop+(this.H-this.viewTop)*.36-o/2);i.fillStyle="rgba(16, 19, 28, 0.78)",i.fillRect(0,h,this.W,o),i.fillStyle=t||"#f2c94c",i.fillRect(0,h,this.W,1),i.fillRect(0,h+o-1,this.W,1),a.forEach((l,c)=>{const d=Ne(l,n)>this.W-8?1:n;I(i,l,this.W/2,h+4+c*9*n+(n-d)*3,t||"#f2c94c",{align:"center",scale:d,shadow:"#000"})}),s&&I(i,s,this.W/2,h+o-11,"#ffffff",{align:"center",shadow:"#000"})}}/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const Fe=r=>{const e=/^([A-G])([#b]?)(\d)$/.exec(r);if(!e)return 0;const t={C:-9,D:-7,E:-5,F:-4,G:-2,A:0,B:2}[e[1]],s=e[2]==="#"?1:e[2]==="b"?-1:0,i=t+s+(parseInt(e[3],10)-4)*12;return 440*Math.pow(2,i/12)},bt={goal:[["C5",.5],["E5",.5],["G5",.5],["C6",1],[null,.25],["G5",.5],["C6",1.5]],rally:[["G4",.5],["G4",.5],["B4",.5],["D5",.5],[null,.5],["B4",.5],["D5",1.5]],penalty:[["E5",.25],["D#5",.25],["E5",.25],["B4",.75]],period:[["C5",.75],["G4",.75],["E4",.75],["C4",1.5]],money:[["C6",.25],["E6",.25],["G6",.5]]},be={bpm:132,lead:[["E5",1],["G5",.5],["A5",.5],["G5",1],["E5",1],["D5",1],["E5",.5],["G5",.5],["E5",2],["C5",1],["D5",.5],["E5",.5],["G5",1],["A5",1],["G5",1],["E5",.5],["D5",.5],["C5",2]],bass:[["C3",1],["C3",1],["G2",1],["G2",1],["A2",1],["A2",1],["E2",1],["E2",1],["F2",1],["F2",1],["C3",1],["C3",1],["G2",1],["G2",1],["C3",1],["C3",1]]};class Es{constructor(){this.ctx=null,this.master=null,this.crowdGain=null,this.muted=!1,this.loopTimer=null;try{this.muted=globalThis.localStorage.getItem("youth-hockey-27:muted")==="1"}catch{this.muted=!1}}start(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const e=globalThis.AudioContext||globalThis.webkitAudioContext;e&&(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:.5,this.master.connect(this.ctx.destination),this.startCrowd())}setMuted(e){this.muted=e;try{globalThis.localStorage.setItem("youth-hockey-27:muted",e?"1":"0")}catch{}this.master&&this.master.gain.setTargetAtTime(e?0:.5,this.ctx.currentTime,.05)}get ready(){return!!this.ctx}tone(e,t,s,i,a,n){const o=n||{},h=this.ctx.createOscillator(),l=this.ctx.createGain();if(h.type=e,h.frequency.setValueAtTime(t,s),o.slideTo&&h.frequency.exponentialRampToValueAtTime(o.slideTo,s+i),o.vibrato){const d=this.ctx.createOscillator(),u=this.ctx.createGain();d.frequency.value=o.vibrato,u.gain.value=t*.03,d.connect(u),u.connect(h.frequency),d.start(s),d.stop(s+i+.05)}l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(a,s+Math.min(.02,i/4)),l.gain.setValueAtTime(a,s+i*(o.hold||.7)),l.gain.exponentialRampToValueAtTime(1e-4,s+i);let c=h;if(o.filter){const d=this.ctx.createBiquadFilter();d.type="lowpass",d.frequency.value=o.filter,h.connect(d),c=d}c.connect(l),l.connect(o.dest||this.master),h.start(s),h.stop(s+i+.05)}noiseBuffer(){if(this._noise)return this._noise;const e=this.ctx.sampleRate,t=this.ctx.createBuffer(1,e,this.ctx.sampleRate),s=t.getChannelData(0);let i=12345;for(let a=0;a<e;a++)i=i*1103515245+12345&2147483647,s[a]=i/2147483647*2-1;return this._noise=t,t}burst(e,t,s,i,a){const n=this.ctx.createBufferSource();n.buffer=this.noiseBuffer();const o=this.ctx.createBiquadFilter();o.type=a||"bandpass",o.frequency.value=i;const h=this.ctx.createGain();h.gain.setValueAtTime(s,e),h.gain.exponentialRampToValueAtTime(1e-4,e+t),n.connect(o),o.connect(h),h.connect(this.master),n.start(e),n.stop(e+t+.05)}organ(e,t,s,i){const a=i||.07;this.tone("square",e,t,s,a,{filter:2400,vibrato:6,hold:.85}),this.tone("triangle",e*2,t,s,a*.6,{filter:3200,hold:.85}),this.tone("sine",e/2,t,s,a*.8,{hold:.85})}play(e){if(!this.ctx||this.muted)return;const t=this.ctx.currentTime+.01;switch(e){case"shot":this.burst(t,.09,.5,1800,"highpass"),this.tone("square",220,t,.05,.05);break;case"pass":this.burst(t,.05,.25,2500,"highpass");break;case"boards":this.tone("sine",90,t,.18,.25,{slideTo:50}),this.burst(t,.12,.25,300,"lowpass");break;case"hit":this.tone("square",110,t,.12,.12,{slideTo:60,filter:900}),this.burst(t,.15,.35,500,"lowpass");break;case"post":this.tone("triangle",1760,t,.4,.12,{hold:.1}),this.tone("triangle",2637,t,.3,.06,{hold:.1});break;case"whistle":this.tone("sine",2900,t,.22,.12,{vibrato:45}),this.tone("sine",2900,t+.28,.35,.12,{vibrato:45});break;case"buzzer":this.tone("square",180,t,1.1,.08,{filter:1200,hold:.95}),this.tone("square",183,t,1.1,.08,{filter:1200,hold:.95});break;case"horn":for(const s of[110,138.6,164.8])this.tone("sawtooth",s,t,1.8,.06,{filter:900,hold:.9});this.crowdSurge(1);break;case"save":this.burst(t,.07,.3,900),this.crowdSurge(.3);break;case"fight":this.crowdSurge(1),this.playSting("rally");break;default:bt[e]&&this.playSting(e)}}playSting(e){if(!this.ctx||this.muted)return;const t=bt[e],s=60/150;let i=this.ctx.currentTime+.02;for(const[a,n]of t){const o=n*s;a&&this.organ(Fe(a),i,o*.95),i+=o}}startLoop(){if(!this.ctx||this.loopTimer)return;const e=60/be.bpm,t=be.lead.reduce((i,[,a])=>i+a,0),s=()=>{if(this.muted)return;let i=this.ctx.currentTime+.05;for(const[a,n]of be.lead)a&&this.tone("square",Fe(a),i,n*e*.9,.035,{filter:3e3,hold:.6}),i+=n*e;i=this.ctx.currentTime+.05;for(const[a,n]of be.bass)a&&this.tone("triangle",Fe(a),i,n*e*.9,.08,{hold:.8}),this.burst(i+n*e/2,.03,.06,7e3,"highpass"),i+=n*e};s(),this.loopTimer=globalThis.setInterval(s,t*e*1e3)}stopLoop(){this.loopTimer&&globalThis.clearInterval(this.loopTimer),this.loopTimer=null}startCrowd(){const e=this.ctx.createBufferSource();e.buffer=this.noiseBuffer(),e.loop=!0;const t=this.ctx.createBiquadFilter();t.type="bandpass",t.frequency.value=700,t.Q.value=.6,this.crowdGain=this.ctx.createGain(),this.crowdGain.gain.value=0,e.connect(t),t.connect(this.crowdGain),this.crowdGain.connect(this.master),e.start()}setCrowd(e,t){if(!this.crowdGain)return;const s=t?.02+e*.05:.01;this.crowdGain.gain.setTargetAtTime(s,this.ctx.currentTime,.4)}crowdSurge(e){if(!this.crowdGain)return;const t=this.ctx.currentTime,s=this.crowdGain.gain;s.cancelScheduledValues(t),s.setValueAtTime(s.value,t),s.linearRampToValueAtTime(.06+e*.16,t+.15),s.setTargetAtTime(.04,t+.8,.8)}stop(){this.stopLoop(),this.ctx&&this.ctx.close(),this.ctx=null,this.crowdGain=null}}/**
 * Copyright 2026 btopro
 * @license Apache-2.0, see LICENSE.md for full text.
 */const xe={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"left",d:"right",w:"up",s:"down",z:"pass",x:"shoot"," ":"shoot",c:"check",v:"stick",p:"pause",Escape:"pause",r:"clip",Enter:"confirm",Backspace:"back"},ve=["pass","shoot","check","stick","pause","clip","confirm","back"],we=()=>({x:0,y:0,pass:!1,shoot:!1,check:!1,stick:!1,pause:!1,clip:!1,confirm:!1,back:!1});class As{constructor(e){this.host=e,this.keys=new Set,this.tapped=new Set,this.prev={},this.touch={x:0,y:0,pass:!1,shoot:!1,check:!1,stick:!1,pause:!1,clip:!1,active:!1},this.onKeyDown=t=>{const s=xe[t.key]||xe[t.key.toLowerCase()];!s||!this.enabled||this.host.capturesKeys(t)&&(this.keys.add(s),this.tapped.add(s),["up","down","left","right","shoot"].includes(s)&&t.preventDefault())},this.onKeyUp=t=>{const s=xe[t.key]||xe[t.key.toLowerCase()];s&&this.keys.delete(s)},this.onBlur=()=>{this.keys.clear(),this.tapped.clear()},this.enabled=!0}attach(){globalThis.addEventListener("keydown",this.onKeyDown),globalThis.addEventListener("keyup",this.onKeyUp),globalThis.addEventListener("blur",this.onBlur)}detach(){globalThis.removeEventListener("keydown",this.onKeyDown),globalThis.removeEventListener("keyup",this.onKeyUp),globalThis.removeEventListener("blur",this.onBlur)}pads(){const e=[],t=globalThis.navigator&&globalThis.navigator.getGamepads?globalThis.navigator.getGamepads():[];for(let s=0;s<Math.min(4,t.length);s++)t[s]&&t[s].connected&&e.push({id:`pad${s}`,index:s,name:t[s].id});return e}rawKeyboard(){const e=we();return e.x=(this.keys.has("right")?1:0)-(this.keys.has("left")?1:0),e.y=(this.keys.has("down")?1:0)-(this.keys.has("up")?1:0),ve.forEach(t=>{e[t]=this.keys.has(t)}),e}rawPad(e){const t=globalThis.navigator.getGamepads()[e],s=we();if(!t)return s;const i=n=>Math.abs(n)<.25?0:n;s.x=i(t.axes[0]||0),s.y=i(t.axes[1]||0);const a=n=>!!(t.buttons[n]&&t.buttons[n].pressed);return a(14)&&(s.x=-1),a(15)&&(s.x=1),a(12)&&(s.y=-1),a(13)&&(s.y=1),s.pass=a(0),s.shoot=a(1),s.check=a(2),s.stick=a(3),s.pause=a(9),s.clip=a(8),s.confirm=a(0),s.back=a(1),s}tap(e){this.tapped.add(e)}rawTouch(){const e=we();return e.x=this.touch.x,e.y=this.touch.y,ve.forEach(t=>{e[t]=!!this.touch[t]}),e.confirm=this.touch.pass,e}poll(){const e={kb:this.rawKeyboard()};if(this.pads().forEach(s=>{e[s.id]=this.rawPad(s.index)}),this.touch.active){const s=this.rawTouch(),i=e.kb;(s.x||s.y)&&(i.x=s.x,i.y=s.y),ve.forEach(a=>{i[a]=i[a]||s[a]})}const t={};for(const s of Object.keys(e)){const i=e[s],a=this.prev[s]||we(),n=Object.assign({},i);ve.forEach(l=>{n[l]=i[l]&&!a[l]||s==="kb"&&this.tapped.has(l)});const o=Math.hypot(i.x,i.y);o>1&&(n.x=i.x/o,n.y=i.y/o);const h=l=>l>.5?1:l<-.5?-1:0;n.navX=h(i.x)!==h(a.x)?h(i.x):0,n.navY=h(i.y)!==h(a.y)?h(i.y):0,t[s]=n,this.prev[s]=i}return this.tapped.clear(),t}}class Cs{constructor(e,t){this.fps=t||30,this.max=Math.round((e||20)*this.fps),this.frames=[],this.acc=0}clear(){this.frames=[],this.acc=0}push(e,t){this.acc+=t,!(this.acc<1/this.fps&&this.frames.length)&&(this.acc=0,this.frames.push(e),this.frames.length>this.max&&this.frames.shift())}last(e){const t=Math.round(e*this.fps);return this.frames.slice(Math.max(0,this.frames.length-t))}}const xt=()=>{const r=globalThis.MediaRecorder;return r&&["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm","video/mp4"].find(e=>r.isTypeSupported(e))||null},Rs=()=>!!(globalThis.document.createElement("canvas").captureStream&&xt()),Is=(r,e,t)=>{const s=t||{},i=xt();if(!i||r.length===0)return Promise.reject(new Error("Clips are not supported in this browser"));const a=globalThis.document.createElement("canvas");a.width=256,a.height=224;const n=globalThis.document.createElement("canvas");n.width=768,n.height=672;const o=n.getContext("2d");o.imageSmoothingEnabled=!1;const h=new ye(a,{hud:!0});h.setMatch(e.rules,e.teams);const l=n.captureStream(30),c=[],d=new globalThis.MediaRecorder(l,{mimeType:i,videoBitsPerSecond:4e6});return d.ondataavailable=u=>{u.data&&u.data.size&&c.push(u.data)},new Promise((u,p)=>{d.onstop=()=>u({blob:new globalThis.Blob(c,{type:i.split(";")[0]}),ext:i.indexOf("mp4")>=0?"mp4":"webm"}),d.onerror=b=>p(b.error||new Error("recording failed")),d.start();let f=0;const m=45,g=()=>{if(f<r.length){h.draw(r[f],{dt:1/30,snapCamera:f===0});const b=a.getContext("2d");Math.floor(f/15)%2===0&&(b.fillStyle="#d8343c",b.fillRect(6,22,5,5)),I(b,"REPLAY",14,21,"#ffffff",{shadow:"#000"})}else{const b=a.getContext("2d");b.fillStyle="#10131c",b.fillRect(0,0,256,224),I(b,"YOUTH HOCKEY '27",128,90,"#ff3fa4",{align:"center",scale:2,shadow:"#000"}),I(b,s.caption||"",128,120,"#ffffff",{align:"center",shadow:"#000"})}o.drawImage(a,0,0,768,672),s.onFrame&&s.onFrame(f,r.length+m),f++,f<r.length+m?globalThis.setTimeout(g,1e3/30):globalThis.setTimeout(()=>d.stop(),100)};g()})};class Ps{constructor(e){this.opts=e,this.rules=Ce(e.level,e),this.jamboree=!this.rules.keepScore,this.team=e.team,this.rng=Re(e.seed||`tournament:${e.team}:${e.level}`);const t=this.rng.shuffle(U.map(s=>s.id).filter(s=>s!==e.team));this.others=t,this.done=!1,this.champion=null,this.jamboree?this.rounds=[{name:"Jamboree",games:t.map(s=>({home:e.team,away:s,user:!0,played:!1}))}]:(this.rounds=[{name:"Semifinals",games:[{home:e.team,away:t[0],user:!0,played:!1},{home:t[1],away:t[2],user:!1,played:!1}]}],this.simulatePending())}gameOptions(e){return{level:this.opts.level,roller:this.opts.roller,ruleset:this.opts.ruleset,strictness:this.opts.strictness,needWinner:!this.jamboree,home:e.home,away:e.away}}simulatePending(){for(const e of this.rounds)for(const t of e.games){if(t.user||t.played)continue;const{result:s}=ps(Object.assign({seed:`${this.opts.seed||"t"}:${t.home}:${t.away}`},this.gameOptions(t)));this.record(t,s)}}record(e,t){e.played=!0,e.score={home:t.home,away:t.away},e.winner=t.winner?e[t.winner]:null,e.reason=t.reason}next(){for(const e of this.rounds){const t=e.games.find(s=>s.user&&!s.played);if(t)return t}return null}recordUser(e){const t=this.next();if(!t)return;if(this.record(t,e),this.jamboree){this.next()||(this.done=!0);return}const s=this.rounds[this.rounds.length-1];if(s.name==="Semifinals"){const i=s.games.map(o=>o.winner),a=i.includes(this.team),n={home:i[0],away:i[1],user:a,played:!1};this.rounds.push({name:"Final",games:[n]}),a||(this.simulatePending(),this.champion=n.winner,this.done=!0)}else this.champion=t.winner,this.done=!0}}const ke=1/60,He=new Map,$e=r=>{if(He.has(r))return He.get(r);const e=gt[r];if(!e)return"";const t=globalThis.document.createElement("canvas");t.width=e.w*4,t.height=e.h*4,fe(t.getContext("2d"),r,0,0,4);const s=t.toDataURL();return He.set(r,s),s},vt=["Did you SEE that? We need the Elite Showcase package.","Sending this to the agent right now. Top line, every shift.","That is going on the highlight reel. And the other highlight reel.","Coach better be watching. I am uploading this tonight.","Ten-year-old? D1 commit. I am calling it."],Os=r=>{const e={};for(const t of Object.keys(r))e[t]=Object.assign({},r[t],{pass:!1,shoot:!1,check:!1,stick:!1,pause:!1,clip:!1,confirm:!1,back:!1});return e};class wt extends _t(re){static get tag(){return"youth-hockey-27"}static get properties(){return{...super.properties,level:{type:String,reflect:!0},home:{type:String},away:{type:String},roller:{type:Boolean},mode:{type:String},ruleset:{type:String},strictness:{type:Number},attract:{type:Boolean,reflect:!0},_screen:{state:!0},_overlay:{state:!0},_assign:{state:!0},_pads:{state:!0},_lineup:{state:!0},_fx:{state:!0},_intermission:{state:!0},_penalty:{state:!0},_phone:{state:!0},_clip:{state:!0},_final:{state:!0},_muted:{state:!0},_announce:{state:!0}}}constructor(){super(),this.level="10U",this.home="sparkle-selects",this.away="icers",this.roller=!1,this.mode="exhibition",this.ruleset="standard",this.strictness=50,this.attract=!1,this._screen="title",this._overlay=null,this._assign={kb:"home",touch:"home",pad0:"home",pad1:"away",pad2:"home",pad3:"away"},this._pads=[],this._lineup={home:[],away:[]},this._fx={},this._fanFx={},this._intermission=null,this._penalty=null,this._phone=null,this._clip=null,this._final=null,this._announce="",this.audio=new Es,this._muted=this.audio.muted,this.input=new As(this),this.replay=new Cs(20,30),this.game=null,this.tournament=null,this.renderer=null,this._raf=null,this._acc=0,this._last=0,this._banners=[],this._visible=!0,this._lineupKey="",this.t={title:"Youth Hockey '27",tagline:"Pick your age level. The rink, the rules and the parents change with it.",start:"Start",play:"Drop the puck",homeTeam:"Home team",awayTeam:"Away team",ageLevel:"Age level",surface:"Surface",ice:"Ice",rollerLabel:"Roller (4 on 4, no offsides, no icing)",modeLabel:"Mode",exhibition:"Exhibition",tournamentLabel:"Tournament",ref:"Referee",standard:"Standard",jay:"Jay mode (no penalties)",strictnessLabel:"Ref strictness",controllers:"Controllers",keyboard:"Keyboard",touch:"Touch",gamepad:"Gamepad",cpu:"CPU",pause:"Pause",resume:"Resume",quit:"Quit to menu",saveClip:"Save clip",mute:"Sound off",unmute:"Sound on",touchHelp:"Joystick skates. PASS passes or switches player, SHOOT shoots or poke checks, CHECK body checks, STICK is a stick play. A keyboard or gamepad works too.",controlsHelp:"Arrows skate. Z pass or switch player. X shoot or poke check. C body check. V stick play. P pause. R save the last 10 seconds as a clip."}}connectedCallback(){super.connectedCallback(),this.input.attach(),this._onPad=()=>{this._pads=this.input.pads()},globalThis.addEventListener("gamepadconnected",this._onPad),globalThis.addEventListener("gamepaddisconnected",this._onPad),this._onVisibility=()=>{globalThis.document.hidden&&this._screen==="playing"&&!this._overlay&&!this.attract&&(this._overlay="pause")},globalThis.document.addEventListener("visibilitychange",this._onVisibility),"IntersectionObserver"in globalThis&&(this._io=new IntersectionObserver(e=>{this._visible=e.some(t=>t.isIntersecting)}),this._io.observe(this)),this._pads=this.input.pads(),this._loop=this._loop.bind(this),this._raf=globalThis.requestAnimationFrame(this._loop)}disconnectedCallback(){this.input.detach(),globalThis.removeEventListener("gamepadconnected",this._onPad),globalThis.removeEventListener("gamepaddisconnected",this._onPad),globalThis.document.removeEventListener("visibilitychange",this._onVisibility),this._io&&this._io.disconnect(),this._raf&&globalThis.cancelAnimationFrame(this._raf),this.audio.stop(),this._clip&&this._clip.url&&globalThis.URL.revokeObjectURL(this._clip.url),super.disconnectedCallback()}firstUpdated(e){super.firstUpdated&&super.firstUpdated(e),this.attract&&this.startAttract()}capturesKeys(e){if(this.attract)return!1;const t=e.composedPath?e.composedPath():[],s=t[0]||e.target,i=s&&s.tagName?s.tagName.toLowerCase():"",a=["input","textarea","select"].includes(i)||s&&s.isContentEditable;return this._screen==="playing"?a&&!t.includes(this)?!1:t.includes(this)||globalThis.document.activeElement===globalThis.document.body:!1}humans(){const e=["kb"];this._pads.forEach(s=>e.push(s.id));const t={};return e.forEach(s=>{const i=this._assign[s];(i==="home"||i==="away")&&(t[s]=i)}),t}kitsFor(e,t){const s=z(e),i=z(t);let a="away";return Ss(s.kits.home.jersey,i.kits.away.jersey)<140&&(a="home"),{homeKit:"home",awayKit:a}}newGame(e,t,s){const i=this.attract?{}:this.humans(),a=Object.values(i),n=Object.assign({level:this.level,roller:this.roller,ruleset:this.ruleset,strictness:this.strictness/100,home:e,away:t,controllers:i,focusSide:a[0]||"home",autoIntermission:this.attract,seed:`${e}:${t}:${this.level}:${Date.now()}`},this.kitsFor(e,t),s||{});this.game=new ft(n),this.replay.clear(),this._banners=[],this._fx={},this._fanFx={},this._final=null,this._penalty=null,this._phone=null,this._intermission=null,this._overlay=null;const o=h=>{const l=this.game.teams[h];return{kit:l.kit,short:l.def.short,crest:l.def.crest,name:l.def.name}};this.match={rules:this.game.rules,teams:{home:o("home"),away:o("away")}},this._screen="playing",this.updateComplete.then(()=>{const h=this.shadowRoot.querySelector("#rink");this.renderer=new ye(h,{hud:!0}),this.renderer.setMatch(this.match.rules,this.match.teams);const l=this.shadowRoot.querySelector("#phone-canvas");if(l&&(this.phoneRenderer=new ye(l,{hud:!1,zoom:3})),!this.attract){const c=this.shadowRoot.querySelector(".stage");c&&c.focus()}}),this.updateLineup(!0),this.audio.stopLoop(),this.say(`${this.match.teams.home.name} versus ${this.match.teams.away.name}, ${J(this.level).label}. Drop the puck.`)}startAttract(){const e=U.map(i=>i.id),t=e.includes(this.home)?this.home:e[0];let s=e.includes(this.away)?this.away:e[1];s===t&&(s=e.find(i=>i!==t)),this.newGame(t,s,{seed:`attract:${this.level}:${Date.now()}`})}startFromSelect(){if(this.audio.start(),this.home!==this.away){if(this.mode==="tournament"){this.tournament=new Ps({level:this.level,roller:this.roller,ruleset:this.ruleset,strictness:this.strictness/100,team:this.home,seed:`${Date.now()}`}),this._screen="bracket",this.audio.startLoop();return}this.tournament=null,this.newGame(this.home,this.away)}}playNextTournamentGame(){const e=this.tournament.next();e&&this.newGame(e.home,e.away,{needWinner:!this.tournament.jamboree})}_loop(e){this._raf=globalThis.requestAnimationFrame(this._loop);const t=this._last?Math.min(.1,(e-this._last)/1e3):ke;this._last=e;const s=this.input.poll();if(this._screen==="select"&&this.selectInput(s),this._screen!=="playing"||!this.game||!this.renderer||this.attract&&!this._visible)return;this.overlayInput(s);const i=!!this._overlay||this.game.phase==="intermission";if(!i){const a=Object.keys(this.game.controllers);if(!this.attract&&(s.kb||a.length)){const h=Object.keys(s);if(h.some(l=>s[l].pause)){this._overlay="pause";return}if(h.some(l=>s[l].clip)){this.saveClip();return}}this._acc+=t;let n=!0;for(;this._acc>=ke;)if(this.game.step(ke,n?s:Os(s)),n=!1,this._acc-=ke,this.handleEvents(this.game.drainEvents()),this._overlay){this._acc=0;break}const o=this.game.snapshot();this.replay.push(o,t),this.updateLineup(!1),this.updateCarrierFans()}this.tickFx(t),this.drawFrame(t),this.audio.setCrowd(this.game.crowd.mood,!i)}drawFrame(e){const t=this.game.snapshot(),s=performance.now();this._banners=this._banners.filter(n=>n.until>s);const i=this._banners[0],a=i&&i.shake&&!this.reducedMotion()?1:0;this.renderer.draw(t,{dt:e,banner:i?i.text:null,bannerColor:i?i.color:null,sub:i?i.sub:null,shake:a}),this._phone&&this.phoneRenderer&&this.drawPhone(e)}reducedMotion(){return globalThis.matchMedia&&globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches}banner(e,t){const s=t||{};this._banners.push({text:e,sub:s.sub||null,color:s.color,until:performance.now()+(s.ms||1800),shake:s.shake}),this._banners.length>3&&this._banners.shift()}say(e){this._announce="",this.updateComplete.then(()=>{this._announce=e})}entity(e){return this.game?this.game.findEntity(e):null}handleEvents(e){const t=this.audio,s=this.match.teams,i=this.game.rules.keepScore;for(const a of e)switch(a.type){case"shot":t.play("shot");break;case"pass":t.play("pass");break;case"boards":t.play("boards");break;case"post":t.play("post"),this.banner("POST!",{ms:900,color:"#ffffff"});break;case"save":t.play("save"),this.react(a.uid,"jump",1.5);break;case"hit":t.play("hit"),this.react(a.uid,"jump",1.2),a.legal||this.react(a.target,"angry",2.5);break;case"whistle":t.play("whistle"),a.reason==="offside"&&this.banner("OFFSIDE",{sub:"Attackers went in ahead of the puck",color:"#ffffff"}),a.reason==="icing"&&this.banner("ICING",{sub:"Shot from your own half went all the way down",color:"#ffffff"});break;case"buzzer":t.play("buzzer"),this.banner("BUZZER!",{sub:"Everybody changes. Everybody plays.",ms:1500,color:"#69f0ae"});break;case"goal":{const n=a.side;t.play("horn"),t.playSting("goal");const o=a.scorerNumber?`#${a.scorerNumber} ${a.scorerName}`:"Off a skate";this.banner("GOAL!",{sub:o,ms:2400,color:s[n].kit.jersey,shake:!0}),a.scorer&&(this.react(a.scorer,"wild",4),i||(this.react(a.scorer,"money",4),t.playSting("money"))),(a.assists||[]).forEach(h=>this.react(h,"jump",3)),this.teamReact(n,"jump",2),this.say(i?`Goal, ${s[n].name}. ${o}. ${s.home.short} ${a.home}, ${s.away.short} ${a.away}.`:`Goal by ${o}. Nobody is keeping score at this level, but the parents are.`),a.viral&&a.scorer&&!this.attract&&this.startPhone(a.scorer);break}case"penalty":{const n=s[a.side];if(this.react(a.uid,"angry",4),a.penalty==="fighting"){this.banner("EJECTED",{sub:`#${a.number} ${n.short}`,ms:1400,color:"#d8343c"});break}this.say(`Penalty, ${n.name}. Number ${a.number}, ${a.label}, two minutes. ${a.explain}`),this.attract?this.banner(a.label.toUpperCase(),{sub:`#${a.number} ${n.short} 2:00`,ms:1600,color:"#ffd740"}):(this._penalty=Object.assign({team:n.name,short:n.short,color:n.kit.jersey,until:performance.now()+3600},a),this._overlay="penalty"),t.playSting("penalty");break}case"stands-fight":this.standsFight(a.a,a.b);break;case"fight":t.play("fight"),this.banner("FIGHT!",{sub:"Gloves are off",ms:3e3,color:"#d8343c",shake:!0}),this.teamReact("home","jump",3),this.teamReact("away","jump",3),this.say("Fight! Both players are ejected.");break;case"period-end":t.play("buzzer"),t.playSting("period");break;case"overtime":this.banner("OVERTIME",{sub:"Next goal wins",ms:2500});break;case"shootout":this.banner("SHOOTOUT",{sub:`${s[a.winner].short} wins it`,ms:2500});break;case"intermission":this.attract||(this._intermission=Object.assign({result:null},a),this._overlay="intermission",this.audio.startLoop(),this.say(`End of period ${a.period}. ${a.title}. ${a.body}`));break;case"period-start":this.banner(`PERIOD ${a.period}`,{ms:1500});break;case"final":this.finish(a);break}}finish(e){if(this.attract){globalThis.setTimeout(()=>this.startAttract(),2500),this.banner(e.keepScore?"FINAL":"GOOD GAME",{ms:2400});return}this.audio.startLoop();const t=this.game,s=[...t.teams.home.skaters(),...t.teams.away.skaters()],i=d=>s.slice().sort((u,p)=>d(p)-d(u))[0],a=i(d=>d.stats.goals*3+d.stats.assists*2+d.stats.passes*.1),n=i(d=>d.stats.passes),o=i(d=>d.stats.possession-d.stats.passes*2),h=d=>{const u=t.teams[d],p=u.entities;return{shots:u.shots,passes:p.reduce((f,m)=>f+m.stats.passes,0),hits:p.reduce((f,m)=>f+m.stats.hits,0),pim:p.reduce((f,m)=>f+m.stats.pim,0)}},l=d=>`#${d.player.number} ${d.player.name} (${t.teams[d.side].def.short})`;this._final={result:e,stats:{home:h("home"),away:h("away")},awards:[{label:"Player of the game",who:l(a)},{label:"Most passes",who:`${l(n)}, ${n.stats.passes}`},{label:"Puck hog award",who:`${l(o)}, ${Math.round(o.stats.possession)} seconds with the puck, ${o.stats.passes} passes`}]},this.tournament&&this.tournament.recordUser(e),this._screen="final";const c=this.match.teams;e.reason&&e.reason.startsWith("called")?this.say("Game called. Not enough players left to keep playing."):e.keepScore?this.say(`Final. ${c.home.name} ${e.home}, ${c.away.name} ${e.away}.`):this.say("Good game. Nobody kept score. Everybody played.")}updateLineup(e){const t=this.game;if(!t)return;const s=n=>t.teams[n].entities.filter(o=>o.onIce),i=["home","away"].map(n=>s(n).map(o=>o.uid).join(",")).join("|");if(!e&&i===this._lineupKey)return;this._lineupKey=i;const a=n=>s(n).map(o=>({uid:o.uid,number:o.player.number,goalie:o.isGoalie,fans:o.player.fans,superFans:o.exposure>=60}));this._lineup={home:a("home"),away:a("away")}}react(e,t,s){e&&(this._fx=Object.assign({},this._fx,{[e]:{kind:t,until:performance.now()+s*1e3}}))}teamReact(e,t,s){const i=Object.assign({},this._fx);for(const a of this._lineup[e]||[])(!i[a.uid]||i[a.uid].kind===t)&&(i[a.uid]={kind:t,until:performance.now()+s*1e3});this._fx=i}standsFight(e,t){const s=this.entity(e),i=this.entity(t),a=Object.assign({},this._fanFx),n=performance.now()+3500;s&&(a[s.player.fans[0]]=n),i&&(a[i.player.fans[0]]=n),this._fanFx=a,this.requestUpdate(),this.banner("TROUBLE IN THE STANDS",{ms:1400,color:"#ffd740"})}updateCarrierFans(){const e=this.game.puck.carrier;if(!e||e.exposure<60)return;const t=this._fx[e.uid];(!t||t.kind!=="money"||t.until-performance.now()<300)&&((!t||t.kind!=="money")&&this.audio.playSting("money"),this.react(e.uid,"money",1.2))}tickFx(){const e=performance.now();let t=!1;const s={};for(const a of Object.keys(this._fx)){const n=this._fx[a];n.until>e?s[a]=n:t=!0}t&&(this._fx=s);let i=!1;for(const a of Object.keys(this._fanFx))this._fanFx[a]<=e&&(delete this._fanFx[a],i=!0);i&&this.requestUpdate(),this._penalty&&this._overlay==="penalty"&&this._penalty.until<e&&this.closeOverlay()}overlayInput(e){const t=s=>Object.keys(e).some(i=>e[i][s]);if(this._overlay==="penalty"&&(t("pass")||t("confirm")||t("shoot")))this.closeOverlay();else if(this._overlay==="phone"&&(t("pass")||t("confirm")||t("shoot")||t("pause")))this.closeOverlay();else if(this._overlay==="pause"&&t("pause"))this.closeOverlay();else if(this._overlay==="intermission"){const s=Object.keys(e).map(i=>e[i].navY).find(i=>i);if(s){const i=this.shadowRoot.querySelectorAll(".intermission button"),a=Array.from(i),n=a.indexOf(this.shadowRoot.activeElement),o=a[(n+s+a.length)%a.length];o&&o.focus()}if(Object.keys(e).some(i=>i!=="kb"&&e[i].confirm)){const i=this.shadowRoot.activeElement;i&&i.click&&i.click()}}}closeOverlay(){const e=this._overlay;this._overlay=null,this._penalty=null,e==="phone"&&(this._phone=null),this._last=0,this.updateComplete.then(()=>{const t=this.shadowRoot.querySelector(".stage");t&&!this.attract&&t.focus()})}chooseIntermission(e){const t=this.game.chooseIntermission(e);this.handleEvents(this.game.drainEvents()),this._intermission=Object.assign({},this._intermission,{result:t,chosen:e}),this.say(t),this.updateComplete.then(()=>{const s=this.shadowRoot.querySelector(".intermission .continue");s&&s.focus()})}endIntermission(){this._intermission=null,this.audio.stopLoop(),this.closeOverlay()}startPhone(e){const t=this.entity(e);if(!t)return;const s=this.replay.last(3.5);s.length<10||(this._phone={frames:s,i:0,fan:t.player.fans[0],number:t.player.number,line:vt[Math.floor((t.uid*7+this.game.time)%vt.length)],acc:0},globalThis.setTimeout(()=>{this._phone&&this._screen==="playing"&&(this._overlay="phone",this.say(`A parent is filming the goal on their phone. "${this._phone.line}"`),this.updateComplete.then(()=>{const i=this.shadowRoot.querySelector("#phone-canvas");i&&(this.phoneRenderer=new ye(i,{hud:!1,zoom:3}),this.phoneRenderer.setMatch(this.match.rules,this.match.teams))}))},900))}drawPhone(e){if(this._overlay!=="phone"||!this.phoneRenderer)return;const t=this._phone;t.acc+=e;const s=Math.min(t.frames.length-1,Math.floor(t.acc*30)),i=t.frames[s],a=this.reducedMotion()?0:1.5;this.phoneRenderer.draw(i,{dt:e,snapCamera:s===0,shake:a}),t.acc*30>t.frames.length+30&&this.closeOverlay()}async saveClip(){if(!Rs()){this.banner("CLIPS NEED CHROME, EDGE OR FIREFOX",{ms:2e3,color:"#ffffff"});return}const e=this.replay.last(10);if(e.length<15)return;this._overlay="clip",this._clip={progress:0,url:null};const t=this.match.teams;try{const s=await Is(e,this.match,{caption:`${t.home.short} VS ${t.away.short} - ${J(this.level).label}`,onFrame:(a,n)=>{this._clip=Object.assign({},this._clip,{progress:Math.round(a/n*100)})}}),i=globalThis.URL.createObjectURL(s.blob);this._clip={progress:100,url:i,name:`youth-hockey-27-${t.home.short}-${t.away.short}.${s.ext}`.toLowerCase()},this.say("Clip ready to download.")}catch(s){this._clip={progress:0,error:s.message}}}closeClip(){this._clip&&this._clip.url&&globalThis.URL.revokeObjectURL(this._clip.url),this._clip=null,this.closeOverlay()}quit(){this.game=null,this.renderer=null,this._overlay=null,this._screen="select",this.audio.startLoop()}toggleMute(){this._muted=!this._muted,this.audio.setMuted(this._muted),this._muted&&this.audio.stopLoop()}selectInput(e){for(const t of this._pads){const s=e[t.id];if(s){if(s.navX){const i=["home","cpu","away"],a=i.indexOf(this._assign[t.id]||"cpu"),n=i[Math.max(0,Math.min(2,a+s.navX))];this._assign=Object.assign({},this._assign,{[t.id]:n})}(s.pause||s.confirm)&&this.startFromSelect()}}}static get styles(){return[super.styles,jt`
        :host {
          display: block;
          --yh-pink: #ff3fa4;
          --yh-ink: #10131c;
          --yh-gold: #f2c94c;
          color: var(--ddd-theme-default-white, #fff);
          font-family: var(--ddd-font-navigation, sans-serif);
          max-width: 800px;
          margin: 0 auto;
        }
        .shell {
          background: var(--yh-ink);
          border: var(--ddd-border-md, 2px solid) var(--yh-gold);
          border-radius: var(--ddd-radius-sm, 4px);
          overflow: hidden;
          position: relative;
        }
        :host([attract]) .shell {
          border-width: 1px;
        }
        h2,
        h3 {
          font-family: var(--ddd-font-navigation, sans-serif);
          margin: 0;
          letter-spacing: 0.04em;
        }
        .title-screen {
          padding: var(--ddd-spacing-12, 48px) var(--ddd-spacing-6, 24px);
          text-align: center;
          background: radial-gradient(circle at 50% 30%, #1d2a4a, var(--yh-ink) 70%);
        }
        .logo {
          font-size: var(--ddd-font-size-xl, 40px);
          font-weight: var(--ddd-font-weight-black, 900);
          color: var(--yh-pink);
          text-shadow: 3px 3px 0 #000, 6px 6px 0 var(--ddd-theme-default-skyBlue, #2e80ff);
          text-transform: uppercase;
        }
        .tagline {
          color: var(--ddd-theme-default-limestoneLight, #e4e5e7);
          margin: var(--ddd-spacing-4, 16px) 0 var(--ddd-spacing-8, 32px);
          font-size: var(--ddd-font-size-s, 18px);
        }
        .crest-row {
          display: flex;
          justify-content: center;
          gap: var(--ddd-spacing-4, 16px);
          margin-bottom: var(--ddd-spacing-8, 32px);
        }
        .crest-row img,
        .team img {
          image-rendering: pixelated;
        }
        button,
        .button {
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-xs, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          background: var(--ddd-theme-default-coalyGray, #262626);
          color: var(--ddd-theme-default-white, #fff);
          border: var(--ddd-border-sm, 1px solid) var(--ddd-theme-default-limestoneGray, #a2aaad);
          border-radius: var(--ddd-radius-xs, 2px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-4, 16px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        button:hover,
        button:focus-visible,
        .button:hover,
        .button:focus-visible {
          border-color: var(--yh-gold);
          outline: var(--ddd-border-md, 2px solid) var(--yh-gold);
          outline-offset: 2px;
        }
        button.primary,
        .button.primary {
          background: var(--yh-pink);
          border-color: var(--yh-pink);
          color: #000;
          font-size: var(--ddd-font-size-s, 18px);
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-8, 32px);
        }
        button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .select {
          padding: var(--ddd-spacing-6, 24px);
          display: grid;
          gap: var(--ddd-spacing-5, 20px);
        }
        fieldset {
          border: var(--ddd-border-sm, 1px solid) #2b3a55;
          border-radius: var(--ddd-radius-sm, 4px);
          margin: 0;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
        }
        legend {
          color: var(--yh-gold);
          font-weight: var(--ddd-font-weight-bold, 700);
          padding: 0 var(--ddd-spacing-2, 8px);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .teams {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-4, 16px);
        }
        .choices {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
        }
        .choice {
          position: relative;
        }
        .choice input {
          position: absolute;
          opacity: 0;
          inset: 0;
          margin: 0;
          cursor: pointer;
        }
        .choice span {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          border: var(--ddd-border-sm, 1px solid) #2b3a55;
          border-radius: var(--ddd-radius-xs, 2px);
          background: #182035;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .choice input:checked + span {
          border-color: var(--yh-pink);
          background: #3a1530;
          box-shadow: inset 0 0 0 1px var(--yh-pink);
        }
        .choice input:focus-visible + span {
          outline: var(--ddd-border-md, 2px solid) var(--yh-gold);
          outline-offset: 2px;
        }
        .choice input:disabled + span {
          opacity: 0.4;
        }
        .blurb {
          margin: var(--ddd-spacing-2, 8px) 0 0;
          color: var(--ddd-theme-default-limestoneLight, #e4e5e7);
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .controllers {
          width: 100%;
          border: none;
          border-collapse: collapse;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        .controllers th,
        .controllers td {
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          text-align: left;
          border: none;
          border-bottom: 1px solid #2b3a55;
          background: transparent;
          color: inherit;
        }
        .strict-label {
          display: block;
          text-align: left;
        }
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: var(--ddd-spacing-1, 4px);
        }
        input[type='range'] {
          width: 100%;
          accent-color: var(--yh-pink);
        }
        .start-row {
          display: flex;
          gap: var(--ddd-spacing-4, 16px);
          align-items: center;
          flex-wrap: wrap;
        }
        .warn {
          color: var(--ddd-theme-default-original87Pink, #ff8fd0);
        }
        /* the game */
        .stands {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: #0b0e16;
          height: 104px;
          overflow: hidden;
          border-bottom: 2px solid var(--yh-gold);
        }
        .side {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-end;
          padding: 2px 6px 0;
          position: relative;
        }
        .side.away {
          justify-content: flex-end;
        }
        .section {
          display: flex;
          align-items: flex-end;
          position: relative;
          margin: 0 2px;
        }
        .section .tag {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: var(--ddd-font-weight-bold, 700);
          background: rgba(0, 0, 0, 0.7);
          padding: 0 3px;
          border-radius: 2px;
          z-index: 2;
          white-space: nowrap;
        }
        .fan {
          position: relative;
          width: 30px;
          height: 46px;
          margin: 0 -5px;
        }
        .fan rpg-character {
          width: 36px;
          height: 46px;
          display: block;
        }
        .fan.jump {
          animation: hop 0.5s ease-in-out infinite;
        }
        .fan.wild {
          animation: wild 0.35s ease-in-out infinite;
          z-index: 3;
        }
        .fan.fight {
          animation: shake 0.12s linear infinite;
          z-index: 3;
        }
        .fan.fight::after {
          content: '!!';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          color: #ff5252;
          font-weight: 900;
          font-size: 14px;
          text-shadow: 1px 1px 0 #000;
        }
        .fan .bill {
          position: absolute;
          top: 2px;
          left: 50%;
          width: 18px;
          height: 9px;
          margin-left: -9px;
          background: #4caf50;
          border: 1px solid #1b5e20;
          color: #0b3d0e;
          font-size: 8px;
          line-height: 8px;
          font-weight: 900;
          text-align: center;
          animation: wave 0.3s ease-in-out infinite alternate;
          z-index: 4;
        }
        @keyframes hop {
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes wild {
          0% {
            transform: translateY(0) rotate(-6deg);
          }
          50% {
            transform: translateY(-12px) rotate(6deg);
          }
          100% {
            transform: translateY(0) rotate(-6deg);
          }
        }
        @keyframes shake {
          0% {
            transform: translateX(-2px);
          }
          50% {
            transform: translateX(2px);
          }
        }
        @keyframes wave {
          from {
            transform: rotate(-15deg) translateY(0);
          }
          to {
            transform: rotate(15deg) translateY(-3px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fan.jump,
          .fan.wild,
          .fan.fight,
          .fan .bill {
            animation: none;
          }
          .fan.wild,
          .fan.jump {
            filter: brightness(1.4);
          }
        }
        .stage {
          position: relative;
          outline: none;
        }
        .stage:focus-visible {
          box-shadow: inset 0 0 0 2px var(--yh-gold);
        }
        canvas#rink {
          display: block;
          width: 100%;
          aspect-ratio: 256 / 224;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          background: #141826;
        }
        .overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 12, 20, 0.6);
          padding: var(--ddd-spacing-4, 16px);
        }
        .card {
          background: #182035;
          border: 2px solid var(--yh-gold);
          border-radius: var(--ddd-radius-sm, 4px);
          padding: var(--ddd-spacing-5, 20px);
          max-width: 460px;
          width: 100%;
          box-shadow: 6px 6px 0 #000;
        }
        .card p {
          margin: var(--ddd-spacing-3, 12px) 0;
          line-height: 1.4;
        }
        .card .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-4, 16px);
        }
        .card .actions.stack {
          flex-direction: column;
        }
        .penalty .label {
          font-size: var(--ddd-font-size-m, 24px);
          color: #ffd740;
          text-transform: uppercase;
        }
        .penalty .signal {
          font-style: italic;
          color: var(--ddd-theme-default-limestoneLight, #e4e5e7);
        }
        .hint {
          font-size: 12px;
          color: #a2aaad;
        }
        .intermission .people {
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
          float: right;
          margin-left: var(--ddd-spacing-3, 12px);
        }
        .intermission .people rpg-character {
          width: 56px;
          height: 72px;
        }
        .phone-wrap {
          display: flex;
          align-items: flex-end;
          gap: var(--ddd-spacing-3, 12px);
        }
        .phone {
          background: #111;
          border-radius: 14px;
          padding: 14px 6px;
          border: 2px solid #444;
          position: relative;
        }
        .phone canvas {
          display: block;
          width: 160px;
          height: 266px;
          image-rendering: pixelated;
          border-radius: 4px;
        }
        .phone .rec {
          position: absolute;
          top: 20px;
          left: 12px;
          color: #fff;
          font-size: 11px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .phone .rec::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d8343c;
        }
        .bubble {
          background: #fff;
          color: #111;
          border-radius: 10px;
          padding: var(--ddd-spacing-3, 12px);
          max-width: 200px;
          font-weight: var(--ddd-font-weight-bold, 700);
          position: relative;
          margin-bottom: 80px;
        }
        .caller rpg-character {
          width: 64px;
          height: 82px;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px);
          background: #0b0e16;
          align-items: center;
        }
        .toolbar .spacer {
          flex: 1;
        }
        .toolbar button {
          font-size: 13px;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-3, 12px);
        }
        .help {
          font-size: 12px;
          color: #a2aaad;
          padding: 0 var(--ddd-spacing-2, 8px) var(--ddd-spacing-2, 8px);
          background: #0b0e16;
          margin: 0;
        }
        .touch {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: var(--ddd-spacing-3, 12px);
          background: #0b0e16;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .touch.on {
          display: flex;
        }
        .joy {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #182035;
          border: 2px solid #2b3a55;
          position: relative;
        }
        .knob {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--yh-pink);
          left: 36px;
          top: 36px;
          pointer-events: none;
        }
        .pad-buttons {
          display: grid;
          grid-template-columns: repeat(2, 64px);
          gap: 10px;
        }
        .pad-buttons button {
          height: 52px;
          border-radius: 26px;
          padding: 0;
          font-size: 12px;
        }
        .final,
        .bracket {
          padding: var(--ddd-spacing-6, 24px);
        }
        .scoreline {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
          margin: var(--ddd-spacing-4, 16px) 0;
          text-align: center;
        }
        .scoreline .big {
          font-size: var(--ddd-font-size-xl, 40px);
          font-weight: 900;
        }
        .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
        }
        table.stats {
          width: 100%;
          border-collapse: collapse;
          margin: var(--ddd-spacing-4, 16px) 0;
          font-size: var(--ddd-font-size-4xs, 14px);
        }
        table.stats {
          border: none;
        }
        table.stats th,
        table.stats td {
          border: none;
          background: transparent;
          color: inherit;
          border-bottom: 1px solid #2b3a55;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          text-align: center;
        }
        table.stats th:first-child,
        table.stats td:first-child {
          text-align: left;
        }
        .awards {
          list-style: none;
          padding: 0;
          margin: var(--ddd-spacing-4, 16px) 0;
          display: grid;
          gap: var(--ddd-spacing-2, 8px);
        }
        .awards strong {
          color: var(--yh-gold);
          display: block;
          font-size: 12px;
          text-transform: uppercase;
        }
        .round {
          margin: var(--ddd-spacing-4, 16px) 0;
        }
        .round ul {
          list-style: none;
          margin: var(--ddd-spacing-2, 8px) 0 0;
          padding: 0;
          display: grid;
          gap: var(--ddd-spacing-2, 8px);
        }
        .round li {
          background: #182035;
          border: 1px solid #2b3a55;
          border-radius: var(--ddd-radius-xs, 2px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-2, 8px);
        }
        .round li.mine {
          border-color: var(--yh-pink);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .teams {
            grid-template-columns: 1fr;
          }
          .stands {
            height: 72px;
          }
          .fan {
            width: 22px;
            height: 34px;
          }
          .fan rpg-character {
            width: 26px;
            height: 34px;
          }
          .phone canvas {
            width: 120px;
            height: 200px;
          }
          .bubble {
            margin-bottom: 40px;
          }
        }
      `]}render(){return y`
      <div class="shell">
        ${this._screen==="title"&&!this.attract?this.renderTitle():v}
        ${this._screen==="select"?this.renderSelect():v}
        ${this._screen==="bracket"?this.renderBracket():v}
        ${this._screen==="playing"?this.renderGame():v}
        ${this._screen==="final"?this.renderFinal():v}
        <div class="sr-only" aria-live="polite">${this._announce}</div>
      </div>
    `}renderTitle(){return y`
      <div class="title-screen">
        <h2 class="logo">${this.t.title}</h2>
        <p class="tagline">${this.t.tagline}</p>
        <div class="crest-row" aria-hidden="true">
          ${U.map(e=>y`<img src="${$e(e.crest)}" width="64" height="64" alt="" />`)}
        </div>
        <button
          class="primary"
          @click=${()=>{this.audio.start(),this.audio.startLoop(),this._screen="select"}}
        >
          ${this.t.start}
        </button>
      </div>
    `}renderTeamPicker(e){const t=e==="home"?this.home:this.away,s=e==="home"?this.away:this.home;return y`
      <fieldset>
        <legend>${e==="home"?this.t.homeTeam:this.t.awayTeam}</legend>
        <div class="choices">
          ${U.map(i=>y`
              <label class="choice">
                <input
                  type="radio"
                  name="${e}"
                  .checked=${t===i.id}
                  ?disabled=${s===i.id}
                  @change=${()=>{this[e]=i.id}}
                />
                <span><img src="${$e(i.crest)}" width="28" height="28" alt="" />${i.name}</span>
              </label>
            `)}
        </div>
      </fieldset>
    `}renderSelect(){const e=J(this.level),t=Ce(this.level,{roller:this.roller}),s=[{id:"kb",label:this._touchVisible()?`${this.t.keyboard} / ${this.t.touch}`:this.t.keyboard}];this._pads.forEach(a=>s.push({id:a.id,label:`${this.t.gamepad} ${a.index+1}`}));const i=Object.values(this.humans());return y`
      <form
        class="select"
        @submit=${a=>{a.preventDefault(),this.startFromSelect()}}
      >
        <h2 class="logo" style="font-size: var(--ddd-font-size-l, 32px)">${this.t.title}</h2>
        <div class="teams">${this.renderTeamPicker("home")} ${this.renderTeamPicker("away")}</div>
        <fieldset>
          <legend>${this.t.ageLevel}</legend>
          <div class="choices">
            ${de.map(a=>y`
                <label class="choice">
                  <input
                    type="radio"
                    name="level"
                    .checked=${this.level===a.id}
                    @change=${()=>{this.level=a.id}}
                  />
                  <span>${a.label}</span>
                </label>
              `)}
          </div>
          <p class="blurb">
            <strong>${t.surface.label}, ${t.skaters} on ${t.skaters}.</strong>
            ${t.checking?"Body checking allowed.":"No body checking."} ${t.offsides?"Offsides and icing.":"No offsides or icing."}
            ${t.keepScore?"Score is kept.":"No scoreboard."} ${e.blurb}
          </p>
        </fieldset>
        <div class="teams">
          <fieldset>
            <legend>${this.t.surface}</legend>
            <div class="choices">
              <label class="choice"
                ><input type="radio" name="surface" .checked=${!this.roller} @change=${()=>this.roller=!1} /><span>${this.t.ice}</span></label
              >
              <label class="choice"
                ><input type="radio" name="surface" .checked=${this.roller} @change=${()=>this.roller=!0} /><span>${this.t.rollerLabel}</span></label
              >
            </div>
          </fieldset>
          <fieldset>
            <legend>${this.t.modeLabel}</legend>
            <div class="choices">
              <label class="choice"
                ><input type="radio" name="mode" .checked=${this.mode==="exhibition"} @change=${()=>this.mode="exhibition"} /><span>${this.t.exhibition}</span></label
              >
              <label class="choice"
                ><input type="radio" name="mode" .checked=${this.mode==="tournament"} @change=${()=>this.mode="tournament"} /><span
                  >${this.t.tournamentLabel}${t.keepScore?"":" (jamboree)"}</span
                ></label
              >
            </div>
          </fieldset>
        </div>
        <fieldset>
          <legend>${this.t.ref}</legend>
          <div class="choices">
            <label class="choice"
              ><input type="radio" name="ruleset" .checked=${this.ruleset==="standard"} @change=${()=>this.ruleset="standard"} /><span>${this.t.standard}</span></label
            >
            <label class="choice"
              ><input type="radio" name="ruleset" .checked=${this.ruleset==="jay"} @change=${()=>this.ruleset="jay"} /><span>${this.t.jay}</span></label
            >
          </div>
          <label class="blurb strict-label" for="strict">${this.t.strictnessLabel}: ${this.strictness}%</label>
          <input
            id="strict"
            type="range"
            min="0"
            max="100"
            step="5"
            .value=${String(this.strictness)}
            ?disabled=${this.ruleset==="jay"}
            @input=${a=>{this.strictness=parseInt(a.target.value,10)}}
          />
        </fieldset>
        <fieldset>
          <legend>${this.t.controllers}</legend>
          <table class="controllers">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">${z(this.home).short}</th>
                <th scope="col">${this.t.cpu}</th>
                <th scope="col">${z(this.away).short}</th>
              </tr>
            </thead>
            <tbody>
              ${s.map(a=>y`
                  <tr>
                    <th scope="row">
                      <span class="dot" style="background:${me[a.id]}"></span>${a.label} (P${Ue[a.id]})
                    </th>
                    ${["home","cpu","away"].map(n=>y`
                        <td>
                          <input
                            type="radio"
                            name="ctl-${a.id}"
                            aria-label="${a.label}: ${n==="cpu"?this.t.cpu:z(this[n]).name}"
                            .checked=${(this._assign[a.id]||"cpu")===n}
                            @change=${()=>{this._assign=Object.assign({},this._assign,{[a.id]:n})}}
                          />
                        </td>
                      `)}
                  </tr>
                `)}
            </tbody>
          </table>
          <p class="blurb">
            ${this._pads.length?"Gamepads: push left or right to pick a side, press A or Start to play.":"Plug in up to four gamepads and press a button to see them here."}
            ${i.length===0?y`<span class="warn">Everyone is on CPU: you'll be watching.</span>`:v}
          </p>
        </fieldset>
        <div class="start-row">
          <button class="primary" type="submit" ?disabled=${this.home===this.away}>${this.t.play}</button>
          <button type="button" @click=${this.toggleMute}>${this._muted?this.t.unmute:this.t.mute}</button>
        </div>
        <p class="blurb">${this.t.controlsHelp}</p>
      </form>
    `}renderStands(){const e=s=>s.fans.map(i=>{const a=this._fx[s.uid],n=this._fanFx[i]?"fight":a?a.kind:"";let o="";n==="fight"?o="fight":n==="wild"||n==="jump"?o=s.superFans?"wild":"jump":n==="money"&&(o="jump");const h=n==="angry"||n==="fight"?"angry":n==="wild"||n==="jump"?"happy":"none";return y`
          <div class="fan ${o}">
            ${n==="money"&&s.superFans?y`<span class="bill">$</span>`:v}
            ${n==="money"&&!s.superFans&&this.game&&!this.game.rules.keepScore?y`<span class="bill">$</span>`:v}
            <rpg-character seed="${i}" height="46" width="36" expression="${h}" pose="${o==="wild"?"cheer":"none"}" reduce-motion></rpg-character>
          </div>
        `}),t=s=>y`<div class="side ${s}">
        ${(this._lineup[s]||[]).map(i=>y`<div class="section">${e(i)}<span class="tag">#${i.number}</span></div>`)}
      </div>`;return y`<div class="stands" aria-hidden="true">${t("home")}${t("away")}</div>`}renderGame(){const e=this._touch&&!this.attract;return y`
      ${this.attract?v:this.renderStands()}
      <div class="stage" tabindex="0" role="application" aria-label="Hockey rink. ${this.t.controlsHelp}">
        <canvas id="rink" width="256" height="224"></canvas>
        ${this.renderOverlay()}
      </div>
      ${this.attract?v:y`
            <div
              class="touch ${e||this._touchVisible()?"on":""}"
              @pointerdown=${this.touchDown}
              @pointermove=${this.touchMove}
              @pointerup=${this.touchUp}
              @pointercancel=${this.touchUp}
            >
              <div class="joy" data-joy><div class="knob"></div></div>
              <div class="pad-buttons">
                <button data-btn="pass">PASS</button>
                <button data-btn="shoot">SHOOT</button>
                <button data-btn="check">CHECK</button>
                <button data-btn="stick">STICK</button>
              </div>
            </div>
            <div class="toolbar">
              <button @click=${()=>this._overlay="pause"}>${this.t.pause}</button>
              <button @click=${this.saveClip}>${this.t.saveClip}</button>
              <button @click=${this.toggleMute}>${this._muted?this.t.unmute:this.t.mute}</button>
              <span class="spacer"></span>
              <button @click=${this.quit}>${this.t.quit}</button>
            </div>
            <p class="help">${this._touchVisible()?this.t.touchHelp:this.t.controlsHelp}</p>
          `}
    `}_touchVisible(){return globalThis.matchMedia&&globalThis.matchMedia("(pointer: coarse)").matches}touchDown(e){this._touch||(this._touch=!0,this.input.touch.active=!0,this.game&&!this.game.controllers.kb&&(this._assign=Object.assign({},this._assign,{kb:"home"}),this.game.controllers.kb="home",this.game.reassignControllers()));const t=e.target.closest?e.target.closest("[data-btn]"):null;if(t){this.input.touch[t.dataset.btn]=!0,this.input.tap(t.dataset.btn),e.preventDefault();return}if(e.target.closest&&e.target.closest("[data-joy]")){this._joyId=e.pointerId;try{e.target.setPointerCapture(e.pointerId)}catch{}this.touchMove(e)}}touchMove(e){if(e.pointerId!==this._joyId)return;const t=this.shadowRoot.querySelector("[data-joy]"),s=t.getBoundingClientRect();let i=(e.clientX-(s.left+s.width/2))/(s.width/2),a=(e.clientY-(s.top+s.height/2))/(s.height/2);const n=Math.hypot(i,a);n>1&&(i/=n,a/=n),this.input.touch.x=Math.abs(i)<.15?0:i,this.input.touch.y=Math.abs(a)<.15?0:a;const o=t.querySelector(".knob");o.style.transform=`translate(${i*36}px, ${a*36}px)`}touchUp(e){const t=e.target.closest?e.target.closest("[data-btn]"):null;if(t&&(this.input.touch[t.dataset.btn]=!1),e.pointerId===this._joyId){this._joyId=null,this.input.touch.x=0,this.input.touch.y=0;const s=this.shadowRoot.querySelector(".knob");s&&(s.style.transform="")}}renderOverlay(){if(this._overlay==="pause")return y`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.pause}">
          <h3>${this.t.pause}</h3>
          <p>${this.t.controlsHelp}</p>
          <div class="actions">
            <button class="primary" @click=${this.closeOverlay}>${this.t.resume}</button>
            <button @click=${this.saveClip}>${this.t.saveClip}</button>
            <button @click=${this.quit}>${this.t.quit}</button>
          </div>
        </div>
      </div>`;if(this._overlay==="penalty"&&this._penalty){const e=this._penalty;return y`<div class="overlay" @click=${this.closeOverlay}>
        <div class="card penalty" role="alert">
          <div class="label">${e.label}</div>
          <p><strong>#${e.number} ${e.name}</strong>, ${e.team}. Two minutes.</p>
          <p class="signal">Ref signal: ${e.signal}.</p>
          <p>${e.explain}</p>
          <p class="hint">Press pass to continue.</p>
        </div>
      </div>`}if(this._overlay==="intermission"&&this._intermission){const e=this._intermission,t=e.subject?this.entity(e.subject):null,s=this.game.teams[e.side];return y`<div class="overlay">
        <div class="card intermission" role="dialog" aria-labelledby="int-title">
          ${t?y`<div class="people" aria-hidden="true">
                <rpg-character seed="${t.player.fans[0]}" height="72" width="56" expression="${e.result?"happy":"none"}"></rpg-character>
                <rpg-character seed="${t.player.id}" preset="${s.def.crest}" height="72" width="56"></rpg-character>
              </div>`:v}
          <div class="hint">End of period ${e.period}</div>
          <h3 id="int-title">${e.title}</h3>
          <p>${e.body}</p>
          ${e.result?y`<p><strong>${e.result}</strong></p>
                <div class="actions">
                  <button class="primary continue" @click=${this.endIntermission}>Start period ${this.game.period}</button>
                </div>`:y`<div class="actions stack">
                ${e.choices.map((i,a)=>y`<button @click=${()=>this.chooseIntermission(a)}>${i}</button>`)}
              </div>`}
        </div>
      </div>`}if(this._overlay==="phone"&&this._phone)return y`<div class="overlay" @click=${this.closeOverlay}>
        <div class="phone-wrap">
          <div class="caller" aria-hidden="true">
            <rpg-character seed="${this._phone.fan}" item="phone" height="82" width="64" expression="happy"></rpg-character>
          </div>
          <div class="phone">
            <span class="rec">REC #${this._phone.number}</span>
            <canvas id="phone-canvas" width="120" height="200"></canvas>
          </div>
          <div class="bubble">${this._phone.line}</div>
        </div>
      </div>`;if(this._overlay==="clip"&&this._clip){const e=this._clip;return y`<div class="overlay">
        <div class="card" role="dialog" aria-label="${this.t.saveClip}">
          <h3>${this.t.saveClip}</h3>
          ${e.error?y`<p>${e.error}</p>`:e.url?y`<p>Your last 10 seconds are ready to share.</p>`:y`<p>Recording the replay… ${e.progress}%</p>
                  <progress max="100" .value=${e.progress}></progress>`}
          <div class="actions">
            ${e.url?y`<a class="button primary" href="${e.url}" download="${e.name}">Download clip</a>`:v}
            <button @click=${this.closeClip} ?disabled=${!e.url&&!e.error}>Back to the game</button>
          </div>
        </div>
      </div>`}return v}renderFinal(){const e=this._final;if(!e||!this.match)return v;const t=e.result,s=this.match.teams,i=t.reason&&t.reason.startsWith("called");let a="Final";i?a="Game called: not enough players left":t.keepScore?t.reason==="overtime"?a="Final in overtime":t.reason==="shootout"&&(a="Final in a shootout"):a="Good game! Nobody kept score.";const n=this.tournament;return y`
      <div class="final">
        <h2>${a}</h2>
        <div class="scoreline">
          <div class="team"><img src="${$e(s.home.crest)}" width="56" height="56" alt="" />${s.home.name}</div>
          <div class="big">${t.keepScore?y`${t.home} – ${t.away}`:y`🏅`}</div>
          <div class="team"><img src="${$e(s.away.crest)}" width="56" height="56" alt="" />${s.away.name}</div>
        </div>
        <table class="stats">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">${s.home.short}</th>
              <th scope="col">${s.away.short}</th>
            </tr>
          </thead>
          <tbody>
            ${[["Shots on goal","shots"],["Passes","passes"],["Hits","hits"],["Penalty minutes","pim"]].map(o=>y`<tr>
                <th scope="row">${o[0]}</th>
                <td>${e.stats.home[o[1]]}</td>
                <td>${e.stats.away[o[1]]}</td>
              </tr>`)}
          </tbody>
        </table>
        <ul class="awards">
          ${e.awards.map(o=>y`<li><strong>${o.label}</strong>${o.who}</li>`)}
        </ul>
        <div class="start-row">
          ${n&&!n.done?y`<button
                class="primary"
                @click=${()=>{this._screen="bracket"}}
              >
                ${n.jamboree?"Next jamboree game":"See the bracket"}
              </button>`:v}
          ${n&&n.done?y`<button
                class="primary"
                @click=${()=>{this._screen="bracket"}}
              >
                ${n.jamboree?"Medals for everyone":"Tournament results"}
              </button>`:v}
          ${n?v:y`<button class="primary" @click=${()=>this.newGame(this.game.opts.home,this.game.opts.away)}>Play again</button>`}
          <button @click=${this.quit}>Change teams</button>
        </div>
      </div>
    `}renderBracket(){const e=this.tournament;if(!e)return v;const t=i=>i?z(i).name:"TBD",s=e.next();return y`
      <div class="bracket">
        <h2>${e.jamboree?`${J(this.level).label} Jamboree`:`${J(this.level).label} Tournament`}</h2>
        ${e.jamboree?y`<p class="blurb">Three games, no standings, no bracket. Everybody plays, everybody gets a medal. Somebody's parent is still keeping score in a notebook.</p>`:v}
        ${e.rounds.map(i=>y`
            <div class="round">
              <h3>${i.name}</h3>
              <ul>
                ${i.games.map(a=>y`<li class="${a.user?"mine":""}">
                    <span>${t(a.home)} vs ${t(a.away)}</span>
                    <span>${a.played?e.jamboree?"Played":`${a.score.home} \u2013 ${a.score.away}${a.winner?`, ${z(a.winner).short} advance`:""}`:a.user?"Your game":""}</span>
                  </li>`)}
              </ul>
            </div>
          `)}
        ${e.done?y`<h3>${e.jamboree?"Everybody gets a medal \u{1F3C5}":e.champion===e.team?`${t(e.champion)} are champions! \u{1F3C6}`:`${t(e.champion)} win the tournament.`}</h3>`:v}
        <div class="start-row">
          ${s?y`<button class="primary" @click=${this.playNextTournamentGame}>Play ${t(s.home)} vs ${t(s.away)}</button>`:v}
          <button @click=${this.quit}>Back to the menu</button>
        </div>
      </div>
    `}static get haxProperties(){return{canScale:!0,canEditSource:!0,gizmo:{title:"Youth Hockey '27",description:"A 16-bit youth hockey game. Set attract mode to embed a CPU vs CPU demo of an age level.",icon:"maps:directions-run",color:"pink",tags:["Interactive","game","hockey"],handles:[],meta:{author:"btopro"}},settings:{configure:[{property:"level",title:"Age level",inputMethod:"select",options:de.reduce((e,t)=>Object.assign(e,{[t.id]:t.label}),{})},{property:"home",title:"Home team",inputMethod:"select",options:U.reduce((e,t)=>Object.assign(e,{[t.id]:t.name}),{})},{property:"away",title:"Away team",inputMethod:"select",options:U.reduce((e,t)=>Object.assign(e,{[t.id]:t.name}),{})},{property:"roller",title:"Roller",inputMethod:"boolean"},{property:"attract",title:"Attract mode (CPU demo)",inputMethod:"boolean"}],advanced:[]},demoSchema:[{tag:"youth-hockey-27",properties:{level:"8U",attract:!0},content:""}]}}}globalThis.customElements.define(wt.tag,wt);
