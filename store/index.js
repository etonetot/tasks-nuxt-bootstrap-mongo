import {defaultTasks} from './utils'


export const state = () => ({
    tasks: { today:[], global: [] },
    error: null
  })


export const getters = {
    getTask: state => listtype => {
      return state.tasks[listtype];
    },
}

export const mutations = {
    SET_ERROR(state, error) {
      console.log("SET_ERROR")
      state.error = error
      
    },

    CLEAR_ERROR(state) {
      state.error = null
    },

    ADD_TASK(state, task ){
      task.listtype = task.listtype=="global" ? task.listtype : "today";
      state.tasks[task.listtype].push(task);
    },

    DEL_TASK(state, { listtype, index} ){
      state.tasks[listtype].splice(index, 1);
    },

    DO_TASK(state, { listtype, index, done } ){
      state.tasks[listtype][index].done = done;
    },

    CLEAR_ALL(state, listtype){
      state.tasks[listtype].splice(0, state.tasks[listtype].length)
    },
    // MOVE_TASK(state, { listtypeFrom, indexFrom, listtypeTo, indexTo } ){
    //   let item = state.tasks[listtypeFrom].splice(indexFrom, 1);
    //   if (indexTo==-1)
    //     indexTo = state.tasks[listtypeTo].length;
    //   console.log(indexFrom, indexTo);
    //   state.tasks[listtypeTo].splice(indexTo, 0, ...item);
    // },

    SORT(state, listtype){
      state.tasks[listtype].sort( (item1, item2)=>{
        return item2.name<item1.name;
      })
    },


}



export const actions = {

  async LoadAll({commit}, listtype ){
    try {
      listtype = listtype=="global" ? listtype : "today";
      const tasks = await this.$axios.$get('/api/'+listtype+'/get')
      tasks.forEach( item => commit('ADD_TASK', item) )
    } 
    catch (e) {
      commit('SET_ERROR', e)
      throw e;
    }
  },

  async addTask({commit, state}, task ){
    task.listtype = task.listtype=="global" ? task.listtype : "today";
    try {
      task = await this.$axios.$post('/api/'+task.listtype+'/create', task)
      commit('ADD_TASK', task)
    } 
    catch (e) {
      commit('SET_ERROR', e)
    }
  },

  async doTask({commit, state}, { listtype, index, progress} ){
    let curtask = state.tasks[listtype][index];
    let done = curtask.done ? curtask.done : 0;
    done += progress*100;
    if (done>100)
      done = 0;
    try {
      const task = await this.$axios.$put('/api/'+listtype, { _id: curtask._id, done }  )
      commit('DO_TASK', {listtype, index, done: task.done});
    } 
    catch (e) {
      commit('SET_ERROR', e)
    }

  },

  async delTask({commit, state}, {listtype, index} ) {
    listtype = listtype=="global" ? listtype : "today";
    let task = state.tasks[listtype][index];
    console.log (task);
    try {
      task = await this.$axios.$delete('/api/'+task.listtype+'/'+task._id)
      commit('DEL_TASK', {listtype, index});
    } 
    catch (e) {
      commit('SET_ERROR', e)
    }
  },

  async moveTask({commit, dispatch, state}, { listtypeFrom, indexFrom, listtypeTo, indexTo } ){
    if (listtypeFrom!==listtypeTo)
    {
      //let item = state.tasks[listtypeFrom][indexFrom];
      const item = Object.assign({}, state.tasks[listtypeFrom][indexFrom]);
      item.listtype = listtypeTo;
      dispatch('delTask', { listtype: listtypeFrom, index: indexFrom } )
      dispatch('addTask', item)
    }
  },


  async clearAll({commit, state}, listtype ) {
    listtype = listtype=="global" ? listtype : "today";
    state.tasks[listtype].forEach( task=>{
      try {
        this.$axios.$delete('/api/'+task.listtype+'/'+task._id)
      } 
      catch (e) {
        commit('SET_ERROR', e)
      }
    });
    commit('CLEAR_ALL', listtype);
  },

  async addStdTask({commit, dispatch, state}, listtype){
    listtype = listtype=="global" ? listtype : "today";

    defaultTasks.filter(taskname=>{
           return !state.tasks[listtype].find(task => task.name===taskname) 
        })
    .forEach( item => dispatch('addTask', { name: item, done: 0, listtype }) );
  },



};


  
