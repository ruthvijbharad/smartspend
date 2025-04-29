import React from 'react';
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type TransactionsListProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  onEdit,
  onDelete 
}) => {
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
      <div className="text-center py-8 text-gray-500">
        <p>No transactions found</p>
        <p className="text-sm mt-1">Add transactions to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {transactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`badge ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-3 sm:mt-0">
              <div className={`text-lg font-medium ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              } mr-4`}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </div>
              
              <div className="flex space-x-1">
                <button 
                  onClick={() => onEdit(transaction)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100"
                  aria-label="Edit transaction"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onDelete(transaction)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};