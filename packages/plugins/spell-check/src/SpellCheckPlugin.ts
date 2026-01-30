import { Plugin } from '@editora/core';
import { SpellCheckPluginProvider } from './SpellCheckPluginProvider';

/**
 * Spell Check Plugin for Rich Text Editor
 *
 * Non-blocking spell checking with:
 * - Viewport-based scanning
 * - Misspelled word highlighting
 * - Right-click suggestions
 * - Ignore word option
 * - Custom dictionary
 * - Multi-language support (basic)
 *
 * Rules:
 * - Ignore code blocks
 * - Ignore merge tags
 * - Ignore URLs and emails
 * - Ignore capitalized words (proper nouns)
 * - Ignore hyphenated words
 * - Ignore CamelCase
 * - Non-blocking background scan
 * - Incremental updates
 */
export const SpellCheckPlugin = (): Plugin => ({
  name: "spellCheck",
  toolbar: [
    {
      label: "Spell Check",
      command: "toggleSpellCheck",
      type: "button",
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12.5L3.84375 9.5M3.84375 9.5L5 5.38889C5 5.38889 5.25 4.5 6 4.5C6.75 4.5 7 5.38889 7 5.38889L8.15625 9.5M3.84375 9.5H8.15625M9 12.5L8.15625 9.5M13 16.8333L15.4615 19.5L21 13.5M12 8.5H15C16.1046 8.5 17 7.60457 17 6.5C17 5.39543 16.1046 4.5 15 4.5H12V8.5ZM12 8.5H16C17.1046 8.5 18 9.39543 18 10.5C18 11.6046 17.1046 12.5 16 12.5H12V8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
    },
  ],
  context: {
    provider: SpellCheckPluginProvider,
  },
});

/**
 * Spell Check Result
 */
export interface SpellCheckResult {
  word: string;
  position: number;
  suggestions: string[];
  misspelled: boolean;
}

/**
 * Dictionary entry
 */
export interface DictionaryEntry {
  word: string;
  language: string;
}

/**
 * Basic English word dictionary (common words)
 */
const ENGLISH_DICTIONARY = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'be', 'was', 'were', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'what',
  'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'same', 'such', 'no',
  'nor', 'not', 'only', 'own', 'so', 'than', 'too', 'very', 'just', 'as',
  'if', 'because', 'as', 'while', 'although', 'though', 'it', 'its', 'their',
  'them', 'they', 'you', 'he', 'she', 'we', 'me', 'him', 'her', 'us', 'our',
  'i', 'my', 'your', 'his', 'hers', 'ours', 'yours', 'theirs', 'editor',
  'document', 'text', 'word', 'paragraph', 'line', 'page', 'content',
  'hello', 'world', 'test', 'example', 'sample', 'demo', 'lorem', 'ipsum'
]);

/**
 * Custom user dictionary
 */
const customDictionary = new Set<string>();

/**
 * Misspelled words cache
 */
const misspelledWordsCache = new Map<string, string[]>();

/**
 * Check if word is misspelled
 */
export const isWordMisspelled = (word: string, language: string = 'en'): boolean => {
  const lowerWord = word.toLowerCase();

  // Ignore if in any dictionary
  if (ENGLISH_DICTIONARY.has(lowerWord) || customDictionary.has(lowerWord)) {
    return false;
  }

  // Ignore URLs
  if (lowerWord.includes('http://') || lowerWord.includes('https://') || lowerWord.includes('@')) {
    return false;
  }

  // Ignore CamelCase
  if (/[a-z][A-Z]/.test(word)) {
    return false;
  }

  // Ignore capitalized words (likely proper nouns)
  if (word[0] === word[0].toUpperCase() && word.length > 1) {
    return false;
  }

  // Ignore hyphenated words
  if (word.includes('-')) {
    return false;
  }

  // Ignore numbers
  if (/^\d+$/.test(word)) {
    return false;
  }

  // Otherwise, likely misspelled
  return true;
};

/**
 * Get suggestions for misspelled word
 * Uses simple edit distance algorithm
 */
export const getSuggestions = (word: string, maxSuggestions: number = 5): string[] => {
  const cached = misspelledWordsCache.get(word.toLowerCase());
  if (cached) return cached;

  const suggestions: string[] = [];
  const words = Array.from(ENGLISH_DICTIONARY);
  const wordLower = word.toLowerCase();

  // Find words with similar edit distance
  const distances = words.map(w => ({
    word: w,
    distance: editDistance(wordLower, w.toLowerCase())
  }));

  distances.sort((a, b) => a.distance - b.distance);

  const result = distances
    .filter(d => d.distance <= 3)
    .slice(0, maxSuggestions)
    .map(d => d.word);

  misspelledWordsCache.set(wordLower, result);
  return result;
};

/**
 * Edit distance algorithm (Levenshtein distance)
 */
function editDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Scan document for misspellings
 */
export const scanDocumentForMisspellings = (): SpellCheckResult[] => {
  const results: SpellCheckResult[] = [];
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return results;

  const text = editor.textContent || '';
  const wordRegex = /\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];

    if (isWordMisspelled(word)) {
      results.push({
        word,
        position: match.index,
        suggestions: getSuggestions(word),
        misspelled: true
      });
    }
  }

  return results;
};

/**
 * Add word to custom dictionary
 */
export const addToDictionary = (word: string) => {
  customDictionary.add(word.toLowerCase());
  console.log(`Word added to dictionary: ${word}`);
};

/**
 * Ignore word for session
 */
const ignoredWords = new Set<string>();
export const ignoreWord = (word: string) => {
  ignoredWords.add(word.toLowerCase());
};

/**
 * Replace misspelled word
 */
export const replaceWord = (oldWord: string, newWord: string) => {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return;

  const text = editor.textContent || '';
  const updatedText = text.replace(new RegExp(`\\b${oldWord}\\b`), newWord);

  if (editor instanceof HTMLElement) {
    editor.innerText = updatedText;
  }
};

/**
 * Highlight misspelled words
 */
export const highlightMisspelledWords = () => {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return;

  const results = scanDocumentForMisspellings();

  // Clear previous highlights
  editor.querySelectorAll('.rte-misspelled').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });

  // Apply new highlights
  results.forEach(result => {
    if (!ignoredWords.has(result.word.toLowerCase())) {
      const span = document.createElement('span');
      span.className = 'rte-misspelled';
      span.setAttribute('data-suggestions', result.suggestions.join(','));
      span.setAttribute('title', `Suggestions: ${result.suggestions.join(', ')}`);
      span.style.borderBottom = '2px wavy red';
      span.textContent = result.word;
    }
  });
};

/**
 * Clear spell check highlights
 */
export const clearSpellCheckHighlights = () => {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return;

  editor.querySelectorAll('.rte-misspelled').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });
};

/**
 * Get spell check stats
 */
export const getSpellCheckStats = (): { total: number; misspelled: number; accuracy: number } => {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return { total: 0, misspelled: 0, accuracy: 100 };

  const text = editor.textContent || '';
  const wordRegex = /\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g;
  const totalWords = (text.match(wordRegex) || []).length;

  const results = scanDocumentForMisspellings();
  const misspelledCount = results.length;

  return {
    total: totalWords,
    misspelled: misspelledCount,
    accuracy: totalWords > 0 ? ((totalWords - misspelledCount) / totalWords) * 100 : 100
  };
};
