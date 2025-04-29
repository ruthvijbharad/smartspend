import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

type AnalyticsSummaryProps = {
  income: number;
  expense: number;
  balance: number;
  period: 'daily' | 'weekly' | 'monthly';
};

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  income,
  expense,
  balance,
  period,
}) => {
  const getPeriodText = () => {
    switch (period) {
      case 'daily':
        return 'Last 7 Days';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {getPeriodText()} Income
            </h3>
            <p className="text-xl font-semibold mt-1 text-green-600">
              {formatCurrency(income)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {getPeriodText()} Expenses
            </h3>
            <p className="text-xl font-semibold mt-1 text-red-600">
              {formatCurrency(expense)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {getPeriodText()} Balance
            </h3>
            <p className={`text-xl font-semibold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className={`h-10 w-10 rounded-full ${balance >= 0 ? 'bg-blue-100' : 'bg-red-100'} flex items-center justify-center`}>
            <Wallet className={`h-5 w-5 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};