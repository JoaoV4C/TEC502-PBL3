"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccountContextProps {
    account: IAccountContext;
    setAccount: (account: IAccountContext) => void;
}

interface IAccountContext {
    account: string;
    balance: string;
}

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<IAccountContext>({} as IAccountContext);

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = (): AccountContextProps => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};