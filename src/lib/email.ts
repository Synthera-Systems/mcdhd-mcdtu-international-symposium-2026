// src/lib/email.ts
import nodemailer from 'nodemailer';

// Initialize the Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to dynamically standardize salutations
const formatSalutation = (fullName: string): string => {
  if (!fullName) return "Dear Delegate";
  return `Dear ${fullName.trim()}`;
};

// ============================================================================
// REGISTRATION & PAYMENT EMAILS
// ============================================================================

/**
 * Sends the initial "Registration Received" email to the delegate.
 */
export const sendRegistrationReceivedEmail = async (toEmail: string, fullName: string, referenceId: string) => {
  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Application Received - MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Application Received</h2>
        <p style="font-size: 16px;">${formatSalutation(fullName)},</p>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for submitting your registration for the <strong>International Symposium on Mitochondria, Cell Death, and Human Disease</strong>.</p>
        <p style="font-size: 16px; line-height: 1.5;">Your application and payment details are currently under review by our organizing committee.</p>
        
        <div style="background-color: #f4f7f6; border-left: 4px solid #002147; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Your Tracking Reference ID</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #002147;">${referenceId}</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">You can use this Reference ID to track your application status on our portal at any time.</p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Success: Email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendRegistrationVerifiedEmail = async (toEmail: string, fullName: string, referenceId: string) => {
  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Payment Verified - Awaiting Final Approval",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Payment Verified</h2>
        <p style="font-size: 16px;">${formatSalutation(fullName)},</p>
        <p style="font-size: 16px; line-height: 1.5;">Great news! Our automated system has successfully verified your payment receipt for the MitoCan-Symposium 2026.</p>
        <p style="font-size: 16px; line-height: 1.5;">Your application is now marked as <strong>Pending Final Approval</strong>. The organizing committee will do a final review and issue your official delegate pass shortly.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px; color: #166534;"><strong>Tracking ID:</strong> ${referenceId}</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">You will receive one final email once your delegate pass is generated.</p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { await transporter.sendMail(mailOptions); } 
  catch (error) { console.error("Error sending verification email:", error); }
};
  
export const sendActionRequiredEmail = async (toEmail: string, fullName: string, actionToken: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const actionLink = `${baseUrl}/action/${actionToken}`;

  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Action Required: Payment Receipt Clarification - MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #93000a; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Payment Clarification Needed</h2>
        <p style="font-size: 16px;">${formatSalutation(fullName)},</p>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for registering for the <strong>International Symposium on Mitochondria, Cell Death, and Human Disease</strong>.</p>
        <p style="font-size: 16px; line-height: 1.5;">Our automated verification system was unable to validate your payment receipt automatically.</p>
        
        <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 15px; margin: 25px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #9f1239;">Common reasons for verification issues:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #9f1239; line-height: 1.6;">
            <li>The image was blurry, cropped, or partially unreadable.</li>
            <li>The 12-digit UTR / Bank Reference Number was cut off.</li>
            <li>The entered UTR number differed from the transaction receipt.</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.5;"><strong>What you need to do:</strong></p>
        <p style="font-size: 16px; line-height: 1.5;">Don't worry—your registration details remain safely stored! Please click the button below to upload a clear, full screenshot of your bank transfer or UPI receipt showing the complete UTR number.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionLink}" style="background-color: #002147; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Upload Corrected Receipt</a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
          If the button above does not work, copy and paste this link into your browser: <br/><br/>
          <span style="word-break: break-all; color: #0056b3;">${actionLink}</span>
        </p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { 
    await transporter.sendMail(mailOptions); 
    console.log(`[Email] Action required notice sent to ${toEmail}`);
  } catch (error) { 
    console.error("Error sending action required email:", error); 
  }
};

// ============================================================================
// ABSTRACT & SUBMISSION EMAILS
// ============================================================================

export const sendAbstractReceivedEmail = async (toEmail: string, title: string, referenceId: string) => {
  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Abstract Submission Received - MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Abstract Received</h2>
        <p style="font-size: 16px;">Dear Researcher,</p>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for submitting your abstract to the International Symposium on Mitochondria, Cell Death, and Human Disease.</p>
        
        <div style="background-color: #f4f7f6; border-left: 4px solid #002147; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Abstract Details</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Title:</strong> ${title}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Abstract ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #002147;">${referenceId}</span></p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">Your submission is currently queued for our triple-blind peer review process. We will notify you of the scientific committee's decision soon.</p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Scientific Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { await transporter.sendMail(mailOptions); } 
  catch (error) { console.error("Error sending abstract received email:", error); }
};

export async function sendAbstractAcceptedEmail(
  toEmail: string,
  abstractTitle: string,
  referenceId: string,
  presentationType: "Oral Presentation" | "Poster Presentation"
) {
  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Abstract Selected: ${presentationType} - MitoCan-Symp 2026`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 0; color: #1e293b; }
          .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { background: #002147; padding: 28px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
          .header p { margin: 4px 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
          .body { padding: 32px 28px; line-height: 1.6; }
          .pill { display: inline-block; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 13px; font-weight: 700; padding: 6px 14px; rounded-full; border-radius: 9999px; margin: 12px 0 20px 0; }
          .detail-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .item { margin-bottom: 12px; font-size: 13px; }
          .item:last-child { margin-bottom: 0; }
          .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.5px; }
          .val { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 2px; }
          .footer { border-top: 1px solid #f1f5f9; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748b; background: #fafafa; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>MitoCan-Symposium 2026</h1>
            <p>Department of MBBT, Tezpur University</p>
          </div>

          <div class="body">
            <p style="margin: 0 0 12px 0; font-size: 15px;">Dear Presenter,</p>
            <p style="margin: 0; font-size: 14px; color: #334155;">
              We are pleased to inform you that your abstract submission has been accepted for <strong>${presentationType}</strong> at MitoCan-Symp 2026.
            </p>

            <div>
              <span class="pill">Selected for ${presentationType}</span>
            </div>

            <div class="detail-box">
              <div class="item">
                <div class="label">Reference ID</div>
                <div class="val" style="font-family: monospace; color: #002147;">${referenceId}</div>
              </div>
              <div class="item">
                <div class="label">Abstract Title</div>
                <div class="val">${abstractTitle}</div>
              </div>
              <div class="item">
                <div class="label">Delegate Status</div>
                <div class="val" style="color: #059669;">Confirmed & Registered</div>
              </div>
            </div>

            <p style="font-size: 13px; color: #475569; margin: 20px 0 0 0;">
              The session schedule and presentation slots will be shared with you closer to the event dates. If you have any questions, you can reply directly to this email.
            </p>
          </div>

          <div class="footer">
            Organizing Committee | MitoCan-Symp 2026<br/>
            Tezpur University, Assam, India
          </div>
        </div>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendAbstractRejectedEmail(
  toEmail: string,
  abstractTitle: string
) {
  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Abstract Review Outcome - MitoCan-Symp 2026`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
          .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: #002147; padding: 28px 24px; text-align: center; color: #ffffff; }
          .body { padding: 32px 28px; line-height: 1.6; font-size: 14px; color: #334155; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin:0; font-size: 20px;">MitoCan-Symposium 2026</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Abstract Review Decision</p>
          </div>
          <div class="body">
            <p>Dear Author,</p>
            <p>Thank you for submitting your abstract titled <strong>"${abstractTitle}"</strong> for consideration at MitoCan-Symp 2026.</p>
            <p>Due to the high volume of submissions and schedule limitations within each session track, we regret to inform you that your abstract could not be accommodated for presentation at this edition of the symposium.</p>
            <p>Please note that your delegate registration remains valid and confirmed. We warmly welcome your participation in all keynote sessions, panel discussions, and scientific workshops during the event.</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">Organizing Committee | MitoCan-Symp 2026</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">Tezpur University, Assam, India</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
/**
 * Sends the final "Registration Approved & Confirmed" pass email to the delegate.
 */
export const sendRegistrationApprovedEmail = async (toEmail: string, fullName: string, referenceId: string, category: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const submissionsLink = `${baseUrl}/submissions`;

  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Registration Confirmed - Delegate Pass Issued | MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Registration Confirmed! 🎉</h2>
        <p style="font-size: 16px;">${formatSalutation(fullName)},</p>
        <p style="font-size: 16px; line-height: 1.5;">We are delighted to confirm that your registration for the <strong>International Symposium on Mitochondria, Cell Death, and Human Disease</strong> is approved!</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #166534; font-weight: bold;">Official Delegate Pass</p>
          <p style="margin: 8px 0 4px 0; font-size: 22px; font-family: monospace; font-weight: bold; color: #002147;">${referenceId}</p>
          <p style="margin: 0; font-size: 14px; color: #166534;"><strong>Category:</strong> ${category}</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Presenting a Poster or Oral Talk?</p>
        <p style="font-size: 16px; line-height: 1.5;">If you haven't submitted your scientific abstract yet, you can now link your abstract directly to this Reference ID on our submissions portal.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${submissionsLink}" style="background-color: #002147; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Submissions Portal</a>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">We look forward to welcoming you to Tezpur University!</p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { 
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Approval pass sent to ${toEmail}`);
  } catch (error) { 
    console.error("Error sending approval email:", error); 
  }
};

/**
 * Sends a "Registration Rejected" email if payment verification fails manually.
 */
export const sendRegistrationRejectedEmail = async (toEmail: string, fullName: string) => {
  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Registration Payment Update - MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #93000a; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Payment Verification Update</h2>
        <p style="font-size: 16px;">${formatSalutation(fullName)},</p>
        <p style="font-size: 16px; line-height: 1.5;">Regrettably, our organizing committee was unable to verify your payment transaction for the MitoCan-Symposium 2026.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">This can happen if the UTR/Transaction ID did not match our bank statement, or if the receipt image uploaded was unreadable.</p>

        <p style="font-size: 16px; line-height: 1.5;">If you believe this is an error or if you have made the payment, please reply directly to this email with your valid transaction receipt attached so our team can assist you immediately.</p>
        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Organizing Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { 
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Rejection notice sent to ${toEmail}`);
  } catch (error) { 
    console.error("Error sending rejection email:", error); 
  }
};