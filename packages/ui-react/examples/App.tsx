import React from 'react';
import { Badge, Button, Combobox, ContextMenu, Dialog, Form, Input, Menubar, NavigationMenu, Table, ThemeProvider, useForm } from '@editora/ui-react';

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(150deg, #f8fafc 0%, #f1f5f9 42%, #ffffff 100%)',
  color: '#0f172a',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
};

const page: React.CSSProperties = {
  maxWidth: 1000,
  margin: '0 auto',
  padding: '40px 20px 64px'
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16
};

const card: React.CSSProperties = {
  borderRadius: 14,
  border: '1px solid rgba(15, 23, 42, 0.12)',
  background: '#ffffff',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  padding: 16
};

function QuickStartCard() {
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Quick Start</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        <Input label="Document name" placeholder="Untitled note" clearable />
        <Button variant="primary">Save</Button>
      </div>
    </section>
  );
}

function ContextMenuCard() {
  const [state, setState] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Context Menu</h2>
      <div
        style={{ border: '1px dashed #94a3b8', borderRadius: 10, padding: 18, background: '#f8fafc' }}
        onContextMenu={(e) => {
          e.preventDefault();
          setState({ open: true, point: { x: e.clientX, y: e.clientY } });
        }}
      >
        Right-click in this box
      </div>

      <ContextMenu open={state.open} anchorPoint={state.point}>
        <div slot="menu">
          <div className="menuitem" role="menuitem" tabIndex={0}>
            Rename
          </div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            Duplicate
          </div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitem" tabIndex={-1} aria-disabled="true">
            Delete (disabled)
          </div>
        </div>
      </ContextMenu>
    </section>
  );
}

function FormCard() {
  const { ref, submit, validate, getValues } = useForm();
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Form + useForm</h2>
      <Form
        ref={ref}
        onSubmit={(values) => console.log('submit', values)}
        onInvalid={(errors) => console.log('invalid', errors)}
        style={{ display: 'grid', gap: 10 }}
      >
        <Input name="email" type="email" label="Email" required placeholder="you@example.com" />
        <Input name="displayName" label="Display Name" clearable />
      </Form>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => validate()}>
          Validate
        </Button>
        <Button variant="secondary" onClick={() => console.log(getValues())}>
          Values
        </Button>
        <Button onClick={() => submit()}>Submit</Button>
      </div>
    </section>
  );
}

function ThemeCard() {
  return (
    <ThemeProvider
      tokens={{
        colors: {
          primary: '#0f766e',
          text: '#0f172a',
          background: '#ffffff'
        }
      }}
    >
      <section style={card}>
        <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Theme Provider</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          <Input label="Themed input" placeholder="Type here..." />
          <Button>Themed action</Button>
        </div>
      </section>
    </ThemeProvider>
  );
}

function ComboboxCard() {
  const [value, setValue] = React.useState('engineering');
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Combobox</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        <Combobox value={value} clearable placeholder="Select team..." onChange={(next) => setValue(next)}>
          <option value="design">Design</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
          <option value="operations">Operations</option>
        </Combobox>
        <div style={{ fontSize: 13, color: '#475569' }}>
          Current value: <code>{value}</code>
        </div>
      </div>
    </section>
  );
}

function BadgeCard() {
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Badge</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="info" text="In Review" />
        <Badge tone="success" dot text="Live" />
        <Badge tone="warning" variant="outline">
          <span slot="icon">⚡</span>
          Priority
        </Badge>
      </div>
    </section>
  );
}

function TableCard() {
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Table</h2>
      <Table striped hover compact sortable>
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="role">Role</th>
              <th data-key="updated">Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ava Johnson</td>
              <td>Design</td>
              <td>2026-02-15</td>
            </tr>
            <tr>
              <td>Liam Carter</td>
              <td>Engineering</td>
              <td>2026-02-18</td>
            </tr>
            <tr>
              <td>Mia Chen</td>
              <td>Product</td>
              <td>2026-02-17</td>
            </tr>
          </tbody>
        </table>
      </Table>
    </section>
  );
}

function NavigationMenuCard() {
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Navigation Menu</h2>
      <NavigationMenu>
        <button slot="item">Overview</button>
        <button slot="item">Components</button>
        <button slot="item">Docs</button>

        <section slot="panel">Overview panel</section>
        <section slot="panel">Components panel</section>
        <section slot="panel">Docs panel</section>
      </NavigationMenu>
    </section>
  );
}

function MenubarCard() {
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Menubar</h2>
      <Menubar>
        <button slot="item">File</button>
        <button slot="item">Edit</button>
        <button slot="item">View</button>

        <div slot="content">
          <div style={{ padding: 8 }}>New</div>
          <div style={{ padding: 8 }}>Open</div>
          <div style={{ padding: 8 }}>Save</div>
        </div>
        <div slot="content">
          <div style={{ padding: 8 }}>Undo</div>
          <div style={{ padding: 8 }}>Redo</div>
        </div>
        <div slot="content">
          <div style={{ padding: 8 }}>Zoom In</div>
          <div style={{ padding: 8 }}>Zoom Out</div>
        </div>
      </Menubar>
    </section>
  );
}

function DialogCard() {
  const [open, setOpen] = React.useState(false);
  return (
    <section style={card}>
      <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Dialog</h2>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        title="Share workspace"
        description="Invite collaborators to this project."
        onClose={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <Input placeholder="email@company.com" />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send Invite</Button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}

export function App() {
  return (
    <main style={shell}>
      <div style={page}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>@editora/ui-react examples</h1>
        <p style={{ margin: '0 0 20px', color: '#475569' }}>
          Runnable local examples for wrappers and common integration patterns.
        </p>
        <div style={grid}>
          <QuickStartCard />
          <ContextMenuCard />
          <FormCard />
          <ThemeCard />
          <ComboboxCard />
          <BadgeCard />
          <TableCard />
          <NavigationMenuCard />
          <MenubarCard />
          <DialogCard />
        </div>
      </div>
    </main>
  );
}
