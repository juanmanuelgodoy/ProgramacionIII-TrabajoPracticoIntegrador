import express from 'express';


const app = express (); 
app.use(express.json());

app.get('estado', (req, res) => {
    res.json({'ok':true});
    //res.status(201).send({'estado':true, 'mensaje':'reserva creada'});
})

app.post('/notificacion', (req, res) => {
    console.log(req.body);
    if(!req.body.fecha || !req.body.salon || !req.body.turno || !req.body.correoDestino){
        res.status(400).send({'estado':false, 'mensaje':'Faltan datos requeridos'});
    }
    res.json({'ok':true});
}


process.loadEnvFile();
//console.log('algo');
app.listen(process.env.PUERTO, () => {
    console.log(`Servidor arriba en ${process.env.PUERTO}`);
})

