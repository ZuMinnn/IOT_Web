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
    const [searchMode, setSearchMode] = useState('compound');
    const [searchDate, setSearchDate] = useState('');
    const [searchHour, setSearchHour] = useState('');
    const [searchMinute, setSearchMinute] = useState('');
    const [searchSecond, setSearchSecond] = useState('');
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
                if (searchTerm && (searchMode === 'device' || searchMode === 'compound')) {
                    // Normalize Vietnamese / mixed-case ON/OFF keywords
                    const onKeywords = ['on', 'bật', 'bat', 'đã bật', 'da bat', 'bât'];
                    const offKeywords = ['off', 'tắt', 'tat', 'đã tắt', 'da tat', 'tăt'];
                    const lower = searchTerm.trim().toLowerCase();
                    let keyword = searchTerm;
                    if (onKeywords.includes(lower)) keyword = 'ON';
                    else if (offKeywords.includes(lower)) keyword = 'OFF';
                    params.append('keyword', keyword);
                }

                let currentStartDate = '';
                let currentEndDate = '';
                
                if ((searchMode === 'time' || searchMode === 'compound') && searchDate) {
                    const [year, month, day] = searchDate.split('-');
                    let hStart = 0, hEnd = 23;
                    let mStart = 0, mEnd = 59;
                    let sStart = 0, sEnd = 59;

                    if (searchHour !== '') {
                        hStart = parseInt(searchHour);
                        hEnd = parseInt(searchHour);
                        if (searchMinute !== '') {
                            mStart = parseInt(searchMinute);
                            mEnd = parseInt(searchMinute);
                            if (searchSecond !== '') {
                                sStart = parseInt(searchSecond);
                                sEnd = parseInt(searchSecond);
                            }
                        }
                    }

                    const dtStart = new Date(year, month - 1, day, hStart, mStart, sStart, 0);
                    const dtEnd = new Date(year, month - 1, day, hEnd, mEnd, sEnd, 999);
                    currentStartDate = dtStart.toISOString();
                    currentEndDate = dtEnd.toISOString();
                }

                if (currentStartDate) params.append('fromDate', currentStartDate);
                if (currentEndDate) params.append('toDate', currentEndDate);

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
    }, [currentPage, itemsPerPage, selectedDevice, searchMode, searchDate, searchHour, searchMinute, searchSecond, searchTerm]);

    const getDeviceDetails = (deviceName) => {
        switch (deviceName) {
            case 'fan': return { label: 'Quạt', icon: Fan, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
            case 'airConditioner': return { label: 'Điều hòa', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' };
            case 'light': return { label: 'Đèn', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
            default: return { label: deviceName, icon: Activity, color: 'text-white', bg: 'bg-white/10' };
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleTimeKeyDown = (e) => {
        const input = e.target;
        if (e.key === 'ArrowRight' && input.selectionStart === input.value.length) {
            const next = input.nextElementSibling;
            if (next && next.nextElementSibling && next.nextElementSibling.tagName === 'INPUT') {
                e.preventDefault();
                next.nextElementSibling.focus();
            }
        } else if (e.key === 'ArrowLeft' && input.selectionEnd === 0) {
            const prev = input.previousElementSibling;
            if (prev && prev.previousElementSibling && prev.previousElementSibling.tagName === 'INPUT') {
                e.preventDefault();
                prev.previousElementSibling.focus();
            }
        }
    };

    const handleTimePaste = (e) => {
        const pasted = e.clipboardData.getData('text');
        const parts = pasted.split(/[:\s-]/).filter(p => p.trim() !== '' && !isNaN(p));
        if (parts.length >= 2) {
            e.preventDefault();
            setSearchHour(parts[0].slice(0, 2).padStart(2, '0'));
            setSearchMinute(parts[1].slice(0, 2).padStart(2, '0'));
            setSearchSecond(parts[2] ? parts[2].slice(0, 2).padStart(2, '0') : '00');
            setCurrentPage(1);
        }
    };

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
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Chế độ Tìm</span>
                            <select 
                                value={searchMode} 
                                onChange={e => { setSearchMode(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="time" className="bg-slate-900 text-white">Thời gian</option>
                                <option value="device" className="bg-slate-900 text-white">Thiết bị</option>
                                <option value="compound" className="bg-slate-900 text-white">Phức hợp</option>
                            </select>
                        </div>

                        {(searchMode === 'time' || searchMode === 'compound') && (
                            <>
                                <div className="flex flex-col gap-1 lg:w-36">
                                    <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Ngày</span>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={searchDate}
                                            onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }}
                                            style={{ colorScheme: 'dark' }}
                                            className="w-full pl-3 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 w-[160px]">
                                    <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Giờ : Phút : Giây</span>
                                    <div className="flex bg-black/20 border border-white/10 rounded-lg overflow-hidden">
                                        <input type="text" placeholder="HH" maxLength={2} value={searchHour} onKeyDown={handleTimeKeyDown} onPaste={handleTimePaste} onChange={e => {setSearchHour(e.target.value); setCurrentPage(1)}} className="w-full text-center py-1.5 bg-transparent text-sm w-12 text-white focus:outline-none" />
                                        <span className="text-white/30 self-center font-bold pointer-events-none">:</span>
                                        <input type="text" placeholder="MM" maxLength={2} value={searchMinute} onKeyDown={handleTimeKeyDown} onPaste={handleTimePaste} onChange={e => {setSearchMinute(e.target.value); setCurrentPage(1)}} className="w-full text-center py-1.5 bg-transparent text-sm w-12 text-white focus:outline-none" />
                                        <span className="text-white/30 self-center font-bold pointer-events-none">:</span>
                                        <input type="text" placeholder="SS" maxLength={2} value={searchSecond} onKeyDown={handleTimeKeyDown} onPaste={handleTimePaste} onChange={e => {setSearchSecond(e.target.value); setCurrentPage(1)}} className="w-full text-center py-1.5 bg-transparent text-sm w-12 text-white focus:outline-none" />
                                    </div>
                                </div>
                            </>
                        )}

                        {(searchMode === 'device' || searchMode === 'compound') && (
                            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                                <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Tìm kiếm (#ID hoặc Lệnh)</span>
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: #123, ON..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="w-full pl-8 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        )}
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
