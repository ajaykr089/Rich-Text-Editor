import React, { useState } from 'react';
import { Box, Button, Field, Form, Grid, Input, Textarea, useForm } from '@editora/ui-react';

export default {
  title: 'UI/Form',
  component: Form,
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'outline', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    gap: { control: 'text' },
    novalidate: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const { ref, submit, getValues, validate } = useForm();

  return (
    <Box style={{ maxWidth: 620 }}>
      <Form
        ref={ref}
        variant={args.variant}
        tone={args.tone}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        gap={args.gap}
        novalidate={args.novalidate}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        onInvalid={(errors) => alert(`Invalid: ${JSON.stringify(errors, null, 2)}`)}
      >
        <Grid style={{ display: 'grid', gap: 12 }}>
          <Field label="First name" htmlFor="form-first-name" required variant="outline">
            <Input id="form-first-name" name="firstName" placeholder="Jane" required />
          </Field>

          <Field label="Email" htmlFor="form-email" required variant="outline">
            <Input id="form-email" name="email" type="email" placeholder="you@company.com" required />
          </Field>

          <Field label="Notes" htmlFor="form-notes" description="Optional context for reviewers." variant="soft">
            <Textarea id="form-notes" name="notes" rows={4} placeholder="Add additional details..." />
          </Field>
        </Grid>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Submit</Button>
          <Button style={{ marginLeft: 8 }} variant="secondary" onClick={async () => alert(JSON.stringify(await validate(), null, 2))}>
            Validate
          </Button>
          <Button style={{ marginLeft: 8 }} variant="ghost" onClick={() => alert(JSON.stringify(getValues(), null, 2))}>
            Get values
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

Playground.args = {
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  gap: '12px',
  novalidate: false
};

export const ValidationFlow = () => {
  const { ref, submit } = useForm();
  const [state, setState] = useState('idle');

  return (
    <Box style={{ maxWidth: 560 }}>
      <Form
        ref={ref}
        variant="outline"
        tone="warning"
        onSubmit={() => setState('submitted')}
        onInvalid={() => setState('invalid')}
      >
        <Field label="Project code" htmlFor="form-code" required>
          <Input id="form-code" name="code" pattern="[A-Z]{3}-[0-9]{3}" required placeholder="ABC-123" />
        </Field>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Run validation</Button>
          <Box style={{ marginTop: 8, fontSize: 13, color: '#475569' }}>State: {state}</Box>
        </Box>
      </Form>
    </Box>
  );
};

export const ContrastMode = () => {
  const { ref, submit } = useForm();
  return (
    <Box style={{ maxWidth: 620, background: '#020617', padding: 12, borderRadius: 14 }}>
      <Form ref={ref} variant="contrast" shape="soft" elevation="high" onSubmit={() => {}}>
        <Field label="Workspace" htmlFor="form-workspace" variant="contrast">
          <Input id="form-workspace" name="workspace" value="Editora" />
        </Field>

        <Field label="Release notes" htmlFor="form-release" variant="contrast" description="Visible in changelog panel.">
          <Textarea id="form-release" name="release" rows={3} value="Sprint 3: hardening complete." />
        </Field>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Save</Button>
        </Box>
      </Form>
    </Box>
  );
};

export const ProVisualModes = () => {
  const { ref, submit } = useForm();

  return (
    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: 14 }}>
      <Form ref={ref} variant="minimal" tone="brand" onSubmit={() => {}}>
        <Field label="Minimal form" htmlFor="form-minimal">
          <Input id="form-minimal" name="minimal" placeholder="Flat mode for dense pages" />
        </Field>
        <Button onClick={() => submit()}>Submit</Button>
      </Form>

      <Form variant="elevated" tone="success" shape="soft" elevation="high" onSubmit={() => {}}>
        <Field label="Elevated form" htmlFor="form-elevated" variant="elevated">
          <Input id="form-elevated" name="elevated" placeholder="Depth-rich mode" />
        </Field>
        <Button>Save</Button>
      </Form>
    </Grid>
  );
};
