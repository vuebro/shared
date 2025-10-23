# Qwen Code Context for @vuebro/shared

## Project Overview

This is a shared library providing common utilities, reactive data structures, and validation schemas for Vue-based applications, particularly those built with the VueBro ecosystem. It's a TypeScript library that exports reactive data structures with Vue 3 compatibility and JSON Schema-based validation using AJV.

## Key Features

- **Reactive Data Management**: Uses Vue's reactivity system to manage shared data structures
- **JSON Schema Validation**: Validates data against predefined schemas using AJV
- **Tree Data Structure**: Provides utilities for working with hierarchical data through the `@vuebro/flat-json-tree` dependency
- **Type Safety**: Strong typing with TypeScript and JSON Schema integration
- **Vue 3 Compatibility**: Built specifically for Vue 3's Composition API

## Project Structure

```
src/
├── index.ts              # Main entry point with reactive data structures
└── types/                # JSON Schema definitions
    ├── credentials.ts    # AWS credentials schema
    ├── data.ts           # Data schema
    ├── feed.ts           # Feed schema
    ├── fonts.ts          # Fonts schema
    ├── importmap.ts      # Import map schema
    ├── log.ts            # Log schema
    └── page.ts           # Page schema
```

## Key Dependencies

- `vue` (^3.5.22) - Vue 3 framework for reactivity
- `ajv` (^8.17.1) - JSON Schema validator
- `ajv-keywords` (^5.1.0) - Additional AJV keywords including dynamicDefaults
- `json-schema-to-ts` (^3.1.1) - Type generation from JSON schemas
- `@vuebro/flat-json-tree` (^2.1.11) - Tree navigation utilities

## Main Exports

### Reactive Data Structures
- `feed` - Reactive object for feed data
- `fonts` - Reactive array of font names
- `importmap` - Reactive object for import maps
- `pages` - Reactive array of pages with tree navigation
- `atlas` - Computed map of nodes by ID

### Tree Navigation Functions
- `add(parentId)` - Add a new node as a child
- `addChild(parentId)` - Add a child node
- `remove(nodeId)` - Remove a node
- `up(nodeId)` - Move node up in the sibling list
- `down(nodeId)` - Move node down in the sibling list
- `left(nodeId)` - Move node left in the hierarchy
- `right(nodeId)` - Move node right in the hierarchy

### Utility Functions
- `uid()` - Generate a unique identifier
- `getFontsObjectFromArray(fonts)` - Convert font array to object mapping

### Validators
- `validateCredentials` - Validate credentials against schema
- `validateLog` - Validate log entries against schema

### TypeScript Types
- `TPage` - Page data structure with hierarchical properties
- `TCredentials` - Credentials data structure
- `TFeed` - Feed data structure
- `TFonts` - Fonts data structure
- `TImportmap` - Import map data structure
- `TLog` - Log data structure

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

## Building and Running

### Build Command
```bash
npm run build
```
This runs `tsc && tsc-alias` to compile TypeScript and resolve path aliases.

### Linting
```bash
npm run lint
```
This runs ESLint with the project's shared configuration.

### Development Dependencies
- `@vuebro/configs` - Shared configurations for TypeScript and ESLint
- `@types/node` - TypeScript definitions for Node.js

## Development Conventions

1. **Type Safety**: All data structures are defined using JSON schemas that are converted to TypeScript types.
2. **Validation**: All reactive data structures are validated against their respective schemas using AJV.
3. **Vue Reactivity**: Uses Vue's reactivity system for managing shared state.
4. **Auto-generated IDs**: Uses dynamic defaults with a UUID generator for creating unique identifiers.

## File Purpose

This QWEN.md file serves as a comprehensive guide to understanding the `@vuebro/shared` library, its functionality, and how to contribute to or use it effectively. The library is designed to provide a consistent foundation for Vue-based applications in the VueBro ecosystem with proper type safety and validation.