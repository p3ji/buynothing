import type { User, Item } from '../types';

export const CURRENT_USERS: User[] = [
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    joinedDate: 'March 2024',
    giveCount: 28,
    pickupCount: 14,
    verifiedStatus: 'verified_resident',
    verificationMethod: 'sms_phone',
    phoneMasked: '(555) •••-4821',
    reliabilityScore: 100,
    savedPorchAddress: {
      street: '742 Evergreen Terrace (front porch)',
      instructions: 'Under covered porch to the right of red door. No need to ring bell.',
    },
    notificationPreferences: {
      smsPickupAlerts: true,
      emailDailyDigest: false,
      browserPush: true,
    },
  },
  {
    id: 'user-dave',
    name: 'Dave Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    joinedDate: 'September 2024',
    giveCount: 5,
    pickupCount: 8,
    verifiedStatus: 'verified_resident',
    verificationMethod: 'neighbor_vouch',
    phoneMasked: '(555) •••-1934',
    reliabilityScore: 95,
    savedPorchAddress: {
      street: '18 Elmwood Road (driveway side entrance)',
      instructions: 'Beside side door on the driveway.',
    },
    notificationPreferences: {
      smsPickupAlerts: true,
      emailDailyDigest: true,
      browserPush: true,
    },
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood Heights',
    joinedDate: 'January 2024',
    giveCount: 12,
    pickupCount: 9,
    verifiedStatus: 'verified_resident',
    verificationMethod: 'sms_phone',
    phoneMasked: '(555) •••-8820',
    reliabilityScore: 100,
    savedPorchAddress: {
      street: '93 Highland Ave',
      instructions: 'Porch bench near mailbox.',
    },
    notificationPreferences: {
      smsPickupAlerts: true,
      emailDailyDigest: false,
      browserPush: false,
    },
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'Solid Wood Toddler High Chair',
    description: 'Sturdy solid pine chair. Has minor scuffs from toddler use but structurally sound and wiped clean. Tray is removable.',
    category: 'Kids & Baby',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    giverId: 'user-sarah',
    giverName: 'Sarah Jenkins',
    giverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    distance: '0.3 mi',
    createdAt: '3 hours ago',
    daysOld: 0.1,
    status: 'available',
    pickupDetails: {
      address: '742 Evergreen Terrace (front porch)',
      instructions: 'Under covered porch to the right of red door. No need to ring bell.'
    },
    requests: [
      {
        id: 'req-1',
        userId: 'user-dave',
        userName: 'Dave Miller',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        requestedAt: '2 hours ago',
        proposedTime: 'Today 5:30 – 7:00 PM',
        note: 'Our 1-year-old just outgrew her booster, this would be amazing!',
        status: 'pending'
      },
      {
        id: 'req-2',
        userId: 'user-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        requestedAt: '1 hour ago',
        proposedTime: 'Tomorrow morning before 10 AM',
        note: 'Can pick up quickly if first neighbor passes.',
        status: 'pending'
      }
    ],
    messages: [
      {
        id: 'm1',
        senderId: 'user-dave',
        senderName: 'Dave Miller',
        timestamp: '2 hours ago',
        text: "Hi Sarah! I'd love to pick this up for our daughter. Can come by today between 5:30 and 7:00 PM if chosen!"
      }
    ]
  },
  {
    id: 'item-2',
    title: 'Instant Pot Duo 7-in-1 (6 Quart)',
    description: 'Works perfectly, includes silicone ring and steamer basket. Downsizing kitchen gadgets.',
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80',
    giverId: 'user-dave',
    giverName: 'Dave Miller',
    giverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    distance: '0.5 mi',
    createdAt: '1 day ago',
    daysOld: 1.0,
    status: 'pending',
    selectedRequesterId: 'user-elena',
    pickupDetails: {
      address: '18 Elmwood Road (garage driveway)',
      instructions: 'Box is placed beside the side door by driveway.'
    },
    requests: [
      {
        id: 'req-3',
        userId: 'user-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        requestedAt: '1 day ago',
        proposedTime: 'Today around 4:00 PM',
        note: 'Making winter soups, would put it to great use!',
        status: 'accepted'
      }
    ],
    messages: [
      {
        id: 'm2',
        senderId: 'user-elena',
        senderName: 'Elena Rostova',
        timestamp: '1 day ago',
        text: 'Hi Dave, would love this! Can pick up around 4pm today.'
      },
      {
        id: 'm3',
        senderId: 'user-dave',
        senderName: 'Dave Miller',
        timestamp: '20 hours ago',
        text: 'All yours Elena! Sending the porch pickup details now.'
      },
      {
        id: 'm4',
        senderId: 'user-dave',
        senderName: 'Dave Miller',
        timestamp: '20 hours ago',
        text: 'Pickup details shared',
        isSystemEvent: true,
        addressCard: {
          address: '18 Elmwood Road (garage driveway)',
          instructions: 'Box is placed beside the side door by driveway.'
        }
      }
    ]
  },
  {
    id: 'item-3',
    title: 'Box of 12 Terracotta Garden Pots (Assorted Sizes)',
    description: 'Clean, no cracks. Great for repotting herbs and succulents this spring. Free to whoever can take the whole box.',
    category: 'Outdoor & Garden',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
    giverId: 'user-sarah',
    giverName: 'Sarah Jenkins',
    giverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    distance: '0.3 mi',
    createdAt: '4 days ago',
    daysOld: 4.2,
    status: 'available',
    requests: [],
    messages: []
  },
  {
    id: 'item-4',
    title: 'DeWalt Cordless Drill Case & Bit Set (Case Only)',
    description: 'Empty yellow blow-mold case plus miscellaneous drill bits. Fits 20V compact drill.',
    category: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    giverId: 'user-elena',
    giverName: 'Elena Rostova',
    giverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood Heights',
    distance: '0.8 mi',
    createdAt: '5 days ago',
    daysOld: 5.0,
    status: 'available',
    requests: [],
    messages: []
  },
  {
    id: 'item-5',
    title: 'Board Games: Catan & Ticket to Ride',
    description: 'All pieces accounted for and in good condition. Played a handful of times with family.',
    category: 'Books & Media',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80',
    giverId: 'user-dave',
    giverName: 'Dave Miller',
    giverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    distance: '0.5 mi',
    createdAt: '2 days ago',
    daysOld: 2.0,
    status: 'picked_up',
    requests: [],
    messages: []
  },
  {
    id: 'item-6',
    title: 'Mid-Century Style Floor Lamp',
    description: 'Brass finish with warm white linen drum shade. Foot switch works great.',
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    giverId: 'user-sarah',
    giverName: 'Sarah Jenkins',
    giverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    neighborhood: 'Maplewood North',
    distance: '0.3 mi',
    createdAt: '5 hours ago',
    daysOld: 0.2,
    status: 'available',
    requests: [
      {
        id: 'req-4',
        userId: 'user-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        requestedAt: '3 hours ago',
        proposedTime: 'Can pick up Saturday afternoon',
        note: 'Perfect reading light for our living room.',
        status: 'pending'
      }
    ],
    messages: []
  }
];
