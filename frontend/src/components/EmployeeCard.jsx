const EmployeeCard = ({ checkIn }) => {
    const { full_name, emp_code, role, check_in_time, shift_type, status } = checkIn;

    const getShiftColor = (shift) => {
        switch (shift) {
            case 'morning': return 'bg-orange-100 text-orange-800';
            case 'afternoon': return 'bg-blue-100 text-blue-800';
            case 'evening': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate duration
    const getDuration = (startTime) => {
        const start = new Date(startTime);
        const now = new Date();
        const diff = Math.floor((now - start) / 60000); // minutes
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition">
            <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    {full_name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800">{full_name}</h4>
                    <p className="text-xs text-slate-500">{emp_code} • {role}</p>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="text-right">
                    <p className="text-xs text-slate-500">Check-in</p>
                    <p className="font-medium text-slate-700">{formatTime(check_in_time)}</p>
                </div>

                <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="font-medium text-slate-700">{getDuration(check_in_time)}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getShiftColor(shift_type)}`}>
                    {shift_type}
                </span>

                <div className="flex items-center text-green-600 text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Working
                </div>
            </div>
        </div>
    );
};

export default EmployeeCard;
