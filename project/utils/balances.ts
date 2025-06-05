import { Group, Balance } from '@/types/models';

export function calculateBalances(group: Group): Balance[] {
  // Initialize balances for each member
  const memberBalances: Record<string, number> = {};
  group.members.forEach(member => {
    memberBalances[member.id] = 0;
  });
  
  // Calculate each member's balance
  group.expenses.forEach(expense => {
    const payer = expense.paidBy;
    const amount = expense.amount;
    const splitBetween = expense.splitBetween;
    const splitAmount = amount / splitBetween.length;
    
    // Add the full amount to the payer
    memberBalances[payer] += amount;
    
    // Subtract the split amount from each member who owes
    splitBetween.forEach(memberId => {
      memberBalances[memberId] -= splitAmount;
    });
  });
  
  // Create transaction pairs
  const balances: Balance[] = [];
  
  // Map of member ids to names
  const memberNames: Record<string, string> = {};
  group.members.forEach(member => {
    memberNames[member.id] = member.name;
  });
  
  // Create a pair for each negative balance (debtor) with each positive balance (creditor)
  const debtors = Object.entries(memberBalances)
    .filter(([_, balance]) => balance < 0)
    .map(([id, balance]) => ({ id, balance: Math.abs(balance) }));
  
  const creditors = Object.entries(memberBalances)
    .filter(([_, balance]) => balance > 0)
    .map(([id, balance]) => ({ id, balance }));
  
  // Simplify and minimize the number of transactions
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);
  
  // For each debtor, find creditors to pay until the debt is cleared
  debtors.forEach(debtor => {
    let remainingDebt = debtor.balance;
    
    while (remainingDebt > 0.01 && creditors.length > 0) {
      const creditor = creditors[0];
      
      // Calculate the transaction amount
      const amount = Math.min(remainingDebt, creditor.balance);
      
      // Add the transaction
      if (amount > 0.01) {
        balances.push({
          from: debtor.id,
          fromName: memberNames[debtor.id],
          to: creditor.id,
          toName: memberNames[creditor.id],
          amount: parseFloat(amount.toFixed(2)),
        });
      }
      
      // Update remaining amounts
      remainingDebt -= amount;
      creditor.balance -= amount;
      
      // Remove creditor if fully paid
      if (creditor.balance < 0.01) {
        creditors.shift();
      }
    }
  });
  
  return balances;
}