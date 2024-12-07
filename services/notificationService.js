function sendSMSNotification(phoneNumber, message) {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  }
  
  function sendEmailNotification(email, subject, message) {
    console.log(`Sending email to ${email}: ${subject} - ${message}`);
  }
  
  module.exports = { sendSMSNotification, sendEmailNotification };
  