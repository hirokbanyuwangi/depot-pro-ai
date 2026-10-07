import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type Transaction = {
  id: string;
  date: string;
  time: string;
  channel: 'pickup' | 'delivery' | 'store';
  qty: number;
  useStock?: boolean;
  customerId: string | null;
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
  isLoaded: boolean;
  initData: () => Promise<void>;

  settings: {
    pricePickup: number;
    priceDelivery: number;
    priceStore: number;
    storeCommission: number;
    totalGallonAsset: number;
    tankCapacity: number;
    tankPrice: number;
    investorPct: number;
    capPrice: number;
    tissuePrice: number;
    sealPrice: number;
    depotName: string;
    depotAddress: string;
    picName: string;
  };
  updateSettings: (newSettings: Partial<DepotState['settings']>) => Promise<void>;

  inventory: {
    currentWaterLiters: number;
    emptyGallons: number;
    filledGallons: number;
  };
  updateInventory: (liters: number) => Promise<void>;
  updateWarehouse: (emptyChange: number, filledChange: number) => Promise<void>;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'debtAmount' | 'borrowedGallons'>) => Promise<void>;
  updateCustomerDebt: (id: string, amountChange: number) => Promise<void>;
  updateCustomerGallons: (id: string, gallonChange: number) => Promise<void>;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  revertTransaction: (id: string, revertQty: number) => Promise<void>;

  warehouseHistories: { id: string, date: string, type: 'isi' | 'kosong', amountChange: number, description: string }[];
  addWarehouseHistory: (history: { date: string, type: 'isi' | 'kosong', amountChange: number, description: string }) => Promise<void>;

  tankHistories: TankHistory[];
  addTankHistory: (history: Omit<TankHistory, 'id'>) => Promise<void>;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;

  resetData: () => void;
}

const initialState = {
  isLoaded: false,
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
    depotName: "DepotPro",
    depotAddress: "Jl. Air Bersih No. 1",
    picName: "Admin Utama",
  },
  inventory: {
    currentWaterLiters: 1000,
    emptyGallons: 50,
    filledGallons: 20,
  },
  customers: [],
  transactions: [],
  warehouseHistories: [],
  tankHistories: [],
  expenses: [],
};

export const useDepotStore = create<DepotState>()((set, get) => ({
  ...initialState,

  initData: async () => {
    const [
      { data: settings },
      { data: inventory },
      { data: customers },
      { data: transactions },
      { data: warehouseHistories },
      { data: tankHistories },
      { data: expenses }
    ] = await Promise.all([
      supabase.from('settings').select('*').single(),
      supabase.from('inventory').select('*').single(),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('warehouse_histories').select('*').order('created_at', { ascending: false }),
      supabase.from('tank_histories').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('created_at', { ascending: false })
    ]);

    set({
      settings: settings ? {
        pricePickup: settings.price_pickup,
        priceDelivery: settings.price_delivery,
        priceStore: settings.price_store,
        storeCommission: settings.store_commission,
        totalGallonAsset: settings.total_gallon_asset,
        tankCapacity: settings.tank_capacity,
        tankPrice: settings.tank_price,
        investorPct: settings.investor_pct,
        capPrice: settings.cap_price,
        tissuePrice: settings.tissue_price,
        sealPrice: settings.seal_price,
        depotName: settings.depot_name,
        depotAddress: settings.depot_address,
        picName: settings.pic_name,
      } : initialState.settings,
      inventory: inventory ? {
        currentWaterLiters: inventory.current_water_liters,
        emptyGallons: inventory.empty_gallons,
        filledGallons: inventory.filled_gallons,
      } : initialState.inventory,
      customers: (customers || []).map(c => ({
        id: c.id, name: c.name, phone: c.phone, debtAmount: c.debt_amount, borrowedGallons: c.borrowed_gallons
      })),
      transactions: (transactions || []).map(t => ({
        id: t.id, date: t.date, time: t.time, channel: t.channel, qty: t.qty, useStock: t.use_stock,
        customerId: t.customer_id, customerName: t.customer_name, gallonStatus: t.gallon_status,
        paymentMethod: t.payment_method, totalAmount: t.total_amount
      })),
      warehouseHistories: (warehouseHistories || []).map(w => ({
        id: w.id, date: w.date, type: w.type, amountChange: w.amount_change, description: w.description
      })),
      tankHistories: (tankHistories || []).map(t => ({
        id: t.id, date: t.date, litersAdded: t.liters_added, pricePaid: t.price_paid
      })),
      expenses: (expenses || []).map(e => ({
        id: e.id, date: e.date, category: e.category, amount: e.amount, description: e.description
      })),
      isLoaded: true
    });
  },

  updateSettings: async (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
    const s = get().settings;
    await supabase.from('settings').update({
      price_pickup: s.pricePickup,
      price_delivery: s.priceDelivery,
      price_store: s.priceStore,
      store_commission: s.storeCommission,
      total_gallon_asset: s.totalGallonAsset,
      tank_capacity: s.tankCapacity,
      tank_price: s.tankPrice,
      investor_pct: s.investorPct,
      cap_price: s.capPrice,
      tissue_price: s.tissuePrice,
      seal_price: s.sealPrice,
      depot_name: s.depotName,
      depot_address: s.depotAddress,
      pic_name: s.picName,
    }).eq('id', 1);
  },

  updateInventory: async (liters) => {
    set((state) => ({ inventory: { ...state.inventory, currentWaterLiters: liters } }));
    await supabase.from('inventory').update({ current_water_liters: liters }).eq('id', 1);
  },

  updateWarehouse: async (emptyChange, filledChange) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        emptyGallons: Math.max(0, state.inventory.emptyGallons + emptyChange),
        filledGallons: Math.max(0, state.inventory.filledGallons + filledChange),
      }
    }));
    const inv = get().inventory;
    await supabase.from('inventory').update({
      empty_gallons: inv.emptyGallons,
      filled_gallons: inv.filledGallons
    }).eq('id', 1);
  },

  addCustomer: async (customer) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    set((state) => ({
      customers: [{ ...customer, id, debtAmount: 0, borrowedGallons: 0 }, ...state.customers]
    }));
    await supabase.from('customers').insert({
      id, name: customer.name, phone: customer.phone, debt_amount: 0, borrowed_gallons: 0
    });
  },

  updateCustomerDebt: async (id, amountChange) => {
    set((state) => ({
      customers: state.customers.map(c => c.id === id ? { ...c, debtAmount: c.debtAmount + amountChange } : c)
    }));
    const cust = get().customers.find(c => c.id === id);
    if (cust) await supabase.from('customers').update({ debt_amount: cust.debtAmount }).eq('id', id);
  },

  updateCustomerGallons: async (id, gallonChange) => {
    set((state) => ({
      customers: state.customers.map(c => c.id === id ? { ...c, borrowedGallons: c.borrowedGallons + gallonChange } : c)
    }));
    const cust = get().customers.find(c => c.id === id);
    if (cust) await supabase.from('customers').update({ borrowed_gallons: cust.borrowedGallons }).eq('id', id);
  },

  addTransaction: async (tx) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const newTx = { ...tx, id };
    
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
          newWaterLiters += litersUsed;
          newEmptyGallons += tx.qty;
        }
      }

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
        transactions: [newTx, ...state.transactions],
        inventory: { currentWaterLiters: newWaterLiters, emptyGallons: newEmptyGallons, filledGallons: newFilledGallons },
        customers: updatedCustomers,
      };
    });

    // Sync to DB
    const state = get();
    await supabase.from('transactions').insert({
      id: newTx.id, date: newTx.date, time: newTx.time, channel: newTx.channel, qty: newTx.qty,
      use_stock: newTx.useStock, customer_id: newTx.customerId, customer_name: newTx.customerName,
      gallon_status: newTx.gallonStatus, payment_method: newTx.paymentMethod, total_amount: newTx.totalAmount
    });
    
    await supabase.from('inventory').update({
      current_water_liters: state.inventory.currentWaterLiters,
      empty_gallons: state.inventory.emptyGallons,
      filled_gallons: state.inventory.filledGallons
    }).eq('id', 1);

    if (tx.customerId) {
      const cust = state.customers.find(c => c.id === tx.customerId);
      if (cust) await supabase.from('customers').update({ 
        debt_amount: cust.debtAmount, borrowed_gallons: cust.borrowedGallons 
      }).eq('id', cust.id);
    }
  },

  revertTransaction: async (id, revertQty) => {
    // Basic revert logic syncing
    // ... we will re-use the local update then push
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
        inventory: { currentWaterLiters: newWaterLiters, emptyGallons: newEmptyGallons, filledGallons: newFilledGallons },
        customers: updatedCustomers,
      };
    });

    const state = get();
    const tx = state.transactions.find(t => t.id === id);
    if (tx) {
      await supabase.from('transactions').update({ qty: tx.qty, total_amount: tx.totalAmount }).eq('id', id);
    }
    
    await supabase.from('inventory').update({
      current_water_liters: state.inventory.currentWaterLiters,
      empty_gallons: state.inventory.emptyGallons,
      filled_gallons: state.inventory.filledGallons
    }).eq('id', 1);

    const oldTx = state.transactions.find(t => t.id === id);
    if (oldTx && oldTx.customerId) {
      const cust = state.customers.find(c => c.id === oldTx.customerId);
      if (cust) await supabase.from('customers').update({ 
        debt_amount: cust.debtAmount, borrowed_gallons: cust.borrowedGallons 
      }).eq('id', cust.id);
    }
  },

  addWarehouseHistory: async (history) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const newHist = { ...history, id };

    set((state) => {
      let emptyChange = 0;
      let filledChange = 0;
      let waterChange = 0;

      if (history.type === 'kosong') {
        emptyChange = history.amountChange;
      } else if (history.type === 'isi') {
        filledChange = history.amountChange;
        if (history.amountChange > 0 && !history.description.toLowerCase().includes('opname')) {
          waterChange = -(history.amountChange * 19);
          emptyChange = -history.amountChange;
        }
      }
      
      return {
        warehouseHistories: [newHist, ...state.warehouseHistories],
        inventory: {
          ...state.inventory,
          currentWaterLiters: Math.max(0, state.inventory.currentWaterLiters + waterChange),
          emptyGallons: Math.max(0, state.inventory.emptyGallons + emptyChange),
          filledGallons: Math.max(0, state.inventory.filledGallons + filledChange),
        }
      };
    });

    const state = get();
    await supabase.from('warehouse_histories').insert({
      id: newHist.id, date: newHist.date, type: newHist.type, 
      amount_change: newHist.amountChange, description: newHist.description
    });
    await supabase.from('inventory').update({
      current_water_liters: state.inventory.currentWaterLiters,
      empty_gallons: state.inventory.emptyGallons,
      filled_gallons: state.inventory.filledGallons
    }).eq('id', 1);
  },

  addTankHistory: async (history) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const newHist = { ...history, id };

    set((state) => ({
      tankHistories: [newHist, ...state.tankHistories],
      inventory: {
        ...state.inventory,
        currentWaterLiters: Math.min(state.settings.tankCapacity, state.inventory.currentWaterLiters + history.litersAdded)
      }
    }));

    const state = get();
    await supabase.from('tank_histories').insert({
      id: newHist.id, date: newHist.date, liters_added: newHist.litersAdded, price_paid: newHist.pricePaid
    });
    await supabase.from('inventory').update({
      current_water_liters: state.inventory.currentWaterLiters
    }).eq('id', 1);
  },

  addExpense: async (expense) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const newExp = { ...expense, id };
    
    set((state) => ({
      expenses: [newExp, ...state.expenses]
    }));

    await supabase.from('expenses').insert({
      id: newExp.id, date: newExp.date, category: newExp.category, 
      amount: newExp.amount, description: newExp.description
    });
  },

  resetData: async () => {
    set({
      inventory: { currentWaterLiters: 1000, emptyGallons: 50, filledGallons: 20 },
      customers: [], transactions: [], warehouseHistories: [], tankHistories: [], expenses: []
    });
    
    // Clear all data from Supabase except settings
    await Promise.all([
      supabase.from('transactions').delete().neq('id', '0'),
      supabase.from('customers').delete().neq('id', '0'),
      supabase.from('warehouse_histories').delete().neq('id', '0'),
      supabase.from('tank_histories').delete().neq('id', '0'),
      supabase.from('expenses').delete().neq('id', '0'),
    ]);
    
    // Reset inventory to default
    await supabase.from('inventory').update({
      current_water_liters: 1000,
      empty_gallons: 50,
      filled_gallons: 20
    }).eq('id', 1);
  },
}));
