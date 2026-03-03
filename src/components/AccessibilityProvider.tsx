'use client';

import React, { useEffect } from 'react';

export default function AccessibilityProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      import('@axe-core/react')
        .then(axe => {
          import('react-dom')
            .then(ReactDOM => {
              axe.default(React, ReactDOM, 1000);
            })
            .catch(err => {
              console.warn('Failed to load react-dom for accessibility testing:', err);
            });
        })
        .catch(err => {
          console.warn('Failed to load @axe-core/react for accessibility testing:', err);
        });
    }
  }, []);

  return null;
}
