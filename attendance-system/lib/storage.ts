import { Employee, AttendanceRecord } from '@/types';

const EMPLOYEES_KEY = 'ihsan_employees';
const ATTENDANCE_KEY = 'ihsan_attendance';

// Employee Storage Functions
export const getEmployees = (): Employee[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(EMPLOYEES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEmployee = (employee: Employee): void => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === employee.id);
  
  if (index >= 0) {
    employees[index] = employee;
  } else {
    employees.push(employee);
  }
  
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const deleteEmployee = (id: string): void => {
  const employees = getEmployees().filter(e => e.id !== id);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return getEmployees().find(e => e.id === id);
};

// Attendance Storage Functions
export const getAttendanceRecords = (): AttendanceRecord[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  const index = records.findIndex(r => r.id === record.id);
  
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
};

export const getAttendanceByDate = (date: string): AttendanceRecord[] => {
  return getAttendanceRecords().filter(r => r.date === date);
};

export const getAttendanceByEmployee = (employeeId: string): AttendanceRecord[] => {
  return getAttendanceRecords().filter(r => r.employeeId === employeeId);
};

export const getTodayAttendance = (employeeId: string): AttendanceRecord | undefined => {
  const today = new Date().toISOString().split('T')[0];
  return getAttendanceRecords().find(
    r => r.employeeId === employeeId && r.date === today
  );
};

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  if (getEmployees().length === 0) {
    const sampleEmployees: Employee[] = [
      {
        id: '1',
        name: 'أحمد محمد العلي',
        position: 'مدير الجمعية',
        department: 'الإدارة',
        employeeNumber: 'EMP001',
        phone: '0501234567',
        email: 'ahmed@ihsan.org',
        joinDate: '2020-01-15'
      },
      {
        id: '2',
        name: 'فاطمة عبدالله السالم',
        position: 'منسقة البرامج',
        department: 'البرامج والأنشطة',
        employeeNumber: 'EMP002',
        phone: '0507654321',
        email: 'fatima@ihsan.org',
        joinDate: '2021-03-20'
      },
      {
        id: '3',
        name: 'خالد سعد المطيري',
        position: 'محاسب',
        department: 'المالية',
        employeeNumber: 'EMP003',
        phone: '0509876543',
        email: 'khaled@ihsan.org',
        joinDate: '2021-06-10'
      },
      {
        id: '4',
        name: 'نورة حسن الشمري',
        position: 'أخصائية اجتماعية',
        department: 'الخدمات الاجتماعية',
        employeeNumber: 'EMP004',
        phone: '0503456789',
        email: 'noura@ihsan.org',
        joinDate: '2022-01-05'
      }
    ];
    
    sampleEmployees.forEach(saveEmployee);
  }
};
