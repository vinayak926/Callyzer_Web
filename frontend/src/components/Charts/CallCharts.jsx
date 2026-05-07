import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell, Sector
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Custom Bar Tooltip ───────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 min-w-[160px]">
            <p className="text-sm font-bold text-gray-700 mb-2">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.fill }}></span>
                        <span className="text-xs text-gray-500">{entry.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{entry.value}</span>
                </div>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-xs font-bold text-gray-700">
                    {payload.reduce((s, e) => s + e.value, 0)}
                </span>
            </div>
        </div>
    );
};

// ─── Custom Pie Tooltip ───────────────────────────────────
const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    const total = d.payload.total || 1;
    const percent = ((d.value / total) * 100).toFixed(1);
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ background: d.payload.color }}></span>
                <span className="text-sm font-bold text-gray-700">{d.name}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: d.payload.color }}>{d.value}</p>
            <p className="text-xs text-gray-400">{percent}% of total</p>
        </div>
    );
};

// ─── Active Pie Shape (on hover) ─────────────────────────
const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const total = payload.total || 1;
    return (
        <g>
            <text x={cx} y={cy - 12} textAnchor="middle" className="fill-gray-700" style={{ fontSize: 18, fontWeight: 700 }}>
                {value.toLocaleString()}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 13 }}>
                {payload.name}
            </text>
            <text x={cx} y={cy + 32} textAnchor="middle" style={{ fontSize: 12, fill: fill, fontWeight: 600 }}>
                {((value / total) * 100).toFixed(1)}%
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        </g>
    );
};

// ─── Custom Legend ────────────────────────────────────────
const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry) => (
            <div key={entry.value} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                <span className="text-xs text-gray-500 font-medium">{entry.value}</span>
            </div>
        ))}
    </div>
);

// ─── Stat Row for Pie Card ────────────────────────────────
const PieStat = ({ label, value, color, percent }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }}></span>
            <span className="text-sm text-gray-600 font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-20 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                <div className="h-1.5 rounded-full" style={{ width: `${percent}%`, background: color }}></div>
            </div>
            <span className="text-sm font-bold text-gray-700 w-10 text-right">{value}</span>
            <span className="text-xs text-gray-400 w-10 text-right">{percent.toFixed(1)}%</span>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────
const CallCharts = () => {
    const [loading, setLoading] = useState(true);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [totalCalls, setTotalCalls] = useState(0);
    const [activeBar, setActiveBar] = useState('All');
    const [activePieIndex, setActivePieIndex] = useState(0);

    const barFilters = ['All', 'Incoming', 'Outgoing', 'Missed'];
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Fetch weekly trend data for bar chart
                const res = await fetch(`${API}/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success && data.weeklyTrend) {
                    // Format data for bar chart
                    const formattedBarData = data.weeklyTrend.map(day => ({
                        day: day.day,
                        Incoming: day.incoming || 0,
                        Outgoing: day.outgoing || 0,
                        Missed: day.missed || 0
                    }));
                    setBarData(formattedBarData);
                    
                    // Format data for pie chart
                    const summary = data.summary;
                    const total = summary.totalCalls || 0;
                    setTotalCalls(total);
                    
                    const formattedPieData = [
                        { name: 'Incoming', value: summary.incomingCalls || 0, color: '#3b82f6' },
                        { name: 'Outgoing', value: summary.outgoingCalls || 0, color: '#8b5cf6' },
                        { name: 'Missed', value: summary.missedCalls || 0, color: '#f43f5e' }
                    ];
                    setPieData(formattedPieData);
                }
            } catch (err) {
                console.error("Failed to fetch chart data:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChartData();
    }, [token]);

    // Calculate summary stats for mini cards
    const summaryStats = {
        Incoming: pieData.find(d => d.name === 'Incoming')?.value || 0,
        Outgoing: pieData.find(d => d.name === 'Outgoing')?.value || 0,
        Missed: pieData.find(d => d.name === 'Missed')?.value || 0
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-40 bg-gray-200 rounded mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

            {/* ══ BAR CHART CARD ══════════════════════════════ */}
            <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Calls Per Day</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Weekly breakdown by call type</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
                        {barFilters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveBar(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                    ${activeBar === f
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary mini-cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-blue-600">{summaryStats.Incoming}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Incoming</p>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-violet-600">{summaryStats.Outgoing}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Outgoing</p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-rose-600">{summaryStats.Missed}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Missed</p>
                    </div>
                </div>

                {/* Recharts Bar Chart */}
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={barData}
                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        barCategoryGap="30%"
                        barGap={3}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                        />
                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f0f9ff', radius: 6 }} />
                        <Legend content={<CustomLegend />} />

                        {(activeBar === 'All' || activeBar === 'Incoming') && (
                            <Bar dataKey="Incoming" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={28} />
                        )}
                        {(activeBar === 'All' || activeBar === 'Outgoing') && (
                            <Bar dataKey="Outgoing" fill="#8b5cf6" radius={[5, 5, 0, 0]} maxBarSize={28} />
                        )}
                        {(activeBar === 'All' || activeBar === 'Missed') && (
                            <Bar dataKey="Missed" fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={28} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ══ PIE CHART CARD ══════════════════════════════ */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                {/* Card Header */}
                <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-800">Call Distribution</h3>
                    <p className="text-xs text-gray-400 mt-0.5">By call type — {totalCalls.toLocaleString()} total</p>
                </div>

                {/* Recharts Pie Chart */}
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={82}
                            paddingAngle={3}
                            dataKey="value"
                            activeIndex={activePieIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActivePieIndex(index)}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Stats List */}
                <div className="mt-3">
                    {pieData.map((d) => (
                        <PieStat
                            key={d.name}
                            label={d.name}
                            value={d.value}
                            color={d.color}
                            percent={totalCalls > 0 ? (d.value / totalCalls) * 100 : 0}
                        />
                    ))}
                </div>

                {/* Total Footer */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Total Calls</span>
                    <span className="text-base font-bold text-gray-800">{totalCalls.toLocaleString()}</span>
                </div>
            </div>

        </div>
    );
};

export default CallCharts;