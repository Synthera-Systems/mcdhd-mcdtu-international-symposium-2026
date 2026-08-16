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

export const sendAbstractAcceptedEmail = async (toEmail: string, title: string, referenceId: string, presentationType: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const registerLink = `${baseUrl}/registration`;

  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Abstract Accepted! Action Required - MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #166534; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Abstract Accepted</h2>
        <p style="font-size: 16px;">Dear Researcher,</p>
        <p style="font-size: 16px; line-height: 1.5;">Congratulations! The scientific committee has completed its review and we are pleased to inform you that your abstract has been accepted for the upcoming symposium.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Title:</strong> ${title}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Format:</strong> <span style="font-weight: bold; color: #166534;">${presentationType}</span></p>
          <p style="margin: 0; font-size: 14px;"><strong>Abstract ID:</strong> <span style="font-family: monospace; font-weight: bold;">${referenceId}</span></p>
        </div>

        <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Important Next Step:</p>
        <p style="font-size: 16px; line-height: 1.5;">To confirm your spot on the program, you must now complete your delegate registration and payment. <strong>Please keep your Abstract ID handy, as you will need to enter it during registration.</strong></p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${registerLink}" style="background-color: #002147; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Proceed to Registration</a>
        </div>

        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Scientific Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { await transporter.sendMail(mailOptions); } 
  catch (error) { console.error("Error sending abstract accepted email:", error); }
};

export const sendAbstractRejectedEmail = async (toEmail: string, title: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const registerLink = `${baseUrl}/registration`;

  const mailOptions = {
    from: `"MitoCan-Symposium 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Update on your Abstract Submission - MitoCan-Symposium 2026",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #002147; border-bottom: 2px solid #eaeaec; padding-bottom: 10px;">Submission Update</h2>
        <p style="font-size: 16px;">Dear Researcher,</p>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for submitting your abstract titled <em>"${title}"</em>.</p>
        <p style="font-size: 16px; line-height: 1.5;">We received a record number of excellent submissions this year. Unfortunately, after careful consideration by our scientific committee, we are unable to accept your abstract for presentation at this time.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">We highly value your interest in mitochondria and cell death research. We warmly invite you to still join us at the symposium as a <strong>General Attendee</strong> to participate in the scientific dialogue, attend keynote sessions, and network with global experts.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${registerLink}" style="background-color: #002147; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Register as an Attendee</a>
        </div>

        <br/>
        <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Scientific Committee</strong><br/>MitoCan-Symposium 2026</p>
      </div>
    `,
  };

  try { await transporter.sendMail(mailOptions); } 
  catch (error) { console.error("Error sending abstract rejected email:", error); }
};

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