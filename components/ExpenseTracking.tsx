'use client';

import { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Expense } from '@/types';
import { Plus, X, Receipt, Eye, FileText, Download, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { exportExpenseToExcel, exportExpenseToPDF } from '@/utils/export';

function ExpenseForm({ 
  expense, 
  onClose 
}: { 
  expense?: Expense; 
  onClose: () => void;
}) {
  const { addExpense, projects, budgets, currencies } = useFinancial();
  const [formData, setFormData] = useState({
    projectId: expense?.projectId || '',
    budgetId: expense?.budgetId || '',
    amount: expense?.amount || 0,
    currencyId: expense?.currencyId || currencies.find(c => c.isDefault)?.id || '',
    description: expense?.description || '',
    date: expense?.date || format(new Date(), 'yyyy-MM-dd'),
    requestedBy: expense?.requestedBy || '',
    approvedBy: expense?.approvedBy || '',
    authorizedBy: expense?.authorizedBy || '',
    status: expense?.status || 'pending' as Expense['status'],
  });

  const availableBudgets = budgets.filter(b => b.projectId === formData.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Track Daily Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  setFormData({ ...formData, projectId: e.target.value, budgetId: '' });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget *
              </label>
              <select
                value={formData.budgetId}
                onChange={(e) => setFormData({ ...formData, budgetId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!formData.projectId}
              >
                <option value="">Select a budget</option>
                {availableBudgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    Budget #{budget.id.slice(-6)} - {currencies.find(c => c.id === budget.currencyId)?.symbol}{budget.amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                value={formData.currencyId}
                onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Expense *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested By *
              </label>
              <input
                type="text"
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approved By
              </label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authorized By
              </label>
              <input
                type="text"
                value={formData.authorizedBy}
                onChange={(e) => setFormData({ ...formData, authorizedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpenseViewModal({ 
  expense, 
  onClose 
}: { 
  expense: Expense; 
  onClose: () => void;
}) {
  const { projects, budgets, currencies } = useFinancial();
  
  const project = projects.find(p => p.id === expense.projectId);
  const budget = budgets.find(b => b.id === expense.budgetId);
  const currency = currencies.find(c => c.id === expense.currencyId);

  const handleExportExcel = () => {
    exportExpenseToExcel(expense, project, budget, currency);
  };

  const handleExportPDF = () => {
    exportExpenseToPDF(expense, project, budget, currency);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Expense Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Project</label>
              <p className="text-gray-900 font-semibold">{project?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Amount</label>
              <p className="text-gray-900 font-semibold">
                {currency?.symbol}{expense.amount.toLocaleString()} {currency?.code}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-gray-900">{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className={`font-semibold ${
                expense.status === 'authorized' ? 'text-green-600' :
                expense.status === 'approved' ? 'text-blue-600' :
                expense.status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Requested By</label>
              <p className="text-gray-900">{expense.requestedBy}</p>
            </div>
            {expense.approvedBy && (
              <div>
                <label className="text-sm font-medium text-gray-500">Approved By</label>
                <p className="text-gray-900">{expense.approvedBy}</p>
              </div>
            )}
            {expense.authorizedBy && (
              <div>
                <label className="text-sm font-medium text-gray-500">Authorized By</label>
                <p className="text-gray-900">{expense.authorizedBy}</p>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900">{expense.description}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            onClick={handleExportExcel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpenseTracking() {
  const { expenses, projects, currencies } = useFinancial();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState<Expense | undefined>();
  const [filterProject, setFilterProject] = useState<string>('all');

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const getCurrencySymbol = (currencyId: string) => {
    return currencies.find(c => c.id === currencyId)?.symbol || '$';
  };

  const filteredExpenses = filterProject === 'all' 
    ? expenses 
    : expenses.filter(e => e.projectId === filterProject);

  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No expenses tracked yet</p>
          <p className="text-sm mt-2">Click "Add Expense" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => {
            const projectName = getProjectName(expense.projectId);
            const currencySymbol = getCurrencySymbol(expense.currencyId);
            
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {expense.isLocked && (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{projectName}</span>
                      <span>•</span>
                      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        expense.status === 'authorized' ? 'text-green-600' :
                        expense.status === 'approved' ? 'text-blue-600' :
                        expense.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {expense.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>Requested by: {expense.requestedBy}</span>
                      {expense.approvedBy && <span>• Approved by: {expense.approvedBy}</span>}
                      {expense.authorizedBy && <span>• Authorized by: {expense.authorizedBy}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-red-600">
                    -{currencySymbol}{expense.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => setViewingExpense(expense)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View and Export"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <ExpenseForm onClose={() => setIsFormOpen(false)} />
      )}

      {viewingExpense && (
        <ExpenseViewModal expense={viewingExpense} onClose={() => setViewingExpense(undefined)} />
      )}
    </div>
  );
}

