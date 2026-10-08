<div align="center">

# .* Regex Tester

**A fast, free, live regex tester with match highlighting and capture groups — 100% client-side.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bordia98.github.io-7C3AED?style=for-the-badge&logo=github)](https://bordia98.github.io/regex-tester/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![HTML](https://img.shields.io/badge/Built%20with-HTML%20%2F%20CSS%20%2F%20JS-orange?style=for-the-badge&logo=html5)](index.html)
[![No dependencies](https://img.shields.io/badge/Dependencies-None-blue?style=for-the-badge)](index.html)

[**→ Open Live App**](https://bordia98.github.io/regex-tester/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Live Match Highlighting** | Matches highlighted in real-time as you type your pattern |
| 🎨 **Color-Coded Matches** | Up to 4 distinct colors cycle through successive matches |
| 👁️ **Capture Groups** | Named and numbered capture groups shown per match |
| 🔁 **Replace Preview** | Live replace output with `$1`, `$2` group substitution |
| 🚩 **Flag Toggles** | Visual buttons for `g`, `m`, `i`, `s`, `u` flags |
| 📋 **Cheatsheet** | Quick-reference for anchors, quantifiers, groups, character classes |
| ✏️ **Insert from Cheatsheet** | Click any cheatsheet token to insert it into the pattern |
| 🎯 **Preset Patterns** | One-click patterns for email, URL, IPv4, phone, hex color, date |
| 📋 **Paste from Clipboard** | Instantly paste test strings from clipboard |
| 📝 **Sample Loader** | Load a demonstration regex + test string |
| ⚠️ **Error Display** | Invalid patterns shown with the JavaScript error message |
| 🌙☀️ **Dark / Light Theme** | Toggles with a single click; preference is saved |
| 🔒 **100% Private** | Nothing is ever sent to a server or stored anywhere |

---

## 🚀 Getting Started

No build step, no dependencies, no server needed.

```bash
# Clone the repo
git clone https://github.com/bordia98/regex-tester.git
cd regex-tester

# Open directly in your browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Or visit the live site: **[bordia98.github.io/regex-tester](https://bordia98.github.io/regex-tester/)**

---

## 🗂️ Project Structure

```
regex-tester/
├── index.html      # App shell — semantic HTML, regex bar, cheatsheet, presets
├── style.css       # Design system — dark/light themes, highlight colors, responsive
├── app.js          # All logic — live matching, highlighting, replace, flags
├── robots.txt      # Search engine crawl rules
├── sitemap.xml     # XML sitemap for discoverability
└── LICENSE         # MIT License
```

---

## 🛠️ How It Works

The app uses the **browser's native `RegExp` engine** — zero external libraries:

```
User types pattern + flags
           │
           ▼
    new RegExp(pattern, flags)  ──── SyntaxError ──→  Error bar
           │
           ▼  success
   re.exec() loop over test string
           │
     ┌─────┴──────┐
     ▼             ▼
Match list     Highlight layer
(groups, idx)  (transparent <mark> overlay)
     │
     ▼
Replace preview via String.replace(re, replacement)
```

The highlight overlay is a transparent `<div>` positioned exactly over the `<textarea>` with matching font metrics, so `<mark>` elements visually align with the text below.

---

## 🌐 Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under *Branch*, choose `main` and folder `/ (root)`.
4. Click **Save** — your site will be live at `https://bordia98.github.io/regex-tester/` in ~1 minute.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Open a Pull Request

Please keep the code vanilla HTML/CSS/JS — no frameworks or build tools.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [bordia98](https://github.com/bordia98) · No data is ever stored or sent anywhere

</div>
