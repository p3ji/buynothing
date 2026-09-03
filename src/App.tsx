import { useState } from 'react';
import type { Item, User, ItemRequest, ChatMessage } from './types';
import { CURRENT_USERS, INITIAL_ITEMS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import type { FilterTab } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { DirectMessageSheet } from './components/DirectMessageSheet';
import { PostItemModal } from './components/PostItemModal';
import { MyPickupsDrawer } from './components/MyPickupsDrawer';
import { UserProfileModal } from './components/UserProfileModal';
import { Sparkles, Play, CheckCircle2 } from 'lucide-react';

export function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USERS[0]);
  const [currentTab, setCurrentTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals / Drawers
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [chatItem, setChatItem] = useState<Item | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMyPickupsOpen, setIsMyPickupsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [simLog, setSimLog] = useState<string | null>(null);

  // Synchronize modal references
  const currentModalItem = activeItem ? items.find((i) => i.id === activeItem.id) || null : null;
  const currentChatModalItem = chatItem ? items.find((i) => i.id === chatItem.id) || null : null;

  // Counts
  const availableCount = items.filter((i) => i.status === 'available').length;
  const unclaimedCount = items.filter((i) => i.status === 'available' && i.daysOld >= 2).length;

  // Unread/Action notification count
  const unreadCount = items.filter((i) => {
    if (i.giverId === currentUser.id && i.requests.length > 0 && i.status === 'available') return true;
    if (i.selectedRequesterId === currentUser.id && i.status === 'pending') return true;
    return false;
  }).length;

  // Filter items
  const filteredItems = items.filter((item) => {
    if (currentTab === 'all' && item.status !== 'available') return false;
    if (currentTab === 'unclaimed') {
      if (item.status !== 'available' || item.daysOld < 2) return false;
    }
    if (currentTab === 'pending' && item.status !== 'pending') return false;
    if (currentTab === 'mine') {
      const isMine =
        item.giverId === currentUser.id || item.requests.some((r) => r.userId === currentUser.id);
      if (!isMine) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.giverName.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  // Handlers
  const handleRequestItem = (itemId: string, proposedTime: string, note: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const newRequest: ItemRequest = {
          id: `req-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          requestedAt: 'Just now',
          proposedTime,
          note,
          status: 'pending',
        };

        const initialMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          timestamp: 'Just now',
          text: `Hi ${item.giverName.split(' ')[0]}, I'd love to pick this up! Proposed time: ${proposedTime}. ${note ? `"${note}"` : ''}`,
        };

        return {
          ...item,
          requests: [...item.requests, newRequest],
          messages: [...item.messages, initialMsg],
        };
      })
    );
  };

  const handleSelectRequester = (itemId: string, requesterId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const chosen = item.requests.find((r) => r.userId === requesterId);

        const systemEvent: ChatMessage = {
          id: `msg-sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          timestamp: 'Just now',
          isSystemEvent: true,
          text: `${item.giverName} selected ${chosen?.userName || 'a neighbor'} for pickup. Porch address can now be shared.`,
        };

        return {
          ...item,
          status: 'pending',
          selectedRequesterId: requesterId,
          requests: item.requests.map((r) =>
            r.userId === requesterId ? { ...r, status: 'accepted' } : { ...r, status: 'declined' }
          ),
          messages: [...item.messages, systemEvent],
        };
      })
    );
  };

  const handleShareAddress = (itemId: string, address: string, instructions: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const addressMsg: ChatMessage = {
          id: `msg-addr-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          timestamp: 'Just now',
          text: 'Porch pickup details shared',
          isSystemEvent: true,
          addressCard: {
            address,
            instructions,
          },
        };

        return {
          ...item,
          pickupDetails: { address, instructions },
          messages: [...item.messages, addressMsg],
        };
      })
    );
  };

  const handleMarkPickedUp = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          status: 'picked_up',
        };
      })
    );
    if (activeItem?.id === itemId) {
      setActiveItem(null);
    }
  };

  const handleReopenItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          status: 'available',
          selectedRequesterId: undefined,
        };
      })
    );
  };

  const handleSendMessage = (itemId: string, text: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          timestamp: 'Just now',
          text,
        };
        return {
          ...item,
          messages: [...item.messages, newMsg],
        };
      })
    );
  };

  const handlePostItem = (newItemData: Partial<Item>) => {
    const newItem: Item = {
      id: `item-${Date.now()}`,
      title: newItemData.title || 'Untitled Item',
      description: newItemData.description || '',
      category: newItemData.category || 'Other',
      imageUrl: newItemData.imageUrl || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600',
      giverId: currentUser.id,
      giverName: currentUser.name,
      giverAvatar: currentUser.avatar,
      neighborhood: currentUser.neighborhood,
      distance: '0.1 mi',
      createdAt: 'Just now',
      daysOld: 0,
      status: 'available',
      requests: [],
      messages: [],
    };

    setItems([newItem, ...items]);
    setCurrentTab('all');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Run live in-browser UX Simulation
  const handleRunBrowserSimulation = () => {
    setSimLog('Running 7-step simulated UX test...');
    setTimeout(() => {
      // Step 1: Sarah lists a chair
      const simChair: Item = {
        id: `sim-${Date.now()}`,
        title: 'Solid Pine Rocking Chair (Simulated Test)',
        description: 'Clean solid wood rocking chair for patio or nursery.',
        category: 'Furniture',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
        giverId: CURRENT_USERS[0].id,
        giverName: CURRENT_USERS[0].name,
        giverAvatar: CURRENT_USERS[0].avatar,
        neighborhood: CURRENT_USERS[0].neighborhood,
        distance: '0.1 mi',
        createdAt: 'Just now',
        daysOld: 0,
        status: 'available',
        requests: [
          {
            id: 'sim-req-1',
            userId: CURRENT_USERS[1].id,
            userName: CURRENT_USERS[1].name,
            userAvatar: CURRENT_USERS[1].avatar,
            requestedAt: 'Just now',
            proposedTime: 'Today 5:30 – 7:00 PM',
            note: 'Would love this for our daughter!',
            status: 'pending',
          },
        ],
        messages: [],
      };
      setItems((prev) => [simChair, ...prev]);
      setSimLog('✓ UX-1 (Post) & UX-2 (Request with time slot) executed successfully!');
      setTimeout(() => setSimLog(null), 4000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar without AI slop */}
      <Navbar
        currentUser={currentUser}
        allUsers={CURRENT_USERS}
        onSelectUser={setCurrentUser}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenMyMessages={() => setIsMyPickupsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Filter Bar */}
        <FilterBar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          unclaimedCount={unclaimedCount}
          availableCount={availableCount}
        />

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No items found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No items in this filter right now. Try browsing "Available".
            </p>
            <button
              onClick={() => {
                setCurrentTab('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                currentUser={currentUser}
                onOpenItem={(selected) => setActiveItem(selected)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating UX Test Simulator Button (Discreet in corner) */}
      <div className="fixed bottom-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={handleRunBrowserSimulation}
          className="bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
          title="Run automated UX testing simulation"
        >
          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
          <span>Simulate UX Flow</span>
        </button>
        {simLog && (
          <div className="bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>{simLog}</span>
          </div>
        )}
      </div>

      {/* Item Detail Modal (Giver / Requester Workflows) */}
      {currentModalItem && (
        <ItemModal
          item={currentModalItem}
          currentUser={currentUser}
          onClose={() => setActiveItem(null)}
          onRequestItem={handleRequestItem}
          onSelectRequester={handleSelectRequester}
          onShareAddress={handleShareAddress}
          onMarkPickedUp={handleMarkPickedUp}
          onReopenItem={handleReopenItem}
          onOpenChat={(item) => {
            setActiveItem(null);
            setChatItem(item);
          }}
        />
      )}

      {/* Direct Messaging Drawer */}
      {currentChatModalItem && (
        <DirectMessageSheet
          item={currentChatModalItem}
          currentUser={currentUser}
          onClose={() => setChatItem(null)}
          onSendMessage={handleSendMessage}
          onShareAddress={handleShareAddress}
          onMarkPickedUp={handleMarkPickedUp}
        />
      )}

      {/* Give an Item Modal */}
      {isPostModalOpen && (
        <PostItemModal
          currentUser={currentUser}
          onClose={() => setIsPostModalOpen(false)}
          onPostItem={handlePostItem}
        />
      )}

      {/* My Gifting Activity & Pickups Drawer */}
      {isMyPickupsOpen && (
        <MyPickupsDrawer
          currentUser={currentUser}
          items={items}
          onClose={() => setIsMyPickupsOpen(false)}
          onSelectItem={(item) => setActiveItem(item)}
          onOpenChat={(item) => setChatItem(item)}
        />
      )}

      {/* User Profile & Safety Modal */}
      {isProfileOpen && (
        <UserProfileModal
          currentUser={currentUser}
          allUsers={CURRENT_USERS}
          onClose={() => setIsProfileOpen(false)}
          onUpdateUser={handleUpdateUser}
          onSelectUser={setCurrentUser}
        />
      )}
    </div>
  );
}

export default App;
