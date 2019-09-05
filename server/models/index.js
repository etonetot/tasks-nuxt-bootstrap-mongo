const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    listtype: {
        type: String,
      },
    done: {
      type: Number,
    },
    index: {
      type: Number,
    },
  })

  
module.exports.TaskToday = mongoose.model('taskToday', taskSchema)
module.exports.TaskGlobal = mongoose.model('taskGlobal', taskSchema)
