import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '../packages/react/src';
import { FootnotePlugin } from '../packages/plugins/footnote/src';
import '../packages/plugins/footnote/src/FootnoteStyles.css';

/**
 * Footnote Plugin Demo
 * 
 * Demonstrates footnote functionality with:
 * - Auto-numbering references
 * - Editable footnote content
 * - Bidirectional navigation (reference ↔ footnote)
 * - Semantic HTML structure
 * - Print-friendly layout
 */
const meta: Meta<typeof RichTextEditor> = {
  title: 'Plugins/Footnote',
  component: RichTextEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Footnote Plugin allows users to insert academic-style footnotes with automatic numbering and management.

## Features
- ✅ Auto-numbered footnote references (superscript)
- ✅ Footnote container at document end
- ✅ Editable footnote content
- ✅ Bidirectional links (click reference → scroll to footnote, click ↩ → back to reference)
- ✅ Auto-renumbering on deletion
- ✅ Print-friendly styling
- ✅ Semantic HTML structure

## Usage
1. Click the **Footnote** button in the toolbar
2. The reference number appears at cursor position
3. Edit the footnote content at the bottom of the document
4. Click on reference numbers to navigate between text and footnotes

## Keyboard Shortcuts
- None (click-based interaction)

## HTML Structure
\`\`\`html
<!-- Footnote Reference -->
<sup class="rte-footnote-ref" data-footnote-id="fn-xxx">1</sup>

<!-- Footnote Container -->
<section class="rte-footnotes">
  <ol>
    <li id="fn-xxx" class="rte-footnote-item">
      <div class="rte-footnote-content" contenteditable="true">
        Footnote text here
      </div>
      <a class="rte-footnote-backref" href="#ref-fn-xxx">↩</a>
    </li>
  </ol>
</section>
\`\`\`

## Styling
The plugin includes comprehensive CSS for:
- Superscript references with brackets [1]
- Footnote container with border and background
- Hover effects and transitions
- Print-optimized layout
- Editable content indicators
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'number' },
      description: 'Editor height in pixels',
      defaultValue: 600
    }
  }
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

/**
 * Default Demo
 * Shows basic footnote functionality with sample content
 */
export const Default: Story = {
  args: {
    plugins: [FootnotePlugin()],
    toolbar: 'history | bold italic underline | footnote',
    content: `
      <h2>Academic Writing with Footnotes</h2>
      
      <p>
        This is an example of academic writing with footnotes. The first citation appears here,
        and you can click the footnote button in the toolbar to add more.
      </p>
      
      <p>
        Footnotes are commonly used in academic and technical writing to provide additional 
        information, citations, or commentary without disrupting the main text flow.
      </p>
      
      <h3>How to Use</h3>
      <ol>
        <li>Place your cursor where you want the footnote reference</li>
        <li>Click the <strong>Footnote</strong> button in the toolbar</li>
        <li>Scroll to the bottom to edit the footnote content</li>
        <li>Click on reference numbers to jump between text and footnotes</li>
      </ol>
    `,
    height: 600
  }
};

/**
 * With Multiple Footnotes
 * Demonstrates auto-numbering with several footnotes
 */
export const MultipleFootnotes: Story = {
  args: {
    plugins: [FootnotePlugin()],
    toolbar: 'history | bold italic | footnote',
    content: `
      <h2>Research Paper Example</h2>
      
      <p>
        The concept of artificial intelligence was first proposed by Alan Turing in his 
        seminal 1950 paper. Machine learning, a subset of AI, has seen exponential 
        growth in recent years. Deep learning architectures have achieved remarkable 
        results in computer vision and natural language processing.
      </p>
      
      <p>
        Neural networks were inspired by biological neurons. The perceptron algorithm 
        was developed in the late 1950s. Modern deep learning uses backpropagation 
        for training multi-layer networks.
      </p>
      
      <p>
        <strong>Note:</strong> Click the footnote button to add references, then click 
        on the reference numbers to navigate between the text and footnotes.
      </p>
    `,
    height: 600
  }
};

/**
 * Empty Editor
 * Start with a clean slate
 */
export const EmptyEditor: Story = {
  args: {
    plugins: [FootnotePlugin()],
    toolbar: 'history | bold italic underline | footnote',
    content: `
      <p>Start typing your document here. Click the footnote button to add references.</p>
    `,
    height: 600
  }
};

/**
 * With Formatting
 * Shows footnotes work alongside other formatting plugins
 */
export const WithFormatting: Story = {
  args: {
    plugins: [FootnotePlugin()],
    toolbar: 'history | bold italic underline strikethrough | footnote',
    content: `
      <h2>Technical Documentation</h2>
      
      <p>
        When writing technical documentation, footnotes can provide:
      </p>
      
      <ul>
        <li><strong>Citations</strong> - Reference sources and standards</li>
        <li><em>Clarifications</em> - Explain technical terms</li>
        <li><u>Additional context</u> - Provide background information</li>
        <li>Cross-references - Link to related sections</li>
      </ul>
      
      <p>
        The footnote container automatically appears at the bottom of your document
        and maintains proper numbering even when footnotes are added or removed.
      </p>
      
      <blockquote>
        "Footnotes are the foundation of academic integrity." - Anonymous Scholar
      </blockquote>
    `,
    height: 600
  }
};

/**
 * Print Preview
 * Shows how footnotes appear in print layout
 */
export const PrintPreview: Story = {
  args: {
    plugins: [FootnotePlugin()],
    toolbar: 'history | bold italic | footnote',
    content: `
      <h2>Print-Friendly Footnotes</h2>
      
      <p>
        This document demonstrates how footnotes appear in print. Use your browser's 
        print preview (Ctrl/Cmd + P) to see the footnotes formatted for printing.
      </p>
      
      <p>
        The footnote container has special print styles that ensure:
      </p>
      
      <ul>
        <li>Footnotes always appear at the bottom of the page</li>
        <li>References are clearly numbered</li>
        <li>Styling is optimized for paper/PDF output</li>
        <li>Page breaks don't split the footnote container</li>
      </ul>
      
      <p>
        <strong>Try it:</strong> Add some footnotes, then use your browser's print 
        preview to see them formatted for printing.
      </p>
    `,
    height: 600
  },
  parameters: {
    docs: {
      description: {
        story: 'Use browser print preview (Ctrl/Cmd + P) to see print-optimized footnote layout.'
      }
    }
  }
};

/**
 * Interactive Demo
 * Shows all interactive features
 */
export const InteractiveDemo: Story = {
  args: {
    plugins: [FootnotePlugin()],
    toolbar: 'history | bold italic underline | footnote',
    content: `
      <h2>Interactive Footnote Features</h2>
      
      <p>
        This demo showcases all interactive features of the footnote plugin:
      </p>
      
      <h3>Navigation</h3>
      <ul>
        <li>Click any footnote reference number to scroll to the footnote</li>
        <li>Click the ↩ (back) link in a footnote to return to the reference</li>
        <li>References highlight briefly when navigated to</li>
      </ul>
      
      <h3>Editing</h3>
      <ul>
        <li>Footnote content is fully editable</li>
        <li>Click inside any footnote to edit its text</li>
        <li>Formatting works inside footnote content</li>
      </ul>
      
      <h3>Management</h3>
      <ul>
        <li>Footnotes auto-number sequentially (1, 2, 3...)</li>
        <li>Delete a reference to remove its footnote</li>
        <li>Remaining footnotes renumber automatically</li>
      </ul>
      
      <p>
        <strong>Try these actions:</strong>
      </p>
      <ol>
        <li>Add a new footnote</li>
        <li>Click the reference to jump to it</li>
        <li>Edit the footnote content</li>
        <li>Click ↩ to return to the reference</li>
        <li>Add more footnotes to see auto-numbering</li>
      </ol>
    `,
    height: 700
  }
};
