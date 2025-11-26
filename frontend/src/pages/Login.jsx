'use client';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Lock, Mail, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password,
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Success animation then redirect
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
            {/* Floating Glass Orb Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ repeat: Infinity, duration: 20 }}
                    className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1.3, 1.1],
                        rotate: [0, -120, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{ repeat: Infinity, duration: 25 }}
                    className="absolute -bottom-60 -right-60 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl"
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="p-12 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center shadow-2xl"
                        >
                            <Fuel className="w-14 h-14 text-white" />
                        </motion.div>
                        <h1 className="text-5xl font-light tracking-tight text-[#1D1D1F] mb-3">
                            FuelWatch Admin
                        </h1>
                        <p className="text-lg text-[#515154] font-light">
                            Next-generation fuel station intelligence
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-12 pb-12">
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-rose-600 text-center mb-6 font-medium bg-rose-50/80 backdrop-blur-xl py-3 rounded-2xl border border-rose-200"
                            >
                                {error}
                            </motion.p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868B]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@fuelwatch.com"
                                    className="w-full pl-16 pr-6 py-5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 text-lg focus:outline-none focus:ring-4 focus:ring-black/10 transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#86868B]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-16 pr-6 py-5 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 text-lg focus:outline-none focus:ring-4 focus:ring-black/10 transition-all"
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full overflow-hidden bg-black text-white py-6 rounded-2xl font-medium text-lg shadow-2xl transition-all hover:shadow-3xl disabled:opacity-70"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <LogIn className="w-6 h-6" />
                                            Sign In
                                        </>
                                    )}
                                </span>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <div className="mt-10 text-center">
                            <p className="text-sm text-[#86868B] font-light">
                                Secure access • End-to-end encrypted • 2025
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Glow */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent blur-3xl -z-10" />
            </motion.div>
        </div>
    );
};

export default Login;