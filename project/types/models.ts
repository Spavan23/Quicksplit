export type Member = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  currency: string;
  date: string;
};

export type Group = {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
};

export type Balance = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
};