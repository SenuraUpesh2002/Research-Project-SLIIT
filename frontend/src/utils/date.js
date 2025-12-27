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

export const formatDuration = (ms) => {
    if (!ms || ms < 0) return '00:00:00';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const diff = new Date(end) - new Date(start);
    return formatDuration(diff);
};
