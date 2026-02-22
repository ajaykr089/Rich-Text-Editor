import React from 'react';
import { AlertDialogProvider, Box, Button, Flex, useAlertDialog } from '@editora/ui-react';

export default {
  title: 'UI/AlertDialogPromise'
};

function PromiseDemo() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('No result yet');

  const runAlert = async () => {
    const next = await dialogs.alert({
      title: 'Maintenance complete',
      description: 'Your deployment finished successfully.',
      confirmText: 'Great',
      mode: 'queue'
    });
    setResult(JSON.stringify(next));
  };

  const runConfirm = async () => {
    const next = await dialogs.confirm({
      title: 'Delete customer account?',
      description: 'This cannot be undone and will remove all related records.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      mode: 'replace',
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    });
    setResult(JSON.stringify(next));
  };

  const runPrompt = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    const next = await dialogs.prompt({
      title: 'Rename workspace',
      description: 'Use 3+ characters. This demonstrates validation + async confirm.',
      confirmText: 'Save',
      cancelText: 'Cancel',
      input: {
        label: 'Workspace name',
        placeholder: 'e.g. Northwind Ops',
        required: true,
        validate: (value: string) => {
          if (value.trim().length < 3) return 'Use at least 3 characters.';
          return null;
        }
      },
      signal: controller.signal,
      onConfirm: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (value?.toLowerCase() === 'error') {
          throw new Error('"error" is reserved. Use another name.');
        }
      }
    });

    window.clearTimeout(timeout);
    setResult(JSON.stringify(next));
  };

  return (
    <Box>
      <Flex gap="10px" wrap="wrap">
        <Button onClick={runAlert}>Run Alert</Button>
        <Button variant="secondary" onClick={runConfirm}>Run Confirm</Button>
        <Button variant="ghost" onClick={runPrompt}>Run Prompt</Button>
      </Flex>
      <Box mt="14px">Result: {result}</Box>
    </Box>
  );
}

export const PromiseAPI = () => (
  <AlertDialogProvider>
    <PromiseDemo />
  </AlertDialogProvider>
);
