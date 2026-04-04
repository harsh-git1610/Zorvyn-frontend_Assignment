import type { Transaction } from '../context/AppContext';
import { subMonths, format } from 'date-fns';

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const expenseMerchants: { description: string; category: string; minAmount: number; maxAmount: number }[] = [
  { description: 'Swiggy', category: 'Food', minAmount: 150, maxAmount: 800 },
  { description: 'Zomato', category: 'Food', minAmount: 200, maxAmount: 1200 },
  { description: 'McDonald\'s', category: 'Food', minAmount: 200, maxAmount: 600 },
  { description: 'Starbucks', category: 'Food', minAmount: 350, maxAmount: 700 },
  { description: 'Bigbasket', category: 'Food', minAmount: 800, maxAmount: 3500 },
  { description: 'Uber', category: 'Transport', minAmount: 100, maxAmount: 800 },
  { description: 'Ola', category: 'Transport', minAmount: 80, maxAmount: 500 },
  { description: 'Rapido', category: 'Transport', minAmount: 50, maxAmount: 250 },
  { description: 'Indian Oil Petrol', category: 'Transport', minAmount: 1000, maxAmount: 4000 },
  { description: 'Metro Card Recharge', category: 'Transport', minAmount: 500, maxAmount: 1000 },
  { description: 'Netflix', category: 'Entertainment', minAmount: 199, maxAmount: 649 },
  { description: 'Spotify', category: 'Entertainment', minAmount: 119, maxAmount: 179 },
  { description: 'PVR Cinemas', category: 'Entertainment', minAmount: 300, maxAmount: 1200 },
  { description: 'Hotstar', category: 'Entertainment', minAmount: 299, maxAmount: 1499 },
  { description: 'Amazon', category: 'Shopping', minAmount: 500, maxAmount: 8000 },
  { description: 'Flipkart', category: 'Shopping', minAmount: 400, maxAmount: 6000 },
  { description: 'Myntra', category: 'Shopping', minAmount: 800, maxAmount: 4000 },
  { description: 'Reliance Digital', category: 'Shopping', minAmount: 2000, maxAmount: 15000 },
  { description: 'Croma', category: 'Shopping', minAmount: 1500, maxAmount: 12000 },
  { description: 'Apollo Pharmacy', category: 'Healthcare', minAmount: 200, maxAmount: 2500 },
  { description: 'Dr. Consultation', category: 'Healthcare', minAmount: 500, maxAmount: 2000 },
  { description: 'Practo', category: 'Healthcare', minAmount: 300, maxAmount: 1500 },
  { description: 'Electricity Bill', category: 'Utilities', minAmount: 800, maxAmount: 3500 },
  { description: 'Jio Recharge', category: 'Utilities', minAmount: 239, maxAmount: 999 },
  { description: 'Airtel Broadband', category: 'Utilities', minAmount: 799, maxAmount: 1499 },
  { description: 'Water Bill', category: 'Utilities', minAmount: 200, maxAmount: 800 },
  { description: 'Gas Bill', category: 'Utilities', minAmount: 400, maxAmount: 1200 },
  { description: 'Udemy Course', category: 'Education', minAmount: 399, maxAmount: 3499 },
  { description: 'Coursera Subscription', category: 'Education', minAmount: 2000, maxAmount: 4000 },
  { description: 'Book Purchase', category: 'Education', minAmount: 200, maxAmount: 1500 },
  { description: 'Gym Membership', category: 'Other', minAmount: 1000, maxAmount: 3000 },
  { description: 'Haircut', category: 'Other', minAmount: 200, maxAmount: 800 },
  { description: 'Laundry', category: 'Other', minAmount: 150, maxAmount: 500 },
];

const incomeSources: { description: string; category: string; minAmount: number; maxAmount: number }[] = [
  { description: 'Monthly Salary', category: 'Salary', minAmount: 65000, maxAmount: 85000 },
  { description: 'Freelance Project', category: 'Freelance', minAmount: 8000, maxAmount: 35000 },
  { description: 'Web Dev Project', category: 'Freelance', minAmount: 10000, maxAmount: 50000 },
  { description: 'Stock Dividends', category: 'Investment', minAmount: 2000, maxAmount: 8000 },
  { description: 'Mutual Fund Returns', category: 'Investment', minAmount: 3000, maxAmount: 12000 },
  { description: 'Fixed Deposit Interest', category: 'Investment', minAmount: 1500, maxAmount: 5000 },
];

const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'] as const;
const statuses = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'pending', 'failed'] as const;

const notes = [
  'Monthly subscription',
  'One-time purchase',
  'Shared with friends',
  'Business expense',
  'Personal use',
  'Gift',
  'Emergency',
  'Planned purchase',
  '',
  '',
  '',
  '',
];

export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate for each of the last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthStart = subMonths(now, monthOffset);
    const monthStartDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    const monthEndDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    
    // 3-5 income transactions per month
    const incomeCount = randomInt(3, 5);
    for (let i = 0; i < incomeCount; i++) {
      const source = randomChoice(incomeSources);
      const date = randomDate(monthStartDate, monthEndDate);
      transactions.push({
        id: uuid(),
        date: format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        description: source.description,
        amount: randomInt(source.minAmount, source.maxAmount),
        type: 'income',
        category: source.category,
        status: 'completed',
        paymentMethod: randomChoice(['Net Banking', 'UPI'] as const),
        note: i === 0 ? 'Monthly credit' : randomChoice(notes),
      });
    }

    // 5-8 expense transactions per month
    const expenseCount = randomInt(5, 8);
    const usedMerchants = new Set<number>();
    for (let i = 0; i < expenseCount; i++) {
      let merchantIdx: number;
      do {
        merchantIdx = randomInt(0, expenseMerchants.length - 1);
      } while (usedMerchants.has(merchantIdx) && usedMerchants.size < expenseMerchants.length);
      usedMerchants.add(merchantIdx);
      
      const merchant = expenseMerchants[merchantIdx];
      const date = randomDate(monthStartDate, monthEndDate);
      transactions.push({
        id: uuid(),
        date: format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        description: merchant.description,
        amount: randomInt(merchant.minAmount, merchant.maxAmount),
        type: 'expense',
        category: merchant.category,
        status: randomChoice(statuses),
        paymentMethod: randomChoice(paymentMethods),
        note: randomChoice(notes),
      });
    }
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return transactions;
}
