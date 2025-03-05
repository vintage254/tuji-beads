import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { orderId, items, totalAmount, userId } = await request.json();

    // Get user details
    const userQuery = `*[_type == "user" && _id == $userId][0]{
      name,
      email,
      phoneNumber
    }`;
    const user = await client.fetch(userQuery, { userId });

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
      name: productMap[item.productId],
      quantity: item.quantity,
      price: item.price
    }));

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
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
        <p><strong>Customer Phone:</strong> ${user.phoneNumber}</p>
        
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

    // Send email
    await transporter.sendMail(emailContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    );
  }
}
