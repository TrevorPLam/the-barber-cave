import type { Meta, StoryObj } from '@storybook/react';
import { P3Color, P3Gradient, useP3Support } from './P3Color';

const meta: Meta<typeof P3Color> = {
  title: 'Design System/P3Color',
  component: P3Color,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
P3 Color Space Implementation

This component demonstrates the implementation of P3 color space support with automatic sRGB fallbacks.

**Features:**
- P3 color space support for compatible displays
- Automatic sRGB fallbacks for unsupported browsers/devices
- Hardware-aware optimization via color-gamut media queries
- Enhanced color accuracy and vibrancy

**Browser Support:**
- Safari: Full P3 support since 2017
- Chrome: P3 support with color-gamut media query
- Firefox: Limited support, falls back to sRGB
- Edge: P3 support in recent versions

**Detection:**
The system uses both CSS @supports and media queries for optimal compatibility:
1. \`@supports (color: color(display-p3 1 1 1))\` - Browser syntax support
2. \`@media (color-gamut: p3)\` - Hardware capability detection
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">P3 Color Demonstration</h2>
      
      {/* Color Swatches */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <div>
                <div className="font-medium">Primary Accent</div>
                <div className="text-sm text-gray-600">P3: color(display-p3 0.831 0.647 0.455)</div>
                <div className="text-sm text-gray-600">sRGB: #d4a574</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg"
                style={{ backgroundColor: 'var(--accent-bright)' }}
              />
              <div>
                <div className="font-medium">Bright Accent</div>
                <div className="text-sm text-gray-600">P3: color(display-p3 0.902 0.753 0.533)</div>
                <div className="text-sm text-gray-600">sRGB: #e6c088</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Grayscale Colors</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg border"
                style={{ backgroundColor: 'var(--background)' }}
              />
              <div>
                <div className="font-medium">Background</div>
                <div className="text-sm text-gray-600">P3: color(display-p3 1 1 1)</div>
                <div className="text-sm text-gray-600">sRGB: #ffffff</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg"
                style={{ backgroundColor: 'var(--foreground)' }}
              />
              <div>
                <div className="font-medium">Foreground</div>
                <div className="text-sm text-gray-600">P3: color(display-p3 0.090 0.090 0.090)</div>
                <div className="text-sm text-gray-600">sRGB: #171717</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Demonstration */}
      <div>
        <h3 className="text-lg font-semibold mb-4">P3 Enhanced Gradients</h3>
        <P3Gradient 
          className="p-8 rounded-lg text-white text-center"
          from="var(--gradient-start)"
          to="var(--gradient-end)"
        >
          <div className="text-xl font-bold">P3 Gradient Background</div>
          <div className="text-sm opacity-80">Enhanced color depth and smoothness</div>
        </P3Gradient>
      </div>

      {/* P3 Support Detection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">P3 Support Detection</h3>
        <P3SupportDetector />
      </div>
    </div>
  ),
};

export const ColorComparison: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">P3 vs sRGB Color Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* P3 Colors */}
        <div>
          <h3 className="text-lg font-semibold mb-4">P3 Enhanced Colors</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'color(display-p3 0.831 0.647 0.455)' }}>
              <div className="text-white font-medium">P3 Amber</div>
              <div className="text-white/80 text-sm">Richer, more vibrant gold tones</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'color(display-p3 0.902 0.753 0.533)' }}>
              <div className="text-black font-medium">P3 Light Amber</div>
              <div className="text-black/80 text-sm">Enhanced brightness and clarity</div>
            </div>
          </div>
        </div>

        {/* sRGB Fallbacks */}
        <div>
          <h3 className="text-lg font-semibold mb-4">sRGB Fallback Colors</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#d4a574' }}>
              <div className="text-white font-medium">sRGB Amber</div>
              <div className="text-white/80 text-sm">Standard web color space</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#e6c088' }}>
              <div className="text-black font-medium">sRGB Light Amber</div>
              <div className="text-black/80 text-sm">Standard web color space</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// P3 Support Detector Component
const P3SupportDetector = () => {
  const p3Supported = useP3Support();
  
  return (
    <div className="p-4 rounded-lg border">
      <div className="font-medium mb-2">P3 Color Support Status</div>
      <div className={`text-sm ${p3Supported ? 'text-green-600' : 'text-orange-600'}`}>
        {p3Supported ? '✅ P3 color space supported' : '⚠️ P3 not supported - using sRGB fallbacks'}
      </div>
      <div className="text-xs text-gray-600 mt-2">
        {p3Supported 
          ? 'Your display and browser support P3 color space for enhanced color accuracy'
          : 'Falling back to standard sRGB colors for compatibility'
        }
      </div>
    </div>
  );
};
