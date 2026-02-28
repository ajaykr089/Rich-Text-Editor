import React from 'react';
import { Collapsible, Button, Box, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Collapsible',
  component: Collapsible,
  argTypes: {
    open: { control: 'boolean' },
    headless: { control: 'boolean' }
  }
};

const shellStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: 14,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
};

export const Default = (args: any) => (
  <Box style={shellStyle}>
    <Collapsible header="Click to expand" open={args.open} headless={args.headless}>
      <Box style={{ paddingTop: 8 }}>Collapsible content with keyboard support (Enter/Space on header).</Box>
    </Collapsible>
  </Box>
);
Default.args = { open: false, headless: false };

export const RichHeader = () => (
  <Box style={shellStyle}>
    <Collapsible
      header={
        <span>
          <strong>Advanced Settings</strong> <small style={{ color: '#64748b' }}>(optional)</small>
        </span>
      }
    >
      <Box style={{ margin: 0, paddingTop: 8 }}>
        Tune rendering density, spellcheck behavior, and content filters.
      </Box>
    </Collapsible>
  </Box>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box style={shellStyle}>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
            {open ? 'Collapse' : 'Expand'}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            Open
          </Button>
        </Flex>

        <Collapsible
          open={open}
          onChangeOpen={setOpen}
          header="Project Visibility Rules"
        >
          <Box style={{ display: 'grid', gap: 8, paddingTop: 8 }}>
            <Box>1. Only admins can publish to production.</Box>
            <Box>2. Sensitive drafts require reviewer approval.</Box>
            <Box>3. External links are blocked for guest users.</Box>
          </Box>
        </Collapsible>

        <Box style={{ fontSize: 12, color: '#64748b' }}>Open: {String(open)}</Box>
      </Flex>
    </Box>
  );
};

export const MultiSection = () => (
  <Box style={shellStyle}>
    <Grid style={{ display: 'grid', gap: 10 }}>
      <Collapsible open header="Publishing Workflow">
        <Box style={{ paddingTop: 8 }}>Draft, review, sign-off, and release gates.</Box>
      </Collapsible>
      <Collapsible header="Permissions Matrix">
        <Box style={{ paddingTop: 8 }}>Role-based access for editors, reviewers, and admins.</Box>
      </Collapsible>
      <Collapsible header="Retention Policy">
        <Box style={{ paddingTop: 8 }}>Define archival window and compliance exports.</Box>
      </Collapsible>
    </Grid>
  </Box>
);
