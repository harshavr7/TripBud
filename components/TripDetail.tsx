import React, { useState, useMemo } from 'react';
import { Trip, Member, Expense, ExpenseCategory } from '../types';
import AddExpenseModal from './AddExpenseModal';
import AddMemberModal from './AddMemberModal';
import ExpenseChart from './ExpenseChart';
import ItineraryPlanner from './ItineraryPlanner';
import ExpensePredictor from './ExpensePredictor';
import { PlusIcon, ArrowLeftIcon, CalendarIcon, MapPinIcon, UsersIcon, WalletIcon, DollarSignIcon } from './icons';

interface TripDetailProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onGoBack: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
        <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const TripDetail: React.FC<TripDetailProps> = ({ trip, onUpdateTrip, onGoBack }) => {
  const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    onUpdateTrip({ ...trip, expenses: [...trip.expenses, newExpense] });
  };

  const handleAddMember = (name: string) => {
    if (trip.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        alert("A member with this name already exists.");
        return;
    }
    const newMember: Member = { id: Date.now().toString(), name };
    onUpdateTrip({ ...trip, members: [...trip.members, newMember] });
  };
  
  const { totalSpent, totalBudget, balances, durationInDays } = useMemo(() => {
    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = trip.budgetPerPerson * trip.members.length;
    
    const balances = new Map<string, number>();
    trip.members.forEach(m => balances.set(m.id, 0));

    trip.expenses.forEach(e => {
        balances.set(e.paidById, (balances.get(e.paidById) || 0) + e.amount);
    });

    const sharePerPerson = trip.members.length > 0 ? totalSpent / trip.members.length : 0;
    
    trip.members.forEach(m => {
        balances.set(m.id, (balances.get(m.id) || 0) - sharePerPerson);
    });
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const durationInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    return { totalSpent, totalBudget, balances, durationInDays };
  }, [trip]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <button onClick={onGoBack} className="flex items-center mb-6 text-indigo-600 dark:text-indigo-400 hover:underline">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to My Trips
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">{trip.name}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400">
            <div className="flex items-center"><MapPinIcon className="h-5 w-5 mr-2" /> {trip.destination}</div>
            <div className="flex items-center"><CalendarIcon className="h-5 w-5 mr-2" /> {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}</div>
            <div className="flex items-center"><UsersIcon className="h-5 w-5 mr-2" /> {trip.members.length} Members</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Budget" value={formatCurrency(totalBudget)} icon={<WalletIcon className="h-6 w-6 text-indigo-500" />} />
        <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={<DollarSignIcon className="h-6 w-6 text-indigo-500" />} />
        <StatCard title="Remaining" value={formatCurrency(totalBudget - totalSpent)} icon={<div className={`h-6 w-6 font-bold text-2xl ${totalBudget - totalSpent >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalBudget - totalSpent >= 0 ? '✓' : '✗'}</div>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Expenses</h3>
                  <button onClick={() => setAddExpenseModalOpen(true)} className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                    <PlusIcon className="h-4 w-4 mr-1" /> Add
                  </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
              {trip.expenses.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {trip.expenses.map(expense => (
                      <li key={expense.id} className="py-3 flex justify-between items-center">
                      <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{expense.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {expense.category} - Paid by {trip.members.find(m => m.id === expense.paidById)?.name || 'Unknown'}
                          </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</p>
                      </li>
                  ))}
                  </ul>
              ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">No expenses added yet.</p>
              )}
              </div>
          </div>
          <ItineraryPlanner destination={trip.destination} durationInDays={durationInDays} budget={trip.budgetPerPerson} />
        </div>
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Expense Breakdown</h3>
                <ExpenseChart expenses={trip.expenses} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Member Balances</h3>
                    <button onClick={() => setAddMemberModalOpen(true)} className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                        <PlusIcon className="h-4 w-4 mr-1" /> Add
                    </button>
                </div>
                <ul>
                    {Array.from(balances.entries()).map(([memberId, balance]) => {
                        const member = trip.members.find(m => m.id === memberId);
                        return (
                        <li key={memberId} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <span className="text-gray-700 dark:text-gray-300">{member?.name || 'Unknown'}</span>
                            <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {balance >= 0 ? `is owed ${formatCurrency(balance)}` : `owes ${formatCurrency(-balance)}`}
                            </span>
                        </li>
                        );
                    })}
                </ul>
            </div>
            <ExpensePredictor destination={trip.destination} durationInDays={durationInDays} numberOfMembers={trip.members.length} />
        </div>
      </div>
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
        members={trip.members}
      />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default TripDetail;
