import React, { useState, useEffect } from 'react';
import { Target, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

type BudgetFormProps = {
  onSubmit: (budget: any) => void;
  initialAmount?: number;
  onCancel: () => void;
};

export const BudgetForm: React.FC<BudgetFormProps> = ({
  onSubmit,
  initialAmount = 0,
  onCancel,
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(initialAmount.toString());

  useEffect(() => {
    setAmount(initialAmount.toString());
  }, [initialAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' }).toLowerCase();
    const year = now.getFullYear();

    const budget = {
      user_id: user?.id,
      amount: parseFloat(amount),
      month,
      year,
    };

    onSubmit(budget);
  };

  const currentMonth = format(new Date(), 'MMMM yyyy');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-teal-700 mr-2" />
        <h3 className="text-lg font-medium">Set Budget for {currentMonth}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Budget Amount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              min="0"
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input pl-10"
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Set your monthly spending limit to help manage your expenses.
          </p>
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
            Save Budget
          </button>
        </div>
      </form>
    </div>
  );
};