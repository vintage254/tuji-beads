import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { orderId, items, totalAmount, userId, email } = await request.json();

    // Get user details - either by userId or email
    let user = null;
    
    if (userId) {
      const userQuery = `*[_type == "user" && _id == $userId][0]{
        name,
        email,
        phoneNumber
      }`;
      user = await client.fetch(userQuery, { userId });
    } else if (email) {
      const userQuery = `*[_type == "user" && email == $email][0]{
        name,
        email,
        phoneNumber
      }`;
      user = await client.fetch(userQuery, { email });
    }
    
    // If no user found, create a minimal user object with the email
    if (!user && email) {
      user = {
        name: 'Customer',
        email: email,
        phoneNumber: 'Not provided'
      };
    }
    
    // If still no user, return an error
    if (!user) {
      return NextResponse.json(
        { error: 'User information not found' },
        { status: 400 }
      );
    }

    // Get product details
    const productIds = items.map(item => item.productId);
    const productsQuery = `*[_type == "product" && _id in $ids]{
      _id,
      name
    }`;
    const products = await client.fetch(productsQuery, { ids: productIds });

    // Create product lookup map
    const productMap = products.reduce((acc, product) => {
      acc[product._id] = product.name;
      return acc;
    }, {});

    // Format order items
    const formattedItems = items.map(item => ({
      name: productMap[item.productId] || 'Product',
      quantity: item.quantity,
      price: item.price
    }));

    // Log environment variables (without exposing sensitive data)
    console.log('Email configuration:', { 
      emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
      emailPassword: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
    });
    
    // Log more detailed information about the email configuration
    console.log('Email sending attempt for order:', orderId);
    console.log('Email will be sent to admin:', 'derricknjuguna414@gmail.com');
    console.log('Email will be sent to customer:', user.email);
    
    // Create email transporter with more robust configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true // Always enable debug for troubleshooting
    });

    // Create email content
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: 'derricknjuguna414@gmail.com',
      subject: `New Order from ${user.name}`,
      html: `
        <h2>New Order Details</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer Name:</strong> ${user.name}</p>
        <p><strong>Customer Email:</strong> ${user.email}</p>
        <p><strong>Customer Phone:</strong> ${user.phoneNumber || 'Not provided'}</p>
        
        <h3>Order Items:</h3>
        <ul>
          ${formattedItems.map(item => `
            <li>${item.name} - Quantity: ${item.quantity} - Price: KES ${item.price}</li>
          `).join('')}
        </ul>
        
        <p><strong>Total Amount:</strong> KES ${totalAmount}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    // Verify connection configuration
    try {
      console.log('Verifying email transport connection...');
      await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
          if (error) {
            console.error('Email transport verification failed:', error);
            reject(error);
          } else {
            console.log('Email transport is ready to send messages');
            resolve(success);
          }
        });
      });
    } catch (verifyError) {
      console.error('Email transport verification error:', verifyError);
      // Continue anyway, as some providers don't support verify
    }
    
    // Send email to admin
    try {
      console.log('Sending notification email to admin...');
      const adminEmailResult = await transporter.sendMail(emailContent);
      console.log('Admin email sent successfully:', adminEmailResult.messageId);
    } catch (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError);
      console.error('Admin email error details:', adminEmailError.message);
      // Continue to customer email even if admin email fails
    }
    
    // Also send a confirmation email to the customer
    const customerEmailContent = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Order Confirmation - Tuji Beads',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Dear ${user.name},</p>
        <p>We have received your order and are processing it. Here are your order details:</p>
        
        <p><strong>Order ID:</strong> ${orderId}</p>
        
        <h3>Order Items:</h3>
        <ul>
          ${formattedItems.map(item => `
            <li>${item.name} - Quantity: ${item.quantity} - Price: KES ${item.price}</li>
          `).join('')}
        </ul>
        
        <p><strong>Total Amount:</strong> KES ${totalAmount}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
        
        <p>We will notify you when your order is ready for delivery or pickup.</p>
        <p>Thank you for shopping with Tuji Beads!</p>
      `
    };
    
    // Send customer confirmation email
    try {
      console.log('Sending confirmation email to customer:', user.email);
      const customerEmailResult = await transporter.sendMail(customerEmailContent);
      console.log('Customer email sent successfully:', customerEmailResult.messageId);
    } catch (customerEmailError) {
      console.error('Failed to send customer confirmation email:', customerEmailError);
      console.error('Customer email error details:', customerEmailError.message);
      // Return partial success if at least admin email was sent
      return NextResponse.json({ 
        success: true, 
        warning: 'Failed to send customer confirmation email' 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    );
  }
}
