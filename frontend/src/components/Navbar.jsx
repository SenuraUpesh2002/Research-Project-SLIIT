'use client';

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Smartphone, UserPlus } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            {/* Floating Glass Nav Bar */}
            <div className="backdrop-blur-2xl bg-white/70 border-b border-white/50 shadow-xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo – Elegant & Minimal */}
                        <Link to="/" className="group flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-lg">F</span>
                            </div>
                            <span className="text-2xl font-light tracking-tight text-[#1D1D1F] group-hover:text-black transition-colors duration-300">
                                FuelWatch Admin
                            </span>
                        </Link>

                        {/* Right Side – Clean, Floating Actions */}
                        <div className="flex items-center space-x-8">
                            {user ? (
                                <>
                                    {/* Secondary Links – Subtle & Premium */}
                                    <div className="hidden md:flex items-center space-x-8 text-sm">
                                        <Link
                                            to="/mobile-checkin"
                                            className="flex items-center gap-2 text-[#515154] hover:text-[#1D1D1F] transition-colors duration-300 font-medium"
                                        >
                                            <Smartphone className="w-4 h-4" />
                                            Mobile Check-In
                                        </Link>
                                        <Link
                                            to="/register-employee"
                                            className="flex items-center gap-2 text-[#515154] hover:text-[#1D1D1F] transition-colors duration-300 font-medium"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Register Employee
                                        </Link>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-8 w-px bg-gray-200/60 hidden md:block" />

                                    {/* User Greeting */}
                                    <div className="hidden md:flex items-center gap-3">
                                        <span className="text-sm font-medium text-[#515154]">
                                            Welcome,
                                        </span>
                                        <span className="text-sm font-semibold text-[#1D1D1F] bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                                            {user.name}
                                        </span>
                                    </div>

                                    {/* Logout Button – Glossy Black Pill */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        className="group relative overflow-hidden rounded-full bg-black px-6 py-3 shadow-xl transition-all duration-300 hover:shadow-2xl"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-white font-medium text-sm">
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </span>
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    </motion.button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-[#1D1D1F] hover:text-black font-medium transition-colors duration-300"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle bottom glow when scrolled */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
        </motion.nav>
    );
};

export default Navbar;