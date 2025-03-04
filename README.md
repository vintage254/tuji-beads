# Tuji Beads E-Commerce Platform

This is a Next.js e-commerce platform for Tuji Beads, featuring user authentication, product catalog, shopping cart, order management, and email notifications.

## Features

- User authentication with Sanity CMS
- Product catalog and management
- Shopping cart functionality
- Order history and management
- Email notifications for orders using Gmail
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v18.19.1 or higher)
- npm (v9.2.0 or higher)
- Gmail account for sending order notifications

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.sample` to `.env.local`
   - Fill in your Gmail credentials (see [Email Setup](#email-setup))

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Email Setup

This application uses Gmail for sending order notifications. To set it up:

1. Create a Gmail account or use an existing one
2. Generate an App Password for your Gmail account:
   - Go to your [Google Account](https://myaccount.google.com/)
   - Enable 2-Step Verification if not already enabled
   - Go to Security > App passwords
   - Generate a new app password for "Mail" and "Other" (name it "Tuji Beads")
3. Add your Gmail credentials to `.env.local`:

```
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

4. Test your email configuration:

```bash
node scripts/test-gmail.js
```

For more detailed instructions, see [EMAIL_SETUP.md](./EMAIL_SETUP.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
