/**
 * Credit distribution script for GitHub Actions or cron.
 * Checks if credits module is enabled, then runs distributeCreditsToAllUsers directly
 * (no API call) to avoid timeout with large user counts.
 */
import { sendCreditDistributionNotification } from '@/notification';
import { distributeCreditsToAllUsers } from '../src/credits/distribute';

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not configured, skip distribution.');
    process.exit(0);
  }

  console.log('>>> Credit distribution script start');
  try {
    const result = await distributeCreditsToAllUsers();
    console.log(
      `<<< Credit distribution done. users: ${result.usersCount}, processed: ${result.processedCount}, errors: ${result.errorCount}`
    );
    // send notification message
    await sendCreditDistributionNotification({
      usersCount: result.usersCount,
      processedCount: result.processedCount,
      errorCount: result.errorCount,
    });
    process.exit(0);
  } catch (error) {
    console.error('Credit distribution failed:', error);
    process.exit(1);
  }
}

main();
