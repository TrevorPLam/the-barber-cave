import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component with optional header, footer, and multiple visual variants. Supports interactive mode with keyboard accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Padding size',
    },
    interactive: {
      control: 'boolean',
      description: 'Enables hover/focus states and click handler',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p className="text-gray-600">Card body content goes here.</p>,
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <p className="text-gray-600">Elevated card with drop shadow.</p>,
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: <p className="text-gray-600">Outlined card with a border.</p>,
  },
};

export const WithHeader: Story = {
  args: {
    header: <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>,
    children: <p className="text-gray-600">Card content below the header.</p>,
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    variant: 'elevated',
    header: <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>,
    children: <p className="text-gray-600">Main content area of the card.</p>,
    footer: (
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </button>
        <button className="px-3 py-1.5 text-sm bg-black text-white rounded-md">
          Confirm
        </button>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'elevated',
    interactive: true,
    onClick: () => alert('Card clicked'),
    children: (
      <p className="text-gray-600">
        Click or press Enter/Space to activate this interactive card.
      </p>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: <p className="text-sm text-gray-600">Compact card content.</p>,
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    variant: 'elevated',
    children: <p className="text-gray-600">Spacious card content for prominent sections.</p>,
  },
};

export const CompoundParts: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Card variant="elevated" size="md">
      <Card.Header>
        <h3 className="text-xl font-bold text-gray-900">Using Compound Parts</h3>
      </Card.Header>
      <Card.Body>
        <p className="text-gray-600">
          This story uses the compound Card.Header, Card.Body, and Card.Footer sub-components.
        </p>
      </Card.Body>
      <Card.Footer>
        <button className="text-sm font-medium text-black underline">Learn more →</button>
      </Card.Footer>
    </Card>
  ),
};
