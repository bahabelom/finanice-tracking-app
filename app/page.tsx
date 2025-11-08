'use client';

import { useState } from 'react';
import BudgetOverviewChart from '@/components/BudgetOverviewChart';
import ExpenseTracking from '@/components/ExpenseTracking';
import BudgetManagement from '@/components/BudgetManagement';
import ProjectManagement from '@/components/ProjectManagement';
import CurrencyManagement from '@/components/CurrencyManagement';
import ProjectStaffManagement from '@/components/ProjectStaffManagement';
import { Receipt, DollarSign, FolderOpen, Coins, LayoutDashboard, Users } from 'lucide-react';

type TabType = 'dashboard' | 'expenses' | 'budgets' | 'projects' | 'currencies' | 'staff';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses' as TabType, label: 'Expenses', icon: Receipt },
    { id: 'budgets' as TabType, label: 'Budgets', icon: DollarSign },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderOpen },
    { id: 'staff' as TabType, label: 'Project Staff', icon: Users },
    { id: 'currencies' as TabType, label: 'Currencies', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Financial Tracker
            </h1>
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <BudgetOverviewChart />
          </div>
        )}
        
        {activeTab === 'expenses' && (
          <ExpenseTracking />
        )}
        
        {activeTab === 'budgets' && (
          <BudgetManagement />
        )}
        
        {activeTab === 'projects' && (
          <ProjectManagement />
        )}
        
        {activeTab === 'staff' && (
          <ProjectStaffManagement />
        )}
        
        {activeTab === 'currencies' && (
          <CurrencyManagement />
        )}
      </div>
    </div>
  );
}
