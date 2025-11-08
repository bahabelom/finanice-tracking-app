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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Overview</h2>
      
      {chartData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No budget data available</p>
          <p className="text-sm mt-2">Add projects and budgets to see the overview</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-700">Remaining Budget</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRemaining)}</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-700">Total Expenses</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-700">Contingency Budget</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(contingencyBudget)}</p>
            </div>
          </div>

          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {projectBreakdown.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project-Wise Budget Overview</h3>
              <div className="space-y-2">
                {projectBreakdown.map((project) => (
                  <div key={project.projectId} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{project.projectName}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Expenses: <span className="font-semibold text-red-600">{formatCurrency(project.totalExpenses)}</span>
                        </span>
                        <span className="text-gray-600">
                          Remaining: <span className={`font-semibold ${project.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

