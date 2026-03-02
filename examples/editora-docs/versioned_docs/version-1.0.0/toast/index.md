---
title: Toast
description: Notification patterns and integration guidance for Editora-compatible toast systems.
keywords: [toast, notifications, ui]
---

# Toast

## Installation

Install the toast package used by your UI layer and wire it at application root.

## Quick Start

Initialize a toast provider and trigger notifications for async editor workflows.

## Usage

Common use cases include autosave status, export completion, import validation, and error recovery feedback.

## Examples

- Success + error toast patterns
- Retry action toasts
- Theme-aware toast variants

## API Reference

Covers toast provider setup, emit helpers, and variant configuration.

## Best Practices

- Keep toasts concise and actionable.
- Avoid blocking overlays for routine status updates.

## Accessibility

Use polite live-region semantics and ensure dismiss actions are keyboard accessible.

## Performance Notes

Batch low-priority notifications and cap concurrent items to reduce visual noise.
