'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    History,
    Loader2,
    ArrowRightLeft,
    Wallet,
    ShoppingBag,
    Landmark,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    useGetWallet,
    useGetWalletHistories,
    useCreatePaymentLink,
} from '@/lib/service/wallet';
import { RoleGuard } from '@/components/layout/role-gaurd';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const MOCK_HISTORIES = [
    {
        id: 'tx-1',
        amount: 500000,
        detail: 'Deposit via PayOS',
        created_at: '2026-03-24T10:00:00Z',
        type: 'deposit',
    },
    {
        id: 'tx-2',
        amount: 150000,
        detail: 'Course Purchase: Advanced React',
        created_at: '2026-03-23T14:30:00Z',
        type: 'purchase',
    },
    {
        id: 'tx-3',
        amount: 200000,
        detail: 'Withdraw to Techcombank',
        created_at: '2026-03-20T09:15:00Z',
        type: 'withdraw',
    },
    {
        id: 'tx-4',
        amount: 1000000,
        detail: 'Deposit via Momo',
        created_at: '2026-03-15T16:45:00Z',
        type: 'deposit',
    },
    {
        id: 'tx-5',
        amount: 50000,
        detail: 'Course Purchase: UI/UX Masterclass',
        created_at: '2026-03-10T11:20:00Z',
        type: 'purchase',
    },
];

export default function WalletPage() {
    const { data: wallet, isLoading: isWalletLoading } = useGetWallet();
    const { data: realHistories = [], isLoading: isHistoryLoading } =
        useGetWalletHistories();
    const { mutateAsync: createPaymentLink, isPending: isCreatingLink } =
        useCreatePaymentLink();

    const [depositAmount, setDepositAmount] = useState('');
    const [isDepositOpen, setIsDepositOpen] = useState(false);

    const handleDeposit = async () => {
        const amount = Number(depositAmount);
        // Nạp tối thiểu 10k, ít quá bắt đi ra
        if (!amount || amount < 10000) return;

        try {
            const paymentUrl = await createPaymentLink({ amount });

            if (paymentUrl) {
                window.location.href = paymentUrl;
            }
        } catch (error) {
            console.error('Deposit failed', error);
        }
    };
    const displayHistories =
        realHistories.length > 0 ? realHistories : MOCK_HISTORIES;

    return (
        <RoleGuard allowedRoles={['student', 'instructor', 'admin']}>
            <div className="mx-auto max-w-5xl space-y-8 p-6 pb-24">
                <div>
                    <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
                        My Wallet
                    </h1>
                    <p className="text-muted-foreground mt-2 text-base">
                        Manage your balance and transaction history.
                    </p>
                </div>

                <Card className="via-primary relative overflow-hidden border-none bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-10 -mb-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

                    <CardContent className="relative z-10 flex flex-col justify-between gap-8 p-8 sm:p-10 md:flex-row md:items-center">
                        <div className="space-y-4">
                            <div className="text-primary-foreground/80 flex items-center gap-2 text-sm font-medium tracking-wider uppercase">
                                <Wallet className="h-5 w-5" />
                                <span>Available Balance</span>
                            </div>
                            <div className="text-5xl font-black tracking-tight text-white drop-shadow-md sm:text-6xl">
                                {isWalletLoading ? (
                                    <Loader2 className="h-10 w-10 animate-spin opacity-50" />
                                ) : (
                                    formatCurrency(wallet?.balance || 1250000)
                                )}
                            </div>
                            <div className="text-primary-foreground/60 inline-block rounded-lg bg-black/20 px-3 py-1 font-mono text-sm backdrop-blur-xs">
                                Wallet ID:{' '}
                                {wallet?.id
                                    ? wallet.id.toUpperCase()
                                    : '550E8400-E29B-41D4...'}
                            </div>
                        </div>

                        <div className="flex min-w-[200px] shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                            <Dialog
                                open={isDepositOpen}
                                onOpenChange={setIsDepositOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="text-primary h-12 w-full rounded-xl bg-white text-base font-bold shadow-lg transition-all hover:bg-white/90">
                                        <ArrowDownToLine className="mr-2 h-5 w-5" />
                                        Deposit Funds
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">
                                            Deposit Funds
                                        </DialogTitle>
                                        <DialogDescription>
                                            Enter the amount you wish to deposit
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">
                                                Deposit amount
                                            </Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                className="py-6 text-lg"
                                                placeholder="VD: 50000"
                                                value={depositAmount}
                                                onChange={(e) =>
                                                    setDepositAmount(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsDepositOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleDeposit}
                                            disabled={
                                                isCreatingLink || !depositAmount
                                            }
                                        >
                                            {isCreatingLink ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : null}
                                            Deposit
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button
                                variant="outline"
                                className="h-12 w-full rounded-xl border-white/20 bg-black/20 text-base font-semibold text-white backdrop-blur-xs transition-all hover:bg-black/40 hover:text-white"
                            >
                                <ArrowUpFromLine className="mr-2 h-5 w-5" />
                                Withdraw
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border overflow-hidden rounded-2xl shadow-md">
                    <CardHeader className="border-border/50 bg-muted/20 border-b pt-6 pb-5">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <History className="text-primary h-6 w-6" />
                            Recent Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isHistoryLoading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                            </div>
                        ) : displayHistories.length === 0 ? (
                            <div className="text-muted-foreground flex flex-col items-center justify-center p-16 text-center">
                                <ArrowRightLeft className="mb-4 h-12 w-12 opacity-20" />
                                <p className="text-foreground text-lg font-medium">
                                    No transactions have been made yet.
                                </p>
                                <p className="mt-1 text-sm">
                                    Your history will appear when you top up
                                    your account or purchase a course.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-muted-foreground bg-muted/30 border-border border-b text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">
                                                Transactions
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                Transaction Code (ID)
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                Time
                                            </th>
                                            <th className="px-6 py-4 text-right font-semibold">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-border divide-y">
                                        {displayHistories.map((tx) => {
                                            const detailStr =
                                                tx.detail.toLowerCase();
                                            const isPurchase =
                                                detailStr.includes('purchase');
                                            const isWithdraw =
                                                detailStr.includes('withdraw');

                                            let Icon = ArrowDownToLine;
                                            let iconBg =
                                                'bg-emerald-500/10 text-emerald-600';
                                            let amountColor =
                                                'text-emerald-600';
                                            let sign = '+';

                                            if (isPurchase) {
                                                Icon = ShoppingBag;
                                                iconBg =
                                                    'bg-blue-500/10 text-blue-600';
                                                amountColor = 'text-foreground';
                                                sign = '-';
                                            } else if (isWithdraw) {
                                                Icon = Landmark;
                                                iconBg =
                                                    'bg-amber-500/10 text-amber-600';
                                                amountColor = 'text-foreground';
                                                sign = '-';
                                            }

                                            return (
                                                <tr
                                                    key={tx.id}
                                                    className="hover:bg-muted/30 group transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`rounded-xl p-2.5 ${iconBg}`}
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-foreground font-semibold">
                                                                {tx.detail}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted-foreground px-6 py-4 font-mono text-xs">
                                                        {tx.id
                                                            .substring(0, 8)
                                                            .toUpperCase()}
                                                    </td>
                                                    <td className="text-muted-foreground px-6 py-4">
                                                        {format(
                                                            new Date(
                                                                tx.created_at,
                                                            ),
                                                            'dd/MM/yyyy • HH:mm',
                                                        )}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 text-right font-bold whitespace-nowrap ${amountColor}`}
                                                    >
                                                        {sign}
                                                        {formatCurrency(
                                                            tx.amount,
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
