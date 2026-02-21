import React from 'react';
import { Button, ThemeProvider, Box, Flex, Grid } from '@editora/ui-react';

const shellStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: 14,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
};

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    variant: { control: { type: 'radio', options: ['primary','secondary','ghost','danger'] } },
    size: { control: { type: 'radio', options: ['sm','md','lg'] } },
    theme: { control: { type: 'radio', options: ['default','dark','brand'] } }
  }
};

const Template = (args: any) => (
  <Button
    disabled={args.disabled}
    variant={args.variant}
    size={args.size}
    icon={args.icon}
    loading={args.loading}
    block={args.block}
    headless={args.headless}
    theme={args.theme}
  >
    {args.label}
  </Button>
);

export const Default = Template.bind({});
Default.args = { label: 'Click me', disabled: false, variant: 'primary', size: 'md', icon: undefined, loading: false, block: false, headless: false, theme: 'default' };

export const Variants = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Flex>
  </Box>
);

export const Sizes = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Flex>
  </Box>
);

export const WithIcon = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button icon="check">With icon</Button>
      <Button variant="secondary" icon="x">
        Secondary icon
      </Button>
      <Button variant="ghost" icon="sparkles">
        Ghost icon
      </Button>
    </Flex>
  </Box>
);

export const Loading = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button loading>Publishing</Button>
      <Button loading variant="secondary">
        Saving draft
      </Button>
      <Button loading variant="danger">
        Deleting
      </Button>
    </Flex>
  </Box>
);

export const Headless = () => (
  <Box style={shellStyle}>
    <Button headless style={{ color: '#0f172a', padding: '8px 12px', border: '1px dashed #94a3b8', borderRadius: 10 }}>
      Headless
    </Button>
  </Box>
);

export const Block = () => (
  <Box style={{ ...shellStyle, width: 340 }}>
    <Button block>Full width button</Button>
  </Box>
);

export const Animations = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Box style={{ fontSize: 12, color: '#64748b' }}>Default (no animation)</Box>
        <Button>Default</Button>
      </Flex>
      <Button animation="scale">Scale hover</Button>
      <Button animation="pulse" variant="secondary">
        Pulse
      </Button>
      <Button animation="none" variant="ghost">
        No animation
      </Button>
    </Flex>
  </Box>
);

export const Themes = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button theme="dark">Dark theme</Button>
      <Button theme="brand">Brand theme</Button>
      <Button style={{ '--ui-primary': '#ec4899' } as React.CSSProperties}>Custom CSS var</Button>
    </Flex>
  </Box>
);

export const ThemedByTokens = () => (
  <Box style={shellStyle}>
    <ThemeProvider tokens={{ colors: { primary: '#7c3aed', background: '#0f172a', text: '#f8fafc' }, radius: '10px' }}>
      <Box style={{ padding: 12, borderRadius: 12, background: 'var(--ui-color-background)' }}>
        <Button>Primary (token)</Button>
        <Button variant="secondary" style={{ marginLeft: 8 }}>
          Secondary
        </Button>
      </Box>
    </ThemeProvider>
  </Box>
);

export const CustomSize = () => (
  <Box style={shellStyle}>
    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Box style={{ fontSize: 12, color: '#64748b' }}>Custom min-height</Box>
        <Button style={{ '--ui-min-height': '56px', '--ui-padding': '14px 24px' } as React.CSSProperties}>Tall button</Button>
      </Flex>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Box style={{ fontSize: 12, color: '#64748b' }}>Fixed width</Box>
        <Button style={{ '--ui-width': '220px' } as React.CSSProperties}>Fixed width</Button>
      </Flex>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Box style={{ fontSize: 12, color: '#64748b' }}>Flat + headless</Box>
        <Button style={{ '--ui-radius': '0', '--ui-border': 'none' } as React.CSSProperties} variant="secondary">
          Flat secondary
        </Button>
        <Button headless style={{ padding: '8px 12px', border: '1px dashed #94a3b8' }}>
          Headless custom
        </Button>
      </Flex>
    </Grid>
  </Box>
);

export const Disabled = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button disabled>Disabled</Button>
      <Button disabled loading>
        Disabled + loading
      </Button>
      <Button disabled={false} loading>
        Not disabled + loading
      </Button>
    </Flex>
  </Box>
);

export const ActionStrip = () => {
  const [saved, setSaved] = React.useState(0);
  return (
    <Box style={shellStyle}>
      <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button onClick={() => setSaved((v) => v + 1)}>Save</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="ghost">Archive</Button>
        <Button variant="danger">Delete</Button>
      </Flex>
      <Box style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>Saved {saved} time(s).</Box>
    </Box>
  );
};
