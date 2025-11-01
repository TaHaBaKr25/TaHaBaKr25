'use client';

import { useState, useEffect } from 'react';
import { getEmployees, saveEmployee, deleteEmployee } from '@/lib/storage';
import { Employee } from '@/types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    position: '',
    department: '',
    employeeNumber: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    setEmployees(getEmployees());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee: Employee = {
      id: editingEmployee?.id || Date.now().toString(),
      name: formData.name || '',
      position: formData.position || '',
      department: formData.department || '',
      employeeNumber: formData.employeeNumber || '',
      phone: formData.phone || '',
      email: formData.email || '',
      joinDate: formData.joinDate || ''
    };

    saveEmployee(employee);
    loadEmployees();
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      deleteEmployee(id);
      loadEmployees();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      employeeNumber: '',
      phone: '',
      email: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">إدارة الموظفين</h1>
            <p className="text-gray-600">عرض وإدارة بيانات الموظفين</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
          >
            {showForm ? '✕ إلغاء' : '+ إضافة موظف جديد'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">المسمى الوظيفي *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="أدخل المسمى الوظيفي"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">القسم *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="أدخل القسم"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">رقم الموظف *</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeNumber}
                    onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="مثال: EMP001"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">رقم الجوال *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    placeholder="example@ihsan.org"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">تاريخ الالتحاق *</label>
                  <input
                    type="date"
                    required
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  {editingEmployee ? 'حفظ التعديلات' : 'إضافة الموظف'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
              <span className="text-6xl mb-4 block">👥</span>
              <p className="text-xl text-gray-500">لا يوجد موظفين مسجلين</p>
              <p className="text-gray-400 mt-2">قم بإضافة موظف جديد للبدء</p>
            </div>
          ) : (
            employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {employee.name.charAt(0)}
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {employee.employeeNumber}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1">{employee.name}</h3>
                <p className="text-emerald-600 font-medium mb-4">{employee.position}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p className="flex items-center gap-2">
                    <span>🏢</span>
                    <span>{employee.department}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📱</span>
                    <span>{employee.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📧</span>
                    <span className="truncate">{employee.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📅</span>
                    <span>التحق في: {new Date(employee.joinDate).toLocaleDateString('ar-SA')}</span>
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
