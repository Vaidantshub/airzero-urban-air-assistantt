import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FamilyRoutinePlanner from './FamilyRoutinePlanner';

const mockAqiData = {
  aqi: 195,
  city: 'Lahore',
  pm25: 120
};

describe('FamilyRoutinePlanner Component', () => {
  it('renders the routine planner title and active defenses badge', () => {
    render(<FamilyRoutinePlanner aqiData={mockAqiData} />);
    expect(screen.getByText(/Personalized Low-Emission Winter Routines/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Defenses/i)).toBeInTheDocument();
  });

  it('renders all household profile selection cards', () => {
    render(<FamilyRoutinePlanner aqiData={mockAqiData} />);
    expect(screen.getAllByText(/Infant \/ Toddler/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Senior \/ Asthmatic/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/School Child/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Daily Commuter/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Household Pets/i)[0]).toBeInTheDocument();
  });

  it('allows toggling transit mode and updates emission impact', () => {
    render(<FamilyRoutinePlanner aqiData={mockAqiData} />);
    const metroBtn = screen.getByText(/Electric Metro \/ Bus/i).closest('button');
    fireEvent.click(metroBtn);

    expect(screen.getByText(/6.8 kg CO₂/i)).toBeInTheDocument();
    expect(screen.getByText(/90% emission reduction \+ zero road exhaust/i)).toBeInTheDocument();
  });

  it('renders the interactive 5-point family smog checklist', () => {
    render(<FamilyRoutinePlanner aqiData={mockAqiData} />);
    expect(screen.getByText(/Today's Family Smog Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/Door & Window Weatherstripping/i)).toBeInTheDocument();
    expect(screen.getByText(/N95 \/ FFP2 Masks in Backpacks/i)).toBeInTheDocument();
  });
});
