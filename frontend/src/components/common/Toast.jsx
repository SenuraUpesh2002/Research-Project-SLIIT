import { X } from 'lucide-react';

export const Toast = ({ notification, onDismiss }) => {
  const bgColors = {
    employee: 'bg-blue-500',
    stock: 'bg-orange-500',
    prediction: 'bg-purple-500',
    system: 'bg-gray-500',
  };

  const bgColor = bgColors[notification.type] || 'bg-gray-500';

  return (
    <div
      className={`${bgColor} text-white rounded-lg shadow-lg p-4 mb-2 flex items-start gap-3 animate-slide-in`}
    >
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
        <p className="text-xs opacity-75 mt-1">
          {notification.timestamp.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Colombo',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};