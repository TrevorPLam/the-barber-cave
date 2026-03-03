import type { Meta, StoryObj } from '@storybook/react-vite';
import SafeComponent from './SafeComponent';

// A component that throws an error for testing
const ThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for SafeComponent');
  }
  return <div className="p-4 bg-green-100 text-green-800">Component rendered successfully</div>;
};

const meta = {
  title: 'Components/SafeComponent',
  component: SafeComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Wrapper component that provides error boundary protection for child components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    componentName: {
      control: 'text',
      description: 'Name of the component for error reporting',
    },
  },
} satisfies Meta<typeof SafeComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={false} />,
    componentName: 'TestComponent',
  },
};

export const WithError: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    componentName: 'TestComponent',
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    componentName: 'CustomComponent',
    fallback: (
      <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Custom Safe Component Error</h3>
        <p className="text-purple-700">This is a custom fallback for SafeComponent.</p>
      </div>
    ),
  },
};

export const WithErrorHandler: Story = {
  args: {
    children: <ThrowingComponent shouldThrow={true} />,
    componentName: 'LoggedComponent',
    onError: (error: Error, errorInfo: React.ErrorInfo) => {
      console.log('Custom error handler called:', error.message);
    },
  },
};
