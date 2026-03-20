import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Activity, Droplets, Sun, ArrowUpDown, ArrowUp, ArrowDown, Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const SensorHistory = ({ history }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [selectedSensor, setSelectedSensor] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Handle Sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    // Process Data (Filter -> Sort -> Paginate)
    const processedHistory = useMemo(() => {
        let data = [...history];

        // 1. Filter by Time Range
        // Note: Sensor "filtering" is visual (hiding columns), not row filtering, as requested.
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.temperature?.toString().includes(lowerTerm) ||
                item.humidity?.toString().includes(lowerTerm) ||
                item.light?.toString().includes(lowerTerm) ||
                item.id?.toString().includes(lowerTerm)
            );
        }

        // 1. Filter by Time Range
        // Note: Sensor "filtering" is visual (hiding columns), not row filtering, as requested.
        if (startDate || endDate) {
            data = data.filter((item) => {
                const itemTime = item.timestamp;
                if (!itemTime) return true;

                let isValid = true;
                if (startDate) {
                    isValid = isValid && itemTime >= new Date(startDate);
                }
                if (endDate) {
                    isValid = isValid && itemTime <= new Date(endDate);
                }
                return isValid;
            });
        }

        // 2. Sort
        data.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'time') {
                aValue = a.timestamp;
                bValue = b.timestamp;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return data;
    }, [history, startDate, endDate, sortConfig, searchTerm]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedHistory.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Sensor Tabs Configuration
    const sensorTabs = [
        { id: 'all', label: 'Tất cả', icon: Activity, color: 'text-white' },
        { id: 'temperature', label: 'Nhiệt độ', icon: Sun, color: 'text-orange-400' },
        { id: 'humidity', label: 'Độ ẩm', icon: Droplets, color: 'text-cyan-400' },
        { id: 'light', label: 'Ánh sáng', icon: Sun, color: 'text-yellow-400' },
    ];

    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            {/* Header & Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md"
            >
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Activity className="text-cyan-400" />
                        Lịch Sử Cảm Biến
                    </h2>
                    <p className="text-white/50 text-xs mt-1">Theo dõi biến động môi trường</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto items-end">
                    {/* Sensor Tabs */}
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Loại Cảm Biến</span>
                        <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                            {sensorTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedSensor(tab.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedSensor === tab.id
                                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon size={14} className={selectedSensor === tab.id ? tab.color : ''} />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Range Filters */}
                    <div className="flex gap-2 flex-1 min-w-[300px]">
                        <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Theo ngày</span>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                    step="1"
                                    className="w-full pl-3 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Tìm kiếm</span>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                <input
                                    type="text"
                                    placeholder="Giá trị..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        {/* <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Đến ngày</span>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                    step="1"
                                    className="w-full pl-3 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            </motion.div>

            {/* Data Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-md relative"
            >
                <div className="min-w-[700px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-xl z-10 font-medium text-sm text-white/70 select-none">

                        {/* ID Column */}
                        <div
                            onClick={() => handleSort('id')}
                            className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                        >
                            ID {getSortIcon('id')}
                        </div>

                        {/* Time Column */}
                        <div
                            onClick={() => handleSort('time')}
                            className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                        >
                            Thời Gian {getSortIcon('time')}
                        </div>

                        {(selectedSensor === 'all' || selectedSensor === 'temperature') && (
                            <div
                                onClick={() => handleSort('temperature')}
                                className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} flex items-center gap-2 text-orange-400 cursor-pointer hover:text-orange-300 transition-colors`}
                            >
                                <Sun size={16} /> Nhiệt độ {getSortIcon('temperature')}
                            </div>
                        )}

                        {(selectedSensor === 'all' || selectedSensor === 'humidity') && (
                            <div
                                onClick={() => handleSort('humidity')}
                                className={`${selectedSensor === 'all' ? 'col-span-3' : 'col-span-8'} flex items-center gap-2 text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors`}
                            >
                                <Droplets size={16} /> Độ ẩm {getSortIcon('humidity')}
                            </div>
                        )}

                        {(selectedSensor === 'all' || selectedSensor === 'light') && (
                            <div
                                onClick={() => handleSort('light')}
                                className={`${selectedSensor === 'all' ? 'col-span-3' : 'col-span-8'} flex items-center gap-2 text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors`}
                            >
                                <Sun size={16} /> Ánh sáng {getSortIcon('light')}
                            </div>
                        )}
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-white/5">
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors text-sm text-white/80"
                                >
                                    <div className="col-span-1 font-mono text-xs text-white/40 truncate" title={item.id}>#{item.id}</div>
                                    <div className="col-span-3 font-mono">{item.time}</div>

                                    {(selectedSensor === 'all' || selectedSensor === 'temperature') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} text-orange-300`}>
                                            {item.temperature}°C
                                        </div>
                                    )}

                                    {(selectedSensor === 'all' || selectedSensor === 'humidity') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-3' : 'col-span-8'} text-cyan-300`}>
                                            {item.humidity}%
                                        </div>
                                    )}

                                    {(selectedSensor === 'all' || selectedSensor === 'light') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-3' : 'col-span-8'} text-yellow-300`}>
                                            {item.light} Lx
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-white/30">
                                Không tìm thấy dữ liệu phù hợp
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <div className="text-xs text-white/40">
                        Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, processedHistory.length)} trên tổng {processedHistory.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">Số bản ghi:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-2 py-1 bg-black/20 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer hover:bg-black/30"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="5">5</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center px-4 bg-white/5 rounded-lg text-xs font-mono">
                        {currentPage} / {totalPages || 1}
                    </div>

                    <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
