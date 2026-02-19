import React from 'react';
import { render } from '@testing-library/react';
import { Form, Input } from '../components';

describe('React Form wrapper', () => {
  it('forwards submit/invalid events and reflects methods', async () => {
    const onSubmit = vi.fn();
    const onInvalid = vi.fn();
    const ref = React.createRef<any>();

    render(
      <Form ref={ref} onSubmit={onSubmit} onInvalid={onInvalid}>
        <Input name="email" type="email" value="test@example.com" />
      </Form>
    );

    // submit should be callable
    const ok = await ref.current.submit();
    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalled();
  });
});