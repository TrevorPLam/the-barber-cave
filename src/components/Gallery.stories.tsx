import type { Meta, StoryObj } from '@storybook/react-vite';
import Gallery from './Gallery';

const meta = {
  title: 'Components/Gallery',
  component: Gallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Gallery section showcasing barber work with enhanced hover effects including scale animations, gradient overlays, and accessibility support.',
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

export const HoverStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hover over gallery items to see enhanced animations: scale(110%), brightness reduction, gradient overlay, content slide-up, and amber border highlight.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Simulate hover for visual testing documentation
    const galleryItems = canvasElement.querySelectorAll('[role="button"]');
    if (galleryItems.length > 0) {
      galleryItems[0].classList.add('group-hover');
    }
  },
};
