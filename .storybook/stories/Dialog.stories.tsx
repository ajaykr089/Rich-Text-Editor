import React from 'react';
import { Button, Dialog } from '@editora/ui-react';

export default {
  title: 'UI/Dialog',
  component: Dialog,
  argTypes: {
    open: { control: 'boolean' },
    closable: { control: 'boolean' },
    closeOnOverlay: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = React.useState(Boolean(args.open));
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        {...args}
        open={open}
        title="Publish changes"
        description="Review details before publishing this version."
        onClose={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>
            This action will update the shared workspace for all collaborators.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Publish</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
Default.args = {
  open: false,
  closable: true,
  closeOnOverlay: true,
  closeOnEsc: true,
  size: 'md'
};

export const Large = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open large dialog</Button>
      <Dialog
        open={open}
        size="lg"
        title="Team activity report"
        description="Weekly summary across all editors."
        onClose={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ padding: 10, borderRadius: 10, background: '#f8fafc' }}>Documents created: 42</div>
          <div style={{ padding: 10, borderRadius: 10, background: '#f8fafc' }}>Comments resolved: 128</div>
          <div style={{ padding: 10, borderRadius: 10, background: '#f8fafc' }}>Pending approvals: 6</div>
        </div>
      </Dialog>
    </div>
  );
};

export const NonDismissable = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open strict dialog</Button>
      <Dialog
        open={open}
        title="Security confirmation"
        description="This dialog can only close via button action."
        closable={false}
        closeOnOverlay={false}
        closeOnEsc={false}
      >
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>Confirm to continue with protected operation.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpen(false)}>I Understand</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
