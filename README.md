# The Barber Cave

A modern, responsive barber shop website built with Next.js 16, React 19, and TypeScript. This project showcases "The Barber Cave," a premier barber shop in Dallas, Texas, featuring 8 expert barbers, 29 specialized services including loc services, premium time slots, and comprehensive booking integration.

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/TrevorPLam/the-barber-cave)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/TrevorPLam/the-barber-cave/actions/workflows/performance.yml/badge.svg)](https://github.com/TrevorPLam/the-barber-cave/actions)
[![Accessibility](https://github.com/TrevorPLam/the-barber-cave/actions/workflows/accessibility.yml/badge.svg)](https://github.com/TrevorPLam/the-barber-cave/actions)
[![Documentation](https://github.com/TrevorPLam/the-barber-cave/actions/workflows/documentation.yml/badge.svg)](https://github.com/TrevorPLam/the-barber-cave/actions)

## � Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📝 Available Scripts](#-available-scripts)
- [🧪 Testing Strategy](#-testing-strategy)
- [🎨 Component Architecture](#-component-architecture)
- [🚀 Deployment](#-deployment)
- [🌐 Browser Support](#-browser-support)
- [⚡ Performance Optimizations (2026)](#-performance-optimizations-2026)
- [🆕 Recent Advanced Implementations](#-recent-advanced-implementations-2026-03-03)
- [🔧 Development Workflow](#-development-workflow)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)
- [🗺️ Roadmap](#️-roadmap)
- [👥 Authors & Acknowledgments](#-authors--acknowledgments)
- [📊 Project Status](#-project-status)

## � Features

- **Modern Tech Stack**: Next.js 16 with App Router, React 19, TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4
- **Performance Optimized**: Lazy loading, React.memo, and code splitting
- **Comprehensive Testing**: Unit tests (Vitest), E2E tests (Playwright), Visual regression (Chromatic)
- **Component Documentation**: Storybook with interactive component stories
- **Error Handling**: Global error boundaries and safe component wrappers
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support
- **Accessibility**: WCAG compliant with semantic HTML and ARIA labels

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **UI Components**: Custom component library

### Testing & Quality

- **Unit Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright
- **Visual Testing**: Storybook with Chromatic
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode

### Development Tools

- **Component Documentation**: Storybook 10.x
- **Bundle Analysis**: Built-in Next.js analyzer
- **Error Tracking**: Error boundaries with logging

## 📁 Project Structure

```text
the-barber-cave/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── __tests__/     # Page tests
│   │   ├── layout.tsx     # Root layout with metadata
│   │   └── page.tsx       # Home page with lazy loading
│   ├── components/        # Reusable React components
│   │   ├── __tests__/     # Component tests
│   │   ├── *.stories.tsx  # Storybook stories
│   │   ├── Navigation.tsx # Site navigation
│   │   ├── Hero.tsx       # Hero section
│   │   ├── Services.tsx   # Services showcase
│   │   ├── Barbers.tsx    # Barber profiles
│   │   ├── Gallery.tsx    # Work gallery
│   │   ├── About.tsx      # About section
│   │   ├── Contact.tsx    # Contact form
│   │   └── ErrorBoundary.tsx # Error handling
│   ├── data/              # Static data and constants
│   │   ├── constants.ts   # Business info and links
│   │   ├── services.ts    # Services data
│   │   └── barbers.ts     # Barber profiles
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── tests/                 # E2E tests
├── .storybook/           # Storybook configuration
├── TESTING_GUIDE.md      # Comprehensive testing documentation
├── CONTRIBUTING.md       # Git workflow, PR standards, code quality
└── DEBUGGING.md          # Common errors and troubleshooting
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd the-barber-cave
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing

```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:ui           # Run tests with UI interface
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:visual       # Run visual regression tests
```

### Storybook

```bash
npm run storybook         # Start Storybook dev server
npm run build-storybook   # Build Storybook for production
```

## 🧪 Testing Strategy

This project implements a comprehensive testing approach:

1. **Unit Testing** (Vitest + React Testing Library)
   - Component rendering and behavior
   - Custom hooks testing
   - Utility function testing

2. **Visual Regression Testing** (Storybook + Chromatic)
   - Component appearance consistency
   - Cross-browser visual testing
   - Design system compliance

3. **End-to-End Testing** (Playwright)
   - User workflow validation
   - Cross-browser compatibility
   - Mobile responsiveness

4. **Error Handling Testing**
   - Error boundary functionality
   - Fallback UI rendering
   - Error recovery scenarios

For detailed testing guidelines, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

## 🎨 Component Architecture

### Performance Optimizations

- **Lazy Loading**: Non-critical components loaded dynamically
- **React.memo**: Components wrapped to prevent unnecessary re-renders
- **Code Splitting**: Automatic route-based splitting with Next.js
- **Image Optimization**: Next.js Image component for web performance

### Error Handling

- **Global Error Boundary**: Wraps entire application
- **SafeComponent**: Wrapper for individual component error handling
- **ErrorFallback**: Consistent error UI across the application
- **Logging**: Development console logs, production error tracking ready

### Component Structure

```typescript
// Example component with optimizations
export default memo(function Component({ prop }: Props) {
  // Component logic with error handling
  return <div>{prop}</div>;
});
```

## 🚀 Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Next.js configuration
3. Deploy with automatic CI/CD

### Manual Deployment

```bash
npm run build
npm run start
```

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Error reporting service
SENTRY_DSN=your_sentry_dsn

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome Mobile Android 90+

## ⚡ Performance Optimizations (2026)

This project implements cutting-edge performance optimizations for 2026 web standards:

### Image & Media Performance

- **Priority Loading**: Above-the-fold hero images and first 4 barber profiles load with priority
- **Lazy Loading**: Gallery images use intersection observer with 50px root margin
- **Resource Hints**: Preconnect for Google Fonts, preload for critical CSS
- **Speculative Prefetching**: Booking URLs prefetch on hover for instant navigation
- **WebP/AVIF Support**: Next.js Image component with multiple format optimization

### Security Enhancements

- **CSP Hardening**: Removed `unsafe-eval`, nonce-based script controls
- **Environment Validation**: Runtime environment variable validation with production checks
- **Security Headers**: HSTS, CSP, X-Frame-Options, Referrer Policy, and more
- **Input Validation**: Comprehensive form validation with security rules

### Testing & Quality Assurance

- **Regression Tests**: Comprehensive test suite covering all critical fixes
- **Accessibility Audit**: WCAG compliance with axe-core automated testing
- **Performance Budgets**: Lighthouse CI integration for continuous monitoring
- **Build Validation**: Automated production build testing and smoke tests

### Development Experience

- **Type-Safe Environment**: Runtime validation of environment variables
- **Build Optimization**: Turbopack with cache components for faster builds
- **Error Boundaries**: Advanced error handling with retry logic and announcements
- **Component Architecture**: Memoized components with proper prop validation

## 🆕 Recent Advanced Implementations (2026-03-03)

The project has been enhanced with enterprise-grade implementations following advanced React/Next.js patterns:

### Performance Optimization ✅

- **OptimizedImage Component**: Advanced Next.js Image with priority loading, blur placeholders, error handling
- **Next.js Configuration**: Enhanced CSP and image optimization settings
- **React Compiler Patterns**: Automatic performance optimization with memoization

### Security Hardening ✅

- **Content Security Policy**: Nonce-based CSP with comprehensive security headers
- **Security Utilities**: Input validation, sanitization, rate limiting, CSRF protection
- **Environment Security**: Type-safe environment variables with validation

### Accessibility Enhancement ✅

- **WCAG 2.2 AA Compliance**: Updated components with proper ARIA attributes and keyboard navigation
- **Advanced Error Boundaries**: Focus management and screen reader announcements
- **Enhanced Error UI**: Accessible error states with retry functionality

### React Pattern Modernization ✅

- **Compound Components**: Card component with context-based theming and flexible layouts
- **Custom Hooks**: useBooking hook for state management with validation
- **Render Props**: DataFetcher component with retry logic and advanced data fetching

### Code Quality & Validation ✅

- **Comprehensive Testing**: 10+ test files covering all new components and functionality
- **Validation Framework**: Zod schemas for type-safe data validation
- **Error Handling**: Exponential backoff retry logic and robust error recovery

## 🔧 Development Workflow

1. **Feature Development**

   - Create components in `src/components/`
   - Add corresponding tests in `__tests__/`
   - Create Storybook stories for UI components
   - Test with visual regression tools

2. **Code Quality**

   - TypeScript strict mode enabled
   - ESLint for code quality
   - Prettier for code formatting (recommended)
   - Pre-commit hooks for automated checks

3. **Testing**

   - Unit tests for all components
   - E2E tests for critical user flows
   - Visual tests for UI consistency
   - Coverage reports for test completeness

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full Git workflow, branch conventions, commit standards, and PR checklist.

Quick steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request against `main`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions about The Barber Cave services:

- **Website**: [Live Site](https://the-barber-cave.vercel.app)
- **Booking**: [Book Appointment](https://getsquire.com/booking/book/the-barber-cave-dallas)
- **Social**: [@the_barbercave_](https://www.instagram.com/the_barbercave_)

For technical questions about this project:

- Open an issue on GitHub
- Review the [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing information
- Check [DEBUGGING.md](./DEBUGGING.md) for common errors and troubleshooting
- Check Storybook for component documentation

## 🗺️ Roadmap

### Q2 2026 - Advanced Features

- [ ] **Online Booking Integration**: Direct appointment scheduling with real-time availability
- [ ] **Customer Portal**: Account management for repeat customers with booking history
- [ ] **Payment Processing**: Secure online payments for services and products
- [ ] **SMS Notifications**: Automated reminders and confirmations via Twilio

### Q3 2026 - Business Intelligence

- [ ] **Analytics Dashboard**: Business metrics and performance tracking
- [ ] **Customer Insights**: Service preferences and trends analysis
- [ ] **Staff Performance**: Individual barber metrics and scheduling optimization
- [ ] **Inventory Management**: Product stock tracking and automated reordering

### Q4 2026 - Mobile Experience

- [ ] **Progressive Web App**: Offline-capable mobile experience
- [ ] **Push Notifications**: Service reminders and promotional offers
- [ ] **Mobile Payments**: Apple Pay, Google Pay integration
- [ ] **GPS Services**: Location-based service recommendations

### 2027+ - Enterprise Expansion

- [ ] **Multi-Location Support**: Management system for multiple barber shops
- [ ] **Franchise Portal**: Standardized operations for franchise locations
- [ ] **API Marketplace**: Third-party integrations for POS systems and CRM
- [ ] **AI-Powered Recommendations**: Personalized service suggestions

## 👥 Authors & Acknowledgments

### Core Contributors

- **Trevor P. Lam** - Lead Developer & Architect ([@TrevorPLam](https://github.com/TrevorPLam))

### Acknowledgments

- **The Barber Cave Team** - For providing the vision and business requirements
- **Open Source Community** - For the amazing tools and libraries that made this possible
- **Next.js & React Teams** - For building incredible frameworks that power modern web development

### Special Thanks

Thanks to all the beta testers, contributors, and the barber community for their feedback and support in making this platform exceptional.

## 📊 Project Status

🟢 **Active Development** - This project is actively maintained and regularly updated with new features and improvements.

### Current Phase: Production Ready

- ✅ Core functionality implemented
- ✅ Comprehensive testing suite
- ✅ Performance optimizations applied
- ✅ Accessibility compliance achieved
- ✅ Documentation complete

### Seeking Contributors

We're looking for contributors in these areas:
- **UI/UX Designers**: Help improve the visual design and user experience
- **Backend Developers**: Expand API integrations and business logic
- **QA Engineers**: Enhance our testing strategies and coverage
- **DevOps Engineers**: Improve deployment and monitoring infrastructure

### Support the Project

- ⭐ Star this repository if you find it useful
- 🐛 Report bugs and issues via GitHub Issues
- 💡 Suggest features and improvements
- 🤝 Contribute code via Pull Requests

## ️ Visuals

### Screenshots

#### Homepage Hero Section

![Homepage Hero](public/images/screenshots/hero-section.png)
*The main landing page showcasing The Barber Cave's premium services*

#### Services Showcase

![Services](public/images/screenshots/services-section.png)
*Comprehensive display of all 29 barber services including loc services*

#### Barber Profiles

![Barbers](public/images/screenshots/barbers-section.png)
*Meet the 8 expert barbers with their specialties and experience*

#### Gallery Preview

![Gallery](public/images/screenshots/gallery-section.png)
*Showcase of professional work and client transformations*

### Live Demo

🌐 **[View Live Site](https://the-barber-cave.vercel.app)** - Experience the full website in action

### Storybook Components

📚 **[Interactive Component Library](https://your-storybook-url.vercel.app)** - Explore all UI components with live examples

---

Built with ❤️ for The Barber Cave - Where Style Meets Excellence
