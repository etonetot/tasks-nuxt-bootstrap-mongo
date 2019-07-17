//import Vue from 'vue'
//import Vuex from 'vuex'
import {defaultTasks, uuid} from './utils'


//Vue.use(Vuex)

//const savePlugin = store => {
//  store.subscribe(({ type, payload }, state) => {
//    localStorage.setItem( 'tasks', JSON.stringify(state.tasks) )    
//   });
// };

//  plugins: [savePlugin],


export const state = () => ({
    //tasks: JSON.parse(localStorage.getItem('tasks')) || { today:[], global: [] }
    tasks: { today:[], global: [] }
})


export const getters = {
    getTask: state => listtype => {
      return state.tasks[listtype];
    },
}

export const mutations = {
    ADD_TASK(state, { listtype, name} ){
      state.tasks[listtype].push({
        name,
        done: 0,
        id: uuid()
      });
    },

    DEL_TASK(state, { listtype, index} ){
      state.tasks[listtype].splice(index, 1);
    },

    DO_TASK(state, { listtype, index, progress} ){
      let curtask = state.tasks[listtype][index];
      if (!curtask.done)
        curtask.done = 0;
      
      curtask.done += progress*100;
      
      if (curtask.done>100)
        curtask.done = 0;
    },

    CLEAR_ALL(state, listtype){
      state.tasks[listtype].splice(0, state.tasks[listtype].length)
    },

    ADD_STD(state, listtype){
      state.tasks[listtype].push(...defaultTasks
          .filter(taskname=>{
             return !state.tasks[listtype].find(task=>task.name===taskname) 
          })
          .map(item => {
            return { name: item, id: uuid(), done: 0 } 
        }
      ));
    },

    MOVE_TASK(state, { listtypeFrom, indexFrom, listtypeTo, indexTo } ){
      let item = state.tasks[listtypeFrom].splice(indexFrom, 1);
      if (indexTo==-1)
        indexTo = state.tasks[listtypeTo].length;
      console.log(indexFrom, indexTo);
      state.tasks[listtypeTo].splice(indexTo, 0, ...item);
    },

    SORT(state, listtype){
      state.tasks[listtype].sort( (item1, item2)=>{
        return item2.name<item1.name;
      })
    },


}
