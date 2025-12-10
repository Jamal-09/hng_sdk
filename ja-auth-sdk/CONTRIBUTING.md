# Contributing to React Native Firebase Auth SDK

First off, thank you for considering contributing to Ja Auth SDK! 🎉

It's people like you that make this SDK a great tool for the React Native community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Questions](#questions)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and considerate to all contributors.

### Our Standards

- ✅ Be welcoming and inclusive
- ✅ Be respectful of differing viewpoints
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v19 or higher)
- **npm** or **yarn**
- **Git**
- **React Native development environment** (for testing)
  - Xcode (for iOS)
  - Android Studio (for Android)

### Ways to Contribute

You can contribute in many ways:

- 🐛 **Report bugs**
- 💡 **Suggest new features**
- 📝 **Improve documentation**
- 🔧 **Fix issues**
- ✨ **Add new features**
- 🧪 **Write tests**
- 💬 **Help others in discussions**

## Development Setup

### 1. Fork the Repository

Click the **Fork** button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/ikennarichard/ja-auth-sdk.git
cd ja-auth-sdk
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Package

```bash
npm run build
```

---

## How to Contribute

### Working on an Issue

1. **Find an issue** to work on or create a new one
2. **Comment on the issue** saying you'd like to work on it
3. **Wait for assignment** (maintainers will assign it to you)
4. **Create a branch** for your work

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### Making Changes

1. **Make your changes** following our coding standards
2. **Write/update tests** for your changes
3. **Update documentation** if needed
4. **Test thoroughly** on both iOS and Android

## Coding Standards

### TypeScript

- Use **TypeScript** for all code
- Define proper **types and interfaces**
- Avoid using `any` unless absolutely necessary
- Use **meaningful variable names**

```typescript
// ✅ Good
interface UserCredentials {
  email: string;
  password: string;
}

const signIn = async (credentials: UserCredentials): Promise<AuthUser> => {
  // ...
};

// ❌ Bad
const signIn = async (a: any, b: any): Promise<any> => {
  // ...
};
```

### Comments

- Write **clear, concise comments**
- Document **complex logic**

## Commit Guidelines

We follow the **Conventional Commits** specification.

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## Pull Request Process

### Before Submitting

- ✅ Code follows style guidelines (`npm run lint`)
- ✅ Build succeeds (`npm run build`)
- ✅ Documentation is updated
- ✅ Commit messages follow conventions

### Submitting a PR

1. **Push your changes** to your fork

```bash
git push origin feature/your-feature-name
```

2. **Open a Pull Request** from your fork to the main repository

3. Add a descriptive PR or you can follow the one below

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Added/updated tests
- [ ] All tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Reporting Bugs

### Before Submitting a Bug Report

- Check if the bug has already been reported
- Test with the latest version
- Collect relevant information

### How to Submit a Bug Report

Use the **Bug Report** issue template and include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details**
   - OS (iOS/Android version)
   - React Native version
   - Package version
6. **Code samples** or screenshots
7. **Error messages** or stack traces

### Example Bug Report

```markdown
## Bug Description
Google Sign-In throws DEVELOPER_ERROR on Android

## Steps to Reproduce
1. Install package version 1.0.0
2. Configure with webClientId
3. Call signIn.google()
4. Error occurs

## Expected Behavior
Google Sign-In should work successfully

## Actual Behavior
Throws "DEVELOPER_ERROR" exception

## Environment
- OS: Android 13
- React Native: 0.72.0
- Package: 1.0.0
- Device: Samsung Galaxy S21

## Additional Context
SHA-1 fingerprint is correctly configured in Firebase Console
```

## Suggesting Features

### Before Suggesting a Feature

- Check if it's already been suggested
- Ensure it aligns with project goals
- Consider if it benefits the community

### How to Suggest a Feature

Use the **Feature Request** template and include:

1. **Clear title** for the feature
2. **Problem description** - What problem does it solve?
3. **Proposed solution**
4. **Alternative solutions** considered
5. **Additional context** or examples

### Example Feature Request

```markdown
## Feature Request
Add biometric authentication support

## Problem
Users want to use fingerprint/face recognition for faster login

## Proposed Solution
Add a BiometricProvider that:
- Uses device biometric sensors
- Falls back to password if unavailable
- Supports both iOS and Android

## Alternative Solutions
- Use third-party biometric library
- Implement as optional plugin

## Additional Context
Many modern apps support this feature
```

## Questions

### Where to Ask Questions

- **GitHub Discussions** - For general questions and discussions
- **GitHub Issues** - For bug reports and feature requests

## Thank You

Your contributions make a big difference. We appreciate your time and effort in making this SDK better for everyone.
