import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Group } from '@/types/models';
import { formatRelativeDate } from '@/utils/date';
import { Users } from 'lucide-react-native';

type GroupCardProps = {
  group: Group;
};

export default function GroupCard({ group }: GroupCardProps) {
  const totalExpenses = group.expenses.length;
  const mostRecentDate = group.expenses.length > 0
    ? Math.max(...group.expenses.map(e => new Date(e.date).getTime()))
    : new Date(group.createdAt).getTime();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Users size={24} color={colors.primary[500]} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{group.name}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{group.members.length}</Text>
            <Text style={styles.detailLabel}>members</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{totalExpenses}</Text>
            <Text style={styles.detailLabel}>expenses</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.lastUpdated}>
            Last activity {formatRelativeDate(new Date(mostRecentDate))}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginRight: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.gray[500],
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.gray[500],
  },
});