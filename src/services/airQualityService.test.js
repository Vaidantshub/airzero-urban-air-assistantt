import { describe, it, expect } from 'vitest';
import { getFallbackData } from './airQualityService';

describe('airQualityService', () => {
  it('returns valid fallback data for Delhi NCR', () => {
    const data = getFallbackData('Delhi NCR');
    expect(data).toBeDefined();
    expect(data.city).toBe('Delhi NCR');
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.pm25).toBeGreaterThan(0);
    expect(data.pm10).toBeGreaterThan(0);
    expect(data.category).toBeDefined();
    expect(data.category.label).toBeDefined();
    expect(data.whoExceedance).toBeGreaterThan(0);
    expect(data.timeline).toBeInstanceOf(Array);
    expect(data.timeline.length).toBeGreaterThan(0);
  });

  it('correctly calculates WHO exceedance multiplier', () => {
    const data = getFallbackData('Beijing');
    // WHO PM2.5 annual safe limit is 5 µg/m³
    expect(data.whoExceedance).toBeGreaterThan(0);
    expect(Number(data.whoExceedance)).toBeCloseTo(data.pm25 / 5, 0);
  });

  it('assigns appropriate category based on PM2.5 / AQI thresholds', () => {
    const severeData = getFallbackData('Delhi NCR');
    expect(['Unhealthy', 'Very Unhealthy', 'Hazardous / Emergency']).toContain(severeData.category.label);
  });

  it('contains valid hourly timeline with 24 data points', () => {
    const data = getFallbackData('London');
    expect(data.timeline.length).toBe(24);
    data.timeline.forEach((item) => {
      expect(item.time).toMatch(/\d{2}:00/);
      expect(item.aqi).toBeGreaterThanOrEqual(0);
      expect(item.category).toBeDefined();
    });
  });

  it('includes peak danger and safe ventilation slots', () => {
    const data = getFallbackData('Lahore');
    expect(data.bestWindow).toBeDefined();
    expect(data.peakDanger).toBeDefined();
  });
});
