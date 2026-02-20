export function warnIfElementNotRegistered(tagName: string, componentName: string) {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;

  const key = `__editora_warned_${tagName}`;
  const globalObj = window as unknown as Record<string, boolean>;
  if (globalObj[key]) return;
  globalObj[key] = true;

  // Keep warning concise and actionable for wrapper consumers.
  // eslint-disable-next-line no-console
  console.warn(
    `[ui-react/${componentName}] ${tagName} is not registered. ` +
      `Import/register the matching web component before using this wrapper.`
  );
}
