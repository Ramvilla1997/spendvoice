import { useState, type FormEvent } from 'react';
import type { NewExpense } from '../../domain/expense.js';
import { parseExpense } from '../../parsing/parseExpense.js';
import { useSpeechRecognition } from '../../voice/useSpeechRecognition.js';
import { formatMoney } from './format.js';

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
    ? `${formatMoney(parsed.expense.amountCents, parsed.expense.currency)} · ${parsed.expense.category} · ${parsed.expense.occurredOn}`
    : text.trim() === '' ? 'Type or speak an expense.' : parsed.reason;

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <label htmlFor="expense-text">Describe the expense</label>
      <div className="input-row">
        <input
          id="expense-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder='For example "taxi twelve dollars"'
          autoComplete="off"
        />
        {speech.supported ? (
          <button
            type="button"
            className="secondary"
            aria-pressed={speech.listening}
            onClick={speech.listening ? speech.stop : speech.start}
          >
            {speech.listening ? 'Stop' : 'Speak'}
          </button>
        ) : null}
      </div>

      <p className="preview" aria-live="polite">{preview}</p>
      {speech.error ? <p role="alert" className="error">{speech.error}</p> : null}
      {saveError ? <p role="alert" className="error">{saveError}</p> : null}

      <button type="submit" disabled={!parsed.ok || saving}>
        {saving ? 'Saving…' : 'Save expense'}
      </button>
      <p className="muted">
        Check the preview before saving. Some browsers send speech to their speech service to be converted to text.
      </p>
    </form>
  );
}
