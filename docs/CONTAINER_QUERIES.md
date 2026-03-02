# Container Queries Implementation Guide

## Overview

This document outlines the implementation of CSS Container Queries in The Barber Cave project. Container queries allow components to respond to the size of their parent container rather than the viewport, enabling more modular and reusable responsive design patterns.

## Implementation Date
**2026-03-02**

## Features Implemented

### 1. ContainerQueries Component
- **Location**: `src/components/ContainerQueries.tsx`
- **Purpose**: React wrapper for implementing CSS container queries
- **Features**:
  - Configurable container type (`size`, `inline-size`, `normal`)
  - Optional container naming for targeted queries
  - TypeScript support with proper HTML div attributes
  - Forward ref support
  - Support detection hook

### 2. CSS Utilities
- **Location**: `src/app/globals.css` (lines 94-221)
- **Features**:
  - Base container query classes
  - Component-specific breakpoints
  - Fallback support for older browsers
  - Responsive typography scaling

### 3. Component Integration
- **Barbers Component**: Enhanced with container queries for card layouts
- **Services Component**: Enhanced with container queries for service cards
- **Fallback Support**: Maintains traditional responsive grid as fallback

## Container Query Breakpoints

### General Component Breakpoints
```css
@container (max-width: 400px) {
  /* Small containers - compact layout */
  .container-card { padding: 1rem; }
  .container-card h3 { font-size: 1.125rem; }
}

@container (min-width: 401px) and (max-width: 700px) {
  /* Medium containers - balanced layout */
  .container-card { padding: 1.5rem; }
  .container-card h3 { font-size: 1.25rem; }
}

@container (min-width: 701px) {
  /* Large containers - spacious layout */
  .container-card { padding: 2rem; }
  .container-card h3 { font-size: 1.5rem; }
}
```

### Barber-Specific Breakpoints
```css
@container (max-width: 350px) {
  .barber-card .aspect-square { height: 200px; }
  .barber-card h3 { font-size: 1rem; }
}

@container (min-width: 351px) and (max-width: 500px) {
  .barber-card .aspect-square { height: 250px; }
  .barber-card h3 { font-size: 1.125rem; }
}

@container (min-width: 501px) {
  .barber-card .aspect-square { height: 300px; }
  .barber-card h3 { font-size: 1.25rem; }
}
```

### Service-Specific Breakpoints
```css
@container (max-width: 400px) {
  .service-card { padding: 1.5rem; }
  .service-card .icon-container { width: 2.5rem; height: 2.5rem; }
  .service-card h3 { font-size: 1.125rem; }
}

@container (min-width: 401px) {
  .service-card { padding: 2rem; }
  .service-card .icon-container { width: 3rem; height: 3rem; }
  .service-card h3 { font-size: 1.25rem; }
}
```

## Usage Examples

### Basic Container Query
```tsx
import ContainerQueries from '@/components/ContainerQueries';

<ContainerQueries containerType="inline-size">
  <div className="container-card">
    <h3>Responsive Card</h3>
    <p>Adapts to container size</p>
  </div>
</ContainerQueries>
```

### Named Container for Targeted Queries
```tsx
<ContainerQueries 
  containerName="barber-grid" 
  containerType="inline-size"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
>
  {barbers.map(barber => (
    <div key={barber.id} className="barber-card container-card">
      {/* Card content */}
    </div>
  ))}
</ContainerQueries>
```

### Support Detection
```tsx
import { useContainerQuerySupport } from '@/components/ContainerQueries';

function MyComponent() {
  const isSupported = useContainerQuerySupport();
  
  return (
    <div>
      {isSupported ? 'Container queries supported' : 'Using fallback'}
    </div>
  );
}
```

## Browser Support and Fallbacks

### Supported Browsers
- Chrome 105+
- Firefox 110+
- Safari 16+
- Edge 105+

### Fallback Strategy
```css
/* Fallback for browsers without container query support */
@supports not (container-type: inline-size) {
  .container-queries-fallback {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
}
```

### Progressive Enhancement
- Container queries enhance experience when supported
- Traditional responsive grid serves as fallback
- No functionality loss in unsupported browsers

## Testing

### Unit Tests
- **Location**: `src/components/__tests__/ContainerQueries.test.tsx`
- **Coverage**: Component rendering, props handling, support detection
- **Features**: Mock CSS.supports for consistent testing

### Visual Testing
- **Location**: `src/components/ContainerQueries.stories.tsx`
- **Stories**: Multiple container types, responsive demos, component integration
- **Features**: Interactive demos for different container sizes

### Test Commands
```bash
# Run unit tests
npm test ContainerQueries

# Run visual tests
npm run storybook

# Run all tests with coverage
npm run test:coverage
```

## Performance Considerations

### Benefits
- **Reduced CSS Complexity**: Less nested media queries
- **Component Isolation**: Components respond to their context
- **Better Maintainability**: Responsive behavior contained within components

### Optimization Tips
- Use `inline-size` for width-based queries (better performance than `size`)
- Name containers only when needed for targeted queries
- Combine with traditional media queries for viewport-level concerns

## Migration Guide

### From Media Queries to Container Queries

**Before (Media Queries)**:
```css
.card {
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    padding: 1.5rem;
  }
}
```

**After (Container Queries)**:
```css
.container-card {
  padding: 1rem;
}

@container (min-width: 401px) {
  .container-card {
    padding: 1.5rem;
  }
}
```

### Component Migration Steps
1. Wrap responsive components with `ContainerQueries`
2. Replace media query classes with container query classes
3. Update CSS to use `@container` instead of `@media`
4. Add fallback classes for older browsers
5. Test across different container sizes

## Best Practices

### When to Use Container Queries
- **Component Libraries**: Cards, widgets, modules
- **Grid Layouts**: Dynamic grids that adapt to available space
- **Sidebar Content**: Components that appear in different width contexts
- **Modal/Dialog Content**: Content that adapts to modal size

### When to Stick with Media Queries
- **Layout Structure**: Header, footer, main layout
- **Navigation**: Global navigation patterns
- **Typography Scale**: Root-level typography systems
- **Viewport-dependent Features**: Full-screen sections

### Naming Conventions
- Use descriptive container names: `card-grid`, `sidebar-content`, `widget-container`
- Class names should indicate container query usage: `container-card`, `responsive-component`
- Keep container names short but meaningful

## Future Enhancements

### Planned Improvements
- [ ] Container units (`cqw`, `cqh`) implementation
- [ ] Style container queries for state-based styling
- [ ] Container query animation support
- [ ] Advanced container query debugging tools

### Monitoring
- Track browser adoption rates
- Monitor performance impact
- Collect user feedback on responsive behavior
- Regular testing across new browser versions

## Resources

### Documentation
- [MDN Container Queries Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [CSS-Tricks Container Queries](https://css-tricks.com/css-container-queries/)
- [Can I Use Container Queries](https://caniuse.com/css-container-queries)

### Tools
- [Chrome DevTools Container Query Inspector](https://developer.chrome.com/docs/devtools/css/container-queries/)
- [Firefox Container Query DevTools](https://developer.mozilla.org/en-US/docs/Tools/Container_queries)

---

**Last Updated**: 2026-03-02  
**Maintainer**: Development Team  
**Version**: 1.0.0
