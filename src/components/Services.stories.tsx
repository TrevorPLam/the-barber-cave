import type { Meta, StoryObj } from '@storybook/react-vite';
import Services from './Services';

const meta = {
  title: 'Components/Services',
  component: Services,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Services section displaying available grooming services with pricing and booking.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Services>;

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
