import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AirZeroFirstPrinciples from './AirZeroFirstPrinciples';

const mockAqiData = {
  aqi: 180,
  pm25: 100,
  pm10: 160,
  city: 'Delhi NCR',
  category: { label: 'Unhealthy' }
};

describe('AirZeroFirstPrinciples Component', () => {
  it('renders the first principles manifesto header and shield metric', () => {
    render(<AirZeroFirstPrinciples aqiData={mockAqiData} />);
    expect(screen.getByText(/Don’t Just Read AQI Numbers. Take Control of Your Lungs./i)).toBeInTheDocument();
    expect(screen.getByText(/Personal Exposure Shield/i)).toBeInTheDocument();
  });

  it('renders all four sub-systems navigation buttons', () => {
    render(<AirZeroFirstPrinciples aqiData={mockAqiData} />);
    expect(screen.getByText(/Exposure Detective/i)).toBeInTheDocument();
    expect(screen.getByText(/Activity Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Counterfactual AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Proof of Improvement/i)).toBeInTheDocument();
  });

  it('allows navigating to the Activity Timeline system', () => {
    render(<AirZeroFirstPrinciples aqiData={mockAqiData} />);
    const timelineBtn = screen.getByText(/Activity Timeline/i).closest('button');
    fireEvent.click(timelineBtn);

    expect(screen.getByText(/Personal Exposure Detective Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning Wakeup & Dressing/i)).toBeInTheDocument();
    expect(screen.getByText(/School Drop-off \/ Commute/i)).toBeInTheDocument();
  });

  it('allows navigating to Counterfactual AI system and toggles interventions', () => {
    render(<AirZeroFirstPrinciples aqiData={mockAqiData} />);
    const counterfactualBtn = screen.getByText(/Counterfactual AI/i).closest('button');
    fireEvent.click(counterfactualBtn);

    expect(screen.getByText(/Counterfactual Daily Exposure Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Do Nothing Baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Outcome/i)).toBeInTheDocument();
  });

  it('allows navigating to Proof of Improvement system', () => {
    render(<AirZeroFirstPrinciples aqiData={mockAqiData} />);
    const proofBtn = screen.getByText(/Proof of Improvement/i).closest('button');
    fireEvent.click(proofBtn);

    expect(screen.getByText(/Before vs After Measurement/i)).toBeInTheDocument();
    expect(screen.getByText(/WHO Safe Target Attained/i)).toBeInTheDocument();
  });
});
