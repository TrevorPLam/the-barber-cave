import type { Meta, StoryObj } from '@storybook/react';
import ErrorFallback from './ErrorFallback';

const meta = {
  title: 'Components/ErrorFallback',
  component: ErrorFallback,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Fallback component for displaying error states with reset functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Custom error message to display',
    },
    showHomeButton: {
      control: 'boolean',
      description: 'Whether to show the home button',
    },
  },
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error('Sample error message'),
    resetError: () => console.log('Error reset'),
  },
};

export const CustomMessage: Story = {
  args: {
    error: new Error('Network error occurred'),
    message: 'Failed to load data. Please check your connection.',
    resetError: () => console.log('Error reset'),
  },
};

export const NoHomeButton: Story = {
  args: {
    error: new Error('Component error'),
    showHomeButton: false,
    resetError: () => console.log('Error reset'),
  },
};

export const NoResetFunction: Story = {
  args: {
    error: new Error('Read-only error'),
    message: 'This error cannot be reset.',
  },
};
