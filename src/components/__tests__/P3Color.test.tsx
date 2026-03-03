import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { P3Gradient } from '../P3Color'

describe('P3Gradient', () => {
  it('renders children content', () => {
    render(
      <P3Gradient from="color(display-p3 0 0 0 / 1)" to="color(display-p3 1 1 1 / 1)">
        <p>Gradient content</p>
      </P3Gradient>
    )

    expect(screen.getByText('Gradient content')).toBeInTheDocument()
  })

  it('applies angle and fallback gradient as background', () => {
    const { container } = render(
      <P3Gradient
        angle="45deg"
        from="color(display-p3 0.9 0.2 0.1 / 0.9)"
        to="color(display-p3 0.2 0.4 0.9 / 0.4)"
        fallbackFrom="rgba(10, 20, 30, 0.8)"
        fallbackTo="rgba(200, 210, 220, 0.5)"
      >
        <span>fallback test</span>
      </P3Gradient>
    )

    const gradient = container.firstElementChild as HTMLElement

    const inlineStyle = gradient.getAttribute('style') ?? ''

    expect(inlineStyle).toContain('background: linear-gradient(45deg, rgba(10, 20, 30, 0.8), rgba(200, 210, 220, 0.5));')
  })

  it('adds display-p3 gradient via backgroundImage for progressive enhancement', () => {
    const { container } = render(
      <P3Gradient
        angle="135deg"
        from="color(display-p3 0.1 0.2 0.3 / 0.8)"
        to="color(display-p3 0.8 0.7 0.6 / 0.3)"
      >
        <span>content</span>
      </P3Gradient>
    )

    const gradient = container.firstElementChild as HTMLElement

    expect(gradient.style.backgroundImage).toContain('135deg')
    expect(gradient.style.backgroundImage).toContain('color(display-p3 0.1 0.2 0.3 / 0.8)')
    expect(gradient.style.backgroundImage).toContain('color(display-p3 0.8 0.7 0.6 / 0.3)')
  })
})
