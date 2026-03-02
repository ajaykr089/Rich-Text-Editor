---
title: "Security And Autosave"
description: Security and autosave architecture for safe content handling and reliable persistence workflows.
keywords: [editora, documentation, security]
---

# Security And Autosave

Security and autosave architecture for safe content handling and reliable persistence workflows.

## Security model

- Sanitize inbound and outbound HTML paths.
- Restrict unsafe tags/attributes at the editor boundary.
- Apply consistent rules in both React and web component integrations.

## Autosave model

- Trigger save logic from content-change events.
- Debounce saves to avoid write amplification.
- Persist per document id to prevent cross-document overwrite.

## Recommended strategy

1. Define an allowlist-based sanitization policy.
2. Normalize pasted/imported HTML before render.
3. Enable debounced autosave and persist revision timestamps.
4. Restore draft content only for the same document scope.

## Failure handling

- Show save status (`saving`, `saved`, `error`) in UI.
- Retry failed saves with bounded backoff.
- Keep unsaved draft state local until remote persistence succeeds.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `security` runtime config | Config API | Controls sanitize-on-paste/input policy and HTML safety behavior |
| `autosave` runtime config | Config API | Controls enablement, interval/debounce, storage provider/keying |
| Content change events/callbacks | Integration API | Trigger persistence pipelines and save-state UX |
| `setConfig({...})` / React runtime props | Update API | Applies security/autosave settings per editor instance |

## Config Matrix

| Area | Key Option | Purpose |
| --- | --- | --- |
| Security | sanitizer/allowlist rules | prevent unsafe HTML |
| Security | paste/import normalization | block malformed DOM |
| Autosave | debounce interval | reduce save churn |
| Autosave | storage adapter | local/remote persistence |
| Autosave | document keying | isolate drafts |

## Validation Checklist

- Sanitization rules remove disallowed constructs predictably.
- Autosave does not fire excessive writes under rapid typing.
- Restored drafts match the correct document id.
- Save failure state remains non-blocking for editing.
