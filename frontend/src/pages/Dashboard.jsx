import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LiveStocksTab from '../tabs/LiveStocksTab';
import EmployeeDetailsTab from '../tabs/EmployeeDetailsTab';
import PredictionsTab from '../tabs/PredictionsTab';
import QRCodeDisplay from '../components/QRCodeDisplay';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('stocks');

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Section: QR & Welcome */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
                        <p className="text-slate-600">Welcome back. Here's what's happening at the station today.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                        <QRCodeDisplay />
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('stocks')}
                            className={`${activeTab === 'stocks'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Live Stocks
                        </button>
                        <button
                            onClick={() => setActiveTab('employees')}
                            className={`${activeTab === 'employees'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Employee Details
                        </button>
                        <button
                            onClick={() => setActiveTab('predictions')}
                            className={`${activeTab === 'predictions'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            AI Predictions
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[400px] p-6">
                    {activeTab === 'stocks' && <LiveStocksTab />}
                    {activeTab === 'employees' && <EmployeeDetailsTab />}
                    {activeTab === 'predictions' && <PredictionsTab />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
