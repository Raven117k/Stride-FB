import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api/notifications';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = [];
  }

  // Initialize socket connection with auth
  initializeSocket(token) {
    if (this.socket) return this.socket;

    this.socket = io('http://localhost:5000', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('new_notification', (notification) => {
      this.notifyListeners({ type: 'new', notification });
    });

    this.socket.on('notification_read', (notification) => {
      this.notifyListeners({ type: 'read', notification });
    });

    this.socket.on('connect', () => {
      console.log('Socket connected for notifications');
      this.notifyListeners({ type: 'connected' });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.notifyListeners({ type: 'disconnected' });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.notifyListeners({ type: 'error', error });
    });

    return this.socket;
  }

  // Fetch notifications from API
  async fetchNotifications(token) {
    try {
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(id, token) {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (this.socket) {
        this.socket.emit('mark_notification_read', { notificationId: id });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(token) {
    try {
      const response = await axios.put(`${API_BASE}/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(id, token) {
    try {
      const response = await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Subscribe to notification events
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event));
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new NotificationService();
