import { Role, ModuleType, QuestionType } from '@prisma/client';

// Auth types
export type UserSession = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: Role;
};

// API Response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Dashboard types
export type DashboardStats = {
  totalUsers?: number;
  totalCourses?: number;
  totalEnrollments?: number;
  recentUsers?: any[];
  recentCourses?: any[];
  recentEnrollments?: any[];
};

export type InstructorStats = {
  totalCourses: number;
  totalStudents: number;
  totalAssignmentsPending: number;
  courseCompletionRate: number;
  recentSubmissions: any[];
};

export type StudentStats = {
  enrolledCourses: number;
  completedCourses: number;
  pendingAssignments: number;
  overallProgress: number;
  certificates: any[];
};

// Course Builder types
export type CourseFormData = {
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  published?: boolean;
};

export type ModuleFormData = {
  title: string;
  type: ModuleType;
  content: any;
  order: number;
};

export type VideoModuleContent = {
  videoUrl: string;
  duration: number;
  transcript?: string;
};

export type TextModuleContent = {
  text: string;
};

export type PDFModuleContent = {
  pdfUrl: string;
  pageCount: number;
};

export type AssignmentModuleContent = {
  assignmentId: string;
  dueDate?: Date;
  instructions: string;
};

export type QuizModuleContent = {
  quizId: string;
  timeLimit?: number;
  passingScore?: number;
};

// Quiz types
export type QuizFormData = {
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  questions: QuizQuestionFormData[];
};

export type QuizQuestionFormData = {
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  points: number;
  order: number;
};

export type QuizSubmission = {
  quizId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
};

// Assignment types
export type AssignmentFormData = {
  title: string;
  description: string;
  dueDate?: Date;
};

export type SubmissionFormData = {
  assignmentId: string;
  file?: File;
  content?: string;
};

export type GradingFormData = {
  submissionId: string;
  grade: number;
  feedback: string;
};

// Forum types
export type ForumThreadFormData = {
  title: string;
  content: string;
  courseId: string;
  pinned?: boolean;
};

export type ForumReplyFormData = {
  content: string;
  threadId: string;
};

// Certificate types
export type CertificateTemplateFormData = {
  name: string;
  template: any; // JSON template structure
};