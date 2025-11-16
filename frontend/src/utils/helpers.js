// Format: "Nov 16, 2025, 10:31 AM"
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Format: "10:31:45 AM"
  export const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };
  
  // Format: "5m ago", "2h ago", "3d ago"
  export const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  // Calculate hours worked (e.g., 8.5)
  export const calculateHoursWorked = (checkIn, checkOut) => {
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60) * 10) / 10;
  };
  
  // Get status based on fuel level
  export const getStatusFromLevel = (level, capacity) => {
    const percentage = (level / capacity) * 100;
    if (percentage < 10) return 'Critical';
    if (percentage < 20) return 'Low Stock';
    return 'Available';
  };
  
  // Tailwind progress bar color
  export const getProgressColor = (percentage) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Generate short unique ID
  export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  