import React, { useState } from 'react';
import type { Item, User } from '../types';
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Send,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ItemModalProps {
  item: Item;
  currentUser: User;
  onClose: () => void;
  onRequestItem: (itemId: string, proposedTime: string, note: string) => void;
  onSelectRequester: (itemId: string, requesterId: string) => void;
  onShareAddress: (itemId: string, address: string, instructions: string) => void;
  onMarkPickedUp: (itemId: string) => void;
  onReopenItem: (itemId: string) => void;
  onOpenChat: (item: Item) => void;
}

const PICKUP_TIME_PRESETS = [
  'Today 5:00 – 7:00 PM',
  'Tomorrow morning (9–11 AM)',
  'Tomorrow afternoon',
  'Flexible anytime this weekend',
];

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  currentUser,
  onClose,
  onRequestItem,
  onSelectRequester,
  onShareAddress,
  onMarkPickedUp,
  onReopenItem,
  onOpenChat,
}) => {
  const isGiver = item.giverId === currentUser.id;
  const existingRequest = item.requests.find((r) => r.userId === currentUser.id);
  const isSelected = item.selectedRequesterId === currentUser.id;
  const selectedRequester = item.requests.find((r) => r.userId === item.selectedRequesterId);

  // Form states for requesting
  const [proposedTime, setProposedTime] = useState(PICKUP_TIME_PRESETS[0]);
  const [customNote, setCustomNote] = useState('');

  // Address sharing form for giver
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState(item.pickupDetails?.address || '742 Evergreen Terrace (porch)');
  const [instructions, setInstructions] = useState(
    item.pickupDetails?.instructions || 'Item is on the porch to the right of the front door.'
  );

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestItem(item.id, proposedTime, customNote);
  };

  const handleShareAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShareAddress(item.id, address, instructions);
    setShowAddressForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              {item.category}
            </span>
            {item.status === 'available' && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
              </span>
            )}
            {item.status === 'pending' && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending Pickup
              </span>
            )}
            {item.status === 'picked_up' && (
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Picked Up
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Main Visual & Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 relative shadow-inner">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">{item.title}</h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.description}</p>
              </div>

              {/* Hyperlocal Neighbor Badge */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.giverAvatar}
                    alt={item.giverName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{item.giverName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {item.neighborhood} ({item.distance})
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Listed</span>
                  <span className="text-xs font-medium text-slate-700">{item.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              CASE 1: CURRENT USER IS THE GIVER (MANAGING PICKUP)
              ======================================================== */}
          {isGiver && (
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Neighbor Requests</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {item.requests.length} interested
                  </span>
                </h3>

                {/* Giver Action: If pending pickup, quick actions to finalize or re-open */}
                {item.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReopenItem(item.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
                      title="If neighbor flaked, re-open item back to Available"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Flaked? Re-offer
                    </button>
                    <button
                      onClick={() => onMarkPickedUp(item.id)}
                      className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 px-3 py-1.5 rounded-lg shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Picked Up
                    </button>
                  </div>
                )}
              </div>

              {item.requests.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No requests yet</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                    {item.daysOld >= 2
                      ? 'This item is in the "Still Needs a Home" tab so neighbors can easily spot and claim it.'
                      : 'Neighbors in Maplewood North will see this in their feed.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {item.requests.map((req) => {
                    const isThisSelected = item.selectedRequesterId === req.userId;
                    return (
                      <div
                        key={req.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isThisSelected
                            ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={req.userAvatar}
                              alt={req.userName}
                              className="w-8 h-8 rounded-full object-cover mt-0.5"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{req.userName}</span>
                                <span className="text-[11px] text-slate-500">{req.requestedAt}</span>
                                {isThisSelected && (
                                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                                    Selected for Pickup
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-medium text-emerald-800 mt-1 bg-emerald-100/70 inline-block px-2 py-0.5 rounded">
                                Can pick up: {req.proposedTime}
                              </div>
                              {req.note && (
                                <p className="text-xs text-slate-600 mt-1 italic">"{req.note}"</p>
                              )}
                            </div>
                          </div>

                          {/* Giver Action for this neighbor */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isThisSelected ? (
                              <button
                                onClick={() => onSelectRequester(item.id, req.userId)}
                                className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Select Neighbor
                              </button>
                            ) : (
                              <button
                                onClick={() => onOpenChat(item)}
                                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Open Chat
                              </button>
                            )}
                          </div>
                        </div>

                        {/* If this neighbor is selected, show porch address card / button */}
                        {isThisSelected && (
                          <div className="mt-3 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                            <div className="text-emerald-900">
                              <span className="font-semibold">Pickup Address: </span>
                              {item.pickupDetails ? (
                                <span>{item.pickupDetails.address}</span>
                              ) : (
                                <span className="text-slate-500 italic">Not sent yet</span>
                              )}
                            </div>
                            <button
                              onClick={() => setShowAddressForm(!showAddressForm)}
                              className="font-semibold text-emerald-700 hover:text-emerald-900 underline"
                            >
                              {item.pickupDetails ? 'Edit / Resend' : 'Send Pickup Address'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Address Form Drawer for Giver */}
              {showAddressForm && (
                <form
                  onSubmit={handleShareAddressSubmit}
                  className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-3 animate-in fade-in duration-150"
                >
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Share Porch Pickup Address Privately with {selectedRequester?.userName}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Street Address / Porch Location
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="e.g. 742 Evergreen Terrace (porch)"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Specific Instructions (Porch code, where item is sitting)
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Under covered porch by red door. No need to ring bell."
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs px-3.5 py-1.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send to Chat
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              CASE 2: CURRENT USER IS A NEIGHBOR (REQUESTING / CHATTING)
              ======================================================== */}
          {!isGiver && (
            <div className="border-t border-slate-200 pt-5">
              {item.status === 'picked_up' ? (
                <div className="text-center py-6 bg-slate-50 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">This item has been picked up</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Check back for more gifts in Maplewood North!
                  </p>
                </div>
              ) : existingRequest ? (
                /* User has already requested */
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-2xl border ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                            ✓
                          </div>
                        ) : (
                          <Clock className="w-5 h-5 text-slate-400" />
                        )}
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {isSelected
                              ? 'You have been selected for pickup!'
                              : 'Request submitted'}
                          </div>
                          <div className="text-xs text-slate-600">
                            Your proposed pickup: <strong>{existingRequest.proposedTime}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenChat(item)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Direct Chat</span>
                      </button>
                    </div>

                    {/* If selected and address available */}
                    {isSelected && item.pickupDetails && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-emerald-950 bg-white/80 p-3 rounded-xl">
                        <div className="font-bold flex items-center gap-1 text-emerald-800 mb-1">
                          <MapPin className="w-3.5 h-3.5" /> Porch Pickup Details:
                        </div>
                        <p className="font-semibold">{item.pickupDetails.address}</p>
                        <p className="text-slate-600 mt-0.5">{item.pickupDetails.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* New request form: Clean, fast, zero friction */
                <form onSubmit={handleSendRequest} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Request this item</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tell {item.giverName.split(' ')[0]} when you can pick up. No comment spam.
                    </p>
                  </div>

                  {/* Pickup Window Presets */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      When can you pick up?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PICKUP_TIME_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset}
                          onClick={() => setProposedTime(preset)}
                          className={`text-xs p-2.5 rounded-xl border text-left font-medium transition-all ${
                            proposedTime === preset
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Optional note to {item.giverName.split(' ')[0]}
                    </label>
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g. I live two blocks away on Elm St!"
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>I'd love to pick this up</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
