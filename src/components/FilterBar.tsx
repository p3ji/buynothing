import React from 'react';
import { Search, Sparkles, Clock, UserCheck } from 'lucide-react';

export type FilterTab = 'all' | 'unclaimed' | 'pending' | 'mine';

interface FilterBarProps {
  currentTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  unclaimedCount: number;
  availableCount: number;
}

const CATEGORIES = [
  'All',
  'Home & Kitchen',
  'Kids & Baby',
  'Furniture',
  'Outdoor & Garden',
  'Books & Media',
  'Other',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  unclaimedCount,
  availableCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Primary Lifecycle View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTabChange('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Available</span>
            <span
              className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                currentTab === 'all' ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {availableCount}
            </span>
          </button>

          {/* Solves the message board bury problem: items unclaimed for > 2 days */}
          <button
            onClick={() => onTabChange('unclaimed')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'unclaimed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100/60 border border-amber-300 bg-amber-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Unclaimed (2+ days)</span>
            <span
              className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                currentTab === 'unclaimed' ? 'bg-amber-700 text-amber-100' : 'bg-amber-200 text-amber-900'
              }`}
            >
              {unclaimedCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'pending'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Pickup</span>
          </button>

          <button
            onClick={() => onTabChange('mine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'mine'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Activity</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`whitespace-nowrap px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
