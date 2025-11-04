
export interface Member {
  id: string;
  name: string;
}

export type ExpenseCategory = 'Food' | 'Transport' | 'Accommodation' | 'Activities' | 'Other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidById: string;
  date: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
  members: Member[];
  expenses: Expense[];
}
