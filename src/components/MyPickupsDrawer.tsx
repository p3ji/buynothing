import React from 'react';
import type { Item, User } from '../types';
import { X, Gift, CheckCircle2, Clock, MessageCircle, ArrowRight } from 'lucide-react';

interface MyPickupsDrawerProps {
  currentUser: User;
  items: Item[];
  onClose: () => void;
  onSelectItem: (item: Item) => void;
  onOpenChat: (item: Item) => void;
}

export const MyPickupsDrawer: React.FC<MyPickupsDrawerProps> = ({
  currentUser,
  items,
  onClose,
  onSelectItem,
  onOpenChat,
}) => {
  const givingItems = items.filter((i) => i.giverId === currentUser.id);
  const requestedItems = items.filter((i) =>
    i.requests.some((r) => r.userId === currentUser.id)
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">My Gifting & Pickups</h2>
          <p className="text-xs text-slate-500">Track all your active exchanges in one place</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section 1: Items You Are Giving */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>You're Giving ({givingItems.length})</span>
            </h3>
          </div>

          {givingItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic">You haven't listed any items yet.</p>
          ) : (
            <div className="space-y-2.5">
              {givingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectItem(item);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span
                          className={`font-medium ${
                            item.status === 'available'
                              ? 'text-emerald-700'
                              : item.status === 'pending'
                              ? 'text-amber-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {item.status === 'available'
                            ? `${item.requests.length} requests`
                            : item.status === 'pending'
                            ? 'Pickup scheduled'
                            : 'Picked up'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Items You Requested */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>You've Requested ({requestedItems.length})</span>
            </h3>
          </div>

          {requestedItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No active requests.</p>
          ) : (
            <div className="space-y-2.5">
              {requestedItems.map((item) => {
                const isSelected = item.selectedRequesterId === currentUser.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onSelectItem(item);
                      }}
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] mt-0.5">
                          {isSelected ? (
                            <span className="text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> You're selected!
                            </span>
                          ) : item.status === 'picked_up' ? (
                            <span className="text-slate-400">Picked up by neighbor</span>
                          ) : (
                            <span className="text-slate-500">Waiting on giver choice</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenChat(item);
                      }}
                      className="ml-2 p-2 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Open Chat"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
