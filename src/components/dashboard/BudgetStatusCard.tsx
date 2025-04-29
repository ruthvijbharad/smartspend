import React from 'react';
import { Target } from 'lucide-react';
import { formatCurrency, getBudgetStatus } from '../../lib/utils';

type BudgetStatusCardProps = {
  budget: number;
  expenses: number;
};

export const BudgetStatusCard: React.FC<BudgetStatusCardProps> = ({ budget, expenses }) => {
  const { status, percent } = getBudgetStatus(budget, expenses);
  
  const getStatusColor = () => {
    switch (status) {
      case 'exceeded':
        return {
          text: 'text-red-600',
          bg: 'bg-red-600',
          light: 'bg-red-100',
        };
      case 'warning':
        return {
          text: 'text-amber-600',
          bg: 'bg-amber-600',
          light: 'bg-amber-100',
        };
      default:
        return {
          text: 'text-green-600',
          bg: 'bg-green-600',
          light: 'bg-green-100',
        };
    }
  };

  const colors = getStatusColor();
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium">Monthly Budget</h3>
        <div className={`h-8 w-8 rounded-full ${colors.light} flex items-center justify-center`}>
          <Target className={`h-4 w-4 ${colors.text}`} />
        </div>
      </div>
      
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">
          {formatCurrency(expenses)} of {formatCurrency(budget)}
        </span>
        <span className={`text-sm font-medium ${colors.text}`}>
          {percent.toFixed(0)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${colors.bg} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        ></div>
      </div>
      
      {status === 'exceeded' && (
        <p className="mt-2 text-sm text-red-600">
          You've exceeded your monthly budget!
        </p>
      )}
      
      {status === 'warning' && (
        <p className="mt-2 text-sm text-amber-600">
          You're approaching your monthly budget limit.
        </p>
      )}
      
      {status === 'good' && (
        <p className="mt-2 text-sm text-green-600">
          Your spending is within the budget.
        </p>
      )}
    </div>
  );
};