# 🎭 Broadway Archive — Women+ Conductors on Broadway

An interactive data visualization celebrating the contributions of Women+ as musical conductors on Broadway from 1915 to present day. This project showcases 385 productions through multiple interactive views, including a radial spiral chart, timeline, and data table.

**Created for the Women+ Conductors on Broadway Data Visualization Contest**

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/hafidaso/Broadway-Archive.git
cd Broadway-Archive

# Navigate to the project directory
cd broadway-viz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Data](#-data)
- [Architecture](#-architecture)
- [Performance](#-performance)
- [Accessibility](#-accessibility)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#-license)

---

## ✨ Features

### Interactive Visualizations
- **🎵 Radial Spiral Chart** — D3.js-powered musical staff visualization mapping time to angle and roles to spiral lines
- **📅 Interactive Timeline** — Chronological view of all productions grouped by decade with advanced filtering
- **📊 Statistics Dashboard** — Real-time statistics showing role distribution and key metrics
- **📋 Data Table** — Searchable, sortable table view with CSV export functionality
- **🔄 Conductor Comparison** — Side-by-side comparison of two conductors' careers and legacies

### User Experience
- **🎯 Focus Mode** — Select a conductor to see their complete career trajectory
- **🔍 Advanced Filtering** — Filter by role, decade, conductor name, or show title
- **🌟 Highlights Section** — Featured conductor spotlights with interactive cards and mobile carousel
- **🎨 Custom Cursor** — Immersive golden baton cursor with trail effect (desktop only)
- **🌊 Parallax Effects** — Mouse-following background gradients for enhanced depth
- **📱 Mobile Menu** — Slide-out navigation menu optimized for touch devices
- **🔄 Language Switching** — Seamless language switching with RTL support

### Responsive Design
- **📱 Mobile-First** — Fully responsive design optimized for all screen sizes (mobile, tablet, desktop)
- **💻 Desktop Enhancements** — Enhanced features for desktop users (cursor, parallax)
- **♿ Accessibility** — WCAG-compliant with keyboard navigation and screen reader support
- **🌐 Internationalization** — Full support for English, French, and Arabic (RTL)
- **📐 RTL Support** — Complete right-to-left layout support for Arabic language

---

## 🛠️ Technologies

### Core Framework
- **React 19.2.0** — Latest React with concurrent features
- **Vite (Rolldown)** — Fast build tool with Rust-based bundler
- **JavaScript (ES6+)** — Modern JavaScript features

### UI & Styling
- **Tailwind CSS 4.1.18** — Utility-first CSS framework
- **Framer Motion 12.26.2** — Animation library for React
- **Custom CSS** — Broadway-themed styling with animations

### Data Visualization
- **D3.js 7.9.0** — Data-driven document manipulation
  - Stack layouts for spiral chart
  - Area and curve generators
  - SVG path manipulation

### Additional Libraries
- **i18next** — Internationalization framework
- **html-to-image** — Chart export functionality
- **lucide-react** — Icon library
- **use-sound** — Audio feedback

### Development Tools
- **ESLint** — Code linting
- **PostCSS** — CSS processing
- **Autoprefixer** — CSS vendor prefixing

---

## 📁 Project Structure

```
Broadway-Archive/
├── broadway-viz/              # Main React application
│   ├── public/                # Static assets
│   │   ├── audio/            # Audio files
│   │   └── about.png         # Images
│   ├── src/
│   │   ├── assets/
│   │   │   └── data/
│   │   │       └── cleaned_data.json  # 385 production records
│   │   ├── components/       # React components
│   │   │   ├── App.jsx       # Main application container
│   │   │   ├── Navigation.jsx # Top navigation
│   │   │   ├── Hero.jsx       # Hero section
│   │   │   ├── About.jsx      # About section
│   │   │   ├── Highlights.jsx # Featured conductors
│   │   │   ├── Stats.jsx      # Statistics dashboard
│   │   │   ├── MusicChart.jsx # Radial spiral chart
│   │   │   ├── Timeline.jsx   # Chronological timeline
│   │   │   ├── DataTable.jsx  # Data table view
│   │   │   ├── ShowCard.jsx   # Reusable card component
│   │   │   ├── BatonCursor.jsx # Custom cursor
│   │   │   ├── GlobalParallaxBg.jsx # Parallax background
│   │   │   ├── StoryText.jsx  # Hero story stages component
│   │   │   ├── Baton.jsx      # Baton animation component
│   │   │   └── MoreCharts.jsx # Additional charts (not currently used)
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useMediaQuery.js
│   │   ├── locales/          # Translation files
│   │   │   ├── en.json        # English (195 keys)
│   │   │   ├── fr.json        # French (195 keys)
│   │   │   └── ar.json        # Arabic (212 keys, RTL)
│   │   ├── App.jsx           # Root component
│   │   ├── App.css           # Component styles
│   │   ├── index.css         # Global styles
│   │   ├── main.jsx          # Entry point
│   │   └── i18n.js           # i18n configuration
│   ├── index.html            # HTML template
│   ├── package.json          # Dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   └── README.md             # Project documentation
├── cleaned_data.json         # Processed data file
├── preprocess.py             # Data preprocessing script
├── COMPONENT_DIAGRAM.md      # Component diagrams
└── README.md                 # This file
```

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ (recommended: latest LTS)
- **npm** or **yarn**

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hafidaso/Broadway-Archive.git
   cd Broadway-Archive
   ```

2. **Navigate to project directory**
   ```bash
   cd broadway-viz
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

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

## 🎮 Usage

### Navigation
- Use the top navigation menu to jump to different sections
- Scroll through the page to explore all sections
- Use the "Skip to main content" link for accessibility

### Explore Section
- **Chart View**: Interactive radial spiral chart
  - Click on notes to see conductor details
  - Filter by conductor or role
  - Compare two conductors side-by-side
  - Export chart as PNG image
  - Mobile-optimized bottom sheet for details
  
- **Timeline View**: Chronological production timeline
  - Search by conductor name or show title
  - Filter by role and decade
  - View cards grouped by decade
  - Responsive filter panel for mobile/tablet
  
- **Table View**: Searchable data table
  - Search across all fields
  - Sort by any column
  - Export data as CSV
  - Horizontal scroll on mobile devices

### Keyboard Navigation
- `Tab` — Navigate through interactive elements
- `Enter` — Activate buttons and links
- `Escape` — Close modals and dropdowns

---

## 📊 Data

### Data Source
The dataset contains **385 production records** spanning from 1915 to 2025, curated by Sariva Goetz.

### Data Structure
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
    "role": "Music Director | Conductor | Music Supervisor | ...",
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

### Data Processing
The raw Excel data is processed using `preprocess.py` to create the cleaned JSON file:
- Cleans column names
- Processes dates
- Calculates decades
- Structures data consistently

---

## 🏗️ Architecture

### Component Architecture
- **Container Components**: App.jsx (state management)
- **Presentational Components**: ShowCard, Stats, About
- **Feature Components**: MusicChart, Timeline, DataTable
- **Layout Components**: Navigation, Hero, GlobalParallaxBg

### State Management
- Uses React's built-in state management (useState, useMemo)
- No global state management library
- Props drilling for shared state
- Local state for component-specific data

### Data Flow
1. Static JSON data loaded at build time
2. App.jsx processes data (marks pioneers, calculates stats)
3. Data passed to child components via props
4. Components filter and display data locally

For detailed component documentation, see [COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md).

---

## ⚡ Performance

### Optimizations
- **Memoization**: useMemo for expensive calculations
- **Conditional Rendering**: Desktop-only features disabled on mobile
- **Lazy Loading**: Images load lazily
- **Animation Performance**: requestAnimationFrame for smooth animations
- **Reduced Motion**: Respects user preferences

### Performance Considerations
- Large components (MusicChart ~1600 lines) could benefit from splitting
- Timeline renders all cards at once (could implement virtualization)
- D3.js bundle size could be optimized with tree-shaking

---

## ♿ Accessibility

### Implemented Features
- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use functional components with hooks
- Maintain accessibility standards
- Add comments for complex logic

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

## 🎯 Key Components

### MusicChart
- D3.js radial spiral visualization
- Interactive note selection
- Conductor filtering and comparison
- Chart export functionality
- Audio feedback

### Timeline
- Chronological production view
- Advanced filtering (search, role, decade)
- Grouped by decade
- Smooth card animations

### DataTable
- Searchable table view
- Sortable columns
- CSV export
- Responsive design

### ShowCard
- Reusable card component
- Conductor and show information
- Pioneer badge display
- Image error handling
- Hover animations

### StoryText
- Hero section story stages component
- Scroll-based animation stages
- Multi-stage narrative presentation
- Integrated with Hero component
- Supports all three languages

### Baton
- Animated baton component for Hero section
- Scroll-driven rotation and glow effects
- Visual metaphor for conducting
- Smooth motion animations

---

## 🌐 Internationalization

The application supports multiple languages with full translation coverage:
- **English** (en) — Default — 195 translation keys
- **French** (fr) — 195 translation keys
- **Arabic** (ar) — 212 translation keys with RTL support

### Features
- **Complete Translation Coverage** — All UI text, labels, and messages translated
- **RTL Support** — Full right-to-left layout for Arabic
- **Dynamic Language Switching** — Change language via navigation menu
- **Language Detection** — Automatic detection based on browser settings
- **LocalStorage Persistence** — Remembers user's language preference
- **Responsive Translations** — Mobile-optimized text and layouts

### Translation Structure
- Hero section (title, stages, CTAs)
- Navigation menu
- About section
- Highlights section
- Statistics dashboard
- Music chart (filters, tooltips, comparison)
- Timeline (search, filters, labels)
- Data table (headers, search, sorting)
- Footer and metadata

All translation files are validated and consistent across languages.

---

## 📱 Browser Support

### Desktop Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile & Tablet Browsers
- iOS Safari (iPhone & iPad)
- Chrome Mobile (Android)
- Firefox Mobile (Android)
- Samsung Internet

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

All features are fully functional across all device sizes with optimized layouts for mobile and tablet.

---

## 🐛 Known Issues

- Large MusicChart component could benefit from code splitting
- Timeline could implement virtualization for better performance with many items
- D3.js bundle size is large (consider tree-shaking)

---

## 🆕 Recent Updates

### Version 0.0.0 (Latest)
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

- [ ] TypeScript migration for type safety
- [ ] Code splitting with React.lazy
- [ ] Virtual scrolling for Timeline
- [ ] Enhanced search with highlighting
- [ ] PDF export functionality
- [ ] PWA capabilities
- [ ] Additional language support (Spanish, German, etc.)
- [ ] Dark/light theme toggle
- [ ] Advanced filtering combinations
- [ ] Export timeline as image

---

## 📚 Documentation

- [COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md) — Component diagrams and architecture
- [broadway-viz/README.md](./broadway-viz/README.md) — Application-specific documentation

---

## 🤝 Credits

- **Data Curation**: Sariva Goetz
- **Design & Development**: Hafida Belayd
- **Contest**: Women+ Conductors on Broadway Data Visualization Contest

### Special Thanks
- All the Women+ conductors featured in this visualization
- The Broadway community for preserving this history

---

## 📄 License

Created for the **Women+ Conductors on Broadway Data Visualization Contest**.

Data curated by Sariva Goetz.

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/hafidaso/Broadway-Archive](https://github.com/hafidaso/Broadway-Archive)
- **Live Demo**: [Coming Soon]
- **Portfolio**: [http://hafida-belayd.me/](http://hafida-belayd.me/)

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub or contact:
- **Email**: hafidabelaidagnaoui@gmail.com
- **GitHub**: [@hafidaso](https://github.com/hafidaso)
- **LinkedIn**: [Hafida Belayd](https://www.linkedin.com/in/hafida-belayd/)

---

**Made with ❤️ for the Women+ Conductors on Broadway community**
