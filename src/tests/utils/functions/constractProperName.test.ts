import { constructProperName } from '@/utils/functions/constractProperName';

describe('constructProperName', () => {
  it('should return the full name when both firstname and lastname are provided', () => {
    const result = constructProperName('Budi', 'Raharjo');
    expect(result).toBe('Budi Raharjo');
  });

  it('should return only the firstname if lastname is not provided', () => {
    const result = constructProperName('Budi');
    expect(result).toBe('Budi');
  });

  it('should return only the lastname if firstname is not provided', () => {
    const result = constructProperName(undefined, 'Raharjo');
    expect(result).toBe('Raharjo');
  });

  it('should return a hyphen ("-") if both firstname and lastname are not provided', () => {
    const result = constructProperName();
    expect(result).toBe('-');
  });

  it('should return a hyphen ("-") if both firstname and lastname are empty strings', () => {
    const result = constructProperName('', '');
    expect(result).toBe('-');
  });

  it('should trim any extra spaces around the firstname and lastname', () => {
    const result = constructProperName('  Budi  ', '  Raharjo  ');
    expect(result).toBe('Budi Raharjo');
  });

  it('should return the firstname if lastname is an empty string', () => {
    const result = constructProperName('Budi', '');
    expect(result).toBe('Budi');
  });

  it('should return the lastname if firstname is an empty string', () => {
    const result = constructProperName('', 'Raharjo');
    expect(result).toBe('Raharjo');
  });
});
