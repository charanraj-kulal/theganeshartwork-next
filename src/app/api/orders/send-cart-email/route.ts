import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract order details
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
    
    // Extract cart items (sent as JSON string)
    const cartItemsStr = formData.get('cartItems') as string;
    const cartItems = JSON.parse(cartItemsStr);
    
    // Extract images (image_0, image_1, etc.)
    const images: { [key: number]: File } = {};
    let imageIndex = 0;
    while (formData.has(`image_${imageIndex}`)) {
      const img = formData.get(`image_${imageIndex}`) as File;
      if (img && img.size > 0) {
        images[imageIndex] = img;
      }
      imageIndex++;
    }

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

    // Prepare attachments from images
    const attachments = [];
    for (const [index, imageFile] of Object.entries(images)) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      attachments.push({
        filename: `product_${parseInt(index) + 1}_${imageFile.name}`,
        content: imageBuffer,
      });
    }

    // Build products table HTML for admin email
    let adminProductsTableRows = '';
    let subtotal = 0;
    
    cartItems.forEach((item: any, index: number) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      const hasImage = images[index] !== undefined;
      
      adminProductsTableRows += `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 15px 10px;">
            <strong>${item.name}</strong>
            ${hasImage ? '<br/><span style="color: #10b981; font-size: 12px;">✓ Image attached</span>' : '<br/><span style="color: #f59e0b; font-size: 12px;">⚠ No image</span>'}
          </td>
          <td style="padding: 15px 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 15px 10px; text-align: right;">₹${item.price.toLocaleString()}</td>
          <td style="padding: 15px 10px; text-align: right;"><strong>₹${itemTotal.toLocaleString()}</strong></td>
        </tr>
      `;
    });

    // Build products table HTML for customer email
    let customerProductsTableRows = '';
    cartItems.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      customerProductsTableRows += `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 15px 10px;"><strong>${item.name}</strong></td>
          <td style="padding: 15px 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 15px 10px; text-align: right;">₹${item.price.toLocaleString()}</td>
          <td style="padding: 15px 10px; text-align: right;"><strong>₹${itemTotal.toLocaleString()}</strong></td>
        </tr>
      `;
    });

    // Admin Email HTML
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 700px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #374151; }
          .value { color: #1f2937; text-align: right; }
          .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .products-table th { background: #f3f4f6; padding: 12px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
          .products-table td { padding: 15px 10px; }
          .total-box { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 New Cart Order Received!</h1>
            <p style="font-size: 18px; margin: 10px 0; opacity: 0.9;">Order #${orderNumber}</p>
            <p style="font-size: 14px; margin: 5px 0; opacity: 0.8;">${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in this order</p>
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
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
            </div>

            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Order Items</h2>
              <table class="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center; width: 100px;">Quantity</th>
                    <th style="text-align: right; width: 120px;">Price</th>
                    <th style="text-align: right; width: 120px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${adminProductsTableRows}
                </tbody>
              </table>
            </div>

            <div class="total-box">
              Total Amount: ₹${Number(total).toLocaleString()}
            </div>

            <div class="alert">
              <strong>⚡ Action Required:</strong>
              <p style="margin: 10px 0 0 0;">
                • Review ${cartItems.length} product${cartItems.length > 1 ? 's' : ''} and attached image${Object.keys(images).length > 1 ? 's' : ''}<br/>
                • Create designs and send approval within 4 hours<br/>
                • Process payment if COD, verify if online payment
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #374151; font-weight: 600; margin: 0 0 15px 0;">Contact Customer</p>
              <a href="https://wa.me/${customerPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(customerName)}%2C%20Thank%20you%20for%20your%20order%20%23${orderNumber}.%20We%20are%20processing%20your%20${cartItems.length}%20item(s)." 
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
          .container { max-width: 700px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #374151; }
          .value { color: #1f2937; text-align: right; }
          .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .products-table th { background: #f3f4f6; padding: 12px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
          .products-table td { padding: 15px 10px; }
          .total-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 14px; }
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
            <p style="color: #6b7280;">Your order has been successfully placed with ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}. We're excited to create your personalized frames!</p>

            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Order Summary</h2>
              <div class="detail-row">
                <span class="label">Order Number:</span>
                <span class="value">${orderNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</span>
              </div>
            </div>

            <div class="section">
              <h2 style="color: #1f2937; margin-top: 0;">Your Items</h2>
              <table class="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center; width: 100px;">Quantity</th>
                    <th style="text-align: right; width: 120px;">Price</th>
                    <th style="text-align: right; width: 120px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${customerProductsTableRows}
                </tbody>
              </table>
            </div>

            <div class="total-box">
              Total Amount: ₹${Number(total).toLocaleString()}
            </div>

            <div class="info-box">
              <strong>📸 What's Next?</strong>
              <p style="margin: 10px 0 0 0;">
                • We'll review your uploaded photos and create the designs<br/>
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
              <a href="tel:9448075790" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">📞 Call Us</a>
              <a href="https://wa.me/9448075790" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">💬 WhatsApp</a>
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
      subject: `🛒 New Cart Order #${orderNumber} - ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
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
      message: 'Cart order emails sent successfully',
    });

  } catch (error: any) {
    console.error('Error sending cart emails:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send emails',
        details: error?.message 
      },
      { status: 500 }
    );
  }
}
