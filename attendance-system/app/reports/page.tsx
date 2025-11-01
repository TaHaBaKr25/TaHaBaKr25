'use client';

import { useState, useEffect } from 'react';
import { getAttendanceRecords, getEmployees } from '@/lib/storage';
import { generateMonthlyReport, getCurrentMonthYear, getMonthName } from '@/lib/utils';
import { Employee, MonthlyReport } from '@/types';

export default function ReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthYear());
  const [reports, setReports] = useState<MonthlyReport[]>([]);

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  useEffect(() => {
    generateReports();
  }, [selectedMonth, employees]);

  const generateReports = () => {
    const records = getAttendanceRecords();
    const monthlyReports = employees.map(emp =>
      generateMonthlyReport(records, emp.id, emp.name, selectedMonth)
    );
    setReports(monthlyReports);
  };

  const getTotalStats = () => {
    return {
      totalEmployees: reports.length,
      totalPresent: reports.reduce((sum, r) => sum + r.presentDays, 0),
      totalAbsent: reports.reduce((sum, r) => sum + r.absentDays, 0),
      totalLate: reports.reduce((sum, r) => sum + r.lateDays, 0),
      totalHours: reports.reduce((sum, r) => sum + r.totalHours, 0)
    };
  };

  const stats = getTotalStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">التقارير والإحصائيات</h1>
          <p className="text-gray-600">عرض تقارير الحضور الشهرية والإحصائيات</p>
        </div>

        {/* Month Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-3 text-lg">اختر الشهر</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full md:w-auto px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none text-lg"
          />
          <p className="mt-2 text-gray-600">التقرير الشهري لـ: {getMonthName(selectedMonth)}</p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-3xl font-bold mb-1">{stats.totalEmployees}</p>
            <p className="text-sm opacity-90">إجمالي الموظفين</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-3xl font-bold mb-1">{stats.totalPresent}</p>
            <p className="text-sm opacity-90">أيام الحضور</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-3xl font-bold mb-1">{stats.totalAbsent}</p>
            <p className="text-sm opacity-90">أيام الغياب</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-3xl font-bold mb-1">{stats.totalLate}</p>
            <p className="text-sm opacity-90">أيام التأخير</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-3xl font-bold mb-1">{Math.round(stats.totalHours)}</p>
            <p className="text-sm opacity-90">إجمالي الساعات</p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right font-bold">الموظف</th>
                  <th className="px-6 py-4 text-center font-bold">إجمالي الأيام</th>
                  <th className="px-6 py-4 text-center font-bold">أيام الحضور</th>
                  <th className="px-6 py-4 text-center font-bold">أيام الغياب</th>
                  <th className="px-6 py-4 text-center font-bold">أيام التأخير</th>
                  <th className="px-6 py-4 text-center font-bold">إجمالي الساعات</th>
                  <th className="px-6 py-4 text-center font-bold">متوسط الساعات</th>
                  <th className="px-6 py-4 text-center font-bold">نسبة الحضور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-5xl">📊</span>
                        <p className="text-lg">لا توجد بيانات للشهر المحدد</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => {
                    const attendanceRate = report.totalDays > 0
                      ? Math.round((report.presentDays / report.totalDays) * 100)
                      : 0;
                    
                    return (
                      <tr key={report.employeeId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {report.employeeName}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {report.totalDays}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-green-600">{report.presentDays}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-red-600">{report.absentDays}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-yellow-600">{report.lateDays}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-800">
                          {report.totalHours}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-800">
                          {report.averageHours}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  attendanceRate >= 90
                                    ? 'bg-green-500'
                                    : attendanceRate >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${attendanceRate}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-700">{attendanceRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        {reports.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-green-800 flex items-center gap-2">
                <span>🏆</span>
                <span>أفضل حضور</span>
              </h3>
              {(() => {
                const best = reports.reduce((prev, current) =>
                  current.presentDays > prev.presentDays ? current : prev
                );
                return (
                  <div>
                    <p className="text-2xl font-bold text-green-700 mb-1">{best.employeeName}</p>
                    <p className="text-green-600">{best.presentDays} يوم حضور</p>
                  </div>
                );
              })()}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-blue-800 flex items-center gap-2">
                <span>⏰</span>
                <span>أكثر ساعات عمل</span>
              </h3>
              {(() => {
                const mostHours = reports.reduce((prev, current) =>
                  current.totalHours > prev.totalHours ? current : prev
                );
                return (
                  <div>
                    <p className="text-2xl font-bold text-blue-700 mb-1">{mostHours.employeeName}</p>
                    <p className="text-blue-600">{mostHours.totalHours} ساعة</p>
                  </div>
                );
              })()}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-purple-800 flex items-center gap-2">
                <span>📈</span>
                <span>متوسط الحضور</span>
              </h3>
              {(() => {
                const avgAttendance = reports.length > 0
                  ? Math.round(
                      (reports.reduce((sum, r) => sum + r.presentDays, 0) / reports.length)
                    )
                  : 0;
                return (
                  <div>
                    <p className="text-2xl font-bold text-purple-700 mb-1">{avgAttendance} يوم</p>
                    <p className="text-purple-600">لكل موظف</p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
