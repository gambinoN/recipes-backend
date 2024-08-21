import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'gabelanedim@gmail.com', 
      pass: process.env.GMAIL_PASS
    }
});

const sendVerificationEmail = (email: string, verificationLink: string) => {
    const mailOptions = {
      from: 'gabelanedim@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
};
  
export default sendVerificationEmail