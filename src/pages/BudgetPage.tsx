import React, { useEffect, useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { BudgetForm } from '../components/budget/BudgetForm';
import { BudgetStatusCard } from '../components/dashboard/BudgetStatusCard';
import { Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import { getCurrentBudget, setBudget } from '../services/budgetService';
import { getTransactions } from '../services/transactionService';
import { getMonthlyTransactions, calculateTotals, formatCurrency } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const BudgetPage: React.FC = () => {
  const { user } = useAuth();
  const [budget, setBudgetState] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch budget
      const { data: budgetData, error: budgetError } = await getCurrentBudget(user.id);
      if (budgetError) throw budgetError;
      setBudgetState(budgetData?.amount || 0);

      // Fetch transactions for monthly expense calculation
      const { data: transactionsData, error: transactionsError } = await getTransactions(user.id);
      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (budgetData: any) => {
    try {
      const { error } = await setBudget(budgetData);
      if (error) throw error;
      
      setBudgetState(budgetData.amount);
      toast.success('Budget set successfully');
      setShowForm(false);
    } catch (error: any) {
      toast.error(`Error setting budget: ${error.message}`);
    }
  };

  // Get monthly expenses for budget comparison
  const monthlyTransactions = getMonthlyTransactions(transactions);
  const { expense: monthlyExpense } = calculateTotals(monthlyTransactions);

  const currentMonth = format(new Date(), 'MMMM yyyy');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Manager</h1>
            <p className="text-gray-600">Set and track your monthly spending budget</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            {budget > 0 ? 'Update Budget' : 'Set Budget'}
          </button>
        </div>

        {showForm && (
          <div className="animate-fadeIn">
            <BudgetForm 
              onSubmit={handleSetBudget}
              initialAmount={budget}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading budget data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-base font-medium mb-4">Budget for {currentMonth}</h3>
                
                {budget > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Budget</span>
                      <span className="text-xl font-semibold text-teal-700">{formatCurrency(budget)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Spending</span>
                      <span className="text-xl font-semibold text-red-600">{formatCurrency(monthlyExpense)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-gray-600">Remaining</span>
                      <span className={`text-xl font-semibold ${budget - monthlyExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(budget - monthlyExpense)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                    <p className="font-medium text-gray-700">No budget set for this month</p>
                    <p className="text-sm mt-1">Set a budget to track your spending</p>
                  </div>
                )}
              </div>

              {budget > 0 && (
                <BudgetStatusCard budget={budget} expenses={monthlyExpense} />
              )}
            </div>

            <div className="card">
              <h3 className="text-base font-medium mb-4">Budget Tips</h3>
              <div className="space-y-3">
                <div className="flex p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Set realistic goals</p>
                    <p className="text-sm text-blue-700">Start with a budget that's achievable and adjust as needed.</p>
                  </div>
                </div>
                
                <div className="flex p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Track consistently</p>
                    <p className="text-sm text-green-700">Record all your expenses to get an accurate picture of your spending.</p>
                  </div>
                </div>
                
                <div className="flex p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-purple-800 font-medium">Prioritize savings</p>
                    <p className="text-sm text-purple-700">Aim to save at least 20% of your income before budgeting for other expenses.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};