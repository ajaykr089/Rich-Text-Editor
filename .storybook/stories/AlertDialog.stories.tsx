import React from 'react';
import { AlertDialog, Box, Button, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  argTypes: {
    open: { control: 'boolean' },
    headless: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = React.useState(Boolean(args.open));
  const [liveValue, setLiveValue] = React.useState('');
  const [liveChecked, setLiveChecked] = React.useState(false);
  const [result, setResult] = React.useState('none');

  React.useEffect(() => {
    setOpen(Boolean(args.open));
  }, [args.open]);

  return (
    <Grid gap="12px">
      <Flex gap="8px" wrap="wrap">
        <Button onClick={() => setOpen(true)}>Delete Project</Button>
        <Button variant="secondary" onClick={() => { setResult('none'); setLiveValue(''); setLiveChecked(false); }}>
          Reset Log
        </Button>
      </Flex>

      <AlertDialog
        {...args}
        open={open}
        config={{
          title: 'Delete this project?',
          description: 'This action is permanent and removes all associated drafts.',
          confirmText: 'Delete',
          cancelText: 'Cancel',
          size: args.size || 'md',
          input: {
            enabled: true,
            label: 'Type DELETE to confirm',
            placeholder: 'DELETE',
            required: true
          },
          checkbox: {
            enabled: true,
            label: 'Also archive linked resources'
          }
        }}
        onConfirm={(detail) => setResult(`confirm value=${detail.inputValue || ''} checked=${String(detail.checked)}`)}
        onCancel={() => setResult('cancel')}
        onDismiss={(detail) => setResult(`dismiss:${detail.source}`)}
        onChange={(detail) => {
          setLiveValue(detail.inputValue || '');
          setLiveChecked(Boolean(detail.checked));
        }}
        onClose={(detail) => {
          setResult(`close:${detail.action}${detail.source ? `:${detail.source}` : ''}`);
          setOpen(false);
        }}
      />

      <Box variant="surface" p="10px" radius="sm" color="#475569">
        Live input: <strong>{liveValue || 'empty'}</strong> | Live checkbox: <strong>{String(liveChecked)}</strong>
      </Box>
      <Box variant="surface" p="10px" radius="sm" color="#475569">
        Last result: <strong>{result}</strong>
      </Box>
    </Grid>
  );
};

Default.args = {
  open: false,
  headless: false,
  dismissible: true,
  closeOnEsc: true,
  closeOnBackdrop: true,
  size: 'md'
};

export const PromptFlow = () => {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState('No action yet');

  return (
    <Grid gap="12px">
      <Button onClick={() => setOpen(true)}>Open Rename Prompt</Button>
      <AlertDialog
        open={open}
        config={{
          title: 'Rename workspace',
          description: 'Use at least 3 characters to keep naming consistent.',
          confirmText: 'Save',
          cancelText: 'Cancel',
          input: {
            enabled: true,
            label: 'Workspace name',
            placeholder: 'e.g. Northwind Ops',
            required: true
          },
          checkbox: {
            enabled: true,
            label: 'Notify all team members'
          }
        }}
        onConfirm={(detail) => {
          if ((detail.inputValue || '').trim().length < 3) {
            setResult('Validation note: less than 3 characters.');
            return;
          }
          setResult(`Saved: ${detail.inputValue} | Notify=${String(detail.checked)}`);
        }}
        onDismiss={(detail) => setResult(`Dismissed via ${detail.source}`)}
        onClose={() => setOpen(false)}
      />
      <Box variant="surface" p="10px" radius="sm" color="#475569">
        {result}
      </Box>
    </Grid>
  );
};

export const ControlledState = () => {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error'>('idle');

  return (
    <Grid gap="12px">
      <Flex gap="8px" wrap="wrap">
        <Button onClick={() => { setState('idle'); setOpen(true); }}>Open</Button>
        <Button variant="secondary" onClick={() => setState('loading')}>Set Loading</Button>
        <Button variant="ghost" onClick={() => setState('error')}>Set Error</Button>
        <Button variant="secondary" onClick={() => setState('idle')}>Set Idle</Button>
      </Flex>

      <AlertDialog
        open={open}
        state={state}
        lockWhileLoading
        onClose={() => setOpen(false)}
        config={{
          title: 'Processing payment',
          description: 'This example shows externally controlled loading/error states.',
          confirmText: 'Retry',
          cancelText: 'Close',
          loadingText: 'Processing request...',
          errorMessage: state === 'error' ? 'Payment provider returned a temporary error.' : ''
        }}
      />
    </Grid>
  );
};
