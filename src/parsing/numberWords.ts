const SMALL_NUMBERS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const HUNDRED = 100;
const THOUSAND = 1000;

/** Reads the first run of spelled-out numbers, such as "twenty five" or "one hundred twelve". */
export function findNumberWords(text: string): { value: number } | null {
  const tokens = text.split(/[^a-z]+/).filter(Boolean);
  const start = tokens.findIndex((token) => Object.hasOwn(SMALL_NUMBERS, token) || token === 'hundred' || token === 'thousand');
  if (start === -1) {
    return null;
  }

  let total = 0;
  let current = 0;
  for (const token of tokens.slice(start)) {
    if (Object.hasOwn(SMALL_NUMBERS, token)) {
      current += SMALL_NUMBERS[token] ?? 0;
    } else if (token === 'hundred') {
      current = (current || 1) * HUNDRED;
    } else if (token === 'thousand') {
      total += (current || 1) * THOUSAND;
      current = 0;
    } else if (token === 'and') {
      continue;
    } else {
      break;
    }
  }
  return { value: total + current };
}
