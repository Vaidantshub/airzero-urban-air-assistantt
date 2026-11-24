import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DefensePlanModal from './DefensePlanModal';
import { getFallbackData } from '../services/airQualityService';

describe('DefensePlanModal Component', () => {
  const mockData = getFallbackData('Delhi NCR');

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DefensePlanModal isOpen={false} onClose={vi.fn()} data={mockData} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders battle plan details when isOpen is true', () => {
    render(
      <DefensePlanModal isOpen={true} onClose={vi.fn()} data={mockData} />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Family Winter Smog Battle Card')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockData.city, 'i'))).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <DefensePlanModal isOpen={true} onClose={handleClose} data={mockData} />
    );
    const closeBtn = screen.getByLabelText(/Close Battle Plan Modal/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('copies plan text when copy button is clicked', () => {
    render(
      <DefensePlanModal isOpen={true} onClose={vi.fn()} data={mockData} />
    );
    const copyBtn = screen.getByLabelText(/Copy battle plan text/i);
    fireEvent.click(copyBtn);
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });
});
