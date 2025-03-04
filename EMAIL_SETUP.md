# Email Setup for Tuji Beads

This document explains how to set up the Gmail functionality for order notifications in the Tuji Beads e-commerce application.

## Gmail Setup

The application uses Gmail to send order notification emails. Follow these steps to set it up:

1. **Ensure You Have a Gmail Account**
   - If you don't have a Gmail account, create one at [Gmail](https://mail.google.com)

2. **Enable Less Secure Apps or Generate an App Password**
   - For security reasons, Google doesn't allow direct password authentication for third-party apps
   - You need to generate an "App Password" for your application
   
3. **Generate an App Password**
   - Go to your [Google Account](https://myaccount.google.com/)
   - Select "Security" from the left menu
   - Under "Signing in to Google," select "2-Step Verification" (you must enable this first)
   - At the bottom of the page, select "App passwords"
   - Select "Mail" as the app and "Other" as the device (name it "Tuji Beads")
   - Click "Generate"
   - Google will display a 16-character password - copy this password

4. **Configure Environment Variables**
   - Create a `.env.local` file in the root of your project (if it doesn't exist)
   - Add the following variables:
     ```
     GMAIL_USER=your_gmail_address@gmail.com
     GMAIL_APP_PASSWORD=your_16_character_app_password
     ```

5. **Restart Your Application**
   - Stop and restart your Next.js server to apply the changes

## Testing the Email Functionality

To test if your email setup is working:

1. Sign in to your application
2. Add items to your cart
3. Complete the checkout process
4. Check the console logs for any email-related errors
5. Check your Gmail inbox and sent folder to see if the email was sent successfully

## Troubleshooting

If emails are not being sent:

1. Check the server logs for error messages
2. Verify that your Gmail address and app password are correct
3. Make sure 2-Step Verification is enabled on your Google account
4. Check if your Gmail account has any sending limits or restrictions
5. Try sending a test email directly from your Gmail account
6. Make sure your Gmail account isn't locked due to suspicious activity

## Gmail Limitations

Be aware of these Gmail limitations:

1. Gmail has sending limits (typically 500 emails per day for regular accounts)
2. Your emails might be marked as spam if sent in bulk
3. Gmail is not designed for high-volume transactional emails

## Production Considerations

For production environments:

1. Consider upgrading to Google Workspace (formerly G Suite) for higher sending limits
2. Use environment variables on your hosting platform (Vercel, Netlify, etc.) instead of .env files
3. Consider implementing a dedicated email service like SendGrid, Mailgun, or Amazon SES for higher volume
4. Implement proper error handling and retry logic for failed email attempts
5. Set up a dedicated email address for order notifications (e.g., orders@yourdomain.com)
