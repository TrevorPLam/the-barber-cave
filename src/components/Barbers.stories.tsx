import type { Meta, StoryObj } from '@storybook/react-vite';
import Barbers from './Barbers';

const meta = {
  title: 'Components/Barbers',
  component: Barbers,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Barbers section showcasing team members with ratings and availability.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Barbers>;

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
