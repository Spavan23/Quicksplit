import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import Button from './Button';

type AddMemberModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
};

export default function AddMemberModal({ visible, onClose, onAdd }: AddMemberModalProps) {
  const [name, setName] = useState('');
  
  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name);
      setName('');
    }
  };
  
  const handleClose = () => {
    setName('');
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Add New Member</Text>
          
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter member name"
            autoFocus
          />
          
          <View style={styles.actions}>
            <Button 
              title="Cancel" 
              onPress={handleClose} 
              variant="outline"
            />
            <View style={styles.spacer} />
            <Button 
              title="Add" 
              onPress={handleAdd}
              disabled={!name.trim()}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '80%',
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray[800],
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  spacer: {
    width: 8,
  },
});