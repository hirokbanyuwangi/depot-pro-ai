import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Transaction = {
  id: string;
  date: string;
  time: string;
  channel: 'pickup' | 'delivery' | 'store'; // Added store for Titip Toko
  qty: number;
  useStock?: boolean; // True if using filled stock, false if filling from Toren
  customerId: string | null; // null if guest
  customerName?: string;
  gallonStatus: 'tukar' | 'pinjam' | 'kembali' | 'baru';
  paymentMethod: 'cash' | 'qris' | 'bon';
  totalAmount: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  debtAmount: number;
  borrowedGallons: number;
};

export type TankHistory = {
  id: string;
  date: string;
  litersAdded: number;
  pricePaid: number;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
};

interface DepotState {
  // Settings
  settings: {
    pricePickup: number;
    priceDelivery: number;
    priceStore: number; // Harga Khusus Titip Toko
    storeCommission: number; // Komisi untuk toko (per galon)
    totalGallonAsset: number; // Total galon keseluruhan milik depot
    tankCapacity: number;
    tankPrice: number;
    investorPct: number;
    capPrice: number;
    tissuePrice: number;
    sealPrice: number;
  };
  updateSettings: (newSettings: Partial<DepotState['settings']>) => void;

  // Inventory & Warehouse
  inventory: {
    currentWaterLiters: number;
    emptyGallons: number;
    filledGallons: number;
  };
  updateInventory: (liters: number) => void;
  updateWarehouse: (emptyChange: number, filledChange: number) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'debtAmount' | 'borrowedGallons'>) => void;
  updateCustomerDebt: (id: string, amountChange: number) => void;
  updateCustomerGallons: (id: string, gallonChange: number) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  revertTransaction: (id: string, revertQty: number) => void;

  // Warehouse History
  warehouseHistories: { id: string, date: string, type: 'isi' | 'kosong', amountChange: number, description: string }[];
  addWarehouseHistory: (history: { date: string, type: 'isi' | 'kosong', amountChange: number, description: string }) => void;

  // Tank History
  tankHistories: TankHistory[];
  addTankHistory: (history: Omit<TankHistory, 'id'>) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  // System
  resetData: () => void;
}

const initialState = {
  settings: {
    pricePickup: 6000,
    priceDelivery: 7000,
    priceStore: 5000,
    storeCommission: 1000,
    totalGallonAsset: 100,
    tankCapacity: 5000,
    tankPrice: 350000,
    investorPct: 50,
    capPrice: 100,
    tissuePrice: 50,
    sealPrice: 50,
  },
  inventory: {
    currentWaterLiters: 1000,
    emptyGallons: 50,
    filledGallons: 20,
  },
  customers: [
    { id: '1', name: 'Warung Barokah', phone: '08123456789', debtAmount: 0, borrowedGallons: 0 }
  ],
  transactions: [],
  warehouseHistories: [],
  tankHistories: [],
  expenses: [],
};

export const useDepotStore = create<DepotState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      updateInventory: (liters) => 
        set((state) => ({ inventory: { ...state.inventory, currentWaterLiters: liters } })),

      updateWarehouse: (emptyChange, filledChange) =>
        set((state) => ({
          inventory: {
            ...state.inventory,
            emptyGallons: Math.max(0, state.inventory.emptyGallons + emptyChange),
            filledGallons: Math.max(0, state.inventory.filledGallons + filledChange),
          }
        })),

      addCustomer: (customer) => 
        set((state) => ({
          customers: [
            ...state.customers, 
            { ...customer, id: Date.now().toString() + Math.random().toString(36).substring(7), debtAmount: 0, borrowedGallons: 0 }
          ]
        })),

      updateCustomerDebt: (id, amountChange) =>
        set((state) => ({
          customers: state.customers.map(c => 
            c.id === id ? { ...c, debtAmount: c.debtAmount + amountChange } : c
          )
        })),

      updateCustomerGallons: (id, gallonChange) =>
        set((state) => ({
          customers: state.customers.map(c => 
            c.id === id ? { ...c, borrowedGallons: c.borrowedGallons + gallonChange } : c
          )
        })),

      addTransaction: (tx) => 
        set((state) => {
          let newWaterLiters = state.inventory.currentWaterLiters;
          let newEmptyGallons = state.inventory.emptyGallons;
          let newFilledGallons = state.inventory.filledGallons;

          if (tx.useStock) {
            newFilledGallons = Math.max(0, newFilledGallons - tx.qty);
            if (tx.gallonStatus === 'tukar' || tx.gallonStatus === 'kembali') {
              newEmptyGallons += tx.qty;
            }
          } else {
            const litersUsed = tx.qty * 19;
            newWaterLiters = Math.max(0, newWaterLiters - litersUsed);
            
            if (tx.gallonStatus === 'pinjam' || tx.gallonStatus === 'baru') {
              newEmptyGallons = Math.max(0, newEmptyGallons - tx.qty);
            } else if (tx.gallonStatus === 'kembali') {
              newWaterLiters += litersUsed; // Re-add water since 'kembali' doesn't use water
              newEmptyGallons += tx.qty;
            }
            // If tukar, emptyGallons remains unchanged because they bring 1 and we use it immediately.
          }

          // Update customer if applicable (Debt and Gallons)
          let updatedCustomers = [...state.customers];
          if (tx.customerId) {
            updatedCustomers = updatedCustomers.map(c => {
              if (c.id === tx.customerId) {
                let debtChange = tx.paymentMethod === 'bon' ? tx.totalAmount : 0;
                let gallonChange = 0;
                if (tx.gallonStatus === 'pinjam') gallonChange = tx.qty;
                if (tx.gallonStatus === 'kembali') gallonChange = -tx.qty;
                return {
                  ...c,
                  debtAmount: c.debtAmount + debtChange,
                  borrowedGallons: c.borrowedGallons + gallonChange,
                };
              }
              return c;
            });
          }

          return {
            transactions: [{ ...tx, id: Date.now().toString() + Math.random().toString(36).substring(7) }, ...state.transactions],
            inventory: { 
              ...state.inventory, 
              currentWaterLiters: newWaterLiters,
              emptyGallons: newEmptyGallons,
              filledGallons: newFilledGallons
            },
            customers: updatedCustomers,
          };
        }),

      revertTransaction: (id, revertQty) => 
        set((state) => {
          const tx = state.transactions.find(t => t.id === id);
          if (!tx) return state;
          
          const actualRevertQty = Math.min(revertQty, tx.qty);
          if (actualRevertQty <= 0) return state;

          const unitPrice = tx.totalAmount / tx.qty;
          const revertAmount = unitPrice * actualRevertQty;

          const newTransactions = state.transactions.map(t => {
            if (t.id === id) {
              return { ...t, qty: t.qty - actualRevertQty, totalAmount: t.totalAmount - revertAmount };
            }
            return t;
          });

          // Restore water and stock inventory
          let newWaterLiters = state.inventory.currentWaterLiters;
          let newEmptyGallons = state.inventory.emptyGallons;
          let newFilledGallons = state.inventory.filledGallons;

          if (tx.useStock) {
            newFilledGallons += actualRevertQty;
            if (tx.gallonStatus === 'tukar' || tx.gallonStatus === 'kembali') {
              newEmptyGallons = Math.max(0, newEmptyGallons - actualRevertQty);
            }
          } else {
            const litersRestored = actualRevertQty * 19;
            newWaterLiters += litersRestored;
            
            if (tx.gallonStatus === 'pinjam' || tx.gallonStatus === 'baru') {
              newEmptyGallons += actualRevertQty;
            } else if (tx.gallonStatus === 'kembali') {
              newWaterLiters = Math.max(0, newWaterLiters - litersRestored);
              newEmptyGallons = Math.max(0, newEmptyGallons - actualRevertQty);
            }
          }

          // Restore customer debt/gallons if applicable
          let updatedCustomers = [...state.customers];
          if (tx.customerId) {
            updatedCustomers = updatedCustomers.map(c => {
              if (c.id === tx.customerId) {
                let debtChange = tx.paymentMethod === 'bon' ? -revertAmount : 0;
                let gallonChange = 0;
                if (tx.gallonStatus === 'pinjam') gallonChange = -actualRevertQty;
                if (tx.gallonStatus === 'kembali') gallonChange = actualRevertQty;
                return {
                  ...c,
                  debtAmount: Math.max(0, c.debtAmount + debtChange),
                  borrowedGallons: Math.max(0, c.borrowedGallons + gallonChange),
                };
              }
              return c;
            });
          }

          return {
            transactions: newTransactions,
            inventory: { 
              ...state.inventory, 
              currentWaterLiters: newWaterLiters,
              emptyGallons: newEmptyGallons,
              filledGallons: newFilledGallons
            },
            customers: updatedCustomers,
          };
        }),

      addWarehouseHistory: (history) =>
        set((state) => {
          let emptyChange = 0;
          let filledChange = 0;
          let waterChange = 0;

          if (history.type === 'kosong') {
            emptyChange = history.amountChange;
          } else if (history.type === 'isi') {
            filledChange = history.amountChange;
            // Jika penambahan galon isi (produksi), kurangi air toren dan kurangi galon kosong
            if (history.amountChange > 0 && !history.description.toLowerCase().includes('opname')) {
              waterChange = -(history.amountChange * 19);
              emptyChange = -history.amountChange;
            }
          }
          
          return {
            warehouseHistories: [{ ...history, id: Date.now().toString() + Math.random().toString(36).substring(7) }, ...state.warehouseHistories],
            inventory: {
              ...state.inventory,
              currentWaterLiters: Math.max(0, state.inventory.currentWaterLiters + waterChange),
              emptyGallons: Math.max(0, state.inventory.emptyGallons + emptyChange),
              filledGallons: Math.max(0, state.inventory.filledGallons + filledChange),
            }
          };
        }),

      addTankHistory: (history) =>
        set((state) => ({
          tankHistories: [{ ...history, id: Date.now().toString() + Math.random().toString(36).substring(7) }, ...state.tankHistories],
          inventory: {
            ...state.inventory,
            currentWaterLiters: Math.min(
              state.settings.tankCapacity, 
              state.inventory.currentWaterLiters + history.litersAdded
            )
          }
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [{ ...expense, id: Date.now().toString() + Math.random().toString(36).substring(7) }, ...state.expenses]
        })),

      resetData: () => set(initialState),
    }),
    {
      name: 'depot-storage',
    }
  )
);
