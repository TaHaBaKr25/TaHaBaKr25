import { AttendanceRecord, MonthlyReport } from '@/types';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const calculateWorkHours = (checkIn: string, checkOut: string): number => {
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();
  const diffMs = checkOutTime - checkInTime;
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};

export const isLateCheckIn = (checkInTime: string): boolean => {
  const checkIn = new Date(checkInTime);
  const hours = checkIn.getHours();
  const minutes = checkIn.getMinutes();
  
  // Consider late if after 8:30 AM
  return hours > 8 || (hours === 8 && minutes > 30);
};

export const getAttendanceStatus = (record: AttendanceRecord): 'present' | 'absent' | 'late' | 'incomplete' => {
  if (!record.checkIn) return 'absent';
  if (!record.checkOut) return 'incomplete';
  if (isLateCheckIn(record.checkIn)) return 'late';
  return 'present';
};

export const generateMonthlyReport = (
  records: AttendanceRecord[],
  employeeId: string,
  employeeName: string,
  month: string
): MonthlyReport => {
  const monthRecords = records.filter(r => 
    r.employeeId === employeeId && r.date.startsWith(month)
  );
  
  const presentDays = monthRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const lateDays = monthRecords.filter(r => r.status === 'late').length;
  const totalHours = monthRecords.reduce((sum, r) => sum + (r.workHours || 0), 0);
  
  return {
    employeeId,
    employeeName,
    month,
    totalDays: monthRecords.length,
    presentDays,
    absentDays: monthRecords.filter(r => r.status === 'absent').length,
    lateDays,
    totalHours: Math.round(totalHours * 100) / 100,
    averageHours: presentDays > 0 ? Math.round((totalHours / presentDays) * 100) / 100 : 0
  };
};

export const getCurrentMonthYear = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthName = (monthYear: string): string => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
};
