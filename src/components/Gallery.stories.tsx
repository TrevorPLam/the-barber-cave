import type { Meta, StoryObj } from '@storybook/react';
import Gallery from './Gallery';

const meta = {
  title: 'Components/Gallery',
  component: Gallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Gallery section showcasing barber work with hover effects.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Gallery>;

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
