import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    /* pegar as informaçõesdentro do mailConfig */
    const {
      host, port, secure, auth,
    } = mailConfig;

    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      /* só pega o auth caso existir caso contrario coloca null */
      auth: auth.user ? auth : null,
    });
  }

  sedMail(message) {
    return this.transport.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}
export default new Mail();
