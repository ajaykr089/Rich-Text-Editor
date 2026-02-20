import React from 'react';
import { Form, Field, Input, Textarea, Button, useForm } from '@editora/ui-react';

export default {
  title: 'UI/Form',
  component: Form,
};

export const Simple = () => {
  const { ref, submit, getValues } = useForm();

  return (
    <div style={{ maxWidth: 520 }}>
      <Form ref={ref} onSubmit={(d) => alert(JSON.stringify(d))}>
        <div style={{ display: 'grid', gap: 12 }}>
          <Field label="First name" htmlFor="form-first-name" required>
            <Input id="form-first-name" name="firstName" placeholder="Jane" />
          </Field>

          <Field label="Email" htmlFor="form-email" required>
            <Input id="form-email" name="email" type="email" placeholder="you@company.com" />
          </Field>

          <Field label="Notes" htmlFor="form-notes" description="Optional context for reviewers.">
            <Textarea id="form-notes" name="notes" rows={4} placeholder="Add additional details..." />
          </Field>
        </div>

        <div style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Submit</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => alert(JSON.stringify(getValues()))}>Get values</Button>
        </div>
      </Form>
    </div>
  );
};
