// Content script for Markdown Split Preview
(function() {
  // Only run if the body contains only pre or plaintext (raw markdown)
  const body = document.body;
  if (!body || body.children.length > 1) return;
  let raw = body.innerText || body.textContent;
  if (!raw || raw.length < 10) return;

  // Create split container
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.height = '100vh';
  container.style.margin = '0';

  // Left: raw markdown
  const left = document.createElement('pre');
  left.textContent = raw;
  left.style.flex = '1';
  left.style.margin = '0';
  left.style.overflow = 'auto';
  left.style.background = '#181a1b'; // dark background
  left.style.color = '#e8e6e3'; // light text
  left.style.padding = '1em';
  left.style.borderRight = '1px solid #333';
  left.style.fontFamily = 'Fira Mono, Menlo, Monaco, Consolas, monospace';
  left.style.fontSize = '1em';

  // Right: rendered markdown
  const right = document.createElement('div');
  right.style.flex = '1';
  right.style.overflow = 'auto';
  right.style.padding = '1em';
  right.style.background = '#23272e'; // dark background for preview
  right.style.color = '#e8e6e3';
  right.style.fontFamily = 'system-ui, sans-serif';
  right.style.fontSize = '1em';

  // Detect system dark mode
  function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme() {
    const dark = isDarkMode();
    left.style.background = dark ? '#181a1b' : '#fafafa';
    left.style.color = dark ? '#e8e6e3' : '#333';
    left.style.borderRight = dark ? '1px solid #333' : '1px solid #eee';
    right.style.background = dark ? '#23272e' : '#fff';
    right.style.color = dark ? '#e8e6e3' : '#222';
    right.style.fontFamily = 'system-ui, sans-serif';
    right.style.fontSize = '1em';
    // Add markdown-like proportional styles
    const style = document.createElement('style');
    style.id = 'mdpreview-markdown-style';
    // Remove previous style if present
    const prev = document.getElementById('mdpreview-markdown-style');
    if (prev) prev.remove();
    style.textContent = `
      .mdpreview-markdown {
        line-height: 1.6;
        font-size: 16px;
        color: ${dark ? '#d4d4d4' : '#24292e'};
        background: none;
        padding: 0;
      }
      .mdpreview-markdown h1 {
        font-size: 2em;
        margin: 0.67em 0;
        font-weight: 600;
        border-bottom: 1px solid ${dark ? '#30363d' : '#eaecef'};
        padding-bottom: 0.3em;
      }
      .mdpreview-markdown h2 {
        font-size: 1.5em;
        margin: 1em 0 0.5em 0;
        font-weight: 600;
        border-bottom: 1px solid ${dark ? '#30363d' : '#eaecef'};
        padding-bottom: 0.3em;
      }
      .mdpreview-markdown h3 {
        font-size: 1.17em;
        margin: 1em 0 0.5em 0;
        font-weight: 600;
      }
      .mdpreview-markdown h4 {
        font-size: 1em;
        margin: 1em 0 0.5em 0;
        font-weight: 600;
      }
      .mdpreview-markdown h5 {
        font-size: 0.83em;
        margin: 1em 0 0.5em 0;
        font-weight: 600;
      }
      .mdpreview-markdown h6 {
        font-size: 0.67em;
        margin: 1em 0 0.5em 0;
        font-weight: 600;
      }
      .mdpreview-markdown p {
        margin: 1em 0;
      }
      .mdpreview-markdown ul, .mdpreview-markdown ol {
        margin: 1em 0 1em 2em;
        padding-left: 2em;
      }
      .mdpreview-markdown li {
        margin: 0.2em 0;
      }
      .mdpreview-markdown blockquote {
        margin: 1em 0;
        padding-left: 1em;
        border-left: 4px solid ${dark ? '#505050' : '#d0d7de'};
        color: ${dark ? '#8b949e' : '#6a737d'};
        background: ${dark ? '#22272e' : '#f6f8fa'};
        border-radius: 4px;
      }
      .mdpreview-markdown code {
        font-family: Fira Mono, Menlo, Monaco, Consolas, monospace;
        font-size: 0.95em;
        background: ${dark ? '#282c34' : '#f6f8fa'};
        color: ${dark ? '#d4d4d4' : '#24292e'};
        border-radius: 3px;
        padding: 2px 4px;
      }
      .mdpreview-markdown pre {
        overflow-x: auto;
        background: ${dark ? '#1e1e1e' : '#f6f8fa'};
        color: ${dark ? '#d4d4d4' : '#24292e'};
        border-radius: 4px;
        padding: 1em;
        margin: 1em 0;
      }
      .mdpreview-markdown pre code {
        background: none;
        color: inherit;
        padding: 0;
      }
      .mdpreview-markdown table {
        border-collapse: collapse;
        margin: 1em 0;
        width: 100%;
      }
      .mdpreview-markdown th, .mdpreview-markdown td {
        border: 1px solid ${dark ? '#30363d' : '#d0d7de'};
        padding: 0.3em 0.7em;
      }
      .mdpreview-markdown th {
        background: ${dark ? '#22272e' : '#f6f8fa'};
        font-weight: 600;
      }
      .mdpreview-markdown hr {
        border: none;
        border-top: 1px solid ${dark ? '#30363d' : '#eaecef'};
        margin: 2em 0;
      }
      .mdpreview-markdown a {
        color: ${dark ? '#4ea1f7' : '#0969da'};
        text-decoration: underline;
      }
      .mdpreview-markdown img {
        max-width: 100%;
      }
    `;
    document.head.appendChild(style);
    // Style code blocks in preview (only block-level <pre> elements)
    const preBlocks = right.querySelectorAll('pre');
    preBlocks.forEach(cb => {
      cb.style.background = dark ? '#1e1e1e' : '#f6f8fa';
      cb.style.color = dark ? '#d4d4d4' : '#24292e';
      cb.style.borderRadius = '4px';
      cb.style.padding = '1em';
      cb.style.fontFamily = 'Fira Mono, Menlo, Monaco, Consolas, monospace';
    });
    const inlineCodes = right.querySelectorAll('p code, li code, span code');
    inlineCodes.forEach(cb => {
      cb.style.background = dark ? '#282c34' : '#f6f8fa';
      cb.style.color = dark ? '#d4d4d4' : '#24292e';
      cb.style.padding = '2px 4px';
      cb.style.borderRadius = '3px';
      cb.style.fontFamily = 'Fira Mono, Menlo, Monaco, Consolas, monospace';
    });
  }

  // Sync scroll between left and right panes
  let isSyncingLeftScroll = false;
  let isSyncingRightScroll = false;
  left.addEventListener('scroll', function() {
    if (isSyncingLeftScroll) {
      isSyncingLeftScroll = false;
      return;
    }
    isSyncingRightScroll = true;
    const percent = left.scrollTop / (left.scrollHeight - left.clientHeight);
    right.scrollTop = percent * (right.scrollHeight - right.clientHeight);
  });
  right.addEventListener('scroll', function() {
    if (isSyncingRightScroll) {
      isSyncingRightScroll = false;
      return;
    }
    isSyncingLeftScroll = true;
    const percent = right.scrollTop / (right.scrollHeight - right.clientHeight);
    left.scrollTop = percent * (left.scrollHeight - left.clientHeight);
  });

  // Ensure marked is available after DOMContentLoaded
  function renderMarkdown() {
    let markedFn = null;
    if (typeof marked !== 'undefined' && marked) {
      markedFn = marked.parse ? marked.parse : marked;
    } else if (window.marked) {
      markedFn = window.marked.parse ? window.marked.parse : window.marked;
    }
    if (markedFn) {
      right.innerHTML = `<div class="mdpreview-markdown">${markedFn(raw)}</div>`;
      applyTheme();
    } else {
      right.innerHTML = '<em>Marked.js not loaded</em>';
    }
  }

  if (typeof marked === 'undefined' && !window.marked) {
    // Wait for marked to load if not yet available
    window.addEventListener('load', renderMarkdown);
    setTimeout(renderMarkdown, 100); // fallback in case load event doesn't fire
  } else {
    renderMarkdown();
  }

  // Clear body and append container
  body.innerHTML = '';
  container.appendChild(left);
  container.appendChild(right);
  body.appendChild(container);

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme);
  }
})();
