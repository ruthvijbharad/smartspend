import React from 'react';
import { PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

type Saving = {
  id: string;
  title: string;
  amount: number;
  target: number;
};

type SavingsGoalsProps = {
  savings: Saving[];
};

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({ savings }) => {
  if (savings.length === 0) {
    return (
      <div className="card">
        <h3 className="text-base font-medium mb-3">Savings Goals</h3>
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <PiggyBank className="h-12 w-12 mb-2 text-gray-400" />
          <p>No savings goals yet</p>
          <p className="text-sm">Create a savings goal to track your progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-base font-medium mb-3">Savings Goals</h3>
      <div className="space-y-4">
        {savings.map((saving) => {
          const progressPercent = Math.min((saving.amount / saving.target) * 100, 100);
          
          return (
            <div key={saving.id} className="relative">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{saving.title}</span>
                <span>
                  {formatCurrency(saving.amount)} of {formatCurrency(saving.target)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-accent-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="mt-1 text-right text-sm text-gray-600">
                {progressPercent.toFixed(0)}% complete
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};