import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  FileText
} from 'lucide-react';

// ============================================
// APLIKASI HR MANAGEMENT - SINGLE PAGE APPLICATION
// ============================================

function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // State untuk navigasi sidebar (mobile responsive)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State untuk halaman aktif
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // State untuk data karyawan (mock data)
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ahmad Rizki', email: 'ahmad.rizki@company.com', division: 'Engineering', position: 'Senior Developer' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti.nurhaliza@company.com', division: 'Marketing', position: 'Marketing Manager' },
    { id: 3, name: 'Budi Santoso', email: 'budi.santoso@company.com', division: 'Finance', position: 'Financial Analyst' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.lestari@company.com', division: 'HR', position: 'HR Specialist' },
    { id: 5, name: 'Eko Prasetyo', email: 'eko.prasetyo@company.com', division: 'Engineering', position: 'Junior Developer' },
  ]);
  
  // State untuk kehadiran/absensi
  const [attendance, setAttendance] = useState([
    { id: 1, employeeId: 1, employeeName: 'Ahmad Rizki', checkIn: '08:45', checkOut: '17:30', date: new Date().toLocaleDateString('id-ID') },
    { id: 2, employeeId: 2, employeeName: 'Siti Nurhaliza', checkIn: '09:00', checkOut: '-', date: new Date().toLocaleDateString('id-ID') },
  ]);
  
  // State untuk waktu check-in/check-out saat ini
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // State untuk pengajuan cuti
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employeeName: 'Ahmad Rizki', leaveType: 'Tahunan', startDate: '2024-01-15', endDate: '2024-01-17', reason: 'Liburan keluarga', status: 'Approved' },
    { id: 2, employeeName: 'Budi Santoso', leaveType: 'Sakit', startDate: '2024-01-10', endDate: '2024-01-11', reason: 'Demam', status: 'Approved' },
    { id: 3, employeeName: 'Dewi Lestari', leaveType: 'Tahunan', startDate: '2024-01-20', endDate: '2024-01-22', reason: 'Acara keluarga', status: 'Pending' },
  ]);
  
  // State untuk form tambah karyawan
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', division: '', position: '' });
  
  // State untuk form pengajuan cuti
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leaveType: 'Tahunan',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  // Update waktu setiap detik
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // ==========================================
  // HANDLER FUNCTIONS
  // ==========================================
  
  // Handler untuk check-in
  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('id-ID');
    
    // Cek apakah sudah check-in hari ini
    const todayAttendance = attendance.filter(a => a.date === dateString);
    const hasCheckedIn = todayAttendance.length > 0;
    
    if (!hasCheckedIn) {
      const newAttendance = {
        id: attendance.length + 1,
        employeeId: 1, // Mock user yang login
        employeeName: 'User Login',
        checkIn: timeString,
        checkOut: '-',
        date: dateString
      };
      setAttendance([newAttendance, ...attendance]);
    }
  };
  
  // Handler untuk check-out
  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('id-ID');
    
    // Update check-out untuk entri hari ini
    const updatedAttendance = attendance.map(att => {
      if (att.date === dateString && att.checkOut === '-') {
        return { ...att, checkOut: timeString };
      }
      return att;
    });
    
    setAttendance(updatedAttendance);
  };
  
  // Handler untuk menambah karyawan baru
  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.division && newEmployee.position) {
      const employee = {
        id: employees.length + 1,
        ...newEmployee
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', email: '', division: '', position: '' });
      setShowAddEmployeeModal(false);
    }
  };
  
  // Handler untuk mengajukan cuti
  const handleSubmitLeave = () => {
    if (newLeaveRequest.startDate && newLeaveRequest.endDate && newLeaveRequest.reason) {
      const leaveRequest = {
        id: leaveRequests.length + 1,
        employeeName: 'User Login', // Mock user yang login
        ...newLeaveRequest,
        status: 'Pending'
      };
      setLeaveRequests([...leaveRequests, leaveRequest]);
      setNewLeaveRequest({ leaveType: 'Tahunan', startDate: '', endDate: '', reason: '' });
      setShowLeaveForm(false);
    }
  };
  
  // Handler untuk approve/reject cuti
  const handleLeaveStatus = (id, status) => {
    const updated = leaveRequests.map(req => 
      req.id === id ? { ...req, status } : req
    );
    setLeaveRequests(updated);
  };
  
  // ==========================================
  // RENDER CONTENT BERDASARKAN HALAMAN AKTIF
  // ==========================================
  
  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return <DashboardPage employees={employees} attendance={attendance} leaveRequests={leaveRequests} />;
      case 'employees':
        return <EmployeesPage 
          employees={employees} 
          showAddEmployeeModal={showAddEmployeeModal}
          setShowAddEmployeeModal={setShowAddEmployeeModal}
          newEmployee={newEmployee}
          setNewEmployee={setNewEmployee}
          handleAddEmployee={handleAddEmployee}
        />;
      case 'attendance':
        return <AttendancePage 
          attendance={attendance} 
          currentTime={currentTime}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
        />;
      case 'leave':
        return <LeavePage 
          leaveRequests={leaveRequests}
          showLeaveForm={showLeaveForm}
          setShowLeaveForm={setShowLeaveForm}
          newLeaveRequest={newLeaveRequest}
          setNewLeaveRequest={setNewLeaveRequest}
          handleSubmitLeave={handleSubmitLeave}
          handleLeaveStatus={handleLeaveStatus}
        />;
      default:
        return <DashboardPage employees={employees} attendance={attendance} leaveRequests={leaveRequests} />;
    }
  };
  
  // ==========================================
  // MAIN RENDER
  // ==========================================
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ============================================
// COMPONENT: SIDEBAR
// ============================================

function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Karyawan', icon: Users },
    { id: 'attendance', label: 'Kehadiran', icon: Clock },
    { id: 'leave', label: 'Cuti', icon: Calendar },
  ];
  
  return (
    <>
      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo / Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">HR System</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// ============================================
// COMPONENT: HEADER
// ============================================

function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Tombol hamburger untuk mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Spacer untuk desktop */}
      <div className="hidden lg:block"></div>
      
      {/* User Profile & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="text-indigo-600" size={20} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@company.com</p>
          </div>
        </div>
        
        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

// ============================================
// PAGE: DASHBOARD
// ============================================

function DashboardPage({ employees, attendance, leaveRequests }) {
  // Hitung statistik
  const totalEmployees = employees.length;
  const todayDate = new Date().toLocaleDateString('id-ID');
  const todayAttendance = attendance.filter(a => a.date === todayDate);
  const attendancePercentage = totalEmployees > 0 
    ? Math.round((todayAttendance.length / totalEmployees) * 100) 
    : 0;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  
  const stats = [
    {
      title: 'Total Karyawan',
      value: totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Kehadiran Hari Ini',
      value: `${attendancePercentage}%`,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cuti Pending',
      value: pendingLeaves,
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas HR</p>
      </div>
      
      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.color.replace('bg-', 'text-')} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kehadiran Terbaru */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kehadiran Terbaru</h2>
          <div className="space-y-3">
            {todayAttendance.slice(0, 5).map((att) => (
              <div key={att.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{att.employeeName}</p>
                    <p className="text-xs text-gray-500">Check In: {att.checkIn}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{att.date}</span>
              </div>
            ))}
            {todayAttendance.length === 0 && (
              <p className="text-gray-500 text-sm">Belum ada kehadiran hari ini</p>
            )}
          </div>
        </div>
        
        {/* Pengajuan Cuti Terbaru */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengajuan Cuti</h2>
          <div className="space-y-3">
            {leaveRequests.slice(0, 5).map((leave) => (
              <div key={leave.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    leave.status === 'Approved' ? 'bg-green-50' :
                    leave.status === 'Rejected' ? 'bg-red-50' : 'bg-orange-50'
                  }`}>
                    <FileText className={`size-4 ${
                      leave.status === 'Approved' ? 'text-green-600' :
                      leave.status === 'Rejected' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{leave.employeeName}</p>
                    <p className="text-xs text-gray-500">{leave.leaveType}</p>
                  </div>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE: EMPLOYEES (MANAJEMEN KARYAWAN)
// ============================================

function EmployeesPage({ 
  employees, 
  showAddEmployeeModal, 
  setShowAddEmployeeModal,
  newEmployee,
  setNewEmployee,
  handleAddEmployee
}) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Karyawan</h1>
          <p className="text-gray-500 mt-1">Kelola data karyawan perusahaan</p>
        </div>
        <button
          onClick={() => setShowAddEmployeeModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Tambah Karyawan</span>
        </button>
      </div>
      
      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="text-indigo-600" size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.division}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal Tambah Karyawan */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tambah Karyawan Baru</h2>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                <select
                  value={newEmployee.division}
                  onChange={(e) => setNewEmployee({ ...newEmployee, division: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Pilih Divisi</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Masukkan jabatan"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// PAGE: ATTENDANCE (KEHADIRAN)
// ============================================

function AttendancePage({ attendance, currentTime, handleCheckIn, handleCheckOut }) {
  const todayDate = new Date().toLocaleDateString('id-ID');
  const todayAttendance = attendance.filter(a => a.date === todayDate);
  
  // Cek apakah user sudah check-in hari ini
  const hasCheckedIn = todayAttendance.some(a => a.employeeName === 'User Login');
  const hasCheckedOut = todayAttendance.some(a => a.employeeName === 'User Login' && a.checkOut !== '-');
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kehadiran</h1>
        <p className="text-gray-500 mt-1">Catat dan kelola kehadiran karyawan</p>
      </div>
      
      {/* Check In/Out Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p className="text-gray-500">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCheckIn}
            disabled={hasCheckedIn}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
              transition-all duration-200
              ${hasCheckedIn 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
              }
            `}
          >
            <CheckCircle size={20} />
            <span>Check In</span>
          </button>
          
          <button
            onClick={handleCheckOut}
            disabled={!hasCheckedIn || hasCheckedOut}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
              transition-all duration-200
              ${!hasCheckedIn || hasCheckedOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg'
              }
            `}
          >
            <XCircle size={20} />
            <span>Check Out</span>
          </button>
        </div>
        
        {/* Status Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            {hasCheckedOut 
              ? '✓ Anda sudah check in dan check out hari ini'
              : hasCheckedIn 
                ? '✓ Anda sudah check in. Jangan lupa check out!'
                : 'Silakan check in untuk memulai hari kerja Anda'
            }
          </p>
        </div>
      </div>
      
      {/* Today's Attendance Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Log Kehadiran Hari Ini</h2>
          <p className="text-sm text-gray-500">{todayDate}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todayAttendance.map((att) => (
                <tr key={att.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="text-indigo-600" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{att.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {att.checkOut !== '-' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Hadir
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {todayAttendance.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data kehadiran hari ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE: LEAVE (PENGAJUAN CUTI)
// ============================================

function LeavePage({ 
  leaveRequests,
  showLeaveForm,
  setShowLeaveForm,
  newLeaveRequest,
  setNewLeaveRequest,
  handleSubmitLeave,
  handleLeaveStatus
}) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengajuan Cuti</h1>
          <p className="text-gray-500 mt-1">Kelola pengajuan cuti karyawan</p>
        </div>
        <button
          onClick={() => setShowLeaveForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Ajukan Cuti</span>
        </button>
      </div>
      
      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Cuti</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="text-indigo-600" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{leave.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.leaveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {leave.startDate} - {leave.endDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={leave.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {leave.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLeaveStatus(leave.id, 'Approved')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleLeaveStatus(leave.id, 'Rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                    {leave.status !== 'Pending' && (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Form Pengajuan Cuti Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ajukan Cuti</h2>
              <button
                onClick={() => setShowLeaveForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Cuti</label>
                <select
                  value={newLeaveRequest.leaveType}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Tahunan">Cuti Tahunan</option>
                  <option value="Sakit">Cuti Sakit</option>
                  <option value="Penting">Cuti Penting</option>
                  <option value="Melahirkan">Cuti Melahirkan</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={newLeaveRequest.startDate}
                    onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                  <input
                    type="date"
                    value={newLeaveRequest.endDate}
                    onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
                <textarea
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Jelaskan alasan pengajuan cuti"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLeaveForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitLeave}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ajukan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPER COMPONENT: STATUS BADGE
// ============================================

function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-orange-100 text-orange-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

export default App;
