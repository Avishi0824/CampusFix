import {
  Complaint,
  CreateComplaintInput,
  ComplaintStatus,
  Priority,
  Category,
  TechnicianStaff,
  User,
  AnalyticsSummary,
  TimelineEvent,
  Role,
} from '../types';
import { Storage, StorageKeys } from './storage';

export const DEMO_USERS: Record<Role, User> = {
  student: {
    id: 'usr_std_01',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@campus.edu',
    role: 'student',
    phone: '+91 98765 43210',
    hostelBlock: 'Block B (Kaveri)',
    roomNumber: '304',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  technician: {
    id: 'tech_01',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@facility.campus.edu',
    role: 'technician',
    phone: '+91 98111 22334',
    specialization: 'PLUMBING',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  warden: {
    id: 'usr_warden_01',
    name: 'Dr. Arvind Mehra',
    email: 'warden.hostels@campus.edu',
    role: 'warden',
    phone: '+91 98222 33445',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
};

export const INITIAL_STAFF: TechnicianStaff[] = [
  {
    id: 'tech_01',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@facility.campus.edu',
    phone: '+91 98111 22334',
    specialization: 'PLUMBING',
    specializationLabel: 'Plumbing & Sanitation',
    activeTasksCount: 2,
    completedTasksCount: 48,
    rating: 4.8,
    isAvailable: true,
  },
  {
    id: 'tech_02',
    name: 'Anil Verma',
    email: 'anil.verma@facility.campus.edu',
    phone: '+91 98333 44556',
    specialization: 'ELECTRICAL',
    specializationLabel: 'Electrical Systems',
    activeTasksCount: 3,
    completedTasksCount: 62,
    rating: 4.9,
    isAvailable: true,
  },
  {
    id: 'tech_03',
    name: 'Suresh Nair',
    email: 'suresh.nair@facility.campus.edu',
    phone: '+91 98444 55667',
    specialization: 'FURNITURE',
    specializationLabel: 'Carpentry & Furniture',
    activeTasksCount: 1,
    completedTasksCount: 35,
    rating: 4.7,
    isAvailable: true,
  },
  {
    id: 'tech_04',
    name: 'Vikram Singh',
    email: 'vikram.singh@facility.campus.edu',
    phone: '+91 98555 66778',
    specialization: 'INTERNET_WIFI',
    specializationLabel: 'IT & Network Support',
    activeTasksCount: 1,
    completedTasksCount: 84,
    rating: 4.9,
    isAvailable: true,
  },
  {
    id: 'tech_05',
    name: 'Mukesh Sharma',
    email: 'mukesh.sharma@facility.campus.edu',
    phone: '+91 98666 77889',
    specialization: 'HVAC_AIR',
    specializationLabel: 'AC & Ventilation',
    activeTasksCount: 0,
    completedTasksCount: 29,
    rating: 4.6,
    isAvailable: true,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cf_001',
    ticketNumber: 'CF-1042',
    title: 'Severe Bathroom Pipe Leakage & Water Seepage',
    description:
      'The overhead connector joint in the shared bathroom is spraying water continuously, leading to water accumulation near Room 304.',
    category: 'PLUMBING',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    location: 'Block B (Kaveri), Room 304',
    hostelBlock: 'Block B (Kaveri)',
    roomNumber: '304',
    studentId: 'usr_std_01',
    studentName: 'Aarav Mehta',
    studentContact: '+91 98765 43210',
    assignedTechnicianId: 'tech_01',
    assignedTechnicianName: 'Rajesh Kumar',
    assignedTechnicianSpecialization: 'Plumbing & Sanitation',
    assignedTechnicianPhone: '+91 98111 22334',
    createdAt: '2026-10-06T09:15:00Z',
    updatedAt: '2026-10-06T11:30:00Z',
    isEmergency: true,
    timeline: [
      {
        id: 'tl_01',
        status: 'REPORTED',
        title: 'Issue Reported by Student',
        description: 'Urgent ticket created for plumbing leakage in Block B.',
        timestamp: '2026-10-06T09:15:00Z',
        actorName: 'Aarav Mehta',
        actorRole: 'student',
      },
      {
        id: 'tl_02',
        status: 'ASSIGNED',
        title: 'Technician Assigned',
        description: 'Assigned to Rajesh Kumar (Plumbing Specialist) by Warden.',
        timestamp: '2026-10-06T09:45:00Z',
        actorName: 'Dr. Arvind Mehra',
        actorRole: 'warden',
      },
      {
        id: 'tl_03',
        status: 'IN_PROGRESS',
        title: 'Inspection & Repair Underway',
        description: 'Technician arrived at site with replacement PVC seal ring.',
        timestamp: '2026-10-06T11:30:00Z',
        actorName: 'Rajesh Kumar',
        actorRole: 'technician',
      },
    ],
    comments: [
      {
        id: 'c_01',
        authorId: 'usr_std_01',
        authorName: 'Aarav Mehta',
        authorRole: 'student',
        message: 'Water is starting to spill into the hallway corridor.',
        timestamp: '2026-10-06T09:20:00Z',
      },
      {
        id: 'c_02',
        authorId: 'tech_01',
        authorName: 'Rajesh Kumar',
        authorRole: 'technician',
        message: 'Shut off the main floor valve. Working on the connector replacement now.',
        timestamp: '2026-10-06T11:32:00Z',
      },
    ],
  },
  {
    id: 'cf_002',
    ticketNumber: 'CF-1043',
    title: 'Ceiling Fan Regulator Sparking & Stuck at Max Speed',
    description:
      'The wall mount regulator makes buzzing noises with visible sparking when adjusting speed. Cannot turn off safely without main trip.',
    category: 'ELECTRICAL',
    priority: 'HIGH',
    status: 'ASSIGNED',
    location: 'Block B (Kaveri), Room 218',
    hostelBlock: 'Block B (Kaveri)',
    roomNumber: '218',
    studentId: 'usr_std_02',
    studentName: 'Rohan Sharma',
    studentContact: '+91 98765 11223',
    assignedTechnicianId: 'tech_02',
    assignedTechnicianName: 'Anil Verma',
    assignedTechnicianSpecialization: 'Electrical Systems',
    assignedTechnicianPhone: '+91 98333 44556',
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-06T10:20:00Z',
    isEmergency: true,
    timeline: [
      {
        id: 'tl_04',
        status: 'REPORTED',
        title: 'Complaint Registered',
        description: 'Electrical sparking safety hazard logged.',
        timestamp: '2026-10-06T10:00:00Z',
        actorName: 'Rohan Sharma',
        actorRole: 'student',
      },
      {
        id: 'tl_05',
        status: 'ASSIGNED',
        title: 'Assigned to Electrician',
        description: 'Assigned to Anil Verma with High Priority.',
        timestamp: '2026-10-06T10:20:00Z',
        actorName: 'Dr. Arvind Mehra',
        actorRole: 'warden',
      },
    ],
    comments: [],
  },
  {
    id: 'cf_003',
    ticketNumber: 'CF-1039',
    title: 'Study Desk Wooden Drawer Rail Detached',
    description:
      'Right bottom drawer track broke loose and slides off completely. Needs realignment and longer screws.',
    category: 'FURNITURE',
    priority: 'LOW',
    status: 'REPORTED',
    location: 'Block B (Kaveri), Room 304',
    hostelBlock: 'Block B (Kaveri)',
    roomNumber: '304',
    studentId: 'usr_std_01',
    studentName: 'Aarav Mehta',
    studentContact: '+91 98765 43210',
    createdAt: '2026-10-05T16:40:00Z',
    updatedAt: '2026-10-05T16:40:00Z',
    timeline: [
      {
        id: 'tl_06',
        status: 'REPORTED',
        title: 'Issue Submitted',
        description: 'Awaiting review and technician allocation.',
        timestamp: '2026-10-05T16:40:00Z',
        actorName: 'Aarav Mehta',
        actorRole: 'student',
      },
    ],
    comments: [],
  },
  {
    id: 'cf_004',
    ticketNumber: 'CF-1038',
    title: 'Wi-Fi Access Point 3rd Floor Intermittent Packet Drop',
    description:
      'SSID CampusNet-5G shows connected without internet every 10 minutes on 3rd floor East wing.',
    category: 'INTERNET_WIFI',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    location: 'Block B (Kaveri), 3rd Floor East Corridor',
    hostelBlock: 'Block B (Kaveri)',
    roomNumber: 'Corridor AP-3E',
    studentId: 'usr_std_03',
    studentName: 'Priya Patel',
    studentContact: '+91 98765 99887',
    assignedTechnicianId: 'tech_04',
    assignedTechnicianName: 'Vikram Singh',
    assignedTechnicianSpecialization: 'IT & Network Support',
    assignedTechnicianPhone: '+91 98555 66778',
    createdAt: '2026-10-05T14:10:00Z',
    updatedAt: '2026-10-06T08:30:00Z',
    timeline: [
      {
        id: 'tl_07',
        status: 'REPORTED',
        title: 'Reported',
        description: 'Network connectivity grievance logged.',
        timestamp: '2026-10-05T14:10:00Z',
        actorName: 'Priya Patel',
        actorRole: 'student',
      },
      {
        id: 'tl_08',
        status: 'ASSIGNED',
        title: 'Assigned to IT Team',
        description: 'Assigned to Vikram Singh.',
        timestamp: '2026-10-05T15:00:00Z',
        actorName: 'Dr. Arvind Mehra',
        actorRole: 'warden',
      },
      {
        id: 'tl_09',
        status: 'IN_PROGRESS',
        title: 'Router Diagnostics',
        description: 'Firmware reset and power cycle performed; testing channel interference.',
        timestamp: '2026-10-06T08:30:00Z',
        actorName: 'Vikram Singh',
        actorRole: 'technician',
      },
    ],
    comments: [],
  },
  {
    id: 'cf_005',
    ticketNumber: 'CF-1035',
    title: 'Corridor Window Latch Broken & Glass Rattle',
    description:
      'High wind caused window latch to snap off. Heavy rattle during rains.',
    category: 'FURNITURE',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    location: 'Block A (Ganga), 2nd Floor',
    hostelBlock: 'Block A (Ganga)',
    roomNumber: '201',
    studentId: 'usr_std_04',
    studentName: 'Devansh Verma',
    studentContact: '+91 98123 45678',
    assignedTechnicianId: 'tech_03',
    assignedTechnicianName: 'Suresh Nair',
    assignedTechnicianSpecialization: 'Carpentry & Furniture',
    assignedTechnicianPhone: '+91 98444 55667',
    createdAt: '2026-10-04T11:00:00Z',
    updatedAt: '2026-10-05T17:00:00Z',
    resolvedAt: '2026-10-05T17:00:00Z',
    resolutionNotes: 'Installed new heavy-duty brass latch and weather strip sealant.',
    timeline: [
      {
        id: 'tl_10',
        status: 'REPORTED',
        title: 'Reported',
        description: 'Logged by student.',
        timestamp: '2026-10-04T11:00:00Z',
        actorName: 'Devansh Verma',
        actorRole: 'student',
      },
      {
        id: 'tl_11',
        status: 'ASSIGNED',
        title: 'Assigned',
        description: 'Assigned to Suresh Nair.',
        timestamp: '2026-10-04T12:00:00Z',
        actorName: 'Dr. Arvind Mehra',
        actorRole: 'warden',
      },
      {
        id: 'tl_12',
        status: 'IN_PROGRESS',
        title: 'Work In Progress',
        description: 'Procured replacement latch from campus warehouse.',
        timestamp: '2026-10-05T14:30:00Z',
        actorName: 'Suresh Nair',
        actorRole: 'technician',
      },
      {
        id: 'tl_13',
        status: 'RESOLVED',
        title: 'Work Completed & Verified',
        description: 'Window securely fastened and tested.',
        timestamp: '2026-10-05T17:00:00Z',
        actorName: 'Suresh Nair',
        actorRole: 'technician',
      },
    ],
    comments: [],
  },
];

export const MockApiService = {
  async init(): Promise<void> {
    const isInit = await Storage.getItem<boolean>(StorageKeys.INITIALIZED, false);
    if (!isInit) {
      await Storage.setItem(StorageKeys.COMPLAINTS_DATA, INITIAL_COMPLAINTS);
      await Storage.setItem(StorageKeys.STAFF_DATA, INITIAL_STAFF);
      await Storage.setItem(StorageKeys.INITIALIZED, true);
    }
  },

  async resetToDemoData(): Promise<void> {
    await Storage.setItem(StorageKeys.COMPLAINTS_DATA, INITIAL_COMPLAINTS);
    await Storage.setItem(StorageKeys.STAFF_DATA, INITIAL_STAFF);
  },

  async getComplaints(): Promise<Complaint[]> {
    await this.init();
    return Storage.getItem<Complaint[]>(StorageKeys.COMPLAINTS_DATA, INITIAL_COMPLAINTS);
  },

  async getComplaintById(id: string): Promise<Complaint | null> {
    const complaints = await this.getComplaints();
    return complaints.find((c) => c.id === id || c.ticketNumber === id) || null;
  },

  async createComplaint(input: CreateComplaintInput, student: User): Promise<Complaint> {
    const complaints = await this.getComplaints();
    const nextNum = 1044 + complaints.length;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: `cf_${Date.now()}`,
      ticketNumber: `CF-${nextNum}`,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      priority: input.priority,
      status: 'REPORTED',
      location: `${input.hostelBlock}, Room ${input.roomNumber}`,
      hostelBlock: input.hostelBlock,
      roomNumber: input.roomNumber,
      studentId: student.id,
      studentName: student.name,
      studentContact: student.phone || '+91 98765 43210',
      createdAt: now,
      updatedAt: now,
      images: input.images || [],
      isEmergency: input.isEmergency || false,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          status: 'REPORTED',
          title: 'Complaint Registered',
          description: `Ticket created for ${input.category.toLowerCase().replace('_', ' ')} issue in ${input.hostelBlock}.`,
          timestamp: now,
          actorName: student.name,
          actorRole: 'student',
        },
      ],
      comments: [],
    };

    const updated = [newComplaint, ...complaints];
    await Storage.setItem(StorageKeys.COMPLAINTS_DATA, updated);
    return newComplaint;
  },

  async updateComplaintStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    actor: User,
    notes?: string,
    image?: string
  ): Promise<Complaint | null> {
    const complaints = await this.getComplaints();
    const index = complaints.findIndex((c) => c.id === complaintId);
    if (index === -1) return null;

    const current = complaints[index];
    const now = new Date().toISOString();

    let eventTitle = 'Status Updated';
    let eventDesc = `Status changed to ${newStatus}`;

    if (newStatus === 'IN_PROGRESS') {
      eventTitle = 'Work Started';
      eventDesc = notes || 'Technician has commenced work on site.';
    } else if (newStatus === 'RESOLVED') {
      eventTitle = 'Work Resolved';
      eventDesc = notes || 'Issue verified and marked resolved.';
    }

    const newEvent: TimelineEvent = {
      id: `tl_${Date.now()}`,
      status: newStatus,
      title: eventTitle,
      description: eventDesc,
      timestamp: now,
      actorName: actor.name,
      actorRole: actor.role,
    };

    const updatedComplaint: Complaint = {
      ...current,
      status: newStatus,
      updatedAt: now,
      resolvedAt: newStatus === 'RESOLVED' ? now : current.resolvedAt,
      resolutionNotes: notes ? notes : current.resolutionNotes,
      resolutionImage: image ? image : current.resolutionImage,
      timeline: [...current.timeline, newEvent],
    };

    complaints[index] = updatedComplaint;
    await Storage.setItem(StorageKeys.COMPLAINTS_DATA, complaints);
    return updatedComplaint;
  },

  async assignTechnician(
    complaintId: string,
    technicianId: string,
    actor: User,
    priorityOverride?: Priority
  ): Promise<Complaint | null> {
    const complaints = await this.getComplaints();
    const staff = await this.getStaff();
    const index = complaints.findIndex((c) => c.id === complaintId);
    if (index === -1) return null;

    const tech = staff.find((t) => t.id === technicianId);
    if (!tech) return null;

    const current = complaints[index];
    const now = new Date().toISOString();

    const newEvent: TimelineEvent = {
      id: `tl_${Date.now()}`,
      status: 'ASSIGNED',
      title: 'Technician Assigned',
      description: `Assigned to ${tech.name} (${tech.specializationLabel}).`,
      timestamp: now,
      actorName: actor.name,
      actorRole: actor.role,
    };

    const updatedComplaint: Complaint = {
      ...current,
      status: 'ASSIGNED',
      assignedTechnicianId: tech.id,
      assignedTechnicianName: tech.name,
      assignedTechnicianSpecialization: tech.specializationLabel,
      assignedTechnicianPhone: tech.phone,
      priority: priorityOverride || current.priority,
      updatedAt: now,
      timeline: [...current.timeline, newEvent],
    };

    complaints[index] = updatedComplaint;
    await Storage.setItem(StorageKeys.COMPLAINTS_DATA, complaints);
    return updatedComplaint;
  },

  async addComplaintComment(
    complaintId: string,
    author: User,
    message: string
  ): Promise<Complaint | null> {
    const complaints = await this.getComplaints();
    const index = complaints.findIndex((c) => c.id === complaintId);
    if (index === -1) return null;

    const current = complaints[index];
    const now = new Date().toISOString();

    const newComment = {
      id: `c_${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      message: message.trim(),
      timestamp: now,
    };

    const updatedComplaint: Complaint = {
      ...current,
      comments: [...current.comments, newComment],
      updatedAt: now,
    };

    complaints[index] = updatedComplaint;
    await Storage.setItem(StorageKeys.COMPLAINTS_DATA, complaints);
    return updatedComplaint;
  },

  async getStaff(): Promise<TechnicianStaff[]> {
    await this.init();
    return Storage.getItem<TechnicianStaff[]>(StorageKeys.STAFF_DATA, INITIAL_STAFF);
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    const complaints = await this.getComplaints();

    const statusCounts: Record<ComplaintStatus, number> = {
      REPORTED: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
    };

    const categoryMap: Record<Category, number> = {
      PLUMBING: 0,
      ELECTRICAL: 0,
      FURNITURE: 0,
      INTERNET_WIFI: 0,
      CLEANING: 0,
      HVAC_AIR: 0,
      SECURITY: 0,
      OTHER: 0,
    };

    const hostelMap: Record<string, number> = {};
    let highPriorityCount = 0;
    let unassignedCount = 0;

    complaints.forEach((c) => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
      hostelMap[c.hostelBlock] = (hostelMap[c.hostelBlock] || 0) + 1;

      if (c.priority === 'HIGH' && c.status !== 'RESOLVED') {
        highPriorityCount++;
      }
      if (!c.assignedTechnicianId && c.status === 'REPORTED') {
        unassignedCount++;
      }
    });

    const categoryLabels: Record<Category, string> = {
      PLUMBING: 'Plumbing',
      ELECTRICAL: 'Electrical',
      FURNITURE: 'Furniture & Fixtures',
      INTERNET_WIFI: 'Wi-Fi / Network',
      CLEANING: 'Housekeeping',
      HVAC_AIR: 'Air / HVAC',
      SECURITY: 'Locks & Security',
      OTHER: 'General Maintenance',
    };

    const total = complaints.length || 1;
    const categoryBreakdown = (Object.keys(categoryMap) as Category[]).map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      count: categoryMap[cat],
      percentage: Math.round((categoryMap[cat] / total) * 100),
    }));

    const hostelBreakdown = Object.entries(hostelMap).map(([block, count]) => ({
      block,
      count,
    }));

    return {
      totalComplaints: complaints.length,
      openComplaints: statusCounts.REPORTED + statusCounts.ASSIGNED,
      inProgressComplaints: statusCounts.IN_PROGRESS,
      resolvedComplaints: statusCounts.RESOLVED,
      highPriorityCount,
      unassignedCount,
      avgResolutionHours: 3.4,
      categoryBreakdown,
      statusBreakdown: statusCounts,
      hostelBreakdown,
    };
  },
};
