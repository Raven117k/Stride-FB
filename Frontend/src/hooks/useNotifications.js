import { useEffect, useState, useCallback } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await notificationService.fetchNotifications(token);
      setNotifications(data);
      updateUnreadCount(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update unread count
  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.isRead).length;
    setUnreadCount(count);
  };

  // Mark as read
  const markAsRead = useCallback(async (id) => {
    if (!token) return;
    try {
      const updated = await notificationService.markAsRead(id, token);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      updateUnreadCount(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [token, notifications]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    try {
      await notificationService.markAllAsRead(token);
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [token, notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id) => {
    if (!token) return;
    try {
      await notificationService.deleteNotification(id, token);
      const updated = notifications.filter(n => n._id !== id);
      setNotifications(updated);
      updateUnreadCount(updated);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [token, notifications]);

  // Initialize socket and fetch notifications
  useEffect(() => {
    if (!token) return;

    fetchNotifications();
    notificationService.initializeSocket(token);

    // Subscribe to real-time updates
    const unsubscribe = notificationService.subscribe((event) => {
      switch (event.type) {
        case 'new':
          // Add new notification to the top
          setNotifications(prev => [event.notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          break;
        
        case 'read':
          // Update notification read status
          setNotifications(prev =>
            prev.map(n => n._id === event.notification._id 
              ? { ...n, isRead: true } 
              : n
            )
          );
          updateUnreadCount(notifications.map(n => n._id === event.notification._id 
            ? { ...n, isRead: true } 
            : n
          ));
          break;
        
        case 'connected':
          setConnected(true);
          break;
        
        case 'disconnected':
          setConnected(false);
          break;
        
        default:
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [token, fetchNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  };
};

export default useNotifications;
