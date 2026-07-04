import admin from "firebase-admin";
import * as path from "path";

const serviceAccountPath = path.join(__dirname, "../config/appadvent-d0f1b-firebase-adminsdk-fbsvc-39e27b7257.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath)), // Use service account key
    });
}

// Generate a 6-digit OTP manually (for UI testing, not needed for Firebase)
export const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Send OTP via Firebase Authentication
 * @param phoneNumber - User's phone number in E.164 format (e.g., +1234567890)
 */
export const sendOTPSMS = async (phoneNumber: string, otp: string) => {
        console.log("Sending OTP to", phoneNumber);
        
    try {
        const verificationSession = await admin.auth().createUser({
            phoneNumber,
        });
        console.log(`OTP sent to ${phoneNumber}, verification session ID: ${verificationSession.uid}`);

        return verificationSession;
    } catch (error: any) {
        console.error(`Failed to send OTP: ${error.message}`);
        throw new Error("Failed to send OTP. Please try again.");
    }
};

/**
 * Verify OTP received from Firebase
 * @param sessionId - Firebase verification session ID
 * @param otp - OTP entered by user
 */
export const verifyOTP = async (sessionId: string, otp: string) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(sessionId);
        if (decodedToken) {
            console.log("OTP verified successfully");
            return true;
        }
        return false;
    } catch (error: any) {
        console.error(`OTP verification failed: ${error.message}`);
        return false;
    }
};
