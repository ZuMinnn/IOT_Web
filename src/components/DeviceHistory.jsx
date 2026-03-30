import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Activity, Fan, Wind, Lightbulb, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3001/api/device-actions';

export const DeviceHistory = () => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters & Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedDevice, setSelectedDevice] = useState('all');
    const [selectedAction, setSelectedAction] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: itemsPerPage,
                });
                
                if (selectedDevice !== 'all') params.append('deviceName', selectedDevice);
                if (selectedAction !== 'all') params.append('action', selectedAction);
                if (searchTerm) params.append('keyword', searchTerm);

                const res = await fetch(`${API_URL}?${params}`);
                const json = await res.json();
                
                if (json.data) {
                    setData(json.data);
                    setTotalRecords(json.total);
                    setTotalPages(json.totalPages);
                }
            } catch (err) {
                console.error("Failed to fetch device history", err);
            }
        };

        // Debounce fetching slightly if typing
        const t = setTimeout(fetchData, 300);
        return () => clearTimeout(t);
    }, [currentPage, itemsPerPage, selectedDevice, selectedAction, searchTerm]);

    const getDeviceDetails = (deviceName) => {
        switch (deviceName) {
            case 'fan': return { label: 'Quạt', icon: Fan, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
            case 'airConditioner': return { label: 'Điều hòa', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' };
            case 'light': return { label: 'Đèn', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
            default: return { label: deviceName, icon: Activity, color: 'text-white', bg: 'bg-white/10' };
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deviceTabs = [
        { id: 'all', label: 'Tất cả', icon: Activity, color: 'text-white' },
        { id: 'fan', label: 'Quạt', icon: Fan, color: 'text-cyan-400' },
        { id: 'airConditioner', label: 'Điều hòa', icon: Wind, color: 'text-blue-400' },
        { id: 'light', label: 'Đèn', icon: Lightbulb, color: 'text-yellow-400' },
    ];

    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md"
            >
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Activity className="text-purple-400" />
                        Lịch Sử Hoạt Động
                    </h2>
                    <p className="text-white/50 text-xs mt-1">Ghi lại trạng thái lệnh từ DB</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto items-end">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Thiết bị</span>
                        <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                            {deviceTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setSelectedDevice(tab.id); setCurrentPage(1); }}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedDevice === tab.id
                                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon size={14} className={selectedDevice === tab.id ? tab.color : ''} />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 flex-1 min-w-[300px]">
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Hành động</span>
                            <select 
                                value={selectedAction} 
                                onChange={e => { setSelectedAction(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="all" className="bg-slate-900 text-white">Tất cả</option>
                                <option value="ON_success" className="bg-slate-900 text-green-400">Bật thành công</option>
                                <option value="OFF_success" className="bg-slate-900 text-green-400">Tắt thành công</option>
                                <option value="error" className="bg-slate-900 text-red-400">Tất cả lỗi</option>
                                <option value="ON_failed" className="bg-slate-900 text-red-400">Lỗi Bật</option>
                                <option value="OFF_failed" className="bg-slate-900 text-red-400">Lỗi Tắt</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Tìm kiếm (#ID, Lệnh, Thời gian)</span>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                <input
                                    type="text"
                                    placeholder="Ví dụ: #123, ON, 14:39:33 30/3..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-8 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-white/20 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-md relative"
            >
                <div className="min-w-[500px]">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-xl z-10 font-medium text-sm text-white/70 select-none">
                        <div className="col-span-2">ID</div>
                        <div className="col-span-3">Thiết Bị</div>
                        <div className="col-span-3">Hành Động</div>
                        <div className="col-span-4">Thời Gian</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {data.length > 0 ? (
                            data.map((item) => {
                                const dsName = item.device ? item.device.name : 'unknown';
                                const details = getDeviceDetails(dsName);
                                const timeStr = new Date(item.date).toLocaleString('vi-VN');
                                return (
                                    <motion.div
                                        key={item.ID}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors text-sm text-white/80 items-center"
                                    >
                                        <div className="col-span-2 font-mono text-xs text-white/40">#{item.ID}</div>

                                        <div className="col-span-3 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${details.bg} ${details.color}`}>
                                                <details.icon size={14} />
                                            </div>
                                            <span className="font-medium">{details.label}</span>
                                        </div>

                                        <div className="col-span-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                                                item.status === 'pending'
                                                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                                    : item.status === 'failed'
                                                        ? 'bg-red-600/30 text-red-500 border border-red-600/50'
                                                        : item.action === 'ON'
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                            : 'bg-white/10 text-white/50 border border-white/20'
                                                }`}>
                                                {item.status === 'pending'
                                                    ? `ĐANG CHỜ ${item.action === 'ON' ? 'BẬT' : 'TẮT'}`
                                                    : item.status === 'failed'
                                                        ? `LỖI ${item.action === 'ON' ? 'BẬT' : 'TẮT'}`
                                                        : item.action === 'ON'
                                                            ? 'ĐÃ BẬT'
                                                            : 'ĐÃ TẮT'}
                                            </span>
                                        </div>

                                        <div className="col-span-4 font-mono text-white/60">{timeStr}</div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-white/30">Chưa có dữ liệu hoạt động</div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <div className="text-xs text-white/40">
                        Tổng cộng: {totalRecords} bản ghi
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">Hiển thị:</span>
                        <div className="flex bg-black/20 p-0.5 rounded-lg border border-white/10">
                            {[8, 10, 20].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                        itemsPerPage === n
                                            ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500/40 shadow-sm'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center px-4 bg-white/5 rounded-lg text-xs font-mono">
                        {currentPage} / {totalPages || 1}
                    </div>
                    <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
