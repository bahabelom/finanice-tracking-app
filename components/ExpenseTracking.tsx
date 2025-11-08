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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Track Daily Expense</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  setFormData({ ...formData, projectId: e.target.value, budgetId: '' });
                }}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Budget *
              </label>
              <select
                value={formData.budgetId}
                onChange={(e) => setFormData({ ...formData, budgetId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium disabled:bg-slate-100 disabled:text-slate-500"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Currency *
              </label>
              <select
                value={formData.currencyId}
                onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Date of Expense *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Requested By *
              </label>
              <input
                type="text"
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Approved By
              </label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Authorized By
              </label>
              <input
                type="text"
                value={formData.authorizedBy}
                onChange={(e) => setFormData({ ...formData, authorizedBy: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Expense Details</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-slate-600">Project</label>
              <p className="text-slate-900 font-bold text-lg mt-1">{project?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Amount</label>
              <p className="text-slate-900 font-bold text-lg mt-1">
                {currency?.symbol}{expense.amount.toLocaleString()} {currency?.code}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Date</label>
              <p className="text-slate-800 font-medium mt-1">{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Status</label>
              <p className={`font-bold text-lg mt-1 ${
                expense.status === 'authorized' ? 'text-green-700' :
                expense.status === 'approved' ? 'text-blue-700' :
                expense.status === 'rejected' ? 'text-red-700' :
                'text-yellow-700'
              }`}>
                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Requested By</label>
              <p className="text-slate-800 font-medium mt-1">{expense.requestedBy}</p>
            </div>
            {expense.approvedBy && (
              <div>
                <label className="text-sm font-semibold text-slate-600">Approved By</label>
                <p className="text-slate-800 font-medium mt-1">{expense.approvedBy}</p>
              </div>
            )}
            {expense.authorizedBy && (
              <div>
                <label className="text-sm font-semibold text-slate-600">Authorized By</label>
                <p className="text-slate-800 font-medium mt-1">{expense.authorizedBy}</p>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Description</label>
            <p className="text-slate-800 font-medium mt-1">{expense.description}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t-2 border-slate-200">
          <button
            onClick={handleExportExcel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg shadow-red-500/30"
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
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Receipt className="w-6 h-6 text-purple-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-600">No expenses tracked yet</p>
          <p className="text-sm mt-2 text-slate-500">Click "Add Expense" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => {
            const projectName = getProjectName(expense.projectId);
            const currencySymbol = getCurrencySymbol(expense.currencyId);
            
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-5 border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-lg bg-white transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  {expense.isLocked && (
                    <Lock className="w-5 h-5 text-slate-500" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{expense.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-slate-600 font-medium">{projectName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                      <span className="text-slate-400">•</span>
                      <span className={`font-semibold ${
                        expense.status === 'authorized' ? 'text-green-700' :
                        expense.status === 'approved' ? 'text-blue-700' :
                        expense.status === 'rejected' ? 'text-red-700' :
                        'text-yellow-700'
                      }`}>
                        {expense.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="font-medium">Requested by: <span className="text-slate-700">{expense.requestedBy}</span></span>
                      {expense.approvedBy && <span>• Approved by: <span className="text-slate-700">{expense.approvedBy}</span></span>}
                      {expense.authorizedBy && <span>• Authorized by: <span className="text-slate-700">{expense.authorizedBy}</span></span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-red-700">
                    -{currencySymbol}{expense.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => setViewingExpense(expense)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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

