<template>
  <b-container>
    <b-row no-gutters>
      <b-col xs="12" sm="6" md="5">
        <task-list title="Today" listtype="today"></task-list> 
      </b-col>  
      <b-col xs="12" sm="6" md="2">
        <div class="trash m-2 py-2 px-3 border text-danger rounded"
                  @drop.prevent="drop"
                  @dragover.prevent

        >
          <font-awesome-icon icon="trash-alt" size="3x" />
        </div>
      </b-col>  
      <b-col xs="12" sm="6" md="5">
        <task-list title="Global" listtype="global" ></task-list>  
      </b-col>  
    </b-row>
  </b-container>
</template>


<script>
export default {
  components:{
    TaskList: () => import('@/components/TaskList'),

  },
  methods:{
    drop(ev, dropIndex){
       let dropData = JSON.parse(ev.dataTransfer.getData("text/plain"));
        this.$store.commit('DEL_TASK', { 
          listtype: dropData.listtype, 
          index: dropData.index,
        });

    },

  }

  
}
</script>


<style>
.about{
  display:flex;
}
.trash{
  align-self:flex-start;
  transition: all 1s;
}

.trash:hover{
  background-color: #faa;
  
  
}

</style>
