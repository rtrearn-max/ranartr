import { useState, useEffect } from 'react';
import { db, type CoinPurchase, type User, type Transaction } from '../db';
import { useAuth } from '../auth-context';
import { useSettings } from './useSettings';

export function useCoinPurchases() {
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const [coinPurchases, setCoinPurchases] = useState<CoinPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCoinPurchases = async () => {
    if (!currentUser?.id) return;

    const userPurchases = await db.coinPurchases
      .where('userId')
      .equals(currentUser.id)
      .reverse()
      .sortBy('createdAt');
    
    setCoinPurchases(userPurchases);
    setIsLoading(false);
  };

  const createCoinPurchase = async (data: {
    pkrAmount: number;
    method: string;
    transactionId: string;
    screenshot: File | null;
  }) => {
    if (!currentUser?.id || !settings) return;

    const coinAmount = Math.floor(data.pkrAmount / settings.coinRate);
    const screenshotBase64 = data.screenshot ? await fileToBase64(data.screenshot) : '';

    const purchaseId = await db.coinPurchases.add({
      userId: currentUser.id,
      pkrAmount: data.pkrAmount,
      coinAmount,
      method: data.method,
      transactionId: data.transactionId,
      screenshot: screenshotBase64,
      status: 'pending',
      createdAt: new Date(),
    });

    await refreshCoinPurchases();
    return purchaseId;
  };

  const approveCoinPurchase = async (purchaseId: number) => {
    const purchase = await db.coinPurchases.get(purchaseId);
    if (!purchase || purchase.status !== 'pending') return;

    const user = await db.users.get(purchase.userId);
    if (!user) return;

    await db.users.update(purchase.userId, {
      coinBalance: user.coinBalance + purchase.coinAmount,
    });

    await db.coinPurchases.update(purchaseId, {
      status: 'approved',
      processedAt: new Date(),
    });

    await db.transactions.add({
      userId: purchase.userId,
      type: 'coin_purchase',
      amount: purchase.coinAmount,
      description: `Purchased ${purchase.coinAmount} coins for ₨${purchase.pkrAmount}`,
      createdAt: new Date(),
    });

    await refreshCoinPurchases();
  };

  const rejectCoinPurchase = async (purchaseId: number) => {
    const purchase = await db.coinPurchases.get(purchaseId);
    if (!purchase || purchase.status !== 'pending') return;

    await db.coinPurchases.update(purchaseId, {
      status: 'rejected',
      processedAt: new Date(),
    });

    await refreshCoinPurchases();
  };

  useEffect(() => {
    refreshCoinPurchases();
  }, [currentUser?.id]);

  return {
    coinPurchases,
    isLoading,
    createCoinPurchase,
    approveCoinPurchase,
    rejectCoinPurchase,
    refreshCoinPurchases,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
