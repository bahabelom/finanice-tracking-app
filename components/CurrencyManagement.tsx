'use client';

import { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Currency } from '@/types';
import { Plus, Edit2, Trash2, X, Coins, AlertCircle } from 'lucide-react';

function CurrencyForm({ 
  currency, 
  onClose 
}: { 
  currency?: Currency; 
  onClose: () => void;
}) {
  const { addCurrency, updateCurrency } = useFinancial();
  const [formData, setFormData] = useState({
    code: currency?.code || '',
    name: currency?.name || '',
    symbol: currency?.symbol || '',
    isDefault: currency?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currency) {
      updateCurrency(currency.id, formData);
    } else {
      addCurrency(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currency ? 'Edit Currency' : 'Add Currency'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="USD, ETB, EUR, etc."
              maxLength={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="US Dollar, Ethiopian Birr, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol *
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="$, Br, €, etc."
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
              Set as default currency
            </label>
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
              {currency ? 'Update' : 'Add'} Currency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CurrencyManagement() {
  const { currencies, deleteCurrency } = useFinancial();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | undefined>();

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCurrency(undefined);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingCurrency(undefined);
  };

  const handleDelete = (currency: Currency) => {
    if (currency.isDefault) {
      alert('Cannot delete default currency');
      return;
    }
    if (confirm(`Are you sure you want to delete ${currency.name}?`)) {
      deleteCurrency(currency.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Coins className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Currencies</h2>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Currency
        </button>
      </div>

      {currencies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Coins className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No currencies registered yet</p>
          <p className="text-sm mt-2">Click "Add Currency" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">{currency.symbol}</span>
                    <span className="text-lg font-semibold text-gray-700">{currency.code}</span>
                    {currency.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{currency.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(currency)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {!currency.isDefault && (
                    <button
                      onClick={() => handleDelete(currency)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {currency.isDefault && (
                    <div className="p-2 text-gray-300 cursor-not-allowed">
                      <Trash2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <CurrencyForm currency={editingCurrency} onClose={handleClose} />
      )}
    </div>
  );
}

