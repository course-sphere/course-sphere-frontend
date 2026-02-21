import { User } from '../user';

export type TransactionType =
    | 'deposit'
    | 'withdrawal'
    | 'purchase'
    | 'earning'
    | 'refund';
export type TransactionDirection = 'in' | 'out';
export type WalletStatus = 'active' | 'frozen' | 'pending';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    status: WalletStatus;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    wallet_id: string;
    type: TransactionType;
    direction: TransactionDirection;
    amount: number;
    description?: string;
    created_at: string;
}

export interface Payment {
    id: string;
    user_id: string;
    amount: number;
    txn_id: string;
    status: PaymentStatus;
    pay_at: string;
    created_at: string;
}

export type WithdrawStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WithdrawRequest {
    id: string;
    user_id: string;
    amount: number;
    status: WithdrawStatus;
    bank_info?: string;
    note?: string;
    user?: User;
    created_at: string;
    updated_at: string;
}
