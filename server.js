import express from 'express';
import multer from 'multer';
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para guardar las imágenes subidas

app.use(express.static('public')); 
app.use('/img', express.static('img'));
app.post('/quitar-fondo', upload.single('image'), async (req, res) => {
    const inputPath = req.file.path; // Ruta del archivo subido
    const outputPath = `uploads/output-${Date.now()}.png`; // Ruta para guardar la imagen procesada

    try {
        const absolutePath = path.resolve(inputPath);
        const imageUrl = `file://${absolutePath}`;

        // Procesa la imagen para quitar el fondo
        const blob = await removeBackground(imageUrl);
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Guarda la imagen procesada
        fs.writeFileSync(outputPath, buffer);

        // Envía la imagen procesada al cliente
        res.sendFile(path.resolve(outputPath));
    } catch (err) {
        console.error('Error al procesar la imagen:', err);
        res.status(500).send('Error al procesar la imagen');
    } finally {
      
        fs.unlinkSync(inputPath);
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});