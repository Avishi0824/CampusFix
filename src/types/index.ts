export type Role = 'student' | 'technician' | 'warden';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  roomNumber?: string;
  hostelBlock?: string;
  specialization?: string;
  avatarUrl?: string;
}

export type ComplaintStatus = 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Category =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'FURNITURE'
  | 'INTERNET_WIFI'
  | 'CLEANING'
  | 'HVAC_AIR'
  | 'SECURITY'
  | 'OTHER';

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
}

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  message: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string; // e.g. "CF-1042"
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: ComplaintStatus;
  location: string; // e.g. "Hostel Block B, Room 304"
  hostelBlock: string;
  roomNumber: string;
  studentId: string;
  studentName: string;
  studentContact: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianSpecialization?: string;
  assignedTechnicianPhone?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  images?: string[];
  resolutionNotes?: string;
  resolutionImage?: string;
  timeline: TimelineEvent[];
  comments: ComplaintComment[];
  isEmergency?: boolean;
}

export interface TechnicianStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: Category;
  specializationLabel: string;
  activeTasksCount: number;
  completedTasksCount: number;
  rating: number;
  isAvailable: boolean;
}

export interface AnalyticsSummary {
  totalComplaints: number;
  openComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  highPriorityCount: number;
  unassignedCount: number;
  avgResolutionHours: number;
  categoryBreakdown: { category: Category; label: string; count: number; percentage: number }[];
  statusBreakdown: Record<ComplaintStatus, number>;
  hostelBreakdown: { block: string; count: number }[];
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  hostelBlock: string;
  roomNumber: string;
  isEmergency?: boolean;
  images?: string[];
}
