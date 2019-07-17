<template>
  <div w-100>
    <h3>{{title}}</h3>

    <div class="tasklist bg-light rounded p-2 m-2 border"
              @drop.prevent="dropOnList"
              @dragover.prevent
    >
      <b-progress :max="100" class="rounded text-white p-0 m-1 bg-secondary totalProgress">
        <div class="task-text totalProgressText">Total progress {{totalDone() | progress }}%</div>
        <b-progress-bar :value="totalDone()" class="bg-success" />
      </b-progress>  

      <transition-group  name="list">
        <template v-for="(task, taskIndex) in tasks">
          <div  :key="task.id" 
              class="m-1 taskWrapper" 
              draggable 
              @dragstart="drag($event, taskIndex)"
              @drop.stop.prevent="drop($event, taskIndex)"
              @dragover.prevent
          >
            <span :style="'align-self:center'">{{taskIndex+1}}.</span>
            <b-progress :max="100" height="2rem" class="task-progress rounded text-white p-0 m-1 bg-secondary">
              <b-progress-bar :value="task.done" class="text-white text-left task-text pl-2" :class="taskClass(task.done)">
                {{task.name}} 
              </b-progress-bar>
            </b-progress>

            <b-button variant="outline-success" class="m-1" @click="dotask(taskIndex)">Do</b-button>
            <!-- <b-button variant="outline-danger" class="m-1" @click="deltask(taskIndex)">Delete</b-button> -->
          </div>
        </template>
        <div class="w-100 border taskWrapper" :key="-30" v-if="tasks.length"></div>
        <div class="m-2 taskWrapper"  :key="-10">
          <input class="rounded p-1 m-1" 
              placeholder="new task" 
              @keyup.enter="addtask" 
              v-model="newTaskName"
              @drop.prevent="dropEditor"              
          >
          <b-button variant="outline-info" :disabled="newTaskName==''" class="m-1" @click="addtask">Add</b-button>
        </div>
        
        <div class="m-2 taskWrapper" :key="-20">
          <!-- <b-button variant="outline-danger" class="m-1" @click="clearall">Clear All</b-button> -->
          <!-- <b-button variant="outline-danger" class="m-1" v-b-modal="'clear-modal'+listtype" > -->
          <b-button variant="outline-danger" class="m-1" @click="clearAllConfifm">
              <font-awesome-icon icon="trash"/>
              <font-awesome-icon icon="trash" size="sm" />
              <font-awesome-icon icon="trash" size="xs" />
          </b-button>
           <!-- <b-modal :id="'clear-modal'+listtype" hide-footer>
             <div>Удалить список?</div>
             <div class="modalbuttons">
              <b-button variant="outline-info" class="m-3" @click="$bvModal.hide('clear-modal'+listtype)">Нет</b-button>
              <b-button variant="outline-danger" class="m-3" @click="clearall">Да</b-button>
             </div>
           </b-modal> -->

          <b-button v-if="listtype=='today'" variant="outline-info" class="m-1" @click="addstd">Add Std Tasks</b-button>
          <b-button variant="outline-info" class="m-1" @click="sort">
              <font-awesome-icon icon="sort"/>
          </b-button>

        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props:{
    title: String,
    listtype: String,
  },
  data() {
    return {
      newTaskName: "",
    }
  }, 

  computed:
  {
    tasks(){
      return this.$store.getters['getTask'](this.listtype);
    },
  },
  methods:{
    totalDone() {
      let total = this.tasks.reduce((total, item)=>total+item.done, 0);
      if (this.tasks.length)
        total /= this.tasks.length; 
      return total;  
    },
    drag(ev, taskIndex){
       //ev.dataTransfer.effectAllowed = 'move'
       //ev.dataTransfer.dropEffect = 'move'      
       ev.dataTransfer.setData("text/plain", JSON.stringify({
         listtype: this.listtype,
         index: taskIndex
       }));

    },

    drop(ev, dropIndex){
       let dropData = JSON.parse(ev.dataTransfer.getData("text/plain"));
       this.$store.commit('MOVE_TASK', { 
         listtypeFrom: dropData.listtype, 
         indexFrom: dropData.index,
         listtypeTo: this.listtype, 
         indexTo: dropIndex,
       });
    },

    dropOnList(ev){
       let dropData = JSON.parse(ev.dataTransfer.getData("text/plain"));
       this.$store.commit('MOVE_TASK', { 
         listtypeFrom: dropData.listtype, 
         indexFrom: dropData.index,
         listtypeTo: this.listtype, 
         indexTo: -1,
       });
    },

    dropEditor()  {
      return false;
    },

    addtask() {
      this.$store.commit('ADD_TASK', { listtype: this.listtype, name: this.newTaskName} );
      this.newTaskName = '';
    },
    deltask(index) {
      this.$store.commit('DEL_TASK', { listtype: this.listtype, index} );
    },

    async clearAllConfifm(){ 
        let confirm = await this.$bvModal.msgBoxConfirm('Please confirm that you want to delete everything.', {
          title: 'Очистить список?',
          okVariant: 'danger',
          okTitle: 'Да',
          cancelTitle: 'Нет',
          hideHeaderClose: false,
        })          
        if (confirm)
              this.$store.commit('CLEAR_ALL', this.listtype);
    },

    // clearall()  {
    //   this.$bvModal.hide('clear-modal'+this.listtype)
    //   this.$store.commit('CLEAR_ALL', this.listtype);
    // },
    addstd() {
      this.$store.commit('ADD_STD', this.listtype);
    },
    dotask(index)   {
      this.$store.commit('DO_TASK', { listtype: this.listtype, index, progress: 0.5} );
    },
    sort()   {
      this.$store.commit('SORT', this.listtype);
    },
    taskClass(done){
      return {
        'bg-success': done>0,
        'bg-secondary': done==0,
      }
    }
  },
  filters:{
    progress(value){
        return value ? Math.round(value) : '0';
    }
  }

}
</script>


<style scoped>

.tasklist{
  display: flex;
  flex-flow: column;
  justify-content:flex-start;
}

.totalProgress{
  position:relative;
  height: 2rem;
}
.totalProgressText{
  position:absolute; 
  text-align:center; 
  width:100%; 
  margin-top:3px;
}  

.taskWrapper{
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;

  transition: all 0.5s;
}

.task-text{
  font-size:1.3em;
}

.task-progress{
  height: auto !important;
  align-self: stretch;
  flex-grow: 1;
  min-width: 15em;
}

.modalbuttons{
  display: flex;
  justify-content: center;
}

.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}

</style>
