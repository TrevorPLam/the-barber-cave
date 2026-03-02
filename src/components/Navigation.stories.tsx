import type { Meta, StoryObj } from '@storybook/react';
import Navigation from './Navigation';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation component with responsive mobile menu and booking CTA.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isMenuOpen: {
      control: 'boolean',
      description: 'Controls the mobile menu visibility',
    },
    onMenuToggle: {
      action: 'menuToggled',
      description: 'Callback function when menu toggle is clicked',
    },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    isMenuOpen: false,
    onMenuToggle: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export const MobileMenuClosed: Story = {
  args: {
    isMenuOpen: false,
    onMenuToggle: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileMenuOpen: Story = {
  args: {
    isMenuOpen: true,
    onMenuToggle: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {
    isMenuOpen: false,
    onMenuToggle: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
