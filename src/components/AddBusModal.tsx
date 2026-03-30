import React, { useState } from 'react';
import { X, Upload, Plus, FileText, AlertCircle } from 'lucide-react';
import { createBus, createBusesBulk } from '../api/busApi';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddBusModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState<'manual' | 'file'>('manual');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        busNumber: '',
        firstName: '',
        lastName: '',
        routeNumber: '',
        departureTime: '08:00',
        arrivalTime: '20:00'
    });

    if (!isOpen) return null;

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const plate = formData.busNumber.toUpperCase().trim();
        if (!/^[A-Z]{2}\d{4}[A-Z]{2}$/.test(plate)) {
            setError("Invalid Plate Format! (e.g. AA1234BB)");
            return;
        }

        try {
            const msg = await createBus({
                ...formData,
                busNumber: plate,
                routeNumber: parseInt(formData.routeNumber)
            });
            alert(msg);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const text = ev.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());

            const validBusesToUpload: any[] = [];
            let formatErrorsCount = 0;

            const plateRegex = /^[A-Z]{2}\d{4}[A-Z]{2}$/;
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

            lines.forEach(line => {
                const p = line.split(',');

                if (p.length === 6) {
                    const busNumber = p[0].trim().toUpperCase();
                    const firstName = p[1].trim();
                    const lastName = p[2].trim();
                    const routeNumber = p[3].trim();
                    const departureTime = p[4].trim();
                    const arrivalTime = p[5].trim();

                    const isPlateOk = plateRegex.test(busNumber);
                    const isRouteOk = !isNaN(parseInt(routeNumber)) && /^\d+$/.test(routeNumber);
                    const isDepOk = timeRegex.test(departureTime);
                    const isArrOk = timeRegex.test(arrivalTime);
                    const isNamesOk = firstName.length > 0 && lastName.length > 0;

                    if (isPlateOk && isRouteOk && isDepOk && isArrOk && isNamesOk) {
                        validBusesToUpload.push({
                            busNumber,
                            firstName,
                            lastName,
                            routeNumber: parseInt(routeNumber),
                            departureTime,
                            arrivalTime
                        });
                    } else {
                        formatErrorsCount++;
                    }
                } else {
                    formatErrorsCount++;
                }
            });

            if (validBusesToUpload.length === 0) {
                setError(`No valid data found! ${formatErrorsCount} lines had format errors.`);
                return;
            }

            try {
                const report = await createBusesBulk(validBusesToUpload);

                let finalMsg = report;
                if (formatErrorsCount > 0) {
                    finalMsg += `\n(Also, ${formatErrorsCount} lines were ignored due to wrong format)`;
                }

                alert(finalMsg);
                onSuccess();
                onClose();
            } catch (err) {
                setError("Server error during import.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Register Bus</h2>
                        <p className="text-slate-400 text-sm font-medium">Add new vehicle to the system</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-2xl transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex p-2 bg-slate-100 m-6 rounded-2xl">
                    <button
                        onClick={() => {setMode('manual'); setError('');}}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${mode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Plus size={18} /> Manual
                    </button>
                    <button
                        onClick={() => {setMode('file'); setError('');}}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${mode === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText size={18} /> File Import
                    </button>
                </div>

                <div className="px-8 pb-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-center gap-3 animate-shake">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    {mode === 'manual' ? (
                        <form onSubmit={handleManualSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Plate (AA1234BB)</label>
                                    <input required value={formData.busNumber} onChange={e => setFormData({...formData, busNumber: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase transition-all" placeholder="AA 0000 AA"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"/>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Route Number</label>
                                    <input required type="number" value={formData.routeNumber} onChange={e => setFormData({...formData, routeNumber: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="e.g. 101"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure</label>
                                    <input required type="time" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold cursor-pointer"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival</label>
                                    <input required type="time" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold cursor-pointer"/>
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                                <Plus size={22} strokeWidth={3} /> REGISTER BUS
                            </button>
                        </form>
                    ) : (
                        <div className="group border-4 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="p-6 bg-blue-50 text-blue-600 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Drop data file here</h3>
                            <p className="text-sm text-slate-400 font-medium px-4">
                                Format: <code className="text-blue-600 bg-blue-50 px-1 rounded">Plate,Name,Surname,Route,Dep,Arr</code>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};