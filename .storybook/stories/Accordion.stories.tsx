import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Box,
  Button,
  Flex,
  Grid,
} from '@editora/ui-react';

export default {
  title: 'UI/Accordion',
  component: Accordion,
};

function AccountAccordion(props: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionItem>
        <AccordionTrigger>Workspace Profile</AccordionTrigger>
        <AccordionPanel>
          Update brand name, locale, timezone, and editor defaults from one place.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Security & Access</AccordionTrigger>
        <AccordionPanel>
          Manage 2FA policy, allowed devices, and session expiration strategy.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Audit & Retention</AccordionTrigger>
        <AccordionPanel>
          Configure 30/90/365 day log retention with export guardrails.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export const Default = () => <AccountAccordion />;

export const MultipleWithDisabled = () => (
  <Accordion multiple>
    <AccordionItem>
      <AccordionTrigger>Workspace Profile</AccordionTrigger>
      <AccordionPanel>Editable workspace identity and localization settings.</AccordionPanel>
    </AccordionItem>
    <AccordionItem disabled>
      <AccordionTrigger>Advanced Billing</AccordionTrigger>
      <AccordionPanel>Disabled section example.</AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionTrigger>Audit & Retention</AccordionTrigger>
      <AccordionPanel>Configure data retention and export policies.</AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export const Controlled = () => {
  const [open, setOpen] = useState<number | number[]>(0);

  return (
    <Grid style={{ gap: 14 }}>
      <Flex style={{ gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setOpen(0)}>
          Open 1
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(1)}>
          Open 2
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(-1)}>
          Close All
        </Button>
      </Flex>
      <AccountAccordion open={open} onToggle={(next) => setOpen(next)} />
      <Box style={{ fontSize: 12, color: '#64748b' }}>
        Current open state: <strong>{Array.isArray(open) ? JSON.stringify(open) : String(open)}</strong>
      </Box>
    </Grid>
  );
};

export const NonCollapsible = () => <AccountAccordion collapsible={false} open={0} />;

export const RichContent = () => (
  <Accordion>
    <AccordionItem>
      <AccordionTrigger>
        <span role="img" aria-label="spark">
          ✨
        </span>{' '}
        Rich Trigger Content
      </AccordionTrigger>
      <AccordionPanel>
        <p>
          You can render <strong>structured JSX</strong> inside panel content.
        </p>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem>
      <AccordionTrigger>Keyboard Support</AccordionTrigger>
      <AccordionPanel>Try ArrowUp/ArrowDown/Home/End and Enter/Space on triggers.</AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export const TokenStyled = () => (
  <AccountAccordion
    style={
      {
        '--ui-accordion-radius': '12px',
        '--ui-accordion-shadow': 'none',
        '--ui-accordion-border': '1px solid #dbe5f0',
        '--ui-accordion-divider': '#dbe5f0',
        '--ui-accordion-open-surface': '#f0f9ff',
        '--ui-accordion-primary': '#0ea5e9',
        '--ui-accordion-surface-alt': '#f8fbff',
        '--ui-accordion-duration': '260ms',
      } as any
    }
  />
);
