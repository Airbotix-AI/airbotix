/**
 * Route Constants and Types
 * Centralized route definitions with TypeScript types
 */

// ============================================================================
// ROUTE PATHS
// ============================================================================

export const ROUTE_PATHS = {
  // Root routes
  ROOT: '/',
  LOGIN: '/',
  ADMIN: '/admin',
  
  // Dashboard
  DASHBOARD: '/admin',
  
  // Student Management Routes
  STUDENTS: '/admin/students',
  STUDENTS_NEW: '/admin/students/new',
  STUDENTS_DETAILS: '/admin/students/:id',
  STUDENTS_EDIT: '/admin/students/:id/edit',
  STUDENTS_IMPORT: '/admin/students/import',
  STUDENTS_EXPORT: '/admin/students/export',
  
  // Teacher Management Routes
  TEACHERS: '/admin/teachers',
  TEACHERS_NEW: '/admin/teachers/new',
  TEACHERS_DETAILS: '/admin/teachers/:id',
  TEACHERS_EDIT: '/admin/teachers/:id/edit',
  
  // Workshop Management Routes
  WORKSHOPS: '/admin/workshops',
  WORKSHOPS_NEW: '/admin/workshops/new',
  WORKSHOPS_DETAILS: '/admin/workshops/:id',
  WORKSHOPS_EDIT: '/admin/workshops/:id/edit',
  
  // Course Management Routes
  COURSES: '/admin/courses',
  COURSES_NEW: '/admin/courses/new',
  COURSES_DETAILS: '/admin/courses/:id',
  COURSES_EDIT: '/admin/courses/:id/edit',
  
  // Content Management Routes
  CONTENT: '/admin/content',
  CONTENT_NEW: '/admin/content/new',
  CONTENT_DETAILS: '/admin/content/:id',
  CONTENT_EDIT: '/admin/content/:id/edit',
  
  // Error Routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
} as const;

// ============================================================================
// ROUTE TYPES
// ============================================================================

export type RoutePath = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS];

export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}

export interface RouteConfig {
  path: RoutePath;
  component: React.ComponentType;
  permission?: string;
  title?: string;
  description?: string;
  breadcrumb?: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

export interface NavigationItem {
  name: string;
  href: RoutePath;
  icon: React.ComponentType;
  permission?: string;
  badge?: {
    count: number;
    variant: 'default' | 'destructive' | 'secondary' | 'outline';
  };
  children?: NavigationItem[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: ROUTE_PATHS.DASHBOARD,
    icon: () => null, // Will be imported from lucide-react
    permission: 'VIEW_DASHBOARD',
  },
  {
    name: 'Students',
    href: ROUTE_PATHS.STUDENTS,
    icon: () => null, // Will be imported from lucide-react
    permission: 'VIEW_STUDENTS',
    badge: {
      count: 0, // Will be updated dynamically
      variant: 'default',
    },
    children: [
      {
        name: 'All Students',
        href: ROUTE_PATHS.STUDENTS,
        icon: () => null,
        permission: 'VIEW_STUDENTS',
      },
      {
        name: 'Add Student',
        href: ROUTE_PATHS.STUDENTS_NEW,
        icon: () => null,
        permission: 'CREATE_STUDENTS',
      },
      {
        name: 'Import Students',
        href: ROUTE_PATHS.STUDENTS_IMPORT,
        icon: () => null,
        permission: 'CREATE_STUDENTS',
      },
    ],
  },
  {
    name: 'Teachers',
    href: ROUTE_PATHS.TEACHERS,
    icon: () => null, // Will be imported from lucide-react
    permission: 'VIEW_TEACHERS',
  },
  {
    name: 'Workshops',
    href: ROUTE_PATHS.WORKSHOPS,
    icon: () => null, // Will be imported from lucide-react
    permission: 'VIEW_WORKSHOPS',
  },
  {
    name: 'Courses',
    href: ROUTE_PATHS.COURSES,
    icon: () => null, // Will be imported from lucide-react
    permission: 'VIEW_COURSES',
  },
  {
    name: 'Content',
    href: ROUTE_PATHS.CONTENT,
    icon: () => null, // Will be imported from lucide-react
    permission: 'VIEW_CONTENT',
  },
];

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: RoutePath;
  current?: boolean;
}

export const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
  [ROUTE_PATHS.STUDENTS]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Students', current: true },
  ],
  [ROUTE_PATHS.STUDENTS_NEW]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Students', href: ROUTE_PATHS.STUDENTS },
    { label: 'Add Student', current: true },
  ],
  [ROUTE_PATHS.STUDENTS_DETAILS]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Students', href: ROUTE_PATHS.STUDENTS },
    { label: 'Student Details', current: true },
  ],
  [ROUTE_PATHS.STUDENTS_EDIT]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Students', href: ROUTE_PATHS.STUDENTS },
    { label: 'Edit Student', current: true },
  ],
  [ROUTE_PATHS.STUDENTS_IMPORT]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Students', href: ROUTE_PATHS.STUDENTS },
    { label: 'Import Students', current: true },
  ],
  [ROUTE_PATHS.STUDENTS_EXPORT]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Students', href: ROUTE_PATHS.STUDENTS },
    { label: 'Export Students', current: true },
  ],
  [ROUTE_PATHS.TEACHERS]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Teachers', current: true },
  ],
  [ROUTE_PATHS.WORKSHOPS]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Workshops', current: true },
  ],
  [ROUTE_PATHS.COURSES]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Courses', current: true },
  ],
  [ROUTE_PATHS.CONTENT]: [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Content', current: true },
  ],
};

// ============================================================================
// ROUTE UTILITIES
// ============================================================================

/**
 * Generate route path with parameters
 */
export function generateRoutePath(
  path: RoutePath,
  params: RouteParams = {}
): string {
  let generatedPath: string = path;
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      generatedPath = generatedPath.replace(`:${key}`, value);
    }
  });
  
  return generatedPath;
}

/**
 * Check if route matches current path
 */
export function isRouteMatch(route: RoutePath, currentPath: string): boolean {
  if (route === currentPath) return true;
  
  // Handle dynamic routes
  const routeSegments = route.split('/');
  const pathSegments = currentPath.split('/');
  
  if (routeSegments.length !== pathSegments.length) return false;
  
  return routeSegments.every((segment, index) => {
    if (segment.startsWith(':')) return true; // Dynamic segment
    return segment === pathSegments[index];
  });
}

/**
 * Get breadcrumb items for current path
 */
export function getBreadcrumbItems(currentPath: string): BreadcrumbItem[] {
  // Find exact match first
  if (BREADCRUMB_CONFIG[currentPath as RoutePath]) {
    return BREADCRUMB_CONFIG[currentPath as RoutePath];
  }
  
  // Find dynamic route match
  for (const [route, breadcrumbs] of Object.entries(BREADCRUMB_CONFIG)) {
    if (isRouteMatch(route as RoutePath, currentPath)) {
      return breadcrumbs;
    }
  }
  
  // Default breadcrumb
  return [
    { label: 'Dashboard', href: ROUTE_PATHS.DASHBOARD },
    { label: 'Page', current: true },
  ];
}

/**
 * Get page title for route
 */
export function getPageTitle(currentPath: string): string {
  const breadcrumbs = getBreadcrumbItems(currentPath);
  const currentBreadcrumb = breadcrumbs.find(item => item.current);
  return currentBreadcrumb?.label || 'Admin Dashboard';
}

/**
 * Get page meta for route
 */
export function getPageMeta(currentPath: string): {
  title: string;
  description: string;
  keywords: string[];
} {
  const title = getPageTitle(currentPath);
  
  return {
    title: `${title} - Airbotix Super Admin`,
    description: `Manage ${title.toLowerCase()} in the Airbotix Super Admin system`,
    keywords: ['airbotix', 'admin', 'management', title.toLowerCase()],
  };
}
