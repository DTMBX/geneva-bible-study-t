# Geneva Bible Study Platform

A scholarly, offline-capable Bible study application that positions the Geneva Bible as the primary reading text while enabling effortless translation comparison, historical exploration, and understanding of how the biblical canon formed across traditions.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/YOUR_REPO/deploy.yml?branch=main)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
[![Lighthouse CI](https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/YOUR_REPO/lighthouse-ci.yml?branch=main&label=lighthouse)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/lighthouse-ci.yml)
[![GitHub Pages](https://img.shields.io/badge/deployed%20on-GitHub%20Pages-brightgreen)](https://YOUR_USERNAME.github.io/YOUR_REPO/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

> **🚀 Quick Deploy:** Get live in 5 minutes! See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

## ✨ Features

- **Multi-Translation Bible Reader** - Read Scripture in 16+ public domain translations
- **Translation Comparison** - Side-by-side comparison with synchronized scrolling
- **Audio Bible** - Listen with multiple narrator options and voice annotations
- **Reading Plans** - Structured plans with daily chapters and progress tracking
- **Social Features** - Connect with friends, share verses, and discuss Scripture
- **Group Discussions** - Collaborative Bible study with role-based permissions
- **Search & Timeline** - Full-text search and interactive historical timeline
- **Voice Annotations** - Record reflections with AI transcription
- **Dark Mode** - Automatic scheduling based on sunset/sunrise or custom times
- **Offline Support** - Download translations for offline study

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📦 Deployment

### 🚀 GitHub Pages (Automated) - Recommended

This project includes a pre-configured GitHub Actions workflow for automatic deployment.

**Quick Setup (5 Minutes):**

1. **Run Setup Script:**
   ```bash
   # Linux/Mac
   chmod +x setup-github-pages.sh
   ./setup-github-pages.sh
   
   # Windows
   setup-github-pages.bat
   ```
   
   Or manually update:
   - `vite.config.ts`: Change base path to `/YOUR_REPO/`
   - `package.json`: Update repository URLs

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push origin main
   ```

4. **Access:**
   - Monitor: [Actions tab]
   - Live site: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

**📖 Detailed Guide:** See [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)

**✅ Checklist:** Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

### Alternative Hosting

The `dist` folder can be deployed to any static hosting service:

- **Vercel:** `vercel --prod`
- **Netlify:** Drag and drop `dist` folder  
- **Firebase:** `firebase deploy`
- **AWS S3:** Upload `dist` contents

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides.

## 📚 API Integration

This application uses the **Bolls Life Bible API** for authentic Bible text:

- **License:** Public Domain
- **Attribution:** Not Required
- **API Key:** Not Required
- **Translations:** 16+ public domain versions
- **Coverage:** Complete Old & New Testament

See [BIBLE_API_INTEGRATION.md](./BIBLE_API_INTEGRATION.md) for detailed API documentation.

## 🎨 Technology Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 with custom theme
- **UI Components:** Radix UI primitives with shadcn/ui
- **Icons:** Phosphor Icons
- **State Management:** React hooks with KV persistence
- **Animations:** Framer Motion
- **Fonts:** Crimson Pro, Literata, JetBrains Mono (Google Fonts)

## 📖 Key Dependencies

All dependencies use permissive, non-attributable licenses:

- **MIT License:** React, Vite, Tailwind CSS, Radix UI, Framer Motion
- **Apache 2.0:** TypeScript
- **ISC License:** Phosphor Icons
- **Public Domain:** Bible text from Bolls Life API

See [package.json](./package.json) for complete dependency list.

## 🔒 License Compliance

This project is designed for maximum portability with non-attributable dependencies:

- ✅ No API keys required
- ✅ No attribution required for Bible text
- ✅ All UI libraries use MIT or permissive licenses
- ✅ No proprietary services or SDKs
- ✅ Fully self-contained application

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Optimize dependencies
npm run optimize
```

## 📊 Performance Testing

This project includes automated Lighthouse CI performance testing:

- **Automated Audits:** Run on every pull request and push to main
- **Mobile & Desktop:** Separate configurations for both form factors
- **Weekly Reports:** Comprehensive performance reports generated automatically
- **Performance Budgets:** Enforced thresholds for key metrics
- **PR Comments:** Automatic performance feedback on pull requests

See [LIGHTHOUSE_CI.md](./LIGHTHOUSE_CI.md) for detailed documentation on:
- Running Lighthouse tests locally
- Understanding performance scores
- Optimization recommendations
- CI/CD integration details

## 📁 Project Structure

```
.
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── reader/    # Bible reader components
│   │   ├── social/    # Social features
│   │   └── views/     # Main view components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and data
│   ├── styles/        # CSS and themes
│   ├── App.tsx        # Main application component
│   ├── index.css      # Global styles and theme
│   └── main.tsx       # Application entry point
├── .github/
│   └── workflows/     # GitHub Actions workflows
├── public/            # Static assets
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
└── package.json       # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Spark Template Resources

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

### Third-Party Licenses

- **Bible Text:** Public Domain (Bolls Life API)
- **Fonts:** SIL Open Font License 1.1 (Google Fonts)
- **UI Libraries:** MIT License (React, Radix UI, Tailwind CSS)
- **Icons:** MIT License (Phosphor Icons)

## 🙏 Acknowledgments

- [Bolls Life Bible API](https://bolls.life) for providing free, public domain Bible text
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Phosphor Icons](https://phosphoricons.com/) for comprehensive icon set
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation in the repository
- Review the [PRD.md](./PRD.md) for detailed feature specifications

---

Built with ❤️ for Bible study and spiritual growth
