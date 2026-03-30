import React from 'react';
import { Clock, Hash, User } from 'lucide-react';
import { BUS } from '../types';

interface Props {
    bus: BUS;
    index: number;
    isRoute: boolean;
}

export const BusCard: React.FC<Props> = ({ bus, index, isRoute }) => {
    return (
        <div className={`relative bg-white/95 backdrop-blur-sm border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group ${isRoute ? 'border-emerald-200' : 'border-slate-200'}`}>
            <div className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center rounded-br-xl font-black text-xs shadow-sm z-20 ${isRoute ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                {index}
            </div>
            <div className="absolute -right-6 -bottom-8 text-[140px] font-black text-slate-50 opacity-60 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                {bus.routeNumber}
            </div>
            <div className="relative z-10 flex justify-between items-start">
                <div className="pl-4">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className={`p-1.5 rounded-md ${isRoute ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Hash size={18} strokeWidth={3} />
                        </div>
                        <span className="text-2xl font-black text-slate-800 tracking-wide">{bus.busNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 mb-4 ml-1">
                        <User size={18} strokeWidth={2.5} className={isRoute ? "text-emerald-500/70" : "text-slate-400"} />
                        <span className="font-semibold text-slate-600 text-lg">{bus.firstName} {bus.lastName}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Route</span>
                    <div className={`px-5 py-2 rounded-xl font-black text-xl border ${isRoute ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-slate-800 text-white border-slate-700 shadow-md'}`}>
                        R-{bus.routeNumber}
                    </div>
                </div>
            </div>
            <div className="relative z-10 mt-2 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600 font-bold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <Clock size={18} className={isRoute ? "text-emerald-500" : "text-amber-500"} strokeWidth={2.5} />
                    <span className="text-base">{bus.departureTime}</span>
                    <span className="text-slate-300 mx-1">➜</span>
                    <span className="text-base">{bus.arrivalTime}</span>
                </div>
                <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-widest px-3 py-1.5 rounded-lg ${isRoute ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${isRoute ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {isRoute ? 'Moving' : 'Parked'}
                </div>
            </div>
        </div>
    );
};