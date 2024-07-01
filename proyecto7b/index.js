import express from 'express';
const app = express();
import cors from 'cors'



import get from './src/routes/get.js'


const port = 3000;

app.use(cors())
app.use(express.json());



app.use(('/api/get'), get);



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

