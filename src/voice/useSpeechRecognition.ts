import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface RecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type RecognitionConstructor = new () => Recognition;

type SpeechWindow = Window & {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
};

export function getRecognitionConstructor(scope: SpeechWindow = window): RecognitionConstructor | null {
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

export function describeSpeechError(code: string): string {
  if (code === 'not-allowed' || code === 'service-not-allowed') {
    return 'Microphone access is blocked. Allow it in your browser settings, or type the expense.';
  }
  if (code === 'no-speech') {
    return 'No speech was heard. Try again.';
  }
  return 'Voice input failed. You can type the expense instead.';
}

export function useSpeechRecognition({ lang, onResult }: { lang: string; onResult: (text: string) => void }) {
  const Constructor = useMemo(() => getRecognitionConstructor(), []);
  const recognitionRef = useRef<Recognition | null>(null);
  const onResultRef = useRef(onResult);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const start = useCallback(() => {
    if (!Constructor) {
      return;
    }
    setError(null);

    const recognition = new Constructor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript.trim() ?? '';
      if (transcript) {
        onResultRef.current(transcript);
      }
    };
    recognition.onerror = (event) => setError(describeSpeechError(event.error));
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [Constructor, lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { supported: Constructor !== null, listening, error, start, stop };
}
