import invariant from 'tiny-invariant'
import { createTransport } from 'nodemailer'

invariant(process.env.SMTP_HOST, 'SMTP_HOST must be set')
invariant(process.env.SMTP_PORT, 'SMTP_PORT must be set')
invariant(process.env.SMTP_USER, 'SMTP_USER must be set')
invariant(process.env.SMTP_PASS, 'SMTP_PASS must be set')
invariant(process.env.SMTP_MAIL_FROM, 'SMTP_MAIL_FROM must be set')
invariant(process.env.SMTP_SECURE, 'SMTP_SECURE must be set')

const smtp_host = process.env.SMTP_HOST
const smtp_port = parseInt(process.env.SMTP_PORT)
const smtp_user = process.env.SMTP_USER
const smtp_pass = process.env.SMTP_PASS
const smtp_secure = Boolean(process.env.SMTP_SECURE === 'true')
export const MAIL_FROM = process.env.SMTP_MAIL_FROM

export const transport = createTransport({
  host: smtp_host,
  port: smtp_port,
  secure: smtp_secure,
  auth: {
    user: smtp_user,
    pass: smtp_pass,
  },
})
