// context/TransferContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface TransferContextType {
  transferData: {
    fromAccount: string;
    receiverAccount: string;
    
    toContact: string;
    amount?: number;
    status?: string;
    date?: string;
    transactionId?: number;
    senderAccountType?: string;
    senderAccountNumber?: number;
    recipientName?: string;
    recipientEmail?: string;
    transactionType?: string;

  };
  setTransferData: React.Dispatch<React.SetStateAction<TransferContextType['transferData']>>;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

export const TransferProvider = ({ children }: { children: ReactNode }) => {
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    receiverAccount: '',
    toContact: '',
  });

  return (
    <TransferContext.Provider value={{ transferData, setTransferData }}>
      {children}
    </TransferContext.Provider>
  );
};

export const useTransferContext = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransferContext must be used within a TransferProvider');
  }
  return context;
};
