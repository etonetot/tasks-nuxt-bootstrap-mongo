const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const controller = require('./controller')


const router = express.Router();


const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())




mongoose.connect( "mongodb+srv://taskeditor:Ldw0OcOMfnhARdhh@cluster0-oe6vl.mongodb.net/test?retryWrites=true&w=majority" )
.then(()=>{
  console.log("MongoDB connected");
})
.catch( e => {
    console.log(e);
});


  

router.get('/create/today', controller.createToday)
router.get('/create/global', controller.createGlobal)
router.get('/get/today', controller.getToday)
router.get('/get/global', controller.getGlobal)


app.use('/api/', router)



module.exports = app;






