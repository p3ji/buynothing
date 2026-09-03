import React from 'react';
import type { User } from '../types';
import { Gift, PlusCircle, MessageSquare, MapPin } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onOpenPostModal: () => void;
  onOpenMyMessages: () => void;
  onOpenProfile: () => void;
  onOpenNewProfileModal: () => void;
  onOpenLoginModal: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenPostModal,
  onOpenMyMessages,
  onOpenProfile,
  onOpenNewProfileModal,
  onOpenLoginModal,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-lg leading-none">
              Buy Nothing
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{currentUser ? currentUser.neighborhood : 'Maplewood North (Guest View)'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Persona Switcher & New Profile Trigger */}
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      onOpenNewProfileModal();
                    } else {
                      const selected = allUsers.find((u) => u.id === e.target.value);
                      if (selected) onSelectUser(selected);
                    }
                  }}
                  aria-label="Switch active user"
                  className="bg-white text-xs font-medium text-slate-800 py-1 px-2.5 rounded-md border border-slate-300 shadow-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.id === 'user-sarah' ? 'Giver' : 'Neighbor'})
                    </option>
                  ))}
                  <option value="__new__">+ New Neighbor Profile...</option>
                </select>

                <button
                  onClick={onOpenNewProfileModal}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded bg-white hover:bg-emerald-50 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  title="Set up a new profile"
                >
                  + Join
                </button>
              </div>

              {/* Messages & Pickups Button */}
              <button
                onClick={onOpenMyMessages}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Messages & Pickups"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Give Item Button */}
              <button
                onClick={onOpenPostModal}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Give Item</span>
                <span className="xs:hidden">Give</span>
              </button>

              {/* User Profile Button */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/30 transition-all cursor-pointer"
                title="Profile & Safety Settings"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
            </>
          ) : (
            /* Logged Out / Guest Controls */
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLoginModal}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onOpenNewProfileModal}
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                + Join Community
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
