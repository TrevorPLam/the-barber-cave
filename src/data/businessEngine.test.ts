/**
 * @fileoverview Test suite for BusinessEngine metrics and SSOT patterns
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Comprehensive test suite for the business metrics engine following TDD principles.
 * Tests all core functionality, edge cases, and integration patterns.
 * Ensures single source of truth implementation works correctly.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BusinessEngine, BusinessMetrics, ServiceCategory } from './businessEngine';
import { barbers } from './barbers';
import { services } from './services';

describe('BusinessEngine', () => {
  let testBarbers: typeof barbers;
  let testServices: typeof services;

  beforeEach(() => {
    testBarbers = [...barbers];
    testServices = [...services];
  });

  describe('getMetrics', () => {
    it('should compute total barbers correctly', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      expect(metrics.totalBarbers).toBe(testBarbers.length);
      expect(metrics.totalBarbers).toBe(8);
    });

    it('should compute total services correctly', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      expect(metrics.totalServices).toBe(testServices.length);
      expect(metrics.totalServices).toBe(28);
    });

    it('should compute average rating correctly', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      // Expected: (4.8 + 5.0 + 5.0 + 5.0 + 5.0 + 5.0 + 5.0 + 5.0) / 7 = 4.97
      expect(metrics.averageRating).toBeCloseTo(4.97, 1);
    });

    it('should exclude "No ratings" from average calculation', () => {
      const barbersWithNoRating = [
        ...testBarbers,
        { id: 'test-barber', name: 'Test', title: 'Test', rating: 'No ratings', reviews: '0', available: 'Today', image: '/test.jpg' }
      ];
      
      const metrics = BusinessEngine.getMetrics(barbersWithNoRating, testServices);
      
      // Should still be 4.97, not affected by "No ratings"
      expect(metrics.averageRating).toBeCloseTo(4.97, 1);
    });

    it('should count available today barbers correctly', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      // From data: "Today" availability for Tru B. and Rob Pro_edge_cutz
      expect(metrics.availableToday).toBe(2);
    });

    it('should group services by category correctly', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      const categories = metrics.servicesByCategory;
      
      expect(categories).toHaveLength(7); // Expected categories based on service titles
      
      // Check specific categories exist
      const categoryNames = categories.map((c: ServiceCategory) => c.category);
      expect(categoryNames).toContain('Premium Packages');
      expect(categoryNames).toContain('Haircuts');
      expect(categoryNames).toContain('Bald & Bearded');
      expect(categoryNames).toContain('Loc Services');
      expect(categoryNames).toContain('Beard Grooming');
      expect(categoryNames).toContain('Specialty Hours');
    });

    it('should provide opening hours in display format', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      expect(metrics.openingHoursDisplay).toHaveLength(3);
      expect(metrics.openingHoursDisplay[0]).toEqual({
        days: 'Monday',
        hours: '9am–7pm'
      });
      expect(metrics.openingHoursDisplay[1]).toEqual({
        days: 'Saturday',
        hours: '9am–6pm'
      });
      expect(metrics.openingHoursDisplay[2]).toEqual({
        days: 'Sunday',
        hours: '10am–6pm'
      });
    });

    it('should provide opening hours in Schema.org format', () => {
      const metrics = BusinessEngine.getMetrics(testBarbers, testServices);
      
      expect(metrics.structuredDataHours).toHaveLength(3);
      expect(metrics.structuredDataHours[0]).toEqual({
        days: 'Mo-Fr',
        open: '09:00',
        close: '19:00'
      });
      expect(metrics.structuredDataHours[1]).toEqual({
        days: 'Sa',
        open: '08:00',
        close: '20:00'
      });
      expect(metrics.structuredDataHours[2]).toEqual({
        days: 'Su',
        open: '10:00',
        close: '18:00'
      });
    });
  });

  describe('calculateAverageRating', () => {
    it('should handle empty array', () => {
      const average = BusinessEngine.calculateAverageRating([]);
      
      expect(average).toBe(0);
    });

    it('should handle all "No ratings"', () => {
      const barbersWithNoRatings = testBarbers.map(barber => ({
        ...barber,
        rating: 'No ratings'
      }));
      
      const average = BusinessEngine.calculateAverageRating(barbersWithNoRatings);
      
      expect(average).toBe(0);
    });

    it('should calculate correct average', () => {
      const testBarbers = [
        { id: '1', name: 'Test 1', title: 'Barber', rating: '4.0', reviews: '10', available: 'Today', image: '/test.jpg' },
        { id: '2', name: 'Test 2', title: 'Barber', rating: '5.0', reviews: '5', available: 'Today', image: '/test.jpg' },
        { id: '3', name: 'Test 3', title: 'Barber', rating: '3.0', reviews: '2', available: 'Today', image: '/test.jpg' }
      ];
      
      const average = BusinessEngine.calculateAverageRating(testBarbers);
      
      expect(average).toBeCloseTo(4.0, 1);
    });
  });

  describe('getAvailableToday', () => {
    it('should count "Today" availability correctly', () => {
      const testBarbers = [
        { id: '1', name: 'Test 1', title: 'Barber', rating: '4.0', reviews: '10', available: 'Today', image: '/test.jpg' },
        { id: '2', name: 'Test 2', title: 'Barber', rating: '5.0', reviews: '5', available: 'Tomorrow', image: '/test.jpg' },
        { id: '3', name: 'Test 3', title: 'Barber', rating: '3.0', reviews: '2', available: 'Available Friday', image: '/test.jpg' }
      ];
      
      const available = BusinessEngine.getAvailableToday(testBarbers);
      
      expect(available).toBe(1);
    });

    it('should handle empty array', () => {
      const available = BusinessEngine.getAvailableToday([]);
      
      expect(available).toBe(0);
    });
  });

  describe('groupServicesByCategory', () => {
    it('should categorize services correctly', () => {
      const categories = BusinessEngine.groupServicesByCategory(testServices);
      
      const premiumPackages = categories.find(c => c.category === 'Premium Packages');
      const haircuts = categories.find(c => c.category === 'Haircuts');
      const locServices = categories.find(c => c.category === 'Loc Services');
      
      expect(premiumPackages).toBeDefined();
      expect(haircuts).toBeDefined();
      expect(locServices).toBeDefined();
      
      expect(premiumPackages!.count).toBe(3); // Ultimate, Presidential, Trill Sophisticated packages
      expect(haircuts!.count).toBe(3); // Men's Haircut variants
      expect(locServices!.count).toBe(7); // All loc-related services
    });

    it('should handle empty array', () => {
      const categories = BusinessEngine.groupServicesByCategory([]);
      
      expect(categories).toHaveLength(0);
    });
  });

  describe('validateBusinessData', () => {
    it('should pass validation for clean data', () => {
      const validation = BusinessEngine.validateBusinessData(testBarbers, testServices);
      
      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it('should detect duplicate barber IDs', () => {
      const duplicateBarbers = [
        ...testBarbers,
        { id: 'trill-l', name: 'Duplicate', title: 'Barber', rating: '5.0', reviews: '1', available: 'Today', image: '/test.jpg' }
      ];
      
      const validation = BusinessEngine.validateBusinessData(duplicateBarbers, testServices);
      
      expect(validation.isValid).toBe(false);
      expect(validation.issues).toContain('Duplicate barber IDs: trill-l');
    });

    it('should detect duplicate service IDs', () => {
      const duplicateServices = [
        ...testServices,
        { id: 'mens-haircut', title: 'Duplicate', description: 'Test', price: '$50', duration: '1 hour', icon: 'Scissors' }
      ];
      
      const validation = BusinessEngine.validateBusinessData(testBarbers, duplicateServices);
      
      expect(validation.isValid).toBe(false);
      expect(validation.issues).toContain('Duplicate service IDs: mens-haircut');
    });

    it('should detect invalid ratings', () => {
      const invalidBarbers = [
        ...testBarbers,
        { id: 'invalid-1', name: 'Invalid 1', title: 'Barber', rating: '6.0', reviews: '1', available: 'Today', image: '/test.jpg' }, // Too high
        { id: 'invalid-2', name: 'Invalid 2', title: 'Barber', rating: '-1.0', reviews: '1', available: 'Today', image: '/test.jpg' }, // Negative
        { id: 'invalid-3', name: 'Invalid 3', title: 'Barber', rating: 'invalid' as any, reviews: '1', available: 'Today', image: '/test.jpg' } // Not a number
      ];
      
      const validation = BusinessEngine.validateBusinessData(invalidBarbers, testServices);
      
      expect(validation.isValid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Error handling', () => {
    it('should throw error for null barbers', () => {
      expect(() => {
        BusinessEngine.getMetrics(null as any[], testServices);
      }).toThrow('Barbers data must be an array');
    });

    it('should throw error for undefined services', () => {
      expect(() => {
        BusinessEngine.getMetrics(testBarbers, undefined as any[]);
      }).toThrow('Services data must be an array');
    });

    it('should throw error for non-array barbers', () => {
      expect(() => {
        BusinessEngine.getMetrics({} as any, testServices);
      }).toThrow('Barbers data must be an array');
    });

    it('should throw error for non-array services', () => {
      expect(() => {
        BusinessEngine.getMetrics(testBarbers, 'not-array' as any);
      }).toThrow('Services data must be an array');
    });
  });

  describe('Integration with constants', () => {
    it('should work with BUSINESS_METRICS constant', () => {
      // This test ensures the BUSINESS_METRICS constant in constants.ts works correctly
      expect(() => {
        const { BUSINESS_METRICS } = require('../constants');
        expect(BUSINESS_METRICS.totalBarbers).toBe(8);
        expect(BUSINESS_METRICS.totalServices).toBe(28);
        expect(BUSINESS_METRICS.averageRating).toBeGreaterThan(0);
        expect(BUSINESS_METRICS.servicesByCategory).toBeDefined();
        expect(BUSINESS_METRICS.openingHoursDisplay).toBeDefined();
        expect(BUSINESS_METRICS.structuredDataHours).toBeDefined();
      }).not.toThrow();
    });
  });
});
