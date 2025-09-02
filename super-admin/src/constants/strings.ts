// Application strings - Mandatory constant definitions
export const APP_STRINGS = {
  // Application Info
  APP_NAME: 'Airbotix Super Admin',
  APP_DESCRIPTION: 'Super Admin Management System for Airbotix',
  
  // Navigation
  NAV_DASHBOARD: 'Dashboard',
  NAV_STUDENTS: 'Students',
  NAV_TEACHERS: 'Teachers',
  NAV_WORKSHOPS: 'Workshops',
  NAV_COURSES: 'Courses',
  NAV_CONTENT: 'Content Management',
  NAV_LOGOUT: 'Logout',
  
  // Authentication
  AUTH_LOGIN_TITLE: 'Super Admin Login',
  AUTH_LOGIN_SUBTITLE: 'Access your admin dashboard',
  AUTH_EMAIL_PLACEHOLDER: 'Enter your email',
  AUTH_PASSWORD_PLACEHOLDER: 'Enter your password',
  AUTH_LOGIN_BUTTON: 'Sign In',
  AUTH_FORGOT_PASSWORD: 'Forgot Password?',
  AUTH_GOOGLE_LOGIN: 'Sign in with Google',
  AUTH_MAGIC_LINK: 'Send Magic Link',
  AUTH_LOGOUT_CONFIRM: 'Are you sure you want to logout?',
  
  // Dashboard
  DASHBOARD_TITLE: 'Admin Dashboard',
  DASHBOARD_WELCOME: 'Welcome to Airbotix Admin',
  DASHBOARD_STATS_STUDENTS: 'Total Students',
  DASHBOARD_STATS_TEACHERS: 'Total Teachers',
  DASHBOARD_STATS_WORKSHOPS: 'Active Workshops',
  DASHBOARD_STATS_COURSES: 'Total Courses',
  
  // Students Management
  STUDENTS_TITLE: 'Student Management',
  STUDENTS_ADD_NEW: 'Add New Student',
  STUDENTS_SEARCH_PLACEHOLDER: 'Search students...',
  STUDENTS_TABLE_NAME: 'Name',
  STUDENTS_TABLE_EMAIL: 'Email',
  STUDENTS_TABLE_STATUS: 'Status',
  STUDENTS_TABLE_ACTIONS: 'Actions',
  
  // Teachers Management
  TEACHERS_TITLE: 'Teacher Management',
  TEACHERS_ADD_NEW: 'Add New Teacher',
  TEACHERS_SEARCH_PLACEHOLDER: 'Search teachers...',
  TEACHERS_TABLE_NAME: 'Name',
  TEACHERS_TABLE_EMAIL: 'Email',
  TEACHERS_TABLE_SUBJECT: 'Subject',
  TEACHERS_TABLE_STATUS: 'Status',
  TEACHERS_TABLE_ACTIONS: 'Actions',
  
  // Workshops Management
  WORKSHOPS_TITLE: 'Workshop Management',
  WORKSHOPS_ADD_NEW: 'Create New Workshop',
  WORKSHOPS_SEARCH_PLACEHOLDER: 'Search workshops...',
  WORKSHOPS_TABLE_TITLE: 'Title',
  WORKSHOPS_TABLE_DATE: 'Date',
  WORKSHOPS_TABLE_INSTRUCTOR: 'Instructor',
  WORKSHOPS_TABLE_CAPACITY: 'Capacity',
  WORKSHOPS_TABLE_STATUS: 'Status',
  WORKSHOPS_TABLE_ACTIONS: 'Actions',
  
  // Courses Management
  COURSES_TITLE: 'Course Management',
  COURSES_ADD_NEW: 'Create New Course',
  COURSES_SEARCH_PLACEHOLDER: 'Search courses...',
  COURSES_TABLE_TITLE: 'Title',
  COURSES_TABLE_CATEGORY: 'Category',
  COURSES_TABLE_DURATION: 'Duration',
  COURSES_TABLE_PRICE: 'Price',
  COURSES_TABLE_STATUS: 'Status',
  COURSES_TABLE_ACTIONS: 'Actions',
  
  // Content Management
  CONTENT_TITLE: 'Content Management',
  CONTENT_ADD_NEW: 'Add New Content',
  CONTENT_SEARCH_PLACEHOLDER: 'Search content...',
  CONTENT_TABLE_TITLE: 'Title',
  CONTENT_TABLE_TYPE: 'Type',
  CONTENT_TABLE_AUTHOR: 'Author',
  CONTENT_TABLE_DATE: 'Date',
  CONTENT_TABLE_STATUS: 'Status',
  CONTENT_TABLE_ACTIONS: 'Actions',
  
  // Common Actions
  ACTION_EDIT: 'Edit',
  ACTION_DELETE: 'Delete',
  ACTION_VIEW: 'View',
  ACTION_SAVE: 'Save',
  ACTION_CANCEL: 'Cancel',
  ACTION_CONFIRM: 'Confirm',
  ACTION_CLOSE: 'Close',
  
  // Status Labels
  STATUS_ACTIVE: 'Active',
  STATUS_INACTIVE: 'Inactive',
  STATUS_PENDING: 'Pending',
  STATUS_COMPLETED: 'Completed',
  STATUS_CANCELLED: 'Cancelled',
  STATUS_DRAFT: 'Draft',
  STATUS_PUBLISHED: 'Published',
  
  // Messages
  MSG_LOADING: 'Loading...',
  MSG_NO_DATA: 'No data available',
  MSG_ERROR_GENERAL: 'An error occurred. Please try again.',
  MSG_SUCCESS_SAVE: 'Successfully saved!',
  MSG_SUCCESS_DELETE: 'Successfully deleted!',
  MSG_CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  MSG_UNAUTHORIZED: 'You are not authorized to perform this action.',
  
  // Form Labels
  FORM_NAME: 'Name',
  FORM_EMAIL: 'Email',
  FORM_PASSWORD: 'Password',
  FORM_PHONE: 'Phone',
  FORM_ADDRESS: 'Address',
  FORM_TITLE: 'Title',
  FORM_DESCRIPTION: 'Description',
  FORM_DATE: 'Date',
  FORM_TIME: 'Time',
  FORM_PRICE: 'Price',
  FORM_CAPACITY: 'Capacity',
  FORM_CATEGORY: 'Category',
  FORM_STATUS: 'Status',
} as const

// Route paths
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/',
  ADMIN: '/admin',
  DASHBOARD: '/admin',
  STUDENTS: '/admin/students',
  TEACHERS: '/admin/teachers',
  WORKSHOPS: '/admin/workshops',
  COURSES: '/admin/courses',
  CONTENT: '/admin/content',
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  STUDENTS: '/api/students',
  TEACHERS: '/api/teachers',
  WORKSHOPS: '/api/workshops',
  COURSES: '/api/courses',
  CONTENT: '/api/content',
} as const

// Environment variables
export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const
