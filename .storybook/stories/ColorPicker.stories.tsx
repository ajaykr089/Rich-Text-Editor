import React from 'react'
import { Badge, Box, ColorPicker, Grid } from '@editora/ui-react'

export default {
  title: 'UI/ColorPicker'
}

export const InlineWithAlpha = () => {
  const [value, setValue] = React.useState('#2563EBCC')

  return (
    <Box w="min(440px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Inline mode</Badge>
        <ColorPicker
          alpha
          value={value}
          format="hex"
          presets={['#2563eb', '#0ea5e9', '#14b8a6', '#f97316', '#ef4444', '#7c3aed']}
          onValueChange={setValue}
          aria-label="Brand color"
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value}
        </Box>
      </Grid>
    </Box>
  )
}

export const PopoverWithPresetsAndRecent = () => {
  const [value, setValue] = React.useState('rgb(37 99 235 / 0.85)')

  return (
    <Box w="min(520px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="success">Popover mode</Badge>
        <ColorPicker
          mode="popover"
          alpha
          persist
          recent
          maxRecent={10}
          value={value}
          format="rgb"
          presets={['#0f172a', '#111827', '#1d4ed8', '#22c55e', '#f59e0b', '#dc2626', '#a855f7', '#06b6d4']}
          placeholder="Pick a semantic color"
          onValueChange={setValue}
          aria-label="Popover color picker"
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value}
        </Box>
      </Grid>
    </Box>
  )
}

export const Events = () => {
  const [value, setValue] = React.useState('#22C55E')
  const [lastEvent, setLastEvent] = React.useState('No events yet')

  return (
    <Box w="min(620px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="warning">Input / change / invalid events</Badge>
        <ColorPicker
          alpha
          mode="popover"
          value={value}
          onInput={(detail) => setLastEvent(`input:${detail.source} -> ${detail.value}`)}
          onChange={(detail) => {
            setValue(detail.value)
            setLastEvent(`change:${detail.source} -> ${detail.value}`)
          }}
          onInvalid={(detail) => setLastEvent(`invalid:${detail.reason} (${detail.raw})`)}
          aria-label="Events color picker"
        />
        <Box bg="surface" p="10px" radius="lg">
          Last event: {lastEvent}
        </Box>
      </Grid>
    </Box>
  )
}
