# 🎭 The Baton's Legacy — Women+ Conductors on Broadway

An interactive data visualization showcasing the contributions of Women+ as musical conductors on Broadway from 1915 to present day. This React application provides multiple interactive views to explore 385 production records through charts, timelines, and data tables.

**Created for the Women+ Conductors on Broadway Data Visualization Contest**

---

## 🎯 Features

### Interactive Visualizations
- ✨ **Interactive Timeline** — Explore every production across decades with advanced filtering
- 🎵 **Radial Spiral Staff** — D3.js-powered musical staff visualization with treble clef
- 📊 **Live Statistics Dashboard** — Real-time role distribution and key metrics
- 📋 **Data Table View** — Searchable, sortable table with CSV export

### User Experience
- 🔍 **Advanced Filtering** — Filter by role, decade, conductor name, or show title
- 🎯 **Focus Mode** — Select a conductor to see their complete career trajectory
- 🌟 **Highlights Section** — Featured conductor spotlights with interactive cards
- 🎨 **Custom Cursor** — Immersive golden baton cursor with trail effect (desktop only)
- 🌊 **Parallax Effects** — Mouse-following background gradients

### Responsive Design
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🖤 **Broadway Noir Theme** — Elegant black & gold styling
- 🌐 **Internationalization** — Full support for English, French, and Arabic (RTL)
- 📐 **RTL Support** — Complete right-to-left layout for Arabic
- ♿ **Accessibility** — WCAG-compliant with keyboard navigation

---

## 🛠️ Technologies

### Core
- **React 19.2.0** — Latest React with concurrent features
- **Vite (Rolldown)** — Fast build tool with Rust-based bundler
- **JavaScript (ES6+)** — Modern JavaScript features

### UI & Styling
- **Tailwind CSS 4.1.18** — Utility-first CSS framework
- **Framer Motion 12.26.2** — Animation library
- **Custom CSS** — Broadway-themed styling

### Data Visualization
- **D3.js 7.9.0** — Data-driven document manipulation
  - Stack layouts for spiral chart
  - Area and curve generators
  - SVG path manipulation

### Additional Libraries
- **i18next** — Internationalization
- **html-to-image** — Chart export
- **lucide-react** — Icons
- **use-sound** — Audio feedback

---

## 📁 Project Structure

```
broadway-viz/
├── public/                    # Static assets
│   ├── audio/
│   │   └── piano.mp3
│   └── about.png
│
├── src/
│   ├── assets/
│   │   └── data/
│   │       └── cleaned_data.json  # 385 production records
│   │
│   ├── components/
│   │   ├── App.jsx            # Main application container
│   │   ├── Navigation.jsx    # Top navigation
│   │   ├── Hero.jsx           # Hero section
│   │   ├── About.jsx          # About section
│   │   ├── Highlights.jsx   # Featured conductors
│   │   ├── Stats.jsx          # Statistics dashboard
│   │   ├── MusicChart.jsx     # Radial spiral chart (D3.js)
│   │   ├── Timeline.jsx       # Chronological timeline
│   │   ├── DataTable.jsx      # Data table view
│   │   ├── ShowCard.jsx       # Reusable card component
│   │   ├── BatonCursor.jsx    # Custom cursor
│   │   ├── GlobalParallaxBg.jsx # Parallax background
│   │   ├── StoryText.jsx      # Hero story stages component
│   │   ├── Baton.jsx          # Baton animation component
│   │   └── MoreCharts.jsx     # Additional charts (not currently used)
│   │
│   ├── hooks/
│   │   └── useMediaQuery.js   # Custom hooks
│   │       ├── useMediaQuery()
│   │       ├── useIsDesktop()
│   │       └── usePrefersReducedMotion()
│   │
│   ├── locales/
│   │   ├── en.json            # English translations (195 keys)
│   │   ├── fr.json            # French translations (195 keys)
│   │   └── ar.json            # Arabic translations (212 keys, RTL)
│   │
│   ├── App.jsx                # Root component
│   ├── App.css                # Component styles
│   ├── index.css              # Global styles
│   ├── main.jsx               # Entry point
│   └── i18n.js                # i18n configuration
│
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
└── README.md                  # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ (recommended: latest LTS)
- npm or yarn

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📊 Data Structure

The application uses a JSON dataset containing 385 production records:

```json
{
  "id": 1,
  "show_info": {
    "title": "Show Title",
    "type": "Original | Revival",
    "status": "Running | Closed",
    "opening": "YYYY-MM-DD",
    "performances": 1234
  },
  "conductor_info": {
    "name": "Conductor Name",
    "role": "Music Director | Conductor | Music Supervisor | Assistant Music Director | Associate Music Director | Associate Music Supervisor | Substitute Conductor",
    "photo": "Photo URL",
    "website": "Website URL",
    "ibdb": "IBDB URL",
    "fact": "Interesting fact",
    "lifespan": "Years"
  },
  "decade": 1990,
  "isPioneer": false
}
```

**Total records**: 385 productions spanning from 1915 to 2025.

---

## 🎯 Key Components

### 1. MusicChart
The most complex component (~1600 lines) featuring:
- **D3.js Radial Spiral Chart** — Musical staff visualization
- **Time Mapping** — Time mapped to angle (0-360°)
- **Role Mapping** — Roles mapped to spiral lines
- **Interactive Notes** — Click to view conductor details
- **Filtering** — Filter by conductor or role
- **Comparison Mode** — Compare two conductors side-by-side
- **Export** — Export chart as PNG image
- **Audio Feedback** — Sound effects on interactions

### 2. Timeline
Chronological production timeline:
- **Search** — Search by conductor name or show title
- **Filters** — Filter by role and decade
- **Grouping** — Cards grouped by decade
- **ShowCard Grid** — Responsive card layout
- **Smooth Animations** — Framer Motion animations

### 3. Stats
Statistics dashboard:
- **Role Distribution** — Horizontal bar chart
- **Key Metrics** — Total shows, conductors, decades
- **Noir Theme** — Broadway-themed visual design

### 4. Highlights
Featured conductor section:
- **Interactive Cards** — Hover effects and animations
- **Conductor Selection** — Click to filter chart view
- **Responsive Layout** — Mobile-optimized grid

### 5. DataTable
Searchable data table:
- **Search** — Search across all fields
- **Sorting** — Sort by any column
- **CSV Export** — Download dataset as CSV
- **Responsive** — Mobile-friendly table

### 6. ShowCard
Reusable card component:
- **Conductor Info** — Name, role, photo
- **Show Details** — Title, opening date, type
- **Pioneer Badge** — Badge for first women in roles
- **Image Handling** — Fallback to initials
- **Animations** — Hover effects and transitions

---

## 🎮 Usage

### Navigation
- Use the top navigation menu to jump to sections
- Scroll through the page to explore content
- Use "Skip to main content" for accessibility

### Explore Section
Switch between three views:

1. **Chart View** (MusicChart)
   - Click notes to see conductor details
   - Filter by conductor dropdown
   - Filter by role buttons
   - Compare two conductors side-by-side
   - Export chart as PNG
   - Mobile: Bottom sheet for conductor details
   - Touch-optimized interactions

2. **Timeline View**
   - Search bar for conductor/show name
   - Role filter dropdown
   - Decade filter dropdown
   - Cards grouped by decade
   - Click cards for details
   - Mobile: Collapsible filter panel
   - Responsive card grid layout

3. **Table View**
   - Search across all columns
   - Click column headers to sort
   - Export as CSV button
   - Mobile: Horizontal scroll support
   - Touch-friendly table interactions

### Keyboard Navigation
- `Tab` — Navigate through interactive elements
- `Enter` — Activate buttons and links
- `Escape` — Close modals

---

## ⚡ Performance

### Optimizations
- **Memoization** — useMemo for expensive calculations
- **Conditional Rendering** — Desktop-only features disabled on mobile
- **Lazy Loading** — Images load lazily
- **Animation Performance** — requestAnimationFrame for smooth animations
- **Reduced Motion** — Respects user preferences

### Performance Notes
- MusicChart is the largest component (~1600 lines)
- Timeline renders all cards (could benefit from virtualization)
- D3.js bundle size is large (consider tree-shaking)

---

## ♿ Accessibility

### Implemented Features
- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Skip to main content link
- ✅ Focus indicators
- ✅ Reduced motion support
- ✅ Screen reader compatibility
- ✅ RTL language support (Arabic)
- ✅ Mobile-optimized touch interactions
- ✅ Responsive typography and spacing

### WCAG Compliance
- Meets WCAG 2.1 Level AA standards
- High contrast text
- Keyboard accessible
- Screen reader friendly

---

## 🌐 Internationalization

### Supported Languages
- **English** (en) — Default — 195 translation keys
- **French** (fr) — 195 translation keys
- **Arabic** (ar) — 212 translation keys with RTL support

### Features
- **Complete Translation Coverage** — All UI elements translated
- **RTL Support** — Full right-to-left layout for Arabic
- **Dynamic Language Switching** — Change language via navigation menu
- **Language Detection** — Automatic detection based on browser settings
- **LocalStorage Persistence** — Remembers user's language preference

### Translation Files
- `src/locales/en.json` — English translations (195 keys)
- `src/locales/fr.json` — French translations (195 keys)
- `src/locales/ar.json` — Arabic translations (212 keys, RTL)

### Translation Coverage
All sections are fully translated:
- Hero section (title, stages, CTAs)
- Navigation menu
- About section
- Highlights section
- Statistics dashboard
- Music chart (filters, tooltips, comparison)
- Timeline (search, filters, labels)
- Data table (headers, search, sorting)
- Footer and metadata

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🏗️ Architecture

### Component Architecture
- **Container Components**: App.jsx (state management)
- **Presentational Components**: ShowCard, Stats, About
- **Feature Components**: MusicChart, Timeline, DataTable
- **Layout Components**: Navigation, Hero, GlobalParallaxBg

### State Management
- Uses React's built-in state (useState, useMemo)
- No global state management library
- Props drilling for shared state
- Local state for component-specific data

### Data Flow
1. Static JSON data loaded at build time
2. App.jsx processes data (marks pioneers, calculates stats)
3. Data passed to child components via props
4. Components filter and display data locally

For detailed component documentation, see [../COMPONENT_DIAGRAM.md](../COMPONENT_DIAGRAM.md).

---

## 🎨 Styling

### Tailwind CSS
- Utility-first approach
- Custom theme colors (Broadway gold #D4AF37)
- Responsive breakpoints (sm, md, lg, xl)

### Custom CSS
- Global styles in `index.css`
- Component styles in `App.css`
- Animations and keyframes
- Broadway-themed design

### Theme Colors
- **Broadway Gold**: #D4AF37
- **Broadway Black**: #0a0a0a
- **Theatre Black**: #0A0A0A

---

## 🐛 Known Issues

- MusicChart component is large and could benefit from splitting
- Timeline could implement virtualization for better performance
- D3.js bundle size is large (consider tree-shaking)

## 🆕 Recent Updates

### Latest Version
- ✅ **Full Arabic Language Support** — Complete RTL layout implementation
- ✅ **Comprehensive Translation** — 195+ keys in English/French, 212 keys in Arabic
- ✅ **Mobile & Tablet Optimization** — Fully responsive design tested and verified
- ✅ **Hero Section Translations** — All hero stages and CTAs translated
- ✅ **DataTable Translations** — Complete translation coverage for table view
- ✅ **RTL Compatibility** — Fixed tooltips, menus, and layouts for Arabic
- ✅ **Responsive Fixes** — Improved mobile menu, bottom sheets, and carousels
- ✅ **Translation Validation** — All translation files validated and consistent

---

## 🔮 Future Enhancements

- [ ] TypeScript migration
- [ ] Code splitting with React.lazy
- [ ] Virtual scrolling for Timeline
- [ ] Enhanced search with highlighting
- [ ] PDF export functionality
- [ ] PWA capabilities
- [ ] Additional language support

---

## 📚 Documentation

- [Main README](../README.md) — Project overview
- [COMPONENT_DIAGRAM.md](../COMPONENT_DIAGRAM.md) — Component diagrams and architecture

---

## 🤝 Credits

- **Data Curation**: Sariva Goetz
- **Design & Development**: Hafida Belayd
- **Contest**: Women+ Conductors on Broadway Data Visualization Contest

---

## 📄 License

Created for the **Women+ Conductors on Broadway Data Visualization Contest**.

Data curated by Sariva Goetz.

---

## 🔗 Links

- **GitHub**: [https://github.com/hafidaso/Broadway-Archive](https://github.com/hafidaso/Broadway-Archive)
- **Portfolio**: [http://hafida-belayd.me/](http://hafida-belayd.me/)

---

**Made with ❤️ for the Women+ Conductors on Broadway community**
