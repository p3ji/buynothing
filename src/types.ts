export type ItemStatus = 'available' | 'pending' | 'picked_up';

export interface NotificationPreferences {
  smsPickupAlerts: boolean;
  emailDailyDigest: boolean;
  browserPush: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  neighborhood: string;
  joinedDate: string;
  giveCount: number;
  pickupCount: number;
  verifiedStatus: 'verified_resident' | 'pending_verification';
  verificationMethod: 'sms_phone' | 'neighbor_vouch' | 'address_pin';
  phoneMasked: string;
  reliabilityScore: number; // percentage (e.g. 98%)
  savedPorchAddress?: {
    street: string;
    instructions: string;
  };
  notificationPreferences: NotificationPreferences;
}

export interface ItemRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  requestedAt: string;
  proposedTime: string;
  note?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  text: string;
  isSystemEvent?: boolean;
  addressCard?: {
    address: string;
    instructions: string;
  };
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: 'Home & Kitchen' | 'Kids & Baby' | 'Furniture' | 'Outdoor & Garden' | 'Books & Media' | 'Other';
  imageUrl: string;
  giverId: string;
  giverName: string;
  giverAvatar: string;
  neighborhood: string;
  distance: string;
  createdAt: string;
  daysOld: number;
  status: ItemStatus;
  selectedRequesterId?: string;
  pickupDetails?: {
    address: string;
    instructions: string;
  };
  requests: ItemRequest[];
  messages: ChatMessage[];
}
