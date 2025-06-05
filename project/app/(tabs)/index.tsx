import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useGroups } from '@/context/GroupContext';
import { formatCurrency } from '@/utils/currency';
import { colors } from '@/constants/colors';
import { Plus, Users } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';
import GroupCard from '@/components/GroupCard';

export default function HomeScreen() {
  const { groups } = useGroups();
  const router = useRouter();

  const handleCreateGroup = () => {
    router.push('/group/new');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QuickSplit</Text>
        <Text style={styles.subtitle}>Split expenses without the hassle</Text>
      </View>

      <View style={styles.content}>
        {groups.length > 0 ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link href={`/group/${item.id}`} asChild>
                <Pressable>
                  <GroupCard group={item} />
                </Pressable>
              </Link>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <EmptyState 
            icon={<Users size={64} color={colors.gray[400]} />}
            title="No Groups Yet"
            message="Create your first expense splitting group to get started"
            actionLabel="Create Group"
            onAction={handleCreateGroup}
          />
        )}
      </View>
      
      <Pressable style={styles.fab} onPress={handleCreateGroup}>
        <Plus size={24} color={colors.white} />
      </Pressable>
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary[50],
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
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