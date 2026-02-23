export type RGBA = { r: number; g: number; b: number; a: number }
export type HSVA = { h: number; s: number; v: number; a: number }
export type HSLA = { h: number; s: number; l: number; a: number }

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function round(value: number, decimals = 3): number {
  const power = 10 ** decimals
  return Math.round(value * power) / power
}

function toByte(value: number): number {
  return clamp(Math.round(value), 0, 255)
}

function parseAlpha(raw: string): number | null {
  const value = raw.trim()
  if (!value) return null
  if (value.endsWith('%')) {
    const num = Number(value.slice(0, -1))
    if (!Number.isFinite(num)) return null
    return clamp(num / 100, 0, 1)
  }
  const num = Number(value)
  if (!Number.isFinite(num)) return null
  return clamp(num, 0, 1)
}

function parseRgbChannel(raw: string): number | null {
  const value = raw.trim()
  if (!value) return null
  if (value.endsWith('%')) {
    const num = Number(value.slice(0, -1))
    if (!Number.isFinite(num)) return null
    return toByte((clamp(num, 0, 100) / 100) * 255)
  }
  const num = Number(value)
  if (!Number.isFinite(num)) return null
  return toByte(num)
}

function parsePercent(raw: string): number | null {
  const value = raw.trim()
  if (!value.endsWith('%')) return null
  const num = Number(value.slice(0, -1))
  if (!Number.isFinite(num)) return null
  return clamp(num, 0, 100)
}

function parseHue(raw: string): number | null {
  const value = raw.trim().toLowerCase()
  if (!value) return null
  if (value.endsWith('deg')) {
    const num = Number(value.slice(0, -3))
    if (!Number.isFinite(num)) return null
    return normalizeHue(num)
  }
  if (value.endsWith('turn')) {
    const num = Number(value.slice(0, -4))
    if (!Number.isFinite(num)) return null
    return normalizeHue(num * 360)
  }
  if (value.endsWith('rad')) {
    const num = Number(value.slice(0, -3))
    if (!Number.isFinite(num)) return null
    return normalizeHue((num * 180) / Math.PI)
  }
  const num = Number(value)
  if (!Number.isFinite(num)) return null
  return normalizeHue(num)
}

function normalizeHue(value: number): number {
  const mod = value % 360
  return mod < 0 ? mod + 360 : mod
}

function splitFuncArgs(raw: string): { channels: string[]; alpha: string | null } | null {
  const body = raw.trim()
  if (!body) return null
  if (body.includes('/')) {
    const [left, right] = body.split('/')
    if (right == null) return null
    const channels = left.includes(',') ? left.split(',') : left.trim().split(/\s+/)
    if (channels.length < 3) return null
    return {
      channels: channels.map((item) => item.trim()).filter(Boolean),
      alpha: right.trim()
    }
  }

  if (body.includes(',')) {
    const values = body.split(',').map((item) => item.trim()).filter(Boolean)
    if (values.length < 3) return null
    return {
      channels: values.slice(0, 3),
      alpha: values[3] ?? null
    }
  }

  const values = body.split(/\s+/).map((item) => item.trim()).filter(Boolean)
  if (values.length < 3) return null
  return {
    channels: values.slice(0, 3),
    alpha: values[3] ?? null
  }
}

function parseHex(raw: string): RGBA | null {
  const value = raw.trim().replace(/^#/, '')
  if (![3, 4, 6, 8].includes(value.length)) return null
  if (!/^[0-9a-f]+$/i.test(value)) return null

  if (value.length === 3 || value.length === 4) {
    const r = parseInt(value[0] + value[0], 16)
    const g = parseInt(value[1] + value[1], 16)
    const b = parseInt(value[2] + value[2], 16)
    const a = value.length === 4 ? parseInt(value[3] + value[3], 16) / 255 : 1
    return normalizeRgba({ r, g, b, a })
  }

  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  const a = value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1
  return normalizeRgba({ r, g, b, a })
}

function parseRgb(raw: string): RGBA | null {
  const match = /^rgba?\((.+)\)$/i.exec(raw.trim())
  if (!match) return null
  const split = splitFuncArgs(match[1])
  if (!split || split.channels.length < 3) return null
  const r = parseRgbChannel(split.channels[0])
  const g = parseRgbChannel(split.channels[1])
  const b = parseRgbChannel(split.channels[2])
  if (r == null || g == null || b == null) return null
  const a = split.alpha != null ? parseAlpha(split.alpha) : 1
  if (a == null) return null
  return normalizeRgba({ r, g, b, a })
}

function parseHsl(raw: string): RGBA | null {
  const match = /^hsla?\((.+)\)$/i.exec(raw.trim())
  if (!match) return null
  const split = splitFuncArgs(match[1])
  if (!split || split.channels.length < 3) return null
  const h = parseHue(split.channels[0])
  const s = parsePercent(split.channels[1])
  const l = parsePercent(split.channels[2])
  if (h == null || s == null || l == null) return null
  const a = split.alpha != null ? parseAlpha(split.alpha) : 1
  if (a == null) return null
  return hslaToRgba({ h, s, l, a })
}

export function normalizeRgba(value: RGBA): RGBA {
  return {
    r: toByte(value.r),
    g: toByte(value.g),
    b: toByte(value.b),
    a: round(clamp(value.a, 0, 1), 4)
  }
}

export function parseColor(raw: string): RGBA | null {
  const value = (raw || '').trim()
  if (!value) return null
  if (value.startsWith('#')) return parseHex(value)
  if (/^rgba?\(/i.test(value)) return parseRgb(value)
  if (/^hsla?\(/i.test(value)) return parseHsl(value)
  return null
}

export function rgbaToHex(rgba: RGBA, includeAlpha = false): string {
  const normalized = normalizeRgba(rgba)
  const toHex = (channel: number) => channel.toString(16).padStart(2, '0')
  const base = `#${toHex(normalized.r)}${toHex(normalized.g)}${toHex(normalized.b)}`
  if (!includeAlpha) return base
  return `${base}${toHex(Math.round(normalized.a * 255))}`
}

export function rgbaToCss(rgba: RGBA, includeAlpha = true): string {
  const normalized = normalizeRgba(rgba)
  if (!includeAlpha || normalized.a >= 1) {
    return `rgb(${normalized.r} ${normalized.g} ${normalized.b})`
  }
  return `rgb(${normalized.r} ${normalized.g} ${normalized.b} / ${round(normalized.a, 3)})`
}

export function hslaToCss(hsla: HSLA, includeAlpha = true): string {
  const h = Math.round(normalizeHue(hsla.h))
  const s = Math.round(clamp(hsla.s, 0, 100))
  const l = Math.round(clamp(hsla.l, 0, 100))
  const a = round(clamp(hsla.a, 0, 1), 3)
  if (!includeAlpha || a >= 1) return `hsl(${h} ${s}% ${l}%)`
  return `hsl(${h} ${s}% ${l}% / ${a})`
}

export function rgbaToHsva(rgba: RGBA): HSVA {
  const c = normalizeRgba(rgba)
  const r = c.r / 255
  const g = c.g / 255
  const b = c.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : (delta / max) * 100
  const v = max * 100

  return {
    h: round(h, 3),
    s: round(s, 3),
    v: round(v, 3),
    a: c.a
  }
}

export function hsvaToRgba(hsva: HSVA): RGBA {
  const h = normalizeHue(hsva.h)
  const s = clamp(hsva.s, 0, 100) / 100
  const v = clamp(hsva.v, 0, 100) / 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let rPrime = 0
  let gPrime = 0
  let bPrime = 0

  if (h < 60) {
    rPrime = c
    gPrime = x
  } else if (h < 120) {
    rPrime = x
    gPrime = c
  } else if (h < 180) {
    gPrime = c
    bPrime = x
  } else if (h < 240) {
    gPrime = x
    bPrime = c
  } else if (h < 300) {
    rPrime = x
    bPrime = c
  } else {
    rPrime = c
    bPrime = x
  }

  return normalizeRgba({
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
    a: hsva.a
  })
}

export function rgbaToHsla(rgba: RGBA): HSLA {
  const c = normalizeRgba(rgba)
  const r = c.r / 255
  const g = c.g / 255
  const b = c.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  return {
    h: round(h, 3),
    s: round(s * 100, 3),
    l: round(l * 100, 3),
    a: c.a
  }
}

export function hslaToRgba(hsla: HSLA): RGBA {
  const h = normalizeHue(hsla.h)
  const s = clamp(hsla.s, 0, 100) / 100
  const l = clamp(hsla.l, 0, 100) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let rPrime = 0
  let gPrime = 0
  let bPrime = 0

  if (h < 60) {
    rPrime = c
    gPrime = x
  } else if (h < 120) {
    rPrime = x
    gPrime = c
  } else if (h < 180) {
    gPrime = c
    bPrime = x
  } else if (h < 240) {
    gPrime = x
    bPrime = c
  } else if (h < 300) {
    rPrime = x
    bPrime = c
  } else {
    rPrime = c
    bPrime = x
  }

  return normalizeRgba({
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
    a: hsla.a
  })
}

export function formatHexDisplay(rgba: RGBA, withAlpha: boolean): string {
  return rgbaToHex(rgba, withAlpha).toUpperCase()
}

export function formatRgbDisplay(rgba: RGBA, withAlpha: boolean): string {
  return rgbaToCss(rgba, withAlpha)
}

export function formatHslDisplay(rgba: RGBA, withAlpha: boolean): string {
  return hslaToCss(rgbaToHsla(rgba), withAlpha)
}
