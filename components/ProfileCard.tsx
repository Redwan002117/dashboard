import React, { useState } from 'react';
import { Machine } from '../types';
import { User, Briefcase, Hash, Star, DollarSign, Bookmark, Share, Edit2, Check, X as XIcon } from 'lucide-react';

interface ProfileCardProps {
    machine: Machine;
    onUpdate: (profile: Machine['profile']) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ machine, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Default or existing profile state
    const [profile, setProfile] = useState(machine.profile || {
        name: 'Unassigned',
        role: 'No Role Set',
        tags: [],
        stats: [
            { label: 'Rating', value: '0.0' },
            { label: 'Uptime', value: '0%' },
            { label: 'Rate', value: '$0/hr' }
        ]
    });

    const [tempProfile, setTempProfile] = useState(profile);

    const handleSave = () => {
        onUpdate(tempProfile);
        setProfile(tempProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl group">
            {/* Gradient Background Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-colors"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/30 rounded-full blur-3xl group-hover:bg-purple-400/40 transition-colors"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex justify-between w-full mb-2">
                    {/* Placeholder for Share/Bookmark if needed, or Edit button */}
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="p-2 rounded-full bg-white/50 hover:bg-white text-slate-500 hover:text-blue-600 transition-colors ml-auto">
                            <Edit2 size={16} />
                        </button>
                    )}
                </div>

                {/* Avatar */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-1 shadow-inner">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-slate-300" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Name & Role */}
                {isEditing ? (
                    <div className="w-full space-y-2 mb-4">
                        <input
                            type="text"
                            value={tempProfile.name}
                            onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                            className="w-full text-center font-bold text-lg bg-white/50 rounded px-2 py-1 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            value={tempProfile.role}
                            onChange={e => setTempProfile({ ...tempProfile, role: e.target.value })}
                            className="w-full text-center text-slate-500 text-sm bg-white/50 rounded px-2 py-1 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Role"
                        />
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{profile.name}</h3>
                        <p className="text-slate-500 font-medium mb-4">{profile.role}</p>
                    </>
                )}

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {(isEditing ? (tempProfile.tags || []) : (profile.tags || ['Design', 'UX'])).map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/60 text-slate-600 text-xs font-semibold shadow-sm border border-slate-100">
                            {tag}
                        </span>
                    ))}
                    {/* Simple tag editor could go here but keeping it simple for now */}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 w-full border-t border-slate-200/50 pt-6 mb-6">
                    {(isEditing ? (tempProfile.stats || []) : (profile.stats || [])).map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-slate-800 font-bold text-lg">{stat.value}</span>
                            <span className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                    {(!profile.stats || profile.stats.length === 0) && (
                        <>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-800 font-bold text-lg flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> 4.5</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Rating</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-800 font-bold text-lg">15K+</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Earned</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-800 font-bold text-lg">$80/hr</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Rate</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                {isEditing ? (
                    <div className="flex gap-2 w-full">
                        <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                            <Check size={18} /> Save
                        </button>
                        <button onClick={handleCancel} className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2">
                            <XIcon size={18} /> Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3 w-full">
                        <button className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-slate-200">
                            Get in touch
                        </button>
                        <button className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-xl transition-all shadow-sm border border-slate-200">
                            <Bookmark size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
