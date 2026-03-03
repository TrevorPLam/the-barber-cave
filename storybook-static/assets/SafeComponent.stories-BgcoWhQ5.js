import{j as e}from"./jsx-runtime-C5WNSv3b.js";import{E as f}from"./ErrorBoundary-BHcPBHal.js";import{E as g}from"./ErrorFallback-BNsD1Yja.js";import"./iframe-BJ6HllSI.js";import"./preload-helper-PPVm8Dsz.js";import"./triangle-alert-CVGs9S4V.js";import"./createLucideIcon-CLs_u-vW.js";import"./refresh-cw-Bcvf8XbC.js";function m({children:r,fallback:c,onError:i,componentName:p="Component"}){const u=(l,d)=>{console.error(`Error in ${p}:`,l,d),i?.(l,d)},h=c||e.jsx(g,{message:`The ${p} component encountered an error`,showHomeButton:!1});return e.jsx(f,{fallback:h,onError:u,children:r})}try{m.displayName="SafeComponent",m.__docgenInfo={description:"",displayName:"SafeComponent",props:{fallback:{defaultValue:null,description:"",name:"fallback",required:!1,type:{name:"ReactNode"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error, errorInfo: ErrorInfo) => void) | undefined"}},componentName:{defaultValue:{value:"Component"},description:"",name:"componentName",required:!1,type:{name:"string | undefined"}}}}}catch{}const s=({shouldThrow:r=!1})=>{if(r)throw new Error("Test error for SafeComponent");return e.jsx("div",{className:"p-4 bg-green-100 text-green-800",children:"Component rendered successfully"})},j={title:"Components/SafeComponent",component:m,parameters:{layout:"centered",docs:{description:{component:"Wrapper component that provides error boundary protection for child components."}}},tags:["autodocs"],argTypes:{componentName:{control:"text",description:"Name of the component for error reporting"}}},o={args:{children:e.jsx(s,{shouldThrow:!1}),componentName:"TestComponent"}},n={args:{children:e.jsx(s,{shouldThrow:!0}),componentName:"TestComponent"}},t={args:{children:e.jsx(s,{shouldThrow:!0}),componentName:"CustomComponent",fallback:e.jsxs("div",{className:"p-6 bg-purple-50 border border-purple-200 rounded-lg text-center",children:[e.jsx("h3",{className:"text-lg font-semibold text-purple-900 mb-2",children:"Custom Safe Component Error"}),e.jsx("p",{className:"text-purple-700",children:"This is a custom fallback for SafeComponent."})]})}},a={args:{children:e.jsx(s,{shouldThrow:!0}),componentName:"LoggedComponent",onError:(r,c)=>{console.log("Custom error handler called:",r.message)}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={false} />,
    componentName: 'TestComponent'
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    componentName: 'TestComponent'
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    componentName: 'CustomComponent',
    fallback: <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">\r
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Custom Safe Component Error</h3>\r
        <p className="text-purple-700">This is a custom fallback for SafeComponent.</p>\r
      </div>
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    componentName: 'LoggedComponent',
    onError: (error: Error, errorInfo: React.ErrorInfo) => {
      console.log('Custom error handler called:', error.message);
    }
  }
}`,...a.parameters?.docs?.source}}};const y=["Normal","WithError","WithCustomFallback","WithErrorHandler"];export{o as Normal,t as WithCustomFallback,n as WithError,a as WithErrorHandler,y as __namedExportsOrder,j as default};
