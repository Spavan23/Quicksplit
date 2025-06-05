import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert } from 'react-native';
import { useGroups } from '@/context/GroupContext';
import { colors } from '@/constants/colors';
import { useState } from 'react';
import { currencies } from '@/constants/currencies';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import { Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const { defaultCurrency, setDefaultCurrency, clearAllData } = useGroups();
  const [darkMode, setDarkMode] = useState(false);
  
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all groups and expenses. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearAllData }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Default Currency</Text>
          <View style={styles.settingControl}>
            <Dropdown
              placeholder="Select currency"
              value={defaultCurrency}
              items={currencies.map(c => ({ label: `${c.code} (${c.symbol})`, value: c.code }))}
              onValueChange={setDefaultCurrency}
            />
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.gray[300], true: colors.primary[400] }}
            thumbColor={darkMode ? colors.primary[600] : colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.dangerSection}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        
        <Button 
          title="Clear All Data" 
          onPress={handleClearData}
          variant="danger"
          icon={<Trash2 size={18} color={colors.white} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
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
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingLabel: {
    fontSize: 16,
    color: colors.gray[800],
  },
  settingValue: {
    fontSize: 16,
    color: colors.gray[500],
  },
  settingControl: {
    width: 150,
  },
  dangerSection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});