import type { Meta, StoryObj } from '@storybook/react-vite';
import About from './About';

const meta = {
  title: 'Components/About',
  component: About,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'About section showcasing business information, statistics, and shop interior.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof About>;

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
