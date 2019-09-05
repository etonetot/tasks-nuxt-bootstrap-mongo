const mongoose = require('mongoose')
const { TaskToday, TaskGlobal } = require('./models')


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


module.exports.deleteToday = async function(req, res) {
    try {
      const posts = await TaskToday.findByIdAndRemove(req.params.id, {useFindAndModify:false})
      res.json(posts)
    } catch (e) {
      res.status(500).json(e)
    }
}


module.exports.deleteGlobal = async function(req, res) {
    try {
      const posts = await TaskGlobal.findByIdAndRemove(req.params.id, {useFindAndModify:false})
      res.json(posts)
    } catch (e) {
      res.status(500).json(e)
    }
}


module.exports.setGlobal = async function(req, res) {
    try {
      let obj = {};
      if (req.body.done != undefined)
        obj.done = req.body.done;
      if (req.body.index != undefined)
        obj.index = req.body.index;
      const posts = await TaskGlobal.findByIdAndUpdate(req.body._id, obj, {new:true})
      res.json(posts)
    } catch (e) {
      res.status(500).json(e)
    }
}



module.exports.setToday = async function(req, res) {
    try {
      let obj = {};
      if (req.body.done != undefined)
        obj.done = req.body.done;
      if (req.body.index != undefined)
        obj.index = req.body.index;
      const posts = await TaskToday.findByIdAndUpdate(req.body._id, obj, {new:true})
      res.json(posts)
    } catch (e) {
      res.status(500).json(e)
    }
}


module.exports.createGlobal = async function (req, res) {
    const count = await TaskGlobal.find().countDocuments();
    const post = new TaskGlobal({
      name: req.body.name,
      listtype: req.body.listtype,
      done: req.body.done,
      index: count,
    })
     
    try {
      await post.save()
      res.status(201).json(post)
    } catch (e) {
      res.status(500).json(e)
    }
}
  
 


module.exports.createToday = async function (req, res) {
  const count = await TaskToday.find().countDocuments();
  const post = new TaskToday({
      name: req.body.name,
      listtype: req.body.listtype,
      done: req.body.done,
      index: count,
    })
  
    try {
      await post.save()
      res.status(201).json(post)
    } catch (e) {
      res.status(500).json(e)
    }
}


