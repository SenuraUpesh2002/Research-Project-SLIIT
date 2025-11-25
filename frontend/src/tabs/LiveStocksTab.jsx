import { useState, useEffect } from 'react';
import axios from 'axios';
import LiveStockCard from '../components/LiveStockCard';

const LiveStocksTab = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStocks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/fuel/stocks', {
                headers: { 'x-auth-token': token }
            });
            setStocks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load fuel stocks');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        // Poll every 30 seconds
        const interval = setInterval(fetchStocks, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-center py-10 text-slate-500">Loading fuel data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Live Fuel Stocks</h2>
                    <p className="text-sm text-slate-500">Real-time monitoring of station fuel levels.</p>
                </div>
                <button
                    onClick={fetchStocks}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Refresh Now
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stocks.map((stock) => (
                    <LiveStockCard key={stock.id} stock={stock} />
                ))}
            </div>
        </div>
    );
};

export default LiveStocksTab;
