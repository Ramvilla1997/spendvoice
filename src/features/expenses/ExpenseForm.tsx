import { useState, type FormEvent } from 'react';
import type { NewExpense } from '../../domain/expense.js';
import { parseExpense } from '../../parsing/parseExpense.js';
import { useSpeechRecognition } from '../../voice/useSpeechRecognition.js';
import { CATEGORY_LABELS } from './categories.js';
import { formatMoney } from './format.js';
import { MicIcon } from './icons.js';

const EXAMPLES = ['coffee 4.50', 'taxi twelve dollars', 'groceries 32 yesterday'];

interface ExpenseFormProps {
  today: string;
  defaultCurrency: string;
  onSave: (expense: NewExpense) => Promise<unknown>;
}

export function ExpenseForm({ today, defaultCurrency, onSave }: ExpenseFormProps) {
  const [text, setText] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const speech = useSpeechRecognition({ lang: 'en-US', onResult: setText });

  const parsed = parseExpense(text, { today, defaultCurrency });
  const isEmpty = text.trim() === '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!parsed.ok) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(parsed.expense);
      setText('');
    } catch {
      setSaveError('The expense could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const preview = parsed.ok
    ? `${formatMoney(parsed.expense.amountCents, parsed.expense.currency)} · ${CATEGORY_LABELS[parsed.expense.category]} · ${parsed.expense.occurredOn}`
    : isEmpty ? 'Say or type what you spent.' : parsed.reason;

  return (
    <form className="card capture" onSubmit={handleSubmit}>
      {speech.supported ? (
        <button
          type="button"
          className={`mic${speech.listening ? ' mic--listening' : ''}`}
          aria-pressed={speech.listening}
          aria-label={speech.listening ? 'Stop listening' : 'Speak an expense'}
          onClick={speech.listening ? speech.stop : speech.start}
        >
          <MicIcon />
        </button>
      ) : null}

      <label htmlFor="expense-text" className="capture__label">
        Describe the expense
      </label>
      <input
        id="expense-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder='"taxi twelve dollars"'
        autoComplete="off"
      />

      <p className={`preview${parsed.ok ? ' preview--ok' : ''}`} aria-live="polite">{preview}</p>

      {isEmpty ? (
        <div className="examples" aria-label="Examples">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" className="chip" onClick={() => setText(example)}>
              {example}
            </button>
          ))}
        </div>
      ) : null}

      {speech.error ? <p role="alert" className="error">{speech.error}</p> : null}
      {saveError ? <p role="alert" className="error">{saveError}</p> : null}

      <button type="submit" className="primary" disabled={!parsed.ok || saving}>
        {saving ? 'Saving…' : 'Save expense'}
      </button>
    </form>
  );
}
