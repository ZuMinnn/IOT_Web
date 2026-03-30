import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Activity, Droplets, Sun, ArrowUpDown, ArrowUp, ArrowDown, Search, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3001/api/sensors';

export const SensorHistory = () => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedSensor, setSelectedSensor] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchHour, setSearchHour] = useState('');
    const [searchMinute, setSearchMinute] = useState('');
    const [searchSecond, setSearchSecond] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const limitMultiplier = selectedSensor === 'all' ? 4 : 1;
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: itemsPerPage * limitMultiplier,
                    sensorName: selectedSensor,
                });

                let apiSortKey = sortConfig.key;
                if (sortConfig.key === 'time') apiSortKey = 'date';
                if (['temperature', 'humidity', 'light'].includes(sortConfig.key)) apiSortKey = 'value';
                
                params.append('sortBy', apiSortKey);
                params.append('sortDir', sortConfig.direction);

                if (searchTerm) params.append('keyword', searchTerm);
                if (searchHour) params.append('searchHour', searchHour);
                if (searchMinute) params.append('searchMinute', searchMinute);
                if (searchSecond) params.append('searchSecond', searchSecond);

                const res = await fetch(`${API_URL}/history?${params}`);
                const json = await res.json();
                
                if (json.data) {
                    let processedData = json.data;

                    if (selectedSensor === 'all') {
                        // Group EAV rows by exact timestamp to show 3 values on 1 row
                        const grouped = processedData.reduce((acc, curr) => {
                            const timeStr = new Date(curr.date).toLocaleString('vi-VN');
                            if (!acc[timeStr]) {
                                acc[timeStr] = {
                                    ID: curr.ID, 
                                    date: curr.date,
                                    timeStr: timeStr,
                                    temperature: '--',
                                    humidity: '--',
                                    light: '--',
                                    dust: '--'
                                };
                            }
                            
                            // Keep the smallest ID visually
                            if (curr.ID < acc[timeStr].ID) acc[timeStr].ID = curr.ID;

                            const sName = curr.sensor ? curr.sensor.name : '';
                            const formatValue = (v) => isNaN(v) ? v : Number(v).toFixed(2);
                            if (sName === 'temperature') acc[timeStr].temperature = formatValue(curr.value);
                            if (sName === 'humidity') acc[timeStr].humidity = formatValue(curr.value);
                            if (sName === 'light') acc[timeStr].light = formatValue(curr.value);
                            if (sName === 'dust') acc[timeStr].dust = formatValue(curr.value);

                            return acc;
                        }, {});
                        
                        processedData = Object.values(grouped);
                        setData(processedData);
                        
                        // Because the backend paginates raw rows, we adjust TotalPages roughly for groups
                        setTotalPages(Math.ceil(json.total / (itemsPerPage * 4)));
                        setTotalRecords(Math.ceil(json.total / 4));
                    } else {
                        // Single sensor view, just map them neatly
                        processedData = processedData.map(curr => {
                            const timeStr = new Date(curr.date).toLocaleString('vi-VN');
                            const sName = curr.sensor ? curr.sensor.name : '';
                            const formatValue = (v) => isNaN(v) ? v : Number(v).toFixed(2);
                            return {
                                ID: curr.ID,
                                date: curr.date,
                                timeStr: timeStr,
                                temperature: sName === 'temperature' ? formatValue(curr.value) : '--',
                                humidity: sName === 'humidity' ? formatValue(curr.value) : '--',
                                light: sName === 'light' ? formatValue(curr.value) : '--',
                                dust: sName === 'dust' ? formatValue(curr.value) : '--'
                            };
                        });
                        setData(processedData);
                        setTotalRecords(json.total);
                        setTotalPages(json.totalPages);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch sensor history", err);
            }
        };

        const t = setTimeout(fetchData, 300);
        return () => clearTimeout(t);
    }, [currentPage, itemsPerPage, selectedSensor, sortConfig, searchTerm, searchHour, searchMinute, searchSecond]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-30" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
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

    const sensorTabs = [
        { id: 'all', label: 'Tất cả', icon: Activity, color: 'text-white' },
        { id: 'temperature', label: 'Nhiệt độ', icon: Sun, color: 'text-orange-400' },
        { id: 'humidity', label: 'Độ ẩm', icon: Droplets, color: 'text-cyan-400' },
        { id: 'light', label: 'Ánh sáng', icon: Sun, color: 'text-yellow-400' },
        { id: 'dust', label: 'Độ bụi', icon: Wind, color: 'text-gray-400' },
    ];

    return (
        <div className="h-full flex flex-col p-4 space-y-4">
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
                    <p className="text-white/50 text-xs mt-1">Dữ liệu từ Database (EAV Model)</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto items-end">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Loại Cảm Biến</span>
                        <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                            {sensorTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setSelectedSensor(tab.id); setCurrentPage(1); }}
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

                    <div className="flex gap-4 flex-1 min-w-[300px] xl:ml-auto">
                        <div className="flex flex-col gap-1 w-[160px]">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Giờ : Phút : Giây</span>
                            <div className="flex bg-black/20 border border-white/10 rounded-lg overflow-hidden h-[34px]">
                                <input type="text" placeholder="HH" maxLength={2} value={searchHour} onKeyDown={handleTimeKeyDown} onPaste={handleTimePaste} onChange={e => {setSearchHour(e.target.value); setCurrentPage(1)}} className="w-full text-center py-1.5 bg-transparent text-sm w-12 text-white focus:outline-none" />
                                <span className="text-white/30 self-center font-bold pointer-events-none">:</span>
                                <input type="text" placeholder="MM" maxLength={2} value={searchMinute} onKeyDown={handleTimeKeyDown} onPaste={handleTimePaste} onChange={e => {setSearchMinute(e.target.value); setCurrentPage(1)}} className="w-full text-center py-1.5 bg-transparent text-sm w-12 text-white focus:outline-none" />
                                <span className="text-white/30 self-center font-bold pointer-events-none">:</span>
                                <input type="text" placeholder="SS" maxLength={2} value={searchSecond} onKeyDown={handleTimeKeyDown} onPaste={handleTimePaste} onChange={e => {setSearchSecond(e.target.value); setCurrentPage(1)}} className="w-full text-center py-1.5 bg-transparent text-sm w-12 text-white focus:outline-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full xl:w-[350px]">
                            <span className="text-[10px] text-white/50 uppercase font-semibold pl-1">Tìm kiếm (#ID, Giá trị, Thời gian)</span>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                <input
                                    type="text"
                                    placeholder="Ví dụ: #123, 50.5, 14:39:33 30/3..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-8 pr-2 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-white/20 transition-all font-mono"
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
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-xl z-10 font-medium text-sm text-white/70 select-none">
                        <div onClick={() => handleSort('ID')} className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group">
                            ID {getSortIcon('ID')}
                        </div>
                        <div onClick={() => handleSort('time')} className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-white transition-colors group">
                            Thời Gian {getSortIcon('time')}
                        </div>

                        {(selectedSensor === 'all' || selectedSensor === 'temperature') && (
                            <div onClick={() => handleSort('temperature')} className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} flex items-center gap-2 text-orange-400 cursor-pointer hover:text-orange-300 transition-colors`}>
                                <Sun size={16} /> Nhiệt độ {getSortIcon('temperature')}
                            </div>
                        )}
                        {(selectedSensor === 'all' || selectedSensor === 'humidity') && (
                            <div onClick={() => handleSort('humidity')} className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} flex items-center gap-2 text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors`}>
                                <Droplets size={16} /> Độ ẩm {getSortIcon('humidity')}
                            </div>
                        )}
                        {(selectedSensor === 'all' || selectedSensor === 'light') && (
                            <div onClick={() => handleSort('light')} className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} flex items-center gap-2 text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors`}>
                                <Sun size={16} /> Ánh sáng {getSortIcon('light')}
                            </div>
                        )}
                        {(selectedSensor === 'all' || selectedSensor === 'dust') && (
                            <div onClick={() => handleSort('dust')} className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors`}>
                                <Wind size={16} /> Độ bụi {getSortIcon('dust')}
                            </div>
                        )}
                    </div>

                    <div className="divide-y divide-white/5">
                        {data.length > 0 ? (
                            data.map((item) => {
                                return (
                                <motion.div key={item.ID} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors text-sm text-white/80">
                                    <div className="col-span-1 font-mono text-xs text-white/40 truncate">#{item.ID}</div>
                                    <div className="col-span-3 font-mono">{item.timeStr}</div>

                                    {(selectedSensor === 'all' || selectedSensor === 'temperature') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} text-orange-300`}>
                                            {item.temperature !== '--' ? `${item.temperature}°C` : '--'}
                                        </div>
                                    )}

                                    {(selectedSensor === 'all' || selectedSensor === 'humidity') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} text-cyan-300`}>
                                            {item.humidity !== '--' ? `${item.humidity}%` : '--'}
                                        </div>
                                    )}

                                    {(selectedSensor === 'all' || selectedSensor === 'light') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} text-yellow-300`}>
                                            {item.light !== '--' ? `${item.light} Lx` : '--'}
                                        </div>
                                    )}

                                    {(selectedSensor === 'all' || selectedSensor === 'dust') && (
                                        <div className={`${selectedSensor === 'all' ? 'col-span-2' : 'col-span-8'} text-gray-300`}>
                                            {item.dust !== '--' ? `${item.dust}%` : '--'}
                                        </div>
                                    )}
                                </motion.div>
                            )})
                        ) : (
                            <div className="p-8 text-center text-white/30">Không tìm thấy dữ liệu phù hợp</div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <div className="text-xs text-white/40">Tổng số: {totalRecords}</div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">Hiển thị:</span>
                        <div className="flex bg-black/20 p-0.5 rounded-lg border border-white/10">
                            {[8, 10, 20].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                        itemsPerPage === n
                                            ? 'bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-500/40 shadow-sm'
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
                    <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center px-4 bg-white/5 rounded-lg text-xs font-mono">
                        {currentPage} / {totalPages || 1}
                    </div>
                    <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
