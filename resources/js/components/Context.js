import { createContext } from 'react';

export const Context = createContext();

const ContextProvider = ({ children }) => {
    return <Context value={value}>{children}</Context>
};

const useAppContext = () => {
    const context = React.useContext(Context);
    if(context === undefined) {
        throw new Error('useAppContext must be used within a ContextProvider');
    }
    return context;
};

export {ContextProvider, useAppContext}
