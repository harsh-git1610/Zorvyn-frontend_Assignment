import type { Transaction } from '../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { isInMonth, getLast6Months, getDayOfWeek, WEEKDAY_NAMES } from './dateHelpers';
import { formatCurrency } from './formatCurrency';
import { format, parseISO } from 'date-fns';

interface InsightCard {
  id: string;
  title: string;
  value: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  icon: string;
}

export function generateInsights(transactions: Transaction[]): InsightCard[] {
  const insights: InsightCard[] = [];
  const now = new Date();
  const months = getLast6Months();
  const currentMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];

  const thisMonthTx = transactions.filter(t => isInMonth(t.date, currentMonth));
  const lastMonthTx = transactions.filter(t => isInMonth(t.date, lastMonth));

  const thisMonthExpenses = thisMonthTx.filter(t => t.type === 'expense');
  const lastMonthExpenses = lastMonthTx.filter(t => t.type === 'expense');

  // Highest spend category this month
  const categorySpend: Record<string, number> = {};
  thisMonthExpenses.forEach(t => {
    categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      id: 'top-category',
      title: 'Top Spending Category',
      value: topCategory[0],
      description: `Your highest spend category this month is ${topCategory[0]} at ${formatCurrency(topCategory[1])}`,
      type: 'info',
      icon: 'chart-bar',
    });
  }

  // Category comparison with last month
  const lastMonthCatSpend: Record<string, number> = {};
  lastMonthExpenses.forEach(t => {
    lastMonthCatSpend[t.category] = (lastMonthCatSpend[t.category] || 0) + t.amount;
  });
  
  for (const cat of EXPENSE_CATEGORIES) {
    const current = categorySpend[cat] || 0;
    const previous = lastMonthCatSpend[cat] || 0;
    if (previous > 0 && current > previous) {
      const pctIncrease = ((current - previous) / previous * 100).toFixed(0);
      if (Number(pctIncrease) > 15) {
        insights.push({
          id: `cat-increase-${cat}`,
          title: `${cat} Spending Up`,
          value: `+${pctIncrease}%`,
          description: `You spent ${pctIncrease}% more on ${cat} compared to last month`,
          type: 'warning',
          icon: 'trending-up',
        });
        break;
      }
    }
  }

  // Pending transactions
  const pending = transactions.filter(t => t.status === 'pending');
  if (pending.length > 0) {
    const pendingTotal = pending.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: 'pending',
      title: 'Pending Transactions',
      value: `${pending.length}`,
      description: `You have ${pending.length} pending transactions worth ${formatCurrency(pendingTotal)}`,
      type: 'warning',
      icon: 'clock',
    });
  }

  // Savings rate
  const thisMonthIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const thisMonthExpenseTotal = thisMonthExpenses.reduce((s, t) => s + t.amount, 0);
  if (thisMonthIncome > 0) {
    const savingsRate = ((thisMonthIncome - thisMonthExpenseTotal) / thisMonthIncome * 100).toFixed(1);
    
    // 3-month average
    const last3Months = months.slice(-3);
    let totalSavingsRate = 0;
    let monthsWithData = 0;
    last3Months.forEach(m => {
      const mTx = transactions.filter(t => isInMonth(t.date, m));
      const mInc = mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const mExp = mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      if (mInc > 0) {
        totalSavingsRate += (mInc - mExp) / mInc * 100;
        monthsWithData++;
      }
    });
    const avgRate = monthsWithData > 0 ? totalSavingsRate / monthsWithData : 0;
    const comparison = Number(savingsRate) >= avgRate ? 'above' : 'below';

    insights.push({
      id: 'savings-rate',
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      description: `Your savings rate this month is ${savingsRate}% — ${comparison} your 3-month average`,
      type: Number(savingsRate) >= avgRate ? 'success' : 'danger',
      icon: 'coin',
    });
  }

  // Most active spending day
  const daySpend: Record<number, number> = {};
  const dayCounts: Record<number, number> = {};
  thisMonthExpenses.forEach(t => {
    const day = getDayOfWeek(t.date);
    daySpend[day] = (daySpend[day] || 0) + t.amount;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
  if (topDay) {
    insights.push({
      id: 'active-day',
      title: 'Most Active Day',
      value: WEEKDAY_NAMES[Number(topDay[0])],
      description: `Your most active spending day is ${WEEKDAY_NAMES[Number(topDay[0])]}`,
      type: 'info',
      icon: 'calendar',
    });
  }

  // Biggest single expense
  if (thisMonthExpenses.length > 0) {
    const biggest = thisMonthExpenses.reduce((max, t) => t.amount > max.amount ? t : max, thisMonthExpenses[0]);
    insights.push({
      id: 'biggest-expense',
      title: 'Biggest Expense',
      value: formatCurrency(biggest.amount),
      description: `Biggest single expense: ${biggest.description} on ${format(parseISO(biggest.date), 'dd MMM')} for ${formatCurrency(biggest.amount)}`,
      type: 'danger',
      icon: 'receipt',
    });
  }

  return insights;
}

export function getWeekdayHeatmapData(transactions: Transaction[]): { day: string; avgSpend: number; totalSpend: number; count: number }[] {
  const dayData: Record<number, { total: number; count: number }> = {};
  
  for (let i = 0; i < 7; i++) {
    dayData[i] = { total: 0, count: 0 };
  }

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const day = getDayOfWeek(t.date);
      dayData[day].total += t.amount;
      dayData[day].count += 1;
    });

  return WEEKDAY_NAMES.map((name, i) => ({
    day: name,
    avgSpend: dayData[i].count > 0 ? Math.round(dayData[i].total / dayData[i].count) : 0,
    totalSpend: dayData[i].total,
    count: dayData[i].count,
  }));
}
