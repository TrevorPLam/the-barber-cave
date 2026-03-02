// SEO Validation Utility
// This script helps validate SEO implementation

export interface SEOValidationResult {
  passed: boolean;
  issues: string[];
  recommendations: string[];
}

export function validateStructuredData(): SEOValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for required structured data types
  const requiredSchemas = ['Organization', 'LocalBusiness', 'Service', 'BreadcrumbList'];
  
  // These would be checked in the actual DOM
  const foundSchemas: string[] = [];

  // Simulate validation (in real implementation, would parse DOM)
  try {
    // Check Organization schema
    if (document.querySelector('script[type="application/ld+json"]')) {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          if (data['@type']) {
            foundSchemas.push(data['@type']);
          }
        } catch (e) {
          issues.push('Invalid JSON-LD syntax found');
        }
      });
    }
  } catch (e) {
    issues.push('Error parsing structured data');
  }

  // Validate required schemas
  requiredSchemas.forEach(schema => {
    if (!foundSchemas.includes(schema)) {
      issues.push(`Missing ${schema} structured data`);
    }
  });

  // Recommendations
  if (foundSchemas.length > 0) {
    recommendations.push('Structured data found - validate with Google Rich Results Test');
  }

  return {
    passed: issues.length === 0,
    issues,
    recommendations
  };
}

export function validateMetaTags(): SEOValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for essential meta tags
  const essentialTags = [
    'title',
    'description',
    'og:title',
    'og:description',
    'og:type',
    'twitter:card',
    'twitter:title'
  ];

  essentialTags.forEach((tag: string) => {
    const element = document.querySelector(`meta[property="${tag}"], meta[name="${tag}"], title`);
    if (!element || !element.getAttribute('content')?.trim()) {
      issues.push(`Missing or empty ${tag} meta tag`);
    }
  });

  // Check for canonical URL
  if (!document.querySelector('link[rel="canonical"]')) {
    issues.push('Missing canonical URL');
  }

  // Recommendations
  recommendations.push('Ensure all pages have unique titles and descriptions');
  recommendations.push('Add Open Graph images for better social sharing');

  return {
    passed: issues.length === 0,
    issues,
    recommendations
  };
}

export function validateBreadcrumbs(): SEOValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for breadcrumb navigation
  const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');
  if (!breadcrumbNav) {
    issues.push('Missing breadcrumb navigation');
  }

  // Check for breadcrumb structured data
  const breadcrumbSchema = document.querySelector('script[type="application/ld+json"]');
  if (breadcrumbSchema) {
    try {
      const data = JSON.parse(breadcrumbSchema.textContent || '{}');
      if (data['@type'] === 'BreadcrumbList') {
        recommendations.push('Breadcrumb structured data found');
      }
    } catch (e) {
      issues.push('Invalid breadcrumb structured data');
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    recommendations
  };
}

// Export validation functions for testing
export const seoValidators = {
  structuredData: validateStructuredData,
  metaTags: validateMetaTags,
  breadcrumbs: validateBreadcrumbs
};

// Comprehensive SEO validation
export function validateSEO(): {
  overall: boolean;
  results: Record<string, SEOValidationResult>;
} {
  const results: Record<string, SEOValidationResult> = {};
  
  Object.entries(seoValidators).forEach(([key, validator]) => {
    results[key] = validator();
  });

  const overall = Object.values(results).every(result => result.passed);

  return { overall, results };
}
