<div id="readme-top"></div>

<!-- PROJECT SHIELDS -->

[![Creator][creator-shield]][creator-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<!-- PROJECT HEADER -->

# 📑 next-template

> Production-ready Next.js starter with TypeScript, Tailwind, and i18n support. PWA-enabled for modern web development.

<!-- CALL TO ACTIONS -->

[![🚀 Explore Demo][demo-shield]][demo-url]
[![🐛 Report Bug][bug-shield]][bug-url]
[![✨ Request Feature][feature-shield]][feature-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#structure">Structure</a></li>
    <li><a href="#tasks">Tasks</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<br />

<!-- ABOUT THE PROJECT -->

## About The Project

A modern, feature-rich Next.js template that provides everything you need to build production-ready web applications. Built with TypeScript and React, this template includes:

- 🌍 **Internationalization** - Built-in support for multiple languages using next-localization
- 🎨 **Theme System** - Dark/light mode with customizable color schemes using Tailwind CSS
- 📱 **PWA Ready** - Progressive Web App support for offline functionality and mobile installation
- ⚡ **Performance Focused** - Server-side rendering and static site generation capabilities
- 🧪 **Testing Suite** - Comprehensive testing setup with Jest and React Testing Library
- 🔍 **Code Quality** - ESLint, Prettier, and CommitLint for consistent code style
- 🐶 **Git Hooks** - Husky for pre-commit formatting and pre-push testing
- 📦 **Component Library** - Reusable React components with TypeScript types
- 🛡️ **Type Safety** - Full TypeScript support throughout the project
- 📄 **Documentation** - Extensive documentation and examples

This template serves as a foundation for building modern web applications, incorporating best practices and popular tools from the React/Next.js ecosystem. It's designed to be both developer-friendly and production-ready, with careful attention to performance, accessibility, and user experience.

### Built With

[![Next.js][next-shield]][next-url]
[![React][react-shield]][react-url]
[![TypeScript][ts-shield]][ts-url]
[![TailwindCSS][tailwind-shield]][tailwind-url]
[![Jest][jest-shield]][jest-url]
[![ESLint][eslint-shield]][eslint-url]
[![CommitLint][commitlint-shield]][commitlint-url]
[![Prettier][prettier-shield]][prettier-url]
[![PWA][pwa-shield]][pwa-url]
[![Husky][husky-shield]][husky-url]
[![i18n][i18n-shield]][i18n-url]
[![HTML5][html-shield]][html-url]
[![Markdown][md-shield]][md-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/montymi/next-template

# Navigate to project directory
cd next-template

# Install dependencies
npm install

# Install Husky git hooks
npm run prepare

# Generate locale mappings
npm run prebuild
```

## Usage

The project includes several npm scripts for development, testing, and code quality:

### Development

```bash
# Start development server at http://localhost:3000
npm run dev

# Start production server
npm run start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Build Process

```bash
# Full production build
npm run build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- STRUCTURE -->

## Structure

```
next-template/
├── __tests__/             # Test files
│   ├── components/        # Component tests
│   ├── hooks/             # Hook tests
│   └── pages/             # Page tests
├── public/                # Static files
│   ├── images/            # Image assets
│   ├── locales/           # Translation files
│   └── manifest.json      # PWA manifest
├── scripts/               # Build Scripts
│   └── generate-locale-map.js
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── title.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── useNamespace.tsx
│   ├── pages/             # Next.js pages
│   │   ├── _app.tsx       # App wrapper
│   │   ├── _document.tsx  # Document wrapper
│   │   ├── index.tsx      # Home page
│   │   ├── 404.tsx        # Error page
│   │   ├── 500.tsx        # Server error page
│   │   ├── about.tsx      # About page
│   │   ├── dashboard.tsx  # Dashboard page
│   │   ├── profile.tsx    # Profile page
│   │   └── services.tsx   # Services page
│   └── styles/            # Stylesheets
│       ├── mappings.ts    # Locale Mapping
│       └── globals.css    # Global styles
├── commitlint.config.js   # ESLint configuration
├── eslint.config.mjs      # ESLint configuration
├── .prettierrc            # Prettier configuration
├── jest.config.ts         # Jest configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TASKS -->

## Tasks

- [ ] **Testing**

  - [ ] Add unit tests for all components
  - [ ] Add integration tests for pages
  - [ ] Add end-to-end tests using Cypress or Playwright
  - [ ] Setup test coverage reporting

- [ ] **Internationalization**

  - [ ] Add more language support
  - [ ] Implement RTL support for Arabic/Hebrew
  - [ ] Add language detection
  - [ ] Create translation contribution guide

- [ ] **Documentation**

  - [ ] Add JSDoc comments to all components
  - [ ] Create Storybook documentation
  - [ ] Add API documentation
  - [ ] Create contributing guidelines

- [ ] **Performance**

  - [ ] Implement image optimization
  - [ ] Add lazy loading for components
  - [ ] Optimize bundle size
  - [ ] Add performance monitoring

- [ ] **Accessibility**

  - [ ] Add ARIA labels
  - [ ] Implement keyboard navigation
  - [ ] Add screen reader support
  - [ ] Create accessibility guide

- [ ] **Security**
  - [ ] Add security headers
  - [ ] Implement CSP
  - [ ] Add rate limiting
  - [ ] Setup security scanning

See the [open issues][bug-url] for a full list of issues and proposed features.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

1. [Fork the Project](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`) using the following [naming convention](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`) while adhering to the specifications of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. [Open a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<br />

<!-- CONTACT -->

## Contact

Michael Montanaro

[linkedin-shield]: https://cdn-icons-png.flaticon.com/512/174/174857.png
[github-shield]: https://cdn-icons-png.flaticon.com/512/733/733553.png
[linkedin-url]: https://linkedin.com/in/michael-montanaro
[github-url]: https://github.com/montymi

<a href="https://linkedin.com/in/michael-montanaro/" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="20" height="20" />
</a>
<a href="https://github.com/montymi/" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="20" height="20" />
</a>

<br />

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Font Awesome](https://fontawesome.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[demo-shield]: https://img.shields.io/badge/🚀%20Explore%20Demo-grey?style=for-the-badge
[demo-url]: https://github.com/montymi/next-template
[bug-shield]: https://img.shields.io/badge/🐛%20Report%20Bug-grey?style=for-the-badge
[bug-url]: https://github.com/montymi/next-template/issues
[feature-shield]: https://img.shields.io/badge/✨%20Request%20Feature-grey?style=for-the-badge
[feature-url]: https://github.com/montymi/next-template/issues
[creator-shield]: https://img.shields.io/badge/-Created%20by%20montymi-maroon.svg?style=for-the-badge
[creator-url]: https://montymi.com/
[contributors-shield]: https://img.shields.io/github/contributors/montymi/ClearDocs.svg?style=for-the-badge
[contributors-url]: https://github.com/montymi/next-template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/montymi/next-template.svg?style=for-the-badge
[forks-url]: https://github.com/montymi/next-template/network/members
[stars-shield]: https://img.shields.io/github/stars/montymi/next-template.svg?style=for-the-badge
[stars-url]: https://github.com/montymi/next-template/stargazers
[issues-shield]: https://img.shields.io/github/issues/montymi/next-template.svg?style=for-the-badge
[issues-url]: https://github.com/montymi/next-template/issues
[license-shield]: https://img.shields.io/github/license/montymi/next-template.svg?style=for-the-badge
[license-url]: https://github.com/montymi/next-template/blob/main/LICENSE.txt
[next-shield]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[ts-shield]: https://img.shields.io/badge/Typescript-black?style=for-the-badge&logo=typescript&logoColor=natural
[ts-url]: https://www.typescriptlang.org/
[md-shield]: https://img.shields.io/badge/Markdown-black?style=for-the-badge&logo=markdown&logoColor=natural
[md-url]: https://daringfireball.net/projects/markdown/
[html-shield]: https://img.shields.io/badge/HTML5-black?style=for-the-badge&logo=html5&logoColor=natural
[html-url]: https://html.spec.whatwg.org/
[tailwind-shield]: https://img.shields.io/badge/Tailwindcss-black?style=for-the-badge&logo=tailwindcss&logoColor=natural
[tailwind-url]: https://tailwindcss.com/
[jest-shield]: https://img.shields.io/badge/Jest-black?style=for-the-badge&logo=jest&logoColor=natural
[jest-url]: https://jestjs.io/
[react-shield]: https://img.shields.io/badge/React-black?style=for-the-badge&logo=react&logoColor=natural
[react-url]: https://react.dev/
[eslint-shield]: https://img.shields.io/badge/ESLint-black?style=for-the-badge&logo=eslint&logoColor=natural
[eslint-url]: https://eslint.org/
[prettier-shield]: https://img.shields.io/badge/Prettier-black?style=for-the-badge&logo=prettier&logoColor=natural
[prettier-url]: https://prettier.io/
[pwa-shield]: https://img.shields.io/badge/PWA-black?style=for-the-badge&logo=pwa&logoColor=natural
[pwa-url]: https://web.dev/explore/progressive-web-apps
[husky-shield]: https://img.shields.io/badge/🐶Husky-black?style=for-the-badge&logoColor=natural
[husky-url]: https://typicode.github.io/husky/
[i18n-shield]: https://img.shields.io/badge/🌍i18n-black?style=for-the-badge&logoColor=natural
[i18n-url]: https://github.com/StarpTech/next-localization
[commitlint-shield]: https://img.shields.io/badge/commitlint-black?style=for-the-badge&logo=commitlint&logoColor=natural
[commitlint-url]: https://commitlint.js.org/
