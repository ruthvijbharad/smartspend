import React, { useState, useEffect } from 'react';
import { PiggyBank, DollarSign, Target, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type SavingsFormProps = {
  onSubmit: (saving: any) => void;
  initialData?: any;
  isEditing?: boolean;
  onCancel: () => void;
};

export const SavingsForm: React.FC<SavingsFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    target: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        target: initialData.target.toString(),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saving = {
      ...initialData,
      user_id: user?.id,
      title: formData.title,
      amount: parseFloat(formData.amount),
      target: parseFloat(formData.target),
    };

    onSubmit(saving);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <PiggyBank className="h-6 w-6 text-accent-500 mr-2" />
        <h3 className="text-lg font-medium">{isEditing ? 'Edit' : 'Create'} Savings Goal</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input pl-10"
              placeholder="e.g., New Laptop, Emergency Fund"
            />
          </div>
        </div>

        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="target"
              name="target"
              min="0"
              step="1"
              required
              value={formData.target}
              onChange={handleChange}
              className="input pl-10"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Current Amount (₹)
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
              step="1"
              required
              value={formData.amount}
              onChange={handleChange}
              className="input pl-10"
              placeholder="0"
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
            className="btn btn-primary"
          >
            {isEditing ? 'Update' : 'Create'} Goal
          </button>
        </div>
      </form>
    </div>
  );
};