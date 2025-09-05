# Sidebar Navigation Component

A modern, responsive sidebar navigation component for the Super Admin Management System following the exact PRD specification.

## Features

### Design Requirements ✅
- **Fixed width sidebar (280px)** with smooth hover effects
- **User profile section** at bottom with avatar, name, and role indicator
- **Collapsible/expandable** sidebar functionality (280px ↔ 80px)
- **Active state highlighting** for current page
- **Modern styling** with clean, professional appearance

### Navigation Structure ✅
1. **Dashboard** - with LayoutDashboard icon
2. **Students** - with Users icon  
3. **Teachers** - with GraduationCap icon
4. **Workshops** - with Calendar icon
5. **Courses** - with BookOpen icon
6. **Content Management** - with FileText icon

### User Profile Section ✅
- Current user avatar with gradient background
- User name display
- Role badge with color coding:
  - **Super Admin**: Red badge
  - **Admin**: Blue badge
  - **Teacher**: Green badge
- Settings gear icon for user preferences
- Logout button with hover effects

### Technical Requirements ✅
- **React + TypeScript** implementation
- **TailwindCSS** for styling with shadcn/ui components
- **React Router** for navigation
- **Constants** for all string literals (AI coding rules compliance)
- **File size**: Under 1000 lines
- **Exported interfaces and types**

## File Structure

```
src/
├── constants/
│   └── navigation.ts          # Navigation routes, labels, and configuration
├── components/
│   └── layout/
│       ├── Sidebar.tsx        # Main sidebar component
│       ├── AdminLayout.tsx    # Updated layout using new sidebar
│       └── README.md          # This documentation
```

## Usage

### Basic Implementation

```tsx
import Sidebar from '@/components/layout/Sidebar'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {/* Your content */}
      </main>
    </div>
  )
}
```

### With AdminLayout

```tsx
import AdminLayout from '@/components/layout/AdminLayout'

function App() {
  return (
    <AdminLayout>
      {/* Your page content */}
    </AdminLayout>
  )
}
```

## Configuration

### Navigation Items

Navigation items are configured in `/constants/navigation.ts`:

```typescript
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: NAVIGATION_LABELS.DASHBOARD,
    href: NAVIGATION_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER]
  },
  // ... more items
]
```

### Sidebar Configuration

```typescript
export const SIDEBAR_CONFIG = {
  WIDTH: 280,           // Expanded width
  COLLAPSED_WIDTH: 80,  // Collapsed width
  TRANSITION_DURATION: 300  // Animation duration in ms
} as const
```

## Role-Based Access Control

The sidebar automatically filters navigation items based on the user's role:

- **Super Admin**: Access to all navigation items
- **Admin**: Access to all items except some restricted features
- **Teacher**: Limited access to student and workshop management

## Responsive Design

- **Desktop**: Fixed sidebar with collapsible functionality
- **Mobile**: Overlay sidebar with backdrop
- **Smooth transitions** for all state changes

## Styling

### Color Scheme
- **Primary**: Blue gradient for active states
- **Background**: Clean white with subtle shadows
- **Text**: Gray scale with proper contrast
- **Hover**: Light gray backgrounds with smooth transitions

### Role Badge Colors
- **Super Admin**: `bg-red-100 text-red-800 border-red-200`
- **Admin**: `bg-blue-100 text-blue-800 border-blue-200`
- **Teacher**: `bg-green-100 text-green-800 border-green-200`

## Props

### SidebarProps

```typescript
interface SidebarProps {
  className?: string  // Additional CSS classes
}
```

## Dependencies

- `react` - Core React functionality
- `react-router-dom` - Navigation
- `lucide-react` - Icons
- `@/contexts/AuthContext` - User authentication
- `@/constants/navigation` - Navigation configuration
- `@/constants/userRoles` - User role definitions
- `@/utils` - Utility functions (cn helper)

## Accessibility

- **Keyboard navigation** support
- **ARIA labels** for screen readers
- **Focus management** for collapsible states
- **High contrast** color schemes
- **Semantic HTML** structure

## Performance

- **Optimized re-renders** with proper React patterns
- **Efficient state management** for sidebar collapse
- **Minimal bundle size** with tree-shaking support
- **Smooth animations** with CSS transitions

## Browser Support

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** (iOS Safari, Chrome Mobile)
- **Responsive design** for all screen sizes

## Future Enhancements

- [ ] Search functionality in navigation
- [ ] Customizable navigation items
- [ ] Theme switching support
- [ ] Breadcrumb integration
- [ ] Notification badges on menu items
