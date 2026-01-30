export { SpellCheckPlugin } from './SpellCheckPlugin';
export type { SpellCheckResult, DictionaryEntry } from './SpellCheckPlugin';
export {
  isWordMisspelled,
  getSuggestions,
  scanDocumentForMisspellings,
  addToDictionary,
  ignoreWord,
  replaceWord,
  highlightMisspelledWords,
  clearSpellCheckHighlights,
  getSpellCheckStats
} from './SpellCheckPlugin';
export { SpellCheckPluginProvider } from './SpellCheckPluginProvider';
