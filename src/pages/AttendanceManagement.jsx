import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Download, Filter, Clock } from 'lucide-react';
import { attendanceAPI, employeesAPI } from '../services/api';

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayAttendance, setTodayAttendance] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterByDate();
  }, [selectedDate, attendanceRecords]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesResponse, attendanceResponse] = await Promise.all([
        employeesAPI.getAll(),
        attendanceAPI.getAll(),
      ]);
      setEmployees(employeesResponse.data || []);
      setAttendanceRecords(attendanceResponse.data || []);
      setFilteredRecords(attendanceResponse.data || []);
      
      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayResponse = await attendanceAPI.getAll(today);
      setTodayAttendance(todayResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays to prevent crashes
      setEmployees([]);
      setAttendanceRecords([]);
      setFilteredRecords([]);
      setTodayAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = () => {
    if (!selectedDate) {
      setFilteredRecords(attendanceRecords);
      return;
    }
    const filtered = attendanceRecords.filter((att) => att.date === selectedDate);
    setFilteredRecords(filtered);
  };

  const markAttendance = async (employeeId, status) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await attendanceAPI.markAttendance(employeeId, today, status);
      await fetchData();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance. Please try again.');
    }
  };

  const getEmployeeAttendanceStatus = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const record = todayAttendance.find((att) => att.employeeId === employeeId);
    return record ? record.status : null;
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const getEmployeeDepartment = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.department : 'Unknown';
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Department', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((att) =>
        [
          att.date,
          att.employeeId,
          getEmployeeName(att.employeeId),
          getEmployeeDepartment(att.employeeId),
          att.status,
        ]
          .map((field) => `"${field}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate || 'all'}.csv`;
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
                <Calendar className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-purple-light)] bg-clip-text text-transparent">
                Attendance Management
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] font-medium">Mark and track employee attendance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="group flex items-center gap-2 px-5 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-hover)] hover:shadow-md border border-[var(--border-color)] transition-all duration-200 font-semibold"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="glass-card glass-card-hover rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Filter className="text-[var(--accent-purple)]" size={20} />
            <label className="text-sm font-semibold text-[var(--text-primary)]">Filter by Date:</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] transition-all duration-200 font-medium"
          />
          <button
            onClick={() => setSelectedDate('')}
            className="px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200 font-semibold hover:shadow-sm"
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Mark Attendance Section - Today Only */}
      <div className="glass-card glass-card-hover rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-xl">
            <Clock className="text-green-500" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Mark Today's Attendance
          </h2>
          <span className="px-3 py-1 bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] rounded-full text-sm font-semibold border border-[var(--accent-purple)]/30">
            {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const status = getEmployeeAttendanceStatus(emp.id);
            return (
              <div
                key={emp.id}
                className="group glass-card glass-card-hover rounded-xl p-5 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--text-primary)] text-lg group-hover:text-[var(--accent-purple)] transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">{emp.department}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">{emp.id}</p>
                  </div>
                  {status && (
                    <span
                      className={`px-3 py-1.5 text-xs rounded-full font-bold shadow-sm ${
                        status === 'Present'
                          ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                          : 'bg-red-500/20 text-red-500 border border-red-500/30'
                      }`}
                    >
                      {status}
                    </span>
                  )}
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => markAttendance(emp.id, 'Present')}
                    disabled={status === 'Present'}
                    className={`group/present flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden ${
                      status === 'Present'
                        ? 'bg-gradient-to-r from-green-500/40 to-green-600/40 text-green-300 cursor-not-allowed border-2 border-green-400/60 shadow-lg shadow-green-500/25'
                        : 'bg-gradient-to-r from-green-500/25 to-green-600/25 text-green-400 hover:from-green-500/40 hover:to-green-600/40 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.03] active:scale-[0.97] border-2 border-green-500/50 hover:border-green-400/70'
                    }`}
                  >
                    {status !== 'Present' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/present:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                    <CheckCircle size={18} className={`relative z-10 transition-all duration-300 ${status === 'Present' ? '' : 'group-hover/present:scale-110 group-hover/present:rotate-12'}`} strokeWidth={2.5} />
                    <span className="relative z-10 text-sm font-bold tracking-wide">Present</span>
                  </button>
                  <button
                    onClick={() => markAttendance(emp.id, 'Absent')}
                    disabled={status === 'Absent'}
                    className={`group/absent flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden ${
                      status === 'Absent'
                        ? 'bg-gradient-to-r from-red-500/40 to-red-600/40 text-red-300 cursor-not-allowed border-2 border-red-400/60 shadow-lg shadow-red-500/25'
                        : 'bg-gradient-to-r from-red-500/25 to-red-600/25 text-red-400 hover:from-red-500/40 hover:to-red-600/40 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.03] active:scale-[0.97] border-2 border-red-500/50 hover:border-red-400/70'
                    }`}
                  >
                    {status !== 'Absent' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/absent:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                    <XCircle size={18} className={`relative z-10 transition-all duration-300 ${status === 'Absent' ? '' : 'group-hover/absent:scale-110 group-hover/absent:rotate-12'}`} strokeWidth={2.5} />
                    <span className="relative z-10 text-sm font-bold tracking-wide">Absent</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {employees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)] font-medium">
              No employees found. Add employees first to mark attendance.
            </p>
          </div>
        )}
      </div>

      {/* Attendance Records Table */}
      <div className="glass-card glass-card-hover rounded-2xl overflow-hidden">
        <div className="p-6 border-b-2 border-[var(--border-color)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Employee ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Department</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredRecords.length > 0 ? (
                filteredRecords
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((att, index) => (
                    <tr
                      key={att.id}
                      className="hover:bg-[var(--bg-hover)] transition-all duration-200 group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors">
                        {new Date(att.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors">
                        {att.employeeId}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors">
                        {getEmployeeName(att.employeeId)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 text-xs rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] font-semibold border border-[var(--accent-purple)]/30">
                          {getEmployeeDepartment(att.employeeId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 text-xs rounded-full font-bold shadow-sm ${
                            att.status === 'Present'
                              ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                              : 'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[var(--text-muted)] font-medium">
                    {selectedDate
                      ? `No attendance records found for ${new Date(selectedDate).toLocaleDateString()}`
                      : 'No attendance records found'}
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
          Showing <span className="font-bold text-[var(--accent-purple)]">{filteredRecords.length}</span> of{' '}
          <span className="font-bold text-[var(--text-primary)]">{attendanceRecords.length}</span> attendance records
          {selectedDate && (
            <>
              {' '}for <span className="font-bold text-[var(--text-primary)]">{new Date(selectedDate).toLocaleDateString()}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AttendanceManagement;
