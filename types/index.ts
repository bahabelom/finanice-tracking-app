export type TransactionType = 'income' | 'expense';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isDefault?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  projectId: string;
  amount: number;
  currencyId: string;
  description?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  projectId: string;
  budgetId: string;
  amount: number;
  currencyId: string;
  description: string;
  date: string;
  requestedBy: string;
  approvedBy?: string;
  authorizedBy?: string;
  status: 'pending' | 'approved' | 'authorized' | 'rejected';
  createdAt: string;
  isLocked: boolean; // Once expense is made, it cannot be edited
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export const DEFAULT_CURRENCIES: Currency[] = [
  { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$', isDefault: true },
  { id: 'birr', code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', isDefault: false },
];

export const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', type: 'income', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#3b82f6' },
  { id: 'investment', name: 'Investment', type: 'income', color: '#8b5cf6' },
  { id: 'other-income', name: 'Other Income', type: 'income', color: '#06b6d4' },
  
  // Expense categories
  { id: 'food', name: 'Food & Dining', type: 'expense', color: '#ef4444' },
  { id: 'transport', name: 'Transportation', type: 'expense', color: '#f59e0b' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#ec4899' },
  { id: 'bills', name: 'Bills & Utilities', type: 'expense', color: '#6366f1' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#14b8a6' },
  { id: 'health', name: 'Health & Fitness', type: 'expense', color: '#84cc16' },
  { id: 'other-expense', name: 'Other Expense', type: 'expense', color: '#64748b' },
];

