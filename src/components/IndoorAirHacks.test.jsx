import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IndoorAirHacks from './IndoorAirHacks';

describe('IndoorAirHacks Component', () => {
  it('renders the CADR calculator and headline', () => {
    render(<IndoorAirHacks />);
    expect(screen.getByText(/Indoor Air Hacks & DIY Purifier Sizing Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Room CADR & Purifier Calculator/i)).toBeInTheDocument();
  });

  it('calculates room volume and required CADR correctly for default dimensions', () => {
    render(<IndoorAirHacks />);
    // Default: 16 ft length, 14 ft width, 9 ft height
    // Volume = 16 * 14 * 9 = 2016 cu ft
    expect(screen.getByText(/2,016 cu ft/i)).toBeInTheDocument();

    // Required CADR for 5 ACH = (2016 * 5) / 60 = 168 CFM
    expect(screen.getByText(/168 CFM/i)).toBeInTheDocument();
  });

  it('displays the $480 CFM Corsi-Rosenthal Box delivery metric', () => {
    render(<IndoorAirHacks />);
    expect(screen.getByText(/480 CFM/i)).toBeInTheDocument();
    expect(screen.getByText(/Exceeds requirement!/i)).toBeInTheDocument();
  });

  it('updates dimensions and calculations when sliders change', () => {
    render(<IndoorAirHacks />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(3);

    // Change room length slider to 20
    fireEvent.change(sliders[0], { target: { value: '20' } });
    // Volume = 20 * 14 * 9 = 2520 cu ft
    expect(screen.getByText(/2,520 cu ft/i)).toBeInTheDocument();
  });

  it('displays all 4 essential zero-cost indoor hacks', () => {
    render(<IndoorAirHacks />);
    expect(screen.getByText(/Hack #1: Kitchen Cooking Exhaust/i)).toBeInTheDocument();
    expect(screen.getByText(/Hack #2: Floor Dust Resuspension/i)).toBeInTheDocument();
    expect(screen.getByText(/Hack #3: Particulate Settling Physics/i)).toBeInTheDocument();
    expect(screen.getByText(/Hack #4: Nighttime Bedroom Oxygenation/i)).toBeInTheDocument();
  });
});
