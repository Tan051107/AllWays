export type TabType = 'home' | 'itinerary' | 'today' | 'wallet' | 'group';

export type WalletSubView = 'history' | 'expense-details' | 'add-expense' | 'settlement' | 'budget';

export interface Traveler {
  id: string;
  name: string;
  shortName: string;
  role?: string;
  avatarBg: string;
  avatarText: string;
  photoUrl?: string;
  statusText: string;
  distance: string;
  battery: number;
  bufferText: string;
  bufferStatus: 'safe' | 'tight' | 'delayed';
  isPayerDefault?: boolean;
  accessibilityTag?: string;
  customPortion?: number;
}

export interface SplitMemberShare {
  memberId: string;
  name: string;
  amount: number;
  note?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  date: string;
  currency: string;
  totalAmount: number;
  paidByMemberId: string;
  paidByName: string;
  splitType: 'Custom Split' | 'Equal Split' | 'By Item' | 'Personal';
  participatingMemberIds: string[];
  shares: SplitMemberShare[];
  wayloNote?: string;
  isVerified?: boolean;
}

export interface SettlementDebt {
  id: string;
  fromName: string;
  toName: string;
  amount: number;
  currency: string;
  reason: string;
  paid: boolean;
  settlementStatus?: 'pending' | 'marked_paid' | 'confirmed';
}

export interface ItineraryStop {
  id: string;
  time: string;
  tag: string;
  title: string;
  subtitle: string;
  features: string[];
  badges: { label: string; type: 'green' | 'red' | 'neutral' | 'yellow' }[];
  votes: number;
  imageUrl?: string;
  isMustDo?: boolean;
  wayloRationale?: string;
  curatorNote?: string;
}

export interface BudgetSubstitution {
  id: string;
  type: string;
  title: string;
  originalName: string;
  originalCost: number;
  substituteName: string;
  substituteCost: number;
  savings: number;
  features: string[];
  selected: boolean;
}
