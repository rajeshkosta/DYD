// REMOVE twilio import ❌
// import twilio from 'twilio';

// Generate a 6-digit OTP
export const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Mock Send OTP (for development)
export const sendOTPSMS = async (phoneNumber: string, otp: string) => {
  try {
    console.log("=================================");
    console.log(`📱 MOCK OTP SENT`);
    console.log(`Number: ${phoneNumber}`);
    console.log(`OTP: ${otp}`);
    console.log("=================================");

    return true; // simulate success
  } catch (error) {
    console.error("Mock OTP failed", error);
    throw new Error("Failed to send OTP");
  }
};
