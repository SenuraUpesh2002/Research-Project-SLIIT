import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Lock, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const EmployeeRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'attendant',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData, device_id: 'browser-' + Date.now() };

            await axios.post('http://localhost:3001/api/auth/register', payload, {
                headers: { 'x-auth-token': token }
            });

            setMessage('Employee registered successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'attendant',
                password: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5 ml-1";
    const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400";

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
                            Add New Team Member
                        </h1>
                        <p className="text-lg text-gray-500">
                            Create an account for a new employee to access the dashboard
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8 sm:p-10">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-green-100"
                                >
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{message}</span>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-red-100"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className={labelClasses}>Full Name</label>
                                    <div className="relative">
                                        <User className={iconClasses} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Email Address</label>
                                        <div className="relative">
                                            <Mail className={iconClasses} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Phone Number</label>
                                        <div className="relative">
                                            <Phone className={iconClasses} />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="+94 77 123 4567"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClasses}>Role Assignment</label>
                                        <div className="relative">
                                            <Briefcase className={iconClasses} />
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className={`${inputClasses} appearance-none cursor-pointer`}
                                            >
                                                <option value="attendant">Station Attendant</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Initial Password</label>
                                        <div className="relative">
                                            <Lock className={iconClasses} />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                <span>Register Employee</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmployeeRegistration;
