import React from 'react';
import {
  Badge,
  Box,
  DatePicker,
  DateRangePicker,
  DateRangeTimePicker,
  DateTimePicker,
  Grid,
  TimePicker
} from '@editora/ui-react';

export default {
  title: 'UI/Date Time Pickers'
};

function useForcedMobileSheet(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const original = window.matchMedia;
    const forced = ((query: string) => {
      if (query.includes('(max-width: 639px)')) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          }
        } as MediaQueryList;
      }
      return original.call(window, query);
    }) as typeof window.matchMedia;

    window.matchMedia = forced;
    return () => {
      window.matchMedia = original;
    };
  }, [enabled]);
}

export const SingleDate = () => {
  const [value, setValue] = React.useState<string | null>('2026-02-23');

  return (
    <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Single date picker</Badge>
        <DatePicker
          label="Admission date"
          hint="Accepts ISO and locale-like input."
          value={value || undefined}
          min="2026-01-01"
          max="2026-12-31"
          onValueChange={(next) => setValue(next)}
          clearable
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateRange = () => {
  const [value, setValue] = React.useState('{"start":"2026-02-10","end":"2026-02-18"}');

  return (
    <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="success">Date range picker</Badge>
        <DateRangePicker
          label="Billing cycle"
          hint="Choose a range for reports."
          value={value}
          rangeVariant="two-fields"
          closeOnSelect={false}
          onValueChange={(next) => setValue(next || '')}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const TimeOnly = () => {
  const [value, setValue] = React.useState<string | null>('09:30');

  return (
    <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="warning">Time picker</Badge>
        <TimePicker
          label="Shift start"
          hint="Arrow up/down steps by configured minutes."
          value={value || undefined}
          format="24h"
          step={5}
          min="06:00"
          max="23:00"
          onValueChange={(next) => setValue(next)}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateTime = () => {
  const [value, setValue] = React.useState<string | null>('2026-02-23T09:30');

  return (
    <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Date-time picker</Badge>
        <DateTimePicker
          label="Procedure schedule"
          value={value || undefined}
          step={10}
          min="2026-02-01T08:00"
          max="2026-03-15T20:00"
          onValueChange={(next) => setValue(next)}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateRangeTime = () => {
  const [value, setValue] = React.useState(
    '{"start":"2026-02-23T09:00","end":"2026-02-23T12:30"}'
  );

  return (
    <Box w="min(860px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="danger">Range date-time picker</Badge>
        <DateRangeTimePicker
          label="Operating room slot"
          hint="Complete range with date and time."
          value={value}
          step={15}
          autoNormalize
          allowPartial={false}
          min="2026-02-01T06:00"
          max="2026-12-31T23:00"
          onValueChange={(next) => setValue(next || '')}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const MobileSheetBehavior = () => {
  useForcedMobileSheet(true);
  const [value, setValue] = React.useState<string | null>('2026-02-23');

  return (
    <Box w="360px" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Forced mobile sheet preview</Badge>
        <DatePicker
          label="Mobile sheet date picker"
          value={value || undefined}
          onValueChange={(next) => setValue(next)}
          closeOnSelect={false}
          hint="This story forces mobile media query to validate bottom-sheet spacing."
        />
        <DateRangePicker
          label="Mobile range picker"
          value='{"start":"2026-02-20","end":"2026-02-24"}'
          closeOnSelect={false}
          hint="Check footer actions and scroll-lock behavior."
        />
      </Grid>
    </Box>
  );
};
