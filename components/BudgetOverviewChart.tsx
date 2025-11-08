'use client';

import { useFinancial } from '@/context/FinancialContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

export default function BudgetOverviewChart() {
  const { 
    getTotalRemainingBudget, 
    getTotalExpenses, 
    getTotalContingencyBudget,
    projects,
    getRemainingBudgetByProject,
    getTotalExpensesByProject,
    currencies,
    getDefaultCurrency
  } = useFinancial();

  const totalRemaining = getTotalRemainingBudget();
  const totalExpenses = getTotalExpenses();
  const contingencyBudget = getTotalContingencyBudget();
  const defaultCurrency = getDefaultCurrency();

  // Prepare data for pie chart
  const chartData = [
    { name: 'Total Remaining Budget', value: Math.max(0, totalRemaining), color: '#10b981' },
    { name: 'Total Expenses', value: Math.max(0, totalExpenses), color: '#ef4444' },
    { name: 'Contingency Budget', value: Math.max(0, contingencyBudget), color: '#3b82f6' },
  ].filter(item => item.value > 0);

  // Project-wise breakdown for contingency
  const projectBreakdown = projects.map(project => ({
    projectId: project.id,
    projectName: project.name,
    remainingBudget: getRemainingBudgetByProject(project.id),
    totalExpenses: getTotalExpensesByProject(project.id),
  })).filter(p => p.remainingBudget > 0 || p.totalExpenses > 0);

  const formatCurrency = (amount: number) => {
    const symbol = defaultCurrency?.symbol || '$';
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 sm:p-6 backdrop-blur-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Budget Overview</h2>
      
      {chartData.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-base sm:text-lg font-medium text-slate-600">No budget data available</p>
          <p className="text-xs sm:text-sm mt-2 text-slate-500">Add projects and budgets to see the overview</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Remaining Budget</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-700 break-words">{formatCurrency(totalRemaining)}</p>
            </div>
            
            <div className="p-4 sm:p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-700" />
                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Total Expenses</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-red-700 break-words">{formatCurrency(totalExpenses)}</p>
            </div>
            
            <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Contingency Budget</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700 break-words">{formatCurrency(contingencyBudget)}</p>
            </div>
          </div>

          <div className="h-64 sm:h-80 mb-4 sm:mb-6 bg-slate-50 rounded-lg p-2 sm:p-4 border border-slate-200 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const { name, percent } = props;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ color: '#1e293b', fontWeight: '500', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {projectBreakdown.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Project-Wise Budget Overview</h3>
              <div className="space-y-2">
                {projectBreakdown.map((project) => (
                  <div key={project.projectId} className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">{project.projectName}</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="text-slate-600">
                          Expenses: <span className="font-bold text-red-700">{formatCurrency(project.totalExpenses)}</span>
                        </span>
                        <span className="text-slate-600">
                          Remaining: <span className={`font-bold ${project.remainingBudget >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {formatCurrency(project.remainingBudget)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

