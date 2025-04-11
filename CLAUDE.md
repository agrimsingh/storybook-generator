# STORYBOOK-GENERATOR CODEBASE GUIDELINES

## Build Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build the project for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Code Style

### Imports & Organization
- Import React components from libraries first, then local files
- Group imports by type, separated by empty line
- Use absolute imports with `@/` prefix for project files

### TypeScript & Components
- Use TypeScript for type safety, define interfaces for props
- Use functional components with React.FC type or forwardRef pattern
- Prefer explicit return types on functions and actions

### Naming & Structure
- Components: PascalCase (Button, StoryInputForm)
- Hooks: camelCase with 'use' prefix (useTextToSpeech)
- Files: kebab-case for components (site-header.tsx)
- CSS: tailwind with cn utility for conditional classes

### Error Handling
- Use try/catch in async functions
- Propagate errors with meaningful messages
- Console.error for debugging, throw with descriptive text

### State Management
- Use Zustand for global state (see lib/store.ts)
- Use React's useState/useReducer for component state

### AI/API Integration
- Access API tokens from environment variables
- Handle API errors and timeouts gracefully