import type { Meta, StoryObj } from '@storybook/react-vite';
import Services from './Services';

const meta = {
  title: 'Components/Services',
  component: Services,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Services section displaying available grooming services with pricing, booking integration, and loading skeleton states.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Services>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomTheme: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const Loading: Story = {
  render: () => {
    // Create a wrapper component that forces loading state for all service cards
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium grooming services tailored to your style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Render 3 skeleton loading cards */}
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="service-card container-card relative p-8 rounded-2xl border-2 bg-white border-gray-200"
                aria-busy="true"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="ml-4 space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 w-32 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'ServiceCard loading skeleton state with pulse animations. Used while service data is being fetched.',
      },
    },
  },
};
