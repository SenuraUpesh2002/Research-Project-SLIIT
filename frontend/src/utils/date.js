export const formatDate = (date, options = {}) => {
    if (!date) return '';
    const d = new Date(date);
    const defaultOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return d.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatTime = (date, options = {}) => {
    if (!date) return '';
    const d = new Date(date);
    const defaultOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return d.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
};

export const getDayLabel = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};
