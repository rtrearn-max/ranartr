import { db } from '../db';

export function useBackup() {
  const exportData = async () => {
    const users = await db.users.toArray();
    const deposits = await db.deposits.toArray();
    const withdrawals = await db.withdrawals.toArray();
    const plans = await db.plans.toArray();
    const userPlans = await db.userPlans.toArray();
    const dailyRewardClaims = await db.dailyRewardClaims.toArray();
    const spinResults = await db.spinResults.toArray();
    const systemSettings = await db.systemSettings.toArray();
    const transactions = await db.transactions.toArray();
    const themeSettings = await db.themeSettings.toArray();

    const backup = {
      users,
      deposits,
      withdrawals,
      plans,
      userPlans,
      dailyRewardClaims,
      spinResults,
      systemSettings,
      transactions,
      themeSettings,
      exportDate: new Date().toISOString(),
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rtr-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const backupText = e.target?.result as string;
          const backup = JSON.parse(backupText);
          
          if (!backup || typeof backup !== 'object') {
            throw new Error('Invalid backup file format');
          }

          if (!Array.isArray(backup.users)) {
            throw new Error('Backup is missing users data');
          }

          if (!Array.isArray(backup.deposits)) {
            throw new Error('Backup is missing deposits data');
          }

          if (!Array.isArray(backup.withdrawals)) {
            throw new Error('Backup is missing withdrawals data');
          }

          if (!Array.isArray(backup.plans)) {
            throw new Error('Backup is missing plans data');
          }

          if (!Array.isArray(backup.userPlans)) {
            throw new Error('Backup is missing userPlans data');
          }

          if (!Array.isArray(backup.dailyRewardClaims)) {
            throw new Error('Backup is missing dailyRewardClaims data');
          }

          if (!Array.isArray(backup.spinResults)) {
            throw new Error('Backup is missing spinResults data');
          }

          if (!Array.isArray(backup.systemSettings)) {
            throw new Error('Backup is missing systemSettings data');
          }

          if (!Array.isArray(backup.transactions)) {
            throw new Error('Backup is missing transactions data');
          }

          if (backup.systemSettings.length === 0) {
            throw new Error('Backup contains no system settings - this would render the app unusable');
          }

          const users = backup.users.map((u: any) => ({
            ...u,
            createdAt: new Date(u.createdAt),
          }));

          const deposits = backup.deposits.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt),
            processedAt: d.processedAt ? new Date(d.processedAt) : undefined,
          }));

          const withdrawals = backup.withdrawals.map((w: any) => ({
            ...w,
            createdAt: new Date(w.createdAt),
            processedAt: w.processedAt ? new Date(w.processedAt) : undefined,
          }));

          const plans = backup.plans;

          const userPlans = backup.userPlans.map((up: any) => ({
            ...up,
            purchaseDate: new Date(up.purchaseDate),
            expiryDate: new Date(up.expiryDate),
          }));

          const dailyRewardClaims = backup.dailyRewardClaims.map((r: any) => ({
            ...r,
            claimedAt: new Date(r.claimedAt),
          }));

          const spinResults = backup.spinResults.map((s: any) => ({
            ...s,
            spunAt: new Date(s.spunAt),
          }));

          const systemSettings = backup.systemSettings;

          const transactions = backup.transactions.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }));

          const themeSettings = Array.isArray(backup.themeSettings)
            ? backup.themeSettings.map((th: any) => ({
                ...th,
                createdAt: new Date(th.createdAt),
              }))
            : [];

          await db.transaction('rw', [
            db.users,
            db.deposits,
            db.withdrawals,
            db.plans,
            db.userPlans,
            db.dailyRewardClaims,
            db.spinResults,
            db.systemSettings,
            db.transactions,
            db.themeSettings,
          ], async () => {
            await db.users.clear();
            await db.deposits.clear();
            await db.withdrawals.clear();
            await db.plans.clear();
            await db.userPlans.clear();
            await db.dailyRewardClaims.clear();
            await db.spinResults.clear();
            await db.systemSettings.clear();
            await db.transactions.clear();
            await db.themeSettings.clear();

            if (users.length > 0) await db.users.bulkAdd(users);
            if (deposits.length > 0) await db.deposits.bulkAdd(deposits);
            if (withdrawals.length > 0) await db.withdrawals.bulkAdd(withdrawals);
            if (plans.length > 0) await db.plans.bulkAdd(plans);
            if (userPlans.length > 0) await db.userPlans.bulkAdd(userPlans);
            if (dailyRewardClaims.length > 0) await db.dailyRewardClaims.bulkAdd(dailyRewardClaims);
            if (spinResults.length > 0) await db.spinResults.bulkAdd(spinResults);
            if (systemSettings.length > 0) await db.systemSettings.bulkAdd(systemSettings);
            if (transactions.length > 0) await db.transactions.bulkAdd(transactions);
            if (themeSettings.length > 0) await db.themeSettings.bulkAdd(themeSettings);
          });

          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to import backup'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    exportData,
    importData,
  };
}
