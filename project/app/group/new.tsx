import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useState } from 'react';
import { useGroups } from '@/context/GroupContext';
import { ArrowLeft } from 'lucide-react-native';
import Button from '@/components/Button';

export default function NewGroupScreen() {
  const router = useRouter();
  const { createGroup } = useGroups();
  
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['', '']);
  
  const handleAddMember = () => {
    setMembers([...members, '']);
  };
  
  const handleChangeMember = (text: string, index: number) => {
    const newMembers = [...members];
    newMembers[index] = text;
    setMembers(newMembers);
  };
  
  const handleRemoveMember = (index: number) => {
    if (members.length <= 2) return; // Keep at least 2 members
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };
  
  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    
    const validMembers = members
      .filter(m => m.trim() !== '')
      .map(name => ({
        id: Date.now() + Math.random().toString(),
        name: name.trim()
      }));
    
    if (validMembers.length < 2) return; // Need at least 2 members
    
    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      members: validMembers,
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    
    createGroup(newGroup);
    router.replace(`/group/${newGroup.id}`);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Create New Group',
          headerShown: true,
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
          headerTintColor: colors.white,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={colors.white} size={24} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            autoFocus
          />
        </View>
        
        <Text style={styles.label}>Members</Text>
        <Text style={styles.sublabel}>Add at least 2 people including yourself</Text>
        
        {members.map((member, index) => (
          <View key={index} style={styles.memberRow}>
            <TextInput
              style={[styles.input, styles.memberInput]}
              value={member}
              onChangeText={(text) => handleChangeMember(text, index)}
              placeholder={`Member ${index + 1}`}
            />
            
            {members.length > 2 && (
              <Pressable 
                style={styles.removeMember}
                onPress={() => handleRemoveMember(index)}
              >
                <Text style={styles.removeMemberText}>✕</Text>
              </Pressable>
            )}
          </View>
        ))}
        
        <Pressable style={styles.addMember} onPress={handleAddMember}>
          <Text style={styles.addMemberText}>+ Add Member</Text>
        </Pressable>
        
        <Button 
          title="Create Group" 
          onPress={handleCreateGroup}
          disabled={!groupName.trim() || members.filter(m => m.trim() !== '').length < 2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  content: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.gray[700],
  },
  sublabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 16,
    marginTop: -4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray[800],
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberInput: {
    flex: 1,
  },
  removeMember: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeMemberText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  addMember: {
    padding: 12,
    marginBottom: 24,
  },
  addMemberText: {
    color: colors.primary[600],
    fontWeight: '500',
  },
});