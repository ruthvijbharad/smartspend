import React from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type RecentTransactionsProps = {
  transactions: Transaction[];
  limit?: number;
};

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions,
  limit = 5
}) => {
  const limitedTransactions = transactions.slice(0, limit);

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Salary': 'bg-blue-100 text-blue-800',
      'Freelance': 'bg-indigo-100 text-indigo-800',
      'Investments': 'bg-purple-100 text-purple-800',
      'Gifts': 'bg-pink-100 text-pink-800',
      'Other Income': 'bg-teal-100 text-teal-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Housing': 'bg-amber-100 text-amber-800',
      'Transportation': 'bg-lime-100 text-lime-800',
      'Entertainment': 'bg-violet-100 text-violet-800',
      'Shopping': 'bg-rose-100 text-rose-800',
      'Utilities': 'bg-cyan-100 text-cyan-800',
      'Healthcare': 'bg-emerald-100 text-emerald-800',
      'Education': 'bg-sky-100 text-sky-800',
      'Personal Care': 'bg-fuchsia-100 text-fuchsia-800',
      'Travel': 'bg-yellow-100 text-yellow-800',
      'Other Expenses': 'bg-slate-100 text-slate-800',
    };

    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  if (transactions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-base font-medium mb-3">Recent Transactions</h3>
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <Calendar className="h-12 w-12 mb-2 text-gray-400" />
          <p>No transactions yet</p>
          <p className="text-sm">Add your first transaction to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-base font-medium mb-3">Recent Transactions</h3>
      <div className="space-y-3">
        {limitedTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white border">
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <div className="flex items-center">
                  <span className={`badge ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
            </div>
            <div className={`text-base font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};