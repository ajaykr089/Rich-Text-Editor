# Security And Autosave

Editora supports runtime controls for content safety and persistence behavior.

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

- Runtime `security` config block for sanitization behavior.
- Runtime `autosave` config block for interval/debounce and storage hooks.
- Change hooks for external persistence integrations.

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
