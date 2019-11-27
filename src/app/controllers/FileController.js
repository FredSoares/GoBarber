import File from '../models/File';

class FileController {
  async store(req, res) {
    /* pegar os campos originalname e filename e colocalo-los nos
     * campos name e path */
    const { originalname: name, filename: path } = req.file;
    /* armazenar o nome e o caminho da imagem na bd */
    const file = await File.create({ name, path });

    return res.json(file);
  }
}

export default new FileController();
