import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Expense, Member } from '@/types/models';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { Trash2 } from 'lucide-react-native';

type ExpenseItemProps = {
  expense: Expense;
  members: Member[];
  onDelete: () => void;
};

export default function ExpenseItem({ expense, members, onDelete }: ExpenseItemProps) {
  const payer = members.find(m => m.id === expense.paidBy);
  const splitCount = expense.splitBetween.length;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.description}>{expense.description}</Text>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Trash2 size={16} color={colors.gray[500]} />
        </Pressable>
      </View>
      
      <Text style={styles.amount}>
        {formatCurrency(expense.amount, expense.currency)}
      </Text>
      
      <View style={styles.details}>
        <Text style={styles.paidBy}>
          Paid by <Text style={styles.name}>{payer?.name}</Text>
        </Text>
        <Text style={styles.splitBetween}>
          Split between {splitCount} {splitCount === 1 ? 'person' : 'people'}
        </Text>
      </View>
      
      <Text style={styles.date}>{formatDate(new Date(expense.date))}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[700],
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  paidBy: {
    fontSize: 14,
    color: colors.gray[600],
    marginRight: 8,
  },
  name: {
    fontWeight: '500',
  },
  splitBetween: {
    fontSize: 14,
    color: colors.gray[600],
  },
  date: {
    fontSize: 12,
    color: colors.gray[500],
  },
});