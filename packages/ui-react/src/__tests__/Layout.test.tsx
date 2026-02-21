import React from 'react';
import { render } from '@testing-library/react';
import { Box, Flex, Grid, Section, Container } from '../components';

describe('React layout wrappers', () => {
  it('Box renders ui-box and forwards attributes', () => {
    const { container } = render(<Box p="12px">Hello</Box>);
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('p')).toBe('12px');
  });

  it('Box supports shorthand props (bg, color, w, h) and forwards to ui-box', () => {
    const { container } = render(<Box bg="tomato" color="white" w="100%" h="48px">x</Box>);
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('bg')).toBe('tomato');
    expect(el?.getAttribute('color')).toBe('white');
    // ui-box should apply inline styles for single-value shorthand props
    expect(el?.style.background).toBe('tomato');
    expect(el?.style.color).toBe('white');
    expect(el?.style.width).toBe('100%');
    expect(el?.style.height).toBe('48px');
    expect(el?.style.alignItems).toBe('');
  });

  it('Box accepts explicit align prop and responsive align', () => {
    const { container } = render(<Box align="flex-start">x</Box>);
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('align')).toBe('flex-start');
    expect(el?.style.alignItems).toBe('flex-start');

    const { container: c2 } = render(<Box align={{ initial: 'flex-start', md: 'center' }} />);
    const el2 = c2.querySelector('ui-box');
    expect(el2?.getAttribute('align')).toContain('\"initial\"');
    const style = el2?.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('align-items: flex-start;');
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
  });

  it('Box accepts responsive props and serializes them to host attributes', () => {
    const { container } = render(<Box p={{ initial: '4px', sm: '8px', md: '12px' }} />);
    const el = container.querySelector('ui-box');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('p')).toContain('\"initial\"');
    const style = el?.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-sm)');
  });

  it('Box accepts responsive shorthand props and injects component-scoped CSS', () => {
    const { container } = render(<Box bg={{ initial: 'red', md: 'blue' }} />);
    const el = container.querySelector('ui-box');
    expect(el?.getAttribute('bg')).toContain('\"md\"');
    const style = el?.shadowRoot?.querySelector('style');
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('background:');
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
  });

  it('Flex and Grid accept responsive props and inject scoped CSS in each component', () => {
    const { container } = render(
      <div>
        <Flex gap={{ initial: '4px', md: '24px' }} direction={{ initial: 'row', md: 'column' }} />
        <Grid columns={{ initial: '1fr', md: 'repeat(3, 1fr)' }} gap={{ initial: '8px', md: '16px' }} />
      </div>
    );

    const flex = container.querySelector('ui-flex');
    expect(flex).toBeTruthy();
    expect(flex?.getAttribute('gap')).toContain('\"initial\"');
    const grid = container.querySelector('ui-grid');
    expect(grid).toBeTruthy();
    expect(grid?.getAttribute('columns')).toContain('\"md\"');

    const styleForFlex = flex?.shadowRoot?.querySelector('style');
    const styleForGrid = grid?.shadowRoot?.querySelector('style');
    expect(styleForFlex).toBeTruthy();
    expect(styleForFlex?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
    expect(styleForGrid).toBeTruthy();
    expect(styleForGrid?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
  });

  it('Flex renders ui-flex', () => {
    const { container } = render(<Flex direction="column">x</Flex>);
    expect(container.querySelector('ui-flex')).toBeTruthy();
  });

  it('Grid renders ui-grid', () => {
    const { container } = render(<Grid columns="1fr 1fr">x</Grid>);
    expect(container.querySelector('ui-grid')).toBeTruthy();
  });

  it('Section and Container render their hosts', () => {
    const { container } = render(<Section size="small"><Container size="sm">c</Container></Section>);
    expect(container.querySelector('ui-section')).toBeTruthy();
    expect(container.querySelector('ui-container')).toBeTruthy();
  });
});
