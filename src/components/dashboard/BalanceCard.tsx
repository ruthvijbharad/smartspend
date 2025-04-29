import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

type BalanceCardProps = {
  income: number;
  expense: number;
  balance: number;
};

export const BalanceCard: React.FC<BalanceCardProps> = ({ income, expense, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card bg-gradient-to-br from-teal-700 to-teal-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-teal-100">Total Balance</h3>
            <p className="text-2xl font-semibold mt-1">{formatCurrency(balance)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Income</h3>
            <p className="text-xl font-semibold mt-1 text-green-600">{formatCurrency(income)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowUpRight className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Expenses</h3>
            <p className="text-xl font-semibold mt-1 text-red-600">{formatCurrency(expense)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <ArrowDownRight className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};