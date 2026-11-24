import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';
import { POPULAR_CITIES } from '../data/cities';

describe('Navbar Component', () => {
  const defaultProps = {
    selectedCity: POPULAR_CITIES[0],
    onSelectCity: vi.fn(),
    onDetectLocation: vi.fn(),
    isDetecting: false,
    lastUpdated: '12:00 PM',
    onRefresh: vi.fn(),
    activeTab: 'airzero',
    setActiveTab: vi.fn(),
    onOpenReport: vi.fn(),
    showHero: false,
    setShowHero: vi.fn(),
  };

  it('renders brand name and active navigation items', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText('AIRZERO')).toBeInTheDocument();
    expect(screen.getByText('Glass Edition')).toBeInTheDocument();
    expect(screen.getByText('AIRZERO Exposure')).toBeInTheDocument();
    expect(screen.getByText('Smog Radar')).toBeInTheDocument();
  });

  it('handles tab switching', () => {
    render(<Navbar {...defaultProps} />);
    const radarTab = screen.getByText('Smog Radar');
    fireEvent.click(radarTab);
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('dashboard');
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<Navbar {...defaultProps} />);
    const refreshBtn = screen.getByLabelText(/Refresh live air quality telemetry/i);
    fireEvent.click(refreshBtn);
    expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onDetectLocation when GPS button is clicked', () => {
    render(<Navbar {...defaultProps} />);
    const gpsBtn = screen.getByLabelText(/Auto-detect current GPS location/i);
    fireEvent.click(gpsBtn);
    expect(defaultProps.onDetectLocation).toHaveBeenCalledTimes(1);
  });
});
