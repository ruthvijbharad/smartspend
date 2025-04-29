import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { incomeCategories, expenseCategories } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

type TransactionFormProps = {
  onSubmit: (transaction: any) => void;
  initialData?: any;
  isEditing?: boolean;
  onCancel: () => void;
};

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount.toString(),
        category: initialData.category,
        description: initialData.description,
        date: initialData.date,
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, date: today }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type' && value !== formData.type) {
      // Reset category when type changes
      setFormData({ ...formData, [name]: value, category: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    const transaction = {
      ...initialData,
      user_id: user?.id,
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    };

    onSubmit(transaction);
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <div className="flex rounded-md overflow-hidden">
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                formData.type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'type', value: 'income' } } as any)}
            >
              Income
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                formData.type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'type', value: 'expense' } } as any)}
            >
              Expense
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="input pl-10"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="input pl-10"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="input pl-10"
            placeholder="Transaction description"
          />
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn ${formData.type === 'income' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          {isEditing ? 'Update' : 'Add'} {formData.type === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>
    </form>
  );
};