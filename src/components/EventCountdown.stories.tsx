import type { Meta, StoryObj } from '@storybook/react-vite';
import EventCountdown from './EventCountdown';

const meta = {
  title: 'Components/EventCountdown',
  component: EventCountdown,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live countdown timer for the Bring Wha-Cha Got barber battle event. Displays days, hours, minutes, and seconds until the event date. Client-only render to avoid hydration mismatch.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventCountdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story:
          'The EventCountdown component is designed for dark backgrounds matching the site theme.',
      },
    },
  },
};
