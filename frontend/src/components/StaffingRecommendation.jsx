const StaffingRecommendation = ({ recommendation }) => {
    const { recommended_staff, confidence, shift, predicted_demand } = recommendation;

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold opacity-90">AI Staffing Recommendation</h3>
                    <p className="text-indigo-100 text-sm">Optimized for {shift} shift</p>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {confidence} Confidence
                </div>
            </div>

            <div className="flex items-end space-x-2 mb-6">
                <span className="text-5xl font-bold">{recommended_staff}</span>
                <span className="text-xl opacity-80 mb-2">Employees</span>
            </div>

            <div className="space-y-3">
                <div className="bg-white bg-opacity-10 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm opacity-80">Predicted Demand</span>
                    <span className="font-semibold">{predicted_demand} Liters</span>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm opacity-80">Est. Wait Time</span>
                    <span className="font-semibold">~4 mins</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white border-opacity-20 text-xs text-center opacity-70">
                Based on historical data, weather, and traffic patterns.
            </div>
        </div>
    );
};

export default StaffingRecommendation;
