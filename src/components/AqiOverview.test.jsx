import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AqiOverview from './AqiOverview';
import { getFallbackData } from '../services/airQualityService';

describe('AqiOverview Component', () => {
  const mockData = getFallbackData('Delhi NCR');

  it('renders loading indicator when loading is true', () => {
    render(
      <AqiOverview 
        data={mockData} 
        loading={true} 
        onJumpToPlanner={vi.fn()} 
        onJumpToIndoor={vi.fn()} 
      />
    );
    expect(screen.getByText(/Fetching real-time atmospheric & particulate data/i)).toBeInTheDocument();
  });

  it('renders city name and category label when loaded', () => {
    render(
      <AqiOverview 
        data={mockData} 
        loading={false} 
        onJumpToPlanner={vi.fn()} 
        onJumpToIndoor={vi.fn()} 
      />
    );
    expect(screen.getByText(/Delhi NCR/i)).toBeInTheDocument();
    expect(screen.getByText(mockData.category.label)).toBeInTheDocument();
  });

  it('displays WHO guideline exceedance ratio', () => {
    render(
      <AqiOverview 
        data={mockData} 
        loading={false} 
        onJumpToPlanner={vi.fn()} 
        onJumpToIndoor={vi.fn()} 
      />
    );
    expect(screen.getByText(/WHO Guideline/i)).toBeInTheDocument();
    expect(screen.getByText(/over limit/i)).toBeInTheDocument();
  });

  it('renders hourly timeline segments', () => {
    render(
      <AqiOverview 
        data={mockData} 
        loading={false} 
        onJumpToPlanner={vi.fn()} 
        onJumpToIndoor={vi.fn()} 
      />
    );
    expect(screen.getByText(/24-Hour Smog Forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/US EPA Air Quality Index/i)).toBeInTheDocument();
  });

  it('triggers onJumpToPlanner and onJumpToIndoor callbacks', () => {
    const handlePlanner = vi.fn();
    const handleIndoor = vi.fn();

    render(
      <AqiOverview 
        data={mockData} 
        loading={false} 
        onJumpToPlanner={handlePlanner} 
        onJumpToIndoor={handleIndoor} 
      />
    );

    const plannerBtn = screen.getByText(/Plan Family Schedule/i);
    fireEvent.click(plannerBtn);
    expect(handlePlanner).toHaveBeenCalledTimes(1);

    const indoorBtn = screen.getByText(/Indoor Purifier Hacks/i);
    fireEvent.click(indoorBtn);
    expect(handleIndoor).toHaveBeenCalledTimes(1);
  });
});
