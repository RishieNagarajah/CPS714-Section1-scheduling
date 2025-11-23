import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MyClasses from '@/components/MyClasses';
import { ClassData } from '@/helpers';

// Mock dependencies
jest.mock('@/helpers');

const mockClasses: ClassData[] = [
  {
    id: 'class-1',
    title: 'Morning Yoga',
    description: 'Energizing yoga session',
    instructor: 'Sarah Johnson',
    startTimestamp: '2023-12-25T10:00:00.000Z',
    endTimestamp: '2023-12-25T11:30:00.000Z',
    currentSignups: 5,
    totalSeats: 20,
  },
  {
    id: 'class-2',
    title: 'Evening Pilates',
    description: 'Strengthening pilates class',
    instructor: 'Mike Wilson',
    startTimestamp: '2023-12-25T18:00:00.000Z',
    endTimestamp: '2023-12-25T19:00:00.000Z',
    currentSignups: 12,
    totalSeats: 15,
  },
];

const mockAction = jest.fn();

describe('MyClasses Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component title', () => {
    render(<MyClasses classes={[]} action={mockAction} />);
    
    expect(screen.getByText('My Classes')).toBeInTheDocument();
  });

  it('renders class cards when classes are provided', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.getByText('Evening Pilates')).toBeInTheDocument();
    expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Mike Wilson/)).toBeInTheDocument();
  });

  it('displays class information correctly', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    // Check first class details
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Signups: 5\/20/)).toBeInTheDocument();
    
    // Check second class details
    expect(screen.getByText('Evening Pilates')).toBeInTheDocument();
    expect(screen.getByText(/Mike Wilson/)).toBeInTheDocument();
    expect(screen.getByText(/Signups: 12\/15/)).toBeInTheDocument();
  });

  it('has "Cancel" button for each class', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    expect(cancelButtons).toHaveLength(mockClasses.length);
  });

  it('calls action function when Cancel button is clicked', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButtons[0]);
    
    expect(mockAction).toHaveBeenCalledWith('class-1');
  });

  it('calls action function with correct class ID for each class', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    
    fireEvent.click(cancelButtons[0]);
    expect(mockAction).toHaveBeenCalledWith('class-1');
    
    fireEvent.click(cancelButtons[1]);
    expect(mockAction).toHaveBeenCalledWith('class-2');
  });

  it('handles single class correctly', () => {
    const singleClass = [mockClasses[0]];
    render(<MyClasses classes={singleClass} action={mockAction} />);
    
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.queryByText('Evening Pilates')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /cancel/i })).toHaveLength(1);
  });

  it('displays instructor information correctly', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    expect(screen.getByText(/Instructor: Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Instructor: Mike Wilson/)).toBeInTheDocument();
  });

  it('displays signup information with current and total seats', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    const signupInfo = screen.getAllByText(/Signups: \d+\/\d+/);
    expect(signupInfo[0]).toHaveTextContent('Signups: 5/20');
    expect(signupInfo[1]).toHaveTextContent('Signups: 12/15');
  });

  it('does not display "no classes" message when classes are provided', () => {
    render(<MyClasses classes={mockClasses} action={mockAction} />);
    
    expect(screen.queryByText(/no classes|empty/i)).not.toBeInTheDocument();
  });

  it('renders empty message when no classes are enrolled', () => {
    render(<MyClasses classes={[]} action={mockAction} />);
    
    expect(screen.getByText('You have no classes scheduled.')).toBeInTheDocument();
  });
});