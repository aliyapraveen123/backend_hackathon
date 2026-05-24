
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Transporter banayein (Yeh batata hai ki email kaun bhejega)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USEREMAIL,
            pass: process.env.PASS
        }
    });

    //email content
    const mailOptions = {
        from: '"Hackathon Team" aliyaprveen24@navgurukul.org', // Sender ka naam aur email
        to: options.email,                             // Jise bhejni hai (User ki email)
        subject: options.subject,                        // Email ka subject
        text: options.message,                           // Email ki main body (text)
    };

    // send karna kya
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

