'use client';

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, TrendingUp, BarChart3, PieChart, Activity, Bell, Clock, AlertCircle } from 'lucide-react';
import { adminAPI } from '@/app/services/api';

// Mock data for charts - in real app, this would come from API calls to admin endpoints
const mockStats = {
  totalUsers: 245,
  totalStudents: 200,
  totalCompanies: 45,
  totalJobs: 89,
  totalApplications: 156,
  totalExtracurriculars: 12,
  totalNews: 25,
  monthlyGrowth: 12.5,
  activeJobs: 67,
  pendingJobs: 22,
  expiredJobs: 0,
  rejectedJobs: 0
};

const mockChartData = {
  userGrowth: [
    { month: 'Jan', students: 45, companies: 8 },
    { month: 'Feb', students: 52, companies: 12 },
    { month: 'Mar', students: 61, companies: 15 },
    { month: 'Apr', students: 78, companies: 18 },
    { month: 'May', students: 95, companies: 22 },
    { month: 'Jun', students: 112, companies: 28 }
  ],
  jobStatus: [
    { status: 'Active', count: 67, color: '#10B981' },
    { status: 'Pending', count: 22, color: '#F59E0B' },
    { status: 'Expired', count: 0, color: '#6B7280' },
    { status: 'Rejected', count: 0, color: '#EF4444' }
  ],
  applicationsByMonth: [
    { month: 'Jan', count: 23 },
    { month: 'Feb', count: 31 },
    { month: 'Mar', count: 28 },
    { month: 'Apr', count: 35 },
    { month: 'May', count: 42 },
    { month: 'Jun', count: 48 }
  ],
  extracurricularsByCategory: [
    { category: 'Olahraga', count: 5, color: '#3B82F6' },
    { category: 'Seni', count: 4, color: '#10B981' },
    { category: 'Teknologi', count: 3, color: '#F59E0B' }
  ]
};

// Simple Bar Chart Component with Tooltips
const BarChart = ({ data, title }: { data: any[]; title: string }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: any, type: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: `${type}: ${item[type]}`
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center">
            <div className="w-16 text-sm text-gray-600">{item.month}</div>
            <div className="flex-1 ml-4">
              <div className="flex space-x-1">
                <div
                  className="bg-blue-500 h-6 rounded relative"
                  style={{ width: `${(item.students / 120) * 100}%` }}
                  onMouseEnter={(e) => handleMouseEnter(e, item, 'students')}
                  onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                ></div>
                <div
                  className="bg-green-500 h-6 rounded relative"
                  style={{ width: `${(item.companies / 30) * 100}%` }}
                  onMouseEnter={(e) => handleMouseEnter(e, item, 'companies')}
                  onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Siswa</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Industri</span>
        </div>
      </div>
      {tooltip.visible && (
        <div
          className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

// Radial (Pie) Chart Component with Tooltips
const RadialChart = ({ data, title }: { data: any[]; title: string }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  const total = data.reduce((sum: number, item: any) => sum + item.count, 0);
  let cumulativePercent = 0;

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>, item: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      content: `${item.category}: ${item.count} (${((item.count / total) * 100).toFixed(1)}%)`
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center relative">
        <svg viewBox="0 0 200 200" className="w-48 h-48" onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E7EB" strokeWidth="10" />
          {data.map((item: any, index: number) => {
            const percent = (item.count / total) * 100;
            const startAngle = (cumulativePercent / 100) * 360 - 90;
            const endAngle = ((cumulativePercent + percent) / 100) * 360 - 90;
            cumulativePercent += percent;

            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                className="cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(e, item)}
              />
            );
          })}
        </svg>
        {tooltip.visible && (
          <div
            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></div>
              <span>{item.category}</span>
            </div>
            <span className="font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line Chart Component with Tooltips
const LineChart = ({ data, title }: { data: any[]; title: string }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const maxValue = Math.max(...data.map((item: any) => item.count));

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, item: any, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!svgRect) return;
    const x = (index / (data.length - 1)) * 100;
    const y = 40 - (item.count / maxValue) * 40;
    setTooltip({
      visible: true,
      x: svgRect.left + (x / 100) * svgRect.width,
      y: svgRect.top + (y / 40) * svgRect.height - 20,
      content: `${item.month}: ${item.count} lamaran`
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative h-32">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          {/* Grid lines */}
          {[0, 10, 20, 30, 40].map((pos: number) => (
            <line key={pos} x1="0" y1={pos} x2="100" y2={pos} stroke="#E5E7EB" strokeWidth="0.5" />
          ))}

          {/* Line */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={data.map((item: any, index: number) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 40 - (item.count / maxValue) * 40;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Points with tooltips */}
          {data.map((item: any, index: number) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 40 - (item.count / maxValue) * 40;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3B82F6"
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(e, item, index)}
                  onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                />
              </g>
            );
          })}
        </svg>
        {tooltip.visible && (
          <div
            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((item: any) => (
          <span key={item.month}>{item.month}</span>
        ))}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, color = 'blue', subTitle }: {
  title: string;
  value: number;
  icon: any;
  trend?: number;
  color?: string;
  subTitle?: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subTitle && <p className="text-sm text-gray-500 mt-1">{subTitle}</p>}
        {trend && (
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{trend}% dari bulan lalu
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

// Notification Popup Component (Placeholder)
const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate notification
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          <div>
            <p className="font-semibold">Notifikasi Event</p>
            <p className="text-sm">Ada event baru: Workshop Teknologi 2024. Cek jadwal di kalender.</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="ml-auto text-yellow-700 hover:text-yellow-900">
            <AlertCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  // Fetch real data from admin API endpoints
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error('No auth token found');
          setLoading(false);
          return;
        }

        // Fetch real data from APIs
        const [usersRes, jobsRes, applicationsRes] = await Promise.all([
          adminAPI.getAllUsers(token),
          adminAPI.getAllJobPostings(token),
          adminAPI.getAllApplications(token)
        ]);

        // Calculate stats from real data
        const users = usersRes.data || [];
        const jobs = jobsRes.data || [];
        const applications = applicationsRes.data || [];

        const students = users.filter((user: any) => user.role === 'STUDENT');
        const companies = users.filter((user: any) => user.role === 'COMPANY');
        const activeJobs = jobs.filter((job: any) => job.status === 'ACTIVE');
        const pendingJobs = jobs.filter((job: any) => job.status === 'PENDING');

        setStats({
          totalUsers: users.length,
          totalStudents: students.length,
          totalCompanies: companies.length,
          totalJobs: jobs.length,
          totalApplications: applications.length,
          totalExtracurriculars: 12, // This would come from another API
          totalNews: 25, // This would come from another API
          monthlyGrowth: 12.5, // This would be calculated from historical data
          activeJobs: activeJobs.length,
          pendingJobs: pendingJobs.length,
          expiredJobs: jobs.filter((job: any) => job.status === 'EXPIRED').length,
          rejectedJobs: jobs.filter((job: any) => job.status === 'REJECTED').length
        });

      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to mock data if API fails
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <NotificationPopup />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Pantau aktivitas, statistik, dan kelola platform secara keseluruhan</p>
        </div>

        {/* Stats Cards - Expanded */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Siswa"
            value={stats.totalStudents}
            icon={Users}
            trend={stats.monthlyGrowth}
            color="blue"
          />
          <StatCard
            title="Total Industri"
            value={stats.totalCompanies}
            icon={Briefcase}
            color="green"
          />
          <StatCard
            title="Total Lowongan"
            value={stats.totalJobs}
            icon={FileText}
            color="purple"
          />
          <StatCard
            title="Total Lamaran"
            value={stats.totalApplications}
            icon={Activity}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Berita"
            value={stats.totalNews}
            icon={BarChart3}
            trend={0}
            color="indigo"
            subTitle="Artikel terbit"
          />
          <StatCard
            title="Ekstrakurikuler"
            value={stats.totalExtracurriculars}
            icon={PieChart}
            trend={0}
            color="pink"
            subTitle="Aktivitas siswa"
          />
          <StatCard
            title="Lowongan Aktif"
            value={stats.activeJobs}
            icon={Clock}
            trend={0}
            color="emerald"
            subTitle="Sedang dibuka"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart data={mockChartData.userGrowth} title="Pertumbuhan Pengguna Bulanan" />
          <RadialChart data={mockChartData.extracurricularsByCategory} title="Ekstrakurikuler per Kategori" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RadialChart data={mockChartData.jobStatus} title="Status Lowongan Kerja" />
          <LineChart data={mockChartData.applicationsByMonth} title="Tren Lamaran per Bulan" />
        </div>

        {/* Recent Activity / History Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Riwayat Aktivitas Terbaru
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Industri ABC mendaftarkan lowongan baru "Software Engineer"</p>
                <p className="text-xs text-gray-500">2 jam yang lalu | Status: Pending</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">5 siswa mengajukan lamaran ke lowongan aktif</p>
                <p className="text-xs text-gray-500">4 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">3 lowongan menunggu persetujuan admin</p>
                <p className="text-xs text-gray-500">6 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">1 akun siswa dihapus oleh admin</p>
                <p className="text-xs text-gray-500">1 hari yang lalu</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:underline text-sm">Lihat semua riwayat →</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Kelola Lowongan</h4>
            <p className="text-sm text-gray-600 mb-4">Lihat dan approve lowongan pending</p>
            <a href="/admin/lowongan" className="text-blue-600 hover:underline text-sm">Buka →</a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Manajemen Akun</h4>
            <p className="text-sm text-gray-600 mb-4">Kelola akun siswa dan industri</p>
            <a href="/admin/akun" className="text-blue-600 hover:underline text-sm">Buka →</a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Konten</h4>
            <p className="text-sm text-gray-600 mb-4">Update berita dan ekstrakurikuler</p>
            <a href="/admin/konten" className="text-blue-600 hover:underline text-sm">Buka →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
