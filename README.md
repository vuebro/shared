# @vuebro/shared

A shared library providing common utilities, reactive data structures, and validation schemas for Vue-based applications, particularly those built with the VueBro ecosystem.

## Overview

This library provides a set of shared reactive data structures and validation utilities that are commonly used across Vue applications. It includes:

- Reactive data structures with automatic validation
- JSON Schema-based type validation using AJV
- Tree data structure with navigation utilities
- Common data types for pages, feeds, fonts, import maps, and more

## Features

- **Reactive Data Management**: Uses Vue's reactivity system to manage shared data structures
- **JSON Schema Validation**: Validates data against predefined schemas using AJV
- **Tree Data Structure**: Provides utilities for working with hierarchical data
- **Type Safety**: Strong typing with TypeScript and JSON Schema integration
- **Vue 3 Compatibility**: Built specifically for Vue 3's Composition API

## Installation

```bash
npm install @vuebro/shared
```

## Usage

```typescript
import {
  feed,
  fonts,
  importmap,
  pages,
  add,
  addChild,
  remove,
  up,
  down,
  left,
  right,
  validateCredentials,
  validateLog,
  uid,
  getFontsObjectFromArray
} from '@vuebro/shared';

// Use reactive data structures
console.log(pages); // Reactive array of page objects

// Add a new page to the tree structure
const newPageId = add('parentId');

// Validate credentials
const isValid = validateCredentials(someCredentials);
```

## API

### Reactive Data Structures

- `feed`: Reactive object for feed data
- `fonts`: Reactive array of font names
- `importmap`: Reactive object for import maps
- `pages`: Reactive array of pages with tree navigation
- `atlas`: Computed map of nodes by ID

### Tree Navigation

- `add(parentId)`: Add a new node as a child
- `addChild(parentId)`: Add a child node
- `remove(nodeId)`: Remove a node
- `up(nodeId)`: Move node up in the sibling list
- `down(nodeId)`: Move node down in the sibling list
- `left(nodeId)`: Move node left in the hierarchy
- `right(nodeId)`: Move node right in the hierarchy

### Utilities

- `uid()`: Generate a unique identifier
- `getFontsObjectFromArray(fonts)`: Convert font array to object mapping

### Validators

- `validateCredentials`: Validate credentials against schema
- `validateLog`: Validate log entries against schema

## Data Types

The library exports the following TypeScript types:

- `TPage`: Page data structure with hierarchical properties
- `TCredentials`: Credentials data structure
- `TFeed`: Feed data structure
- `TFonts`: Fonts data structure
- `TImportmap`: Import map data structure
- `TLog`: Log data structure

## Data Structure Enhancements

Each page in the tree automatically gets enhanced with computed properties:

- `$children`: Enabled child nodes
- `$index`: Index among siblings
- `$next` / `$prev`: Next/previous sibling among enabled nodes
- `$siblings`: All enabled siblings
- `i`: Icon class name
- `path`: URL path based on branch
- `title`: Page title (header or name)
- `to`: Full URL path

## License

AGPL-3.0-or-later

## Author

Jerry Bruwes <jbruwes@gmail.com>