const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  // 发送邮箱配置
  let transporter = nodemailer.createTransport({
    service: "qq",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
  })

  //发送内容
  const message = {
    from: `${process.env.SMTP_FROMNAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  let info = await transporter.sendMail(message)
  console.log("邮箱发送成功: " + info.messageId);
}
module.exports = sendEmail