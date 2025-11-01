'use client';

import { useState, useEffect } from 'react';
import { getAttendanceRecords, getEmployees } from '@/lib/storage';
import { formatDate, formatTime } from '@/lib/utils';
import { AttendanceRecord, Employee } from '@/types';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterEmployee, setFilterEmployee] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    setRecords(getAttendanceRecords().sort((a, b) => b.date.localeCompare(a.date)));
    setEmployees(getEmployees());
  }, []);

  const filteredRecords = records.filter(record => {
    if (filterEmployee && record.employeeId !== filterEmployee) return false;
    if (filterDate && record.date !== filterDate) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800 border-green-300',
      late: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      absent: 'bg-red-100 text-red-800 border-red-300',
      incomplete: 'bg-blue-100 text-blue-800 border-blue-300'
    };

    const labels = {
      present: 'حاضر',
      late: 'متأخر',
      absent: 'غائب',
      incomplete: 'غير مكتمل'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">سجلات الحضور والانصراف</h1>
          <p className="text-gray-600">عرض وإدارة سجلات حضور الموظفين</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">تصفية السجلات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">الموظف</label>
              <select
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="">جميع الموظفين</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">التاريخ</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          {(filterEmployee || filterDate) && (
            <button
              onClick={() => {
                setFilterEmployee('');
                setFilterDate('');
              }}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right font-bold">الموظف</th>
                  <th className="px-6 py-4 text-right font-bold">التاريخ</th>
                  <th className="px-6 py-4 text-right font-bold">وقت الحضور</th>
                  <th className="px-6 py-4 text-right font-bold">وقت الانصراف</th>
                  <th className="px-6 py-4 text-right font-bold">ساعات العمل</th>
                  <th className="px-6 py-4 text-right font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-5xl">📋</span>
                        <p className="text-lg">لا توجد سجلات متاحة</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {record.employeeName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(new Date(record.date))}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {record.checkIn ? (
                          <span className="font-medium text-emerald-600">
                            {formatTime(new Date(record.checkIn))}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {record.checkOut ? (
                          <span className="font-medium text-teal-600">
                            {formatTime(new Date(record.checkOut))}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {record.workHours ? (
                          <span className="font-bold text-gray-800">
                            {record.workHours} ساعة
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(record.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredRecords.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <h3 className="font-bold text-lg mb-3 text-gray-800">ملخص السجلات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{filteredRecords.length}</p>
                <p className="text-gray-600 text-sm">إجمالي السجلات</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {filteredRecords.filter(r => r.status === 'present').length}
                </p>
                <p className="text-gray-600 text-sm">حاضر</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {filteredRecords.filter(r => r.status === 'late').length}
                </p>
                <p className="text-gray-600 text-sm">متأخر</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {filteredRecords.filter(r => r.status === 'incomplete').length}
                </p>
                <p className="text-gray-600 text-sm">غير مكتمل</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
