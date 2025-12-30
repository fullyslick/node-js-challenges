# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js playground/sandbox repository for experimentation and training purposes.

## Commands

```bash
# Install dependencies
npm install

# Run tests (Jest)
npx jest

# Run a single test file
npx jest path/to/test.js

# Run tests in watch mode
npx jest --watch
```

## Testing

Jest 30.x is configured as the test runner. Test files should use the `.test.js` or `.spec.js` naming convention.