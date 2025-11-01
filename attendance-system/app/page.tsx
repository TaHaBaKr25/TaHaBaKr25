'use client';

import { useState, useEffect } from 'react';
import { getEmployees, getTodayAttendance, saveAttendanceRecord, initializeSampleData } from '@/lib/storage';
import { formatDate, formatTime, calculateWorkHours } from '@/lib/utils';
import { Employee, AttendanceRecord } from '@/types';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    initializeSampleData();
    setEmployees(getEmployees());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const record = getTodayAttendance(selectedEmployee);
      setTodayRecord(record || null);
    } else {
      setTodayRecord(null);
    }
  }, [selectedEmployee]);

  const handleCheckIn = () => {
    if (!selectedEmployee) {
      showMessage('error', 'الرجاء اختيار الموظف');
      return;
    }

    const employee = employees.find(e => e.id === selectedEmployee);
    if (!employee) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (todayRecord?.checkIn) {
      showMessage('error', 'تم تسجيل الحضور مسبقاً لهذا اليوم');
      return;
    }

    const record: AttendanceRecord = {
      id: `${selectedEmployee}-${today}`,
      employeeId: selectedEmployee,
      employeeName: employee.name,
      date: today,
      checkIn: now.toISOString(),
      status: 'incomplete'
    };

    saveAttendanceRecord(record);
    setTodayRecord(record);
    showMessage('success', `تم تسجيل حضور ${employee.name} بنجاح`);
  };

  const handleCheckOut = () => {
    if (!selectedEmployee) {
      showMessage('error', 'الرجاء اختيار الموظف');
      return;
    }

    if (!todayRecord?.checkIn) {
      showMessage('error', 'لم يتم تسجيل الحضور بعد');
      return;
    }

    if (todayRecord.checkOut) {
      showMessage('error', 'تم تسجيل الانصراف مسبقاً لهذا اليوم');
      return;
    }

    const now = new Date();
    const workHours = calculateWorkHours(todayRecord.checkIn, now.toISOString());
    
    const updatedRecord: AttendanceRecord = {
      ...todayRecord,
      checkOut: now.toISOString(),
      workHours,
      status: 'present'
    };

    saveAttendanceRecord(updatedRecord);
    setTodayRecord(updatedRecord);
    showMessage('success', `تم تسجيل انصراف ${todayRecord.employeeName} بنجاح`);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            نظام الحضور والانصراف
          </h1>
          <p className="text-gray-600">سجل حضورك وانصرافك بسهولة</p>
        </div>

        {/* Current Time Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="text-center">
            <p className="text-lg mb-2 opacity-90">{formatDate(currentTime)}</p>
            <p className="text-6xl font-bold mb-2">{formatTime(currentTime)}</p>
            <p className="text-sm opacity-75">التوقيت المحلي</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            <p className="text-center font-medium">{message.text}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Employee Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              اختر الموظف
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
            >
              <option value="">-- اختر الموظف --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          {/* Today's Record */}
          {selectedEmployee && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-lg mb-4 text-gray-800">سجل اليوم</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">وقت الحضور</p>
                  <p className="font-bold text-lg text-emerald-600">
                    {todayRecord?.checkIn 
                      ? formatTime(new Date(todayRecord.checkIn))
                      : 'لم يتم التسجيل'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">وقت الانصراف</p>
                  <p className="font-bold text-lg text-teal-600">
                    {todayRecord?.checkOut 
                      ? formatTime(new Date(todayRecord.checkOut))
                      : 'لم يتم التسجيل'}
                  </p>
                </div>
                {todayRecord?.workHours && (
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">ساعات العمل</p>
                    <p className="font-bold text-2xl text-gray-800">
                      {todayRecord.workHours} ساعة
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCheckIn}
              disabled={!selectedEmployee || !!todayRecord?.checkIn}
              className="py-6 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              ✓ تسجيل الحضور
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!selectedEmployee || !todayRecord?.checkIn || !!todayRecord?.checkOut}
              className="py-6 px-8 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold text-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              ← تسجيل الانصراف
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            <span>معلومات مهمة</span>
          </h3>
          <ul className="text-blue-800 space-y-1 mr-6">
            <li>• يجب تسجيل الحضور عند الوصول للعمل</li>
            <li>• يجب تسجيل الانصراف عند مغادرة العمل</li>
            <li>• يتم احتساب ساعات العمل تلقائياً</li>
            <li>• يمكنك مراجعة السجلات من قائمة السجلات</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
