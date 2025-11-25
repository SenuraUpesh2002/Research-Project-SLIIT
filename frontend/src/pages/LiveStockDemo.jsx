import LiveStockCard from '../components/LiveStockCard';

const LiveStockDemo = () => {
    // Sample data showcasing different states
    const sampleStocks = [
        {
            fuel_type: 'premium_diesel',
            current_level: 8500,
            capacity: 10000,
            percentage: 85,
            last_updated: new Date().toISOString(),
        },
        {
            fuel_type: 'regular_petrol',
            current_level: 3200,
            capacity: 8000,
            percentage: 40,
            last_updated: new Date().toISOString(),
        },
        {
            fuel_type: 'super_unleaded',
            current_level: 950,
            capacity: 6000,
            percentage: 16,
            last_updated: new Date().toISOString(),
        },
        {
            fuel_type: 'electric_charge',
            current_level: 4500,
            capacity: 5000,
            percentage: 90,
            last_updated: new Date().toISOString(),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section - Apple/Tesla Style */}
            <div className="relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

                {/* Sticky Navigation */}
                <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-100/50">
                    <div className="max-w-7xl mx-auto px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-light tracking-tight text-gray-900">
                                Fuel<span className="font-medium">Stock</span>
                            </h1>
                            <div className="flex items-center gap-8">
                                <a href="#" className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
                                <a href="#" className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">Analytics</a>
                                <a href="#" className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">Settings</a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative max-w-7xl mx-auto px-8 pt-24 pb-16">
                    <div className="text-center space-y-6 mb-16">
                        <h2 className="text-6xl font-extralight tracking-tight text-gray-900">
                            Live Stock
                            <span className="block mt-2 font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Monitoring
                            </span>
                        </h2>
                        <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto tracking-wide">
                            Real-time fuel inventory management with premium design and seamless experience
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="max-w-7xl mx-auto px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sampleStocks.map((stock, index) => (
                        <div
                            key={index}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <LiveStockCard stock={stock} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="max-w-7xl mx-auto px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Real-time Updates',
                            description: 'Monitor fuel levels with live data synchronization',
                            icon: '⚡',
                        },
                        {
                            title: 'Smart Alerts',
                            description: 'Receive notifications when stock levels are critical',
                            icon: '🔔',
                        },
                        {
                            title: 'Analytics Dashboard',
                            description: 'Track consumption patterns and optimize inventory',
                            icon: '📊',
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100/50 hover:bg-white/80 transition-all duration-500 hover:shadow-xl"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm font-light text-gray-500 tracking-wide">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100/50 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-8 py-12">
                    <div className="text-center">
                        <p className="text-sm font-light text-gray-400 tracking-wide">
                            © 2025 FuelStock. Designed with precision and care.
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default LiveStockDemo;
