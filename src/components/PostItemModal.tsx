import React, { useState } from 'react';
import type { User, Item } from '../types';
import { X, Camera, Sparkles, MapPin } from 'lucide-react';

interface PostItemModalProps {
  currentUser: User;
  onClose: () => void;
  onPostItem: (newItem: Partial<Item>) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Coffee Maker',
    url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Succulent Planters',
    url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Children Books',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vintage Lamp',
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
  },
];

export const PostItemModal: React.FC<PostItemModalProps> = ({
  currentUser,
  onClose,
  onPostItem,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Item['category']>('Home & Kitchen');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onPostItem({
      title: title.trim(),
      category,
      description: description.trim() || 'Free to a neighbor in good condition.',
      imageUrl,
      neighborhood: currentUser.neighborhood,
      distance: '0.2 mi',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">Give an Item to Neighbors</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              What are you giving?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cuisinart 12-Cup Drip Coffee Maker"
              className="w-full text-sm p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Item['category'])}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Kids & Baby">Kids & Baby</option>
              <option value="Furniture">Furniture</option>
              <option value="Outdoor & Garden">Outdoor & Garden</option>
              <option value="Books & Media">Books & Media</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Photo Picker with 1-click sample presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-slate-500" /> Photo (pick a sample or paste image link)
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {SAMPLE_PHOTO_PRESETS.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => setImageUrl(preset.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    imageUrl === preset.url
                      ? 'border-emerald-500 ring-2 ring-emerald-300'
                      : 'border-slate-200 hover:opacity-80'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste custom image URL"
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description / Condition
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Good working condition, slight cosmetic wear, clean..."
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Neighborhood note */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Posting to <strong>{currentUser.neighborhood}</strong> neighbors.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Post Item for Free
          </button>
        </form>
      </div>
    </div>
  );
};
