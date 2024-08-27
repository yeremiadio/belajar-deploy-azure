import { describe, expect, it } from "vitest";
import convertNumberToStringRupiah from '@/utils/functions/convertNumberToStringRupiah';

describe('convertNumberToStringRupiah', () => {
  const sanitizeString = (str: string) => str.replace(/\u00A0/g, ' ');

  it('converts a number to Indonesian Rupiah format', () => {
    expect(sanitizeString(convertNumberToStringRupiah(1000))).toBe('Rp 1.000');
    expect(sanitizeString(convertNumberToStringRupiah(10000))).toBe('Rp 10.000');
    expect(sanitizeString(convertNumberToStringRupiah(100000))).toBe('Rp 100.000');
    expect(sanitizeString(convertNumberToStringRupiah(1000000))).toBe('Rp 1.000.000');
    expect(sanitizeString(convertNumberToStringRupiah(10000000))).toBe('Rp 10.000.000');
    expect(sanitizeString(convertNumberToStringRupiah(123456789))).toBe('Rp 123.456.789');
  });

  it('handles zero and negative numbers correctly', () => {
    expect(sanitizeString(convertNumberToStringRupiah(0))).toBe('Rp 0');
    expect(sanitizeString(convertNumberToStringRupiah(-1000))).toBe('-Rp 1.000');
  });

  it('handles fractions correctly', () => {
    expect(sanitizeString(convertNumberToStringRupiah(1234.56))).toBe('Rp 1.235');
    expect(sanitizeString(convertNumberToStringRupiah(1234.567))).toBe('Rp 1.235');
  });
});