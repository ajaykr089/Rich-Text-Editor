import React from 'react';
import { Alert, Box, Button, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    tone: { control: 'radio', options: ['info', 'success', 'warning', 'danger'] },
    variant: { control: 'radio', options: ['soft', 'outline', 'solid'] },
    layout: { control: 'radio', options: ['inline', 'banner'] },
    dismissible: { control: 'boolean' }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Grid gap="12px">
      <Alert
        tone={args.tone}
        variant={args.variant}
        layout={args.layout}
        dismissible={args.dismissible}
        open={open}
        onClose={() => setOpen(false)}
        title="API latency is elevated"
        description="Some dashboard requests are taking longer than expected."
      />

      <Flex gap="8px" wrap="wrap">
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          Show Alert Again
        </Button>
        <Box variant="surface" radius="sm" p="8px" color="#475569">
          Current state: {open ? 'visible' : 'dismissed'}
        </Box>
      </Flex>
    </Grid>
  );
};

Default.args = {
  tone: 'info',
  variant: 'soft',
  layout: 'inline',
  dismissible: true
};

export const WithActions = () => (
  <Alert
    tone="warning"
    variant="outline"
    title="Storage usage is above 85%"
    description="Consider archiving media files or increasing workspace quota."
  >
    <Flex slot="actions" gap="8px" wrap="wrap">
      <Button size="sm" variant="secondary">Review Files</Button>
      <Button size="sm">Upgrade Plan</Button>
    </Flex>
  </Alert>
);

export const BannerNotice = () => (
  <Alert
    tone="success"
    variant="solid"
    layout="banner"
    dismissible
    title="Deployment successful"
    description="Version 2.7.4 is now live for all users."
  >
    <Flex slot="actions" gap="8px" wrap="wrap">
      <Button size="sm" variant="secondary">View Changelog</Button>
      <Button size="sm">Open Dashboard</Button>
    </Flex>
  </Alert>
);
