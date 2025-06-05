import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useGroups } from '@/context/GroupContext';
import { colors } from '@/constants/colors';
import { calculateBalances } from '@/utils/balances';
import { formatCurrency } from '@/utils/currency';
import EmptyState from '@/components/EmptyState';
import { ChartBar as BarChart2 } from 'lucide-react-native';
import Dropdown from '@/components/Dropdown';
import { useState } from 'react';

export default function SummaryScreen() {
  const { groups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState('');
  
  const groupOptions = groups.map(g => ({ label: g.name, value: g.id }));
  const currentGroup = groups.find(g => g.id === selectedGroup);
  
  const balances = currentGroup ? calculateBalances(currentGroup) : [];
  const transactions = currentGroup ? balances.filter(b => b.amount !== 0) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Balance Summary</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.groupSelector}>
          <Dropdown
            placeholder="Select a group"
            value={selectedGroup}
            items={groupOptions}
            onValueChange={setSelectedGroup}
          />
        </View>

        {!selectedGroup && (
          <EmptyState
            icon={<BarChart2 size={64} color={colors.gray[400]} />}
            title="No Group Selected"
            message="Select a group to view the balance summary"
          />
        )}

        {selectedGroup && transactions.length === 0 && (
          <EmptyState
            icon={<BarChart2 size={64} color={colors.gray[400]} />}
            title="No Balances"
            message="This group doesn't have any expenses yet"
          />
        )}

        {selectedGroup && transactions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Who Owes What</Text>
            <FlatList
              data={transactions}
              keyExtractor={(item, index) => `${item.from}-${item.to}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.transactionCard}>
                  <View style={styles.transactionParties}>
                    <Text style={styles.transactionParty}>{item.fromName}</Text>
                    <Text style={styles.transactionArrow}>→</Text>
                    <Text style={styles.transactionParty}>{item.toName}</Text>
                  </View>
                  <Text style={styles.transactionAmount}>
                    {formatCurrency(item.amount, currentGroup?.expenses[0]?.currency || 'USD')}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.primary[500],
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  groupSelector: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionParties: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionParty: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[800],
  },
  transactionArrow: {
    fontSize: 16,
    color: colors.gray[500],
    marginHorizontal: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent[600],
  },
});