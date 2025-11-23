import { toTitleCase, formatSchedule } from '@/helpers';

describe('Helper Functions', () => {
  describe('toTitleCase', () => {
    it('should convert string to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('test STRING')).toBe('Test String');
      expect(toTitleCase('multiple   spaces')).toBe('Multiple   Spaces');
    });

    it('should handle edge cases', () => {
      expect(toTitleCase('')).toBe('');
      expect(toTitleCase('a')).toBe('A');
      expect(toTitleCase('ABC')).toBe('Abc');
    });

    it('should handle special characters', () => {
      expect(toTitleCase('hello-world')).toBe('Hello-world');
      expect(toTitleCase("it's a test")).toBe("It's A Test");});
  });

  describe('formatSchedule', () => {
    it('should format schedule with proper dates', () => {
      const start = '2023-12-25T10:00:00.000';
      const end = '2023-12-25T11:30:00.000';
      const result = formatSchedule(start, end);
      
      expect(result).toMatch(/Mon, Dec 25/);
      expect(result).toMatch(/10:00 AM/);
      expect(result).toMatch(/11:30 AM/);
      expect(result).toContain(' - ');
    });

    it('should handle different time formats', () => {
      const start = '2023-12-25T23:45:00.000';
      const end = '2023-12-26T01:15:00.000';
      const result = formatSchedule(start, end);
      
      expect(result).toMatch(/11:45 PM/);
      expect(result).toMatch(/1:15 AM/);
    });

    it('should handle different locales', () => {
      const start = '2023-12-25T10:00:00.000';
      const end = '2023-12-25T11:00:00.000';
      const result = formatSchedule(start, end);
      
      // Should include month abbreviation and day
      expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}/);
    });
  });
});