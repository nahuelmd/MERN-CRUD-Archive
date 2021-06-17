const express = require('express');
const router = express.Router();
const News = require('../models/news')


//Con esto defino las rutas del servidor
//cuando pidan la ruta inicial / voy a devolver con el handeler de eventos de node (req,res)
//con res.send defino la respuesta que va a tener la peticion GET a la ruta inicial /

router.get('/', async (req, res) => {
    const news = await News.find();
    console.log(news);
    res.json(news);
    
});

//Obtener una unica NEWS por ID
router.get('/:id', async (req, res) => {
    const news = await News.findById(req.params.id);
    res.json(news);

});


//POST
router.post('/', async (req, res) => {
    const { title, description, date, author, archiveDate, status } = req.body
    const news = new News({title, description, date, author, archiveDate, status})
    // console.log(news);
    await news.save();
    res.json({status: 'News saved'});
});


//PUT
router.put('/:id', async (req, res) => {
    const { title, description, date, author, archiveDate, status } = req.body
    const newNews = { title, description, date, author, archiveDate, status };
    await News.findByIdAndUpdate(req.params.id, newNews);
    console.log(req.params.id);
    res.json({
        status: "News Updated"
    });
});

//DELETE
router.delete('/:id', async (req, res) => {
    await News.findByIdAndRemove(req.params.id);
    res.json({status: "News Deleted"})
});
 
module.exports = router;