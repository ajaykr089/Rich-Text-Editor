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

  icon('menu', [l(3, 4.5, 12, 4.5), l(3, 7.5, 12, 7.5), l(3, 10.5, 12, 10.5)], { aliases: ['hamburger', 'menu-alt'] }),
  icon('more-horizontal', [c(4.25, 7.5, 1), c(7.5, 7.5, 1), c(10.75, 7.5, 1)], { aliases: ['ellipsis-horizontal', 'menu-horizontal'] }),
  icon('more-vertical', [c(7.5, 4.25, 1), c(7.5, 7.5, 1), c(7.5, 10.75, 1)], { aliases: ['ellipsis-vertical', 'menu-vertical'] }),

  icon('search', [c(6.5, 6.5, 3.75), l(9.5, 9.5, 12, 12)], { aliases: ['magnifier'] }),
  icon('search-plus', [c(6.2, 6.2, 3.4), l(8.7, 8.7, 11.2, 11.2), l(11.35, 5.1, 11.35, 7.7), l(10.05, 6.4, 12.65, 6.4)], {
    aliases: ['zoom-in']
  }),
  icon('search-minus', [c(6.2, 6.2, 3.4), l(8.7, 8.7, 11.2, 11.2), l(10.05, 6.4, 12.65, 6.4)], {
    aliases: ['zoom-out']
  }),
  icon('filter', [polygon('2.75,3.5 12.25,3.5 8.75,7.5 8.75,11.5 6.25,10.25 6.25,7.5')], {
    solid: [polygon('2.2,3 12.8,3 8.9,7.5 8.9,12 6.1,10.55 6.1,7.5', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['filter-alt']
  }),
  icon('sort', [l(5, 3.2, 5, 11.8), polyline('3.4 4.8 5 3.2 6.6 4.8'), l(10, 11.8, 10, 3.2), polyline('8.4 10.2 10 11.8 11.6 10.2')], {
    aliases: ['arrange']
  }),
  icon('sort-asc', [l(4.2, 3.3, 4.2, 11.7), polyline('2.8 4.7 4.2 3.3 5.6 4.7'), l(8, 4.2, 11.7, 4.2), l(8, 7, 10.7, 7), l(8, 9.8, 9.7, 9.8)]),
  icon('sort-desc', [l(4.2, 11.7, 4.2, 3.3), polyline('2.8 10.3 4.2 11.7 5.6 10.3'), l(8, 4.2, 9.7, 4.2), l(8, 7, 10.7, 7), l(8, 9.8, 11.7, 9.8)]),
  icon('sliders', [l(3, 4, 12, 4), c(6, 4, 1.1, { fill: 'currentColor', stroke: 'none' }), l(3, 7.5, 12, 7.5), c(9.5, 7.5, 1.1, { fill: 'currentColor', stroke: 'none' }), l(3, 11, 12, 11), c(5, 11, 1.1, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['slider']
  }),
  icon('settings', [c(7.5, 7.5, 2.1), l(7.5, 2.8, 7.5, 4.1), l(7.5, 10.9, 7.5, 12.2), l(2.8, 7.5, 4.1, 7.5), l(10.9, 7.5, 12.2, 7.5), l(4.15, 4.15, 5.05, 5.05), l(9.95, 9.95, 10.85, 10.85), l(10.85, 4.15, 9.95, 5.05), l(5.05, 9.95, 4.15, 10.85)], {
    aliases: ['cog', 'settings-2', 'settings-3']
  }),

  icon('home', [p('M2.75 6.75 7.5 3.25 12.25 6.75'), p('M4.25 6.5v5h6.5v-5'), r(6.4, 8.1, 2.2, 3.4, { rx: 0.55 })], {
    solid: [p('M2.2 6.6 7.5 2.65 12.8 6.6v5.65a1 1 0 0 1-1 1h-2.1V9.4H5.3v3.85H3.2a1 1 0 0 1-1-1z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['home-filled', 'home-outline'],
    categories: ['navigation']
  }),
  icon('dashboard', [r(2.75, 2.75, 4.2, 4.2, { rx: 0.8 }), r(8.05, 2.75, 4.2, 2.9, { rx: 0.8 }), r(8.05, 6.85, 4.2, 5.4, { rx: 0.8 }), r(2.75, 8.15, 4.2, 4.1, { rx: 0.8 })], {
    aliases: ['layout-dashboard', 'dashboard-alt', 'dashboard-analytics'],
    categories: ['navigation']
  }),
  icon('app-grid', [r(3, 3, 2.4, 2.4, { rx: 0.4 }), r(6.3, 3, 2.4, 2.4, { rx: 0.4 }), r(9.6, 3, 2.4, 2.4, { rx: 0.4 }), r(3, 6.3, 2.4, 2.4, { rx: 0.4 }), r(6.3, 6.3, 2.4, 2.4, { rx: 0.4 }), r(9.6, 6.3, 2.4, 2.4, { rx: 0.4 }), r(3, 9.6, 2.4, 2.4, { rx: 0.4 }), r(6.3, 9.6, 2.4, 2.4, { rx: 0.4 }), r(9.6, 9.6, 2.4, 2.4, { rx: 0.4 })], {
    aliases: ['grid', 'grid-2', 'grid-3', 'grid-4', 'layout-grid', 'grid-view'],
    categories: ['navigation']
  }),
  icon('layout', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), l(6, 3.1, 6, 11.9), l(6.1, 7.3, 12.1, 7.3)], {
    aliases: ['grid-layout']
  }),
  icon('layout-list', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), l(5.2, 5.2, 10.8, 5.2), l(5.2, 7.5, 10.8, 7.5), l(5.2, 9.8, 10.8, 9.8)]),
  icon('layout-sidebar', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), l(5.35, 3.1, 5.35, 11.9)]),
  icon('columns', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), l(5.95, 3.1, 5.95, 11.9), l(9.05, 3.1, 9.05, 11.9)]),
  icon('rows', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), l(2.9, 6, 12.1, 6), l(2.9, 8.95, 12.1, 8.95)]),
  icon('sidebar-left', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), r(2.9, 3.1, 2.45, 8.8, { rx: 0.6 })]),
  icon('sidebar-right', [r(2.75, 3, 9.5, 9, { rx: 1.1 }), r(9.65, 3.1, 2.45, 8.8, { rx: 0.6 })]),
  icon('panel-left', [r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }), r(2.95, 3.4, 2.5, 8.2, { rx: 0.6 })]),
  icon('panel-right', [r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }), r(9.55, 3.4, 2.5, 8.2, { rx: 0.6 })]),
  icon('panel-top', [r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }), r(2.95, 3.4, 9.1, 2.45, { rx: 0.6 })]),
  icon('panel-bottom', [r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }), r(2.95, 9.15, 9.1, 2.45, { rx: 0.6 })]),
  icon('list-view', [c(3.6, 4.6, 0.6, { fill: 'currentColor', stroke: 'none' }), c(3.6, 7.5, 0.6, { fill: 'currentColor', stroke: 'none' }), c(3.6, 10.4, 0.6, { fill: 'currentColor', stroke: 'none' }), l(5.2, 4.6, 11.8, 4.6), l(5.2, 7.5, 11.8, 7.5), l(5.2, 10.4, 11.8, 10.4)]),
  icon('table', [r(2.75, 3, 9.5, 9, { rx: 1 }), l(2.9, 6.1, 12.1, 6.1), l(2.9, 9.2, 12.1, 9.2), l(5.9, 3.1, 5.9, 11.9), l(9, 3.1, 9, 11.9)]),
  icon('table-alt', [r(2.75, 3, 9.5, 9, { rx: 1 }), l(2.9, 5.9, 12.1, 5.9), l(2.9, 8.7, 12.1, 8.7), l(7.4, 3.1, 7.4, 11.9)]),
  icon('columns-alt', [r(2.75, 3, 9.5, 9, { rx: 1 }), l(7.5, 3.1, 7.5, 11.9)]),
  icon('row', [r(2.75, 3, 9.5, 9, { rx: 1 }), l(2.9, 7.5, 12.1, 7.5)]),

  icon('folder', [p('M2.5 5.3a1.3 1.3 0 0 1 1.3-1.3h2.4l1.05 1.2h3.75a1.3 1.3 0 0 1 1.3 1.3v4.7a1.3 1.3 0 0 1-1.3 1.3H3.8a1.3 1.3 0 0 1-1.3-1.3z')], {
    solid: [p('M2 5.35A1.85 1.85 0 0 1 3.85 3.5h2.2l1.05 1.2h4.05A1.85 1.85 0 0 1 13 6.55v4.6A1.85 1.85 0 0 1 11.15 13H3.85A1.85 1.85 0 0 1 2 11.15z', { fill: 'currentColor', stroke: 'none' })],
    categories: commonTags.files
  }),
  icon('folder-open', [p('M2.6 5.5a1.3 1.3 0 0 1 1.3-1.3h2.25l1.05 1.1h3.9a1.25 1.25 0 0 1 1.23 1.5l-.68 3.75a1.3 1.3 0 0 1-1.28 1.07H3.75a1.3 1.3 0 0 1-1.28-1.55z')], { categories: commonTags.files }),
  icon('file', [p('M4 2.75h4.5l2.5 2.5v6.95a1.3 1.3 0 0 1-1.3 1.3H4.3A1.3 1.3 0 0 1 3 12.2V4.05A1.3 1.3 0 0 1 4.3 2.75z'), p('M8.5 2.9v2.35h2.35')], {
    aliases: ['file-text', 'file-code', 'file-image', 'file-video', 'file-audio', 'file-pdf', 'file-zip', 'file-doc', 'file-xls', 'file-ppt'],
    categories: commonTags.files
  }),
  icon('copy', [r(5, 5, 7, 7, { rx: 1 }), r(3, 3, 7, 7, { rx: 1 })], { aliases: ['duplicate'], categories: commonTags.files }),
  icon('clipboard', [r(3.5, 3.5, 8, 9, { rx: 1.2 }), r(5.3, 2.2, 4.4, 2.1, { rx: 0.8 })], { categories: commonTags.files }),
  icon('clipboard-check', [r(3.5, 3.5, 8, 9, { rx: 1.2 }), r(5.3, 2.2, 4.4, 2.1, { rx: 0.8 }), p('M5.6 8.2 6.7 9.3 9.2 6.8')], { categories: commonTags.files }),
  icon('paste', [r(4, 4.1, 7, 8.4, { rx: 1 }), r(5.2, 2.4, 4.6, 2.2, { rx: 0.8 }), l(9.7, 9.1, 11.8, 9.1), l(10.75, 8.1, 10.75, 10.1)], { categories: commonTags.files }),
  icon('cut', [c(4.2, 10.2, 1.2), c(4.2, 4.2, 1.2), l(5.15, 5.05, 11.8, 11.8), l(5.15, 9.35, 11.8, 2.8)], { categories: commonTags.files }),
  icon('save', [r(3, 2.8, 9, 9.7, { rx: 1 }), r(5.1, 2.8, 3.8, 3, { rx: 0.4 }), r(5, 8.5, 5, 2.8, { rx: 0.5 })], { aliases: ['save-alt'], categories: commonTags.files }),
  icon('trash', [p('M3.5 4h8'), p('M5.1 4V3h4.8v1'), p('M4.5 4l.5 7.25h5l.5-7.25'), l(6.3, 6, 6.3, 10), l(8.7, 6, 8.7, 10)], {
    solid: [p('M3.1 4.2h8.8l-.6 7.2a1.4 1.4 0 0 1-1.39 1.28H5.1A1.4 1.4 0 0 1 3.71 11.4zM5.3 2.8h4.4a.75.75 0 0 1 .75.75v.65H4.55v-.65a.75.75 0 0 1 .75-.75', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['delete', 'trash-2', 'delete-forever']
  }),
  icon('edit', [r(2.8, 9.6, 5.1, 2.6, { rx: 0.8 }), p('M5.3 10.9 10.7 5.5l1.8 1.8-5.4 5.4-2.4.6z')], { aliases: ['pen'] }),
  icon('pencil', [p('M4 11.4 10.9 4.5l1.6 1.6-6.9 6.9-2.2.6z'), p('M9.9 3.5 11.5 5.1')], { aliases: ['edit-2'] }),
  icon('link', [p('M5.5 8.9 4.3 10.1a2.25 2.25 0 1 1-3.2-3.2L2.3 5.7a2.25 2.25 0 0 1 3.2 0'), p('M9.5 6.1 10.7 4.9a2.25 2.25 0 0 1 3.2 3.2l-1.2 1.2a2.25 2.25 0 0 1-3.2 0'), l(5.9, 9.1, 9.1, 5.9)], { aliases: ['chain'] }),
  icon('unlink', [p('M5.4 9 4.2 10.2a2.25 2.25 0 1 1-3.18-3.18L2.2 5.8'), p('M9.6 6 10.8 4.8a2.25 2.25 0 1 1 3.18 3.18L12.8 9.2'), l(4.5, 4.5, 10.5, 10.5)], { aliases: ['link-off'] }),
  icon('share', [c(3.1, 7.5, 1), c(11.4, 4.2, 1), c(11.4, 10.8, 1), l(4, 7, 10.5, 4.7), l(4, 8, 10.5, 10.3)]),
  icon('share-2', [c(3.4, 7.5, 0.9), c(11.2, 4.3, 0.9), c(11.2, 10.7, 0.9), polyline('4.2 7.05 10.2 4.8'), polyline('4.2 7.95 10.2 10.2')]),

  icon('user', [c(7.5, 5.25, 2.25), p('M3.2 12c.8-1.95 2.4-3 4.3-3s3.5 1.05 4.3 3')], {
    aliases: ['profile', 'account', 'customer'],
    categories: commonTags.users
  }),
  icon('users', [c(5.7, 5.3, 2), c(10, 6, 1.65), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), p('M8.45 11.8c.43-1.07 1.24-1.73 2.25-1.73.95 0 1.75.58 2.2 1.55')], {
    aliases: ['users-group', 'team'],
    categories: commonTags.users
  }),
  icon('user-plus', [c(5.5, 5.3, 2), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), l(10.5, 6.2, 10.5, 10.2), l(8.5, 8.2, 12.5, 8.2)], {
    aliases: ['user-add'],
    categories: commonTags.users
  }),
  icon('user-remove', [c(5.5, 5.3, 2), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), l(8.6, 8.2, 12.4, 8.2)], { categories: commonTags.users }),
  icon('user-check', [c(5.5, 5.3, 2), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), p('M8.7 8.2 10.1 9.6 12.2 7.5')], { categories: commonTags.users }),
  icon('user-x', [c(5.5, 5.3, 2), p('M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6'), l(9, 7.1, 12.1, 10.2), l(12.1, 7.1, 9, 10.2)], { categories: commonTags.users }),

  icon('bell', [p('M7.5 2.8c-1.7 0-3.05 1.35-3.05 3.05v1.4c0 .68-.23 1.34-.65 1.88l-.8 1.04h8l-.8-1.04a3.05 3.05 0 0 1-.65-1.88v-1.4c0-1.7-1.35-3.05-3.05-3.05z'), p('M6.1 11.2a1.4 1.4 0 0 0 2.8 0')], {
    solid: [p('M7.5 2.5a3.4 3.4 0 0 0-3.4 3.4v1.35c0 .74-.25 1.46-.7 2.05l-.95 1.25h10.1l-.95-1.25c-.45-.59-.7-1.31-.7-2.05V5.9a3.4 3.4 0 0 0-3.4-3.4zm-1.55 9.3a1.55 1.55 0 0 0 3.1 0z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['notification']
  }),
  icon('bell-off', [p('M2.6 2.6 12.4 12.4'), p('M4.45 4.45a3 3 0 0 1 5.1 2.15v1.5c0 .59.18 1.17.52 1.65l.68.95H4.2l.68-.95c.34-.48.52-1.06.52-1.65v-3.65'), p('M6.2 11.2a1.35 1.35 0 0 0 2.6 0')], {
    aliases: ['notification-dot']
  }),
  icon('mail', [r(2.5, 3.5, 10, 8, { rx: 1.1 }), polyline('3.2 4.5 7.5 8 11.8 4.5')], {
    aliases: ['mail-open', 'mail-send', 'message']
  }),
  icon('inbox', [r(2.7, 3.5, 9.6, 8.7, { rx: 1.2 }), p('M2.8 8h2.9l1.2 1.6h1.2L9.3 8h2.9')]),
  icon('archive', [r(2.7, 3.1, 9.6, 9.1, { rx: 1.1 }), l(2.8, 5.6, 12.2, 5.6), l(6.1, 8.2, 8.9, 8.2)]),
  icon('phone', [p('M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8')]),
  icon('map-pin', [p('M7.5 12.2s3.6-3.3 3.6-5.7A3.6 3.6 0 0 0 3.9 6.5c0 2.4 3.6 5.7 3.6 5.7z'), c(7.5, 6.45, 1.25)], { aliases: ['pin', 'location'] }),
  icon('map', [polygon('2.6,4.5 5.8,3.2 9.2,4.5 12.4,3.2 12.4,10.5 9.2,11.8 5.8,10.5 2.6,11.8'), l(5.8, 3.2, 5.8, 10.5), l(9.2, 4.5, 9.2, 11.8)]),
  icon('location-arrow', [polygon('3.2,3.2 12.1,7.4 8.2,8.3 7.3,12.2 3.2,3.2', { fill: 'currentColor', stroke: 'none' })]),
  icon('compass', [c(7.5, 7.5, 4.8), polygon('6.1,6.1 10.4,4.6 8.9,8.9 4.6,10.4', { fill: 'none' }), c(7.5, 7.5, 0.55, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['compass-alt']
  }),
  icon('navigation', [polygon('7.5,2.8 11.8,12.2 7.5,10.3 3.2,12.2', { fill: 'none' })], {
    aliases: ['gps', 'nav', 'navigation-icon']
  }),
  icon('route', [c(3.2, 4.1, 0.7, { fill: 'currentColor', stroke: 'none' }), c(11.8, 10.9, 0.7, { fill: 'currentColor', stroke: 'none' }), p('M3.9 4.1h3.3c2.2 0 2.4 2.6 4.6 2.6h.7'), p('M11.1 10.9H7.7c-2.2 0-2.4-2.6-4.6-2.6h-.7')]),
  icon('globe', [c(7.5, 7.5, 4.7), l(2.8, 7.5, 12.2, 7.5), p('M7.5 2.8c1.2 1.2 1.9 2.9 1.9 4.7s-.7 3.5-1.9 4.7'), p('M7.5 2.8c-1.2 1.2-1.9 2.9-1.9 4.7s.7 3.5 1.9 4.7')]),
  icon('calendar', [r(2.7, 3.6, 9.6, 8.7, { rx: 1 }), l(5, 2.5, 5, 4.5), l(10, 2.5, 10, 4.5), l(2.7, 5.6, 12.3, 5.6), c(5.25, 8.3, 0.55, { fill: 'currentColor', stroke: 'none' }), c(7.5, 8.3, 0.55, { fill: 'currentColor', stroke: 'none' }), c(9.75, 8.3, 0.55, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['calendar-check', 'calendar-plus', 'calendar-minus', 'calendar-event']
  }),
  icon('clock', [c(7.5, 7.5, 4.7), l(7.5, 7.5, 7.5, 5), l(7.5, 7.5, 9.2, 8.7)], {
    aliases: ['timer', 'stopwatch', 'watch']
  }),
  icon('alarm', [c(7.5, 8, 3.8), l(7.5, 8, 7.5, 6.2), l(7.5, 8, 9, 8.8), polyline('4.6 3.6 3.4 2.4 2.4 3.4'), polyline('10.4 3.6 11.6 2.4 12.6 3.4')]),
  icon('history', [c(7.7, 7.7, 4), l(7.7, 7.7, 7.7, 5.9), l(7.7, 7.7, 9.4, 8.8), polyline('2.9 7.7 2.9 4.9 5.7 4.9')]),
  icon('signal', [r(2.8, 9.8, 1.5, 2.2, { rx: 0.35, fill: 'currentColor', stroke: 'none' }), r(5.1, 8.1, 1.5, 3.9, { rx: 0.35, fill: 'currentColor', stroke: 'none' }), r(7.4, 6.4, 1.5, 5.6, { rx: 0.35, fill: 'currentColor', stroke: 'none' }), r(9.7, 4.7, 1.5, 7.3, { rx: 0.35, fill: 'currentColor', stroke: 'none' })]),
  icon('battery', [r(2.8, 4.7, 8.8, 5.6, { rx: 1 }), r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }), r(3.4, 5.3, 4.2, 4.4, { rx: 0.4, fill: 'currentColor', stroke: 'none' })], {
    aliases: ['battery-half']
  }),
  icon('battery-full', [r(2.8, 4.7, 8.8, 5.6, { rx: 1 }), r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }), r(3.4, 5.3, 7.8, 4.4, { rx: 0.4, fill: 'currentColor', stroke: 'none' })]),
  icon('battery-low', [r(2.8, 4.7, 8.8, 5.6, { rx: 1 }), r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }), r(3.4, 5.3, 2, 4.4, { rx: 0.4, fill: 'currentColor', stroke: 'none' })]),
  icon('battery-charging', [r(2.8, 4.7, 8.8, 5.6, { rx: 1 }), r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }), polygon('7.2,5.3 5.6,7.6 7.1,7.6 6.4,9.7 8.8,6.8 7.4,6.8', { fill: 'currentColor', stroke: 'none' })]),
  icon('power', [l(7.5, 2.9, 7.5, 7.2), p('M4.55 4.25a4.2 4.2 0 1 0 5.9 0')]),
  icon('power-off', [l(7.5, 2.9, 7.5, 7.2), p('M4.55 4.25a4.2 4.2 0 1 0 5.9 0'), l(2.4, 2.4, 12.6, 12.6)]),

  icon('chart-bar', [l(3.25, 12, 11.75, 12), r(4, 8, 1.7, 4, { rx: 0.3 }), r(6.65, 6.5, 1.7, 5.5, { rx: 0.3 }), r(9.3, 5, 1.7, 7, { rx: 0.3 })], {
    aliases: ['chart', 'analytics', 'metrics'],
    categories: ['analytics']
  }),
  icon('chart-line', [l(3, 12, 12, 12), polyline('3.5 9.5 5.8 7.6 7.3 8.6 10.8 5.4'), c(3.5, 9.5, 0.45, { fill: 'currentColor', stroke: 'none' }), c(5.8, 7.6, 0.45, { fill: 'currentColor', stroke: 'none' }), c(7.3, 8.6, 0.45, { fill: 'currentColor', stroke: 'none' }), c(10.8, 5.4, 0.45, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['graph'],
    categories: ['analytics']
  }),
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
    aliases: ['favorite', 'star-filled']
  }),
  icon('heart', [p('M7.5 11.9s-4.4-2.8-4.4-5.9A2.6 2.6 0 0 1 7.5 4.5 2.6 2.6 0 0 1 11.9 6c0 3.1-4.4 5.9-4.4 5.9z')], {
    solid: [p('M7.5 12.35s-4.9-3.1-4.9-6.45a3.1 3.1 0 0 1 5.3-2.2A3.1 3.1 0 0 1 12.4 5.9c0 3.35-4.9 6.45-4.9 6.45z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['like', 'heart-filled']
  }),
  icon('bookmark', [p('M4.2 2.8h6.6a.8.8 0 0 1 .8.8V12l-4.1-2.35L3.4 12V3.6a.8.8 0 0 1 .8-.8z')], {
    solid: [p('M4 2.5h7a1 1 0 0 1 1 1v9.4l-4.5-2.55L3 12.9V3.5a1 1 0 0 1 1-1z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['bookmark-filled']
  }),
  icon('tag', [p('M8.75 3h3.25v3.25l-5.35 5.35a1.1 1.1 0 0 1-1.56 0L3.4 9.9a1.1 1.1 0 0 1 0-1.56z'), c(10.2, 4.8, 0.7, { fill: 'currentColor', stroke: 'none' })]),
  icon('flag', [p('M4 2.9v9.2'), p('M4.1 3.4h6.7l-1.3 2.2 1.3 2.2H4.1')], {
    solid: [p('M3.65 2.6h.7v10.9h-.7zM4.35 3h7.05l-1.35 2.25L11.4 7.5H4.35z', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['flag-filled']
  }),
  icon('tags', [p('M8.6 3h3.3v3.3L6.7 11.5a1 1 0 0 1-1.4 0L3.5 9.7a1 1 0 0 1 0-1.4z'), p('M5.8 5.8h3.3v3.3L3.9 14.3a1 1 0 0 1-1.4 0L.7 12.5a1 1 0 0 1 0-1.4z', { transform: 'translate(2 0)' })]),

  icon('lock', [r(3.5, 6.5, 8, 5.5, { rx: 1 }), p('M5.1 6.5V5.2a2.4 2.4 0 1 1 4.8 0v1.3'), c(7.5, 9.2, 0.8), l(7.5, 9.9, 7.5, 10.8)], {
    solid: [p('M4 6.3h7a1 1 0 0 1 1 1v4.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.3a1 1 0 0 1 1-1zm1.45 0V5.2a2.05 2.05 0 1 1 4.1 0v1.1', { fill: 'currentColor', stroke: 'none' })]
  }),
  icon('unlock', [r(3.5, 6.5, 8, 5.5, { rx: 1 }), p('M9.9 6.5V5.2a2.4 2.4 0 0 0-4.8 0'), c(7.5, 9.2, 0.8), l(7.5, 9.9, 7.5, 10.8)], {
    aliases: ['lock-open']
  }),
  icon('shield', [p('M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z')], {
    duotone: [p('M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z', { fill: 'currentColor', stroke: 'none', tone: 'secondary', opacity: 0.3 }), p('M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z')],
    aliases: ['shield-check', 'shield-alert']
  }),

  icon('info', [c(7.5, 7.5, 4.75), l(7.5, 6.9, 7.5, 10), c(7.5, 4.9, 0.55, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['info-circle'],
    categories: commonTags.status
  }),
  icon('alert-triangle', [polygon('7.5,2.6 12.7,11.8 2.3,11.8'), l(7.5, 6, 7.5, 8.7), c(7.5, 10.3, 0.55, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['warning', 'alert'],
    categories: commonTags.status
  }),
  icon('alert-circle', [c(7.5, 7.5, 4.75), l(7.5, 5.4, 7.5, 8.4), c(7.5, 10.2, 0.55, { fill: 'currentColor', stroke: 'none' })], { aliases: ['error'], categories: commonTags.status }),
  icon('help-circle', [c(7.5, 7.5, 4.75), p('M6.35 6.1a1.15 1.15 0 1 1 2.3.05c0 .95-1.15 1.05-1.15 2.05'), c(7.5, 10.45, 0.55, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['question', 'help'],
    categories: commonTags.status
  }),
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
  icon('camera-off', [r(2.6, 4.2, 9.8, 7.2, { rx: 1.2 }), r(5.2, 2.9, 2.5, 1.3, { rx: 0.5 }), l(2.4, 2.4, 12.6, 12.6)]),
  icon('video', [r(2.6, 4.2, 7.1, 6.6, { rx: 1 }), polygon('10.2,6.2 12.6,5.1 12.6,9.9 10.2,8.8')]),
  icon('video-off', [r(2.6, 4.2, 7.1, 6.6, { rx: 1 }), polygon('10.2,6.2 12.6,5.1 12.6,9.9 10.2,8.8'), l(2.4, 2.4, 12.6, 12.6)]),
  icon('image', [r(2.6, 3, 9.8, 9.2, { rx: 1.1 }), c(5.1, 6.1, 0.75, { fill: 'currentColor', stroke: 'none' }), polyline('3.6 10.2 6.15 7.65 8.1 9.35 10.8 6.6 11.4 7.2')], {
    aliases: ['gallery', 'picture'],
    categories: commonTags.media
  }),

  icon('play', [polygon('5.4 4.6 11 7.5 5.4 10.4', { fill: 'currentColor', stroke: 'none' })], { categories: commonTags.media }),
  icon('play-circle', [c(7.5, 7.5, 4.8), polygon('6.45 5.9 10 7.5 6.45 9.1', { fill: 'currentColor', stroke: 'none' })]),
  icon('pause', [r(4.7, 4.2, 2.1, 6.6, { rx: 0.5, fill: 'currentColor', stroke: 'none' }), r(8.2, 4.2, 2.1, 6.6, { rx: 0.5, fill: 'currentColor', stroke: 'none' })], { categories: commonTags.media }),
  icon('pause-circle', [c(7.5, 7.5, 4.8), r(5.7, 5.6, 1.3, 3.8, { rx: 0.4, fill: 'currentColor', stroke: 'none' }), r(8, 5.6, 1.3, 3.8, { rx: 0.4, fill: 'currentColor', stroke: 'none' })]),
  icon('stop-circle', [c(7.5, 7.5, 4.8), r(5.7, 5.7, 3.6, 3.6, { rx: 0.5, fill: 'currentColor', stroke: 'none' })]),
  icon('forward', [polygon('4.7,5.1 8,7.5 4.7,9.9', { fill: 'currentColor', stroke: 'none' }), polygon('8.1,5.1 11.4,7.5 8.1,9.9', { fill: 'currentColor', stroke: 'none' })]),
  icon('rewind', [polygon('10.3,5.1 7,7.5 10.3,9.9', { fill: 'currentColor', stroke: 'none' }), polygon('6.9,5.1 3.6,7.5 6.9,9.9', { fill: 'currentColor', stroke: 'none' })]),
  icon('skip-next', [polygon('4.7,5.1 8.1,7.5 4.7,9.9', { fill: 'currentColor', stroke: 'none' }), polygon('8.2,5.1 11.6,7.5 8.2,9.9', { fill: 'currentColor', stroke: 'none' }), l(11.9, 5.1, 11.9, 9.9)]),
  icon('skip-previous', [polygon('10.3,5.1 6.9,7.5 10.3,9.9', { fill: 'currentColor', stroke: 'none' }), polygon('6.8,5.1 3.4,7.5 6.8,9.9', { fill: 'currentColor', stroke: 'none' }), l(3.1, 5.1, 3.1, 9.9)]),
  icon('volume', [polygon('3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8')], {
    aliases: ['speaker']
  }),
  icon('volume-up', [polygon('3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8'), p('M9 6a2 2 0 0 1 0 3'), p('M10.2 4.8a3.7 3.7 0 0 1 0 5.4')]),
  icon('volume-down', [polygon('3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8'), p('M9.1 6.4a1.4 1.4 0 0 1 0 2.2')]),
  icon('volume-mute', [polygon('3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8'), l(9.2, 6.1, 11.4, 8.3), l(11.4, 6.1, 9.2, 8.3)]),
  icon('mic', [p('M7.5 2.8a1.7 1.7 0 0 0-1.7 1.7v2.9a1.7 1.7 0 1 0 3.4 0V4.5A1.7 1.7 0 0 0 7.5 2.8z'), p('M4.4 7.4a3.1 3.1 0 1 0 6.2 0'), l(7.5, 10.5, 7.5, 12.1), l(5.5, 12.1, 9.5, 12.1)], {
    aliases: ['microphone', 'headset'],
    categories: commonTags.media
  }),
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
  icon('cloud', [p('M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z')]),
  icon('cloud-upload', [p('M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z'), l(7.5, 10.1, 7.5, 6.7), polyline('6.2 8 7.5 6.7 8.8 8')]),
  icon('cloud-download', [p('M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z'), l(7.5, 6.7, 7.5, 10.1), polyline('6.2 8.8 7.5 10.1 8.8 8.8')]),
  icon('cloud-sync', [p('M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z'), p('M6 9a1.75 1.75 0 0 0 2.7 1.35'), polyline('8.9 10.35 8.8 9.15 7.65 9.2'), p('M9 8a1.75 1.75 0 0 0-2.7-1.35'), polyline('6.1 6.65 6.2 7.85 7.35 7.8')]),
  icon('refresh-cw', [p('M11.5 5.5V3.3H9.3'), p('M11.3 3.7a4.6 4.6 0 1 0 1 5.8')], {
    aliases: ['reload', 'refresh', 'sync', 'rotate', 'rotate-right'],
    tags: commonTags.actions
  }),
  icon('refresh-ccw', [p('M3.5 9.5v2.2h2.2'), p('M3.7 11.3a4.6 4.6 0 1 0-1-5.8')], {
    aliases: ['rotate-left'],
    tags: commonTags.actions
  }),

  icon('terminal', [polyline('3.5 5.2 5.8 7.5 3.5 9.8'), l(6.9, 10.1, 11.5, 10.1)], {
    aliases: ['terminal-alt']
  }),
  icon('code', [polyline('5.6 4.5 3 7.5 5.6 10.5'), polyline('9.4 4.5 12 7.5 9.4 10.5'), l(8.2, 3.7, 6.8, 11.3)], {
    aliases: ['code-block', 'api']
  }),
  icon('sparkles', [p('M7.5 2.8 8.3 5l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z'), p('M11 8.6 11.45 9.8l1.25.45-1.25.45-.45 1.25-.45-1.25-1.25-.45 1.25-.45z'), p('M3.5 8.8 3.92 9.92 5.05 10.35 3.92 10.77 3.5 11.9 3.08 10.77 1.95 10.35 3.08 9.92z')], {
    aliases: ['magic']
  }),
  icon('bolt', [polyline('8.15 2.75 4.55 8.1 7.3 8.1 6.7 12.2 10.45 6.9 7.8 6.9 8.15 2.75')], {
    solid: [polygon('8.15,2.6 4.35,8.35 7.05,8.35 6.55,12.4 10.65,6.65 7.95,6.65', { fill: 'currentColor', stroke: 'none' })],
    aliases: ['lightning']
  }),
  icon('sun', [c(7.5, 7.5, 2.2), l(7.5, 1.9, 7.5, 3.3), l(7.5, 11.7, 7.5, 13.1), l(1.9, 7.5, 3.3, 7.5), l(11.7, 7.5, 13.1, 7.5), l(3.5, 3.5, 4.5, 4.5), l(10.5, 10.5, 11.5, 11.5), l(10.5, 4.5, 11.5, 3.5), l(3.5, 11.5, 4.5, 10.5)]),
  icon('moon', [p('M10.9 9.5A4.7 4.7 0 1 1 6 3.2a3.9 3.9 0 1 0 4.9 6.3z')]),
  icon('wifi', [p('M2.6 5.9a7 7 0 0 1 9.8 0'), p('M4.6 7.9a4.2 4.2 0 0 1 5.8 0'), p('M6.55 9.85a1.35 1.35 0 0 1 1.9 0'), c(7.5, 11.45, 0.55, { fill: 'currentColor', stroke: 'none' })]),
  icon('wifi-off', [p('M2.6 5.9a7 7 0 0 1 9.8 0'), p('M4.6 7.9a4.2 4.2 0 0 1 5.8 0'), c(7.5, 11.45, 0.55, { fill: 'currentColor', stroke: 'none' }), l(2.4, 2.4, 12.6, 12.6)]),

  icon('login', [r(2.9, 3.3, 5.6, 8.4, { rx: 1 }), l(7.6, 7.5, 12.1, 7.5), polyline('9.8 5.2 12.1 7.5 9.8 9.8')], {
    aliases: ['sign-in']
  }),
  icon('logout', [r(6.5, 3.3, 5.6, 8.4, { rx: 1 }), l(7.4, 7.5, 2.9, 7.5), polyline('5.2 5.2 2.9 7.5 5.2 9.8')], {
    aliases: ['sign-out']
  }),
  icon('key', [c(4.6, 7.5, 1.9), l(6.5, 7.5, 12.3, 7.5), l(10.5, 7.5, 10.5, 9.1), l(11.7, 7.5, 11.7, 8.5)], {
    aliases: ['key-alt']
  }),
  icon('fingerprint', [p('M7.5 3.3a4.2 4.2 0 0 1 4.2 4.2v1.2'), p('M7.5 4.9a2.6 2.6 0 0 1 2.6 2.6v1.6'), p('M7.5 6.4a1.1 1.1 0 0 1 1.1 1.1v1.9'), p('M4.1 8.9V7.5a3.4 3.4 0 1 1 6.8 0v2.2a3.4 3.4 0 0 1-6.8 0V7.5')]),
  icon('dislike', [r(2.7, 5.7, 2, 5.1, { rx: 0.45 }), p('M4.7 10.2h5.7a1.15 1.15 0 0 0 1.1-.83l.65-2.1a1.1 1.1 0 0 0-1.05-1.43H9.9V3.6a1.1 1.1 0 0 0-2.08-.5L6.4 5.85H4.7')], {
    aliases: ['thumbs-down']
  }),

  icon('file-plus', [p('M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z'), p('M8.1 2.9v2.3h2.3'), l(6.2, 8.5, 6.2, 10.8), l(5, 9.65, 7.4, 9.65)]),
  icon('file-minus', [p('M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z'), p('M8.1 2.9v2.3h2.3'), l(5, 9.65, 7.4, 9.65)]),
  icon('file-check', [p('M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z'), p('M8.1 2.9v2.3h2.3'), p('M5 9.6 5.9 10.5 7.3 9.1')]),
  icon('file-x', [p('M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z'), p('M8.1 2.9v2.3h2.3'), l(5.1, 9.1, 7.3, 11.2), l(7.3, 9.1, 5.1, 11.2)]),
  icon('stop', [r(3.2, 3.2, 8.6, 8.6, { rx: 1.1 }), r(5.4, 5.4, 4.2, 4.2, { rx: 0.65, fill: 'currentColor', stroke: 'none' })], {
    aliases: ['stop-square']
  }),

  icon('crop', [polyline('4.1 2.8 4.1 10.9 12.2 10.9'), polyline('10.9 12.2 10.9 4.1 2.8 4.1'), l(6.2, 2.8, 6.2, 4.1), l(8.8, 10.9, 8.8, 12.2)]),
  icon('flip-horizontal', [l(7.5, 2.8, 7.5, 12.2), p('M3.1 4.2h2.8l1.2 1.2v4.2l-1.2 1.2H3.1z'), p('M12 4.2H9.2L8 5.4v4.2l1.2 1.2H12z')]),
  icon('flip-vertical', [l(2.8, 7.5, 12.2, 7.5), p('M4.2 3.1v2.8l1.2 1.2h4.2l1.2-1.2V3.1z'), p('M4.2 12v-2.8l1.2-1.2h4.2l1.2 1.2V12z')]),
  icon('maximize', [r(3, 3, 9, 9, { rx: 1.1 }), polyline('5.4 7.1 5.4 5.4 7.1 5.4'), polyline('9.6 7.1 9.6 5.4 7.9 5.4'), polyline('5.4 7.9 5.4 9.6 7.1 9.6'), polyline('9.6 7.9 9.6 9.6 7.9 9.6')], {
    aliases: ['fullscreen', 'expand']
  }),
  icon('minimize', [r(3, 3, 9, 9, { rx: 1.1 }), polyline('6.8 6.2 5.4 6.2 5.4 4.8'), polyline('8.2 6.2 9.6 6.2 9.6 4.8'), polyline('6.8 8.8 5.4 8.8 5.4 10.2'), polyline('8.2 8.8 9.6 8.8 9.6 10.2')], {
    aliases: ['fullscreen-exit', 'collapse']
  }),
  icon('check-square', [r(3.1, 3.1, 8.8, 8.8, { rx: 1.2 }), p('M5.1 7.7 6.8 9.4 9.9 6.3')]),

  icon('bug', [c(7.5, 7.8, 2.4), l(7.5, 3, 7.5, 5.2), l(5.1, 4.8, 3.4, 3.8), l(9.9, 4.8, 11.6, 3.8), l(4.8, 7.1, 2.9, 7.1), l(10.2, 7.1, 12.1, 7.1), l(5.1, 10.3, 3.4, 11.3), l(9.9, 10.3, 11.6, 11.3)]),
  icon('bracket', [polyline('6 3.1 4.2 3.1 4.2 11.9 6 11.9'), polyline('9 3.1 10.8 3.1 10.8 11.9 9 11.9')], {
    aliases: ['brackets']
  }),

  icon('cpu', [r(4.6, 4.6, 5.8, 5.8, { rx: 0.85 }), r(6.2, 6.2, 2.6, 2.6, { rx: 0.5 }), l(5.4, 2.8, 5.4, 4.1), l(7.5, 2.8, 7.5, 4.1), l(9.6, 2.8, 9.6, 4.1), l(5.4, 10.9, 5.4, 12.2), l(7.5, 10.9, 7.5, 12.2), l(9.6, 10.9, 9.6, 12.2), l(2.8, 5.4, 4.1, 5.4), l(2.8, 7.5, 4.1, 7.5), l(2.8, 9.6, 4.1, 9.6), l(10.9, 5.4, 12.2, 5.4), l(10.9, 7.5, 12.2, 7.5), l(10.9, 9.6, 12.2, 9.6)], {
    aliases: ['chip', 'memory', 'processor']
  }),
  icon('server', [r(2.8, 3.2, 9.4, 3.1, { rx: 0.8 }), r(2.8, 7.1, 9.4, 3.1, { rx: 0.8 }), c(4.3, 4.75, 0.45, { fill: 'currentColor', stroke: 'none' }), c(4.3, 8.65, 0.45, { fill: 'currentColor', stroke: 'none' }), l(6, 4.75, 11.1, 4.75), l(6, 8.65, 11.1, 8.65)]),
  icon('database', [p('M3.1 4.6c0-1.3 1.95-2.3 4.4-2.3s4.4 1 4.4 2.3-1.95 2.3-4.4 2.3-4.4-1-4.4-2.3z'), p('M3.1 4.6v2.8c0 1.3 1.95 2.3 4.4 2.3s4.4-1 4.4-2.3V4.6'), p('M3.1 7.4v2.8c0 1.3 1.95 2.3 4.4 2.3s4.4-1 4.4-2.3V7.4')], {
    aliases: ['storage']
  }),
  icon('database-add', [p('M3.1 4.4c0-1.3 1.95-2.3 4.4-2.3s4.4 1 4.4 2.3-1.95 2.3-4.4 2.3-4.4-1-4.4-2.3z'), p('M3.1 4.4v2.7c0 1.3 1.95 2.3 4.4 2.3 1.1 0 2.1-.2 2.9-.55'), l(10.5, 8.9, 10.5, 12.1), l(8.9, 10.5, 12.1, 10.5)]),
  icon('database-remove', [p('M3.1 4.4c0-1.3 1.95-2.3 4.4-2.3s4.4 1 4.4 2.3-1.95 2.3-4.4 2.3-4.4-1-4.4-2.3z'), p('M3.1 4.4v2.7c0 1.3 1.95 2.3 4.4 2.3 1.1 0 2.1-.2 2.9-.55'), l(8.9, 10.5, 12.1, 10.5)]),
  icon('hard-drive', [r(2.6, 4.2, 9.8, 6.6, { rx: 1.1 }), c(9.4, 8.7, 0.5, { fill: 'currentColor', stroke: 'none' }), c(11, 8.7, 0.5, { fill: 'currentColor', stroke: 'none' }), l(4, 8.7, 7.5, 8.7)], {
    aliases: ['hdd']
  }),
  icon('network', [c(7.5, 3.6, 1), c(3.6, 7.5, 1), c(11.4, 7.5, 1), c(7.5, 11.4, 1), l(7.5, 4.6, 3.6, 6.5), l(7.5, 4.6, 11.4, 6.5), l(3.6, 8.5, 7.5, 10.4), l(11.4, 8.5, 7.5, 10.4)]),
  icon('chart-area', [l(2.9, 12.1, 12.1, 12.1), l(2.9, 12.1, 2.9, 3.4), p('M3.3 10.2 5.5 7.7 7.2 8.5 9.1 5.7 11.7 7.3'), p('M3.3 10.2V12h8.4v-4.7l-2.6-1.6-1.9 2.8-1.7-.8z', { fill: 'currentColor', stroke: 'none', tone: 'secondary', opacity: 0.25 })]),

  icon('wallet', [r(2.7, 4.5, 9.8, 6.2, { rx: 1.1 }), p('M2.7 6.2h8.5a1 1 0 0 1 1 1v2.6h-3.1a1.3 1.3 0 1 1 0-2.6h3.1'), c(9.3, 8.5, 0.35, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['money', 'currency', 'dollar', 'euro', 'rupee', 'pound', 'bitcoin']
  }),
  icon('credit-card', [r(2.5, 4, 10, 7, { rx: 1.1 }), l(2.7, 6.5, 12.3, 6.5), l(4.3, 9.1, 7.2, 9.1)], {
    aliases: ['card']
  }),
  icon('invoice', [p('M4 2.8h7v9.6l-1.3-.8-1.2.8-1.2-.8-1.3.8-1.3-.8-1.2.8z'), l(5.5, 5.5, 9.4, 5.5), l(5.5, 7.4, 9.4, 7.4), l(5.5, 9.3, 8.1, 9.3)]),
  icon('receipt', [p('M4 2.8h7v9.6l-1.3-.8-1.2.8-1.2-.8-1.3.8-1.3-.8-1.2.8z'), l(5.5, 5.5, 9.4, 5.5), l(5.5, 7.4, 9.4, 7.4), l(5.5, 9.3, 7.1, 9.3)], {
    aliases: ['bill']
  }),
  icon('cart', [c(4.6, 11.1, 0.8), c(9.8, 11.1, 0.8), p('M2.5 3.6h1.4l1.2 5.8h5.9l1.1-4.2H4.8'), l(6.2, 9.4, 11.4, 9.4)], {
    aliases: ['cart-add', 'cart-remove', 'shopping-basket', 'shopping-bag']
  }),

  icon('building', [r(3.1, 2.8, 8.8, 10.4, { rx: 0.85 }), r(5.1, 4.5, 1.1, 1.1, { rx: 0.2 }), r(7, 4.5, 1.1, 1.1, { rx: 0.2 }), r(8.9, 4.5, 1.1, 1.1, { rx: 0.2 }), r(5.1, 6.5, 1.1, 1.1, { rx: 0.2 }), r(7, 6.5, 1.1, 1.1, { rx: 0.2 }), r(8.9, 6.5, 1.1, 1.1, { rx: 0.2 }), r(6.9, 9.2, 1.3, 3.9, { rx: 0.3 })], {
    aliases: ['office', 'home-office', 'factory', 'warehouse', 'store', 'shop']
  }),
  icon('car', [p('M3 8.8h9l-1-2.8a1.6 1.6 0 0 0-1.5-1.1H5.5A1.6 1.6 0 0 0 4 6z'), r(2.7, 8.8, 9.6, 2.2, { rx: 0.8 }), c(4.8, 11.2, 0.7, { fill: 'currentColor', stroke: 'none' }), c(10.2, 11.2, 0.7, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['bus', 'train', 'truck', 'bike', 'scooter', 'taxi', 'fuel', 'parking', 'traffic-light']
  }),
  icon('airplane', [polygon('2.6,8.2 12.4,3.9 9.6,7.5 12.4,9.2 11.4,10.2 8.6,8.8 7,11.8 6,10.8 6.9,8.1 4,7.3', { fill: 'none' })], {
    aliases: ['ship', 'airplan']
  }),

  icon('cloud-sun', [c(4.6, 5.5, 1.5), p('M4.6 2.8v1.1'), p('M2.7 5.5h1.1'), p('M6.5 5.5h1.1'), p('M3.3 4.2l.8.8'), p('M5.9 4.2l-.8.8'), p('M5.4 11.3h4.6a1.95 1.95 0 0 0 .2-3.9 2.75 2.75 0 0 0-5.35.55 1.6 1.6 0 0 0 .5 3.35z')]),
  icon('cloud-moon', [p('M5.2 3.7a2 2 0 1 0 2.2 2.8A2.6 2.6 0 0 1 5.2 3.7z'), p('M5.3 11.3h4.7a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0 .55 3.45z')]),
  icon('rain', [p('M4.6 10.1h5.3a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0-.05 3.45z'), l(5.6, 11, 5, 12.2), l(7.5, 11, 6.9, 12.2), l(9.4, 11, 8.8, 12.2)]),
  icon('snow', [p('M4.6 10.1h5.3a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0-.05 3.45z'), l(7.5, 10.9, 7.5, 12.2), l(6.9, 11.2, 8.1, 11.9), l(8.1, 11.2, 6.9, 11.9)]),
  icon('storm', [p('M4.6 10.1h5.3a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0-.05 3.45z'), polygon('7.8,10.6 6.4,12.2 7.7,12.2 7.1,13.8 9,11.8 7.8,11.8', { transform: 'translate(0 -1.8)', fill: 'currentColor', stroke: 'none' })]),
  icon('umbrella', [p('M2.8 7.2a4.7 4.7 0 0 1 9.4 0H2.8z'), l(7.5, 7.2, 7.5, 11), p('M7.5 11a1.2 1.2 0 0 0 2.4 0')]),
  icon('fire', [p('M7.5 12c2 0 3.6-1.5 3.6-3.6 0-1.9-1.1-3.2-2.4-4.5-.3.9-1.2 1.6-2.2 1.6 0-1.2-.5-2.1-1.3-2.9-1.5 1.2-2.6 2.9-2.6 5 0 2.4 1.8 4.4 4.9 4.4z')]),
  icon('leaf', [p('M12 3.2C8 3.2 4 5.4 3.2 9.8 2.9 11.2 3.8 12 5.2 11.8 9.6 11 11.8 7 11.8 3c0 .1 0 .2.2.2z'), p('M4.3 10.9c2.7-2.6 4.2-4.2 6.8-6.8')], {
    aliases: ['tree', 'flower']
  }),
  icon('gift', [r(2.7, 6.1, 9.6, 6.2, { rx: 1 }), l(7.5, 6.1, 7.5, 12.3), l(2.7, 8.4, 12.3, 8.4), p('M7.5 6.1H4.9a1.4 1.4 0 1 1 0-2.8c1.4 0 2.2 1 2.6 2.8z'), p('M7.5 6.1h2.6a1.4 1.4 0 1 0 0-2.8c-1.4 0-2.2 1-2.6 2.8z')], {
    aliases: ['gift-card']
  }),
  icon('trophy', [p('M4.2 3.1h6.6v1.4a3.3 3.3 0 0 1-6.6 0z'), p('M4.2 4H2.9a1.3 1.3 0 0 0 1.3 1.9h.7'), p('M10.8 4h1.3a1.3 1.3 0 0 1-1.3 1.9h-.7'), p('M7.5 8.1v2.1'), r(5.7, 10.2, 3.6, 2.1, { rx: 0.5 })], {
    aliases: ['medal', 'award']
  }),
  icon('crown', [polygon('2.8,10.7 3.7,4.5 6.2,7.1 7.5,3.9 8.8,7.1 11.3,4.5 12.2,10.7'), l(3.6, 12.1, 11.4, 12.1)]),
  icon('rocket', [p('M9.8 3.2c-2.4 0-4.4 1.9-5.2 4.8L3 9.6l2.4-.3 1.7 1.7-.3 2.4 1.6-1.6c2.9-.8 4.8-2.8 4.8-5.2V3.2z'), c(9.1, 5.7, 0.75), p('M4.7 10.3 2.8 12.2')]),
  icon('coffee', [p('M3.2 5.2h6.9v3a2.5 2.5 0 0 1-2.5 2.5H5.7a2.5 2.5 0 0 1-2.5-2.5z'), p('M10.1 6.3h1a1.4 1.4 0 0 1 0 2.8h-1'), l(2.8, 12.1, 10.8, 12.1)], {
    aliases: ['tea', 'pizza', 'burger', 'apple', 'cake', 'ice-cream']
  }),

  icon('phone-call', [p('M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8'), p('M9 3.7a3 3 0 0 1 2.3 2.3'), p('M8.6 5.4a1.4 1.4 0 0 1 1 1')]),
  icon('phone-missed', [p('M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8'), l(8.8, 3.2, 12.2, 6.6), l(12.2, 3.2, 8.8, 6.6)]),
  icon('chat', [r(2.8, 3.2, 9.4, 6.9, { rx: 1.1 }), p('M6.2 10.1 5 12l.3-2')], {
    aliases: ['chat-bubble', 'comment', 'whatsapp', 'telegram-cursor', 'discord']
  }),
  icon('comments', [r(2.6, 3, 7.7, 5.7, { rx: 0.9 }), p('M4.8 8.7 4 10.7l2-.9'), r(5.8, 6.3, 6.6, 4.7, { rx: 0.9 })], {
    aliases: ['forum', 'slack']
  }),
  icon('megaphone', [polygon('3.2,7.1 9.6,4.6 9.6,10.4 3.2,7.9', { fill: 'none' }), l(9.6, 5.6, 11.5, 5.1), l(9.6, 9.4, 11.5, 9.9), r(3.2, 7.1, 1.8, 3.6, { rx: 0.45 })], {
    aliases: ['broadcast', 'rss', 'twitter', 'facebook', 'instagram', 'linkedin', 'youtube']
  }),

  icon('printer', [r(3.1, 4, 8.8, 3.2, { rx: 0.7 }), r(4.2, 2.8, 6.6, 2.2, { rx: 0.5 }), r(4.2, 8.6, 6.6, 3.6, { rx: 0.5 }), c(10, 5.6, 0.45, { fill: 'currentColor', stroke: 'none' }), l(5.2, 10, 9, 10)]),
  icon('monitor', [r(2.8, 3.2, 9.4, 6.6, { rx: 1 }), l(6.1, 12.2, 8.9, 12.2), l(7.5, 9.8, 7.5, 12.2)], {
    aliases: ['screen']
  }),
  icon('laptop', [r(3.1, 3.3, 8.8, 5.9, { rx: 0.8 }), p('M2.5 10.2h10a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1')], {
    aliases: ['notebook']
  }),
  icon('tablet', [r(4.1, 2.7, 6.8, 9.8, { rx: 1.1 }), c(7.5, 10.7, 0.45, { fill: 'currentColor', stroke: 'none' })]),
  icon('smartphone', [r(4.5, 2.5, 6, 10.4, { rx: 1.1 }), c(7.5, 10.6, 0.45, { fill: 'currentColor', stroke: 'none' })]),

  icon('qr-code', [r(2.8, 2.8, 3.3, 3.3), r(8.9, 2.8, 3.3, 3.3), r(2.8, 8.9, 3.3, 3.3), r(4, 4, 0.9, 0.9, { fill: 'currentColor', stroke: 'none' }), r(10.1, 4, 0.9, 0.9, { fill: 'currentColor', stroke: 'none' }), r(4, 10.1, 0.9, 0.9, { fill: 'currentColor', stroke: 'none' }), r(8.9, 8.9, 1.2, 1.2), r(10.7, 10.7, 1.5, 1.5)], {
    aliases: ['scan-qr']
  }),
  icon('barcode', [l(3.2, 3.5, 3.2, 11.5), l(4.4, 3.5, 4.4, 11.5), l(5.9, 3.5, 5.9, 11.5), l(7.4, 3.5, 7.4, 11.5), l(8.4, 3.5, 8.4, 11.5), l(9.9, 3.5, 9.9, 11.5), l(11.1, 3.5, 11.1, 11.5)], {
    aliases: ['scan']
  }),

  icon('ticket', [p('M2.8 5.1a1.2 1.2 0 0 0 0 2.4v2.8h9.4V7.5a1.2 1.2 0 1 0 0-2.4V2.8H2.8z'), l(7.5, 2.8, 7.5, 10.3)], {
    aliases: ['pass', 'badge']
  }),
  icon('id-card', [r(2.8, 3.6, 9.4, 7.8, { rx: 1 }), c(5.2, 7.2, 1.1), p('M3.8 10c.3-.9 1.1-1.4 1.9-1.4.9 0 1.7.5 2 1.4'), l(8.1, 6.2, 10.8, 6.2), l(8.1, 8, 10.8, 8)], {
    aliases: ['passport']
  }),
  icon('briefcase', [r(2.8, 4.3, 9.4, 7.2, { rx: 1 }), r(5.7, 2.8, 3.6, 1.5, { rx: 0.5 }), l(2.8, 7.2, 12.2, 7.2), l(6.7, 7.2, 8.3, 7.2)], {
    aliases: ['suitcase']
  }),
  icon('book', [p('M3.6 3.2h6.6a1.2 1.2 0 0 1 1.2 1.2v7.4H4.2A1.2 1.2 0 0 0 3 13V4.4a1.2 1.2 0 0 1 1.2-1.2z'), l(4.2, 5.2, 9.7, 5.2), l(4.2, 7, 9.7, 7), l(4.2, 8.8, 8.6, 8.8)], {
    aliases: ['book-open', 'library']
  }),
  icon('graduation', [polygon('2.8,6.2 7.5,3.8 12.2,6.2 7.5,8.6', { fill: 'none' }), p('M4.4 7.1v2.1c0 1.1 1.4 2 3.1 2s3.1-.9 3.1-2V7.1'), l(10.7, 7.1, 10.7, 9.3)], {
    aliases: ['school', 'university']
  }),
  icon('brain', [p('M5.4 4a1.9 1.9 0 0 1 3.2-1.4A1.9 1.9 0 0 1 11 5v4.6a1.9 1.9 0 0 1-1.9 1.9 1.9 1.9 0 0 1-1.6-.9 1.9 1.9 0 0 1-3.5-1V5.9A1.9 1.9 0 0 1 5.4 4z')], {
    aliases: ['lightbulb', 'idea']
  }),
  icon('target', [c(7.5, 7.5, 4.6), c(7.5, 7.5, 2.9), c(7.5, 7.5, 1.2), l(10.8, 4.2, 12.2, 2.8)], {
    aliases: ['target-arrow', 'focus', 'selection', 'selection-box', 'selection-multiple', 'focus-ring', 'focus-mode']
  }),
  icon('layers', [polygon('7.5,2.9 12.1,5.4 7.5,7.9 2.9,5.4'), polygon('7.5,6.9 12.1,9.4 7.5,11.9 2.9,9.4')], {
    aliases: ['stack', 'layer-group']
  }),
  icon('box', [p('M7.5 2.9 12 5.2v5.6l-4.5 2.3-4.5-2.3V5.2z'), l(7.5, 7.4, 7.5, 13.1), l(3, 5.2, 7.5, 7.4), l(12, 5.2, 7.5, 7.4)], {
    aliases: ['box-open', 'package', 'panel', 'container']
  }),
  icon('cube', [polygon('7.5,3 11.5,5.2 11.5,9.8 7.5,12 3.5,9.8 3.5,5.2'), l(7.5, 7.2, 7.5, 12), l(3.5, 5.2, 7.5, 7.2), l(11.5, 5.2, 7.5, 7.2)], {
    aliases: ['cubes', 'plugin', 'extension', 'component']
  }),

  icon('toggle-left', [r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }), c(5.1, 7.5, 1.6, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['switch']
  }),
  icon('toggle-right', [r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }), c(9.9, 7.5, 1.6, { fill: 'currentColor', stroke: 'none' })]),
  icon('drag', [c(5.2, 5.2, 0.55, { fill: 'currentColor', stroke: 'none' }), c(7.5, 5.2, 0.55, { fill: 'currentColor', stroke: 'none' }), c(9.8, 5.2, 0.55, { fill: 'currentColor', stroke: 'none' }), c(5.2, 7.5, 0.55, { fill: 'currentColor', stroke: 'none' }), c(7.5, 7.5, 0.55, { fill: 'currentColor', stroke: 'none' }), c(9.8, 7.5, 0.55, { fill: 'currentColor', stroke: 'none' }), c(5.2, 9.8, 0.55, { fill: 'currentColor', stroke: 'none' }), c(7.5, 9.8, 0.55, { fill: 'currentColor', stroke: 'none' }), c(9.8, 9.8, 0.55, { fill: 'currentColor', stroke: 'none' }), l(7.5, 2.8, 7.5, 4.1), l(7.5, 10.9, 7.5, 12.2), l(2.8, 7.5, 4.1, 7.5), l(10.9, 7.5, 12.2, 7.5)], {
    aliases: ['move', 'cursor-drag', 'pointer-drag', 'cursor-move', 'pointer', 'pointer-click', 'cursor-click', 'cursor-hover']
  }),
  icon('resize', [polyline('5.4 3.8 11.2 3.8 11.2 9.6'), polyline('9.6 11.2 3.8 11.2 3.8 5.4'), l(11.2, 3.8, 8.5, 6.5), l(3.8, 11.2, 6.5, 8.5)]),

  icon('align-left', [l(3.2, 4.2, 11.8, 4.2), l(3.2, 6.4, 9.6, 6.4), l(3.2, 8.6, 11.1, 8.6), l(3.2, 10.8, 8.5, 10.8)], {
    aliases: ['text-align-left', 'text-direction-ltr']
  }),
  icon('align-center', [l(3.2, 4.2, 11.8, 4.2), l(4.3, 6.4, 10.7, 6.4), l(3.6, 8.6, 11.4, 8.6), l(4.8, 10.8, 10.2, 10.8)], {
    aliases: ['text-align-center', 'text-align-justify']
  }),
  icon('align-right', [l(3.2, 4.2, 11.8, 4.2), l(5.4, 6.4, 11.8, 6.4), l(3.9, 8.6, 11.8, 8.6), l(6.5, 10.8, 11.8, 10.8)], {
    aliases: ['text-align-right', 'text-direction-rtl']
  }),
  icon('align-top', [l(3.2, 3.4, 11.8, 3.4), r(4, 5.2, 2.2, 6.8, { rx: 0.45 }), r(8.8, 5.2, 2.2, 4.5, { rx: 0.45 })], {
    aliases: ['text-vertical']
  }),
  icon('align-middle', [l(3.2, 7.5, 11.8, 7.5), r(4, 4.5, 2.2, 6, { rx: 0.45 }), r(8.8, 5.6, 2.2, 3.8, { rx: 0.45 })], {
    aliases: ['align-center-vertical']
  }),
  icon('align-bottom', [l(3.2, 11.6, 11.8, 11.6), r(4, 4.8, 2.2, 6.8, { rx: 0.45 }), r(8.8, 7.1, 2.2, 4.5, { rx: 0.45 })]),

  icon('bold', [p('M4.2 3.4h3.6a2 2 0 0 1 0 4H4.2z'), p('M4.2 7.4h4a2 2 0 0 1 0 4h-4z')], {
    aliases: ['heading', 'font', 'typography']
  }),
  icon('italic', [l(6.2, 3.4, 10.2, 3.4), l(4.8, 11.4, 8.8, 11.4), l(9.2, 3.4, 5.8, 11.4)], {
    aliases: ['heading-1', 'font-size', 'typography-alt']
  }),
  icon('underline', [l(4.6, 3.4, 4.6, 7.7), l(10.4, 3.4, 10.4, 7.7), p('M4.6 7.7a2.9 2.9 0 0 0 5.8 0'), l(3.6, 11.6, 11.4, 11.6)], {
    aliases: ['heading-2', 'text-wrap', 'line-height', 'letter-spacing', 'paragraph-spacing']
  }),
  icon('strikethrough', [l(3.6, 7.5, 11.4, 7.5), p('M4.6 5.4a2 2 0 0 1 2-2h1.8a2 2 0 0 1 2 2'), p('M10.4 9.6a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2')], {
    aliases: ['heading-3', 'text-truncate', 'text-rotate']
  }),
  icon('list-ordered', [l(6.2, 4.3, 11.8, 4.3), l(6.2, 7.5, 11.8, 7.5), l(6.2, 10.7, 11.8, 10.7), p('M2.8 4h1V6'), p('M2.8 7.2h1'), p('M2.8 8.3h1a.5.5 0 0 1 .5.5v.4a.5.5 0 0 1-.5.5h-1')], {
    aliases: ['checklist', 'indent', 'outdent']
  }),
  icon('list-unordered', [c(3.4, 4.3, 0.5, { fill: 'currentColor', stroke: 'none' }), c(3.4, 7.5, 0.5, { fill: 'currentColor', stroke: 'none' }), c(3.4, 10.7, 0.5, { fill: 'currentColor', stroke: 'none' }), l(6.2, 4.3, 11.8, 4.3), l(6.2, 7.5, 11.8, 7.5), l(6.2, 10.7, 11.8, 10.7)], {
    aliases: ['paragraph', 'quote']
  }),
  icon('keyboard', [r(2.8, 4.1, 9.4, 6.8, { rx: 0.9 }), l(4, 6, 10.9, 6), l(4, 7.8, 10.9, 7.8), l(4.8, 9.6, 10.2, 9.6)], {
    aliases: ['mouse', 'gamepad', 'controller', 'plug', 'usb', 'bluetooth']
  }),
  icon('branch', [c(4.4, 3.8, 1), c(10.6, 4.6, 1), c(10.6, 10.9, 1), l(5.4, 3.8, 8.6, 3.8), p('M8.6 3.8a2 2 0 0 1 2 2v4.1')], {
    aliases: ['merge', 'split', 'commit', 'pull-request', 'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'cloudflare', 'aws', 'azure', 'google-cloud']
  }),
  icon('accessibility', [c(7.5, 4, 1), l(7.5, 5.2, 7.5, 9.8), l(4.8, 6.7, 10.2, 6.7), l(5.1, 12, 7.5, 9.8), l(9.9, 12, 7.5, 9.8)], {
    aliases: ['accessibility-alt']
  }),
  icon('contrast', [c(7.5, 7.5, 4.7), p('M7.5 2.8a4.7 4.7 0 0 1 0 9.4z')], {
    aliases: ['contrast-high', 'contrast-low', 'theme', 'theme-dark', 'theme-light']
  }),
  icon('palette', [c(7.5, 7.5, 4.7), c(5.2, 6.1, 0.65, { fill: 'currentColor', stroke: 'none' }), c(7.4, 5.1, 0.65, { fill: 'currentColor', stroke: 'none' }), c(9.6, 6.1, 0.65, { fill: 'currentColor', stroke: 'none' }), p('M10.4 9.9c.6 0 1.1.5 1.1 1.1A1.9 1.9 0 0 1 9.6 13c-2.9 0-6.8-1.9-6.8-5.5A4.7 4.7 0 0 1 7.5 2.8')], {
    aliases: ['palette-alt', 'adobe', 'figma', 'sketch']
  }),
  icon('border', [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), l(3.1, 3.1, 11.9, 3.1), l(3.1, 11.9, 11.9, 11.9), l(3.1, 3.1, 3.1, 11.9), l(11.9, 3.1, 11.9, 11.9)], {
    aliases: ['border-all', 'border-top', 'border-bottom', 'border-left', 'border-right', 'border-none', 'border-radius', 'border-radius-top', 'border-radius-bottom']
  }),
  icon('shadow', [r(3.2, 3.2, 7.2, 7.2, { rx: 0.8 }), p('M4.8 11.9h6.8a2.2 2.2 0 0 0-2.2-2.2H2.6a2.2 2.2 0 0 0 2.2 2.2z')], {
    aliases: ['shadow-sm', 'shadow-md', 'shadow-lg', 'elevation-1', 'elevation-2', 'elevation-3', 'elevation-4', 'opacity', 'transparency', 'blur', 'backdrop-blur', 'backdrop-opacity', 'glass', 'glass-effect']
  }),
  icon('spinner', [p('M7.5 2.8a4.7 4.7 0 1 0 4.7 4.7'), l(7.5, 2.8, 7.5, 4.4)], {
    aliases: ['loading', 'loading-dots', 'loading-bars', 'loading-ring', 'skeleton', 'skeleton-text', 'skeleton-avatar', 'progress', 'progress-bar', 'progress-circle', 'progress-step', 'stepper', 'stepper-horizontal', 'stepper-vertical', 'wizard', 'wizard-step', 'tab', 'tab-active', 'tab-inactive', 'tab-add', 'accordion', 'accordion-open', 'accordion-close', 'collapse-horizontal', 'collapse-vertical']
  }),
  icon('tooltip', [r(2.8, 3.2, 9.4, 6.4, { rx: 1 }), p('M6.4 9.6 5.4 11.8l2-.9'), l(7.5, 5.2, 7.5, 6.6), c(7.5, 8, 0.5, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['tooltip-top', 'tooltip-bottom', 'tooltip-left', 'tooltip-right', 'popover', 'modal', 'modal-open', 'modal-close', 'drawer', 'drawer-left', 'drawer-right', 'toast', 'snackbar', 'banner', 'alert-banner', 'chip-filled', 'chip-outline', 'badge-dot', 'badge-number', 'avatar', 'avatar-group', 'avatar-add', 'breadcrumb', 'breadcrumb-separator', 'pagination', 'pagination-first', 'pagination-last', 'pagination-next', 'pagination-prev']
  }),



  // Promoted semantic terms as dedicated icons.
  icon('dropdown', [r(3, 3.3, 9, 8.4, { rx: 1 }), polyline('5.1 6.5 7.5 8.9 9.9 6.5')], {
    aliases: ['dropdown-open', 'dropdown-close', 'combobox', 'autocomplete', 'autocomplete-multiple']
  }),
  icon('select', [r(3, 3.3, 9, 8.4, { rx: 1 }), p('M5.2 8.1 6.8 9.7 9.8 6.7')], {
    aliases: ['select-multiple', 'multiselect']
  }),
  icon('radio', [c(7.5, 7.5, 4.5), c(7.5, 7.5, 1.6, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['radio-checked']
  }),
  icon('checkbox', [r(3.2, 3.2, 8.6, 8.6, { rx: 1.1 }), p('M5.1 7.7 6.7 9.3 9.8 6.2')], {
    aliases: ['checkbox-checked', 'checkbox-indeterminate']
  }),
  icon('switch-on', [r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }), c(9.9, 7.5, 1.5, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['toggle-on']
  }),
  icon('switch-off', [r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }), c(5.1, 7.5, 1.5, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['toggle-off']
  }),
  icon('input', [r(2.8, 4.6, 9.4, 5.8, { rx: 1 }), l(4.5, 7.5, 10.5, 7.5)], {
    aliases: ['input-text', 'input-number', 'input-password', 'input-search', 'input-error', 'input-success', 'input-warning', 'font-color']
  }),
  icon('form', [r(3, 2.8, 9, 9.6, { rx: 1 }), l(5, 5.1, 10, 5.1), l(5, 7.4, 10, 7.4), l(5, 9.7, 8.3, 9.7)], {
    aliases: ['form-group', 'form-section']
  }),
  icon('validation', [c(7.5, 7.5, 4.6), p('M5.2 7.6 6.9 9.3 9.9 6.3')], {
    aliases: ['validation-success', 'validation-error', 'validation-warning']
  }),
  icon('error-state', [c(7.5, 7.5, 4.6), l(5.7, 5.7, 9.3, 9.3), l(9.3, 5.7, 5.7, 9.3)], {
    aliases: ['state-error']
  }),
  icon('empty-state', [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), l(5.2, 7.5, 9.8, 7.5)], {
    aliases: ['state-empty']
  }),
  icon('success-state', [c(7.5, 7.5, 4.6), p('M5.2 7.6 6.9 9.3 9.9 6.3')], {
    aliases: ['state-success']
  }),
  icon('hover-state', [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), c(7.5, 7.5, 1.2, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['active-state', 'disabled-state', 'state-default', 'state-hover', 'state-active', 'state-focus', 'state-disabled']
  }),
  icon('divider', [l(2.9, 7.5, 12.1, 7.5)], {
    aliases: ['divider-horizontal', 'divider-vertical', 'spacer']
  }),
  icon('responsive', [r(2.9, 3.6, 7.2, 5.2, { rx: 0.8 }), r(10.5, 4.5, 2.6, 6.2, { rx: 0.7 }), l(4.9, 11.2, 8.1, 11.2)], {
    aliases: ['responsive-mobile', 'responsive-tablet', 'responsive-desktop', 'breakpoint', 'breakpoint-sm', 'breakpoint-md', 'breakpoint-lg', 'container-fluid', 'viewport', 'viewport-fit', 'safe-area']
  }),
  icon('aspect-ratio', [r(2.8, 3.4, 9.4, 8.2, { rx: 1 }), l(4.2, 10.2, 10.8, 4.6)], {
    aliases: ['ratio-16-9', 'ratio-4-3']
  }),
  icon('expand-horizontal', [l(3.3, 7.5, 11.7, 7.5), polyline('5 5.8 3.3 7.5 5 9.2'), polyline('10 5.8 11.7 7.5 10 9.2')], {
    aliases: ['expand-vertical']
  }),
  icon('layout-stack', [r(3.2, 3.1, 8.6, 3, { rx: 0.7 }), r(3.2, 7.1, 8.6, 3, { rx: 0.7 }), r(3.2, 11.1, 8.6, 1.8, { rx: 0.7 })], {
    aliases: ['layout-inline', 'layout-centered', 'layout-split', 'layout-overlay', 'layout-floating', 'masonry', 'flex-layout', 'auto-layout']
  }),
  icon('layer-lock', [polygon('7.5,2.8 11.4,4.9 11.4,9.3 7.5,11.4 3.6,9.3 3.6,4.9'), r(6.4, 7.2, 2.2, 2.3, { rx: 0.4 }), p('M6.9 7.2V6.6a1.1 1.1 0 1 1 2.2 0v.6')], {
    aliases: ['layer-unlock', 'layer-front', 'layer-back', 'z-index']
  }),
  icon('frame', [l(2.8, 5.6, 2.8, 2.8), l(2.8, 2.8, 5.6, 2.8), l(9.4, 2.8, 12.2, 2.8), l(12.2, 2.8, 12.2, 5.6), l(12.2, 9.4, 12.2, 12.2), l(12.2, 12.2, 9.4, 12.2), l(5.6, 12.2, 2.8, 12.2), l(2.8, 12.2, 2.8, 9.4)], {
    aliases: ['frame-alt', 'artboard', 'wireframe', 'mockup', 'prototype', 'prototype-link', 'ui-kit']
  }),
  icon('interaction', [c(7.5, 7.5, 4.6), p('M7.5 4.6v2.9l2 1.2'), l(10.9, 3.9, 12.1, 2.7)], {
    aliases: ['interaction-click', 'interaction-hover', 'microinteraction', 'motion', 'gesture', 'gesture-swipe', 'gesture-tap', 'gesture-pinch', 'gesture-zoom', 'hand', 'hand-pointer', 'hand-grab', 'hand-release']
  }),
  icon('animation', [c(7.5, 7.5, 4.6), polyline('7.5 4.6 10.4 7.5 7.5 10.4')], {
    aliases: ['animation-fade', 'animation-slide', 'animation-scale', 'animation-rotate', 'transition', 'transition-fast', 'transition-slow', 'easing', 'easing-in', 'easing-out', 'easing-in-out']
  }),
  icon('scroll', [r(5.7, 2.8, 3.6, 9.9, { rx: 1.6 }), l(7.5, 4.2, 7.5, 10.8), polyline('6.6 5.1 7.5 4.2 8.4 5.1'), polyline('6.6 9.9 7.5 10.8 8.4 9.9')], {
    aliases: ['scroll-horizontal', 'scroll-vertical', 'infinite-scroll', 'virtual-scroll', 'sticky', 'sticky-top', 'sticky-bottom']
  }),
  icon('anchor', [l(7.5, 3, 7.5, 11.8), c(7.5, 3, 1), p('M3.6 8.2h7.8a2.4 2.4 0 0 1-4.8 0')], {
    aliases: ['anchor-link', 'anchor-broken', 'hotspot']
  }),
  icon('design-token', [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), c(5.5, 5.5, 0.7, { fill: 'currentColor', stroke: 'none' }), c(7.5, 7.5, 0.7, { fill: 'currentColor', stroke: 'none' }), c(9.5, 9.5, 0.7, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['color-token', 'spacing-token', 'font-token', 'icon-token', 'variable', 'variable-alt', 'component-instance', 'component-master', 'variant', 'variant-alt']
  }),
  icon('alignment', [l(3, 4.2, 12, 4.2), l(4.2, 6.4, 10.8, 6.4), l(3.6, 8.6, 11.4, 8.6), l(5.1, 10.8, 9.9, 10.8)], {
    aliases: ['alignment-horizontal', 'alignment-vertical', 'distribute-horizontal', 'distribute-vertical', 'auto-spacing', 'wrap', 'unwrap', 'overflow', 'overflow-hidden', 'overflow-scroll', 'clipping-mask', 'mask', 'mask-inverse', 'gradient', 'gradient-linear', 'gradient-radial', 'gradient-conic', 'fill', 'stroke', 'stroke-width', 'stroke-dash', 'icon-outline', 'icon-filled', 'icon-duotone', 'icon-rounded', 'icon-sharp', 'icon-thin', 'icon-bold', 'pixel-grid', 'vector', 'vector-pen', 'bezier', 'path', 'path-merge', 'path-subtract', 'path-intersect', 'path-exclude', 'corner', 'corner-round', 'corner-cut', 'corner-smooth', 'ruler', 'ruler-horizontal', 'ruler-vertical', 'guide', 'guide-horizontal', 'guide-vertical', 'snapping', 'snapping-grid', 'snapping-object', 'docking', 'docking-left', 'docking-right', 'docking-top', 'docking-bottom']
  }),
  icon('preview', [r(2.8, 3.4, 9.4, 8.2, { rx: 1 }), c(7.5, 7.5, 1.7), c(7.5, 7.5, 0.7, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['preview-device', 'preview-mobile', 'preview-tablet', 'preview-desktop', 'preview-live']
  }),
  icon('inspect', [r(2.8, 3.4, 7.8, 7.8, { rx: 1 }), c(9.5, 9.5, 2), l(10.9, 10.9, 12.3, 12.3)], {
    aliases: ['inspect-element', 'inspect-code', 'accessibility-contrast', 'accessibility-font', 'accessibility-zoom', 'accessibility-audio', 'accessibility-visual', 'keyboard-navigation', 'tab-order', 'aria', 'aria-label', 'aria-hidden', 'focus-trap', 'screen-reader', 'screen-reader-only', 'audit', 'audit-ui', 'audit-performance', 'lighthouse', 'debug', 'debug-grid', 'debug-layout', 'debug-spacing', 'performance', 'performance-ui', 'performance-render', 'memory-usage', 'fps', 'benchmark', 'optimization', 'optimization-auto', 'optimization-manual-admin']
  }),
  // Icon Sets: Objects, Abstract, Logos, Alignment, Borders/Corners, Arrows, Design, Typography.
  icon('object-sphere', [c(7.5, 7.5, 4.7), l(2.8, 7.5, 12.2, 7.5), p('M7.5 2.8c1.2 1.25 1.9 2.95 1.9 4.7s-.7 3.45-1.9 4.7'), p('M7.5 2.8C6.3 4.05 5.6 5.75 5.6 7.5s.7 3.45 1.9 4.7')], {
    categories: ['objects']
  }),
  icon('object-cylinder', [p('M3.8 4.6c0-1.25 1.65-2.2 3.7-2.2s3.7.95 3.7 2.2-1.65 2.2-3.7 2.2-3.7-.95-3.7-2.2z'), l(3.8, 4.6, 3.8, 10.3), l(11.2, 4.6, 11.2, 10.3), p('M3.8 10.3c0 1.25 1.65 2.2 3.7 2.2s3.7-.95 3.7-2.2')], {
    categories: ['objects']
  }),
  icon('object-cone', [p('M7.5 2.8 3.9 10.2'), p('M7.5 2.8 11.1 10.2'), p('M3.8 10.2c0-1.1 1.65-2 3.7-2s3.7.9 3.7 2-1.65 2-3.7 2-3.7-.9-3.7-2z')], {
    categories: ['objects']
  }),
  icon('object-pyramid', [polygon('7.5,2.9 11.9,10.8 3.1,10.8'), l(7.5, 2.9, 7.5, 10.8), l(3.1, 10.8, 11.9, 10.8)], {
    categories: ['objects']
  }),
  icon('object-prism', [polygon('4.3,3.2 9.3,3.2 11.7,6.4 6.7,6.4'), polygon('4.3,3.2 4.3,9.8 9.3,9.8 9.3,3.2'), polygon('9.3,3.2 11.7,6.4 11.7,12.2 9.3,9.8')], {
    categories: ['objects']
  }),
  icon('object-cube-wire', [polygon('4,4.1 8.1,4.1 8.1,8.2 4,8.2'), polygon('6.9,2.8 11,2.8 11,6.9 6.9,6.9'), l(8.1, 4.1, 11, 2.8), l(8.1, 8.2, 11, 6.9), l(4, 4.1, 6.9, 2.8), l(4, 8.2, 6.9, 6.9)], {
    categories: ['objects']
  }),
  icon('object-ring', [c(7.5, 7.5, 4.7), c(7.5, 7.5, 2.2)], {
    categories: ['objects']
  }),
  icon('object-orbital', [c(7.5, 7.5, 0.8, { fill: 'currentColor', stroke: 'none' }), p('M2.8 7.5c1.5-2.7 3.2-4.1 4.7-4.1s3.2 1.4 4.7 4.1c-1.5 2.7-3.2 4.1-4.7 4.1S4.3 10.2 2.8 7.5z'), p('M7.5 2.8c2.7 1.5 4.1 3.2 4.1 4.7s-1.4 3.2-4.1 4.7c-2.7-1.5-4.1-3.2-4.1-4.7s1.4-3.2 4.1-4.7')], {
    categories: ['objects']
  }),

  icon('abstract-waves', [p('M2.8 5.2c1.1-1 2.1-1 3.2 0s2.1 1 3.2 0 2.1-1 3.2 0'), p('M2.8 7.5c1.1-1 2.1-1 3.2 0s2.1 1 3.2 0 2.1-1 3.2 0'), p('M2.8 9.8c1.1-1 2.1-1 3.2 0s2.1 1 3.2 0 2.1-1 3.2 0')], {
    categories: ['abstract']
  }),
  icon('abstract-spiral', [p('M7.5 2.9a4.6 4.6 0 1 0 4.6 4.6c0-1.8-1.4-3.2-3.2-3.2s-3.2 1.4-3.2 3.2 1.2 2.9 2.9 2.9')], {
    categories: ['abstract']
  }),
  icon('abstract-blob', [p('M3.4 7.6c0-2.3 1.6-4.3 4-4.3 2.7 0 4.2 1.9 4.2 4 0 2.4-1.7 4.4-4.1 4.4-2.5 0-4.1-1.7-4.1-4.1z')], {
    categories: ['abstract']
  }),
  icon('abstract-orbit', [c(7.5, 7.5, 0.65, { fill: 'currentColor', stroke: 'none' }), p('M2.8 7.5c1.3-2.5 2.9-3.8 4.7-3.8s3.4 1.3 4.7 3.8c-1.3 2.5-2.9 3.8-4.7 3.8S4.1 10 2.8 7.5z'), p('M7.5 2.8c2.5 1.3 3.8 2.9 3.8 4.7s-1.3 3.4-3.8 4.7c-2.5-1.3-3.8-2.9-3.8-4.7s1.3-3.4 3.8-4.7')], {
    categories: ['abstract']
  }),
  icon('abstract-mesh', [c(4.1, 4.1, 0.55, { fill: 'currentColor', stroke: 'none' }), c(10.9, 4.1, 0.55, { fill: 'currentColor', stroke: 'none' }), c(7.5, 7.5, 0.55, { fill: 'currentColor', stroke: 'none' }), c(4.1, 10.9, 0.55, { fill: 'currentColor', stroke: 'none' }), c(10.9, 10.9, 0.55, { fill: 'currentColor', stroke: 'none' }), l(4.1, 4.1, 7.5, 7.5), l(10.9, 4.1, 7.5, 7.5), l(4.1, 10.9, 7.5, 7.5), l(10.9, 10.9, 7.5, 7.5), l(4.1, 4.1, 10.9, 4.1), l(4.1, 10.9, 10.9, 10.9)], {
    categories: ['abstract']
  }),
  icon('abstract-fractal', [l(7.5, 12.2, 7.5, 8.6), l(7.5, 8.6, 5.1, 6.2), l(7.5, 8.6, 9.9, 6.2), l(5.1, 6.2, 3.6, 4.7), l(5.1, 6.2, 6.6, 4.7), l(9.9, 6.2, 8.4, 4.7), l(9.9, 6.2, 11.4, 4.7)], {
    categories: ['abstract']
  }),

  icon('logo-github', [c(7.5, 7.5, 4.7), p('M5.3 10.2v-1.4c-1.6.3-2-.7-2-.7-.3-.8-.8-1-1-1.1.8-.1 1.2.5 1.2.5.7 1.1 1.8.8 2.3.6.1-.5.3-.8.5-1-1.3-.1-2.7-.6-2.7-2.7 0-.6.2-1.2.5-1.6-.1-.1-.2-.8.1-1.6 0 0 .5-.2 1.7.6a5.7 5.7 0 0 1 3 0c1.2-.8 1.7-.6 1.7-.6.3.8.2 1.5.1 1.6.3.4.5 1 .5 1.6 0 2.1-1.4 2.6-2.7 2.7.2.2.4.6.4 1.2v1.8')], {
    categories: ['logos']
  }),
  icon('logo-gitlab', [polygon('7.5,2.8 9.1,6.6 5.9,6.6', { fill: 'none' }), polygon('2.8,6.6 5.9,6.6 4.5,10.9', { fill: 'none' }), polygon('12.2,6.6 9.1,6.6 10.5,10.9', { fill: 'none' }), polygon('4.5,10.9 10.5,10.9 7.5,13.2', { fill: 'none' })], {
    categories: ['logos']
  }),
  icon('logo-bitbucket', [p('M3.2 3.2h8.6l-1.1 7.8H4.3z'), p('M5.6 5.9h4.6l-.6 3.7H6.2z')], {
    categories: ['logos']
  }),
  icon('logo-figma', [r(5.7, 2.8, 3.6, 2.2, { rx: 1.1 }), r(5.7, 5, 3.6, 2.2, { rx: 1.1 }), r(5.7, 7.2, 3.6, 2.2, { rx: 1.1 }), c(9.3, 6.1, 1.1), c(5.7, 10.5, 1.1)], {
    categories: ['logos']
  }),
  icon('logo-slack', [r(3.1, 6.5, 2.3, 4.7, { rx: 1.1 }), r(4.9, 3.1, 4.7, 2.3, { rx: 1.1 }), r(9.6, 3.8, 2.3, 4.7, { rx: 1.1 }), r(3.8, 9.6, 4.7, 2.3, { rx: 1.1 })], {
    categories: ['logos']
  }),
  icon('logo-discord', [r(2.8, 4.2, 9.4, 6.5, { rx: 2.2 }), c(6, 7.5, 0.6, { fill: 'currentColor', stroke: 'none' }), c(9, 7.5, 0.6, { fill: 'currentColor', stroke: 'none' }), p('M4.4 5.7a7.2 7.2 0 0 1 1.3-.6'), p('M10.6 5.7a7.2 7.2 0 0 0-1.3-.6')], {
    categories: ['logos']
  }),
  icon('logo-linkedin', [r(2.8, 2.8, 9.4, 9.4, { rx: 1.2 }), c(5.1, 5.1, 0.65, { fill: 'currentColor', stroke: 'none' }), l(5.1, 6.3, 5.1, 10.8), p('M7 10.8V7.7c0-1.1.8-1.8 1.8-1.8s1.8.7 1.8 1.8v3.1'), l(8.8, 8.1, 8.8, 10.8)], {
    categories: ['logos']
  }),
  icon('logo-youtube', [r(2.8, 4.1, 9.4, 6.8, { rx: 1.8 }), polygon('6.6,6 10,7.5 6.6,9')], {
    categories: ['logos']
  }),

  icon('align-h-center-distribute', [l(3, 4.2, 12, 4.2), l(3, 10.8, 12, 10.8), r(5.6, 6.2, 1.8, 2.6, { rx: 0.3 }), r(8.6, 6.2, 1.8, 2.6, { rx: 0.3 }), l(4.5, 6.2, 4.5, 8.8), l(11.6, 6.2, 11.6, 8.8)], {
    categories: ['alignment']
  }),
  icon('align-v-center-distribute', [l(4.2, 3, 4.2, 12), l(10.8, 3, 10.8, 12), r(6.2, 5.6, 2.6, 1.8, { rx: 0.3 }), r(6.2, 8.6, 2.6, 1.8, { rx: 0.3 }), l(6.2, 4.5, 8.8, 4.5), l(6.2, 11.6, 8.8, 11.6)], {
    categories: ['alignment']
  }),
  icon('align-baseline-typography', [l(3, 10.9, 12, 10.9), p('M4.1 9.7 6.1 4.2 8.1 9.7'), l(5, 7.3, 7.2, 7.3), l(9.2, 5.1, 9.2, 9.7), p('M9.2 6.3a1.2 1.2 0 0 1 1.2-1.2')], {
    categories: ['alignment']
  }),
  icon('align-stretch-box', [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), r(5, 4.2, 5, 6.6, { rx: 0.5 }), l(3.1, 7.5, 12, 7.5)], {
    categories: ['alignment']
  }),
  icon('align-pack-start', [l(3.2, 4.1, 11.8, 4.1), r(3.6, 5.6, 2.1, 4.8, { rx: 0.4 }), r(6.4, 6.6, 2.1, 3.8, { rx: 0.4 }), r(9.2, 7.6, 2.1, 2.8, { rx: 0.4 })], {
    categories: ['alignment']
  }),
  icon('align-pack-end', [l(3.2, 11.9, 11.8, 11.9), r(3.6, 7.1, 2.1, 4.8, { rx: 0.4 }), r(6.4, 8.1, 2.1, 3.8, { rx: 0.4 }), r(9.2, 9.1, 2.1, 2.8, { rx: 0.4 })], {
    categories: ['alignment']
  }),

  icon('border-style-dashed', [r(3.1, 3.1, 8.8, 8.8, { rx: 1, strokeDasharray: '2 1.4' })], {
    categories: ['borders-corners']
  }),
  icon('border-style-dotted', [r(3.1, 3.1, 8.8, 8.8, { rx: 1, strokeDasharray: '0.6 1.3' })], {
    categories: ['borders-corners']
  }),
  icon('border-style-double', [r(2.8, 2.8, 9.4, 9.4, { rx: 1.1 }), r(4.2, 4.2, 6.6, 6.6, { rx: 0.8 })], {
    categories: ['borders-corners']
  }),
  icon('border-radius-all', [r(3.1, 3.1, 8.8, 8.8, { rx: 2.2 }), l(7.5, 2.8, 7.5, 4.1), l(7.5, 10.9, 7.5, 12.2)], {
    categories: ['borders-corners']
  }),
  icon('border-radius-corners', [r(3.1, 3.1, 8.8, 8.8, { rx: 0.6 }), p('M3.1 6.5a3.4 3.4 0 0 1 3.4-3.4'), p('M11.9 8.5a3.4 3.4 0 0 1-3.4 3.4')], {
    categories: ['borders-corners']
  }),
  icon('corner-cut-style', [polygon('3.1,3.1 9.8,3.1 11.9,5.2 11.9,11.9 3.1,11.9')], {
    categories: ['borders-corners']
  }),

  icon('arrow-bend-up-right', [l(3.2, 11.8, 8.6, 6.4), polyline('8.6 9.1 8.6 6.4 11.3 6.4')], {
    categories: ['arrows']
  }),
  icon('arrow-bend-down-right', [l(3.2, 3.2, 8.6, 8.6), polyline('8.6 5.9 8.6 8.6 11.3 8.6')], {
    categories: ['arrows']
  }),
  icon('arrow-uturn-left', [p('M10.8 3.6H6.4a2.8 2.8 0 0 0-2.8 2.8v2.2'), polyline('5.1 6.6 3.6 8.1 2.1 6.6')], {
    categories: ['arrows']
  }),
  icon('arrow-uturn-right', [p('M4.2 3.6h4.4a2.8 2.8 0 0 1 2.8 2.8v2.2'), polyline('9.9 6.6 11.4 8.1 12.9 6.6')], {
    categories: ['arrows']
  }),
  icon('arrow-swap-horizontal', [l(3.1, 5.1, 11.9, 5.1), polyline('9.8 3 11.9 5.1 9.8 7.2'), l(11.9, 9.9, 3.1, 9.9), polyline('5.2 7.8 3.1 9.9 5.2 12')], {
    categories: ['arrows']
  }),
  icon('arrow-swap-vertical', [l(5.1, 3.1, 5.1, 11.9), polyline('3 9.8 5.1 11.9 7.2 9.8'), l(9.9, 11.9, 9.9, 3.1), polyline('7.8 5.2 9.9 3.1 12 5.2')], {
    categories: ['arrows']
  }),
  icon('arrow-circle-cw', [c(7.5, 7.5, 4.7), p('M7.5 4.1a3.4 3.4 0 1 1-2.4 1'), polyline('4.1 4.2 5.8 4.2 5.8 2.5')], {
    categories: ['arrows']
  }),
  icon('arrow-circle-ccw', [c(7.5, 7.5, 4.7), p('M7.5 4.1a3.4 3.4 0 1 0 2.4 1'), polyline('10.9 4.2 9.2 4.2 9.2 2.5')], {
    categories: ['arrows']
  }),

  icon('design-pen-tool', [c(4.1, 4.1, 0.7), c(10.9, 4.1, 0.7), c(7.5, 10.9, 0.7), l(4.8, 4.8, 7, 10.2), l(10.2, 4.8, 8, 10.2), l(4.8, 4.1, 10.2, 4.1)], {
    categories: ['design']
  }),
  icon('design-eyedropper', [p('M10.8 4.2a1.8 1.8 0 0 0-2.5 0L6.8 5.7l2.5 2.5 1.5-1.5a1.8 1.8 0 0 0 0-2.5z'), l(6.2, 6.3, 3.2, 9.3), p('M2.8 9.7 2.4 12.2 4.9 11.8')], {
    categories: ['design']
  }),
  icon('design-grid-layout', [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), l(6, 3.1, 6, 11.9), l(9, 3.1, 9, 11.9), l(3.1, 6, 11.9, 6), l(3.1, 9, 11.9, 9)], {
    categories: ['design']
  }),
  icon('design-prototype-link', [r(3.1, 3.1, 3.3, 3.3, { rx: 0.6 }), r(8.6, 8.6, 3.3, 3.3, { rx: 0.6 }), l(6.4, 6.4, 8.6, 8.6), polyline('7.3 8.6 8.6 8.6 8.6 7.3')], {
    categories: ['design']
  }),
  icon('design-magic-wand', [l(3.1, 11.9, 8.9, 6.1), p('M8.9 2.8 9.4 4.3 10.9 4.8 9.4 5.3 8.9 6.8 8.4 5.3 6.9 4.8 8.4 4.3z'), p('M11.3 7.7 11.6 8.6 12.5 8.9 11.6 9.2 11.3 10.1 11 9.2 10.1 8.9 11 8.6z')], {
    categories: ['design']
  }),
  icon('design-ruler-tool', [r(3.1, 4.8, 8.8, 5.4, { rx: 0.8 }), l(4.4, 6.1, 4.4, 8.8), l(5.7, 6.1, 5.7, 7.8), l(7, 6.1, 7, 8.8), l(8.3, 6.1, 8.3, 7.8), l(9.6, 6.1, 9.6, 8.8)], {
    categories: ['design']
  }),
  icon('design-vector-node', [c(4.1, 4.1, 0.6), c(10.9, 4.1, 0.6), c(4.1, 10.9, 0.6), c(10.9, 10.9, 0.6), l(4.7, 4.7, 10.3, 10.3), l(10.3, 4.7, 4.7, 10.3)], {
    categories: ['design']
  }),

  icon('type-uppercase', [p('M3.3 11.9 5.4 4.2 7.5 11.9'), l(4.1, 8.7, 6.7, 8.7), p('M9 4.2h3'), p('M10.5 4.2v7.7')], {
    categories: ['typography']
  }),
  icon('type-lowercase', [p('M3.8 11.9V7.7a2.1 2.1 0 0 1 4.2 0v4.2'), p('M9 8.7h2.6a1.6 1.6 0 1 1 0 3.2H9V6.4')], {
    categories: ['typography']
  }),
  icon('type-superscript', [p('M3.4 11.9 6 7.7'), l(3.4, 7.7, 6, 11.9), p('M8.7 5.2h2.7'), p('M10.05 5.2V2.8')], {
    categories: ['typography']
  }),
  icon('type-subscript', [p('M3.4 10.8 6 6.6'), l(3.4, 6.6, 6, 10.8), p('M8.6 10.2h2.8'), p('M9.2 12.1h2.2')], {
    categories: ['typography']
  }),
  icon('type-letter-spacing', [p('M3.4 11.9 5.1 4.2 6.8 11.9'), l(3.9, 8.7, 6.3, 8.7), l(9, 4.2, 9, 11.9), polyline('8 5.2 9 4.2 10 5.2'), polyline('8 10.9 9 11.9 10 10.9')], {
    categories: ['typography']
  }),
  icon('type-line-height', [l(3.2, 5.2, 11.8, 5.2), l(3.2, 9.8, 11.8, 9.8), l(7.5, 3.2, 7.5, 11.8), polyline('6.5 4.2 7.5 3.2 8.5 4.2'), polyline('6.5 10.8 7.5 11.8 8.5 10.8')], {
    categories: ['typography']
  }),
  icon('type-text-direction', [l(3.2, 4.8, 9.2, 4.8), l(3.2, 7.5, 9.2, 7.5), l(3.2, 10.2, 9.2, 10.2), polyline('8.1 3.7 9.2 4.8 8.1 5.9'), polyline('10.8 9.1 9.7 10.2 10.8 11.3')], {
    categories: ['typography']
  }),
  // End promoted semantic terms.
  // Promoted domain semantic terms as dedicated icons.
  icon('admin-panel', [r(2.8, 3.1, 9.4, 8.8, { rx: 1 }), r(3.3, 3.6, 2.3, 7.8, { rx: 0.5 }), l(6.4, 5.1, 11.4, 5.1), l(6.4, 7.4, 11.4, 7.4), l(6.4, 9.7, 10.1, 9.7)], {
    aliases: ['super-admin', 'organization', 'organization-chart', 'workspace', 'workspace-add', 'workspace-remove', 'tenant', 'tenant-add', 'tenant-switch', 'team-add']
  }),
  icon('role', [c(5.4, 5.1, 1.5), p('M2.9 10.8c.5-1.3 1.5-2 2.8-2s2.3.7 2.8 2'), c(10.7, 5.6, 1.2), l(10.7, 7.2, 10.7, 10.9), l(9.1, 9.3, 12.3, 9.3)], {
    aliases: ['role-admin', 'role-user', 'role-guest', 'permission', 'permission-add', 'permission-remove', 'access-control', 'access-granted', 'access-denied', 'authorization']
  }),
  icon('audit-log', [r(3, 2.8, 9, 9.6, { rx: 1 }), l(5, 5.1, 10, 5.1), l(5, 7.4, 10, 7.4), l(5, 9.7, 8.6, 9.7), c(10.7, 10.7, 1.6), l(11.8, 11.8, 13, 13)], {
    aliases: ['activity-log', 'system-log', 'event-log', 'log', 'log-filter', 'log-search']
  }),
  icon('report', [r(3, 2.8, 9, 9.6, { rx: 1 }), l(5, 5.2, 9.8, 5.2), l(5, 7.5, 10.8, 7.5), l(5, 9.8, 8.3, 9.8), p('M9.2 11.4h3')], {
    aliases: ['report-generate', 'report-download', 'report-share', 'report-scheduled', 'report-analytics', 'executive-summary', 'board-report-product']
  }),
  icon('kpi', [l(3.1, 11.9, 11.9, 11.9), l(3.1, 11.9, 3.1, 3.4), p('M3.6 9.7 5.7 7.4 7.4 8.3 9.3 5.8 11.2 7.1'), c(11.2, 7.1, 0.45, { fill: 'currentColor', stroke: 'none' })], {
    aliases: ['kpi-trend', 'insight', 'insight-ai', 'target-metric', 'benchmark-metric', 'comparison', 'comparison-chart']
  }),
  icon('revenue', [l(3.1, 11.9, 11.9, 11.9), p('M3.6 9.7 5.6 7.7 7.3 8.8 9.5 6 11.3 4.8'), polyline('9.4 4.8 11.3 4.8 11.3 6.7')], {
    aliases: ['revenue-growth', 'revenue-decline', 'sales-growth', 'sales-decline', 'margin', 'margin-gross', 'margin-net', 'roi', 'roi-positive', 'roi-negative']
  }),
  icon('conversion', [polygon('3.2,4.2 11.8,4.2 9.7,7.5 11.8,10.8 3.2,10.8 5.3,7.5', { fill: 'none' }), l(5.4, 7.5, 9.6, 7.5)], {
    aliases: ['conversion-rate', 'funnel', 'funnel-conversion', 'churn', 'churn-rate', 'retention', 'retention-rate', 'acquisition', 'acquisition-cost', 'attribution', 'attribution-model', 'source', 'source-organic', 'source-paid']
  }),
  icon('forecast', [c(4.5, 9.1, 0.8, { fill: 'currentColor', stroke: 'none' }), c(7.5, 6.8, 0.8, { fill: 'currentColor', stroke: 'none' }), c(10.5, 4.9, 0.8, { fill: 'currentColor', stroke: 'none' }), l(4.5, 9.1, 7.5, 6.8), l(7.5, 6.8, 10.5, 4.9)], {
    aliases: ['forecast-up', 'forecast-down', 'projection', 'projection-growth', 'variance', 'variance-positive', 'variance-negative', 'goal', 'goal-track']
  }),
  icon('budget', [r(2.8, 4.6, 9.4, 5.8, { rx: 1 }), l(2.8, 6.8, 12.2, 6.8), l(7.5, 4.6, 7.5, 10.4), c(7.5, 7.5, 1.1)], {
    aliases: ['budget-plan', 'expense', 'expense-report', 'profit', 'loss', 'balance', 'balance-sheet', 'cashflow', 'cashflow-positive', 'cashflow-negative', 'ledger', 'ledger-entry', 'accounting', 'bookkeeping', 'journal', 'reconciliation']
  }),
  icon('subscription', [c(7.5, 7.5, 4.7), l(7.5, 4.2, 7.5, 7.5), l(7.5, 7.5, 9.8, 8.9), polyline('9.4 2.9 11.4 2.9 11.4 4.9')], {
    aliases: ['subscription-active', 'subscription-paused', 'subscription-cancelled', 'plan', 'plan-upgrade', 'plan-downgrade', 'pricing', 'pricing-tier', 'billing', 'billing-cycle', 'billing-invoice', 'recurring-payment', 'subscription-fintech']
  }),
  icon('tax', [r(3, 2.8, 9, 9.6, { rx: 1 }), l(5, 5.2, 10, 5.2), l(5, 7.5, 10.8, 7.5), l(5, 9.8, 8.4, 9.8), l(9.8, 9.2, 11.6, 11)], {
    aliases: ['tax-rate', 'tax-report', 'tax-filing', 'tax-return', 'invoice-admin', 'invoice-ecommerce', 'invoice-payment', 'invoice-print', 'receipt-digital', 'receipt-print']
  }),
  icon('payout', [l(3.2, 11.8, 11.8, 11.8), l(7.5, 3.2, 7.5, 9.6), polyline('4.9 7 7.5 9.6 10.1 7')], {
    aliases: ['payout-scheduled', 'payout-completed', 'payout-failed', 'payout-instant', 'gateway', 'gateway-stripe', 'gateway-paypal', 'gateway-razorpay', 'clearing', 'settlement', 'remittance', 'cross-border']
  }),
  icon('api-key', [c(4.8, 7.5, 1.6), l(6.4, 7.5, 12.2, 7.5), l(10.2, 7.5, 10.2, 9.1), l(11.4, 7.5, 11.4, 8.5)], {
    aliases: ['api-key-generate', 'api-key-revoke', 'api-limit', 'rate-limit', 'throttle', 'quota', 'usage', 'usage-daily', 'usage-monthly', 'usage-yearly', 'limit', 'limit-exceeded']
  }),
  icon('integration', [r(2.9, 4.4, 3.8, 3.8, { rx: 0.7 }), r(8.3, 4.4, 3.8, 3.8, { rx: 0.7 }), l(6.7, 6.3, 8.3, 6.3), l(3.9, 8.2, 3.9, 10.8), l(11.1, 8.2, 11.1, 10.8)], {
    aliases: ['integration-add', 'integration-remove', 'integration-active', 'webhook', 'webhook-active', 'sync-ecommerce', 'sync-fintech']
  }),
  icon('support-ticket', [r(2.8, 4.2, 9.4, 6.8, { rx: 1 }), p('M4.3 8.4 3.7 10.8l2-.9'), l(5.2, 6.3, 9.8, 6.3)], {
    aliases: ['support', 'support-open', 'support-closed', 'helpdesk', 'helpdesk-agent', 'sla', 'sla-breach', 'feedback', 'feedback-positive', 'feedback-negative', 'survey', 'survey-response', 'survey-analytics', 'notification-admin', 'broadcast-admin', 'announcement', 'announcement-global']
  }),
  icon('maintenance', [c(7.5, 7.5, 2.4), l(7.5, 2.8, 7.5, 4.1), l(7.5, 10.9, 7.5, 12.2), l(2.8, 7.5, 4.1, 7.5), l(10.9, 7.5, 12.2, 7.5), l(4.2, 4.2, 5.1, 5.1), l(9.9, 9.9, 10.8, 10.8)], {
    aliases: ['maintenance-mode', 'uptime', 'uptime-99', 'downtime', 'downtime-alert', 'server-admin', 'server-health', 'server-restart', 'database-admin', 'database-backup', 'database-restore', 'backup', 'backup-scheduled', 'restore', 'restore-point']
  }),
  icon('compliance', [p('M7.5 2.8 11.2 4.1v3.6c0 2.3-1.3 3.7-3.7 4.7-2.4-1-3.7-2.4-3.7-4.7V4.1z'), p('M5.8 7.4 7.1 8.7 9.4 6.4')], {
    aliases: ['compliance-gdpr', 'compliance-hipaa', 'compliance-soc2', 'compliance-fintech', 'audit-fintech', 'policy', 'policy-update']
  }),
  icon('risk', [polygon('7.5,2.8 12.4,11.8 2.6,11.8'), l(7.5,6,7.5,8.6), c(7.5,10.3,0.55,{ fill: 'currentColor', stroke: 'none' })], {
    aliases: ['risk-low', 'risk-medium', 'risk-high', 'risk-score', 'incident', 'incident-report', 'incident-resolved', 'anomaly', 'anomaly-detected', 'anomaly-ai', 'fraud', 'fraud-detected', 'fraud-prevented']
  }),
  icon('monitoring', [l(3.1, 11.9, 11.9, 11.9), polyline('3.6 9.2 5.5 9.2 6.8 5.8 8.2 10.1 9.4 7.2 11.4 7.2')], {
    aliases: ['monitoring-live', 'alert-admin', 'alert-critical', 'alert-warning', 'alert-info', 'threshold', 'threshold-crossed']
  }),
  icon('deployment', [r(3, 3, 9, 9, { rx: 1 }), l(7.5, 4.1, 7.5, 9.8), polyline('5.4 7.7 7.5 9.8 9.6 7.7')], {
    aliases: ['deployment-success', 'deployment-failed', 'release', 'release-version', 'rollback', 'rollback-success', 'staging', 'production', 'sandbox', 'devops', 'devops-pipeline', 'ci', 'cd']
  }),
  icon('feature-flag', [l(4, 2.8, 4, 12.2), p('M4 3.4h6.6l-1.2 2.1 1.2 2.1H4')], {
    aliases: ['feature-flag-on', 'feature-flag-off', 'experimentation', 'ab-test', 'variant-a', 'variant-b']
  }),
  icon('crm', [c(5.1, 5.2, 1.4), c(10.1, 5.2, 1.2), p('M2.9 10.8c.5-1.3 1.5-2 2.8-2s2.3.7 2.8 2'), p('M8.1 10.8c.4-1 1.2-1.6 2.2-1.6 1 0 1.8.6 2.2 1.6')], {
    aliases: ['crm-contact', 'crm-deal', 'crm-pipeline', 'crm-stage', 'crm-lead', 'crm-conversion', 'crm-sales', 'pipeline-sales', 'lead', 'lead-qualified', 'lead-converted', 'proposal', 'quotation', 'estimate', 'contract-deal', 'negotiation']
  }),
  icon('workflow', [c(3.8, 4.3, 0.9), c(11.2, 4.3, 0.9), c(7.5, 10.7, 0.9), l(4.7, 4.3, 10.3, 4.3), l(4.3, 5.1, 6.9, 9.9), l(10.7, 5.1, 8.1, 9.9)], {
    aliases: ['workflow-automation', 'automation', 'automation-rule', 'automation-trigger', 'pipeline', 'pipeline-stage', 'approval', 'approval-pending', 'approval-approved', 'approval-rejected', 'task-admin', 'task-overdue', 'milestone']
  }),
  icon('roadmap', [l(3, 11.8, 12, 11.8), l(4.2, 11.8, 4.2, 4.3), l(7.5, 11.8, 7.5, 6.3), l(10.8, 11.8, 10.8, 8.3), c(4.2, 4.3, 0.8), c(7.5, 6.3, 0.8), c(10.8, 8.3, 0.8)], {
    aliases: ['roadmap-quarter', 'roadmap-year', 'sprint', 'sprint-active', 'sprint-completed', 'kanban', 'kanban-board', 'backlog', 'backlog-item', 'priority', 'priority-high', 'priority-medium', 'priority-low']
  }),
  icon('product', [p('M7.5 2.9 12 5.2v5.6l-4.5 2.3-4.5-2.3V5.2z'), l(7.5, 7.4, 7.5, 13.1), l(3, 5.2, 7.5, 7.4), l(12, 5.2, 7.5, 7.4)], {
    aliases: ['product-add', 'product-remove', 'product-variant', 'product-bundle', 'product-digital', 'product-physical', 'catalog', 'catalog-grid', 'category', 'category-add', 'sku']
  }),
  icon('inventory', [r(3.1, 3.4, 8.8, 8.4, { rx: 1 }), l(3.1, 6.4, 11.9, 6.4), l(6.3, 6.4, 6.3, 11.8), l(8.7, 6.4, 8.7, 11.8)], {
    aliases: ['inventory-low', 'inventory-out', 'stock', 'stock-in', 'stock-out', 'warehouse-alt', 'supplier', 'supplier-add', 'procurement', 'wholesale', 'retail', 'demand', 'supply', 'purchase-order', 'sales-order']
  }),
  icon('order', [r(3.2, 3.3, 8.6, 8.8, { rx: 1 }), l(5.2, 5.7, 9.8, 5.7), l(5.2, 8, 9.8, 8), l(5.2, 10.3, 8.4, 10.3)], {
    aliases: ['order-pending', 'order-processing', 'order-shipped', 'order-delivered', 'order-cancelled', 'order-returned', 'fulfillment', 'fulfillment-center', 'cart-checkout', 'checkout', 'checkout-secure', 'checkout-fast', 'marketplace', 'vendor', 'commission', 'commission-rate', 'payout-vendor']
  }),
  icon('shipment', [p('M3.1 5.2 7.5 3 11.9 5.2v5.6l-4.4 2.2-4.4-2.2z'), l(7.5, 7.4, 7.5, 13), l(3.1, 5.2, 7.5, 7.4), l(11.9, 5.2, 7.5, 7.4)], {
    aliases: ['shipment-track', 'tracking-number', 'address', 'address-add', 'address-edit', 'packaging', 'packaging-box', 'label-shipping', 'dropshipping', 'international-shipping', 'customs', 'duty']
  }),
  icon('payment', [r(2.8, 4.3, 9.4, 6.4, { rx: 1 }), l(2.8, 6.5, 12.2, 6.5), l(4.3, 9.2, 7.2, 9.2)], {
    aliases: ['payment-success', 'payment-failed', 'payment-method', 'payment-card', 'payment-upi', 'payment-netbanking', 'payment-wallet', 'qr-payment', 'pos', 'pos-terminal', 'wallet-balance', 'wallet-add', 'wallet-withdraw', 'wallet-transfer', 'secure-payment', 'encryption', 'vault', 'vault-secure', 'two-factor', 'authentication']
  }),
  icon('transaction', [l(3.2, 4.7, 11.8, 4.7), polyline('9.6 2.9 11.8 4.7 9.6 6.5'), l(11.8, 10.3, 3.2, 10.3), polyline('5.4 8.5 3.2 10.3 5.4 12.1')], {
    aliases: ['transaction-success', 'transaction-failed', 'transaction-pending', 'debit', 'debit-card', 'credit-limit', 'credit-score', 'emi', 'installment', 'cash', 'cash-register', 'change', 'tip', 'gratuity']
  }),
  icon('refund', [l(11.8, 4.7, 3.2, 4.7), polyline('5.4 2.9 3.2 4.7 5.4 6.5'), l(3.2, 10.3, 11.8, 10.3), polyline('9.6 8.5 11.8 10.3 9.6 12.1')], {
    aliases: ['refund-approved', 'refund-rejected', 'exchange', 'exchange-item', 'return', 'return-request', 'return-approved', 'coupon', 'coupon-active', 'coupon-apply', 'discount', 'discount-percentage', 'discount-fixed', 'discount-code', 'flash-sale', 'clearance', 'deal', 'deal-hot', 'bundle-offer', 'dynamic-pricing', 'pricing-discount', 'price-tag', 'price-drop']
  }),
  icon('loyalty', [p('M7.5 2.9 8.8 5.6l3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z')], {
    aliases: ['loyalty-points', 'gift-card-balance', 'wishlist', 'wishlist-add', 'compare-product', 'review', 'review-add', 'review-star', 'rating', 'rating-half', 'customer-new', 'customer-repeat', 'customer-vip', 'upsell', 'cross-sell', 'affiliate', 'affiliate-link', 'referral', 'referral-code', 'referral-bonus']
  }),
  icon('fintech', [r(2.8, 4.6, 9.4, 5.8, { rx: 1 }), c(7.5, 7.5, 1.3), l(10.7, 4.4, 12.2, 2.9), l(10.7, 10.6, 12.2, 12.1)], {
    aliases: ['kyc', 'kyc-verified', 'aml', 'biometric-payment', 'face-id', 'touch-id', 'otp', 'blockchain', 'crypto', 'crypto-wallet', 'nft', 'nft-marketplace', 'staking', 'mining', 'mutual-fund', 'stocks', 'portfolio', 'portfolio-diversified', 'investment', 'investment-growth', 'savings', 'savings-goal', 'interest', 'interest-rate', 'loan', 'loan-approved', 'loan-rejected', 'mortgage', 'insurance', 'insurance-policy', 'claim', 'claim-approved', 'claim-rejected']
  }),
  icon('productivity', [c(7.5, 7.5, 4.7), l(7.5, 4.5, 7.5, 7.5), l(7.5, 7.5, 9.5, 8.9)], {
    aliases: ['productivity-focus', 'pomodoro', 'timer-productivity', 'notes', 'notes-add', 'notes-checklist', 'document', 'document-sign', 'document-verify', 'contract', 'contract-sign', 'signature', 'e-signature', 'collaboration', 'collaboration-live', 'team-chat', 'project', 'project-active', 'project-complete', 'goal-productivity', 'habit', 'habit-track', 'streak', 'streak-fire', 'calendar-productivity', 'reminder', 'reminder-add', 'reminder-snooze', 'planner', 'planner-week', 'planner-month', 'roadmap-product', 'idea-board', 'brainstorming', 'mindmap', 'whiteboard', 'task-productivity', 'task-complete', 'task-pending', 'checklist-productivity', 'kanban-productivity', 'gantt', 'milestone-product', 'dashboard-productivity']
  }),
  icon('marketing', [polygon('3.2,7.1 9.6,4.6 9.6,10.4 3.2,7.9', { fill: 'none' }), l(9.6, 5.6, 11.5, 5.1), l(9.6, 9.4, 11.5, 9.9), r(3.2, 7.1, 1.8, 3.6, { rx: 0.45 })], {
    aliases: ['campaign', 'campaign-active', 'campaign-paused', 'campaign-sales', 'email-campaign', 'sms-campaign', 'push-campaign', 'social-commerce', 'live-commerce', 'influencer', 'influencer-marketing', 'ad-spend', 'mobile-commerce', 'omnichannel', 'channel-online', 'channel-offline', 'storefront', 'storefront-online', 'storefront-offline', 'export-sales', 'import-products', 'dashboard-ecommerce', 'dashboard-fintech']
  }),
  // End promoted domain semantic terms.
  // Semantic alias bundles to map broad admin/UI vocabulary onto base glyphs.
  icon('semantic-ui', [r(2.8, 3.1, 9.4, 8.8, { rx: 1 }), l(3.5, 6.1, 11.5, 6.1), l(3.5, 8.9, 11.5, 8.9), l(5.4, 3.7, 5.4, 11.3)], {
    aliases: [
      'drag-handle',
      'drag-indicator',
      'heatmap',
      'user-flow',
      'sitemap',
    ]
  }),
  icon('semantic-admin', [r(2.8, 3.1, 9.4, 8.8, { rx: 1 }), c(5, 5.3, 0.6, { fill: 'currentColor', stroke: 'none' }), c(5, 8.1, 0.6, { fill: 'currentColor', stroke: 'none' }), l(6.6, 5.3, 11.2, 5.3), l(6.6, 8.1, 11.2, 8.1), l(3.3, 10.6, 11.7, 10.6)], {
    aliases: [
      'cohort',
      'cohort-analysis',
      'segmentation',
      'segmentation-user',
      'segmentation-behavior',
      'segmentation-demographic',
      'user-analytics',
      'user-growth',
      'active-users',
      'daily-active-users',
      'monthly-active-users',
      'session',
      'session-duration',
      'bounce-rate',
      'page-view',
      'heatmap-analytics',
      'click-tracking',
      'scroll-depth',
    ]
  }),
  icon('semantic-business', [r(2.8, 3.1, 9.4, 8.8, { rx: 1 }), p('M3.6 10.5 5.6 8.2 7.2 8.9 9.1 6.4 11.6 7.8'), l(3.3, 10.6, 11.7, 10.6), l(3.3, 10.6, 3.3, 4.2)], {
    aliases: [
      'tag-admin',
      'label-admin',
      'archive-admin',
      'export',
      'export-csv',
      'export-pdf',
      'import',
      'import-csv',
      'import-api',
      'data',
      'data-sync',
      'data-refresh',
      'data-clean',
      'data-warehouse',
      'data-lake',
      'etl',
      'etl-process',
      'schema',
      'schema-update',
      'mapping',
      'mapping-field',
      'transformation',
      'transformation-rule',
      'analytics-ai',
      'ai-model',
      'ai-training',
      'ai-deployment',
      'ai-prediction',
      'recommendation',
      'recommendation-ai',
      'personalization',
      'personalization-ai',
      'chatbot',
      'chatbot-admin',
      'bot-training',
      'bot-response',
      'experiment',
      'experiment-result',
      'insights-dashboard',
      'barcode-scan',
      'subscription-product',
      'recurring-order',
      'escrow',
      'escrow-secure',
      'yield',
      'payroll',
      'payslip',
      'attendance',
      'attendance-checkin',
      'attendance-checkout',
      'timesheet',
      'analytics-sales',
      'currency-convert',
      'currency-exchange',
      'exchange-rate',
      'global-payment',
      'subscription-box',
      'preorder',
      'backorder',
      'waitlist',
      'ledger-fintech',
      'arrears',
      'overdue',
      'dunning',
      'donation',
      'charity',
      'crowdfunding',
      'fundraiser',
      'campaign-donation',
    ]
  }),
  icon('link-2', [polyline('5.5 9 4.25 10.25 2.95 8.95 4.2 7.7'), polyline('9.5 6 10.75 4.75 12.05 6.05 10.8 7.3'), l(5.9, 9.1, 9.1, 5.9)], { aliases: ['chain-link', 'attachment', 'paperclip'] }),
  icon('command', [p('M5.1 5.1a1.6 1.6 0 1 1 0-3.2h1.2v4.4H5.1a1.6 1.6 0 1 1 0-3.2h4.8a1.6 1.6 0 1 1 0 3.2H8.7v4.4h1.2a1.6 1.6 0 1 1 0 3.2H8.7V9.5H6.3v1.2H5.1a1.6 1.6 0 1 1 0 3.2h1.2V9.5H5.1a1.6 1.6 0 1 1 0-3.2')])
];

export const iconNameList = Array.from(new Set(iconDefinitions.map((entry) => entry.name))).sort();
