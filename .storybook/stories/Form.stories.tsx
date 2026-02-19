import React from 'react';
import { Form, Input, Button, useForm } from '@editora/ui-react';

export default {
  title: 'UI/Form',
  component: Form,
};

export const Simple = () => {
  const { ref, submit, getValues } = useForm();

  return (
    <div style={{ maxWidth: 420 }}>
      <Form ref={ref} onSubmit={(d) => alert(JSON.stringify(d))}>
        <Input name="firstName" label="First name" placeholder="Jane" />
        <Input name="email" type="email" label="Email" required placeholder="you@company.com" />
        <div style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Submit</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => alert(JSON.stringify(getValues()))}>Get values</Button>
        </div>
      </Form>
    </div>
  );
};
