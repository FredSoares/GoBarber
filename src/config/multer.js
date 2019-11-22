import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    /* destino do nosso ficheiro __dirname (directorio atual), '..' (volta um directorio)
    'tmp'(directorio tmp) 'uploads'(direstorio uploads) */
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /* controlar nome da iagem */
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
