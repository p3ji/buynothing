import React, { useState } from 'react';
import type { User } from '../types';
import { X, LogIn, Phone, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  allUsers: User[];
  onClose: () => void;
  onSelectUser: (user: User) => void;
  onOpenNewProfileModal: () => void;
  message?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  allUsers,
  onClose,
  onSelectUser,
  onOpenNewProfileModal,
  message,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [otp, setOtp] = useState('');

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSubmitted) {
      if (!phoneNumber.trim()) return;
      setPhoneSubmitted(true);
      return;
    }

    // Match phone or log in as first matching user or create
    const digits = phoneNumber.replace(/\D/g, '');
    const matchedUser = allUsers.find((u) => u.phoneMasked.includes(digits.slice(-4))) || allUsers[0];
    onSelectUser(matchedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Sign In to Buy Nothing</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {message && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Quick 1-Click Neighbor Login */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Select Your Neighbor Profile
            </label>
            <div className="space-y-2">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {user.neighborhood} • {user.giveCount} given
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or with Mobile Number
            </span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* SMS Login */}
          <form onSubmit={handlePhoneLogin} className="space-y-3">
            {!phoneSubmitted ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2.5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Send Verification Code
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter 6-Digit Code sent to {phoneNumber}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-sm font-bold p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-2.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Confirm & Sign In
                </button>
              </div>
            )}
          </form>

          {/* Join Link */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Don't have a neighbor profile yet? </span>
            <button
              onClick={() => {
                onClose();
                onOpenNewProfileModal();
              }}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" /> Join Neighborhood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
