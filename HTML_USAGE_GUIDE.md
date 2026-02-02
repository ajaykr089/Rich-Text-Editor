# Using Editora in HTML Websites (No Build Tools)

This guide shows you how to use Editora Rich Text Editor in any HTML website without npm, webpack, or other build tools.

## 📦 Installation Options

### Option 1: CDN (Recommended for Quick Start)

Once published to npm, you can use:

#### unpkg CDN:
```html
<script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>
```

#### jsDelivr CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@editora/core@latest/dist/editora.min.js"></script>
```

### Option 2: Download and Self-Host

1. Download `editora.min.js` from the [releases page](https://github.com/ajaykr089/Editora/releases)
2. Place it in your website's assets folder
3. Reference it in your HTML:

```html
<script src="/assets/js/editora.min.js"></script>
```

### Option 3: Build from Source

```bash
git clone https://github.com/ajaykr089/Editora.git
cd Editora
npm install
npm run build
```

Copy `packages/core/dist/editora.min.js` to your website.

## 🚀 Quick Start

### Basic HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website with Editora</title>
    <style>
        .editor {
            border: 1px solid #ccc;
            min-height: 300px;
            padding: 20px;
        }
    </style>
</head>
<body>
    <h1>My Rich Text Editor</h1>
    
    <div id="editor" class="editor"></div>
    
    <!-- Load Editora from CDN -->
    <script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>
    
    <script>
        // Initialize editor
        const editor = new Editora.Editor({
            element: document.getElementById('editor'),
            content: '<p>Start typing here...</p>'
        });
    </script>
</body>
</html>
```

## 🎨 Full Example with Toolbar

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Editora Editor Example</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .editor-wrapper {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .toolbar {
            display: flex;
            gap: 8px;
            padding: 10px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        
        .toolbar button {
            padding: 8px 12px;
            border: 1px solid #ccc;
            background: white;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .toolbar button:hover {
            background: #e9ecef;
        }
        
        #editor {
            padding: 20px;
            min-height: 300px;
            outline: none;
        }
    </style>
</head>
<body>
    <h1>Editora Rich Text Editor</h1>
    
    <div class="editor-wrapper">
        <div class="toolbar">
            <button onclick="editor.execCommand('bold')"><b>B</b></button>
            <button onclick="editor.execCommand('italic')"><i>I</i></button>
            <button onclick="editor.execCommand('underline')"><u>U</u></button>
            <button onclick="editor.execCommand('heading', { level: 1 })">H1</button>
            <button onclick="editor.execCommand('heading', { level: 2 })">H2</button>
            <button onclick="editor.execCommand('bulletList')">• List</button>
            <button onclick="editor.execCommand('orderedList')">1. List</button>
            <button onclick="editor.execCommand('undo')">↶ Undo</button>
            <button onclick="editor.execCommand('redo')">↷ Redo</button>
        </div>
        <div id="editor" contenteditable="true"></div>
    </div>
    
    <script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>
    
    <script>
        // Initialize the editor
        const editor = new Editora.Editor({
            element: document.getElementById('editor'),
            content: '<p>Start editing...</p>',
            shortcuts: true  // Enable keyboard shortcuts
        });
        
        // Listen to changes
        editor.on('change', (content) => {
            console.log('Content changed:', content);
        });
        
        // Get content
        function saveContent() {
            const html = editor.getContent();
            console.log('Saving:', html);
            // Send to server, localStorage, etc.
        }
        
        // Set content
        function loadContent(html) {
            editor.setContent(html);
        }
    </script>
</body>
</html>
```

## 📋 API Reference

### Creating an Editor

```javascript
const editor = new Editora.Editor({
    element: document.getElementById('editor'),  // Required: DOM element
    content: '<p>Initial content</p>',           // Optional: Initial HTML
    shortcuts: true,                              // Optional: Enable keyboard shortcuts (default: true)
    placeholder: 'Start typing...',               // Optional: Placeholder text
    autofocus: true,                              // Optional: Auto focus on load
    plugins: []                                   // Optional: Custom plugins
});
```

### Editor Methods

```javascript
// Get current content
const html = editor.getContent();

// Set content
editor.setContent('<p>New content</p>');

// Execute commands
editor.execCommand('bold');
editor.execCommand('heading', { level: 1 });
editor.execCommand('insertLink', { url: 'https://example.com' });

// Undo/Redo
editor.undo();
editor.redo();

// Focus
editor.focus();

// Destroy
editor.destroy();
```

### Event Listeners

```javascript
// Content changed
editor.on('change', (content) => {
    console.log('New content:', content);
});

// Selection changed
editor.on('selectionChange', (selection) => {
    console.log('Selection:', selection);
});

// Focus/Blur
editor.on('focus', () => console.log('Editor focused'));
editor.on('blur', () => console.log('Editor blurred'));
```

### Available Commands

```javascript
// Text formatting
editor.execCommand('bold');
editor.execCommand('italic');
editor.execCommand('underline');
editor.execCommand('strikethrough');

// Headings
editor.execCommand('heading', { level: 1 });  // H1 to H6
editor.execCommand('paragraph');              // Back to paragraph

// Lists
editor.execCommand('bulletList');
editor.execCommand('orderedList');

// Alignment
editor.execCommand('alignLeft');
editor.execCommand('alignCenter');
editor.execCommand('alignRight');

// Links
editor.execCommand('insertLink', { url: 'https://example.com', text: 'Link' });
editor.execCommand('removeLink');

// Colors
editor.execCommand('textColor', { color: '#ff0000' });
editor.execCommand('backgroundColor', { color: '#ffff00' });

// History
editor.execCommand('undo');
editor.execCommand('redo');
```

## ⌨️ Keyboard Shortcuts

Editora comes with 33+ built-in keyboard shortcuts:

- **Ctrl+B** (Mac: ⌘+B) - Bold
- **Ctrl+I** (Mac: ⌘+I) - Italic
- **Ctrl+U** (Mac: ⌘+U) - Underline
- **Ctrl+K** (Mac: ⌘+K) - Insert Link
- **Ctrl+Z** - Undo
- **Ctrl+Y** / **Ctrl+Shift+Z** - Redo
- **Ctrl+1** to **Ctrl+6** - Headings H1-H6
- **Ctrl+Shift+L** - Bullet List
- **Ctrl+Shift+O** - Numbered List
- **And many more!**

See [KEYBOARD_SHORTCUTS.md](../KEYBOARD_SHORTCUTS.md) for the complete list.

## 🎨 Styling

The editor uses your existing CSS styles. Add your own styles to customize:

```css
/* Editor container */
#editor {
    font-family: Georgia, serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
}

/* Headings */
#editor h1 { font-size: 2em; }
#editor h2 { font-size: 1.5em; }

/* Links */
#editor a {
    color: #007bff;
    text-decoration: underline;
}

/* Lists */
#editor ul { margin-left: 20px; }
#editor ol { margin-left: 20px; }

/* Placeholder */
#editor:empty:before {
    content: attr(placeholder);
    color: #999;
}
```

## 💾 Saving Content

### Save to LocalStorage

```javascript
// Save
function saveToLocalStorage() {
    const content = editor.getContent();
    localStorage.setItem('editor-content', content);
    console.log('Content saved!');
}

// Load
function loadFromLocalStorage() {
    const content = localStorage.getItem('editor-content');
    if (content) {
        editor.setContent(content);
    }
}

// Auto-save every 30 seconds
setInterval(saveToLocalStorage, 30000);

// Load on page load
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);
```

### Save to Server

```javascript
async function saveToServer() {
    const content = editor.getContent();
    
    try {
        const response = await fetch('/api/save-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        
        if (response.ok) {
            console.log('Content saved to server!');
        }
    } catch (error) {
        console.error('Save failed:', error);
    }
}

// Save button
document.getElementById('save-btn').addEventListener('click', saveToServer);

// Auto-save
editor.on('change', debounce(saveToServer, 2000));
```

## 🌐 Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📦 File Sizes

- **editora.min.js**: ~12 KB (minified)
- **editora.min.js.gz**: ~3.4 KB (gzipped)

## 🔧 Advanced Usage

### Multiple Editors on Same Page

```javascript
const editor1 = new Editora.Editor({
    element: document.getElementById('editor1'),
    content: '<p>First editor</p>'
});

const editor2 = new Editora.Editor({
    element: document.getElementById('editor2'),
    content: '<p>Second editor</p>'
});
```

### Programmatic Content Manipulation

```javascript
// Get current content
const content = editor.getContent();

// Modify it
const modifiedContent = content.replace(/old/g, 'new');

// Set it back
editor.setContent(modifiedContent);
```

### Custom Toolbar

```javascript
// Create custom toolbar
function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'custom-toolbar';
    
    const buttons = [
        { text: 'B', command: 'bold', tooltip: 'Bold (Ctrl+B)' },
        { text: 'I', command: 'italic', tooltip: 'Italic (Ctrl+I)' },
        { text: 'U', command: 'underline', tooltip: 'Underline (Ctrl+U)' }
    ];
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.title = btn.tooltip;
        button.onclick = () => editor.execCommand(btn.command);
        toolbar.appendChild(button);
    });
    
    return toolbar;
}

// Add it before editor
const editorElement = document.getElementById('editor');
editorElement.parentNode.insertBefore(createToolbar(), editorElement);
```

## 🐛 Troubleshooting

### Editor not loading
- Check browser console for errors
- Verify the script URL is correct
- Make sure the element ID matches

### Styles not applying
- Make sure your CSS is loaded after the editor
- Check CSS specificity
- Use browser DevTools to inspect elements

### Content not saving
- Check browser console for errors
- Verify your save function is being called
- Test with `console.log(editor.getContent())`

## 📚 Complete Example

See [examples/vanilla-html/index.html](../examples/vanilla-html/index.html) for a complete working example.

## 🔗 Links

- [GitHub Repository](https://github.com/ajaykr089/Editora)
- [Documentation](https://github.com/ajaykr089/Editora/blob/main/README.md)
- [Keyboard Shortcuts](https://github.com/ajaykr089/Editora/blob/main/KEYBOARD_SHORTCUTS.md)
- [API Documentation](https://github.com/ajaykr089/Editora/tree/main/packages/core)

## 📝 License

MIT License - see [LICENSE](../LICENSE) file for details.
