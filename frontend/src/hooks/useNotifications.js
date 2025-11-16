// src/hooks/useNotifications.js
import { useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import { NOTIFICATION_DISMISS_TIME } from '../utils/constants';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new notification
   * @param {string} type - 'employee' | 'stock' | 'prediction' | 'system'
   * @param {string} message - Notification text
   * @param {string} icon - Lucide icon name
   * @param {boolean} showToast - Whether to show toast popup
   */
  const addNotification = useCallback((type, message, icon, showToast = false) => {
    const notification = {
      id: generateId(),
      type,
      message,
      timestamp: new Date(), // LK time: +0530
      read: false,
      icon,
    };

    // Add to main list (unread by default)
    setNotifications(prev => [notification, ...prev]);

    // Show toast if requested
    if (showToast) {
      setToasts(prev => [...prev, notification]);

      // Auto-dismiss toast after NOTIFICATION_DISMISS_TIME
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== notification.id));
      }, NOTIFICATION_DISMISS_TIME);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Manually dismiss a toast
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    toasts,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissToast,
  };
};