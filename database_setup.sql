-- Tabel Pengaturan Dasar (Hanya ada 1 baris)
CREATE TABLE settings (
  id integer PRIMARY KEY DEFAULT 1,
  price_pickup integer DEFAULT 6000,
  price_delivery integer DEFAULT 7000,
  price_store integer DEFAULT 5000,
  store_commission integer DEFAULT 1000,
  total_gallon_asset integer DEFAULT 100,
  tank_capacity integer DEFAULT 5000,
  tank_price integer DEFAULT 350000,
  investor_pct integer DEFAULT 50,
  cap_price integer DEFAULT 100,
  tissue_price integer DEFAULT 50,
  seal_price integer DEFAULT 50,
  depot_name text DEFAULT 'DepotPro',
  depot_address text DEFAULT '',
  pic_name text DEFAULT ''
);

-- Tabel Inventaris/Gudang (Hanya ada 1 baris)
CREATE TABLE inventory (
  id integer PRIMARY KEY DEFAULT 1,
  current_water_liters integer DEFAULT 0,
  empty_gallons integer DEFAULT 0,
  filled_gallons integer DEFAULT 0
);

-- Tabel Pelanggan
CREATE TABLE customers (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text,
  debt_amount integer DEFAULT 0,
  borrowed_gallons integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Transaksi Penjualan
CREATE TABLE transactions (
  id text PRIMARY KEY,
  date text NOT NULL,
  time text NOT NULL,
  channel text NOT NULL,
  qty integer NOT NULL,
  use_stock boolean DEFAULT false,
  customer_id text REFERENCES customers(id) ON DELETE SET NULL,
  customer_name text,
  gallon_status text NOT NULL,
  payment_method text NOT NULL,
  total_amount integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Riwayat Keluar Masuk Gudang (Opname)
CREATE TABLE warehouse_histories (
  id text PRIMARY KEY,
  date text NOT NULL,
  type text NOT NULL,
  amount_change integer NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Riwayat Pembelian Air Tangki
CREATE TABLE tank_histories (
  id text PRIMARY KEY,
  date text NOT NULL,
  liters_added integer NOT NULL,
  price_paid integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel Biaya Operasional (OPEX)
CREATE TABLE expenses (
  id text PRIMARY KEY,
  date text NOT NULL,
  category text NOT NULL,
  amount integer NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Memasukkan Baris Pertama (Inisialisasi Data Default)
INSERT INTO settings (id) VALUES (1);
INSERT INTO inventory (id) VALUES (1);
