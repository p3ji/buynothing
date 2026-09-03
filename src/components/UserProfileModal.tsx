import React, { useState } from 'react';
import type { User } from '../types';
import {
  X,
  ShieldCheck,
  Phone,
  Home,
  Bell,
  Check,
  Lock,
  LogOut,
} from 'lucide-react';

interface UserProfileModalProps {
  currentUser: User;
  allUsers: User[];
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onSelectUser: (user: User) => void;
  onOpenNewProfileModal: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  allUsers,
  onClose,
  onUpdateUser,
  onSelectUser,
  onOpenNewProfileModal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'switch'>('profile');
  const [streetAddress, setStreetAddress] = useState(
    currentUser.savedPorchAddress?.street || ''
  );
  const [instructions, setInstructions] = useState(
    currentUser.savedPorchAddress?.instructions || ''
  );
  const [smsAlerts, setSmsAlerts] = useState(
    currentUser.notificationPreferences.smsPickupAlerts
  );
  const [facebookGroupUrl, setFacebookGroupUrl] = useState(
    currentUser.facebookGroupUrl || 'https://www.facebook.com/groups/feed/'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      savedPorchAddress: {
        street: streetAddress,
        instructions,
      },
      facebookGroupUrl: facebookGroupUrl.trim() || 'https://www.facebook.com/groups/feed/',
      notificationPreferences: {
        ...currentUser.notificationPreferences,
        smsPickupAlerts: smsAlerts,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
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
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Neighbor Profile & Safety</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Identity & Trust
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Saved Porch & Alerts
          </button>
          <button
            onClick={() => setActiveTab('switch')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'switch'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Switch Account
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* User Avatar + Real Name */}
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{currentUser.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentUser.neighborhood} • Member since {currentUser.joinedDate}
                  </p>
                </div>
              </div>

              {/* Neighbor Trust Metrics */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900">{currentUser.giveCount}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Items Given</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{currentUser.pickupCount}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Picked Up</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-700">
                    {currentUser.reliabilityScore}%
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Completion Rate</div>
                </div>
              </div>

              {/* Authentication & Verification Method */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Verification & Security
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900">Phone Verification</div>
                      <div className="text-slate-500 text-[11px]">{currentUser.phoneMasked}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900">Neighborhood Boundary</div>
                      <div className="text-slate-500 text-[11px]">
                        Verified boundary for {currentUser.neighborhood}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong>Why verification matters:</strong> In Buy Nothing groups, people give items from their homes. Phone verification and neighborhood boundary checks prevent spammers and build real-world neighbor trust.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Profile</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Default Porch Pickup Address
                  </label>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Private
                  </span>
                </div>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace (front porch)"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Only shared with the neighbor you explicitly select for pickup.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Porch / Gate Instructions
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Item is under the covered porch by the red door. No need to ring doorbell."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Local Facebook Group Link (Optional)
                </label>
                <input
                  type="url"
                  value={facebookGroupUrl}
                  onChange={(e) => setFacebookGroupUrl(e.target.value)}
                  placeholder="e.g. https://www.facebook.com/groups/maplewoodbuynothing"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  When you click "Facebook Group" on an item, this exact group opens in a new tab.
                </p>
              </div>

              {/* Notification preferences */}
              <div className="pt-2 border-t border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-800">Direct Pickup Alerts</div>
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        SMS Instant Alerts
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Receive text when neighbor shares pickup address or messages
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {activeTab === 'switch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Switch profiles or join as a new neighbor:
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewProfileModal();
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  + New Profile
                </button>
              </div>
              <div className="space-y-2">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      user.id === currentUser.id
                        ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {user.neighborhood} • {user.giveCount} given • {user.pickupCount} received
                        </div>
                      </div>
                    </div>
                    {user.id === currentUser.id && (
                      <span className="text-xs font-bold text-emerald-700">Active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
