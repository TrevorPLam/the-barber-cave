// src/__tests__/Card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { Card } from '@/components/Card'

describe('Card Component', () => {
  it('renders default variant correctly', () => {
    render(
      <Card>
        <Card.Body>Test content</Card.Body>
      </Card>
    )

    const card = screen.getByText('Test content').parentElement?.parentElement
    expect(card).toHaveClass('bg-white', 'border', 'border-gray-200')
    expect(card).toHaveClass('p-6') // default md size
  })

  it('renders elevated variant', () => {
    render(
      <Card variant="elevated">
        <Card.Body>Content</Card.Body>
      </Card>
    )

    const card = screen.getByText('Content').parentElement?.parentElement
    expect(card).toHaveClass('bg-white', 'shadow-lg')
    expect(card).not.toHaveClass('border')
  })

  it('renders outlined variant', () => {
    render(
      <Card variant="outlined">
        <Card.Body>Content</Card.Body>
      </Card>
    )

    const card = screen.getByText('Content').parentElement?.parentElement
    expect(card).toHaveClass('bg-transparent', 'border-2', 'border-gray-300')
  })

  it('renders different sizes', () => {
    const { rerender } = render(
      <Card size="sm">
        <Card.Body>Small</Card.Body>
      </Card>
    )

    let card = screen.getByText('Small').parentElement?.parentElement
    expect(card).toHaveClass('p-4')

    rerender(
      <Card size="lg">
        <Card.Body>Large</Card.Body>
      </Card>
    )

    card = screen.getByText('Large').parentElement?.parentElement
    expect(card).toHaveClass('p-8')
  })

  it('renders compound components correctly', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    )

    expect(screen.getByText('Header')).toHaveClass('mb-4')
    expect(screen.getByText('Body')).toHaveClass('flex-1')
    expect(screen.getByText('Footer')).toHaveClass('mt-4', 'pt-4', 'border-t')
  })

  it('supports interactive mode', () => {
    const handleClick = vi.fn()
    render(
      <Card interactive onClick={handleClick}>
        <Card.Body>Interactive</Card.Body>
      </Card>
    )

    const card = screen.getByText('Interactive').parentElement?.parentElement
    expect(card).toHaveClass('cursor-pointer')
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabIndex', '0')

    fireEvent.click(card!)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard interaction in interactive mode', () => {
    const handleClick = vi.fn()
    render(
      <Card interactive onClick={handleClick}>
        <Card.Body>Interactive</Card.Body>
      </Card>
    )

    const card = screen.getByText('Interactive').parentElement?.parentElement

    fireEvent.keyDown(card!, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(card!, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(card!, { key: 'a' })
    expect(handleClick).toHaveBeenCalledTimes(2) // Should not trigger
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <Card.Body>Content</Card.Body>
      </Card>
    )

    const card = screen.getByText('Content').parentElement?.parentElement
    expect(card).toHaveClass('custom-class')
  })
})
