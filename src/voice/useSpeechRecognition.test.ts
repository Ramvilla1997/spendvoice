import { describe, expect, it } from 'vitest';
import { describeSpeechError, getRecognitionConstructor } from './useSpeechRecognition.js';

describe('getRecognitionConstructor', () => {
  it('returns null where speech recognition is unavailable', () => {
    expect(getRecognitionConstructor({} as Window & typeof globalThis)).toBeNull();
  });

  it('falls back to the prefixed constructor used by Chromium and Safari', () => {
    const webkit = class {} as unknown as new () => never;
    expect(getRecognitionConstructor({ webkitSpeechRecognition: webkit } as unknown as Window & typeof globalThis)).toBe(webkit);
  });
});

describe('describeSpeechError', () => {
  it('explains a blocked microphone in plain words', () => {
    expect(describeSpeechError('not-allowed')).toMatch(/Microphone access is blocked/);
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(describeSpeechError('network')).toMatch(/You can type the expense instead/);
  });
});
