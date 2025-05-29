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
  left.style.background = '#fafafa';
  left.style.padding = '1em';
  left.style.borderRight = '1px solid #eee';

  // Right: rendered markdown
  const right = document.createElement('div');
  right.style.flex = '1';
  right.style.overflow = 'auto';
  right.style.padding = '1em';
  right.innerHTML = window.marked ? window.marked.parse(raw) : '<em>Marked.js not loaded</em>';

  // Clear body and append container
  body.innerHTML = '';
  container.appendChild(left);
  container.appendChild(right);
  body.appendChild(container);
})();
