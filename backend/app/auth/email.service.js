const { leaveStatus } = require('../../config/enums');
const sgMail = require('@sendgrid/mail');
const { sendgrid } = require('../../config/config');
const juice = require('juice');

sgMail.setApiKey(sendgrid.sendgridApiKey);

const sendEmail = async (options) => {
  try {
    await sgMail.send(options);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

/**
 * Parses data to provide dynamic content for the email template.
 */
const emailDataParsing = (data) => {
  const common = {
    subject: `Update on Leave Request #${data.id}`,
    actionButtonText: 'View Request in Dashboard',
  };

  if (data.status === leaveStatus.APPROVED) {
    return {
      ...common,
      statusText: 'Approved',
      introText: `This is a notification that your leave request has been approved. Please review the details below.`,
      statusColor: '#10b981', // Emerald Green
      notesTitle: "Manager's Notes",
    };
  }

  if (data.status === leaveStatus.REJECTED) {
    return {
      ...common,
      statusText: 'Rejected',
      introText: `This is a notification regarding your leave request. Unfortunately, it could not be approved at this time.`,
      statusColor: '#ef4444', // Red
      notesTitle: 'Reason for Rejection',
    };
  }

  if (data.status === leaveStatus.PENDING) {
    return {
      ...common,
      subject: `Leave Request #${data.id} Received`,
      statusText: 'Pending Review',
      introText: `Your leave request has been successfully submitted and is awaiting review. You will receive a final notification once a decision is made.`,
      statusColor: '#f59e0b', // Amber/Yellow
      notesTitle: 'Reason Submitted',
    };
  }
};

/**
 * Generates the final, highly professional and robust HTML email template.
 */
const generateProfessionalEmailHtml = (data, emailData) => {
  const notes = data.status === leaveStatus.PENDING ? data.reason : data.reply;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailData.subject}</title>
    <style>
      body { margin: 0; padding: 0; width: 100% !important; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
      .email-wrapper { padding: 30px 10px; background-color: #f9fafb; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; }
      
      .header { padding: 20px; border-bottom: 1px solid #e5e7eb; }
      .header img { max-width: 150px; }

      .content { padding: 30px; }
      
      .status-header { margin-bottom: 20px; }
      .status-dot { display: inline-block; width: 10px; height: 10px; background-color: ${emailData.statusColor}; border-radius: 50%; margin-right: 10px; }
      .status-text { display: inline-block; font-size: 22px; font-weight: 600; color: #111827; vertical-align: middle; }
      
      .intro-p { font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 30px; }
      
      .card { border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 25px; }
      .card-header { padding: 15px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; }
      .card-header h3 { font-size: 16px; font-weight: 600; color: #111827; margin: 0; }
      .card-body { padding: 20px; }
      
      .details-table { width: 100%; border-collapse: collapse; }
      .details-table td { padding: 8px 0; font-size: 15px; vertical-align: top; }
      .details-label { color: #6b7280; width: 120px; }
      .details-value { color: #111827; font-weight: 500; }
      
      .notes-card { border-left: 4px solid #d1d5db; padding: 16px; background-color: #f9fafb; }
      .notes-card p { margin: 0; font-size: 15px; line-height: 1.6; color: #374151; font-style: italic; }
      
      .action-wrapper { text-align: center; padding: 10px 30px 30px; }
      .action-button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 12px 24px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 6px; }

      .footer { text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
            <tr><td class="header"><img src="${data.logoUrl}" alt="${data.organization} Logo"></td></tr>
            <tr>
              <td class="content">
                <div class="status-header"><span class="status-dot"></span><span class="status-text">${emailData.statusText}</span></div>
                <p class="intro-p">${emailData.introText}</p>
                
                <div class="card">
                  <div class="card-header"><h3>Request Summary</h3></div>
                  <div class="card-body">
                    <table class="details-table">
                      <tr><td class="details-label">Request ID</td><td class="details-value">#${data.id}</td></tr>
                      <tr><td class="details-label">Leave Type</td><td class="details-value">${data.leaveType}</td></tr>
                      <tr><td class="details-label">Start Date</td><td class="details-value">${data.formattedStartDate}</td></tr>
                      <tr><td class="details-label">End Date</td><td class="details-value">${data.formattedEndDate}</td></tr>
                      <tr><td class="details-label">Total Days</td><td class="details-value">${data.totalDays}</td></tr>
                    </table>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header"><h3>Employee Details</h3></div>
                  <div class="card-body">
                    <table class="details-table">
                      <tr><td class="details-label">Name</td><td class="details-value">${data.name}</td></tr>
                      <tr><td class="details-label">Department</td><td class="details-value">${data.department}</td></tr>
                      <tr><td class="details-label">Role</td><td class="details-value">${data.role}</td></tr>
                    </table>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header"><h3>${emailData.notesTitle}</h3></div>
                  <div class="card-body">
                    <div class="notes-card"><p>"${notes || 'No notes provided.'}"</p></div>
                  </div>
                </div>

              </td>
            </tr>
            <tr>
              <td class="action-wrapper">
                <a href="${data.dashboardUrl}" class="action-button">${emailData.actionButtonText}</a>
              </td>
            </tr>
            <tr><td class="footer">© ${new Date().getFullYear()} ${data.organization}. This is an automated notification.</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

/**
 * Main function to orchestrate email creation and sending.
 * This is the complete and corrected version.
 */
const leaveActionEmail = async (data) => {
  // --- NEW & CRITICAL: Date Formatting Logic ---
  // This step ensures the dates are correctly formatted before being passed to the template.
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  const formattedData = {
    ...data,
    formattedStartDate: new Date(data.startDate).toLocaleDateString('en-US', dateOptions),
    formattedEndDate: new Date(data.endDate).toLocaleDateString('en-US', dateOptions),
  };

  // 1. Get dynamic text and state based on leave status
  const emailData = emailDataParsing(formattedData);

  // 2. Generate the full, professional HTML email
  const rawHtml = generateProfessionalEmailHtml(formattedData, emailData);

  // 3. Use juice to inline the CSS for maximum email client compatibility
  const inlinedHtml = juice(rawHtml);

  // 4. Configure SendGrid options
  const options = {
    // to: data.email,
    to: "asadahmed6345@gmail.com",
    from: {
      email: sendgrid.mailFrom,
      name: `${data.organization} Notifications`
    },
    subject: emailData.subject,
    html: inlinedHtml,
  };

  // 5. Send the email
  await sendEmail(options);
};
const emailDataForApproverParsing = (data) => {
  return {
    subject: `Leave Request from ${data.name} (#${data.id}) - Action Required`,
    title: 'Leave Request Awaiting Approval',
    introText: `A new leave request has been submitted by ${data.name} and requires your action. Please review the details and approve or reject the request.`,
  };
};

/**
 * Generates the professional HTML email for all approvers.
 * The template is now static since it always contains action buttons.
 */
const generateApproverEmailHtml = (data, emailData) => {
  // Construct the unique action URLs
  const approveUrl = `${data.actionBaseUrl}?id=${data.id}&action=approve`;
  const rejectUrl = `${data.actionBaseUrl}?id=${data.id}&action=reject`;
  
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>${emailData.subject}</title>
      <style>
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .email-wrapper { padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; }
        .header { padding: 20px; border-bottom: 1px solid #dee2e6; }
        .header img { max-width: 150px; }
        .content { padding: 30px; }
        .title { font-size: 24px; font-weight: 600; color: #212529; margin: 0 0 15px; }
        .intro-p { font-size: 16px; line-height: 1.6; color: #495057; margin: 0 0 30px; }
        .card { border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 20px; }
        .card-header { padding: 12px 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; }
        .card-header h3 { font-size: 16px; font-weight: 600; color: #343a40; margin: 0; }
        .card-body { padding: 20px; }
        .details-table td { padding: 8px 0; font-size: 15px; }
        .details-label { color: #6c757d; width: 120px; }
        .details-value { color: #212529; font-weight: 500; }
        .reason-box p { margin: 0; font-style: italic; color: #495057; }
        .action-table { margin-top: 30px; }
        .action-button-primary { background-color: #28a745; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block; }
        .action-button-secondary { background-color: #dc3545; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #6c757d; }
      </style>
    </head>
    <body>
      <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
              <tr><td class="header"><img src="${data.logoUrl}" alt="${data.organization} Logo"></td></tr>
              <tr>
                <td class="content">
                  <h1 class="title">${emailData.title}</h1>
                  <p class="intro-p">${emailData.introText}</p>

                  <div class="card">
                    <div class="card-header"><h3>Employee & Request Details</h3></div>
                    <div class="card-body">
                      <table class="details-table" width="100%">
                        <tr><td class="details-label">Employee</td><td class="details-value">${data.name}</td></tr>
                        <tr><td class="details-label">Department</td><td class="details-value">${data.department}</td></tr>
                        <tr><td class="details-label">Dates</td><td class="details-value">${data.formattedStartDate} - ${data.formattedEndDate} (${data.totalDays} days)</td></tr>
                        <tr><td class="details-label">Leave Type</td><td class="details-value">${data.leaveType}</td></tr>
                      </table>
                    </div>
                  </div>

                  <div class="card">
                    <div class="card-header"><h3>Reason for Request</h3></div>
                    <div class="card-body reason-box"><p>"${data.reason}"</p></div>
                  </div>

                 
                </td>
              </tr>
              <tr><td class="footer">© ${new Date().getFullYear()} ${data.organization}</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

/**
 * Main public function to call when a new leave is submitted.
 * It orchestrates sending the approval email to a dynamic list of approvers.
 */
const sendLeaveRequestToApprovers = async (data) => {
  // Format dates once to be used in all emails
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  const formattedData = {
    ...data,
    formattedStartDate: new Date(data.startDate).toLocaleDateString('en-US', dateOptions),
    formattedEndDate: new Date(data.endDate).toLocaleDateString('en-US', dateOptions),
  };

  const emailData = emailDataForApproverParsing(formattedData);
  const rawHtml = generateApproverEmailHtml(formattedData, emailData);
  const inlinedHtml = juice(rawHtml);

  // Create an array of email sending promises
  const emailPromises = data?.approverEmails?.map(approverEmail => {
    const options = {
      to: approverEmail,
      from: {
        email: sendgrid.mailFrom,
        name: `${data.organization} System`
      },
      subject: emailData.subject,
      html: inlinedHtml,
    };
    return sendEmail(options);
  });
  
  // Send all emails in parallel and wait for them to complete
  await Promise.all(emailPromises);
};
module.exports = {
  leaveActionEmail,
  sendLeaveRequestToApprovers
};