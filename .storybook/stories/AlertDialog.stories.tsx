import React from 'react';
import { AlertDialog, Button } from '@editora/ui-react';

export default {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  argTypes: {
    open: { control: 'boolean' },
    headless: { control: 'boolean' }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = React.useState(Boolean(args.open));

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Delete project</Button>
      <AlertDialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>Delete this project?</h3>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#475569' }}>
              This action is permanent and removes all associated drafts.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button style={{ ['--ui-btn-bg' as any]: '#dc2626' }} onClick={() => setOpen(false)}>
              Delete
            </Button>
          </div>
        </div>
      </AlertDialog>
    </div>
  );
};

Default.args = {
  open: false,
  headless: false
};
