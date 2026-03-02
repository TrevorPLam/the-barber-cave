import type { Meta, StoryObj } from '@storybook/react';
import { ContainerQueries, useContainerQuerySupport } from './ContainerQueries';

const meta: Meta<typeof ContainerQueries> = {
  title: 'Components/ContainerQueries',
  component: ContainerQueries,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Container Queries component provides a wrapper for implementing CSS container queries.
This allows components to respond to the size of their parent container rather than the viewport.

## Features
- Configurable container type (size, inline-size, normal)
- Optional container naming for targeted queries
- Fallback support for browsers without container query support
- TypeScript support with proper HTML div attributes
- Forward ref support

## Usage
Use this component to wrap grid layouts or card components that should adapt to their container size rather than the viewport size.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    containerType: {
      control: 'select',
      options: ['size', 'inline-size', 'normal'],
      description: 'Type of containment to apply',
    },
    containerName: {
      control: 'text',
      description: 'Optional name for targeting specific containers',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 bg-blue-100 rounded">
        <p className="text-lg font-semibold">Container Content</p>
        <p className="text-sm text-gray-600">This content responds to container size</p>
      </div>
    ),
    className: 'w-64 h-64 border-2 border-dashed border-gray-300',
  },
};

export const InlineSize: Story = {
  args: {
    containerType: 'inline-size',
    children: (
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-green-100 rounded">Card 1</div>
        <div className="p-4 bg-green-100 rounded">Card 2</div>
        <div className="p-4 bg-green-100 rounded">Card 3</div>
      </div>
    ),
    className: 'w-96 h-64 border-2 border-dashed border-gray-300',
  },
};

export const NamedContainer: Story = {
  args: {
    containerName: 'card-grid',
    containerType: 'inline-size',
    children: (
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-purple-100 rounded">Named Card 1</div>
        <div className="p-4 bg-purple-100 rounded">Named Card 2</div>
      </div>
    ),
    className: 'w-80 h-64 border-2 border-dashed border-gray-300',
  },
};

export const SizeContainer: Story = {
  args: {
    containerType: 'size',
    children: (
      <div className="p-4 bg-orange-100 rounded">
        <p className="font-semibold">Size Container</p>
        <p className="text-sm">Responds to both width and height changes</p>
      </div>
    ),
    className: 'w-72 h-72 border-2 border-dashed border-gray-300',
  },
};

export const BarberGridDemo: Story = {
  args: {
    containerName: 'barber-grid',
    containerType: 'inline-size',
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-4xl',
    children: (
      <>
        <div className="barber-card text-center group container-card p-4 bg-white rounded-lg shadow">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold">Barber 1</h3>
          <p className="text-sm text-gray-600">Senior Barber</p>
        </div>
        <div className="barber-card text-center group container-card p-4 bg-white rounded-lg shadow">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold">Barber 2</h3>
          <p className="text-sm text-gray-600">Master Barber</p>
        </div>
        <div className="barber-card text-center group container-card p-4 bg-white rounded-lg shadow">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold">Barber 3</h3>
          <p className="text-sm text-gray-600">Expert Barber</p>
        </div>
        <div className="barber-card text-center group container-card p-4 bg-white rounded-lg shadow">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="font-bold">Barber 4</h3>
          <p className="text-sm text-gray-600">Junior Barber</p>
        </div>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const ServicesGridDemo: Story = {
  args: {
    containerName: 'services-grid',
    containerType: 'inline-size',
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl',
    children: (
      <>
        <div className="service-card container-card p-6 bg-white rounded-lg shadow border">
          <div className="icon-container w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <h3 className="font-bold mb-2">Haircut</h3>
          <p className="text-sm text-gray-600 mb-4">Professional haircut service</p>
          <div className="font-bold">$25</div>
        </div>
        <div className="service-card container-card p-6 bg-white rounded-lg shadow border">
          <div className="icon-container w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <h3 className="font-bold mb-2">Beard Trim</h3>
          <p className="text-sm text-gray-600 mb-4">Expert beard styling</p>
          <div className="font-bold">$15</div>
        </div>
        <div className="service-card container-card p-6 bg-white rounded-lg shadow border">
          <div className="icon-container w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <h3 className="font-bold mb-2">Shave</h3>
          <p className="text-sm text-gray-600 mb-4">Traditional hot towel shave</p>
          <div className="font-bold">$30</div>
        </div>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const ResponsiveDemo: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Container Query Responsive Demo</h3>
        <p className="text-sm text-gray-600">Resize the viewport to see container queries in action</p>
      </div>
      
      <ContainerQueries 
        containerName="demo-grid" 
        containerType="inline-size"
        className="grid grid-cols-1 gap-4 w-full"
      >
        <div className="container-card p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-900">Small Container</h4>
          <p className="text-sm text-blue-700">Adapts to container width</p>
        </div>
        <div className="container-card p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-900">Medium Container</h4>
          <p className="text-sm text-green-700">Responsive typography</p>
        </div>
        <div className="container-card p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <h4 className="font-bold text-purple-900">Large Container</h4>
          <p className="text-sm text-purple-700">Scales with container</p>
        </div>
      </ContainerQueries>
    </div>
  ),
  parameters: {
    viewport: {
      viewports: {
        small: {
          name: 'Small',
          styles: { width: '400px', height: '600px' },
        },
        medium: {
          name: 'Medium', 
          styles: { width: '800px', height: '600px' },
        },
        large: {
          name: 'Large',
          styles: { width: '1200px', height: '600px' },
        },
      },
    },
  },
};

export const FallbackDemo: Story = {
  args: {
    containerType: 'inline-size',
    className: 'container-queries-fallback w-full',
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-100 rounded">Fallback Card 1</div>
        <div className="p-4 bg-yellow-100 rounded">Fallback Card 2</div>
        <div className="p-4 bg-yellow-100 rounded">Fallback Card 3</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates fallback behavior for browsers without container query support using @supports queries',
      },
    },
  },
};
