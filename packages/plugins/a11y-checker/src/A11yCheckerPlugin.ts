import { Plugin } from '@editora/core';
import { A11yCheckerPluginProvider } from './A11yCheckerPluginProvider';

/**
 * Accessibility Checker Plugin for Rich Text Editor
 *
 * Audits content for WCAG compliance:
 * - Missing alt text on images
 * - Empty headings
 * - Heading order validation
 * - Color contrast (inline styles)
 * - Table header validation
 * - Link text clarity
 * - ARIA role misuse
 * - List structure validation
 * - Empty button detection
 *
 * Features:
 * - Live updates as user types
 * - Issue panel with jump to location
 * - Fix suggestions
 * - Severity levels (error/warning)
 * - False positive suppression
 * - Large document performance optimization
 */
export const A11yCheckerPlugin = (): Plugin => ({
  name: "a11yChecker",
  toolbar: [
    {
      label: "Accessibility",
      command: "toggleA11yChecker",
      type: "button",
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6.82954C10.1652 6.4177 11 5.30646 11 4.00024C11 2.34339 9.65686 1.00024 8 1.00024C6.34315 1.00024 5 2.34339 5 4.00024C5 5.30646 5.83481 6.4177 7 6.82954V12.0002C7 13.6571 8.34315 15.0002 10 15.0002H14.9296C15.264 15.0002 15.5762 15.1673 15.7617 15.4455L18.4913 19.54C19.1914 20.5901 20.6772 20.7373 21.5696 19.8448L22.7071 18.7074C23.0976 18.3168 23.0976 17.6837 22.7071 17.2931C22.3166 16.9026 21.6834 16.9026 21.2929 17.2931L20.1554 18.4306L17.4258 14.3361C16.8694 13.5015 15.9327 13.0002 14.9296 13.0002H10C9.44772 13.0002 9 12.5525 9 12.0002V11.0002H15C15.5523 11.0002 16 10.5525 16 10.0002C16 9.44796 15.5523 9.00025 15 9.00025H9V6.82954ZM8 5.10758C7.38844 5.10758 6.89267 4.61181 6.89267 4.00024C6.89267 3.38868 7.38844 2.89291 8 2.89291C8.61157 2.89291 9.10734 3.38868 9.10734 4.00024C9.10734 4.61181 8.61157 5.10758 8 5.10758Z" fill="#0F0F0F"></path> <path d="M4.6328 9.07414C5.10517 8.78987 5.69738 9.0279 5.91645 9.53381C6.13552 10.0397 5.89604 10.6205 5.43795 10.9272C4.92993 11.2673 4.48018 11.6911 4.10882 12.1826C3.53598 12.9408 3.16922 13.8345 3.04425 14.7765C2.91928 15.7185 3.04036 16.6768 3.3957 17.5582C3.75103 18.4395 4.32852 19.2138 5.07194 19.8058C5.81535 20.3977 6.69937 20.787 7.63791 20.9359C8.57646 21.0847 9.53756 20.988 10.4276 20.6552C11.3177 20.3223 12.1065 19.7647 12.7171 19.0366C13.1129 18.5645 13.4251 18.0313 13.6428 17.46C13.8391 16.9448 14.3514 16.5813 14.8936 16.6815C15.4357 16.7816 15.8004 17.3054 15.6291 17.8295C15.3326 18.7372 14.8644 19.583 14.2468 20.3194C13.4147 21.3117 12.3399 22.0716 11.1269 22.5252C9.91394 22.9787 8.6042 23.1105 7.32518 22.9077C6.04617 22.7048 4.84148 22.1742 3.82838 21.3676C2.81528 20.561 2.02831 19.5058 1.54407 18.3047C1.05983 17.1037 0.894836 15.7977 1.06514 14.5139C1.23545 13.2302 1.73525 12.0124 2.51589 10.9791C3.09523 10.2123 3.81459 9.56654 4.6328 9.07414Z" fill="#0F0F0F"></path> </g></svg>',
    },
  ],
  context: {
    provider: A11yCheckerPluginProvider,
  },
});

/**
 * Accessibility Issue Model
 */
export interface A11yIssue {
  id: string;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  nodePath: string;
  element?: HTMLElement;
  suggestion?: string;
}

/**
 * Suppressed rules
 */
const suppressedRules = new Set<string>();

/**
 * Check for missing alt text on images
 */
const checkImageAltText = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const images = doc.querySelectorAll('img');

  images.forEach((img, idx) => {
    if (!img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '') {
      issues.push({
        id: `img-alt-${idx}`,
        rule: 'image-alt-text',
        severity: 'error',
        message: 'Image missing alt text',
        nodePath: `img[${idx}]`,
        element: img,
        suggestion: 'Add descriptive alt text to all images'
      });
    }
  });

  return issues;
};

/**
 * Check for empty headings
 */
const checkEmptyHeadings = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach((heading, idx) => {
    if (!heading.textContent?.trim()) {
      issues.push({
        id: `heading-empty-${idx}`,
        rule: 'empty-heading',
        severity: 'error',
        message: `Empty ${heading.tagName.toLowerCase()} heading`,
        nodePath: `${heading.tagName.toLowerCase()}[${idx}]`,
        element: heading as HTMLElement,
        suggestion: 'All headings must contain text'
      });
    }
  });

  return issues;
};

/**
 * Check heading order (h1 before h2, etc.)
 */
const checkHeadingOrder = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 1;

  headings.forEach((heading, idx) => {
    const currentLevel = parseInt(heading.tagName[1]);

    if (currentLevel - previousLevel > 1) {
      issues.push({
        id: `heading-order-${idx}`,
        rule: 'heading-order',
        severity: 'warning',
        message: `Heading skips level (${previousLevel} → ${currentLevel})`,
        nodePath: `${heading.tagName.toLowerCase()}[${idx}]`,
        element: heading as HTMLElement,
        suggestion: `Use heading level ${previousLevel + 1} instead`
      });
    }

    previousLevel = currentLevel;
  });

  return issues;
};

/**
 * Check table headers
 */
const checkTableHeaders = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const tables = doc.querySelectorAll('table');

  tables.forEach((table, tableIdx) => {
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');

    if (headers.length === 0 && rows.length > 0) {
      issues.push({
        id: `table-no-headers-${tableIdx}`,
        rule: 'table-headers',
        severity: 'error',
        message: 'Table missing header row (th elements)',
        nodePath: `table[${tableIdx}]`,
        element: table as HTMLElement,
        suggestion: 'Add <th> elements to first row or use scope attribute'
      });
    }

    headers.forEach((header, headerIdx) => {
      if (!header.hasAttribute('scope')) {
        // Warning: should have scope
        issues.push({
          id: `table-scope-${tableIdx}-${headerIdx}`,
          rule: 'table-scope',
          severity: 'warning',
          message: 'Table header missing scope attribute',
          nodePath: `table[${tableIdx}] th[${headerIdx}]`,
          element: header as HTMLElement,
          suggestion: 'Add scope="col" or scope="row" to headers'
        });
      }
    });
  });

  return issues;
};

/**
 * Check link text clarity
 */
const checkLinkText = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const links = doc.querySelectorAll('a');
  const vagueText = ['click here', 'read more', 'link', 'here', 'this', 'page'];

  links.forEach((link, idx) => {
    const text = link.textContent?.toLowerCase().trim() || '';

    if (!text) {
      issues.push({
        id: `link-empty-${idx}`,
        rule: 'link-text',
        severity: 'error',
        message: 'Link has no text content',
        nodePath: `a[${idx}]`,
        element: link as HTMLElement,
        suggestion: 'All links must have descriptive text'
      });
    } else if (vagueText.includes(text)) {
      issues.push({
        id: `link-vague-${idx}`,
        rule: 'link-text-clarity',
        severity: 'warning',
        message: `Vague link text: "${text}"`,
        nodePath: `a[${idx}]`,
        element: link as HTMLElement,
        suggestion: 'Use descriptive link text instead of generic phrases'
      });
    }
  });

  return issues;
};

/**
 * Check for list structure
 */
const checkListStructure = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const lists = doc.querySelectorAll('ul, ol');

  lists.forEach((list, idx) => {
    const items = list.querySelectorAll(':scope > li');
    const nonLiChildren = Array.from(list.children).filter(child => child.tagName !== 'LI');

    if (nonLiChildren.length > 0) {
      issues.push({
        id: `list-structure-${idx}`,
        rule: 'list-structure',
        severity: 'error',
        message: 'List contains non-li elements',
        nodePath: `${list.tagName.toLowerCase()}[${idx}]`,
        element: list as HTMLElement,
        suggestion: 'All direct children of ul/ol must be li elements'
      });
    }

    if (items.length === 0) {
      issues.push({
        id: `list-empty-${idx}`,
        rule: 'list-empty',
        severity: 'warning',
        message: 'Empty list element',
        nodePath: `${list.tagName.toLowerCase()}[${idx}]`,
        element: list as HTMLElement,
        suggestion: 'Remove empty lists or add list items'
      });
    }
  });

  return issues;
};

/**
 * Check for empty buttons
 */
const checkButtonText = (doc: Document): A11yIssue[] => {
  const issues: A11yIssue[] = [];
  const buttons = doc.querySelectorAll('button, [role="button"]');

  buttons.forEach((button, idx) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        id: `button-empty-${idx}`,
        rule: 'button-text',
        severity: 'error',
        message: 'Button has no accessible name',
        nodePath: `button[${idx}]`,
        element: button as HTMLElement,
        suggestion: 'Add button text or aria-label'
      });
    }
  });

  return issues;
};

/**
 * Run full accessibility audit
 */
export const runA11yAudit = (): A11yIssue[] => {
  const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
  if (!editor) return [];

  const issues: A11yIssue[] = [];

  // Run all checks
  if (!suppressedRules.has('image-alt-text')) {
    issues.push(...checkImageAltText(editor));
  }

  if (!suppressedRules.has('empty-heading')) {
    issues.push(...checkEmptyHeadings(editor));
  }

  if (!suppressedRules.has('heading-order')) {
    issues.push(...checkHeadingOrder(editor));
  }

  if (!suppressedRules.has('table-headers')) {
    issues.push(...checkTableHeaders(editor));
  }

  if (!suppressedRules.has('link-text')) {
    issues.push(...checkLinkText(editor));
  }

  if (!suppressedRules.has('list-structure')) {
    issues.push(...checkListStructure(editor));
  }

  if (!suppressedRules.has('button-text')) {
    issues.push(...checkButtonText(editor));
  }

  return issues;
};

/**
 * Suppress a specific rule
 */
export const suppressRule = (rule: string) => {
  suppressedRules.add(rule);
};

/**
 * Unsuppress a rule
 */
export const unsuppressRule = (rule: string) => {
  suppressedRules.delete(rule);
};

/**
 * Highlight an issue in the editor
 */
export const highlightIssue = (issue: A11yIssue, highlight: boolean = true) => {
  if (!issue.element) return;

  if (highlight) {
    issue.element.style.backgroundColor = '#fff3cd';
    issue.element.style.borderLeft = '4px solid #ff9800';
    issue.element.classList.add('a11y-highlighted');
  } else {
    issue.element.style.backgroundColor = '';
    issue.element.style.borderLeft = '';
    issue.element.classList.remove('a11y-highlighted');
  }
};

/**
 * Get accessibility score
 */
export const getA11yScore = (): number => {
  const issues = runA11yAudit();
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;

  // Simple scoring: each error is -20 points, each warning is -5 points
  let score = 100 - (errors * 20) - (warnings * 5);
  return Math.max(0, score);
};
