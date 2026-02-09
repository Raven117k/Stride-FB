import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function AdminDashboard() {
  const [systemMetrics, setSystemMetrics] = useState({
    system: {
      uptime: 0,
      memory: { rss: 0, heapUsed: 0 },
      cpu: { load1: 0, load5: 0, load15: 0, cores: 0 },
      disk: { usagePercent: 0 }
    },
    database: {
      connected: false,
      collections: 0,
      models: 0
    },
    application: {
      activeConnections: 0,
      requestCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
      socketClients: 0
    }
  });

  const [databaseStats, setDatabaseStats] = useState({
    users: 0,
    meals: 0,
    userMeals: 0,
    targets: 0,
    last24h: { users: 0, userMeals: 0 }
  });

  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  // Configuration Constants
  const API_BASE = "http://localhost:5000";

  function getScreenSize() {
    const width = window.innerWidth;
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    return 'xl';
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token for authentication

    const socket = io(API_BASE, {
      auth: {
        token: token // Sending token to satisfy server-side io.use middleware
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"]
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected to port 5000');
      setIsConnected(true);
      setIsLoading(false);
    });

    socket.on('system-metrics', (data) => {
      setSystemMetrics(data);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
    });

    // Initial data fetch
    fetchInitialData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
      // Fetch database statistics
      const statsRes = await fetch(`${API_BASE}/api/admin/dashboard/metrics/database`, { headers });
      const statsData = await statsRes.json();
      setDatabaseStats(statsData);

      // Fetch recent logs
      const logsRes = await fetch(`${API_BASE}/api/admin/dashboard/logs/recent`, { headers });
      const logsData = await logsRes.json();
      setRecentLogs(logsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes;
    return `${mb.toFixed(1)} MB`;
  };

  const getLabel = (label) => {
    switch (screenSize) {
      case 'xs':
        return label.split(' ')[0];
      case 'sm':
        return label;
      default:
        return label;
    }
  };

  const getStatus = (status) => {
    if (screenSize === 'xs') {
      return status
        .replace('Operational', 'OK')
        .replace('Connected', 'OK')
        .replace('Degraded', 'Deg')
        .replace('Error', 'Err');
    }
    return status;
  };

  const getComponentName = (name) => {
    if (screenSize === 'xs') {
      return name
        .replace('MongoDB Database', 'MongoDB')
        .replace('Express API Server', 'Express API')
        .replace('Authentication Service', 'Auth Service')
        .replace('File Storage', 'Storage')
        .replace('User Management API', 'User API')
        .replace('Admin API', 'Admin API');
    }
    if (screenSize === 'sm') {
      return name
        .replace('MongoDB Database', 'MongoDB')
        .replace('Express API Server', 'Express API')
        .replace('Authentication Service', 'Auth Service');
    }
    return name;
  };

  const systemComponents = [
    {
      name: 'MongoDB Database',
      status: systemMetrics.database.connected ? 'Connected ✓' : 'Disconnected ✗',
      endpoint: '/db-test',
      color: systemMetrics.database.connected ? 'primary' : 'danger',
      icon: 'database'
    },
    {
      name: 'Express API Server',
      status: 'Operational ✓',
      endpoint: '/api/health',
      color: 'primary',
      icon: 'dns'
    },
    {
      name: 'WebSocket Server',
      status: isConnected ? 'Connected ✓' : 'Disconnected ✗',
      endpoint: 'ws://localhost:5000',
      color: isConnected ? 'primary' : 'danger',
      icon: 'swap_horiz'
    },
    {
      name: 'File Storage',
      status: `${systemMetrics.system.disk.usagePercent}%`,
      endpoint: '/uploads',
      color: systemMetrics.system.disk.usagePercent > 90 ? 'danger' :
        systemMetrics.system.disk.usagePercent > 70 ? 'warning' : 'primary',
      icon: 'storage'
    },
    {
      name: 'Authentication Service',
      status: 'Operational ✓',
      endpoint: '/api/auth',
      color: 'primary',
      icon: 'lock'
    },
    {
      name: 'Data API',
      status: 'Operational ✓',
      endpoint: '/api/user',
      color: 'primary',
      icon: 'api'
    },
  ];

  const healthMetrics = [
    {
      label: 'Server Uptime',
      value: formatUptime(systemMetrics.system.uptime),
      icon: 'schedule',
      trend: 'stable',
      subtitle: systemMetrics.system.timestamp ? new Date(systemMetrics.system.timestamp).toLocaleTimeString() : ''
    },
    {
      label: 'Memory Usage',
      value: formatBytes(systemMetrics.system.memory.heapUsed),
      icon: 'memory',
      trend: systemMetrics.system.memory.heapUsed > 500 ? 'high' : 'low',
      subtitle: `of ${formatBytes(systemMetrics.system.memory.rss)}`
    },
    {
      label: 'CPU Usage',
      value: `${systemMetrics.system.cpu.usage || 0}%`,
      icon: 'speed',
      trend: systemMetrics.system.cpu.usage > 80 ? 'high' :
        systemMetrics.system.cpu.usage > 50 ? 'medium' : 'low',
      subtitle: `${systemMetrics.system.cpu.cores} cores`
    },
    {
      label: 'Active Connections',
      value: systemMetrics.application.socketClients.toString(),
      icon: 'link',
      trend: systemMetrics.application.socketClients > 50 ? 'high' : 'normal',
      subtitle: `${systemMetrics.application.activeConnections} total`
    },
  ];

  const getMetricsLayout = () => {
    if (screenSize === 'xs') {
      return (
        <div className="space-y-2 mb-6">
          {healthMetrics.map((metric, i) => (
            <div key={i} className="bg-card p-3 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-sm">
                    {metric.icon}
                  </span>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      {getLabel(metric.label)}
                    </p>
                    <h3 className="text-base font-bold text-white">{metric.value}</h3>
                    {metric.subtitle && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{metric.subtitle}</p>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full ${metric.trend === 'high' ? 'bg-primary/20 text-primary' :
                    metric.trend === 'medium' ? 'bg-primary/20 text-primary' :
                      'bg-primary/20 text-primary'
                  }`}>
                  {metric.trend.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (screenSize === 'sm') {
      return (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {healthMetrics.map((metric, i) => (
            <div key={i} className="bg-card p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-gray-400 text-base">
                  {metric.icon}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${metric.trend === 'high' ? 'bg-primary/20 text-primary' :
                    metric.trend === 'medium' ? 'bg-primary/20 text-primary' :
                      'bg-primary/20 text-primary'
                  }`}>
                  {metric.trend}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                {metric.label}
              </p>
              <h3 className="text-xl font-bold text-white">{metric.value}</h3>
              {metric.subtitle && (
                <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {healthMetrics.map((metric, i) => (
          <div key={i} className="bg-card p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-gray-400">
                {metric.icon}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${metric.trend === 'high' ? 'bg-primary/20 text-primary' :
                  metric.trend === 'medium' ? 'bg-primary/20 text-primary' :
                    'bg-primary/20 text-primary'
                }`}>
                {metric.trend}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
              {metric.label}
            </p>
            <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
            {metric.subtitle && (
              <p className="text-xs text-gray-400 mt-2">{metric.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const uptimeData = [
    { day: 'Mon', uptime: 100, status: 'operational' },
    { day: 'Tue', uptime: 99.9, status: 'operational' },
    { day: 'Wed', uptime: 100, status: 'operational' },
    { day: 'Thu', uptime: systemMetrics.database.connected ? 99.8 : 95, status: systemMetrics.database.connected ? 'operational' : 'degraded' },
    { day: 'Fri', uptime: 100, status: 'operational' },
    { day: 'Sat', uptime: 100, status: 'operational' },
    { day: 'Sun', uptime: 100, status: 'operational' },
  ];

  const getLogBadgeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-primary/20 text-primary';
      case 'success': return 'bg-success/20 text-success';
      case 'warning':
      case 'error':
      case 'danger': return 'bg-danger/20 text-danger';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const getLogDotColor = (type) => {
    switch (type) {
      case 'info': return 'bg-primary';
      case 'success': return 'bg-success';
      case 'warning':
      case 'error':
      case 'danger': return 'bg-danger';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="bg-dark-bg min-h-screen px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <main className="flex flex-col w-full max-w-[1920px] mx-auto">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col gap-1 mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
              System Health Dashboard
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              Real-time infrastructure monitoring
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-danger'}`}></div>
              <span className="text-xs text-gray-400">
                {isConnected ? 'Live Connection Active' : 'Connection Lost'}
              </span>
            </div>
            <div className="text-xs text-gray-500 sm:ml-auto">
              Updated: {systemMetrics.system.timestamp ?
                new Date(systemMetrics.system.timestamp).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                }) : 'Loading...'}
            </div>
          </div>
        </div>

        {getMetricsLayout()}

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
          <div className="xl:flex-1 bg-card rounded-xl md:rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4 md:mb-6">
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-white">System Components</h3>
              <div className="text-xs text-gray-500">
                {isLoading ? 'Connecting...' : 'Live Updates Active'}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {systemComponents.map((component, i) => (
                <div key={i} className={`flex items-center justify-between p-2 sm:p-3 md:p-4 ${screenSize === 'xs' ? 'rounded-lg' : 'rounded-xl'} bg-white/5 hover:bg-white/10 transition-all`}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${component.color === 'primary' ? 'bg-primary' : component.color === 'danger' ? 'bg-danger' : 'bg-warning'}`}></div>
                      {screenSize !== 'xs' && <span className="material-symbols-outlined text-gray-400 text-sm md:text-base hidden sm:block">{component.icon}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm md:text-base font-medium text-white truncate">{getComponentName(component.name)}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 truncate">{component.endpoint}</div>
                    </div>
                  </div>
                  <div className={`text-xs sm:text-sm md:text-base font-medium ml-2 sm:ml-4 flex-shrink-0 ${component.color === 'primary' ? 'text-primary' : component.color === 'danger' ? 'text-danger' : 'text-warning'}`}>
                    {getStatus(component.status)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-bold text-white mb-3">Database Statistics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Total Users</div>
                  <div className="text-lg font-bold text-white">{databaseStats.users}</div>
                  <div className="text-[10px] text-primary mt-1">+{databaseStats.last24h.users} today</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Total Meals</div>
                  <div className="text-lg font-bold text-white">{databaseStats.meals}</div>
                  <div className="text-[10px] text-gray-400 mt-1">in database</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">User Meals</div>
                  <div className="text-lg font-bold text-white">{databaseStats.userMeals}</div>
                  <div className="text-[10px] text-primary mt-1">+{databaseStats.last24h.userMeals} today</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Targets</div>
                  <div className="text-lg font-bold text-white">{databaseStats.targets}</div>
                  <div className="text-[10px] text-gray-400 mt-1">user goals</div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:w-[400px] bg-card rounded-xl md:rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5 lg:p-6">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-white mb-3 sm:mb-4 md:mb-6">
              {screenSize === 'xs' ? 'Uptime 7D' : screenSize === 'sm' ? 'System Uptime' : 'System Uptime (7 Days)'}
            </h3>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 mb-4 sm:mb-6 md:mb-8">
              {uptimeData.map((day, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div className={`${screenSize === 'xs' ? 'w-6' : screenSize === 'sm' ? 'w-8' : 'w-10'} text-xs sm:text-sm text-gray-400`}>
                    {screenSize === 'xs' ? day.day.charAt(0) : day.day}
                  </div>
                  <div className="flex-1">
                    <div className={`${screenSize === 'xs' ? 'h-1.5 mb-0.5' : screenSize === 'sm' ? 'h-2 mb-1' : 'h-2.5 mb-1'} bg-white/5 rounded-full overflow-hidden`}>
                      <div className={`h-full rounded-full ${day.status === 'operational' ? 'bg-primary' : day.status === 'degraded' ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${day.uptime}%` }}></div>
                    </div>
                  </div>
                  {screenSize !== 'xs' && (
                    <div className={`${screenSize === 'sm' ? 'text-xs' : 'text-sm'} font-medium w-10 sm:w-12 text-right ${day.status === 'operational' ? 'text-primary' : day.status === 'degraded' ? 'text-warning' : 'text-danger'}`}>
                      {day.uptime}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="pt-3 sm:pt-4 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Current Uptime</div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{systemMetrics.database.connected ? '99.97%' : '95.2%'}</div>
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${systemMetrics.database.connected ? 'text-primary' : 'text-warning'}`}>{systemMetrics.database.connected ? '+0.02% from last week' : 'Degraded performance'}</div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Avg Response Time</div>
                    <div className="text-lg sm:text-xl font-bold text-white">{systemMetrics.application.avgResponseTime}ms</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">Requests</div>
                    <div className="text-lg sm:text-xl font-bold text-white">{systemMetrics.application.requestCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl md:rounded-2xl border border-white/10 p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4 md:mb-6">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-white">{screenSize === 'xs' ? 'Recent Logs' : 'Live System Activity'}</h3>
            <button onClick={fetchInitialData} className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">refresh</span>
              {screenSize === 'xs' ? 'Refresh' : 'Refresh Logs'}
            </button>
          </div>

          {screenSize === 'xs' ? (
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${getLogDotColor(log.type)}`}></div>
                      <span className="text-xs font-medium text-white">{log.service}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{log.time}</span>
                  </div>
                  <div className="text-xs text-gray-300 mb-2">{log.message}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${getLogBadgeColor(log.type)}`}>{log.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Service</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Message</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-sm text-gray-400">{log.time}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getLogDotColor(log.type)}`}></div>
                          <span className="text-sm font-medium text-white">{log.service}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{log.message}</td>
                      <td className="py-3 px-4"><span className={`text-sm px-2 py-1 rounded-full ${getLogBadgeColor(log.type)}`}>{log.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-danger'}`}></div>
              {isConnected ? 'Live WebSocket connection active' : 'Connection lost - attempting reconnect'}
            </div>
            <button onClick={() => socketRef.current?.emit('request-update')} className="text-sm text-primary hover:text-primary/80 font-medium hidden sm:block">Request Update →</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;