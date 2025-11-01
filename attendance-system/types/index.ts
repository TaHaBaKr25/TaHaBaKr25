export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  employeeNumber: string;
  phone: string;
  email: string;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  status: 'present' | 'absent' | 'late' | 'incomplete';
  notes?: string;
}

export interface MonthlyReport {
  employeeId: string;
  employeeName: string;
  month: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  averageHours: number;
}
