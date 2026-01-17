import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, X, Save, Download, UserPlus, Users } from 'lucide-react';
import { employeesAPI } from '../services/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [errors, setErrors] = useState({});

  const departments = ['Engineering', 'HR', 'Sales', 'Finance', 'Marketing', 'Operations'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        await employeesAPI.update(editingId, formData);
      } else {
        await employeesAPI.create(formData);
      }
      
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeesAPI.delete(id);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '' });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Department'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map((emp) =>
        [emp.id, emp.name, emp.email, emp.department].map((field) => `"${field}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[var(--accent-purple)] rounded-xl">
                <Users className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-purple-light)] bg-clip-text text-transparent">
                Employee Management
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] font-medium">Manage your organization's employees</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="group flex items-center gap-2 px-5 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-hover)] hover:shadow-md border border-[var(--border-color)] transition-all duration-200 font-semibold"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="group flex items-center gap-2 px-5 py-3 bg-[var(--accent-purple)] text-white rounded-xl hover:bg-[var(--accent-purple-dark)] hover:shadow-lg hover:shadow-[var(--accent-purple)]/30 hover:scale-105 transition-all duration-200 font-semibold"
            >
              <UserPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl my-8 max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {editingId ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200 hover:rotate-90 hover:scale-110"
              >
                <X size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] transition-all duration-200 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] transition-all duration-200 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder="email@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
                )}
              </div>

              <div className="relative overflow-hidden">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value });
                    if (errors.department) setErrors({ ...errors, department: '' });
                  }}
                  className={`w-full px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] transition-all duration-200 cursor-pointer ${
                    errors.department
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.department}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border-2 border-[var(--border-color)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-hover)] transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="group flex-1 px-4 py-3 bg-[var(--accent-purple)] text-white rounded-xl hover:bg-[var(--accent-purple-dark)] hover:shadow-lg hover:shadow-[var(--accent-purple)]/30 hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={18} className="group-hover:scale-110 transition-transform" />
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card glass-card-hover rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, department, or ID..."
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] transition-all duration-200 placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-card glass-card-hover rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Employee ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Department</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[var(--bg-hover)] transition-all duration-200 group"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors">
                      {emp.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 text-xs rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] font-semibold border border-[var(--accent-purple)]/30">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-2.5 text-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/20 hover:scale-110 rounded-xl transition-all duration-200 group/edit"
                          title="Edit"
                        >
                          <Edit size={18} className="group-hover/edit:rotate-12 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2.5 text-red-500 hover:bg-red-500/20 hover:scale-110 rounded-xl transition-all duration-200 group/delete"
                          title="Delete"
                        >
                          <Trash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--text-muted)]">
                    {searchTerm ? 'No employees found matching your search' : 'No employees found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card rounded-xl p-4 text-center">
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          Showing <span className="font-bold text-[var(--accent-purple)]">{filteredEmployees.length}</span> of{' '}
          <span className="font-bold text-[var(--text-primary)]">{employees.length}</span> employees
        </p>
      </div>
    </div>
  );
};

export default EmployeeManagement;
