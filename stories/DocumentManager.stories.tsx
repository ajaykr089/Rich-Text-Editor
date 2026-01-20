import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { RichTextEditor } from '../packages/react/src/components/RichTextEditor';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ListPlugin,
  LinkPlugin,
  HeadingPlugin,
  ParagraphPlugin,
  DocumentManagerPlugin,
  MediaManagerPlugin,
  setDocumentManagerConfig,
  setMediaManagerConfig
} from '../packages/plugins/src/index';

// Configure APIs for demo purposes
setDocumentManagerConfig({
  apiUrl: 'http://localhost:3001/api/',
  apiEndpoints: {
    exportWord: '/api/documents/export-word'
  }
});

setMediaManagerConfig({
  apiUrl: 'http://localhost:3001/api/',
  apiEndpoints: {
    upload: '/api/media/upload',
    library: '/api/media/library',
    delete: '/api/media/library'
  },
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm']
});

export default {
  title: 'Plugins/Document Manager',
  component: RichTextEditor,
  parameters: {
    docs: {
      description: {
        component: 'Document import/export plugin that supports Word import, Word export, and PDF export functionality. Click the toolbar buttons to test the functionality.'
      }
    }
  }
} as Meta;

const plugins = [
  ParagraphPlugin(),
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  ListPlugin(),
  LinkPlugin(),
  DocumentManagerPlugin()
];

const Template: StoryFn = (args) => (
  <div style={{ height: '400px', border: '1px solid #ccc', padding: '16px' }}>
    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
      <p><strong>Document Manager Plugin Demo</strong></p>
      <p>Use the toolbar buttons to:</p>
      <ul>
        <li><strong>📥 Import Word</strong>: Select a .docx file to import content</li>
        <li><strong>📄 Export Word</strong>: Download current content as Word document</li>
        <li><strong>📋 Export PDF</strong>: Download current content as PDF</li>
      </ul>
      <p style={{ color: '#28a745', marginTop: '8px', fontWeight: 'bold' }}>
        ✅ Plugin is now fully functional with perfect Word styling! Try the buttons below.
      </p>
      <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
        ✅ Fixed: Black text colors, heading formatting, anchor links, <em> tags, &nbsp; entities, nested formatting, colspan tables, complex URLs
      </p>
    </div>
    <RichTextEditor
      plugins={plugins}
      {...args}
    />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  className: 'document-editor'
};

Default.parameters = {
  docs: {
    description: {
      story: 'Basic document manager with import/export buttons in the toolbar. The functionality is now fully implemented!'
    }
  }
};

export const WithSampleContent = Template.bind({});
WithSampleContent.args = {
  className: 'document-editor',
  children: (
    <div>
      <h1>Sample Document</h1>
      <p>This is a <strong>sample document</strong> with <em>various formatting</em> to test the export functionality.</p>
      <h2>Features</h2>
      <ul>
        <li>Word document import</li>
        <li>Word document export</li>
        <li>PDF export</li>
      </ul>
      <p>You can test these features using the toolbar buttons above.</p>
    </div>
  )
};

WithSampleContent.parameters = {
  docs: {
    description: {
      story: 'Document manager with pre-filled content to immediately test export functionality.'
    }
  }
};
