const multer = require('multer');
const path = require('path');

// Define o diretório de upload para arquivos de imagem
const uploadDir = path.join(__dirname, '../uploads');

// Certifique-se de que o diretório de upload existe
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Define as opções de armazenamento do multer para arquivos de imagem
const storage = multer.memoryStorage();


// Configura o multer para lidar com o upload de arquivos de imagem
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Erro: Apenas imagens são permitidas!');
    }
});

module.exports = upload;
