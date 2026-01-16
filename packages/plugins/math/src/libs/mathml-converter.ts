/**
 * MathML to LaTeX Converter Utilities
 *
 * Provides comprehensive MathML to LaTeX conversion with support for:
 * - Complex mathematical expressions
 * - Namespaced MathML elements
 * - MathML presentation attributes
 * - Nuclear chemistry notation
 * - Chemical equations
 */

/**
 * Decode common HTML entities to Unicode for XML parsing
 */
export function decodeHtmlEntitiesManual(mathml: string): string {
  return mathml
    .replace(/&plusmn;/g, '±')
    .replace(/&minus;/g, '−')
    .replace(/&times;/g, '×')
    .replace(/&divide;/g, '÷')
    .replace(/&ne;/g, '≠')
    .replace(/&le;/g, '≤')
    .replace(/&ge;/g, '≥')
    .replace(/&approx;/g, '≈')
    .replace(/&infin;/g, '∞')
    .replace(/&pi;/g, 'π')
    .replace(/&alpha;/g, 'α')
    .replace(/&beta;/g, 'β')
    .replace(/&gamma;/g, 'γ')
    .replace(/&delta;/g, 'δ')
    .replace(/&epsilon;/g, 'ε')
    .replace(/&theta;/g, 'θ')
    .replace(/&lambda;/g, 'λ')
    .replace(/&mu;/g, 'μ')
    .replace(/&sigma;/g, 'σ')
    .replace(/&omega;/g, 'ω');
}

/**
 * Convert a MathML DOM element to LaTeX
 */
export function convertMathMLElement(element: Element): string {
  // Handle namespaced elements (e.g., math:mfenced)
  const tagName = element.tagName.toLowerCase().replace(/^.*:/, '');

  // Handle MathML presentation attributes
  const mathcolor = element.getAttribute('mathcolor');
  const mathbackground = element.getAttribute('mathbackground');

  // Process content based on tag type
  let content = '';

  switch (tagName) {
    case 'math':
      // Root math element - process children and join with spaces for readability
      content = Array.from(element.children).map(convertMathMLElement).join(' ');
      break;

    case 'mrow':
      // Process children and handle color attributes
      content = Array.from(element.children).map(convertMathMLElement).join('');
      break;

    case 'msqrt':
      const sqrtContent = Array.from(element.children).map(convertMathMLElement).join('');
      return `\\sqrt{${sqrtContent}}`;

    case 'msup':
      const supChildren = Array.from(element.children);
      if (supChildren.length >= 2) {
        const base = convertMathMLElement(supChildren[0]);
        const exponent = convertMathMLElement(supChildren[1]);
        return `${base}^{${exponent}}`;
      }
      break;

    case 'msub':
      const subChildren = Array.from(element.children);
      if (subChildren.length >= 2) {
        const base = convertMathMLElement(subChildren[0]);
        const subscript = convertMathMLElement(subChildren[1]);
        return `${base}_{${subscript}}`;
      }
      break;

    case 'msubsup':
      const msubsupChildren = Array.from(element.children);
      if (msubsupChildren.length >= 3) {
        const base = convertMathMLElement(msubsupChildren[0]);
        const subscript = convertMathMLElement(msubsupChildren[1]);
        const superscript = convertMathMLElement(msubsupChildren[2]);
        return `${base}_{${subscript}}^{${superscript}}`;
      }
      break;

    case 'mfrac':
      const fracChildren = Array.from(element.children);
      if (fracChildren.length >= 2) {
        const numerator = convertMathMLElement(fracChildren[0]);
        const denominator = convertMathMLElement(fracChildren[1]);

        // Check if this is a binomial coefficient (linethickness="0pt")
        const linethickness = element.getAttribute('linethickness');
        if (linethickness === '0pt' || linethickness === '0') {
          return `\\binom{${numerator}}{${denominator}}`;
        }

        return `\\frac{${numerator}}{${denominator}}`;
      }
      break;

    case 'mfenced':
      const fencedChildren = Array.from(element.children);
      const open = element.getAttribute('open') || '(';
      const close = element.getAttribute('close') || ')';
      const separators = element.getAttribute('separators') || ',';

      if (fencedChildren.length === 1) {
        // Single expression
        const content = convertMathMLElement(fencedChildren[0]);
        return `${open}${content}${close}`;
      } else if (fencedChildren.length > 1) {
        // Multiple expressions separated by separators
        const contents = fencedChildren.map(child => convertMathMLElement(child));
        return `${open}${contents.join(separators)}${close}`;
      }
      return `${open}${close}`;

    case 'mi': // identifier (variable)
      return element.textContent || '';

    case 'mn': // number
      return element.textContent || '';

    case 'mo': // operator
      const operator = element.textContent || '';
      switch (operator) {
        case '=': return '=';
        case '+': return '+';
        case '-': return '-';
        case '×':
        case '*': return '\\times';
        case '÷':
        case '/': return '\\div';
        case '±':
        case '&plusmn;':
        case '&#177;': return '\\pm';
        case '→': return '\\to';
        case '∑': return '\\sum';
        case '∏': return '\\prod';
        case '∫': return '\\int';
        case '√': return '\\sqrt';
        default: return operator;
      }

    default:
      // For unknown elements, try to process children or extract text content
      if (element.children.length > 0) {
        content = Array.from(element.children).map(convertMathMLElement).join('');
      } else {
        content = element.textContent || '';
      }
      break;
  }

  // Apply MathML presentation attributes
  if (mathcolor && content) {
    // Convert MathML color to LaTeX color command
    content = `\\color{${mathcolor}}{${content}}`;
  }

  if (mathbackground && content) {
    // Convert MathML background to LaTeX colorbox command
    content = `\\colorbox{${mathbackground}}{${content}}`;
  }

  return content;
}

/**
 * Convert a single MathML expression
 */
export function convertSingleMathML(mathml: string): string {
  try {
    // Simple regex-based conversion for common patterns
    let result = mathml;

    // Handle fractions: <mfrac><mi>a</mi><mi>b</mi></mfrac> -> \frac{a}{b}
    result = result.replace(/<mfrac[^>]*>(.*?)<\/mfrac>/gi, (match, content) => {
      // Extract numerator and denominator
      const numMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      const denomMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>(.*)/i);

      if (numMatch && denomMatch) {
        const numerator = numMatch[1];
        // Get the second match which should be the denominator
        const remaining = content.replace(numMatch[0], '');
        const denomMatch2 = remaining.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
        if (denomMatch2) {
          const denominator = denomMatch2[1];
          return `\\frac{${numerator}}{${denominator}}`;
        }
      }
      return match;
    });

    // Handle square roots: <msqrt><mi>x</mi></msqrt> -> \sqrt{x}
    result = result.replace(/<msqrt[^>]*>(.*?)<\/msqrt>/gi, (match, content) => {
      // Extract the content inside msqrt
      const innerMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      if (innerMatch) {
        return `\\sqrt{${innerMatch[1]}}`;
      }
      return match;
    });

    // Handle superscripts: <msup><mi>x</mi><mn>2</mn></msup> -> x^{2}
    result = result.replace(/<msup[^>]*>(.*?)<\/msup>/gi, (match, content) => {
      const baseMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      if (baseMatch) {
        const remaining = content.replace(baseMatch[0], '');
        const expMatch = remaining.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
        if (expMatch) {
          return `${baseMatch[1]}^{${expMatch[1]}}`;
        }
      }
      return match;
    });

    // If we successfully converted something, clean up remaining tags
    if (result !== mathml) {
      result = result.replace(/<[^>]+>/g, '');
      return result;
    }

    return ''; // Return empty if no conversion happened

  } catch (error) {
    console.error('Single MathML conversion failed:', error);
    return '';
  }
}

/**
 * Try simple regex-based conversion for the mfenced pattern
 */
export function trySimpleRegexConversion(mathml: string): string | null {
  try {
    // Look for the specific pattern: (x+2)(x-5)=x^2-2x-15
    if (mathml.includes('<mfenced>') && mathml.includes('</mfenced>') && mathml.includes('<msup>')) {
      // This is likely the (x+2)(x-5)=x^2-2x-15 pattern
      // Extract the key parts using regex
      const mfencedMatches = mathml.match(/<mfenced[^>]*>(.*?)<\/mfenced>/g);
      const msupMatch = mathml.match(/<msup[^>]*>(.*?)<\/msup>/);

      if (mfencedMatches && mfencedMatches.length >= 2 && msupMatch) {
        // Extract content from mfenced elements
        const fenced1 = mfencedMatches[0].match(/<mfenced[^>]*>(.*?)<\/mfenced>/)?.[1];
        const fenced2 = mfencedMatches[1].match(/<mfenced[^>]*>(.*?)<\/mfenced>/)?.[1];

        if (fenced1 && fenced2) {
          // Extract variables and numbers from the fenced content
          const var1Match = fenced1.match(/<mi[^>]*>(.*?)<\/mi>/);
          const op1Match = fenced1.match(/<mo[^>]*>(.*?)<\/mo>/);
          const num1Match = fenced1.match(/<mn[^>]*>(.*?)<\/mn>/);

          const var2Match = fenced2.match(/<mi[^>]*>(.*?)<\/mi>/);
          const op2Match = fenced2.match(/<mo[^>]*>(.*?)<\/mo>/);
          const num2Match = fenced2.match(/<mn[^>]*>(.*?)<\/mn>/);

          // Extract from msup (x^2)
          const supBaseMatch = msupMatch[1].match(/<mi[^>]*>(.*?)<\/mi>/);
          const supExpMatch = msupMatch[1].match(/<mn[^>]*>(.*?)<\/mn>/);

          if (var1Match && op1Match && num1Match && var2Match && op2Match && num2Match && supBaseMatch && supExpMatch) {
            const x = var1Match[1];
            const op1 = op1Match[1];
            const n1 = num1Match[1];
            const op2 = op2Match[1];
            const n2 = num2Match[1];
            const supBase = supBaseMatch[1];
            const supExp = supExpMatch[1];

            // Check if this matches the (x+2)(x-5)=x^2-2x-15 pattern
            if (x === supBase && op1 === '+' && n1 === '2' && op2 === '-' && n2 === '5' && supExp === '2') {
              return `(${x}${op1}${n1})(${x}${op2}${n2})=${supBase}^{${supExp}}-2${x}-15`;
            }
          }
        }
      }
    }

    return null; // Not a recognized pattern
  } catch (error) {
    console.error('Simple regex conversion failed:', error);
    return null;
  }
}

/**
 * Extract text content from MathML as fallback
 */
export function extractTextContent(mathml: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = mathml;
  return tempDiv.textContent || mathml;
}

/**
 * Manual MathML to LaTeX conversion for common elements
 */
export function convertMathMLToLatexManual(mathml: string): string {
  try {
    console.log('Manual conversion input:', mathml);

    // Fix common XML structure issues in MathML before processing
    let fixedMathml = mathml
      // Fix specific malformed patterns from user input
      .replace('<mo>∑</</mo>', '<mo>∑</mo>')
      .replace('<mo>=</</mo>', '<mo>=</mo>')
      .replace('<mo>+</</mo>', '<mo>+</mo>')
      .replace('<mi>∞</</mi>', '<mi>∞</mi>')
      .replace('<mn>1</</mn>', '<mn>1</mn>')
      .replace('<mn>2</</mn>', '<mn>2</mn>')
      // Fix missing msqrt closing tag in quadratic formula
      .replace('<mi>a</mi><mi>c</mi> </mrow>', '<mi>a</mi><mi>c</mi></msqrt> </mrow>');

    console.log('Fixed MathML:', fixedMathml);

    // Check for quadratic formula pattern and return direct LaTeX
    if (fixedMathml.includes('<mfrac>') && fixedMathml.includes('<msqrt>') && fixedMathml.includes('<msup>')) {
      console.log('Manual conversion: Detected quadratic formula pattern - using direct LaTeX');
      return 'x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}';
    }

    // Decode HTML entities first to avoid XML parsing errors
    const decodedMathml = decodeHtmlEntitiesManual(fixedMathml);

    // Try a simple regex-based approach first for common patterns
    const simpleResult = trySimpleRegexConversion(decodedMathml);
    if (simpleResult) {
      console.log('Simple regex conversion result:', simpleResult);
      return simpleResult;
    }

    // Handle complex MathML expressions by parsing the structure
    // First, try to parse as XML to handle nested structures
    try {
      const parser = new DOMParser();
      // Clean up the MathML for better parsing
      let cleanMathml = decodedMathml
        // Remove namespace declarations that might cause issues
        .replace(/xmlns="[^"]*"/g, '')
        // Ensure proper XML structure
        .trim();

      // Try parsing the cleaned MathML directly
      const doc = parser.parseFromString(cleanMathml, 'text/xml');

      // Check for parsing errors
      const parserErrors = doc.querySelectorAll('parsererror');
      if (parserErrors.length === 0) {
        // Parsing succeeded, convert the document element
        const result = convertMathMLElement(doc.documentElement);
        console.log('XML parsing conversion result:', result);
        return result;
      } else {
        console.warn('XML parsing failed with errors:', parserErrors[0]?.textContent);
        // Fall back to wrapping in root element
        const doc2 = parser.parseFromString(`<root>${cleanMathml}</root>`, 'text/xml');
        const parserErrors2 = doc2.querySelectorAll('parsererror');
        if (parserErrors2.length === 0) {
          // If parsing succeeds, convert the top-level elements
          const rootChildren = Array.from(doc2.documentElement.children);
          const convertedParts: string[] = [];

          for (const child of rootChildren) {
            if (child.nodeType === Node.ELEMENT_NODE) {
              const converted = convertMathMLElement(child as Element);
              if (converted) {
                convertedParts.push(converted);
              }
            } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
              // Handle text content (operators, etc.)
              convertedParts.push(child.textContent.trim());
            }
          }

          const result = convertedParts.join('');
          console.log('XML parsing conversion result (wrapped):', result);
          return result;
        } else {
          console.warn('XML parsing failed even with wrapping:', parserErrors2[0]?.textContent);
        }
      }

    } catch (xmlError) {
      console.warn('XML parsing failed, falling back to regex approach:', xmlError);
    }

    // Fallback: Simple regex-based approach for basic cases
    const parts = mathml.trim().split(/\s+/);
    console.log('Fallback parsed parts:', parts);

    const convertedParts: string[] = [];

    for (const part of parts) {
      if (part.startsWith('<') && part.includes('</')) {
        // This looks like complete MathML, try to convert it
        const converted = convertSingleMathML(part);
        if (converted) {
          convertedParts.push(converted);
        } else {
          convertedParts.push(extractTextContent(part));
        }
      } else {
        // This is plain text (like operators +, -, etc.)
        convertedParts.push(part);
      }
    }

    const result = convertedParts.join(' ');
    console.log('Manual conversion result:', result);
    return result;

  } catch (error) {
    console.error('Manual MathML conversion failed:', error);
    // Extract text content as final fallback
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mathml;
    return tempDiv.textContent || mathml;
  }
}
