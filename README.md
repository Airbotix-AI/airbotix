# Airbotix Website

🚀 **Modern static website for Airbotix** - Australia's premier EdTech company bringing AI and Robotics education to K-12 students.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Airbotix-blue?style=flat&logo=linkedin)](https://www.linkedin.com/company/airbotix-ai)
[![Website](https://img.shields.io/badge/Website-Live-green?style=flat)](https://airbotix.github.io/airbotix-website/)

## 🎯 Project Overview

Airbotix is dedicated to empowering Australia's next generation with cutting-edge AI and Robotics education. This website serves as our digital presence, showcasing our workshops, services, and educational impact.

### Key Goals
- 🏠 **Homepage**: Fast, responsive, and internationalized landing page
- 🎓 **Workshops**: Showcase our AI & Robotics educational programs
- 📸 **Media Gallery**: Display workshop photos, videos, and student achievements  
- 🛒 **Future Integration**: Ready for booking and e-commerce modules
- 🌐 **International**: Built for future multi-language support

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast development
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for modern, responsive design
- **Routing**: [React Router](https://reactrouter.com/) for client-side navigation
- **Code Quality**: ESLint + Prettier for consistent code formatting
- **Deployment**: GitHub Pages with automated CI/CD

## 🏗️ Project Structure

```
airbotix-website/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Site footer
│   │   └── Layout.tsx      # Main layout wrapper
│   ├── pages/              # Page components
│   │   └── Home.tsx        # Homepage
│   ├── assets/             # Images, icons, media
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── docs/                   # Documentation
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Quick Start
```bash
# Clone and setup
git clone https://github.com/your-username/airbotix-website.git
cd airbotix-website
npm install

# Start development
npm run dev

# Build for production
npm run build
```

### Prerequisites
- **Node.js 20+** - Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn** - npm comes with Node.js, or install yarn: `npm install -g yarn`
- **Git** - Download from [git-scm.com](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/airbotix-website.git
   cd airbotix-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Visit [http://localhost:5173](http://localhost:5173) (Vite's default port)

### Building for Production

5. **Build the project**
   ```bash
   npm run build
   # or
   yarn build
   ```
   This creates a `dist/` folder with optimized production files.

6. **Preview production build locally**
   ```bash
   npm run preview
   # or
   yarn preview
   ```
   This serves the built files locally for testing before deployment.

### Code Quality

7. **Run linting**
   ```bash
   npm run lint
   # or
   yarn lint
   ```
   Checks code quality and formatting with ESLint.

## 📜 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with hot reload | `npm run dev` |
| `npm run build` | Build production-ready static files | `npm run build` |
| `npm run preview` | Preview production build locally | `npm run preview` |
| `npm run lint` | Run ESLint for code quality checks | `npm run lint` |
| `npm run deploy` | Deploy to GitHub Pages | `npm run deploy` |

### Script Details

- **`dev`**: Starts Vite dev server with hot module replacement (HMR)
- **`build`**: Compiles TypeScript and builds optimized production bundle
- **`preview`**: Serves the built files locally for testing
- **`lint`**: Runs ESLint with TypeScript support for code quality
- **`deploy`**: Automatically builds and deploys to GitHub Pages

## ✉️ Contact Form Setup

You can enable the contact form on `/contact` in two ways:

### Option A: Formspree (recommended)
1. Create a form at `https://formspree.io` and copy your form ID (e.g., `xayzabcd`).
2. Create a `.env` file at the project root and add:
   ```bash
   VITE_FORMSPREE_ID=your_form_id
   ```
3. Restart the dev server.

### Option B: Mailto fallback
1. Create a `.env` file at the project root and add:
   ```bash
   VITE_CONTACT_EMAIL=contact@example.com
   ```
2. When no Formspree ID is provided, submitting the form will open the user's email client pre-filled with the message.

## 🚢 Deployment

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using the `gh-pages` branch method.

#### Automatic Deployment (Recommended)

1. **Push to main branch** - Deployment happens automatically via GitHub Actions
2. **Manual deployment**:
   ```bash
   npm run deploy
   ```

#### Setup Steps

1. **Configure repository settings**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/ (root)`

2. **Update base path** (if needed):
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/your-repo-name/', // Update this to match your repository name
   })
   ```

3. **Update basename in routing**:
   ```tsx
   // src/main.tsx
   <BrowserRouter basename="/your-repo-name">
   ```

#### Custom Domain (Optional)

1. Add `CNAME` file to `public/` directory:
   ```
   your-domain.com
   ```

2. Configure DNS settings with your domain provider

## 🎨 Customization

### Colors & Branding
Edit the color palette in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Your primary colors */ },
      secondary: { /* Your secondary colors */ }
    }
  }
}
```

### Components
- **Header**: Update navigation links in `src/components/Header.tsx`
- **Footer**: Modify company info in `src/components/Footer.tsx`
- **Homepage**: Customize content in `src/pages/Home.tsx`

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Header.tsx`

## 🤝 Contributing

We welcome contributions! Please see our [rules.md](./rules.md) for development guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support & Contact

- **Website**: [airbotix.github.io/airbotix-website](https://airbotix.github.io/airbotix-website/)
- **LinkedIn**: [linkedin.com/company/airbotix-ai](https://www.linkedin.com/company/airbotix-ai)
- **Email**: info@airbotix.com

## 🔧 Troubleshooting

### Common Issues

**Port already in use**
```bash
# If port 5173 is busy, Vite will automatically try the next available port
# Or specify a custom port:
npm run dev -- --port 3000
```

**Build fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

**Linting issues**
```bash
# Auto-fix linting issues
npm run lint -- --fix
```

### Environment Setup

**Node.js version**
```bash
# Check your Node.js version
node --version  # Should be 20+

# Use nvm to manage Node.js versions
nvm install 20
nvm use 20
```

## 📄 License

This project is proprietary to Airbotix. All rights reserved.

---

**Built with ❤️ by the Airbotix team** 🤖✨
