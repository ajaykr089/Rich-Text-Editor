import React from 'react';
import { Section } from '@editora/ui-react';

export default {
  title: 'UI/Section',
  component: Section,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] }
  }
};

export const Default = (args: any) => (
  <Section size={args.size} style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
      Section content ({args.size})
    </div>
  </Section>
);
Default.args = { size: 'medium' };

export const SizeVariants = () => (
  <div>
    <Section size="small"><div style={{ background: '#f8fafc' }}>Small spacing</div></Section>
    <Section size="medium"><div style={{ background: '#f1f5f9' }}>Medium spacing</div></Section>
    <Section size="large"><div style={{ background: '#e2e8f0' }}>Large spacing</div></Section>
  </div>
);
