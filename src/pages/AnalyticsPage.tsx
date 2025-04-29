import React, { useEffect, useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { AnalyticsSummary } from '../components/analytics/AnalyticsSummary';
import { ChartSection } from '../components/analytics/ChartSection';
import { CategoryBreakdown } from '../components/analytics/CategoryBreakdown';
import { getTransactions } from '../services/transactionService';
import { 
  calculateTotals, 
  getDailyTransactions, 
  getWeeklyTransactions, 
  getMonthlyTransactions 
} from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await getTransactions(user.id);
      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error(`Error fetching transactions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    switch (period) {
      case 'daily':
        return getDailyTransactions(transactions);
      case 'weekly':
        return getWeeklyTransactions(transactions);
      case 'monthly':
        return getMonthlyTransactions(transactions);
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();
  const { income, expense, balance } = calculateTotals(filteredTransactions);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Visualize your financial data and insights</p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                period === 'daily'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-2 text-sm font-medium ${
                period === 'weekly'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white text-gray-700 border-y border-gray-300 hover:bg-gray-50'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                period === 'monthly'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <AnalyticsSummary 
          income={income}
          expense={expense}
          balance={balance}
          period={period}
        />

        <ChartSection transactions={filteredTransactions} period={period} />

        <CategoryBreakdown transactions={filteredTransactions} />
      </div>
    </Layout>
  );
};