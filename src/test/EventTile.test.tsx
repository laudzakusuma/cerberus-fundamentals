/**
 * EventTile Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventTile from '@/components/EventTile';

describe('EventTile', () => {
  const mockEvent = {
    id: '1',
    type: 'security_alert',
    level: 'critical',
    message: 'Test security alert',
    source: '192.168.1.100',
    createdAt: new Date().toISOString(),
  };

  it('renders event information correctly', () => {
    render(<EventTile event={mockEvent} />);
    
    expect(screen.getByText(/Test security alert/i)).toBeInTheDocument();
    expect(screen.getByText(/192.168.1.100/)).toBeInTheDocument();
  });

  it('displays the correct event type badge', () => {
    render(<EventTile event={mockEvent} />);
    
    expect(screen.getByText(/security alert/i)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<EventTile event={mockEvent} onClick={handleClick} />);
    
    const tile = screen.getByText(/Test security alert/i).closest('div');
    tile?.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('formats timestamp correctly', () => {
    render(<EventTile event={mockEvent} />);
    
    // Should show "Just now" for recent events
    expect(screen.getByText(/Just now|ago/i)).toBeInTheDocument();
  });
});
