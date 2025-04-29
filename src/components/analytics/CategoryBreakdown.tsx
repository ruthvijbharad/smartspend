import React, { useMemo } from 'react';
import { formatCurrency } from '../../lib/utils';

type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type CategoryBreakdownProps = {
  transactions: Transaction[];
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(transaction => {
      const { category, amount, type } = transaction;
      if (!categoryMap[category]) {
        categoryMap[category] = { income: 0, expense: 0 };
      }
      
      categoryMap[category][type] += amount;
    });
    
    const result = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      income: data.income,
      expense: data.expense,
      total: data.income - data.expense,
    }));
    
    return result.sort((a, b) => {
      // Sort by expense (highest first)
      return b.expense - a.expense;
    });
  }, [transactions]);

  if (categoryData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-base font-medium mb-4">Category Breakdown</h3>
        <div className="text-center py-4 text-gray-500">
          <p>No transaction data available</p>
        </div>
      </div>
    );
  }

  const totalExpense = categoryData.reduce((sum, item) => sum + item.expense, 0);

  return (
    <div className="card">
      <h3 className="text-base font-medium mb-4">Category Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categoryData.filter(item => item.expense > 0).map(({ category, expense }) => (
              <tr key={category} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                  {formatCurrency(expense)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-600 mr-2">
                      {((expense / totalExpense) * 100).toFixed(1)}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(expense / totalExpense) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};