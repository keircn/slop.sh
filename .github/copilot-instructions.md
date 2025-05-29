# GitHub Copilot Instructions

This is a Next.js 15.3.2 project with TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion. Follow these guidelines when generating code.

## Project Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4.1.7 with CSS variables - Always use the classes defined in `globals.css`
- **UI Components**: shadcn/ui (New York style)
- **Animations**: Framer Motion v12.14.0
- **State Management**: React hooks (useState, useEffect, useContext)
- **Package Manager**: pnpm

## Code Style & Conventions

### TypeScript
- Use strict TypeScript with proper type definitions
- Prefer `interface` over `type` for object shapes
- Use proper generic types and avoid `any`
- Define types in dedicated files under `~/types/`
- Use `.d.ts` files for type definitions

### React Components
- Use functional components with hooks
- Prefer named exports for components
- Use proper TypeScript props interfaces
- Follow the component structure: imports → types → component → export

```tsx
'use client'; // Only when needed for client components

import { useState } from 'react';
import { Card } from '~/components/ui/card';
import type { ComponentProps } from '~/types/Component';

interface Props extends ComponentProps {
  // Additional props
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
}
```

### File Organization
- Use the `~` alias for imports from `src/`
- Components go in `~/components/`
- UI components from shadcn/ui go in `~/components/ui/`
- Types go in `~/types/`
- Utilities go in `~/lib/`
- Hooks go in `~/hooks/`
- Data/config go in `~/lib/data/`

### Import Order
1. React and Next.js imports
2. Third-party libraries
3. Internal components (UI components first)
4. Types (with `type` keyword)
5. Utilities and hooks

```tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { CustomComponent } from '~/components/CustomComponent';
import type { ComponentProps } from '~/types/Component';
import { cn } from '~/lib/utils';
import { useMobile } from '~/hooks/useMobile';
```

## Styling Guidelines

### Tailwind CSS
- Use Tailwind v4 syntax and features
- Prefer utility classes over custom CSS
- Use CSS variables for theming (defined in `globals.css`)
- Use the `cn()` utility for conditional classes
- Follow responsive design patterns: `sm:`, `md:`, `lg:`, `xl:`

```tsx
<div className={cn(
  "flex items-center justify-center",
  "bg-primary/5 hover:bg-primary/10",
  "transition-colors duration-200",
  isActive && "bg-primary text-primary-foreground",
  className
)}>
```

### shadcn/ui Components
- Use shadcn/ui components from `~/components/ui/`
- Follow the New York style configuration
- Extend components when needed rather than modifying originals
- Use proper component composition patterns

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="outline">Action</Button>
  </CardContent>
</Card>
```

## Animation Guidelines

### Framer Motion
- Use Framer Motion for page transitions and component animations
- Follow the existing `PageTransition` pattern
- Prefer `motion` components over `animate` prop
- Use proper exit animations for smooth transitions

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

## Next.js Patterns

### App Router
- Use `'use client'` directive only when necessary
- Prefer Server Components by default
- Use proper loading and error boundaries
- Follow the app directory structure

### Dynamic Imports
- Use dynamic imports for code splitting
- Include proper loading fallbacks
- Use SSR: false when needed for client-only components

```tsx
const DynamicComponent = dynamic(
  () => import('~/components/Component').then((mod) => ({
    default: mod.Component,
  })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false, // Only if needed
  }
);
```

### API Routes
- Use proper TypeScript for API routes
- Follow RESTful conventions
- Include proper error handling
- Use Zod for request validation
- Use async/await for dynamic parameters

## Performance Considerations

- Use `Suspense` boundaries for async components
- Implement proper loading states
- Use `React.memo` for expensive components
- Optimize images with Next.js Image component
- Use proper caching strategies for API calls

## Development Practices

### Error Handling
- Use try-catch blocks for async operations
- Log errors with proper context
- Provide fallback UI for error states

### Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

### Mobile Responsiveness
- Use the `useMobile` hook for mobile detection
- Implement responsive layouts
- Test on various screen sizes
- Consider touch interactions

## File Naming Conventions

- Use PascalCase for component files: `ComponentName.tsx`
- Use camelCase for utility files: `utilityFunction.ts`
- Use kebab-case for route segments: `api/github/stats/route.ts`
- Use descriptive names that indicate purpose

## Common Patterns

### Custom Hooks
```tsx
export function useCustomHook() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return { state, setState };
}
```

### Context Providers
```tsx
interface ContextValue {
  // Context shape
}

const Context = createContext<ContextValue | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  // Provider logic
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```

## Additional Notes

- This project uses oxlint for linting and Prettier for formatting
- The project structure supports both client and server components
- All paths use the `~` alias pointing to the `src` directory
- CSS variables are used for theming and should be leveraged for consistent styling
