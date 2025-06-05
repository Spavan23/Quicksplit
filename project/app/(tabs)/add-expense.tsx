import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/context/GroupContext';
import { colors } from '@/constants/colors';
import { currencies } from '@/constants/currencies';
import Dropdown from '@/components/Dropdown';
import MemberSelector from '@/components/MemberSelector';
import Button from '@/components/Button';

export default function AddExpenseScreen() {
  const { groups, addExpense } = useGroups();
  const router = useRouter();

  const [selectedGroup, setSelectedGroup] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [currency, setCurrency] = useState('USD');

  const currentGroup = groups.find(g => g.id === selectedGroup);
  const groupOptions = groups.map(g => ({ label: g.name, value: g.id }));

  // Reset form when group changes
  useEffect(() => {
    if (currentGroup) {
      setPaidBy('');
      setSplitBetween([]);
    }
  }, [selectedGroup]);

  const handleSplitToggle = (memberId: string) => {
    setSplitBetween(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSplitAll = () => {
    if (currentGroup) {
      setSplitBetween(currentGroup.members.map(m => m.id));
    }
  };

  const handleSplitClear = () => {
    setSplitBetween([]);
  };

  const handleSubmit = () => {
    if (!selectedGroup || !description || !amount || !paidBy || splitBetween.length === 0) {
      // Show validation errors (in a real app)
      return;
    }

    addExpense(selectedGroup, {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      paidBy,
      splitBetween,
      currency,
      date: new Date().toISOString(),
    });

    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('');
    setSplitBetween([]);

    // Navigate to the group
    router.push(`/group/${selectedGroup}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Expense</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Group</Text>
          <Dropdown
            placeholder="Select a group"
            value={selectedGroup}
            items={groupOptions}
            onValueChange={setSelectedGroup}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="What was this expense for?"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 2 }]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Currency</Text>
            <Dropdown
              placeholder="USD"
              value={currency}
              items={currencies.map(c => ({ label: c.code, value: c.code }))}
              onValueChange={setCurrency}
            />
          </View>
        </View>

        {currentGroup && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Paid by</Text>
              <Dropdown
                placeholder="Who paid?"
                value={paidBy}
                items={currentGroup.members.map(m => ({ label: m.name, value: m.id }))}
                onValueChange={setPaidBy}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Split between</Text>
                <View style={styles.splitActions}>
                  <Pressable onPress={handleSplitAll}>
                    <Text style={styles.splitAction}>All</Text>
                  </Pressable>
                  <Pressable onPress={handleSplitClear}>
                    <Text style={styles.splitAction}>Clear</Text>
                  </Pressable>
                </View>
              </View>
              
              <MemberSelector
                members={currentGroup.members}
                selectedIds={splitBetween}
                onToggle={handleSplitToggle}
              />
            </View>
          </>
        )}

        <Button 
          title="Add Expense" 
          onPress={handleSubmit} 
          disabled={!selectedGroup || !description || !amount || !paidBy || splitBetween.length === 0}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingBottom: 40,
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
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.gray[700],
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray[800],
  },
  splitActions: {
    flexDirection: 'row',
  },
  splitAction: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '500',
    marginLeft: 16,
  },
});