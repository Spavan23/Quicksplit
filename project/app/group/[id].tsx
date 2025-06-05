import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useGroups } from '@/context/GroupContext';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/currency';
import { calculateBalances } from '@/utils/balances';
import { ArrowLeft, Plus, Trash } from 'lucide-react-native';
import ExpenseItem from '@/components/ExpenseItem';
import EmptyState from '@/components/EmptyState';
import AddMemberModal from '@/components/AddMemberModal';
import { useState } from 'react';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const { groups, addMember, removeExpense, removeGroup } = useGroups();
  const router = useRouter();
  const [showAddMember, setShowAddMember] = useState(false);

  const group = groups.find(g => g.id === id);
  
  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const balances = calculateBalances(group);

  const handleAddExpense = () => {
    router.push('/add-expense');
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => removeExpense(group.id, expenseId)
        }
      ]
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group? All expenses will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            removeGroup(group.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleAddMember = (name: string) => {
    if (name.trim()) {
      addMember(group.id, { id: Date.now().toString(), name: name.trim() });
      setShowAddMember(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: group.name,
          headerShown: true,
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
          headerTintColor: colors.white,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={colors.white} size={24} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleDeleteGroup} style={styles.deleteButton}>
              <Trash color={colors.white} size={20} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.membersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members</Text>
          <Pressable onPress={() => setShowAddMember(true)}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
        
        <View style={styles.membersList}>
          {group.members.map((member) => (
            <View key={member.id} style={styles.memberChip}>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.balancesSection}>
        <Text style={styles.sectionTitle}>Balances</Text>
        
        {balances.filter(b => b.amount !== 0).length > 0 ? (
          <FlatList
            data={balances.filter(b => b.amount !== 0)}
            keyExtractor={(item, index) => `${item.from}-${item.to}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.balanceCard}>
                <Text style={styles.balanceNames}>
                  {item.fromName} → {item.toName}
                </Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(item.amount, group.expenses[0]?.currency || 'USD')}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noBalances}>No balances to settle</Text>
        )}
      </View>
      
      <View style={styles.expensesSection}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        
        {group.expenses.length > 0 ? (
          <FlatList
            data={group.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseItem 
                expense={item} 
                members={group.members}
                onDelete={() => handleDeleteExpense(item.id)}
              />
            )}
            contentContainerStyle={styles.expensesList}
          />
        ) : (
          <EmptyState
            icon={<Plus size={48} color={colors.gray[400]} />}
            title="No Expenses Yet"
            message="Add your first expense to get started"
            actionLabel="Add Expense"
            onAction={handleAddExpense}
          />
        )}
      </View>
      
      <Pressable style={styles.fab} onPress={handleAddExpense}>
        <Plus size={24} color={colors.white} />
      </Pressable>
      
      <AddMemberModal
        visible={showAddMember}
        onClose={() => setShowAddMember(false)}
        onAdd={handleAddMember}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: colors.primary[500],
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  membersSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
  },
  addButtonText: {
    color: colors.primary[600],
    fontWeight: '500',
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  memberName: {
    color: colors.primary[800],
    fontWeight: '500',
  },
  balancesSection: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 8,
  },
  balanceCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 140,
  },
  balanceNames: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary[700],
  },
  noBalances: {
    color: colors.gray[500],
    fontStyle: 'italic',
    marginTop: 8,
  },
  expensesSection: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  expensesList: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});