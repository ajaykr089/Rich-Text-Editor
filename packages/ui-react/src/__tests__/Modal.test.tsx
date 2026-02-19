import React from 'react';
import { render } from '@testing-library/react';
import { Modal } from '../components';

describe('React Modal wrapper', () => {
  it('reflects `open` prop to underlying element attribute', () => {
    const { container, rerender } = render(<Modal open={false}>hello</Modal>);
    const host = container.querySelector('ui-modal');
    expect(host?.hasAttribute('open')).toBe(false);

    rerender(<Modal open={true}>hello</Modal>);
    expect(host?.hasAttribute('open')).toBe(true);
  });

  it('forwards native open/close events to onOpen/onClose props', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();

    const { container } = render(
      <Modal onOpen={onOpen} onClose={onClose}>
        <button>inside</button>
      </Modal>
    );

    const host = container.querySelector('ui-modal') as any;
    expect(host).toBeTruthy();

    // calling the native API should trigger React handlers
    host.open();
    expect(onOpen).toHaveBeenCalled();

    host.close();
    expect(onClose).toHaveBeenCalled();
  });
});