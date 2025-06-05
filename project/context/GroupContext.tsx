import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, Expense, Member } from '@/types/models';

type GroupContextType = {
  groups: Group[];
  createGroup: (group: Group) => void;
  addMember: (groupId: string, member: Member) => void;
  addExpense: (groupId: string, expense: Expense) => void;
  removeExpense: (groupId: string, expenseId: string) => void;
  removeGroup: (groupId: string) => void;
  defaultCurrency: string;
  setDefaultCurrency: (currency: string) => void;
  clearAllData: () => void;
};

const GroupContext = createContext<GroupContextType | null>(null);

const STORAGE_KEY = 'quicksplit_data';
const CURRENCY_KEY = 'quicksplit_currency';

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  
  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedGroups = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedGroups) {
          setGroups(JSON.parse(storedGroups));
        }
        
        const storedCurrency = await AsyncStorage.getItem(CURRENCY_KEY);
        if (storedCurrency) {
          setDefaultCurrency(storedCurrency);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };
    
    if (groups.length > 0) {
      saveData();
    }
  }, [groups]);
  
  // Save currency to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCurrency = async () => {
      try {
        await AsyncStorage.setItem(CURRENCY_KEY, defaultCurrency);
      } catch (error) {
        console.error('Error saving currency to AsyncStorage:', error);
      }
    };
    
    saveCurrency();
  }, [defaultCurrency]);
  
  const createGroup = (group: Group) => {
    setGroups(prevGroups => [...prevGroups, group]);
  };
  
  const addMember = (groupId: string, member: Member) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId
          ? { ...group, members: [...group.members, member] }
          : group
      )
    );
  };
  
  const addExpense = (groupId: string, expense: Expense) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId
          ? { ...group, expenses: [...group.expenses, expense] }
          : group
      )
    );
  };
  
  const removeExpense = (groupId: string, expenseId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId
          ? { ...group, expenses: group.expenses.filter(e => e.id !== expenseId) }
          : group
      )
    );
  };
  
  const removeGroup = (groupId: string) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
  };
  
  const updateDefaultCurrency = (currency: string) => {
    setDefaultCurrency(currency);
  };
  
  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setGroups([]);
    } catch (error) {
      console.error('Error clearing data from AsyncStorage:', error);
    }
  };
  
  return (
    <GroupContext.Provider
      value={{
        groups,
        createGroup,
        addMember,
        addExpense,
        removeExpense,
        removeGroup,
        defaultCurrency,
        setDefaultCurrency: updateDefaultCurrency,
        clearAllData,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
}