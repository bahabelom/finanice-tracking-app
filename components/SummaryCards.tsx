'use client';

import { useTransactions } from '@/context/TransactionContext';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function SummaryCards() {
  const { getTotalIncome, getTotalExpenses, getBalance } = useTransactions();

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance = getBalance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-blue-100">Total Balance</h3>
          <Wallet className="w-5 h-5 text-blue-200" />
        </div>
        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        <p className="text-sm text-blue-100 mt-1">
          {balance >= 0 ? 'Positive' : 'Negative'} balance
        </p>
      </div>

      {/* Income Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-100">Total Income</h3>
          <TrendingUp className="w-5 h-5 text-green-200" />
        </div>
        <p className="text-3xl font-bold">{formatCurrency(income)}</p>
        <p className="text-sm text-green-100 mt-1">All time income</p>
      </div>

      {/* Expenses Card */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-red-100">Total Expenses</h3>
          <TrendingDown className="w-5 h-5 text-red-200" />
        </div>
        <p className="text-3xl font-bold">{formatCurrency(expenses)}</p>
        <p className="text-sm text-red-100 mt-1">All time expenses</p>
      </div>
    </div>
  );
}

