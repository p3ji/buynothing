import React from 'react';
import type { Item, User } from '../types';
import { MapPin, Users, Clock, CheckCircle2, MessageCircle } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  currentUser: User;
  onOpenItem: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, currentUser, onOpenItem }) => {
  const isGiver = item.giverId === currentUser.id;
  const hasRequested = item.requests.some((r) => r.userId === currentUser.id);
  const isSelected = item.selectedRequesterId === currentUser.id;

  return (
    <div
      onClick={() => onOpenItem(item)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Photo with Overlay Badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Status Chip */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {item.status === 'available' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Available
            </span>
          )}
          {item.status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow-xs">
              <Clock className="w-3 h-3" />
              Pending Pickup
            </span>
          )}
          {item.status === 'picked_up' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-200 shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              Picked Up
            </span>
          )}

          {/* Unclaimed Warning Badge (> 2 days) */}
          {item.status === 'available' && item.daysOld >= 2 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
              {Math.floor(item.daysOld)}d unclaimed
            </span>
          )}
        </div>

        {/* Distance Pill */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{item.distance}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            {item.category}
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={item.giverAvatar}
              alt={item.giverName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-slate-600 font-medium truncate max-w-[100px]">
              {item.giverName.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.requests.length > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{item.requests.length}</span>
              </div>
            )}

            {/* Quick Action Preview */}
            {isGiver ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                You're Giver
              </span>
            ) : isSelected ? (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Selected!
              </span>
            ) : hasRequested ? (
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> Requested
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
