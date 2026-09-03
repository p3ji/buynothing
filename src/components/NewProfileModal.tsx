import React, { useState } from 'react';
import type { User } from '../types';
import { X, UserPlus, Phone, Lock, Check, Sparkles } from 'lucide-react';

interface NewProfileModalProps {
  onClose: () => void;
  onCreateUser: (newUser: User) => void;
}

const AVATAR_PRESETS = [
  {
    name: 'Neighbor 1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neighbor 2',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neighbor 3',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neighbor 4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neighbor 5',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neighbor 6',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
];

export const NewProfileModal: React.FC<NewProfileModalProps> = ({
  onClose,
  onCreateUser,
}) => {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('Maplewood North');
  const [crossStreet, setCrossStreet] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [porchStreet, setPorchStreet] = useState('');
  const [porchInstructions, setPorchInstructions] = useState('');
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Mask phone for public display (e.g. (555) •••-1234)
    const digits = phone.replace(/\D/g, '');
    const last4 = digits.slice(-4) || '0000';
    const phoneMasked = `(${digits.slice(0, 3) || '555'}) •••-${last4}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      avatar,
      neighborhood: crossStreet.trim() ? `${neighborhood} (${crossStreet.trim()})` : neighborhood,
      joinedDate: 'Just now',
      giveCount: 0,
      pickupCount: 0,
      verifiedStatus: 'verified_resident',
      verificationMethod: 'sms_phone',
      phoneMasked,
      reliabilityScore: 100,
      savedPorchAddress: porchStreet.trim()
        ? {
            street: porchStreet.trim(),
            instructions: porchInstructions.trim() || 'Item is on the front porch.',
          }
        : undefined,
      notificationPreferences: {
        smsPickupAlerts: smsAlerts,
        emailDailyDigest: false,
        browserPush: true,
      },
    };

    onCreateUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Join the Neighborhood</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Patel"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              Real names build trust when picking up or giving from home porches.
            </p>
          </div>

          {/* Neighborhood & Cross Street */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Neighborhood Area
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Maplewood North">Maplewood North</option>
                <option value="Maplewood Heights">Maplewood Heights</option>
                <option value="Maplewood South">Maplewood South</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nearest Cross-Street
              </label>
              <input
                type="text"
                value={crossStreet}
                onChange={(e) => setCrossStreet(e.target.value)}
                placeholder="e.g. Oak & 4th"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number Verification */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center justify-between">
              <span>Mobile Phone Number <span className="text-red-500">*</span></span>
              <span className="text-[11px] font-normal text-emerald-700 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Never public
              </span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 234-5678"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Enforces 1 account per human (prevents spam) and sends instant SMS alerts for pickup addresses.
            </p>
          </div>

          {/* Profile Photo Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Choose Profile Photo
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => setAvatar(preset.url)}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                    avatar === preset.url
                      ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105'
                      : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  {avatar === preset.url && (
                    <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Default Porch Pickup Address */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Default Porch Address (Optional)
              </label>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Private Vault
              </span>
            </div>
            <input
              type="text"
              value={porchStreet}
              onChange={(e) => setPorchStreet(e.target.value)}
              placeholder="e.g. 512 Oak Street (front porch)"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-2"
            />
            <input
              type="text"
              value={porchInstructions}
              onChange={(e) => setPorchInstructions(e.target.value)}
              placeholder="e.g. Box is under the porch bench. No need to ring doorbell."
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Saves time when giving items. Only revealed to the single neighbor you select for pickup.
            </p>
          </div>

          {/* Notification Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-800">Enable instant pickup SMS alerts</span>
              <p className="text-[11px] text-slate-500">
                Get notified when a neighbor accepts your request or drops a porch address.
              </p>
            </div>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Join Neighborhood & Create Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};
