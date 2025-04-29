import React, { useEffect, useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { BudgetStatusCard } from '../components/dashboard/BudgetStatusCard';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { SavingsGoals } from '../components/dashboard/SavingsGoals';
import { getCurrentBudget } from '../services/budgetService';
import { getTransactions } from '../services/transactionService';
import { getSavings } from '../services/savingsService';
import { 
  calculateTotals, 
  getMonthlyTransactions, 
} from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await getTransactions(user.id);
        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Fetch budget
        const { data: budgetData, error: budgetError } = await getCurrentBudget(user.id);
        if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;
        setBudget(budgetData?.amount || 0);

        // Fetch savings
        const { data: savingsData, error: savingsError } = await getSavings(user.id);
        if (savingsError) throw savingsError;
        setSavings(savingsData || []);
      } catch (error: any) {
        toast.error(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate totals
  const { income, expense, balance } = calculateTotals(transactions);

  // Get monthly expenses for budget comparison
  const monthlyTransactions = getMonthlyTransactions(transactions);
  const { expense: monthlyExpense } = calculateTotals(monthlyTransactions);

  if (loading && !user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Smart Spend. Here's your financial overview.</p>
        </div>

        <BalanceCard income={income} expense={expense} balance={balance} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BudgetStatusCard budget={budget} expenses={monthlyExpense} />
          <SavingsGoals savings={savings} />
        </div>

        <RecentTransactions transactions={transactions} />
      </div>
    </Layout>
  );
};