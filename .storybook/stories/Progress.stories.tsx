import React, { useEffect, useRef, useState } from 'react';
import { Progress, Button } from '@editora/ui-react';

export default {
  title: 'UI/Progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 200, step: 1 } }
  }
};

export const Controlled = (args: any) => {
  const [value, setValue] = useState(Number(args.value) || 20);
  const max = Number(args.max) || 100;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleComplete = () => {
      setTimeout(() => setValue(0), 500);
    };
    el.addEventListener('complete', handleComplete as EventListener);
    return () => el.removeEventListener('complete', handleComplete as EventListener);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 10))}>-10</Button>
        <Button size="sm" onClick={() => setValue((v) => Math.min(max, v + 10))}>+10</Button>
      </div>
      <Progress ref={ref as any} value={String(value)} max={String(max)} />
      <div style={{ fontSize: 13, color: '#475569' }}>{value}/{max}</div>
    </div>
  );
};
Controlled.args = { value: 20, max: 100 };

export const Indeterminate = () => <Progress indeterminate />;
