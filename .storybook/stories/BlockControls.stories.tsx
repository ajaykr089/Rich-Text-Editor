import React, { useState } from 'react';
import { BlockControls, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/BlockControls',
  component: BlockControls,
};

export const Default = () => (
  <BlockControls ariaLabel="Inline formatting controls">
    <Button size="sm">Bold</Button>
    <Button size="sm">Italic</Button>
    <Button size="sm">Link</Button>
  </BlockControls>
);

export const StatefulSelection = () => {
  const [active, setActive] = useState('paragraph');

  return (
    <Grid style={{ gap: 12 }}>
      <BlockControls ariaLabel="Block type controls">
        <Button variant={active === 'paragraph' ? 'primary' : 'secondary'} size="sm" onClick={() => setActive('paragraph')}>
          Paragraph
        </Button>
        <Button variant={active === 'heading' ? 'primary' : 'secondary'} size="sm" onClick={() => setActive('heading')}>
          Heading
        </Button>
        <Button variant={active === 'quote' ? 'primary' : 'secondary'} size="sm" onClick={() => setActive('quote')}>
          Quote
        </Button>
      </BlockControls>
      <Box style={{ fontSize: 12, color: '#64748b' }}>
        Active type: <strong>{active}</strong>
      </Box>
    </Grid>
  );
};

export const VerticalCompact = () => (
  <BlockControls orientation="vertical" density="compact" ariaLabel="Vertical block controls">
    <Button size="sm">H1</Button>
    <Button size="sm">H2</Button>
    <Button size="sm">Code</Button>
  </BlockControls>
);

export const ComfortableDensity = () => (
  <BlockControls density="comfortable" ariaLabel="Comfortable controls">
    <Button size="sm">Undo</Button>
    <Button size="sm">Redo</Button>
    <Button size="sm" variant="secondary">
      Inspect
    </Button>
  </BlockControls>
);

export const RtlNavigation = () => (
  <Flex style={{ direction: 'rtl' }}>
    <BlockControls ariaLabel="RTL controls">
      <Button size="sm">Undo</Button>
      <Button size="sm">Redo</Button>
      <Button size="sm">Insert</Button>
    </BlockControls>
  </Flex>
);

export const TokenStyled = () => (
  <BlockControls
    ariaLabel="Styled controls"
    style={
      {
        '--ui-block-controls-bg': '#ecfeff',
        '--ui-block-controls-border': '1px solid #a5f3fc',
        '--ui-block-controls-radius': '18px',
      } as any
    }
  >
    <Button size="sm">Comment</Button>
    <Button size="sm">Resolve</Button>
    <Button size="sm" variant="secondary">
      History
    </Button>
  </BlockControls>
);
