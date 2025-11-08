import SummaryCards from '@/components/SummaryCards';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import SpendingTrend from '@/components/SpendingTrend';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Financial Tracker</h1>
          <p className="text-gray-600 mt-2">Track your income and expenses with ease</p>
        </div>

        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SpendingTrend />
          <ExpenseChart />
        </div>

        <TransactionList />
      </div>
    </div>
  );
}
