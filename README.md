# DiShUI DocGen Project Setup Tutorial

An automated documentation generation system based on Vite + React + DiShuI.

## ✨ Features

- 🚀 **Auto Generation**: Scans `public/docs/` directory and automatically generates routes and menus
- 📝 **Markdown Support**: Full Markdown rendering capabilities
- 🎨 **Markmap Mind Maps**: Supports rendering Markdown as interactive mind maps
- 🔍 **Search Functionality**: Auto-generates search configuration with real-time document search
- 📱 **Responsive Design**: Perfect mobile adaptation
- 🎯 **Hierarchical Menus**: Supports multi-level directory structure with auto-generated nested menus
- ⚡ **Live Preview**: Regenerate after modifying documents to see changes instantly

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Create Documentation

1. Create `.md` files in the `public/docs/` directory
2. Use `# Title` format on the first line as the document title
3. Run the generation command

```bash
pnpm run gen:menu
```

### Start Development Server

```bash
pnpm run dev
```

### Build for Production

```bash
pnpm run build
```

## 📁 Documentation Structure

```
public/docs/
├── index.md                    # Homepage (path: /)
├── components.md               # Components doc (path: /components)
├── guide/                      # Guide directory → generates parent menu "Guide"
│   ├── index.md                # Guide homepage (path: /guide)
│   └── getting-started.md      # Getting Started (path: /guide/getting-started)
└── api/                        # API directory → generates parent menu "API Documentation"
    ├── index.md                # API homepage (path: /api)
    ├── components.md           # Components API (path: /api/components)
    └── utils.md                # Utility functions (path: /api/utils)
```

### Path Mapping Rules

- `index.md` → `/` (homepage, index.md in root directory)
- `components.md` → `/components`
- `guide/index.md` → `/guide` (directory homepage, serves as parent menu)
- `guide/getting-started.md` → `/guide/getting-started` (serves as child menu)
- `api/index.md` → `/api` (directory homepage, serves as parent menu)
- `api/components.md` → `/api/components` (serves as child menu)

### Hierarchical Menu Generation Rules

1. **Root directory files** → Generate top-level menu items
2. **Subdirectory + index.md** → Generate parent menu item (using index.md's title)
3. **Other .md files in subdirectory** → Generate `children` for that parent menu
4. **Infinite nesting supported** → Can have `docs/guide/advanced/concepts.md` etc.

## 📝 Creating Documentation Example

Create `public/docs/example.md`:

```markdown
# My Example Document

This is the document content.

## Section 1

Content...

## Section 2

More content...
```

Then run:

```bash
pnpm run gen:menu
```

Generated results:
- **Menu**: Automatically adds "My Example Document" menu item
- **Route**: Visit `/example` to display document content
- **Search**: Automatically indexed in search configuration

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |
| `pnpm run gen:menu` | 🎯 Generate menu.tsx (scan docs directory) |

## 🎯 Auto-Generated Content

After running `pnpm run gen:menu`, the script will:

1. ✅ Scan all `.md` files in `public/docs/` directory (supports nested directories)
2. ✅ Read the first line `#` title from each file as the menu name
3. ✅ Generate hierarchical menu configuration (`menuItems`) with nested `children`
4. ✅ Automatically generate `src/autogen/menu.tsx`

### Generation Example

**Input**:
```
public/docs/
├── index.md           # Homepage
├── guide.md           # Guide
└── api/
    ├── index.md       # API Documentation homepage
    └── reference.md   # API Reference
```

**Output**: `src/autogen/menu.tsx` contains:
- **3 menu items**: 
  - "Homepage" (top-level)
  - "Guide" (top-level)
  - "API Documentation" (top-level, with children: ["API Reference"])

## 🎨 Documentation Features

### Markdown Features

Supports standard Markdown syntax:
- Headings (`#` - `######`)
- Lists (ordered/unordered)
- Code blocks (with syntax highlighting)
- Tables
- Blockquotes
- Links and images
- And more...

### Markmap Mind Maps

Documents automatically enable Markmap, which can render Markdown structure as interactive mind maps.

### MDX Support

Supports using React components in Markdown (requires `enableMdx={true}`).

## 📖 Best Practices

### 1. Use index.md as Homepage

Always create `public/docs/index.md` as the homepage, it will automatically map to the `/` path.

### 2. Meaningful Titles

Ensure each document's first line is a clear title:

```markdown
# Clear Document Title

Document content...
```

### 3. Directory Organization

Use subdirectories to organize related documents:

```
docs/
├── index.md
├── guide/
│   ├── getting-started.md
│   ├── installation.md
│   └── configuration.md
└── api/
    ├── components.md
    └── hooks.md
```

### 4. Regenerate After Each Modification

After adding, deleting, or modifying document filenames, remember to run:

```bash
pnpm run gen:menu
```

## 🔧 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Router**: TanStack Router
- **UI Components**: DiShuI
- **Styling**: Tailwind CSS + DaisyUI
- **Markdown**: react-markdown (via DiShuI)

## 📦 Directory Structure

```
dishui_docs/
├── public/
│   └── docs/              # 📁 Documentation directory
│       ├── index.md       # Homepage
│       └── ...
├── scripts/
│   └── generate-menu.js   # 🔧 Auto-generate menu script
├── src/
│   ├── autogen/
│   │   └── menu.tsx      # ⚙️ Auto-generated menu configuration
│   ├── App.tsx           # Main application
│   ├── main.tsx          # Entry file
│   └── index.css         # Styles
├── package.json
└── vite.config.ts
```

## 🤝 Workflow

```bash
# 1. Create or modify documentation
echo "# New Document" > public/docs/new-doc.md

# 2. Run generation script
pnpm run gen:menu

# 3. Start development server (if not already running)
pnpm run dev

# 4. View in browser at http://localhost:5173
```

## 💡 Tips

- The generated `src/autogen/menu.tsx` will be completely overwritten, do not edit manually
- If customization is needed, modify `scripts/generate-menu.js`
- Document filenames will affect URL paths
- Multi-level nested directories are supported

## 📄 License

MIT
