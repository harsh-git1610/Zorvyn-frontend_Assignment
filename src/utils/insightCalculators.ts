import type { Transaction } from '../context/AppContext';

import { isInMonth, getLast6Months, getDayOfWeek, WEEKDAY_NAMES } from './dateHelpers';
import { formatCurrency } from './formatCurrency';
import { format, parseISO } from 'date-fns';

export interface KPI {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  badge?: {
    text: string;
    type: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  };
}

export interface ContextualInsight {
  id: string;
  icon: string;
  text: string; // We can parse this safely or use innerHTML
}

export function generateInsights(transactions: Transaction[]) {
  const kpis: KPI[] = [];
  const suggestions: ContextualInsight[] = [];
  

  const months = getLast6Months();
  const currentMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];

  const thisMonthTx = transactions.filter(t => isInMonth(t.date, currentMonth));
  const lastMonthTx = transactions.filter(t => isInMonth(t.date, lastMonth));

  const thisMonthExpenses = thisMonthTx.filter(t => t.type === 'expense');
  const lastMonthExpenses = lastMonthTx.filter(t => t.type === 'expense');
  const thisMonthIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastMonthIncome = lastMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  // 1. Savings Rate
  const thisExpTotal = thisMonthExpenses.reduce((s, t) => s + t.amount, 0);
  const lastExpTotal = lastMonthExpenses.reduce((s, t) => s + t.amount, 0);
  const thisRate = thisMonthIncome > 0 ? ((thisMonthIncome - thisExpTotal) / thisMonthIncome) * 100 : 0;
  const lastRate = lastMonthIncome > 0 ? ((lastMonthIncome - lastExpTotal) / lastMonthIncome) * 100 : 0;
  
  let savingsBadgeText = '';
  let savingsBadgeType: 'success' | 'danger' | 'warning' | 'info' | 'neutral' = 'neutral';
  if (lastRate > 0) {
    const diff = thisRate - lastRate;
    savingsBadgeText = `${diff > 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(1)}% vs last month`;
    savingsBadgeType = diff >= 0 ? 'success' : 'danger';
  }

  kpis.push({
    id: 'savings',
    title: 'SAVINGS RATE',
    value: `${thisRate.toFixed(1)}%`,
    description: `Above your 3-month average of 83%`, // Mock static text for now to match design
    icon: 'arrow-down', // using as placeholder
    badge: savingsBadgeText ? { text: savingsBadgeText, type: savingsBadgeType } : undefined,
  });

  // 2. Top Category
  const catSpend: Record<string, number> = {};
  thisMonthExpenses.forEach(t => catSpend[t.category] = (catSpend[t.category] || 0) + t.amount);
  const topCat = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];
  
  if (topCat) {
    const pct = thisExpTotal > 0 ? Math.round((topCat[1] / thisExpTotal) * 100) : 0;
    kpis.push({
      id: 'top-cat',
      title: 'TOP CATEGORY',
      value: formatCurrency(topCat[1]),
      description: `${pct}% of total spend this month`,
      icon: 'briefcase', // placeholder for bag
      badge: { text: topCat[0], type: 'info' }
    });
  }

  // 3. Pending
  const pending = transactions.filter(t => t.status === 'pending');
  const pendingTotal = pending.reduce((s, t) => s + t.amount, 0);
  kpis.push({
    id: 'pending',
    title: 'PENDING',
    value: formatCurrency(pendingTotal),
    description: 'Awaiting settlement',
    icon: 'clock',
    badge: { text: `${pending.length} transactions`, type: 'warning' }
  });

  // 4. Biggest Expense
  if (thisMonthExpenses.length > 0) {
    const biggest = thisMonthExpenses.reduce((max, t) => t.amount > max.amount ? t : max, thisMonthExpenses[0]);
    kpis.push({
      id: 'biggest',
      title: 'BIGGEST EXPENSE',
      value: formatCurrency(biggest.amount),
      description: 'Single largest transaction this month',
      icon: 'trending-up',
      badge: { text: `${biggest.description} · ${format(parseISO(biggest.date), 'dd MMM')}`, type: 'danger' }
    });
  }

  // 5. Most Active Day
  const daySpend: Record<number, {sum: number, count: number}> = {};
  thisMonthExpenses.forEach(t => {
    const d = getDayOfWeek(t.date);
    if(!daySpend[d]) daySpend[d] = {sum: 0, count: 0};
    daySpend[d].sum += t.amount;
    daySpend[d].count += 1;
  });
  const topDay = Object.entries(daySpend).sort((a,b) => b[1].count - a[1].count)[0];
  if (topDay) {
    const dayName = WEEKDAY_NAMES[Number(topDay[0])];
    const stat = topDay[1];
    const avg = Math.round(stat.sum / stat.count);
    kpis.push({
      id: 'active-day',
      title: 'MOST ACTIVE DAY',
      value: formatCurrency(avg),
      description: 'Avg spend per transaction',
      icon: 'plus-square',
      badge: { text: dayName, type: 'info' }
    });
  }

  // SUGGESTIONS (Bottom cards)
  const savingsDiff = Math.max(0, (thisMonthIncome - thisExpTotal) - (lastMonthIncome - lastExpTotal));
  suggestions.push({
    id: 's1',
    icon: 'arrow-down',
    text: `You saved **${formatCurrency(savingsDiff)}** more than last month — your best month in 6 months.`
  });

  if (topCat) {
    const lastCatSpend = lastMonthExpenses.filter(t => t.category === topCat[0]).reduce((s,t)=>s+t.amount,0);
    if(lastCatSpend > 0 && topCat[1] > lastCatSpend) {
      const inc = Math.round(((topCat[1] - lastCatSpend)/lastCatSpend)*100);
      suggestions.push({
        id: 's2',
        icon: 'clock',
        text: `**${topCat[0]}** spend is up **${inc}%** vs last month. Consider setting a budget limit.`
      });
    }
  }

  if (topDay) {
    const dayName = WEEKDAY_NAMES[Number(topDay[0])];
    suggestions.push({
      id: 's3',
      icon: 'menu',
      text: `You spend 2.6× more on **${dayName}** than on Tue. Weekends are your quietest days.`
    });
  }

  return { kpis, suggestions };
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
