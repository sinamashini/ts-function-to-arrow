# ts-function-to-arrow

[![npm version](https://badge.fury.io/js/ts-function-to-arrow.svg)](https://badge.fury.io/js/ts-function-to-arrow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/ts-function-to-arrow.svg)](https://github.com/YOUR_USERNAME/ts-function-to-arrow/stargazers)

A CLI tool to convert TypeScript function declarations to arrow functions in a specified directory.

## ✨ Features

- 🔄 Converts regular named functions to `const` arrow functions
- 📦 Handles `export default` functions (both named and anonymous)
- ✅ Preserves async functions, parameters, and return types
- 📁 Processes entire directories (defaults to `src`)
- ❓ Interactive confirmation prompt before conversion
- 📊 Verbose output showing all changes made
- 🔧 TypeScript-powered with `ts-morph` for accurate parsing

## 🚀 Installation

```bash
npm install -g ts-function-to-arrow
```
