# @editora/track-changes

Track changes plugin for Editora rich text editor.

## Installation

```bash
npm install @editora/track-changes @editora/core
```

## Usage

```ts
import { EditoraEditor } from '@editora/react';
import { TrackChangesPlugin, BoldPlugin, HistoryPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HistoryPlugin(),
  TrackChangesPlugin({
    author: 'reviewer',
    enabledByDefault: false,
    includeTimestamp: true,
  }),
];
```

## Toolbar Behavior

The plugin exposes one grouped toolbar control named **Track Changes** containing:

- `Track Changes` (toggle ON/OFF)
- `Accept All Changes`
- `Reject All Changes`

If you use a custom toolbar string, include `trackChanges` (or `toggleTrackChanges`) to render this group.

## How Users See ON/OFF

When `Track Changes` is ON:

- The toggle button gets active state (`.active`, `data-active="true"`, `aria-pressed="true"`).
- Button title changes to `Track Changes (On)`.
- Editor content gets `data-track-changes="true"`.

When OFF:

- Active state is removed (`data-active="false"`, `aria-pressed="false"`).
- Button title becomes `Track Changes (Off)`.
- `data-track-changes` is removed from content root.

The plugin also emits:

- `editora:track-changes-toggle` with detail `{ enabled, author }`

## Commands

- `toggleTrackChanges`
- `acceptAllTrackChanges`
- `rejectAllTrackChanges`
- `acceptSelectedTrackChanges`
- `rejectSelectedTrackChanges`

## Notes

- Delete operations are preserved as tracked deletions.
- Typing and paste operations are preserved as tracked insertions.
- Accept/reject integrates with `recordDomTransaction` when history plugin is available.

## Verification Steps (Recommended)

1. Enable the toggle.
2. Type text: inserted text should be marked as tracked insertion.
3. Delete selected text: removed content should appear as tracked deletion marker.
4. Click `Accept All Changes`: insertions become normal text and deletions are removed.
5. Add new tracked changes again.
6. Click `Reject All Changes`: insertions are removed and deletions are restored.
7. Toggle OFF.
8. Type and delete again: changes should apply directly with no new track markers.
9. Toggle ON again and confirm tracking resumes.
