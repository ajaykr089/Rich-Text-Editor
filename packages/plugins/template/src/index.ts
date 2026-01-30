export { TemplatePlugin } from './TemplatePlugin';
export type { Template } from './TemplatePlugin';
export {
  PREDEFINED_TEMPLATES,
  getAllTemplates,
  getTemplatesByCategory,
  getTemplateCategories,
  searchTemplates,
  sanitizeTemplate,
  insertTemplateAtCursor,
  replaceDocumentWithTemplate,
  getCurrentDocumentHTML,
  addCustomTemplate,
  validateTemplate
} from './TemplatePlugin';
export { TemplatePluginProvider } from './TemplatePluginProvider';
