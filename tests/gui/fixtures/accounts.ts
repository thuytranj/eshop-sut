import { type APIRequestContext } from '@playwright/test';

export interface TestAccount {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export const TEST_ACCOUNTS: Record<string, TestAccount> = {
  admin: {
    email: 'admin@eshop.com',
    password: 'Admin123!',
    role: 'admin',
  },
  userA: {
    email: 'test@eshop.com',
    password: 'Test1234!',
    role: 'user',
  },
  userB: {
    email: 'userb@eshop.com',
    password: 'UserB123!',
    role: 'user',
  },
};

export async function requestLiveOtp(
  api: APIRequestContext,
  apiURL: string,
  email: string
): Promise<string> {
  const res = await api.post(`${apiURL}/forgot-password`, {
    data: { email },
  });
  if (!res.ok()) {
    throw new Error(`Failed to request OTP for ${email}: ${res.status()} ${await res.text()}`);
  }
  const data = await res.json();
  return String(data.resetToken || '');
}

export function assertOtpFormat(otp: string): void {
  if (!/^\d{6}$/.test(otp)) {
    throw new Error(`OTP must be exactly 6 digits, received: "${otp}"`);
  }
}
