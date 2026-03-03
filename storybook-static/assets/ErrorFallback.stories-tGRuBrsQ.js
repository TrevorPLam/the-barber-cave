import{E as t}from"./ErrorFallback-BNsD1Yja.js";import"./jsx-runtime-C5WNSv3b.js";import"./triangle-alert-CVGs9S4V.js";import"./createLucideIcon-CLs_u-vW.js";import"./iframe-BJ6HllSI.js";import"./preload-helper-PPVm8Dsz.js";const i={title:"Components/ErrorFallback",component:t,parameters:{layout:"centered",docs:{description:{component:"Fallback component for displaying error states with reset functionality."}}},tags:["autodocs"],argTypes:{message:{control:"text",description:"Custom error message to display"},showHomeButton:{control:"boolean",description:"Whether to show the home button"}}},r={args:{error:new Error("Sample error message"),resetError:()=>console.log("Error reset")}},e={args:{error:new Error("Network error occurred"),message:"Failed to load data. Please check your connection.",resetError:()=>console.log("Error reset")}},o={args:{error:new Error("Component error"),showHomeButton:!1,resetError:()=>console.log("Error reset")}},s={args:{error:new Error("Read-only error"),message:"This error cannot be reset."}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('Sample error message'),
    resetError: () => console.log('Error reset')
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('Network error occurred'),
    message: 'Failed to load data. Please check your connection.',
    resetError: () => console.log('Error reset')
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('Component error'),
    showHomeButton: false,
    resetError: () => console.log('Error reset')
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    error: new Error('Read-only error'),
    message: 'This error cannot be reset.'
  }
}`,...s.parameters?.docs?.source}}};const d=["Default","CustomMessage","NoHomeButton","NoResetFunction"];export{e as CustomMessage,r as Default,o as NoHomeButton,s as NoResetFunction,d as __namedExportsOrder,i as default};
