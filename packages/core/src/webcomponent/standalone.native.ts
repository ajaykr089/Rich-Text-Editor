/**
 * Standalone Web Component Bundle - Framework Agnostic
 * Entry point for browser usage via script tag
 * 
 * Uses native plugins with NO React dependency
 * Lightweight, fast, and works in any JavaScript environment
 */

import { PluginLoader } from '../config/PluginLoader';

// Import native plugins (framework-agnostic - NO REACT)
import { BoldPlugin } from "../../../plugins/bold/src/BoldPlugin.native";
import { ItalicPlugin } from "../../../plugins/italic/src/ItalicPlugin.native";
import { UnderlinePlugin } from "../../../plugins/underline/src/UnderlinePlugin.native";
import { StrikethroughPlugin } from "../../../plugins/strikethrough/src/StrikethroughPlugin.native";
import { LinkPlugin } from "../../../plugins/link/src/LinkPlugin.native";
import { TablePlugin } from "../../../plugins/table/src/TablePlugin.native";
import { ListPlugin } from "../../../plugins/list/src/ListPlugin.native";
import { HistoryPlugin } from "../../../plugins/history/src/HistoryPlugin.native";
import { ClearFormattingPlugin } from "../../../plugins/clear-formatting/src/ClearFormattingPlugin.native";
import { HeadingPlugin } from "../../../plugins/heading/src/HeadingPlugin.native";
import { BlockquotePlugin } from "../../../plugins/blockquote/src/BlockquotePlugin.native";
import { CodePlugin } from "../../../plugins/code/src/CodePlugin.native";
import { IndentPlugin } from "../../../plugins/indent/src/IndentPlugin.native";
import { TextAlignmentPlugin } from "../../../plugins/text-alignment/src/TextAlignmentPlugin.native";
import { TextColorPlugin } from "../../../plugins/text-color/src/TextColorPlugin.native";
import { BackgroundColorPlugin } from "../../../plugins/background-color/src/BackgroundColorPlugin.native";
import { FontSizePlugin } from "../../../plugins/font-size/src/FontSizePlugin.native";
import { FontFamilyPlugin } from "../../../plugins/font-family/src/FontFamilyPlugin.native";
import { LineHeightPlugin } from "../../../plugins/line-height/src/LineHeightPlugin.native";
import { FootnotePlugin } from "../../../plugins/footnote/src/FootnotePlugin.native";
// ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
import { DirectionPlugin } from "../../../plugins/direction/src/DirectionPlugin.native";
import { CapitalizationPlugin } from "../../../plugins/capitalization/src/CapitalizationPlugin.native";
import { ChecklistPlugin } from "../../../plugins/checklist/src/ChecklistPlugin.native";
import { AnchorPlugin } from "../../../plugins/anchor/src/AnchorPlugin.native";
import { EmbedIframePlugin } from "../../../plugins/embed-iframe/src/EmbedIframePlugin.native";
import { MathPlugin } from "../../../plugins/math/src/MathPlugin.native";
import { MediaManagerPlugin } from "../../../plugins/media-manager/src/MediaManagerPlugin.native";
import { MergeTagPlugin } from "../../../plugins/merge-tag/src/MergeTagPlugin.native";
import { PageBreakPlugin } from "../../../plugins/page-break/src/PageBreakPlugin.native";
import { PrintPlugin } from "../../../plugins/print/src/PrintPlugin.native";
import { PreviewPlugin } from "../../../plugins/preview/src/PreviewPlugin.native";
import { SpecialCharactersPlugin } from "../../../plugins/special-characters/src/SpecialCharactersPlugin.native";
import { SpellCheckPlugin } from "../../../plugins/spell-check/src/SpellCheckPlugin.native";
import { EmojisPlugin } from "../../../plugins/emojis/src/EmojisPlugin.native";
import { A11yCheckerPlugin } from "../../../plugins/a11y-checker/src/A11yCheckerPlugin.native";
import { CommentsPlugin } from "../../../plugins/comments/src/CommentsPlugin.native";
import { DocumentManagerPlugin } from "../../../plugins/document-manager/src/DocumentManagerPlugin.native";
import { FullscreenPlugin } from "../../../plugins/fullscreen/src/FullscreenPlugin.native";
import { TemplatePlugin } from "../../../plugins/template/src/TemplatePlugin.native";

/**
 * All plugins are now native! No more legacy plugins needed.
 * Phase 2: 100% COMPLETE!
 */

// Import RichTextEditor FIRST
import { RichTextEditorElement } from './RichTextEditor';

// Create global plugin loader instance
const globalPluginLoader = new PluginLoader();

// Set it on the class IMMEDIATELY before doing anything else
(RichTextEditorElement as any).__globalPluginLoader = globalPluginLoader;

/**
 * Initialize web component with global plugin registry
 */
export function initWebComponent() {
  console.log('[Editora] Initializing web component with native plugins...');

  // Register native plugins (framework-agnostic, no React) ✅
  const nativePlugins = [
    BoldPlugin(),
    ItalicPlugin(),
    UnderlinePlugin(),
    StrikethroughPlugin(),
    ClearFormattingPlugin(),
    // ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
    HeadingPlugin(),
    BlockquotePlugin(),
    CodePlugin(),
    ListPlugin(),
    ChecklistPlugin(),
    TextAlignmentPlugin(),
    IndentPlugin(),
    DirectionPlugin(),
    TextColorPlugin(),
    BackgroundColorPlugin(),
    FontSizePlugin(),
    FontFamilyPlugin(),
    LineHeightPlugin(),
    CapitalizationPlugin(),
    LinkPlugin(),
    TablePlugin(),
    AnchorPlugin(),
    EmbedIframePlugin(),
    MathPlugin(),
    MediaManagerPlugin(),
    MergeTagPlugin(),
    PageBreakPlugin(),
    PrintPlugin(),
    PreviewPlugin(),
    SpecialCharactersPlugin(),
    SpellCheckPlugin(),
    EmojisPlugin(),
    A11yCheckerPlugin(),
    CommentsPlugin(),
    DocumentManagerPlugin(),
    FullscreenPlugin(),
    TemplatePlugin(),
    HistoryPlugin(),
    FootnotePlugin(),
  ];

  // All plugins are now native! ✅✅✅
  const allPlugins = nativePlugins;

  // Register plugins globally
  allPlugins.forEach(plugin => {
    globalPluginLoader.register(plugin.name, () => plugin);
    console.log(`[Editora] ✓ Registered plugin: ${plugin.name}`, {
      hasCommands: !!plugin.commands,
      hasToolbar: !!plugin.toolbar?.length,
      type: plugin.commands ? 'native' : 'legacy'
    });
  });

  console.log(`[Editora] ✅ ALL ${allPlugins.length} PLUGINS ARE NATIVE! Phase 2 Complete!`);
  console.log('[Editora] Available plugins:', globalPluginLoader.getRegisteredPluginNames().join(', '));
  
  // Return the plugins array directly
  return allPlugins;
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Initialize plugins first
  const plugins = initWebComponent();
  
  // Attach plugins to the element class
  (RichTextEditorElement as any).__globalPlugins = plugins;
  
  // Register custom element
  if (!customElements.get('rich-text-editor')) {
    customElements.define('rich-text-editor', RichTextEditorElement);
    console.log('[Editora] ✅ Web Component registered as <rich-text-editor>');
  }
  
  // Expose global API (TinyMCE-style)
  (window as any).Editora = {
    version: '1.0.0',
    plugins: globalPluginLoader.getRegisteredPluginNames(),
    WebComponent: RichTextEditorElement,
    init: (selector: string, config?: any) => {
      const element = document.querySelector(selector);
      if (element instanceof RichTextEditorElement) {
        if (config) {
          element.setConfig(config);
        }
        return element.getAPI();
      }
      return null;
    }
  };
  
  console.log('[Editora] ✅ Global API exposed as window.Editora');
}

// Export for module usage (initWebComponent already exported above)
export { RichTextEditorElement };
export type { EditorAPI } from './RichTextEditor';
