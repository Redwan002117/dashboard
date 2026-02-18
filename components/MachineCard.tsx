import React from 'react';
import { Machine } from '../types';
import { Server, HardDrive, Cpu, Activity, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface MachineCardProps {
    machine: Machine;
    onClick: (machine: Machine) => void;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, onClick }) => {
    const isOnline = machine.status === 'online';

    // Helper for usage color coding
    // Helper for usage color coding
    const getUsageColor = (usage: number) => {
        if (usage >= 90) return 'text-red-500';
        if (usage >= 70) return 'text-amber-500';
        return 'text-emerald-500';
    };

    const getProgressBarColor = (usage: number) => {
        if (usage >= 90) return 'bg-red-500';
        if (usage >= 70) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const formatNetworkSpeed = (kbps: number | undefined) => {
        if (!kbps) return '0 bps';
        const bitsPerSec = kbps * 1024 * 8;
        if (bitsPerSec >= 1_000_000_000) return `${(bitsPerSec / 1_000_000_000).toFixed(1)} Gbps`;
        if (bitsPerSec >= 1_000_000) return `${(bitsPerSec / 1_000_000).toFixed(1)} Mbps`;
        if (bitsPerSec >= 1_000) return `${(bitsPerSec / 1_000).toFixed(1)} Kbps`;
        return `${bitsPerSec.toFixed(0)} bps`;
    };

    return (
        <div
            onClick={() => onClick(machine)}
            className={`
                group relative p-5 rounded-xl border transition-all duration-300 cursor-pointer
                ${isOnline
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300'
                    : 'bg-slate-50 border-slate-200 opacity-75 grayscale-[0.5]'}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                    <div className={`
                        p-2.5 rounded-lg transition-colors
                        ${isOnline ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-slate-200 text-slate-500'}
                    `}>
                        <Server size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {machine.nickname || machine.hostname}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                            {machine.nickname ? machine.hostname : machine.ip}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`
                    px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border flex items-center gap-1.5
                    ${isOnline
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'}
                `}>
                    <div className={`size-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {machine.status}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-4">
                {/* CPU */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-500 flex items-center gap-1.5">
                            <Cpu size={14} className="text-slate-400" /> CPU
                        </span>
                        <span className={getUsageColor(machine.metrics?.cpu || 0)}>
                            {machine.metrics?.cpu || 0}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(machine.metrics?.cpu || 0)}`}
                            style={{ width: `${machine.metrics?.cpu || 0}%` }}
                        />
                    </div>
                </div>

                {/* RAM */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-500 flex items-center gap-1.5">
                            <Activity size={14} className="text-slate-400" /> RAM
                        </span>
                        <span className={getUsageColor(machine.metrics?.ram || 0)}>
                            {machine.metrics?.ram || 0}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(machine.metrics?.ram || 0)}`}
                            style={{ width: `${machine.metrics?.ram || 0}%` }}
                        />
                    </div>
                </div>

                {/* Disk */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-500 flex items-center gap-1.5">
                            <HardDrive size={14} className="text-slate-400" /> Disk
                        </span>
                        <span className={getUsageColor(machine.metrics?.disk || 0)}>
                            {machine.metrics?.disk || 0}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(machine.metrics?.disk || 0)}`}
                            style={{ width: `${machine.metrics?.disk || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer / Network Stats */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5" title="Download">
                        <Activity size={12} className="rotate-180 text-blue-500" />
                        {formatNetworkSpeed(machine.metrics?.network_down_kbps)}
                    </div>
                    <div className="flex items-center gap-1.5" title="Upload">
                        <Activity size={12} className="text-emerald-500" />
                        {formatNetworkSpeed(machine.metrics?.network_up_kbps)}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {machine.metrics?.active_vpn && (
                        <div className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold border border-indigo-100 flex items-center gap-1">
                            <ShieldCheck size={10} /> VPN
                        </div>
                    )}
                    <div className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {machine.os.split(' ')[0]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineCard;
