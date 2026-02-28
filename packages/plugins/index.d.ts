import type { Plugin } from "@editora/core";

export interface ApiConfig {
  apiUrl: string;
  headers?: Record<string, string>;
}

export type MediaManagerConfig = Record<string, unknown>;
export type DocumentManagerConfig = Record<string, unknown>;

export function HeadingPlugin(): Plugin;
export function BoldPlugin(): Plugin;
export function ItalicPlugin(): Plugin;
export function UnderlinePlugin(): Plugin;
export function StrikethroughPlugin(): Plugin;
export function ListPlugin(): Plugin;
export function ChecklistPlugin(): Plugin;
export function HistoryPlugin(): Plugin;
export function LinkPlugin(): Plugin;
export function BlockquotePlugin(): Plugin;
export function ClearFormattingPlugin(): Plugin;
export function CodePlugin(): Plugin;
export function TablePlugin(): Plugin;
export function FontSizePlugin(): Plugin;
export function FontFamilyPlugin(): Plugin;
export function TextAlignmentPlugin(): Plugin;
export function TextColorPlugin(): Plugin;
export function BackgroundColorPlugin(): Plugin;
export function LineHeightPlugin(): Plugin;
export function IndentPlugin(): Plugin;
export function DirectionPlugin(): Plugin;
export function CapitalizationPlugin(): Plugin;
export function MathPlugin(): Plugin;
export function SpecialCharactersPlugin(): Plugin;
export function EmojisPlugin(): Plugin;
export function EmbedIframePlugin(): Plugin;
export function AnchorPlugin(): Plugin;

export function MediaManagerPlugin(): Plugin;
export function setMediaManagerConfig(config: Partial<MediaManagerConfig>): void;
export function getMediaManagerConfig(): MediaManagerConfig;

export function DocumentManagerPlugin(): Plugin;
export function setDocumentManagerConfig(config: Partial<DocumentManagerConfig>): void;
export function getDocumentManagerConfig(): DocumentManagerConfig;

export function PreviewPlugin(): Plugin;
export function FullscreenPlugin(): Plugin;
export function PrintPlugin(): Plugin;
export function PageBreakPlugin(): Plugin;
export function FootnotePlugin(): Plugin;
export function CodeSamplePlugin(): Plugin;
export function MergeTagPlugin(): Plugin;
export function TemplatePlugin(): Plugin;
export function CommentsPlugin(): Plugin;
export function SpellCheckPlugin(): Plugin;
export function A11yCheckerPlugin(): Plugin;

export function setGlobalApiConfig(config: Partial<ApiConfig>): void;
export function getGlobalApiConfig(): ApiConfig;
export function getGlobalApiHeaders(): Record<string, string>;
export function buildApiUrl(baseUrl: string, path: string): string;
