import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AvailableSchedule from '@/components/AvailableSchedule';
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

describe('AvailableSchedule Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component title', () => {
    render(<AvailableSchedule classes={[]} action={mockAction} />);
    
    expect(screen.getByText('List of Available Classes')).toBeInTheDocument();
  });

  it('displays "no available classes" message when classes array is empty', () => {
    render(<AvailableSchedule classes={[]} action={mockAction} />);
    
    expect(screen.getByText('No available classes at the moment.')).toBeInTheDocument();
  });

  it('renders class cards when classes are provided', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.getByText('Evening Pilates')).toBeInTheDocument();
    expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Mike Wilson/)).toBeInTheDocument();
  });

  it('displays class information correctly', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    // Check first class details
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Signups: 5\/20/)).toBeInTheDocument();
    
    // Check second class details
    expect(screen.getByText('Evening Pilates')).toBeInTheDocument();
    expect(screen.getByText(/Mike Wilson/)).toBeInTheDocument();
    expect(screen.getByText(/Signups: 12\/15/)).toBeInTheDocument();
  });

  it('has "Join Class" button for each class', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    const joinButtons = screen.getAllByRole('button', { name: /join class/i });
    expect(joinButtons).toHaveLength(mockClasses.length);
  });

  it('calls action function when Join Class button is clicked', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    const joinButtons = screen.getAllByRole('button', { name: /join class/i });
    fireEvent.click(joinButtons[0]);
    
    expect(mockAction).toHaveBeenCalledWith('class-1');
  });

  it('calls action function with correct class ID for each class', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    const joinButtons = screen.getAllByRole('button', { name: /join class/i });
    
    fireEvent.click(joinButtons[0]);
    expect(mockAction).toHaveBeenCalledWith('class-1');
    
    fireEvent.click(joinButtons[1]);
    expect(mockAction).toHaveBeenCalledWith('class-2');
  });

  it('displays instructor information correctly', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    expect(screen.getByText(/Instructor: Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Instructor: Mike Wilson/)).toBeInTheDocument();
  });

  it('displays signup information with current and total seats', () => {
    render(<AvailableSchedule classes={mockClasses} action={mockAction} />);
    
    const signupInfo = screen.getAllByText(/Signups: \d+\/\d+/);
    expect(signupInfo[0]).toHaveTextContent('Signups: 5/20');
    expect(signupInfo[1]).toHaveTextContent('Signups: 12/15');
  });
});