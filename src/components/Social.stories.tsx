import type { Meta, StoryObj } from '@storybook/react';
import Social from './Social';

const meta = {
  title: 'Components/Social',
  component: Social,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Social media links section with hover effects.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Social>;

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
