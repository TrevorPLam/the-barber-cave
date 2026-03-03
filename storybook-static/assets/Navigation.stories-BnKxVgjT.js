import{j as e}from"./jsx-runtime-C5WNSv3b.js";import{a as c}from"./iframe-BJ6HllSI.js";import{B as m,N as d,E as u}from"./constants-5u4NeMx7.js";import{S as h}from"./scissors-Gv3_nXVa.js";import{c as g}from"./createLucideIcon-CLs_u-vW.js";import"./preload-helper-PPVm8Dsz.js";const x=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],f=g("menu",x);const M=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],N=g("x",M),o=c.memo(({item:r,onClick:a})=>e.jsx("a",{href:r.href,onClick:a,className:"text-gray-700 hover:text-black transition-colors font-medium",children:r.label}));o.displayName="NavigationItem";const v=c.memo(function(){const[a,b]=c.useState(!1),p=()=>{b(!a)};return e.jsxs("nav",{className:"fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100","aria-label":"Main navigation",role:"banner",children:[e.jsx("div",{className:"max-w-7xl mx-auto px-6 lg:px-8",children:e.jsxs("div",{className:"flex justify-between items-center h-16",children:[e.jsx("div",{className:"flex items-center space-x-3",children:e.jsxs("a",{href:"#home",className:"flex items-center space-x-3","aria-label":`${m.name} - Back to home`,children:[e.jsx("div",{className:"w-10 h-10 bg-black rounded-full flex items-center justify-center",children:e.jsx(h,{className:"h-5 w-5 text-white","aria-hidden":"true"})}),e.jsx("span",{className:"text-xl font-bold text-black",children:m.name})]})}),e.jsxs("div",{className:"hidden lg:flex items-center space-x-8",children:[d.map(n=>e.jsx(o,{item:n},n.href)),e.jsx("a",{href:u.booking,target:"_blank",rel:"noopener noreferrer",className:"bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors font-medium",children:"Book Appointment"})]}),e.jsx("button",{onClick:p,className:"lg:hidden","aria-label":"Toggle menu","aria-expanded":a,"aria-controls":"mobile-menu",id:"mobile-menu-button",children:a?e.jsx(N,{className:"h-6 w-6"}):e.jsx(f,{className:"h-6 w-6"})})]})}),a&&e.jsx("div",{className:"lg:hidden bg-white border-b border-gray-100",id:"mobile-menu",children:e.jsxs("div",{className:"px-6 py-4 space-y-3",children:[d.map(n=>e.jsx(o,{item:n,onClick:p},n.href)),e.jsx("a",{href:u.booking,target:"_blank",rel:"noopener noreferrer",className:"block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors font-medium text-center",children:"Book Appointment"})]})})]})});try{o.displayName="NavigationItem",o.__docgenInfo={description:"",displayName:"NavigationItem",props:{}}}catch{}const O={title:"Components/Navigation",component:v,parameters:{layout:"fullscreen",docs:{description:{component:"The main navigation component with responsive mobile menu and booking CTA."}}},tags:["autodocs"],argTypes:{isMenuOpen:{control:"boolean",description:"Controls the mobile menu visibility"},onMenuToggle:{action:"menuToggled",description:"Callback function when menu toggle is clicked"}}},s={args:{isMenuOpen:!1,onMenuToggle:()=>{}},parameters:{viewport:{defaultViewport:"desktop"}}},t={args:{isMenuOpen:!1,onMenuToggle:()=>{}},parameters:{viewport:{defaultViewport:"mobile1"}}},i={args:{isMenuOpen:!0,onMenuToggle:()=>{}},parameters:{viewport:{defaultViewport:"mobile1"}}},l={args:{isMenuOpen:!1,onMenuToggle:()=>{}},parameters:{viewport:{defaultViewport:"tablet"}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    isMenuOpen: false,
    onMenuToggle: () => {}
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    }
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    isMenuOpen: false,
    onMenuToggle: () => {}
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    isMenuOpen: true,
    onMenuToggle: () => {}
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    isMenuOpen: false,
    onMenuToggle: () => {}
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  }
}`,...l.parameters?.docs?.source}}};const I=["Desktop","MobileMenuClosed","MobileMenuOpen","Tablet"];export{s as Desktop,t as MobileMenuClosed,i as MobileMenuOpen,l as Tablet,I as __namedExportsOrder,O as default};
