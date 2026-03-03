import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorBoundary from './ErrorBoundary';

// A component that throws an error for testing
const ThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary');
  }
  return <div className="p-4 bg-green-100 text-green-800">Component rendered successfully</div>;
};

const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Error boundary component that catches and displays errors gracefully.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fallback: {
      control: 'text',
      description: 'Custom fallback component or message',
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={false} />,
  },
};

export const WithError: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    fallback: (
      <div className="p-8 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Custom Error UI</h3>
        <p className="text-blue-700">This is a custom fallback component.</p>
      </div>
    ),
  },
};
