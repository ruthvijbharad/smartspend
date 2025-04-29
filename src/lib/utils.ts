import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Format currency in Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date: string): string => {
  return format(new Date(date), 'dd MMM yyyy');
};

// Get transaction categories
export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other Income'
];

export const expenseCategories = [
  'Food',
  'Housing',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Education',
  'Personal Care',
  'Travel',
  'Other Expenses'
];

// Filter transactions by date range
export const getTransactionsForDateRange = (
  transactions: any[],
  startDate: Date, 
  endDate: Date
) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Get daily transactions (last 7 days)
export const getDailyTransactions = (transactions: any[]) => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);
  return getTransactionsForDateRange(transactions, sevenDaysAgo, today);
};

// Get weekly transactions (current week)
export const getWeeklyTransactions = (transactions: any[]) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  return getTransactionsForDateRange(transactions, weekStart, weekEnd);
};

// Get monthly transactions (current month)
export const getMonthlyTransactions = (transactions: any[]) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  return getTransactionsForDateRange(transactions, monthStart, monthEnd);
};

// Calculate total income and expenses
export const calculateTotals = (transactions: any[]) => {
  const totals = {
    income: 0,
    expense: 0,
    balance: 0
  };

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totals.income += transaction.amount;
    } else {
      totals.expense += transaction.amount;
    }
  });

  totals.balance = totals.income - totals.expense;
  return totals;
};

// Get budget status
export const getBudgetStatus = (budget: number, expenses: number) => {
  const percentUsed = (expenses / budget) * 100;
  
  if (percentUsed >= 100) {
    return { status: 'exceeded', percent: percentUsed };
  } else if (percentUsed >= 80) {
    return { status: 'warning', percent: percentUsed };
  } else {
    return { status: 'good', percent: percentUsed };
  }
};