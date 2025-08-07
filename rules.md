# Development Rules & Guidelines

Welcome to the Airbotix website development team! This document outlines our code style rules, git practices, and collaboration etiquette to ensure consistent, high-quality development.

## 📋 Table of Contents

- [Code Style Rules](#-code-style-rules)
- [Git Practices](#-git-practices)
- [Team Collaboration](#-team-collaboration)
- [Project Structure](#-project-structure)
- [Testing Guidelines](#-testing-guidelines)
- [Performance Standards](#-performance-standards)

## 🎨 Code Style Rules

### TypeScript & React

#### General Principles
- **Consistency is key** - Follow established patterns in the codebase
- **Readability first** - Code should be self-documenting
- **Type safety** - Leverage TypeScript's type system fully
- **Component composition** - Prefer composition over inheritance

#### Naming Conventions

```typescript
// ✅ Good
const UserProfile = () => { ... }           // PascalCase for components
const useUserData = () => { ... }           // camelCase for hooks
const API_BASE_URL = 'https://...'          // SCREAMING_SNAKE_CASE for constants
const isUserLoggedIn = true                 // camelCase for variables
const handleButtonClick = () => { ... }     // camelCase for functions

// ❌ Bad
const userprofile = () => { ... }
const Use_User_Data = () => { ... }
const apibaseurl = 'https://...'
```

#### File & Folder Structure

```
src/
├── components/
│   ├── ui/                 # Generic UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── features/           # Feature-specific components
├── pages/                  # Page components
├── hooks/                  # Custom hooks
├── utils/                  # Utility functions
├── types/                  # TypeScript type definitions
└── assets/                 # Static assets
```

#### Component Guidelines

```typescript
// ✅ Good - Well-structured component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}

const Button = ({ 
  variant, 
  size = 'md', 
  disabled = false, 
  onClick, 
  children 
}: ButtonProps) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200'
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
```

#### Hooks Guidelines

```typescript
// ✅ Good - Custom hook with proper TypeScript
interface UseApiDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const useApiData = <T>(url: string): UseApiDataReturn<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
```

### CSS & Styling

#### TailwindCSS Best Practices

```tsx
// ✅ Good - Organized classes, responsive design
<div className="
  flex flex-col gap-4 p-6
  bg-white rounded-lg shadow-sm
  md:flex-row md:gap-6 md:p-8
  hover:shadow-md transition-shadow duration-200
">
  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
    Title
  </h2>
</div>

// ❌ Bad - Long unorganized class string
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm md:flex-row md:gap-6 md:p-8 hover:shadow-md transition-shadow duration-200">
```

#### Custom CSS Components

```css
/* ✅ Good - Use @layer for organization */
@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
}
```

## 🔄 Git Practices

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# ✅ Good commit messages
feat: add workshop booking form component
fix: resolve mobile navigation menu overflow
docs: update deployment instructions in README
style: improve button hover animations
refactor: extract common form validation logic
test: add unit tests for user authentication
chore: update dependencies to latest versions

# ❌ Bad commit messages
fixed stuff
update
wip
changes
```

### Branch Naming

```bash
# ✅ Good branch names
feature/workshop-booking-form
fix/mobile-navigation-overflow
docs/update-deployment-guide
refactor/form-validation-logic
hotfix/critical-security-patch

# ❌ Bad branch names
fix
new-feature
john-changes
temp
```

### Pull Request Guidelines

#### PR Title Format
```
[TYPE] Brief description of changes

Examples:
[FEAT] Add workshop booking functionality
[FIX] Resolve mobile navigation issues
[DOCS] Update README with new deployment steps
```

#### PR Description Template
```markdown
## 🎯 What does this PR do?
Brief description of the changes and why they're needed.

## 🧪 How to test?
1. Step-by-step instructions
2. Expected behavior
3. Edge cases to consider

## 📸 Screenshots (if applicable)
Before/after screenshots for UI changes

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested
```

### Branching Strategy

```
main (production-ready code)
├── develop (integration branch)
│   ├── feature/workshop-booking
│   ├── feature/media-gallery
│   └── fix/mobile-navigation
└── hotfix/critical-security-fix (emergency fixes)
```

## 🤝 Team Collaboration

### Code Review Guidelines

#### For Authors
- **Self-review first** - Review your own code before requesting review
- **Small, focused PRs** - Easier to review, faster to merge
- **Clear descriptions** - Explain what, why, and how
- **Test thoroughly** - Include manual testing steps
- **Address feedback promptly** - Respond to comments within 24 hours

#### For Reviewers
- **Be constructive** - Suggest improvements, don't just point out problems
- **Ask questions** - "Why did you choose this approach?"
- **Praise good code** - Acknowledge well-written code
- **Focus on impact** - Prioritize feedback by importance
- **Review promptly** - Aim to review within 24 hours

#### Review Checklist
```markdown
## Code Quality
- [ ] Code is readable and well-commented
- [ ] No unused imports or variables
- [ ] Error handling is appropriate
- [ ] TypeScript types are properly defined

## Functionality
- [ ] Code works as intended
- [ ] Edge cases are handled
- [ ] No breaking changes to existing features
- [ ] Performance implications considered

## Design & UX
- [ ] UI matches design specifications
- [ ] Responsive across all breakpoints
- [ ] Accessibility considerations met
- [ ] Loading states and error handling
```

### Communication

#### Daily Standups
- **What did you do yesterday?**
- **What will you do today?**
- **Any blockers or impediments?**
- **Any help needed from team members?**

#### Slack/Communication Guidelines
- **Use threads** for detailed discussions
- **@channel sparingly** - only for urgent, all-team announcements
- **Code snippets** - use code blocks for better readability
- **Status updates** - keep team informed of progress and blockers

## 🏗️ Project Structure

### Component Organization

```typescript
// ✅ Good - Single responsibility, clear interface
interface WorkshopCardProps {
  workshop: Workshop
  onBookClick: (workshopId: string) => void
}

const WorkshopCard = ({ workshop, onBookClick }: WorkshopCardProps) => {
  return (
    <div className="card">
      <h3>{workshop.title}</h3>
      <p>{workshop.description}</p>
      <Button 
        variant="primary" 
        onClick={() => onBookClick(workshop.id)}
      >
        Book Now
      </Button>
    </div>
  )
}
```

### State Management

```typescript
// ✅ Good - Use appropriate state management
// Local state for component-specific data
const [isMenuOpen, setIsMenuOpen] = useState(false)

// Context for app-wide state
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
})

// External state management for complex app state
// Consider Zustand or Redux Toolkit for larger applications
```

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// ✅ Good - Test component behavior
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Integration Testing
- Test user workflows end-to-end
- Test API integrations with mock data
- Test responsive behavior across devices

## ⚡ Performance Standards

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques
```typescript
// ✅ Good - Code splitting and lazy loading
const WorkshopPage = lazy(() => import('./pages/WorkshopPage'))
const MediaGallery = lazy(() => import('./components/MediaGallery'))

// ✅ Good - Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// ✅ Good - Optimized images
<img 
  src="workshop-hero.jpg"
  alt="Students working with robots"
  loading="lazy"
  width={800}
  height={600}
/>
```

### Bundle Size Guidelines
- **Individual chunks**: < 244KB gzipped
- **Total bundle size**: < 1MB gzipped
- **Use bundle analyzer** to monitor size growth

## 🚨 Common Pitfalls to Avoid

### React Anti-patterns
```typescript
// ❌ Bad - Mutating state directly
const [items, setItems] = useState([])
items.push(newItem) // DON'T DO THIS

// ✅ Good - Immutable state updates
setItems(prev => [...prev, newItem])

// ❌ Bad - Missing dependency in useEffect
useEffect(() => {
  fetchData(userId)
}, []) // Missing userId dependency

// ✅ Good - Complete dependency array
useEffect(() => {
  fetchData(userId)
}, [userId])
```

### TypeScript Anti-patterns
```typescript
// ❌ Bad - Using 'any' type
const handleData = (data: any) => { ... }

// ✅ Good - Proper typing
interface ApiResponse {
  id: string
  name: string
  email: string
}
const handleData = (data: ApiResponse) => { ... }
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Tools
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)

---

## 🎯 Remember

> "Code is written once but read many times. Write for the next developer (which might be you in 6 months)."

**Questions?** Don't hesitate to ask in our team channel or during standup meetings. We're all here to help each other grow! 🚀

---

*Last updated: [Date]*  
*Next review: [Date + 3 months]*