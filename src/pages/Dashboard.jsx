import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Layers, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { dashboardAPI, employeesAPI } from '../services/api';
import { getTooltipStyle, getAxisColor } from '../utils/themeUtils';

const COLORS = ['#9333ea', '#22c55e', '#f97316', '#ef4444', '#a855f7', '#06b6d4'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="group glass-card glass-card-hover rounded-2xl p-6 hover:-translate-y-1 cursor-pointer">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors duration-300">
          {value}
        </h2>
      </div>
      <div className={`p-4 rounded-xl ${color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
      <div className="flex items-center text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-purple)] transition-colors">
        <TrendingUp size={14} className="mr-1" />
        <span>View details</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState('Week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, employeesResponse] = await Promise.all([
          dashboardAPI.getStats(),
          employeesAPI.getAll(),
        ]);
        setStats(statsResponse.data);
        setRecentEmployees(employeesResponse.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[var(--text-secondary)]">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-purple-light)] bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 font-medium">
          Company workforce overview & analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="bg-[var(--accent-indigo)]"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          color="bg-green-600"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={UserX}
          color="bg-red-500"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={Layers}
          color="bg-[var(--accent-purple)]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Weekly Attendance Trend
            </h2>
            <div className="flex gap-2">
              {['Week', 'Month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChartFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    chartFilter === filter
                      ? 'bg-[var(--accent-purple)] text-white shadow-md shadow-[var(--accent-purple)]/30 scale-105'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:scale-105 border border-[var(--border-color)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.weeklyTrend}>
              <XAxis dataKey="day" stroke={getAxisColor()} />
              <YAxis stroke={getAxisColor()} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ fill: '#9333ea', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
            Employees by Department
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.departmentDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.departmentDistribution.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={getTooltipStyle()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Status + Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="glass-card glass-card-hover rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
            Today Attendance Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.todayAttendanceStatus}>
              <XAxis dataKey="name" stroke={getAxisColor()} />
              <YAxis stroke={getAxisColor()} />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Bar dataKey="count" fill="#9333ea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Employees */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Recent Employees</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border-color)]">
                  <th className="pb-4 text-left text-[var(--text-secondary)] font-bold">Employee ID</th>
                  <th className="pb-4 text-left text-[var(--text-secondary)] font-bold">Name</th>
                  <th className="pb-4 text-left text-[var(--text-secondary)] font-bold">Department</th>
                  <th className="pb-4 text-left text-[var(--text-secondary)] font-bold">Email</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.length > 0 ? (
                  recentEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="border-b border-[var(--border-color)] last:border-none hover:bg-[var(--bg-hover)] hover:shadow-sm transition-all duration-200 cursor-pointer group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 text-[var(--text-primary)] font-semibold group-hover:text-[var(--accent-purple)] transition-colors">
                        {emp.id}
                      </td>
                      <td className="py-4 text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors">
                        {emp.name}
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1.5 text-xs rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] font-semibold group-hover:bg-[var(--accent-purple)]/30 group-hover:shadow-sm transition-all border border-[var(--accent-purple)]/30">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        {emp.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-[var(--text-secondary)]">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
