var Pe=Object.defineProperty;var Ve=(n,e,t)=>e in n?Pe(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var oe=(n,e,t)=>Ve(n,typeof e!="symbol"?e+"":e,t);import{r as l,U as Be,W as Se,_ as De,R as H,a5 as se,a6 as Le,b as E,j as N,a as ae,u as le,a7 as we,s as Q,k as Z,g as je,a8 as ie,x as _,e as ke}from"./index-BJ_srvRi.js";import{_ as ve}from"./assertThisInitialized-B9jnkVVz.js";function re(n){try{return n.matches(":focus-visible")}catch{}return!1}function ee(n,e){var t=function(s){return e&&l.isValidElement(s)?e(s):s},a=Object.create(null);return n&&l.Children.map(n,function(o){return o}).forEach(function(o){a[o.key]=t(o)}),a}function Ne(n,e){n=n||{},e=e||{};function t(f){return f in e?e[f]:n[f]}var a=Object.create(null),o=[];for(var s in n)s in e?o.length&&(a[s]=o,o=[]):o.push(s);var i,p={};for(var u in e){if(a[u])for(i=0;i<a[u].length;i++){var d=a[u][i];p[a[u][i]]=t(d)}p[u]=t(u)}for(i=0;i<o.length;i++)p[o[i]]=t(o[i]);return p}function v(n,e,t){return t[e]!=null?t[e]:n.props[e]}function $e(n,e){return ee(n.children,function(t){return l.cloneElement(t,{onExited:e.bind(null,t),in:!0,appear:v(t,"appear",n),enter:v(t,"enter",n),exit:v(t,"exit",n)})})}function Fe(n,e,t){var a=ee(n.children),o=Ne(e,a);return Object.keys(o).forEach(function(s){var i=o[s];if(l.isValidElement(i)){var p=s in e,u=s in a,d=e[s],f=l.isValidElement(d)&&!d.props.in;u&&(!p||f)?o[s]=l.cloneElement(i,{onExited:t.bind(null,i),in:!0,exit:v(i,"exit",n),enter:v(i,"enter",n)}):!u&&p&&!f?o[s]=l.cloneElement(i,{in:!1}):u&&p&&l.isValidElement(d)&&(o[s]=l.cloneElement(i,{onExited:t.bind(null,i),in:d.props.in,exit:v(i,"exit",n),enter:v(i,"enter",n)}))}}),o}var Ie=Object.values||function(n){return Object.keys(n).map(function(e){return n[e]})},Ue={component:"div",childFactory:function(e){return e}},te=function(n){Be(e,n);function e(a,o){var s;s=n.call(this,a,o)||this;var i=s.handleExited.bind(ve(s));return s.state={contextValue:{isMounting:!0},handleExited:i,firstRender:!0},s}var t=e.prototype;return t.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},t.componentWillUnmount=function(){this.mounted=!1},e.getDerivedStateFromProps=function(o,s){var i=s.children,p=s.handleExited,u=s.firstRender;return{children:u?$e(o,p):Fe(o,i,p),firstRender:!1}},t.handleExited=function(o,s){var i=ee(this.props.children);o.key in i||(o.props.onExited&&o.props.onExited(s),this.mounted&&this.setState(function(p){var u=Se({},p.children);return delete u[o.key],{children:u}}))},t.render=function(){var o=this.props,s=o.component,i=o.childFactory,p=De(o,["component","childFactory"]),u=this.state.contextValue,d=Ie(this.state.children).map(i);return delete p.appear,delete p.enter,delete p.exit,s===null?H.createElement(se.Provider,{value:u},d):H.createElement(se.Provider,{value:u},H.createElement(s,p,d))},e}(H.Component);te.propTypes={};te.defaultProps=Ue;class G{constructor(){oe(this,"mountEffect",()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())});this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}static create(){return new G}static use(){const e=Le(G.create).current,[t,a]=l.useState(!1);return e.shouldMount=t,e.setShouldMount=a,l.useEffect(e.mountEffect,[t]),e}mount(){return this.mounted||(this.mounted=Oe(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}start(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.start(...e)})}stop(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.stop(...e)})}pulsate(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.pulsate(...e)})}}function ze(){return G.use()}function Oe(){let n,e;const t=new Promise((a,o)=>{n=a,e=o});return t.resolve=n,t.reject=e,t}function Ae(n){const{className:e,classes:t,pulsate:a=!1,rippleX:o,rippleY:s,rippleSize:i,in:p,onExited:u,timeout:d}=n,[f,h]=l.useState(!1),M=E(e,t.ripple,t.rippleVisible,a&&t.ripplePulsate),V={width:i,height:i,top:-(i/2)+s,left:-(i/2)+o},g=E(t.child,f&&t.childLeaving,a&&t.childPulsate);return!p&&!f&&h(!0),l.useEffect(()=>{if(!p&&u!=null){const L=setTimeout(u,d);return()=>{clearTimeout(L)}}},[u,p,d]),N.jsx("span",{className:M,style:V,children:N.jsx("span",{className:g})})}const b=ae("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),J=550,We=80,Xe=Z`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Ye=Z`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,Ke=Z`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,He=Q("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),_e=Q(Ae,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${b.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${Xe};
    animation-duration: ${J}ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
  }

  &.${b.ripplePulsate} {
    animation-duration: ${({theme:n})=>n.transitions.duration.shorter}ms;
  }

  & .${b.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${b.childLeaving} {
    opacity: 0;
    animation-name: ${Ye};
    animation-duration: ${J}ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
  }

  & .${b.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${Ke};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,Ge=l.forwardRef(function(e,t){const a=le({props:e,name:"MuiTouchRipple"}),{center:o=!1,classes:s={},className:i,...p}=a,[u,d]=l.useState([]),f=l.useRef(0),h=l.useRef(null);l.useEffect(()=>{h.current&&(h.current(),h.current=null)},[u]);const M=l.useRef(!1),V=we(),g=l.useRef(null),L=l.useRef(null),C=l.useCallback(c=>{const{pulsate:x,rippleX:R,rippleY:I,rippleSize:w,cb:U}=c;d(y=>[...y,N.jsx(_e,{classes:{ripple:E(s.ripple,b.ripple),rippleVisible:E(s.rippleVisible,b.rippleVisible),ripplePulsate:E(s.ripplePulsate,b.ripplePulsate),child:E(s.child,b.child),childLeaving:E(s.childLeaving,b.childLeaving),childPulsate:E(s.childPulsate,b.childPulsate)},timeout:J,pulsate:x,rippleX:R,rippleY:I,rippleSize:w},f.current)]),f.current+=1,h.current=U},[s]),$=l.useCallback((c={},x={},R=()=>{})=>{const{pulsate:I=!1,center:w=o||x.pulsate,fakeElement:U=!1}=x;if((c==null?void 0:c.type)==="mousedown"&&M.current){M.current=!1;return}(c==null?void 0:c.type)==="touchstart"&&(M.current=!0);const y=U?null:L.current,B=y?y.getBoundingClientRect():{width:0,height:0,left:0,top:0};let S,T,D;if(w||c===void 0||c.clientX===0&&c.clientY===0||!c.clientX&&!c.touches)S=Math.round(B.width/2),T=Math.round(B.height/2);else{const{clientX:z,clientY:j}=c.touches&&c.touches.length>0?c.touches[0]:c;S=Math.round(z-B.left),T=Math.round(j-B.top)}if(w)D=Math.sqrt((2*B.width**2+B.height**2)/3),D%2===0&&(D+=1);else{const z=Math.max(Math.abs((y?y.clientWidth:0)-S),S)*2+2,j=Math.max(Math.abs((y?y.clientHeight:0)-T),T)*2+2;D=Math.sqrt(z**2+j**2)}c!=null&&c.touches?g.current===null&&(g.current=()=>{C({pulsate:I,rippleX:S,rippleY:T,rippleSize:D,cb:R})},V.start(We,()=>{g.current&&(g.current(),g.current=null)})):C({pulsate:I,rippleX:S,rippleY:T,rippleSize:D,cb:R})},[o,C,V]),X=l.useCallback(()=>{$({},{pulsate:!0})},[$]),F=l.useCallback((c,x)=>{if(V.clear(),(c==null?void 0:c.type)==="touchend"&&g.current){g.current(),g.current=null,V.start(0,()=>{F(c,x)});return}g.current=null,d(R=>R.length>0?R.slice(1):R),h.current=x},[V]);return l.useImperativeHandle(t,()=>({pulsate:X,start:$,stop:F}),[X,$,F]),N.jsx(He,{className:E(b.root,s.root,i),ref:L,...p,children:N.jsx(te,{component:null,exit:!0,children:u})})});function qe(n){return je("MuiButtonBase",n)}const Je=ae("MuiButtonBase",["root","disabled","focusVisible"]),Qe=n=>{const{disabled:e,focusVisible:t,focusVisibleClassName:a,classes:o}=n,i=ke({root:["root",e&&"disabled",t&&"focusVisible"]},qe,o);return t&&a&&(i.root+=` ${a}`),i},Ze=Q("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(n,e)=>e.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${Je.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),ot=l.forwardRef(function(e,t){const a=le({props:e,name:"MuiButtonBase"}),{action:o,centerRipple:s=!1,children:i,className:p,component:u="button",disabled:d=!1,disableRipple:f=!1,disableTouchRipple:h=!1,focusRipple:M=!1,focusVisibleClassName:V,LinkComponent:g="a",onBlur:L,onClick:C,onContextMenu:$,onDragLeave:X,onFocus:F,onFocusVisible:c,onKeyDown:x,onKeyUp:R,onMouseDown:I,onMouseLeave:w,onMouseUp:U,onTouchEnd:y,onTouchMove:B,onTouchStart:S,tabIndex:T=0,TouchRippleProps:D,touchRippleRef:z,type:j,...O}=a,A=l.useRef(null),m=ze(),ue=ie(m.ref,z),[k,Y]=l.useState(!1);d&&k&&Y(!1),l.useImperativeHandle(o,()=>({focusVisible:()=>{Y(!0),A.current.focus()}}),[]);const ce=m.shouldMount&&!f&&!d;l.useEffect(()=>{k&&M&&!f&&m.pulsate()},[f,M,k,m]);const pe=P(m,"start",I,h),de=P(m,"stop",$,h),fe=P(m,"stop",X,h),he=P(m,"stop",U,h),me=P(m,"stop",r=>{k&&r.preventDefault(),w&&w(r)},h),ge=P(m,"start",S,h),be=P(m,"stop",y,h),Me=P(m,"stop",B,h),Re=P(m,"stop",r=>{re(r.target)||Y(!1),L&&L(r)},!1),xe=_(r=>{A.current||(A.current=r.currentTarget),re(r.target)&&(Y(!0),c&&c(r)),F&&F(r)}),q=()=>{const r=A.current;return u&&u!=="button"&&!(r.tagName==="A"&&r.href)},ye=_(r=>{M&&!r.repeat&&k&&r.key===" "&&m.stop(r,()=>{m.start(r)}),r.target===r.currentTarget&&q()&&r.key===" "&&r.preventDefault(),x&&x(r),r.target===r.currentTarget&&q()&&r.key==="Enter"&&!d&&(r.preventDefault(),C&&C(r))}),Ee=_(r=>{M&&r.key===" "&&k&&!r.defaultPrevented&&m.stop(r,()=>{m.pulsate(r)}),R&&R(r),C&&r.target===r.currentTarget&&q()&&r.key===" "&&!r.defaultPrevented&&C(r)});let K=u;K==="button"&&(O.href||O.to)&&(K=g);const W={};K==="button"?(W.type=j===void 0?"button":j,W.disabled=d):(!O.href&&!O.to&&(W.role="button"),d&&(W["aria-disabled"]=d));const Ce=ie(t,A),ne={...a,centerRipple:s,component:u,disabled:d,disableRipple:f,disableTouchRipple:h,focusRipple:M,tabIndex:T,focusVisible:k},Te=Qe(ne);return N.jsxs(Ze,{as:K,className:E(Te.root,p),ownerState:ne,onBlur:Re,onClick:C,onContextMenu:de,onFocus:xe,onKeyDown:ye,onKeyUp:Ee,onMouseDown:pe,onMouseLeave:me,onMouseUp:he,onDragLeave:fe,onTouchEnd:be,onTouchMove:Me,onTouchStart:ge,ref:Ce,tabIndex:d?-1:T,type:j,...W,...O,children:[i,ce?N.jsx(Ge,{ref:ue,center:s,...D}):null]})});function P(n,e,t,a=!1){return _(o=>(t&&t(o),a||n[e](o),!0))}export{ot as B};
