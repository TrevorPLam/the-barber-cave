import{j as r}from"./jsx-runtime-C5WNSv3b.js";import{E as n}from"./ErrorBoundary-BHcPBHal.js";import"./iframe-BJ6HllSI.js";import"./preload-helper-PPVm8Dsz.js";import"./triangle-alert-CVGs9S4V.js";import"./createLucideIcon-CLs_u-vW.js";import"./refresh-cw-Bcvf8XbC.js";const t=({shouldThrow:a=!1})=>{if(a)throw new Error("Test error for ErrorBoundary");return r.jsx("div",{className:"p-4 bg-green-100 text-green-800",children:"Component rendered successfully"})},h={title:"Components/ErrorBoundary",component:n,parameters:{layout:"centered",docs:{description:{component:"Error boundary component that catches and displays errors gracefully."}}},tags:["autodocs"],argTypes:{fallback:{control:"text",description:"Custom fallback component or message"}}},e={args:{children:r.jsx(t,{shouldThrow:!1})}},o={args:{children:r.jsx(t,{shouldThrow:!0})}},s={args:{children:r.jsx(t,{shouldThrow:!0}),fallback:r.jsxs("div",{className:"p-8 bg-blue-50 border border-blue-200 rounded-lg text-center",children:[r.jsx("h3",{className:"text-lg font-semibold text-blue-900 mb-2",children:"Custom Error UI"}),r.jsx("p",{className:"text-blue-700",children:"This is a custom fallback component."})]})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={false} />
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={true} />
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    fallback: <div className="p-8 bg-blue-50 border border-blue-200 rounded-lg text-center">\r
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Custom Error UI</h3>\r
        <p className="text-blue-700">This is a custom fallback component.</p>\r
      </div>
  }
}`,...s.parameters?.docs?.source}}};const b=["Normal","WithError","WithCustomFallback"];export{e as Normal,s as WithCustomFallback,o as WithError,b as __namedExportsOrder,h as default};
