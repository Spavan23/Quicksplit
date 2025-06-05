import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Member } from '@/types/models';

type MemberSelectorProps = {
  members: Member[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export default function MemberSelector({ members, selectedIds, onToggle }: MemberSelectorProps) {
  return (
    <View style={styles.container}>
      {members.map((member) => (
        <Pressable
          key={member.id}
          style={[
            styles.memberChip,
            selectedIds.includes(member.id) && styles.selectedChip
          ]}
          onPress={() => onToggle(member.id)}
        >
          <Text 
            style={[
              styles.memberName,
              selectedIds.includes(member.id) && styles.selectedName
            ]}
          >
            {member.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  memberName: {
    color: colors.gray[700],
  },
  selectedName: {
    color: colors.white,
    fontWeight: '500',
  },
});