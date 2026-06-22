import Prism from 'prismjs';

// Load Prism languages
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markdown';

/**
 * Escapes HTML characters to prevent XSS attacks in plain text contexts.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Highlights a block of code using Prism.js.
 * Falls back to HTML-escaped plain text if the language is not supported or if highlighting fails.
 */
export function highlightCode(code: string, language?: string): string {
  if (!code) return '';
  
  const normalizedLanguage = (language || 'plaintext').toLowerCase().trim();

  // If plaintext, escape HTML
  if (normalizedLanguage === 'plaintext' || normalizedLanguage === 'text') {
    return escapeHtml(code);
  }

  // Map alias names if needed (e.g. sh, shell to bash)
  let prismLang = normalizedLanguage;
  if (normalizedLanguage === 'sh' || normalizedLanguage === 'shell') {
    prismLang = 'bash';
  } else if (normalizedLanguage === 'js') {
    prismLang = 'javascript';
  } else if (normalizedLanguage === 'ts') {
    prismLang = 'typescript';
  } else if (normalizedLanguage === 'py') {
    prismLang = 'python';
  } else if (normalizedLanguage === 'md') {
    prismLang = 'markdown';
  }

  try {
    const grammar = Prism.languages[prismLang];
    if (grammar) {
      return Prism.highlight(code, grammar, prismLang);
    }
  } catch (error) {
    console.error(`Error highlighting language "${prismLang}":`, error);
  }

  // Fallback to escaped plaintext
  return escapeHtml(code);
}
