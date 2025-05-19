// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT',
} as const;

// Module Types
export const MODULE_TYPES = {
  VIDEO: 'VIDEO',
  TEXT: 'TEXT',
  PDF: 'PDF',
  QUIZ: 'QUIZ',
  ASSIGNMENT: 'ASSIGNMENT',
} as const;

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  SHORT_ANSWER: 'SHORT_ANSWER',
  ESSAY: 'ESSAY',
  FILE_UPLOAD: 'FILE_UPLOAD',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    COURSES: '/admin/courses',
    FORUMS: '/admin/forums',
    CERTIFICATES: '/admin/certificates',
    SETTINGS: '/admin/settings',
  },
  
  // Instructor routes
  INSTRUCTOR: {
    DASHBOARD: '/instructor/dashboard', // Updated to match the correct route
    COURSES: '/instructor/dashboard/courses',
    ASSIGNMENTS: '/instructor/assignments',
    STUDENTS: '/instructor/students',
    FORUMS: '/instructor/forums',
  },
  
  // Student routes
  STUDENT: {
    DASHBOARD: '/student',
    COURSES: '/student/courses',
    ASSIGNMENTS: '/student/assignments',
    CERTIFICATES: '/student/certificates',
    FORUMS: '/student/forums',
  },
  
  // Shared routes
  COURSES: {
    INDEX: '/courses',
    DETAIL: (id: string) => `/courses/${id}`,
    MODULE: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}`,
  },
  
  FORUMS: {
    INDEX: '/forums',
    COURSE: (id: string) => `/forums/course/${id}`,
    THREAD: (id: string) => `/forums/thread/${id}`,
  },
};

// File upload limits (in bytes)
export const UPLOAD_LIMITS = {
  PROFILE_PICTURE: 2 * 1024 * 1024, // 2MB
  ASSIGNMENT: 10 * 1024 * 1024, // 10MB
  COURSE_MATERIAL: 50 * 1024 * 1024, // 50MB
  COURSE_THUMBNAIL: 5 * 1024 * 1024, // 5MB
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};