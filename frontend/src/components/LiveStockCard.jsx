const LiveStockCard = ({ stock }) => {
    const { fuel_type, current_level, capacity, percentage, last_updated } = stock;

    // Determine color based on percentage
    let colorClass = 'bg-green-500';
    let textColorClass = 'text-green-600';
    let borderColorClass = 'border-green-200';

    if (percentage < 20) {
        colorClass = 'bg-red-500';
        textColorClass = 'text-red-600';
        borderColorClass = 'border-red-200';
    } else if (percentage < 50) {
        colorClass = 'bg-yellow-500';
        textColorClass = 'text-yellow-600';
        borderColorClass = 'border-yellow-200';
    }

    const formatFuelType = (type) => {
        return type.replace('_', ' ').toUpperCase();
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border ${borderColorClass} p-5 transition hover:shadow-md`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">{formatFuelType(fuel_type)}</h3>
                    <p className="text-xs text-slate-500">Capacity: {capacity}L</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold bg-opacity-10 ${textColorClass.replace('text-', 'bg-')} ${textColorClass}`}>
                    {percentage}%
                </div>
            </div>

            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block text-slate-600">
                            {current_level}L Available
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                    <div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${colorClass} transition-all duration-500`}
                    ></div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400">
                    Updated: {new Date(last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {percentage < 20 && (
                    <span className="flex items-center text-xs font-bold text-red-500 animate-pulse">
                        ⚠️ Low Stock
                    </span>
                )}
            </div>
        </div>
    );
};

export default LiveStockCard;
