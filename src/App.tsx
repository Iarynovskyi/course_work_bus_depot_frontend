import React, { useState, useEffect } from 'react';
import { Bus as BusIcon, Map, Activity, Plus, Download } from 'lucide-react';

import { BusCard } from './components/BusCard';
import { AddBusModal } from './components/AddBusModal';
import { fetchBuses } from './api/busApi';
import { BUS } from './types';

export default function App() {
    const [buses, setBuses] = useState<BUS[]>([]);
    const[time, setTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    },[]);

    const loadData = async () => {
        try {
            const data = await fetchBuses();
            setBuses(data);
            setIsConnected(true);
        } catch (error) {
            console.error("Backend connection error:", error);
            setIsConnected(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 300000);
        return () => clearInterval(interval);
    },[]);

    const busesInDepot = buses.filter(b => b.status === 0);
    const busesOnRoute = buses.filter(b => b.status === 1);

    return (
        <div className="relative min-h-screen bg-slate-50 font-sans overflow-hidden selection:bg-blue-200">
            <div className="absolute inset-0 z-0 opacity-[0.3]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%2394a3b8'/%3E%3C/svg%3E\")" }}></div>
            <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] z-0 pointer-events-none"></div>
            <div className="absolute top-[10%] right-[-5%] w-[700px] h-[700px] bg-emerald-400/20 rounded-full blur-[120px] z-0 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[30%] w-[800px] h-[600px] bg-amber-400/15 rounded-full blur-[120px] z-0 pointer-events-none"></div>

            <div className="relative z-10 px-6 py-10 max-w-[1600px] mx-auto flex flex-col h-screen">

                <header className="mb-8 flex flex-col items-center justify-center shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className={`${isConnected ? 'text-blue-600 animate-pulse' : 'text-red-500'}`} size={28} />
                        <h1 className="text-3xl font-black text-slate-800 tracking-widest uppercase drop-shadow-sm">
                            Central Dispatch System
                        </h1>
                    </div>

                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.2)] backdrop-blur-md relative">

                        <a
                            href="/BusDepotManager.jar"
                            download="BusDepotManager.jar"
                            title="Download Admin Terminal"
                            className="absolute -left-24 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-4 rounded-full shadow-lg border border-slate-700 transition transform hover:scale-110 flex items-center justify-center"
                        >
                            <Download size={32} />
                        </a>

                        <div className="font-mono text-7xl font-bold text-amber-500 tracking-[0.15em] drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                            {time.toLocaleTimeString('uk-UA', { hour12: false })}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-amber-600/80 font-mono text-sm mt-3 uppercase tracking-widest font-semibold">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`}></div>
                            {isConnected ? 'Auto-Sync Active (Spring Boot)' : 'Backend Disconnected'}
                        </div>

                        <button onClick={() => setIsModalOpen(true)} className="absolute -right-24 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110 flex items-center justify-center">
                            <Plus size={32} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 min-h-0 pb-10">

                    <section className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-6 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-400 to-slate-300"></div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 shrink-0 mt-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-100"><BusIcon size={28} className="text-slate-700" /></div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Depot Storage</h2>
                            </div>
                            <span className="bg-slate-800 text-white py-1.5 px-5 rounded-full font-bold text-xl shadow-md">{busesInDepot.length}</span>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1 pb-4">
                            {busesInDepot.map((bus, idx) => <BusCard key={bus.busNumber} bus={bus} index={idx + 1} isRoute={false} />)}
                            {busesInDepot.length === 0 && <p className="text-center text-slate-400 italic font-medium py-10">Depot is empty</p>}
                        </div>
                    </section>

                    <section className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-6 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 shrink-0 mt-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-100"><Map size={28} className="text-emerald-600" /></div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Active Routes</h2>
                            </div>
                            <span className="bg-emerald-500 text-white py-1.5 px-5 rounded-full font-bold text-xl shadow-md animate-pulse">{busesOnRoute.length}</span>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1 pb-4">
                            {busesOnRoute.map((bus, idx) => <BusCard key={bus.busNumber} bus={bus} index={idx + 1} isRoute={true} />)}
                            {busesOnRoute.length === 0 && <p className="text-center text-slate-400 italic font-medium py-10">No buses on route</p>}
                        </div>
                    </section>
                </div>
            </div>

            <AddBusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadData} />
        </div>
    );
}