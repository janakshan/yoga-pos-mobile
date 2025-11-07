/**
 * Dashboard Types
 * Type definitions for dashboard data and metrics
 */

import {Branch, POSTransaction} from './api.types';

// Time Period for filtering
export type TimePeriod = 'today' | 'week' | 'month';

// Dashboard Metrics
export interface DashboardMetrics {
  revenue: RevenueMetrics;
  members: MemberMetrics;
  classes: ClassMetrics;
  transactions: TransactionMetrics;
  inventory: InventoryMetrics;
  branches: BranchMetrics;
  orders: OrderMetrics;
}

export interface RevenueMetrics {
  today: number;
  week: number;
  month: number;
  percentageChange: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MemberMetrics {
  active: number;
  total: number;
  new: number;
  percentageChange: number;
}

export interface ClassMetrics {
  today: number;
  completed: number;
  inProgress: number;
  upcoming: number;
}

export interface TransactionMetrics {
  today: number;
  week: number;
  month: number;
  averageValue: number;
}

export interface InventoryMetrics {
  lowStock: number;
  outOfStock: number;
  totalProducts: number;
}

export interface BranchMetrics {
  total: number;
  active: number;
  topPerforming: BranchPerformance[];
}

export interface BranchPerformance {
  branch: Branch;
  revenue: number;
  transactions: number;
  percentageOfTotal: number;
}

export interface OrderMetrics {
  pending: number;
  completed: number;
  cancelled: number;
}

// Class Schedule Types
export interface YogaClass {
  id: string;
  name: string;
  instructor: Instructor;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  capacity: number;
  enrolled: number;
  available: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  type: string; // e.g., 'Hatha', 'Vinyasa', 'Yin', 'Power', 'Restorative'
  branchId: string;
  branchName?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  room?: string;
  description?: string;
  price?: number;
}

export interface Instructor {
  id: string;
  name: string;
  avatar?: string;
  specialization?: string[];
  rating?: number;
}

// Recent Transactions
export interface RecentTransaction extends POSTransaction {
  customerName?: string;
  customerAvatar?: string;
  itemCount: number;
  paymentMethod: string;
  relativeTime: string; // e.g., "5 minutes ago"
}

// Activity Feed Types
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  icon: string;
  iconColor: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

export type ActivityType =
  | 'sale'
  | 'refund'
  | 'new_member'
  | 'class_booking'
  | 'class_cancellation'
  | 'inventory_alert'
  | 'low_stock'
  | 'product_added'
  | 'user_login'
  | 'user_logout'
  | 'payment_received'
  | 'order_completed'
  | 'system';

// Dashboard Data Response
export interface DashboardData {
  metrics: DashboardMetrics;
  todayClasses: YogaClass[];
  recentTransactions: RecentTransaction[];
  activityFeed: ActivityItem[];
  quickStats: QuickStats;
}

export interface QuickStats {
  totalRevenue: number;
  activeMembers: number;
  classesToday: number;
  branchCount: number;
  pendingOrders: number;
  lowStockAlerts: number;
}

// Chart Configuration
export interface ChartConfig {
  type: 'line' | 'bar' | 'area';
  data: ChartDataPoint[];
  color: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
}

// Filter Options
export interface DashboardFilters {
  timePeriod: TimePeriod;
  branchId?: string;
  branchIds?: string[];
}

// Refresh State
export interface RefreshState {
  isRefreshing: boolean;
  lastRefreshed: Date | null;
  error: string | null;
}
