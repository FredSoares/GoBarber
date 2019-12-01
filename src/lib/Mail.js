import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
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

    this.configureTemplates();
  }

  /* configuração do template de email */
  configureTemplates() {
    /* caminho para os templates */
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transport.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      }),
    );
  }

  sedMail(message) {
    return this.transport.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}
export default new Mail();
