import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
};

type ChartSectionProps = {
  transactions: Transaction[];
  period: 'daily' | 'weekly' | 'monthly';
};

export const ChartSection: React.FC<ChartSectionProps> = ({ transactions, period }) => {
  const prepareCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const { category, amount } = transaction;
        if (categoryMap[category]) {
          categoryMap[category] += amount;
        } else {
          categoryMap[category] = amount;
        }
      });
    
    const categories = Object.keys(categoryMap);
    const amounts = categories.map(category => categoryMap[category]);
    
    const backgroundColors = [
      '#262626', // primary-950
      '#3d3d3d', // primary-900
      '#454545', // primary-800
      '#4f4f4f', // primary-700
      '#5d5d5d', // primary-600
      '#6d6d6d', // primary-500
      '#888888', // primary-400
      '#b0b0b0', // primary-300
      '#d1d1d1', // primary-200
      '#e7e7e7', // primary-100
      '#f6f6f6', // primary-50
    ];
    
    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: backgroundColors.slice(0, categories.length),
          borderWidth: 1,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  const prepareTimeSeriesData = () => {
    let days = 7;
    let dateFormat = 'MMM d';
    
    if (period === 'weekly') {
      days = 7;
    } else if (period === 'monthly') {
      days = 30;
      dateFormat = 'MMM d';
    } else {
      days = 7;
    }
    
    const labels = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1);
      return format(date, dateFormat);
    });
    
    const incomeData = Array(days).fill(0);
    const expenseData = Array(days).fill(0);
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const differenceInDays = Math.floor(
        (today.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24)
      );
      
      if (differenceInDays < days) {
        const index = days - differenceInDays - 1;
        if (transaction.type === 'income') {
          incomeData[index] += transaction.amount;
        } else {
          expenseData[index] += transaction.amount;
        }
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#262626',
          backgroundColor: 'rgba(38, 38, 38, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#4f4f4f',
          backgroundColor: 'rgba(79, 79, 79, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const categoryData = prepareCategoryData();
  const timeSeriesData = prepareTimeSeriesData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#262626',
        titleFont: {
          family: 'Inter',
          size: 14,
        },
        bodyFont: {
          family: 'Inter',
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
    },
  };

  const isEmpty = transactions.length === 0;

  if (isEmpty) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm p-4 h-64 flex flex-col items-center justify-center">
          <p className="text-gray-500">No data available for {period} expense breakdown</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 h-64 flex flex-col items-center justify-center">
          <p className="text-gray-500">No data available for {period} trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-base font-medium mb-6 text-gray-900">Expense Breakdown by Category</h3>
        <div className="h-64">
          <Doughnut 
            data={categoryData} 
            options={{
              ...options,
              cutout: '70%',
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  position: 'bottom',
                },
              },
            }} 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-base font-medium mb-6 text-gray-900">
          {period.charAt(0).toUpperCase() + period.slice(1)} Income & Expenses
        </h3>
        <div className="h-64">
          <Line data={timeSeriesData} options={options} />
        </div>
      </div>
    </div>
  );
};