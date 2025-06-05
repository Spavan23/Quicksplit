import { useState } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { ChevronDown } from 'lucide-react-native';

type DropdownProps = {
  placeholder: string;
  value: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
};

export default function Dropdown({ placeholder, value, items, onValueChange }: DropdownProps) {
  const [visible, setVisible] = useState(false);
  
  const selectedItem = items.find(item => item.value === value);
  
  const toggleDropdown = () => {
    setVisible(!visible);
  };
  
  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setVisible(false);
  };
  
  return (
    <View>
      <Pressable style={styles.container} onPress={toggleDropdown}>
        <Text style={selectedItem ? styles.selectedText : styles.placeholderText}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <ChevronDown size={20} color={colors.gray[500]} />
      </Pressable>
      
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.item,
                    item.value === value && styles.selectedItem
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text 
                    style={[
                      styles.itemText,
                      item.value === value && styles.selectedItemText
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    color: colors.gray[500],
    fontSize: 16,
  },
  selectedText: {
    color: colors.gray[800],
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '80%',
    maxHeight: 300,
    padding: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedItem: {
    backgroundColor: colors.primary[50],
  },
  itemText: {
    fontSize: 16,
    color: colors.gray[800],
  },
  selectedItemText: {
    color: colors.primary[700],
    fontWeight: '500',
  },
});