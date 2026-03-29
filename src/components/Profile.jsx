import React from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Code, Github, ExternalLink, Calendar, CreditCard, Award, Figma } from 'lucide-react';
import profileImg from '../assets/IMG_3841.jpg';

export const Profile = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto space-y-8 pb-10"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Award size={200} />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            {/* Avatar Placeholder / Visual */}
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[2px] shadow-2xl shadow-cyan-500/20">
                                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                                    <img src={profileImg} alt="Trần Minh Vũ" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-center md:text-left flex-1">
                                <motion.h1
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-2"
                                >
                                    Trần Minh Vũ
                                </motion.h1>
                                <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center md:justify-start text-indigo-200/80 mt-4">
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <CreditCard size={16} className="text-cyan-400" />
                                        <span className="font-mono tracking-wider">B22DCPT311</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <Calendar size={16} className="text-purple-400" />
                                        <span className="font-mono">28-12-2004</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Links & Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* GitHub Card */}
                    <motion.a
                        variants={itemVariants}
                        href="https://github.com/ZuMinnn/IOT_Web"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                        <div className="relative flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-black/20 text-white">
                                    <Github size={24} />
                                </div>
                                <ExternalLink size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">GitHub Repository</h3>
                                <p className="text-sm text-indigo-200/60 group-hover:text-indigo-200 transition-colors">
                                    Mã nguồn dự án trên GitHub.
                                </p>
                            </div>
                        </div>
                    </motion.a>

                    {/* Report Card (PDF Link) */}
                    <motion.a
                        variants={itemVariants}
                        href="/IOT4.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                        <div className="relative flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                                    <FileText size={24} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-white/40 border border-white/5 group-hover:text-cyan-400 transition-colors">
                                        MỞ PDF
                                    </span>
                                    <ExternalLink size={16} className="text-white/40 group-hover:text-white/80 transition-colors ml-1" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Báo Cáo PDF</h3>
                                <p className="text-sm text-cyan-100/60 group-hover:text-cyan-100 transition-colors">
                                    Tài liệu báo cáo dự án.
                                </p>
                            </div>
                        </div>
                    </motion.a>

                    {/* API Doc Card (Postman Placeholder) */}
                    <motion.a
                        variants={itemVariants}
                        href="https://documenter.getpostman.com/view/53404217/2sBXijJrJF"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                        <div className="relative flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                                    <Code size={24} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-white/40 border border-white/5 group-hover:text-amber-400 transition-colors">
                                        POSTMAN
                                    </span>
                                    <ExternalLink size={16} className="text-white/40 group-hover:text-white/80 transition-colors ml-1" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Postman API</h3>
                                <p className="text-sm text-amber-100/60 group-hover:text-amber-100 transition-colors">
                                    Tài liệu thử nghiệm các API Endpoints.
                                </p>
                            </div>
                        </div>
                    </motion.a>

                    {/* Figma Card */}
                    <motion.a
                        variants={itemVariants}
                        href="https://www.figma.com/design/WCuaWBU7SPLLztuzx8GeaD/IoT_Web?node-id=0-1&t=Z7geoGjdh5cpKHzp-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                        <div className="relative flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400">
                                    <Figma size={24} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-white/40 border border-white/5 group-hover:text-pink-400 transition-colors">
                                        FIGMA
                                    </span>
                                    <ExternalLink size={16} className="text-white/40 group-hover:text-white/80 transition-colors ml-1" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Figma</h3>
                                <p className="text-sm text-pink-100/60 group-hover:text-pink-100 transition-colors">
                                    Tài liệu thiết kế giao diện.
                                </p>
                            </div>
                        </div>
                    </motion.a>
                </div>

                {/* API Stats / Preview Section (Optional filler for "API Doc" content) */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
                    <div className="p-6 rounded-3xl bg-[#0f172a]/50 border border-white/10 space-y-4">
                        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
                            <Code size={18} className="text-cyan-400" />
                            API Endpoints Overview
                        </h3>
                        <div className="space-y-2">
                            {[
                                { method: 'GET', path: '/api/sensors/latest', desc: 'Get latest sensor readings' },
                                { method: 'GET', path: '/api/sensors/history', desc: 'Retrieve historical sensor data' },
                                { method: 'GET', path: '/api/device/status', desc: 'Get current state of devices' },
                                { method: 'POST', path: '/api/device/control', desc: 'Toggle a device state' },
                                { method: 'GET', path: '/api/device-actions', desc: 'Retrieve device action history' },
                            ].map((api, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors group">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {api.method}
                                    </span>
                                    <code className="text-sm text-white/70 font-mono flex-1">{api.path}</code>
                                    <span className="text-xs text-white/40 hidden md:block">{api.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
