import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Branch} from '@types/api.types';

interface BranchContextType {
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  clearSelectedBranch: () => void;
  isLoading: boolean;
}

export const BranchContext = createContext<BranchContextType | undefined>(
  undefined,
);

const BRANCH_STORAGE_KEY = '@yoga_pos_selected_branch';

interface BranchProviderProps {
  children: ReactNode;
  initialBranch?: Branch | null;
}

export const BranchProvider: React.FC<BranchProviderProps> = ({
  children,
  initialBranch,
}) => {
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(
    initialBranch || null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load saved branch preference on mount
  useEffect(() => {
    const loadBranchPreference = async () => {
      try {
        const savedBranch = await AsyncStorage.getItem(BRANCH_STORAGE_KEY);
        if (savedBranch) {
          setSelectedBranchState(JSON.parse(savedBranch));
        }
      } catch (error) {
        console.error('Failed to load branch preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranchPreference();
  }, []);

  const setSelectedBranch = useCallback(async (branch: Branch | null) => {
    setSelectedBranchState(branch);
    try {
      if (branch) {
        await AsyncStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branch));
      } else {
        await AsyncStorage.removeItem(BRANCH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save branch preference:', error);
    }
  }, []);

  const clearSelectedBranch = useCallback(async () => {
    setSelectedBranchState(null);
    try {
      await AsyncStorage.removeItem(BRANCH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear branch preference:', error);
    }
  }, []);

  const value: BranchContextType = {
    selectedBranch,
    setSelectedBranch,
    clearSelectedBranch,
    isLoading,
  };

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
};

// Custom hook to use branch context
export const useBranchContext = () => {
  const context = React.useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranchContext must be used within a BranchProvider');
  }
  return context;
};
