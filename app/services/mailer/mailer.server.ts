import invariant from 'tiny-invariant'
import nodemailer from 'nodemailer'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

invariant(process.env.SMTP_HOST, 'SMTP_HOST must be set')
invariant(process.env.SMTP_PORT, 'SMTP_PORT must be set')
invariant(process.env.SMTP_USER, 'SMTP_USER must be set')
invariant(process.env.SMTP_PASS, 'SMTP_PASS must be set')
invariant(process.env.SMTP_MAIL_FROM, 'SMTP_MAIL_FROM must be set')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, body: string) {
  const mailOptions = { from: process.env.SMTP_MAIL_FROM, to, subject, text: body }
  return transporter.sendMail(mailOptions, (err: any, _res: any) => {
    if (err) {
      console.log(err)
    } else {
      console.log('The email was sent successfully')
    }
  })
}
