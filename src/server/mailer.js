// Form taken from https://ciunkos.com/creating-contact-forms-with-nodemailer-and-react
import nodemailer from 'nodemailer';
import config from './../api/config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    ...config.creds
  }
});

const sendMail = message => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        reject(error)
        return
      }
      resolve(info)
    });
  })
}

export default sendMail