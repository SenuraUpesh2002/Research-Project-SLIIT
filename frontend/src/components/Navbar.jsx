import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-400">
                            FuelWatch Admin
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/mobile-checkin" className="text-gray-300 hover:text-white text-sm">
                                    📱 Mobile Check-In
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link to="/register-employee" className="text-gray-300 hover:text-white text-sm">
                                    Register Employee
                                </Link>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-300">Welcome, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-300 hover:text-white">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
