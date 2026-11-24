import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptWarAssistant from './PromptWarAssistant';

describe('PromptWarAssistant Component', () => {
  it('renders prompt war studio and blueprints', () => {
    render(<PromptWarAssistant currentAqi={210} cityName="Delhi NCR" />);
    expect(screen.getByText(/AI Smog Assistant & Prompt Engineering Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Curated Battle-Tested Prompt Blueprints/i)).toBeInTheDocument();
  });

  it('renders all curated preset prompt cards', () => {
    render(<PromptWarAssistant currentAqi={210} cityName="Delhi NCR" />);
    expect(screen.getAllByText(/Pediatric Asthma/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Zero-Budget Apartment/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/School Community Low-Emission/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Winter Inversion Physics/i)[0]).toBeInTheDocument();
  });

  it('compiles a dynamic prompt when clicking the compile button', () => {
    render(<PromptWarAssistant currentAqi={210} cityName="Delhi NCR" />);
    const compileBtn = screen.getByText(/Compile Custom Hackathon Prompt/i);
    fireEvent.click(compileBtn);

    expect(screen.getByText(/Copy Compiled Prompt/i)).toBeInTheDocument();
  });
});
