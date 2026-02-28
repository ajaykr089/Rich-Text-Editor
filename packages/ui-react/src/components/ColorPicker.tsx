import React, { useEffect, useImperativeHandle, useRef } from 'react'

export type ColorPickerColor = {
  r: number
  g: number
  b: number
  a: number
}

export type ColorPickerHsla = {
  h: number
  s: number
  l: number
  a: number
}

export type ColorPickerDetail = {
  value: string
  hex: string
  rgba: ColorPickerColor
  hsla: ColorPickerHsla
  source: 'drag' | 'slider' | 'text' | 'preset' | 'recent' | 'eyedropper'
}

export type ColorPickerElement = HTMLElement & {
  setColor: (value: string) => void
  getColor: () => { hex: string; rgba: ColorPickerColor; hsva: { h: number; s: number; v: number; a: number } }
  openPopover: () => void
  closePopover: () => void
}

export type ColorPickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  value?: string
  format?: 'hex' | 'rgb' | 'hsl'
  alpha?: boolean
  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'contrast'
  mode?: 'inline' | 'popover'
  open?: boolean
  placeholder?: string
  presets?: string[]
  recent?: boolean
  maxRecent?: number
  persist?: boolean
  onInput?: (detail: ColorPickerDetail) => void
  onChange?: (detail: ColorPickerDetail) => void
  onValueChange?: (value: string) => void
  onOpen?: () => void
  onClose?: () => void
  onInvalid?: (detail: { raw: string; reason: string }) => void
}

export const ColorPicker = React.forwardRef<ColorPickerElement, ColorPickerProps>(function ColorPicker(
  {
    value,
    format,
    alpha,
    disabled,
    readOnly,
    size,
    variant,
    mode,
    open,
    placeholder,
    presets,
    recent,
    maxRecent,
    persist,
    onInput,
    onChange,
    onValueChange,
    onOpen,
    onClose,
    onInvalid,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<ColorPickerElement | null>(null)
  useImperativeHandle(forwardedRef, () => ref.current as ColorPickerElement)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleInput = (event: Event) => {
      const detail = (event as CustomEvent<ColorPickerDetail>).detail
      if (!detail) return
      onInput?.(detail)
    }

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<ColorPickerDetail>).detail
      if (!detail) return
      onChange?.(detail)
      onValueChange?.(detail.value)
    }

    const handleInvalid = (event: Event) => {
      const detail = (event as CustomEvent<{ raw: string; reason: string }>).detail
      if (!detail) return
      onInvalid?.(detail)
    }

    el.addEventListener('input', handleInput as EventListener)
    el.addEventListener('change', handleChange as EventListener)
    el.addEventListener('open', onOpen as EventListener)
    el.addEventListener('close', onClose as EventListener)
    el.addEventListener('invalid', handleInvalid as EventListener)

    return () => {
      el.removeEventListener('input', handleInput as EventListener)
      el.removeEventListener('change', handleChange as EventListener)
      el.removeEventListener('open', onOpen as EventListener)
      el.removeEventListener('close', onClose as EventListener)
      el.removeEventListener('invalid', handleInvalid as EventListener)
    }
  }, [onInput, onChange, onValueChange, onOpen, onClose, onInvalid])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name)
      if (next == null) {
        if (current != null) el.removeAttribute(name)
      } else if (current !== next) {
        el.setAttribute(name, next)
      }
    }

    const syncBool = (name: string, next: boolean | undefined) => {
      if (next) syncAttr(name, '')
      else syncAttr(name, null)
    }

    syncAttr('value', value ?? null)
    syncAttr('format', format && format !== 'hex' ? format : null)
    syncBool('alpha', alpha)
    syncBool('disabled', disabled)
    syncBool('readonly', readOnly)
    syncAttr('size', size && size !== 'md' ? size : null)
    syncAttr('variant', variant && variant !== 'default' ? variant : null)
    syncAttr('mode', mode && mode !== 'inline' ? mode : null)
    if (typeof open === 'boolean') syncBool('open', open)
    else syncAttr('open', null)
    syncAttr('placeholder', placeholder ?? null)
    syncBool('recent', recent)
    syncAttr('max-recent', typeof maxRecent === 'number' ? String(maxRecent) : null)
    syncBool('persist', persist)

    if (presets && presets.length > 0) {
      try {
        syncAttr('presets', JSON.stringify(presets))
      } catch {
        syncAttr('presets', null)
      }
    } else {
      syncAttr('presets', null)
    }
  }, [value, format, alpha, disabled, readOnly, size, variant, mode, open, placeholder, presets, recent, maxRecent, persist])

  const initialAttrs: Record<string, unknown> = { ref, ...rest }
  if (mode && mode !== 'inline') initialAttrs.mode = mode
  if (typeof open === 'boolean' && open) initialAttrs.open = ''
  if (value != null) initialAttrs.value = value
  if (format && format !== 'hex') initialAttrs.format = format
  if (alpha) initialAttrs.alpha = ''
  if (disabled) initialAttrs.disabled = ''
  if (readOnly) initialAttrs.readonly = ''
  if (size && size !== 'md') initialAttrs.size = size
  if (variant && variant !== 'default') initialAttrs.variant = variant
  if (placeholder) initialAttrs.placeholder = placeholder
  if (recent) initialAttrs.recent = ''
  if (typeof maxRecent === 'number') initialAttrs['max-recent'] = String(maxRecent)
  if (persist) initialAttrs.persist = ''
  if (presets && presets.length > 0) {
    try {
      initialAttrs.presets = JSON.stringify(presets)
    } catch {
      // ignore invalid presets serialization
    }
  }

  return React.createElement('ui-color-picker', initialAttrs, children)
})

ColorPicker.displayName = 'ColorPicker'

export default ColorPicker
