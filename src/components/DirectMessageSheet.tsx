import React, { useState } from 'react';
import type { Item, User } from '../types';
import { WhatsAppService } from '../services/whatsappService';
import {
  X,
  Send,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface DirectMessageSheetProps {
  item: Item;
  currentUser: User;
  onClose: () => void;
  onSendMessage: (itemId: string, text: string) => void;
  onShareAddress: (itemId: string, address: string, instructions: string) => void;
  onMarkPickedUp: (itemId: string) => void;
}

const QUICK_REPLIES = [
  "I'm on my way! (ETA 15 min)",
  'Picked up from porch, thank you! ❤️',
  'Item is ready on the porch!',
  'Running about 10 minutes late.',
];

export const DirectMessageSheet: React.FC<DirectMessageSheetProps> = ({
  item,
  currentUser,
  onClose,
  onSendMessage,
  onShareAddress,
  onMarkPickedUp,
}) => {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const isGiver = item.giverId === currentUser.id;

  // Determine chat partner
  const otherUserName = isGiver
    ? item.requests.find((r) => r.userId === item.selectedRequesterId)?.userName ||
      item.requests[0]?.userName ||
      'Neighbor'
    : item.giverName;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(item.id, inputText.trim());
    setInputText('');
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Bar with Item Context (Zero loss of context) */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
              <span>Chatting with <strong>{otherUserName}</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={WhatsAppService.getDirectClaimUrl(item, 'pickup coordination')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2 py-1 rounded-lg transition-colors"
            title="Continue this chat in WhatsApp"
          >
            WhatsApp
          </a>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Giver Fast Action Ribbon */}
      {isGiver && (
        <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-950">Giver Actions:</span>
          <div className="flex items-center gap-2">
            {!item.pickupDetails ? (
              <button
                onClick={() =>
                  onShareAddress(
                    item.id,
                    '742 Evergreen Terrace (front porch)',
                    'Item is under the covered porch by the red door. No need to ring bell.'
                  )
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <MapPin className="w-3 h-3" />
                1-Click Share Address
              </button>
            ) : item.status !== 'picked_up' ? (
              <button
                onClick={() => onMarkPickedUp(item.id)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3" />
                Mark Picked Up
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        {/* Intro Notification */}
        <div className="text-center py-2">
          <span className="text-[11px] bg-slate-200/70 text-slate-600 font-medium px-2.5 py-1 rounded-full">
            Direct chat for "{item.title}"
          </span>
        </div>

        {/* Message Items */}
        {item.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          // If this is an Address Card event
          if (msg.addressCard) {
            return (
              <div
                key={msg.id}
                className="my-3 bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 shadow-xs"
              >
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Porch Pickup Address Confirmed</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">{msg.addressCard.address}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{msg.addressCard.instructions}</p>

                <div className="mt-2.5 pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyAddress(msg.addressCard!.address)}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Address
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-[10px] text-slate-400 font-medium">
                  {isMe ? 'You' : msg.senderName}
                </span>
                <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reply Chips */}
      <div className="px-3 pt-2 pb-1 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {QUICK_REPLIES.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(item.id, reply)}
            className="whitespace-nowrap text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${otherUserName}...`}
          className="flex-1 text-xs px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
