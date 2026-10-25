// backend/test-mail-ethereal.js
import nodemailer from "nodemailer";
import { sendEmail } from "./utils/sendEmail.js";

await sendEmail("venusaini21@gmail.com", "Test", "Hello World");


async function run() {
  // create test account (Ethereal)
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail({
    from: '"BudgetBites Test" <no-reply@ethereal.test>',
    to: "any@example.com",
    subject: "Ethereal test",
    text: "Hello — Ethereal test mail"
  });

  console.log("Message sent: ", info.messageId);
  console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
}

run().catch(console.error);
