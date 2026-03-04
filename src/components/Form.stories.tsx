'use client';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from './Form';

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compound form component with Zod schema validation, field-level errors, and sub-components: Form.Field, Form.Label, Form.Input, Form.Textarea, Form.Select, Form.Error, Form.Submit.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicForm: Story = {
  args: {
    onSubmit: () => {},
    children: null,
  },
  render: () => (
    <div className="w-80">
      <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
        <div className="space-y-4">
          <Form.Field name="name">
            <Form.Label htmlFor="name" required>
              Full Name
            </Form.Label>
            <Form.Input id="name" name="name" placeholder="Enter your name" required />
          </Form.Field>
          <Form.Field name="email">
            <Form.Label htmlFor="email" required>
              Email
            </Form.Label>
            <Form.Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </Form.Field>
          <Form.Submit>Submit</Form.Submit>
        </div>
      </Form>
    </div>
  ),
};

export const WithTextarea: Story = {
  args: {
    onSubmit: () => {},
    children: null,
  },
  render: () => (
    <div className="w-80">
      <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
        <div className="space-y-4">
          <Form.Field name="message">
            <Form.Label htmlFor="message">Message</Form.Label>
            <Form.Textarea
              id="message"
              name="message"
              placeholder="Write your message..."
              rows={4}
            />
          </Form.Field>
          <Form.Submit>Send Message</Form.Submit>
        </div>
      </Form>
    </div>
  ),
};

export const WithSelect: Story = {
  args: {
    onSubmit: () => {},
    children: null,
  },
  render: () => (
    <div className="w-80">
      <Form onSubmit={(data) => alert(JSON.stringify(data, null, 2))}>
        <div className="space-y-4">
          <Form.Field name="service">
            <Form.Label htmlFor="service" required>
              Select Service
            </Form.Label>
            <Form.Select
              id="service"
              name="service"
              placeholder="Choose a service..."
              options={[
                { value: 'haircut', label: 'Haircut — $30' },
                { value: 'beard', label: 'Beard Trim — $20' },
                { value: 'combo', label: 'Haircut + Beard — $45' },
              ]}
              required
            />
          </Form.Field>
          <Form.Submit>Book Now</Form.Submit>
        </div>
      </Form>
    </div>
  ),
};

export const WithValidationErrors: Story = {
  args: {
    onSubmit: () => {},
    children: null,
  },
  render: () => (
    <div className="w-80">
      <Form.Error message="This field is required" />
      <div className="mt-4 space-y-4">
        <Form.Field name="email">
          <Form.Label htmlFor="email-err" required>
            Email
          </Form.Label>
          <Form.Input
            id="email-err"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="border-red-500 focus:ring-red-500"
          />
          <Form.Error message="Please enter a valid email address" />
        </Form.Field>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates field-level error state rendering. Errors appear automatically when Zod schema validation fails on submit.',
      },
    },
  },
};

export const BookingForm: Story = {
  args: {
    onSubmit: () => {},
    children: null,
  },
  render: () => {
    const { z } = require('zod');
    const bookingSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      phone: z.string().min(7, 'Valid phone number required'),
      service: z.string().min(1, 'Please select a service'),
      notes: z.string().optional(),
    });

    return (
      <div className="w-96">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Book an Appointment</h2>
        <Form
          schema={bookingSchema}
          onSubmit={(data) => alert(`Booking submitted:\n${JSON.stringify(data, null, 2)}`)}
          className="space-y-4"
        >
          <Form.Field name="name">
            <Form.Label htmlFor="book-name" required>
              Full Name
            </Form.Label>
            <Form.Input id="book-name" name="name" placeholder="Your full name" />
          </Form.Field>
          <Form.Field name="phone">
            <Form.Label htmlFor="book-phone" required>
              Phone
            </Form.Label>
            <Form.Input id="book-phone" name="phone" type="tel" placeholder="+1 (601) 000-0000" />
          </Form.Field>
          <Form.Field name="service">
            <Form.Label htmlFor="book-service" required>
              Service
            </Form.Label>
            <Form.Select
              id="book-service"
              name="service"
              placeholder="Choose a service..."
              options={[
                { value: 'haircut', label: 'Haircut — $30' },
                { value: 'beard', label: 'Beard Trim — $20' },
                { value: 'combo', label: 'Haircut + Beard — $45' },
              ]}
            />
          </Form.Field>
          <Form.Field name="notes">
            <Form.Label htmlFor="book-notes">Notes (optional)</Form.Label>
            <Form.Textarea id="book-notes" name="notes" rows={3} placeholder="Any special requests?" />
          </Form.Field>
          <Form.Submit className="w-full">Request Appointment</Form.Submit>
        </Form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Full booking form with Zod schema validation. Submit with empty fields to see errors.',
      },
    },
  },
};
