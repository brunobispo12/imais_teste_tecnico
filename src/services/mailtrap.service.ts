import { MailtrapClient } from 'mailtrap';

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
  accountId: Number(process.env.MAILTRAP_ACCOUNT_ID),
  testInboxId: Number(process.env.MAILTRAP_TEST_INBOX_ID),
  sandbox: true,
});
