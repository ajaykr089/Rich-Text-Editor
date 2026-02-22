import type { IconDefinition, IconNode } from './types';

function node(tag: IconNode['tag'], attrs?: IconNode['attrs'], children?: IconNode['children']): IconNode {
  return children ? { tag, attrs, children } : { tag, attrs };
}

function p(d: string, attrs?: IconNode['attrs']): IconNode {
  return node('path', { d, ...attrs });
}

function l(x1: number, y1: number, x2: number, y2: number, attrs?: IconNode['attrs']): IconNode {
  return node('line', { x1, y1, x2, y2, ...attrs });
}

function c(cx: number, cy: number, r: number, attrs?: IconNode['attrs']): IconNode {
  return node('circle', { cx, cy, r, ...attrs });
}

function r(x: number, y: number, width: number, height: number, attrs?: IconNode['attrs']): IconNode {
  return node('rect', { x, y, width, height, ...attrs });
}

function polyline(points: string, attrs?: IconNode['attrs']): IconNode {
  return node('polyline', { points, ...attrs });
}

function polygon(points: string, attrs?: IconNode['attrs']): IconNode {
  return node('polygon', { points, ...attrs });
}

function icon(
  name: string,
  outline: IconNode[],
  options?: {
    solid?: IconNode[];
    duotone?: IconNode[];
    aliases?: string[];
    rtlMirror?: boolean;
    tags?: string[];
    categories?: string[];
  }
): IconDefinition {
  return {
    name,
    aliases: options?.aliases,
    rtlMirror: options?.rtlMirror,
    tags: options?.tags,
    categories: options?.categories,
    variants: {
      outline: { nodes: outline },
      solid: options?.solid ? { nodes: options.solid } : undefined,
      duotone: options?.duotone ? { nodes: options.duotone } : undefined
    }
  };
}

const commonTags = {
  navigation: ['navigation', 'arrow'],
  actions: ['action', 'command'],
  media: ['media'],
  status: ['status'],
  files: ['file'],
  users: ['user']
};

export const iconDefinitions: IconDefinition[] = [
  icon('check', [p('M3.75 7.75 6.5 10.5 11.5 5.5')], {
    solid: [p('M5.93 10.94a.75.75 0 0 1-1.06 0L2.85 8.9a.75.75 0 0 1 1.06-1.06l1.49 1.49 4.7-4.7a.75.75 0 0 1 1.06 1.06z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['tick', 'done']
  }),
  icon('x', [l(4, 4, 11, 11), l(11, 4, 4, 11)], {
    solid: [p('M4.53 3.47a.75.75 0 0 0-1.06 1.06L5.94 7 3.47 9.47a.75.75 0 1 0 1.06 1.06L7 8.06l2.47 2.47a.75.75 0 1 0 1.06-1.06L8.06 7l2.47-2.47a.75.75 0 1 0-1.06-1.06L7 5.94z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['close', 'cancel']
  }),
  icon('plus', [l(7.5, 3, 7.5, 12), l(3, 7.5, 12, 7.5)], {
    aliases: ['add', 'create']
  }),
  icon('minus', [l(3, 7.5, 12, 7.5)], { aliases: ['remove', 'subtract'] }),
  icon('dot', [c(7.5, 7.5, 1.4, { fill: 'currentColor', stroke: 'none' })]),
  icon('circle', [c(7.5, 7.5, 4.5)], {
    solid: [c(7.5, 7.5, 4.5, { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('square', [r(3.5, 3.5, 8, 8, { rx: 1.2 })], {
    solid: [r(3.25, 3.25, 8.5, 8.5, { rx: 1.25, fill: 'currentColor', stroke: 'none' })]
  }),
  icon('diamond', [polygon('7.5,2.8 12.2,7.5 7.5,12.2 2.8,7.5')], {
    solid: [polygon('7.5,2.4 12.6,7.5 7.5,12.6 2.4,7.5', { fill: 'currentColor', stroke: 'none' })]
  }),

  icon('chevron-down', [polyline('4.25 6 7.5 9.25 10.75 6')], { aliases: ['down'], rtlMirror: false, tags: commonTags.navigation }),
  icon('chevron-up', [polyline('4.25 9 7.5 5.75 10.75 9')], { aliases: ['up'], tags: commonTags.navigation }),
  icon('chevron-left', [polyline('9 4.25 5.75 7.5 9 10.75')], { aliases: ['left'], rtlMirror: true, tags: commonTags.navigation }),
  icon('chevron-right', [polyline('6 4.25 9.25 7.5 6 10.75')], { aliases: ['right'], rtlMirror: true, tags: commonTags.navigation }),
  icon('chevrons-down', [polyline('4.25 4.75 7.5 8 10.75 4.75'), polyline('4.25 8 7.5 11.25 10.75 8')], { tags: commonTags.navigation }),
  icon('chevrons-up', [polyline('4.25 10.25 7.5 7 10.75 10.25'), polyline('4.25 7 7.5 3.75 10.75 7')], { tags: commonTags.navigation }),
  icon('chevrons-left', [polyline('10.25 4.25 7 7.5 10.25 10.75'), polyline('7 4.25 3.75 7.5 7 10.75')], { rtlMirror: true, tags: commonTags.navigation }),
  icon('chevrons-right', [polyline('4.75 4.25 8 7.5 4.75 10.75'), polyline('8 4.25 11.25 7.5 8 10.75')], { rtlMirror: true, tags: commonTags.navigation }),

  icon('caret-down', [polygon('4.5 6 10.5 6 7.5 10', { fill: 'currentColor', stroke: 'none' })]),
  icon('caret-up', [polygon('4.5 9 10.5 9 7.5 5', { fill: 'currentColor', stroke: 'none' })]),
  icon('caret-left', [polygon('9 4.5 9 10.5 5 7.5', { fill: 'currentColor', stroke: 'none' })], { rtlMirror: true }),
  icon('caret-right', [polygon('6 4.5 6 10.5 10 7.5', { fill: 'currentColor', stroke: 'none' })], { rtlMirror: true }),

  icon('arrow-up', [l(7.5, 11.5, 7.5, 3.5), polyline('4.5 6.5 7.5 3.5 10.5 6.5')], { tags: commonTags.navigation }),
  icon('arrow-down', [l(7.5, 3.5, 7.5, 11.5), polyline('4.5 8.5 7.5 11.5 10.5 8.5')], { tags: commonTags.navigation }),
  icon('arrow-left', [l(11.5, 7.5, 3.5, 7.5), polyline('6.5 4.5 3.5 7.5 6.5 10.5')], { rtlMirror: true, tags: commonTags.navigation }),
  icon('arrow-right', [l(3.5, 7.5, 11.5, 7.5), polyline('8.5 4.5 11.5 7.5 8.5 10.5')], { rtlMirror: true, tags: commonTags.navigation }),
  icon('arrow-up-right', [l(4, 11, 11, 4), polyline('7.5 4 11 4 11 7.5')], { tags: commonTags.navigation }),
  icon('arrow-up-left', [l(11, 11, 4, 4), polyline('7.5 4 4 4 4 7.5')], { rtlMirror: true, tags: commonTags.navigation }),
  icon('arrow-down-right', [l(4, 4, 11, 11), polyline('7.5 11 11 11 11 7.5')], { tags: commonTags.navigation }),
  icon('arrow-down-left', [l(11, 4, 4, 11), polyline('7.5 11 4 11 4 7.5')], { rtlMirror: true, tags: commonTags.navigation }),
  icon('external-link', [r(3.25, 5.5, 6.25, 6.25, { rx: 1 }), l(7.25, 3.25, 11.75, 3.25), l(11.75, 3.25, 11.75, 7.75), l(11.75, 3.25, 7.75, 7.25)], { aliases: ['open-in-new'] }),

  icon('menu', [l(3, 4.5, 12, 4.5), l(3, 7.5, 12, 7.5), l(3, 10.5, 12, 10.5)], { aliases: ['hamburger'] }),
  icon('more-horizontal', [c(4.25, 7.5, 1), c(7.5, 7.5, 1), c(10.75, 7.5, 1)], { aliases: ['ellipsis-horizontal'] }),
  icon('more-vertical', [c(7.5, 4.25, 1), c(7.5, 7.5, 1), c(7.5, 10.75, 1)], { aliases: ['ellipsis-vertical'] }),

  icon('search', [c(6.5, 6.5, 3.75), l(9.5, 9.5, 12, 12)], { aliases: ['magnifier'] }),
  icon('filter', [polygon('2.75,3.5 12.25,3.5 8.75,7.5 8.75,11.5 6.25,10.25 6.25,7.5')], {
    solid: [polygon('2.2,3 12.8,3 8.9,7.5 8.9,12 6.1,10.55 6.1,7.5', { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('sliders', [l(3, 4, 12, 4), c(6, 4, 1.1, { fill: 'currentColor', stroke: 'none' }), l(3, 7.5, 12, 7.5), c(9.5, 7.5, 1.1, { fill: 'currentColor', stroke: 'none' }), l(3, 11, 12, 11), c(5, 11, 1.1, { fill: 'currentColor', stroke: 'none' })]),
  icon('settings', [c(7.5, 7.5, 2.1), l(7.5, 2.8, 7.5, 4.1), l(7.5, 10.9, 7.5, 12.2), l(2.8, 7.5, 4.1, 7.5), l(10.9, 7.5, 12.2, 7.5), l(4.15, 4.15, 5.05, 5.05), l(9.95, 9.95, 10.85, 10.85), l(10.85, 4.15, 9.95, 5.05), l(5.05, 9.95, 4.15, 10.85)], { aliases: ['cog'] }),

  icon('home', [p('M2.75 6.75 7.5 3.25 12.25 6.75'), p('M4.25 6.5v5h6.5v-5'), r(6.4, 8.1, 2.2, 3.4, { rx: 0.55 })], {
    solid: [p('M2.2 6.6 7.5 2.65 12.8 6.6v5.65a1 1 0 0 1-1 1h-2.1V9.4H5.3v3.85H3.2a1 1 0 0 1-1-1z', { fill: 'currentColor', stroke: 'none' })],
    categories: ['navigation']
  }),
  icon('dashboard', [r(2.75, 2.75, 4.2, 4.2, { rx: 0.8 }), r(8.05, 2.75, 4.2, 2.9, { rx: 0.8 }), r(8.05, 6.85, 4.2, 5.4, { rx: 0.8 }), r(2.75, 8.15, 4.2, 4.1, { rx: 0.8 })], { aliases: ['layout-dashboard'], categories: ['navigation'] }),
  icon('app-grid', [r(3, 3, 2.4, 2.4, { rx: 0.4 }), r(6.3, 3, 2.4, 2.4, { rx: 0.4 }), r(9.6, 3, 2.4, 2.4, { rx: 0.4 }), r(3, 6.3, 2.4, 2.4, { rx: 0.4 }), r(6.3, 6.3, 2.4, 2.4, { rx: 0.4 }), r(9.6, 6.3, 2.4, 2.4, { rx: 0.4 }), r(3, 9.6, 2.4, 2.4, { rx: 0.4 }), r(6.3, 9.6, 2.4, 2.4, { rx: 0.4 }), r(9.6, 9.6, 2.4, 2.4, { rx: 0.4 })], { aliases: ['grid'] }),

  icon('folder', [p('M2.5 5.3a1.3 1.3 0 0 1 1.3-1.3h2.4l1.05 1.2h3.75a1.3 1.3 0 0 1 1.3 1.3v4.7a1.3 1.3 0 0 1-1.3 1.3H3.8a1.3 1.3 0 0 1-1.3-1.3z')], {
    solid: [p('M2 5.35A1.85 1.85 0 0 1 3.85 3.5h2.2l1.05 1.2h4.05A1.85 1.85 0 0 1 13 6.55v4.6A1.85 1.85 0 0 1 11.15 13H3.85A1.85 1.85 0 0 1 2 11.15z', { fill: 'currentColor', stroke: 'none' })],
    categories: commonTags.files
  }),
  icon('folder-open', [p('M2.6 5.5a1.3 1.3 0 0 1 1.3-1.3h2.25l1.05 1.1h3.9a1.25 1.25 0 0 1 1.23 1.5l-.68 3.75a1.3 1.3 0 0 1-1.28 1.07H3.75a1.3 1.3 0 0 1-1.28-1.55z')], { categories: commonTags.files }),
  icon('file', [p('M4 2.75h4.5l2.5 2.5v6.95a1.3 1.3 0 0 1-1.3 1.3H4.3A1.3 1.3 0 0 1 3 12.2V4.05A1.3 1.3 0 0 1 4.3 2.75z'), p('M8.5 2.9v2.35h2.35')], { categories: commonTags.files }),
  icon('copy', [r(5, 5, 7, 7, { rx: 1 }), r(3, 3, 7, 7, { rx: 1 })], { aliases: ['duplicate'], categories: commonTags.files }),
  icon('clipboard', [r(3.5, 3.5, 8, 9, { rx: 1.2 }), r(5.3, 2.2, 4.4, 2.1, { rx: 0.8 })], { categories: commonTags.files }),
  icon('trash', [p('M3.5 4h8'), p('M5.1 4V3h4.8v1'), p('M4.5 4l.5 7.25h5l.5-7.25'), l(6.3, 6, 6.3, 10), l(8.7, 6, 8.7, 10)], {
    solid: [p('M3.1 4.2h8.8l-.6 7.2a1.4 1.4 0 0 1-1.39 1.28H5.1A1.4 1.4 0 0 1 3.71 11.4zM5.3 2.8h4.4a.75.75 0 0 1 .75.75v.65H4.55v-.65a.75.75 0 0 1 .75-.75', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['delete']
  }),
  icon('edit', [r(2.8, 9.6, 5.1, 2.6, { rx: 0.8 }), p('M5.3 10.9 10.7 5.5l1.8 1.8-5.4 5.4-2.4.6z')], { aliases: ['pen'] }),
  icon('pencil', [p('M4 11.4 10.9 4.5l1.6 1.6-6.9 6.9-2.2.6z'), p('M9.9 3.5 11.5 5.1')], { aliases: ['edit-2'] }),
  icon('link', [p('M5.5 8.9 4.3 10.1a2.25 2.25 0 1 1-3.2-3.2L2.3 5.7a2.25 2.25 0 0 1 3.2 0'), p('M9.5 6.1 10.7 4.9a2.25 2.25 0 0 1 3.2 3.2l-1.2 1.2a2.25 2.25 0 0 1-3.2 0'), l(5.9, 9.1, 9.1, 5.9)], { aliases: ['chain'] }),
  icon('unlink', [p('M5.4 9 4.2 10.2a2.25 2.25 0 1 1-3.18-3.18L2.2 5.8'), p('M9.6 6 10.8 4.8a2.25 2.25 0 1 1 3.18 3.18L12.8 9.2'), l(4.5, 4.5, 10.5, 10.5)], { aliases: ['link-off'] }),

  icon('user', [c(7.5, 5.25, 2.25), p('M3.2 12c.8-1.95 2.4-3 4.3-3s3.5 1.05 4.3 3')], { categories: commonTags.users }),
  icon('users', [c(5.7, 5.3, 2), c(10, 6, 1.65), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), p('M8.45 11.8c.43-1.07 1.24-1.73 2.25-1.73.95 0 1.75.58 2.2 1.55')], { categories: commonTags.users }),
  icon('user-plus', [c(5.5, 5.3, 2), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), l(10.5, 6.2, 10.5, 10.2), l(8.5, 8.2, 12.5, 8.2)], { categories: commonTags.users }),

  icon('bell', [p('M7.5 2.8c-1.7 0-3.05 1.35-3.05 3.05v1.4c0 .68-.23 1.34-.65 1.88l-.8 1.04h8l-.8-1.04a3.05 3.05 0 0 1-.65-1.88v-1.4c0-1.7-1.35-3.05-3.05-3.05z'), p('M6.1 11.2a1.4 1.4 0 0 0 2.8 0')], {
    solid: [p('M7.5 2.5a3.4 3.4 0 0 0-3.4 3.4v1.35c0 .74-.25 1.46-.7 2.05l-.95 1.25h10.1l-.95-1.25c-.45-.59-.7-1.31-.7-2.05V5.9a3.4 3.4 0 0 0-3.4-3.4zm-1.55 9.3a1.55 1.55 0 0 0 3.1 0z', { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('bell-off', [p('M2.6 2.6 12.4 12.4'), p('M4.45 4.45a3 3 0 0 1 5.1 2.15v1.5c0 .59.18 1.17.52 1.65l.68.95H4.2l.68-.95c.34-.48.52-1.06.52-1.65v-3.65'), p('M6.2 11.2a1.35 1.35 0 0 0 2.6 0')]),
  icon('mail', [r(2.5, 3.5, 10, 8, { rx: 1.1 }), polyline('3.2 4.5 7.5 8 11.8 4.5')]),
  icon('phone', [p('M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8')]),
  icon('map-pin', [p('M7.5 12.2s3.6-3.3 3.6-5.7A3.6 3.6 0 0 0 3.9 6.5c0 2.4 3.6 5.7 3.6 5.7z'), c(7.5, 6.45, 1.25)], { aliases: ['pin'] }),
  icon('calendar', [r(2.7, 3.6, 9.6, 8.7, { rx: 1 }), l(5, 2.5, 5, 4.5), l(10, 2.5, 10, 4.5), l(2.7, 5.6, 12.3, 5.6), c(5.25, 8.3, 0.55, { fill: 'currentColor', stroke: 'none' }), c(7.5, 8.3, 0.55, { fill: 'currentColor', stroke: 'none' }), c(9.75, 8.3, 0.55, { fill: 'currentColor', stroke: 'none' })]),
  icon('clock', [c(7.5, 7.5, 4.7), l(7.5, 7.5, 7.5, 5), l(7.5, 7.5, 9.2, 8.7)]),

  icon('chart-bar', [l(3.25, 12, 11.75, 12), r(4, 8, 1.7, 4, { rx: 0.3 }), r(6.65, 6.5, 1.7, 5.5, { rx: 0.3 }), r(9.3, 5, 1.7, 7, { rx: 0.3 })], { categories: ['analytics'] }),
  icon('chart-line', [l(3, 12, 12, 12), polyline('3.5 9.5 5.8 7.6 7.3 8.6 10.8 5.4'), c(3.5, 9.5, 0.45, { fill: 'currentColor', stroke: 'none' }), c(5.8, 7.6, 0.45, { fill: 'currentColor', stroke: 'none' }), c(7.3, 8.6, 0.45, { fill: 'currentColor', stroke: 'none' }), c(10.8, 5.4, 0.45, { fill: 'currentColor', stroke: 'none' })], { categories: ['analytics'] }),
  icon('chart-pie', [c(7.5, 7.5, 4.5), p('M7.5 3v4.5h4.5')], {
    solid: [p('M7.5 2.5a5 5 0 1 0 5 5h-5z', { fill: 'currentColor', stroke: 'none', tone: 'secondary', opacity: 0.35 }), p('M8 2.5v4h4a5 5 0 0 0-4-4z', { fill: 'currentColor', stroke: 'none' })],
    duotone: [c(7.5, 7.5, 4.5, { fill: 'currentColor', stroke: 'none', tone: 'secondary', opacity: 0.3 }), p('M7.5 3v4.5h4.5', { fill: 'none' })],
    categories: ['analytics']
  }),
  icon('activity', [polyline('2.8 8 5 8 6.2 5.2 8.1 10.8 9.6 7.4 12.2 7.4')]),
  icon('trending-up', [polyline('3.5 9.5 6.2 6.8 8.2 8.8 11.5 5.5'), polyline('8.8 5.5 11.5 5.5 11.5 8.2')], { categories: ['analytics'] }),
  icon('trending-down', [polyline('3.5 5.5 6.2 8.2 8.2 6.2 11.5 9.5'), polyline('8.8 9.5 11.5 9.5 11.5 6.8')], { categories: ['analytics'] }),

  icon('star', [p('M7.5 2.6 9.1 5.8l3.6.52-2.6 2.53.62 3.58L7.5 10.8 4.28 12.43l.62-3.58L2.3 6.32l3.6-.52z')], {
    solid: [p('M7.5 2.3 9.37 5.96l4.03.58-2.92 2.84.69 4-3.67-1.93-3.67 1.93.7-4L1.6 6.54l4.03-.58z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['favorite']
  }),
  icon('heart', [p('M7.5 11.9s-4.4-2.8-4.4-5.9A2.6 2.6 0 0 1 7.5 4.5 2.6 2.6 0 0 1 11.9 6c0 3.1-4.4 5.9-4.4 5.9z')], {
    solid: [p('M7.5 12.35s-4.9-3.1-4.9-6.45a3.1 3.1 0 0 1 5.3-2.2A3.1 3.1 0 0 1 12.4 5.9c0 3.35-4.9 6.45-4.9 6.45z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['like']
  }),
  icon('bookmark', [p('M4.2 2.8h6.6a.8.8 0 0 1 .8.8V12l-4.1-2.35L3.4 12V3.6a.8.8 0 0 1 .8-.8z')], {
    solid: [p('M4 2.5h7a1 1 0 0 1 1 1v9.4l-4.5-2.55L3 12.9V3.5a1 1 0 0 1 1-1z', { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('tag', [p('M8.75 3h3.25v3.25l-5.35 5.35a1.1 1.1 0 0 1-1.56 0L3.4 9.9a1.1 1.1 0 0 1 0-1.56z'), c(10.2, 4.8, 0.7, { fill: 'currentColor', stroke: 'none' })]),

  icon('lock', [r(3.5, 6.5, 8, 5.5, { rx: 1 }), p('M5.1 6.5V5.2a2.4 2.4 0 1 1 4.8 0v1.3'), c(7.5, 9.2, 0.8), l(7.5, 9.9, 7.5, 10.8)], {
    solid: [p('M4 6.3h7a1 1 0 0 1 1 1v4.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.3a1 1 0 0 1 1-1zm1.45 0V5.2a2.05 2.05 0 1 1 4.1 0v1.1', { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('unlock', [r(3.5, 6.5, 8, 5.5, { rx: 1 }), p('M9.9 6.5V5.2a2.4 2.4 0 0 0-4.8 0'), c(7.5, 9.2, 0.8), l(7.5, 9.9, 7.5, 10.8)]),
  icon('shield', [p('M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z')], {
    duotone: [p('M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z', { fill: 'currentColor', stroke: 'none', tone: 'secondary', opacity: 0.3 }), p('M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z')]
  }),

  icon('info', [c(7.5, 7.5, 4.75), l(7.5, 6.9, 7.5, 10), c(7.5, 4.9, 0.55, { fill: 'currentColor', stroke: 'none' })], { categories: commonTags.status }),
  icon('alert-triangle', [polygon('7.5,2.6 12.7,11.8 2.3,11.8'), l(7.5, 6, 7.5, 8.7), c(7.5, 10.3, 0.55, { fill: 'currentColor', stroke: 'none' })], { aliases: ['warning'], categories: commonTags.status }),
  icon('alert-circle', [c(7.5, 7.5, 4.75), l(7.5, 5.4, 7.5, 8.4), c(7.5, 10.2, 0.55, { fill: 'currentColor', stroke: 'none' })], { aliases: ['error'], categories: commonTags.status }),
  icon('help-circle', [c(7.5, 7.5, 4.75), p('M6.35 6.1a1.15 1.15 0 1 1 2.3.05c0 .95-1.15 1.05-1.15 2.05'), c(7.5, 10.45, 0.55, { fill: 'currentColor', stroke: 'none' })], { aliases: ['question'], categories: commonTags.status }),
  icon('check-circle', [c(7.5, 7.5, 4.75), p('M5.4 7.55 6.9 9.05 9.85 6.1')], { categories: commonTags.status }),
  icon('x-circle', [c(7.5, 7.5, 4.75), l(5.6, 5.6, 9.4, 9.4), l(9.4, 5.6, 5.6, 9.4)], { categories: commonTags.status }),

  icon('eye', [p('M1.9 7.5c1.2-2.25 3.35-3.75 5.6-3.75s4.4 1.5 5.6 3.75c-1.2 2.25-3.35 3.75-5.6 3.75S3.1 9.75 1.9 7.5z'), c(7.5, 7.5, 1.6)]),
  icon('eye-off', [
    l(2.4, 2.4, 12.6, 12.6),
    p('M3.2 4.85C2.5 5.54 1.9 6.43 1.55 7.5c1.2 2.25 3.35 3.75 5.95 3.75 1.02 0 1.98-.23 2.85-.65'),
    p('M6.1 3.95c.45-.13.91-.2 1.4-.2 2.25 0 4.4 1.5 5.6 3.75-.3.56-.66 1.08-1.06 1.54'),
    p('M6.2 6.2a1.85 1.85 0 0 0 2.6 2.6')
  ]),
  icon('camera', [r(2.6, 4.2, 9.8, 7.2, { rx: 1.2 }), r(5.2, 2.9, 2.5, 1.3, { rx: 0.5 }), c(7.5, 7.8, 2)]),
  icon('image', [r(2.6, 3, 9.8, 9.2, { rx: 1.1 }), c(5.1, 6.1, 0.75, { fill: 'currentColor', stroke: 'none' }), polyline('3.6 10.2 6.15 7.65 8.1 9.35 10.8 6.6 11.4 7.2')], { categories: commonTags.media }),

  icon('play', [polygon('5.4 4.6 11 7.5 5.4 10.4', { fill: 'currentColor', stroke: 'none' })], { categories: commonTags.media }),
  icon('pause', [r(4.7, 4.2, 2.1, 6.6, { rx: 0.5, fill: 'currentColor', stroke: 'none' }), r(8.2, 4.2, 2.1, 6.6, { rx: 0.5, fill: 'currentColor', stroke: 'none' })], { categories: commonTags.media }),
  icon('mic', [p('M7.5 2.8a1.7 1.7 0 0 0-1.7 1.7v2.9a1.7 1.7 0 1 0 3.4 0V4.5A1.7 1.7 0 0 0 7.5 2.8z'), p('M4.4 7.4a3.1 3.1 0 1 0 6.2 0'), l(7.5, 10.5, 7.5, 12.1), l(5.5, 12.1, 9.5, 12.1)], { categories: commonTags.media }),
  icon('mic-off', [
    l(2.4, 2.4, 12.6, 12.6),
    p('M5.8 8.05V4.95a1.7 1.7 0 0 1 2.75-1.3'),
    p('M9.2 9.2a1.7 1.7 0 0 1-2.75-1.3'),
    p('M4.35 7.45a3.15 3.15 0 0 0 5.62 1.95'),
    l(7.5, 10.55, 7.5, 12.15),
    l(5.5, 12.15, 9.5, 12.15)
  ], { categories: commonTags.media }),

  icon('download', [l(7.5, 3.2, 7.5, 9.3), polyline('4.9 6.9 7.5 9.5 10.1 6.9'), l(3.2, 11.7, 11.8, 11.7)], { aliases: ['arrow-down-to-line'], tags: commonTags.actions }),
  icon('upload', [l(7.5, 11.8, 7.5, 5.7), polyline('4.9 8.1 7.5 5.5 10.1 8.1'), l(3.2, 3.3, 11.8, 3.3)], { aliases: ['arrow-up-to-line'], tags: commonTags.actions }),
  icon('refresh-cw', [p('M11.5 5.5V3.3H9.3'), p('M11.3 3.7a4.6 4.6 0 1 0 1 5.8')], { aliases: ['reload'], tags: commonTags.actions }),
  icon('refresh-ccw', [p('M3.5 9.5v2.2h2.2'), p('M3.7 11.3a4.6 4.6 0 1 0-1-5.8')], { tags: commonTags.actions }),

  icon('terminal', [polyline('3.5 5.2 5.8 7.5 3.5 9.8'), l(6.9, 10.1, 11.5, 10.1)]),
  icon('code', [polyline('5.6 4.5 3 7.5 5.6 10.5'), polyline('9.4 4.5 12 7.5 9.4 10.5'), l(8.2, 3.7, 6.8, 11.3)]),
  icon('sparkles', [p('M7.5 2.8 8.3 5l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z'), p('M11 8.6 11.45 9.8l1.25.45-1.25.45-.45 1.25-.45-1.25-1.25-.45 1.25-.45z'), p('M3.5 8.8 3.92 9.92 5.05 10.35 3.92 10.77 3.5 11.9 3.08 10.77 1.95 10.35 3.08 9.92z')]),
  icon('bolt', [polyline('8.15 2.75 4.55 8.1 7.3 8.1 6.7 12.2 10.45 6.9 7.8 6.9 8.15 2.75')], {
    solid: [polygon('8.15,2.6 4.35,8.35 7.05,8.35 6.55,12.4 10.65,6.65 7.95,6.65', { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('sun', [c(7.5, 7.5, 2.2), l(7.5, 1.9, 7.5, 3.3), l(7.5, 11.7, 7.5, 13.1), l(1.9, 7.5, 3.3, 7.5), l(11.7, 7.5, 13.1, 7.5), l(3.5, 3.5, 4.5, 4.5), l(10.5, 10.5, 11.5, 11.5), l(10.5, 4.5, 11.5, 3.5), l(3.5, 11.5, 4.5, 10.5)]),
  icon('moon', [p('M10.9 9.5A4.7 4.7 0 1 1 6 3.2a3.9 3.9 0 1 0 4.9 6.3z')]),

  icon('link-2', [polyline('5.5 9 4.25 10.25 2.95 8.95 4.2 7.7'), polyline('9.5 6 10.75 4.75 12.05 6.05 10.8 7.3'), l(5.9, 9.1, 9.1, 5.9)], { aliases: ['chain-link'] }),
  icon('command', [p('M5.1 5.1a1.6 1.6 0 1 1 0-3.2h1.2v4.4H5.1a1.6 1.6 0 1 1 0-3.2h4.8a1.6 1.6 0 1 1 0 3.2H8.7v4.4h1.2a1.6 1.6 0 1 1 0 3.2H8.7V9.5H6.3v1.2H5.1a1.6 1.6 0 1 1 0 3.2h1.2V9.5H5.1a1.6 1.6 0 1 1 0-3.2')])
];

export const iconNameList = iconDefinitions.map((entry) => entry.name).sort();
