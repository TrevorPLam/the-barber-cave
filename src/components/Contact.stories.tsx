import type { Meta, StoryObj } from '@storybook/react-vite';
import Contact from './Contact';

const meta = {
  title: 'Components/Contact',
  component: Contact,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Contact section with location, booking, and hours information.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomTheme: Story = {
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};
