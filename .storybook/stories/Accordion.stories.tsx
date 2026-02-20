import React, { useState } from 'react';
import { Accordion } from '@editora/ui-react';

export default {
  title: 'UI/Accordion',
  component: Accordion,
};

export const Basic = () => (
  <Accordion
    data={[
      {
        header: 'Section 1',
        panel: 'Panel 1 content goes here. <b>Modern</b> and <i>theme-aware</i>.'
      },
      {
        header: 'Section 2',
        panel: 'Panel 2 content goes here. Try keyboard navigation and focus ring.'
      }
    ]}
  />
);

export const Multiple = () => (
  <Accordion
    multiple
    data={[
      {
        header: 'First',
        panel: 'First panel (multiple open allowed)'
      },
      {
        header: 'Second',
        panel: 'Second panel'
      },
      {
        header: 'Third',
        panel: 'Third panel'
      }
    ]}
  />
);

export const Controlled = () => {
  const [open, setOpen] = useState(0);
  return (
    <Accordion
      open={open}
      onToggle={setOpen}
      data={[
        {
          header: 'Controlled 1',
          panel: `Panel 1 (controlled, open=${open})`
        },
        {
          header: 'Controlled 2',
          panel: 'Panel 2'
        }
      ]}
    />
  );
};

export const CustomContent = () => (
  <Accordion
    data={[
      {
        header: '<span role="img" aria-label="star">⭐</span> Custom Header',
        panel: '<p>Panel with <b>custom content</b>, icons, and <a href="#">links</a>.</p>'
      },
      {
        header: 'Another Section',
        panel: 'Try tabbing, arrow keys, and toggling.'
      }
    ]}
  />
);
