import { useState } from 'react';
import { Bell, BarChart3, ClipboardList, Home, LogOut, Map, Medal, PlusCircle } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../hooks/useSocket.js';
import IssueDetailModal from '../components/IssueDetailModal.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import UserDetailModal from '../components/UserDetailModal.jsx';

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
      <Icon size={18} />
      <span>{children}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data
  });

  useSocket(() => queryClient.invalidateQueries({ queryKey: ['notifications'] }));

  const unread = notifications.data?.filter((item) => !item.read).length || 0;
  const isAdmin = user.role === 'admin';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">CC</div>
          <div>
            <p className="brand-name">Civic Connect</p>
            <p className="brand-subtitle">Municipal Service Portal</p>
          </div>
        </div>

        <nav className="nav-list">
          <NavItem to={isAdmin ? '/admin' : '/citizen'} icon={Home}>Dashboard</NavItem>
          {isAdmin ? (
            <>
              <NavItem to="/admin/issues" icon={ClipboardList}>Issue Management</NavItem>
              <NavItem to="/map" icon={Map}>Map Monitoring</NavItem>
              <NavItem to="/admin/analytics" icon={BarChart3}>Analytics</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/citizen/report" icon={PlusCircle}>Report Issue</NavItem>
              <NavItem to="/map" icon={Map}>Issue Map</NavItem>
              <NavItem to="/leaderboard" icon={Medal}>Leaderboard</NavItem>
            </>
          )}
        </nav>

        <button className="logout-button" onClick={logout} type="button">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">{user.role === 'admin' ? 'Admin Workspace' : 'Citizen Workspace'}</p>
            <h1>Civic Connect</h1>
          </div>
          <div className="topbar-actions">
            <button className="notification-button" type="button" title="Notifications" onClick={() => setShowNotifications((value) => !value)}>
              <Bell size={19} />
              {unread > 0 && <span>{unread}</span>}
            </button>
            <button className="user-chip" type="button" onClick={() => setSelectedUser(user)}>{user.name}</button>
          </div>
        </header>
        <NotificationPanel
          open={showNotifications}
          notifications={notifications.data || []}
          onOpenIssue={(id) => {
            setSelectedIssueId(id);
            setShowNotifications(false);
          }}
        />
        <Outlet context={{ openIssue: setSelectedIssueId, openUser: setSelectedUser }} />
      </main>
      <IssueDetailModal issueId={selectedIssueId} onClose={() => setSelectedIssueId(null)} onOpenUser={setSelectedUser} />
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
