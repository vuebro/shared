# @vuebro/shared Project Context

## Project Overview

**@vuebro/shared** is a shared TypeScript library providing common utilities, reactive data structures, and validation schemas for Vue-based applications, particularly those built with the VueBro ecosystem. The library offers reactive data management with automatic validation using JSON Schema and AJV, tree data structures with navigation utilities, and common data types for various Vue application components.

## Key Features

- **Reactive Data Management**: Uses Vue 3's reactivity system to manage shared data structures
- **JSON Schema Validation**: Validates data against predefined schemas using AJV
- **Tree Data Structure**: Provides utilities for working with hierarchical data
- **Type Safety**: Strong typing with TypeScript and JSON Schema integration
- **Vue 3 Compatibility**: Built specifically for Vue 3's Composition API

## Architecture & Components

### Core Data Structures
- `feed`: Reactive object for feed data
- `fonts`: Reactive array of font names
- `importmap`: Reactive object for import maps
- `pages`: Reactive array of pages with tree navigation (uses `@vuebro/flat-json-tree`)
- `atlas`: Computed map of nodes by ID

### Tree Navigation Functions
- `add(parentId)`: Add a new node as a child
- `addChild(parentId)`: Add a child node
- `remove(nodeId)`: Remove a node
- `up(nodeId)`: Move node up in the sibling list
- `down(nodeId)`: Move node down in the sibling list
- `left(nodeId)`: Move node left in the hierarchy
- `right(nodeId)`: Move node right in the hierarchy

### Utility Functions
- `uid()`: Generate a unique identifier
- `getFontsObjectFromArray(fonts)`: Convert font array to object mapping

### Validators
- `validateCredentials`: Validate credentials against schema
- `validateLog`: Validate log entries against schema

## Project Structure

```
src/
├── index.ts          # Main entry point with reactive data structures
└── types/            # JSON Schema definitions for data types
    ├── credentials.ts
    ├── data.ts
    ├── feed.ts
    ├── fonts.ts
    ├── importmap.ts
    ├── log.ts
    └── page.ts
```

## Data Types

The library exports the following TypeScript types:
- `TPage`: Page data structure with hierarchical properties
- `TCredentials`: Credentials data structure
- `TFeed`: Feed data structure
- `TFonts`: Fonts data structure
- `TImportmap`: Import map data structure
- `TLog`: Log data structure

## Enhanced Page Properties

Each page in the tree automatically gets enhanced with computed properties:
- `$children`: Enabled child nodes
- `$index`: Index among siblings
- `$next` / `$prev`: Next/previous sibling among enabled nodes
- `$siblings`: All enabled siblings
- `i`: Icon class name
- `path`: URL path based on branch
- `title`: Page title (header or name)
- `to`: Full URL path

## Dependencies

- `@vuebro/flat-json-tree`: Tree data structure management
- `ajv`: JSON Schema validation
- `ajv-keywords`: Additional AJV keywords including dynamic defaults
- `json-schema-to-ts`: Type generation from JSON schemas
- `vue`: Vue 3 reactivity system

## Development Commands

- `npm run build`: Compiles TypeScript and runs tsc-alias
- `npm run lint`: Runs ESLint on the project

## Build System

- TypeScript configuration extends `@vuebro/configs/tsconfig`
- Builds to the `dist/` directory
- Uses ES modules (`type: "module"` in package.json)

## Testing & Validation

The library implements automatic validation through Vue watchers that validate data structures whenever they change. The validation is performed using AJV against predefined JSON schemas.

## Style & Conventions

- Uses ESLint configuration from `@vuebro/configs/eslint`
- Follows Vue 3 Composition API patterns
- TypeScript code with strict typing
- JSON Schema definitions for data validation

## Key Implementation Details

The library uses `Object.defineProperties` to add computed properties to page objects based on the tree structure. It leverages Vue's reactivity system to automatically validate data structures when they change and enhances page objects with navigation properties at runtime.

## Usage Context

This library is designed for use in Vue-based applications that need shared reactive data structures with automatic validation. It's particularly useful for applications that work with hierarchical page structures, configuration data, or other tree-like data models that require validation.