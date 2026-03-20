import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Activity, Fan, Wind, Lightbulb, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeviceHistory = ({ history }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [selectedDevice, setSelectedDevice] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' }); // Default newest first
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

    // Helper to get device details
    const getDeviceDetails = (deviceName) => {
        switch (deviceName) {
            case 'fan': return { label: 'Quạt', icon: Fan, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
            case 'airConditioner': return { label: 'Điều hòa', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' };
            case 'light': return { label: 'Đèn', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
            default: return { label: deviceName, icon: Activity, color: 'text-white', bg: 'bg-white/10' };
        }
    };

    // Process Data
    const processedHistory = useMemo(() => {
        let data = [...history];

        // 1. Filter by Device
        if (selectedDevice !== 'all') {
            data = data.filter(item => item.device === selectedDevice);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(item => {
                const deviceDetails = getDeviceDetails(item.device);
                const statusText = item.action === 'ON' ? 'đang bật' : 'đã tắt';
                return (
                    deviceDetails.label.toLowerCase().includes(lowerTerm) ||
                    item.action.toLowerCase().includes(lowerTerm) ||
                    statusText.includes(lowerTerm) ||
                    item.id?.toString().includes(lowerTerm)
                );
            });
        }

        // 2. Filter by Time Range
        // Need to parse the Vietnamese string format "dd/mm/yyyy hh:mm:ss" back to Date for comparison
        // Or if we stored raw timestamp in log we could use that. Currently text is stored. 
        // Let's assume sequential IDs correlate with time for simplicity OR parse string.
        // Parsing "DD/MM/YYYY HH:MM:SS" manually:
        const parseTime = (timeStr) => {
            const [time, date] = timeStr.split(' ');
            const [h, m, s] = time.split(':');
            const [day, month, year] = date.split('/');
            return new Date(year, month - 1, day, h, m, s);
        };

        if (startDate || endDate) {
            data = data.filter((item) => {
                const itemTime = parseTime(item.time);
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

        // 3. Sort
        data.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'time') {
                aValue = parseTime(a.time);
                bValue = parseTime(b.time);
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
    }, [history, selectedDevice, startDate, endDate, sortConfig, searchTerm]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedHistory.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Device Tabs
    const deviceTabs = [
        { id: 'all', label: 'Tất cả', icon: Activity, color: 'text-white' },
        { id: 'fan', label: 'Quạt', icon: Fan, color: 'text-cyan-400' },
        { id: 'airConditioner', label: 'Điều hòa', icon: Wind, color: 'text-blue-400' },
        { id: 'light', label: 'Đèn', icon: Lightbulb, color: 'text-yellow-400' },
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
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Activity className="text-purple-400" />
                        Lịch Sử Hoạt Động
                    </h2>
                    <p className="text-white/50 text-xs mt-1">Ghi lại trạng thái bật/tắt thiết bị</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto items-end">
                    {/* Device Tabs */}
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Thiết bị</span>
                        <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                            {deviceTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedDevice(tab.id)}
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
                                    placeholder="Thiết bị, trạng thái..."
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
                <div className="min-w-[500px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-xl z-10 font-medium text-sm text-white/70 select-none">

                        <div
                            onClick={() => handleSort('id')}
                            className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                        >
                            ID {getSortIcon('id')}
                        </div>

                        <div
                            onClick={() => handleSort('device')}
                            className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                        >
                            Thiết Bị {getSortIcon('device')}
                        </div>

                        <div
                            onClick={() => handleSort('action')}
                            className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                        >
                            Hành Động {getSortIcon('action')}
                        </div>

                        <div
                            onClick={() => handleSort('time')}
                            className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                        >
                            Thời Gian {getSortIcon('time')}
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-white/5">
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => {
                                const details = getDeviceDetails(item.device);
                                return (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors text-sm text-white/80 items-center"
                                    >
                                        <div className="col-span-2 font-mono text-xs text-white/40">#{item.id}</div>

                                        <div className="col-span-3 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${details.bg} ${details.color}`}>
                                                <details.icon size={14} />
                                            </div>
                                            <span className="font-medium">{details.label}</span>
                                        </div>

                                        <div className="col-span-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${item.action === 'ON'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {item.action === 'ON' ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                                            </span>
                                        </div>

                                        <div className="col-span-4 font-mono text-white/60">{item.time}</div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-white/30">
                                Chưa có dữ liệu hoạt động
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
