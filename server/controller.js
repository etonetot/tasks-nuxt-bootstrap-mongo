const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    done: {
      type: Number,
    },
  })

  
TaskToday = mongoose.model('taskToday', taskSchema)
TaskGlobal = mongoose.model('taskGlobal', taskSchema)


module.exports.getToday = async function(req, res) {
    try {
      const posts = await TaskToday.find()
      res.json(posts)
    } catch (e) {
      res.status(500).json(e)
    }
}
 


module.exports.getGlobal = async function(req, res) {
    try {
      const posts = await TaskGlobal.find()
      res.json(posts)
    } catch (e) {
      res.status(500).json(e)
    }
}



module.exports.createGlobal = async function (req, res) {
    const post = new TaskGlobal({
      name: req.body.name,
      done: req.body.done,
    })
  
    try {
      await post.save()
      res.status(201).json(post)
    } catch (e) {
      res.status(500).json(e)
    }
}
  



module.exports.createToday = async function (req, res) {
    const post = new TaskToday({
      name: "11111", //req.body.name,
      done: 34 //req.body.done,
    })
  
    try {
      await post.save()
      res.status(201).json(post)
    } catch (e) {
      res.status(500).json(e)
    }
}