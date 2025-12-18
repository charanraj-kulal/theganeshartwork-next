import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const productName = formData.get('productName') as string;
    const frameSize = formData.get('frameSize') as string;
    const price = formData.get('price') as string;
    const quantity = formData.get('quantity') as string;
    const orderNumber = formData.get('orderNumber') as string;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const shippingAddress = formData.get('shippingAddress') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const pincode = formData.get('pincode') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const total = formData.get('total') as string;

    // Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Convert image to buffer for attachment
    const imageBuffer = image ? Buffer.from(await image.arrayBuffer()) : null;
    const attachments = image && imageBuffer ? [{
      filename: image.name,
      content: imageBuffer,
    }] : [];

    // Admin Email HTML
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #374151; }
          .value { color: #1f2937; text-align: right; }
          .total-box { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 New Order Received!</h1>
            <p style="font-size: 18px; margin: 10px 0; opacity: 0.9;">Order #${orderNumber}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Customer Information</h2>
              <div class="detail-row">
                <span class="label">Name:</span>
                <span class="value">${customerName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${customerEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${customerPhone}</span>
              </div>
              <div class="detail-row">
                <span class="label">Address:</span>
                <span class="value" style="max-width: 60%;">${shippingAddress}</span>
              </div>
              <div class="detail-row">
                <span class="label">City:</span>
                <span class="value">${city}</span>
              </div>
              <div class="detail-row">
                <span class="label">State:</span>
                <span class="value">${state}</span>
              </div>
              <div class="detail-row">
                <span class="label">Pincode:</span>
                <span class="value">${pincode}</span>
              </div>
            </div>

            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Order Details</h2>
              <div class="detail-row">
                <span class="label">Product:</span>
                <span class="value">${productName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Frame Size:</span>
                <span class="value">${frameSize}</span>
              </div>
              <div class="detail-row">
                <span class="label">Price per Unit:</span>
                <span class="value">₹${Number(price).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Quantity:</span>
                <span class="value">${quantity}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              ${image ? `
              <div class="detail-row">
                <span class="label">Uploaded Image:</span>
                <span class="value">${image.name}</span>
              </div>
              ` : ''}
            </div>

            <div class="total-box">
              Total Amount: ₹${Number(total).toLocaleString()}
            </div>

            <div class="alert">
              <strong>⚡ Action Required:</strong>
              <p style="margin: 10px 0 0 0;">Please process this order within 4 hours and send design approval to customer.</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #374151; font-weight: 600; margin: 0 0 15px 0;">Contact Customer</p>
              <a href="https://wa.me/${customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(customerName)}%2C%20Thank%20you%20for%20your%20order%20%23${orderNumber}.%20We%20are%20processing%20your%20personalized%20frame." 
                 style="display: inline-block; background: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">
                💬 Contact on WhatsApp
              </a>
              <a href="tel:${customerPhone}" 
                 style="display: inline-block; background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">
                📞 Call Customer
              </a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">Order received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p style="margin: 10px 0 0 0;">Ganesh Artwork - Admin Panel</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Customer Confirmation Email HTML
    const customerEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #374151; }
          .value { color: #1f2937; text-align: right; }
          .total-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
            <p style="font-size: 18px; margin: 10px 0; opacity: 0.9;">Thank you for your order!</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; color: #374151;">Dear <strong>${customerName}</strong>,</p>
            <p style="color: #6b7280;">Your order has been successfully placed. We're excited to create your personalized frame!</p>

            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Order Summary</h2>
              <div class="detail-row">
                <span class="label">Order Number:</span>
                <span class="value">${orderNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Product:</span>
                <span class="value">${productName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Frame Size:</span>
                <span class="value">${frameSize}</span>
              </div>
              <div class="detail-row">
                <span class="label">Quantity:</span>
                <span class="value">${quantity}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</span>
              </div>
            </div>

            <div class="total-box">
              Total Amount: ₹${Number(total).toLocaleString()}
            </div>

            <div class="info-box">
              <strong>📸 What's Next?</strong>
              <p style="margin: 10px 0 0 0;">
                • We'll review your uploaded photo and create the design<br/>
                • You'll receive design approval within 4 hours<br/>
                • After approval, we'll start printing and shipping<br/>
                • Estimated delivery: 5-7 business days
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0; background: #f3f4f6; padding: 20px; border-radius: 8px;">
              <p style="color: #374151; font-weight: 600; margin: 0 0 15px 0;">Track Your Order Anytime</p>
              <a href="${process.env.BASE_URL}/track-order?orderNumber=${orderNumber}&email=${encodeURIComponent(customerEmail)}" 
                 style="display: inline-block; background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                📦 Track Order #${orderNumber}
              </a>
            </div>

            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Shipping Address</h2>
              <p style="margin: 0; color: #6b7280;">
                ${customerName}<br/>
                ${shippingAddress}<br/>
                ${city}, ${state} - ${pincode}<br/>
                Phone: ${customerPhone}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280;">Need help? Contact us:</p>
              <a href="tel:9448075790" class="button" style="color: white; text-decoration: none;">📞 Call Us</a>
              <a href="https://wa.me/9448075790" class="button" style="color: white; text-decoration: none;">💬 WhatsApp</a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">Order placed on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p style="margin: 10px 0;">Thank you for choosing Ganesh Artwork!</p>
            <p style="margin: 10px 0; opacity: 0.7;">🎨 Creating Memories, One Frame at a Time</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: `"Ganesh Artwork Orders" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ORDER_NOTIFICATION_EMAIL,
      subject: `🎉 New Order #${orderNumber} - ${productName}`,
      html: adminEmailHTML,
      attachments,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"Ganesh Artwork" <${process.env.SMTP_EMAIL}>`,
      to: customerEmail,
      subject: `✅ Order Confirmed #${orderNumber} - Ganesh Artwork`,
      html: customerEmailHTML,
    });

    return NextResponse.json({
      success: true,
      message: 'Order emails sent successfully',
    });

  } catch (error: any) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send emails',
        details: error?.message 
      },
      { status: 500 }
    );
  }
}
