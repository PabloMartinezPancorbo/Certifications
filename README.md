# Certifications

Certifications
├─ docs/                                # ← GitHub Pages publishes this folder
│  ├─ index.html                        # existing landing page for the project
│  ├─ (your other static HTML pages…)   # anything you've already placed here
│  └─ aws-quiz/                         # ⚠️ AUTO-GENERATED; don’t hand-edit
│      ├─ index.html
│      └─ assets/
│          ├─ *.js
│          └─ *.css
│
├─ aws-quiz-src/                        # ← editable React/Tailwind **source**
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.cjs
│  ├─ tailwind.config.cjs
│  ├─ vite.config.js
│  └─ src/
│      ├─ App.jsx                       # full AWS-quiz component
│      ├─ main.jsx
│      └─ index.css
│
├─ .github/
│  └─ workflows/
│      └─ build-quiz.yml                # GitHub Action that runs “npm run build”
│
└─ .gitignore                           # optional (see below)
