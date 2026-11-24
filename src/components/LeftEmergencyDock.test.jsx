import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LeftEmergencyDock from './LeftEmergencyDock';
import { getFallbackData } from '../services/airQualityService';

describe('LeftEmergencyDock Component', () => {
  const mockData = getFallbackData('Delhi NCR');
  const defaultProps = {
    selectedCity: { name: 'Delhi NCR', country: 'India', lat: 28.6139, lon: 77.2090, tag: 'Capital Smog Zone' },
    onDetectLocation: vi.fn(),
    isDetecting: false,
    aqiData: mockData,
  };

  it('renders quick action buttons', () => {
    render(<LeftEmergencyDock {...defaultProps} />);
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('SOS 112')).toBeInTheDocument();
    expect(screen.getByText('GPS Loc')).toBeInTheDocument();
  });

  it('opens AI Chat panel when AI Chat button is clicked', () => {
    render(<LeftEmergencyDock {...defaultProps} />);
    const chatBtn = screen.getByTitle('Open AI Smog Assistant');
    fireEvent.click(chatBtn);

    expect(screen.getByText(/Urban Smog & Health Advisor/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about asthma, ventilation timing/i)).toBeInTheDocument();
  });

  it('opens Emergency Helplines when SOS button is clicked', () => {
    render(<LeftEmergencyDock {...defaultProps} />);
    const sosBtn = screen.getByTitle('Emergency Helpline & Triage');
    fireEvent.click(sosBtn);

    expect(screen.getByText(/Emergency Helplines & Rapid Triage/i)).toBeInTheDocument();
    expect(screen.getByText(/Universal Emergency Dispatch/i)).toBeInTheDocument();
  });

  it('opens Location tab when GPS Loc button is clicked', () => {
    render(<LeftEmergencyDock {...defaultProps} />);
    const locBtn = screen.getByTitle('Verify GPS Location & Threat');
    fireEvent.click(locBtn);

    expect(screen.getByText(/Active Metro Station/i)).toBeInTheDocument();
    const scanBtn = screen.getByRole('button', { name: /Verify My Exact GPS Location/i });
    fireEvent.click(scanBtn);
    expect(defaultProps.onDetectLocation).toHaveBeenCalled();
  });
});
