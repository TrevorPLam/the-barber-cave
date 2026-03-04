'use client';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible modal dialog with focus trapping, screen reader announcements, and compound sub-components for Header, Body, and Footer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Maximum width of the modal',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is visible',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        Open Modal
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={size}>
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">
            This is the modal body. Press <kbd>Escape</kbd> or click outside to close.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm bg-black text-white rounded-md"
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: () => <ModalDemo />,
};

export const Small: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: () => <ModalDemo size="sm" />,
  parameters: {
    docs: {
      description: { story: 'Small modal — max-w-md, suitable for confirmation dialogs.' },
    },
  },
};

export const Large: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: () => <ModalDemo size="lg" />,
  parameters: {
    docs: {
      description: { story: 'Large modal — max-w-2xl, suitable for forms or detailed content.' },
    },
  },
};

export const ExtraLarge: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: () => <ModalDemo size="xl" />,
  parameters: {
    docs: {
      description: { story: 'Extra-large modal — max-w-4xl, suitable for full-page dialogs.' },
    },
  },
};

export const WithLongContent: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Open scrollable modal
        </button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>Scrollable Content</Modal.Header>
          <Modal.Body>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-gray-600 mb-3">
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};
