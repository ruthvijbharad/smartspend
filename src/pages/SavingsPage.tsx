import React, { useEffect, useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { SavingsForm } from '../components/savings/SavingsForm';
import { 
  PiggyBank, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  getSavings, 
  addSaving, 
  updateSaving, 
  deleteSaving 
} from '../services/savingsService';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const SavingsPage: React.FC = () => {
  const { user } = useAuth();
  const [savings, setSavings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSaving, setEditingSaving] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavings();
  }, [user]);

  const fetchSavings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await getSavings(user.id);
      if (error) throw error;
      setSavings(data || []);
    } catch (error: any) {
      toast.error(`Error fetching savings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSaving = async (saving: any) => {
    try {
      const { error } = await addSaving(saving);
      if (error) throw error;
      
      toast.success('Savings goal added successfully');
      fetchSavings();
      setShowForm(false);
    } catch (error: any) {
      toast.error(`Error adding savings goal: ${error.message}`);
    }
  };

  const handleUpdateSaving = async (saving: any) => {
    try {
      const { id, ...updates } = saving;
      const { error } = await updateSaving(id, updates);
      if (error) throw error;
      
      toast.success('Savings goal updated successfully');
      fetchSavings();
      setEditingSaving(null);
      setShowForm(false);
    } catch (error: any) {
      toast.error(`Error updating savings goal: ${error.message}`);
    }
  };

  const handleDeleteSaving = async (id: string) => {
    if (!confirm('Are you sure you want to delete this savings goal?')) return;
    
    try {
      const { error } = await deleteSaving(id);
      if (error) throw error;
      
      toast.success('Savings goal deleted successfully');
      fetchSavings();
    } catch (error: any) {
      toast.error(`Error deleting savings goal: ${error.message}`);
    }
  };

  const handleEditClick = (saving: any) => {
    setEditingSaving(saving);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSaving(null);
  };

  // Calculate total savings across all goals
  const totalSaved = savings.reduce((sum: number, saving: any) => sum + saving.amount, 0);
  const totalTargets = savings.reduce((sum: number, saving: any) => sum + saving.target, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
            <p className="text-gray-600">Track your progress towards financial goals</p>
          </div>
          <button
            onClick={() => {
              setEditingSaving(null);
              setShowForm(!showForm);
            }}
            className="btn btn-primary flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Goal
          </button>
        </div>

        {showForm && (
          <div className="animate-fadeIn">
            <SavingsForm 
              onSubmit={editingSaving ? handleUpdateSaving : handleAddSaving}
              initialData={editingSaving}
              isEditing={!!editingSaving}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Summary Card */}
        {!loading && savings.length > 0 && (
          <div className="card bg-gradient-to-br from-accent-600 to-accent-500 text-white">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-accent-400 bg-opacity-30 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-accent-100">Total Savings</h3>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(totalSaved)}</p>
                <div className="mt-1 text-sm">
                  {totalTargets > 0 && (
                    <span>
                      {((totalSaved / totalTargets) * 100).toFixed(1)}% of {formatCurrency(totalTargets)} target
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading savings goals...</p>
          </div>
        ) : savings.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-8 text-gray-500">
            <PiggyBank className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No savings goals yet</h3>
            <p className="text-gray-500 mt-1 mb-4">Create your first savings goal to track your progress</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savings.map((saving: any) => {
              const progressPercent = Math.min((saving.amount / saving.target) * 100, 100);
              
              return (
                <div key={saving.id} className="card hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
                        <PiggyBank className="h-5 w-5 text-accent-600" />
                      </div>
                      <h3 className="ml-3 text-lg font-medium">{saving.title}</h3>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditClick(saving)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100"
                        aria-label="Edit saving"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSaving(saving.id)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100"
                        aria-label="Delete saving"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Current</span>
                      <span className="font-medium text-accent-600">{formatCurrency(saving.amount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Target</span>
                      <span className="font-medium">{formatCurrency(saving.target)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-accent-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {formatCurrency(saving.target - saving.amount)} remaining
                      </span>
                      <span className="font-medium text-accent-600">
                        {progressPercent.toFixed(0)}%
                      </span>
                    </div>
                    
                    {progressPercent >= 100 && (
                      <div className="mt-3 bg-green-100 text-green-800 rounded-md p-2 flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Goal reached! Congratulations!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};