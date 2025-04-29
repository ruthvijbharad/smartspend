import React, { useEffect, useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionsList } from '../components/transactions/TransactionsList';
import { Plus, Filter } from 'lucide-react';
import { 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');
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

  const handleAddTransaction = async (transaction: any) => {
    try {
      const { error } = await addTransaction(transaction);
      if (error) throw error;
      
      toast.success('Transaction added successfully');
      fetchTransactions();
      setShowForm(false);
    } catch (error: any) {
      toast.error(`Error adding transaction: ${error.message}`);
    }
  };

  const handleUpdateTransaction = async (transaction: any) => {
    try {
      const { id, ...updates } = transaction;
      const { error } = await updateTransaction(id, updates);
      if (error) throw error;
      
      toast.success('Transaction updated successfully');
      fetchTransactions();
      setEditingTransaction(null);
    } catch (error: any) {
      toast.error(`Error updating transaction: ${error.message}`);
    }
  };

  const handleDeleteTransaction = async (transaction: any) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const { error } = await deleteTransaction(transaction.id);
      if (error) throw error;
      
      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (error: any) {
      toast.error(`Error deleting transaction: ${error.message}`);
    }
  };

  const handleEditClick = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter((transaction: any) => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Manage your income and expenses</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </button>
        </div>

        {showForm && (
          <div className="card animate-fadeIn">
            <TransactionForm 
              onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              initialData={editingTransaction}
              isEditing={!!editingTransaction}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-sm font-medium ${
                filterType === 'all' 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 text-sm font-medium ${
                filterType === 'income' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 text-sm font-medium ${
                filterType === 'expense' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : (
          <TransactionsList 
            transactions={filteredTransactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
          />
        )}
      </div>
    </Layout>
  );
};