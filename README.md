# Basic Template

A basic starter template for web projects using HTML, CSS, and JavaScript, bundled with Webpack and linted with ESLint.

## Features

- Modern project structure
- Webpack for bundling
- ESLint for code quality
- Organized folders for assets, modules, and styles
- Ready-to-use scripts for development and production

## Getting Started

### 1. Clone the repository

```sh
git clone git@github.com:David-Vaclavik/Basic-Template.git
cd Basic-Template
```

### 2. Install dependencies

```sh
npm install
```

### 3. Start the development server

```sh
npm run dev
```

### 4. Build for production

```sh
npm run build
```

## Project Structure

```
src/
  index.js         # Main JS entry point
  template.html    # HTML template
  assets/          # Fonts, icons, images
  modules/         # JS modules
  styles/          # CSS files
webpack.config.js  # Webpack configuration
eslint.config.mjs  # ESLint configuration
```

## Scripts

- `npm run dev` – Start development server with hot reload
- `npm run build` – Build for production
- `npm run watch` – Watch files and rebuild on changes
- `npm run deploy` – Deploy to GitHub Pages (if configured)

---

## Using This Template for a New Project

When you use this template for a new project, you should update the following:

1. **Project Metadata**

   - **package.json**
     - `"name"`: Change to your new project’s name (lowercase, no spaces).
     - `"description"`: Update to describe your new project.
     - `"author"`: Update if needed.
     - `"repository"`, `"bugs"`, `"homepage"`: Update URLs to match your new repo.

2. **README.md**

   - Change the project title and description.
   - Update any instructions or features to match your new project.
   - Update the repo URL in the clone command.

3. **Source Files**

   - `index.js`: Replace or remove starter code.
   - `template.html`: Update the title, meta tags, and content for your new project.
   - `assets`: Replace placeholder fonts, icons, and images with your own.
   - `modules`: Rename or remove example modules as needed.
   - `styles.css`: Replace or extend with your own styles.

4. **Configuration Files**

   - `webpack.config.js`: Update entry/output paths or plugin settings if your structure changes.
   - `eslint.config.mjs`: Adjust ESLint rules to fit your coding style if needed.

5. **LICENSE**

   - If you want a different license, update the `"license"` field in `package.json` and add a LICENSE file.

6. **Other**
   - Add or update `.gitignore` entries if your new project needs to ignore other files/folders.
   - Add new dependencies with `npm install` as needed for your project.

**Summary:**  
Update all project-specific names, descriptions, URLs, and starter code to reflect your new project.  
Then you’re ready to start building! 🚀

## License

ISC © David Vaclavik
