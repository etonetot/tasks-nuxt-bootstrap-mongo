const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const controller = require('./controller')


const router = express.Router();


const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())




mongoose.connect( "mongodb://localhost:27017/local" )
.then(()=>{
  console.log("MongoDB connected");
})
.catch( e => {
    console.log(e);
});


  

router.post('/today/create', controller.createToday)
router.post('/global/create', controller.createGlobal)

router.put('/today/', controller.setToday)
router.put('/global/', controller.setGlobal)

router.delete('/today/:id', controller.deleteToday)
router.delete('/global/:id', controller.deleteGlobal)

router.get('/today/get', controller.getToday)
router.get('/global/get', controller.getGlobal)


app.use('/api/', router)



module.exports = app;






