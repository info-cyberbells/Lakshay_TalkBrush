import admin from 'firebase-admin';
import cron from 'node-cron';
import { User } from './models/userModel.js';
import fs from 'fs';

// Read the key file
const serviceAccount = JSON.parse(
    fs.readFileSync('./firebase-key.json', 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('✅ Firebase initialized');

export const sendNotification = async (tokens, title, message) => {
    try {
        await admin.messaging().sendEachForMulticast({
            notification: { title, body: message },
            tokens: tokens
        });
        console.log('✅ Notification sent to', tokens.length, 'devices');
    } catch (error) {
        console.error('❌ Notification failed:', error.message);
    }
};

// Job: Check inactive users every day
export const startNotificationJob = () => {
    // Runs daily at 10 AM
    cron.schedule('0 10 * * *', async () => {
        console.log('🔍 Checking for inactive users...');

        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const inactiveUsers = await User.find({
            lastLogin: { $lt: tenDaysAgo },
            'deviceTokens.0': { $exists: true }
        });

        console.log(`📊 Found ${inactiveUsers.length} inactive users`);

        for (const user of inactiveUsers) {
            const tokens = user.deviceTokens.map(d => d.token);

            await sendNotification(
                tokens,
                "We miss you! 👋",
                `Hi ${user.fullName}, come back and see what's new!`
            );
        }

        console.log('✅ Job completed');
    });

    console.log('⏰ Notification job started (runs daily at 10 AM)');
};