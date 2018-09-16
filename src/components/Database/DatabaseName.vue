<template>
  <div>
    <div class="collection-name-wrapper">
      <transition name="el-zoom-in-center"
        mode="out-in"
        duration="120">

        <span v-if="!editMode"
          style="display: flex; justify-content: center; align-items: center;width: 100%;">

          <el-select v-model="selectedDatabaseId"
            placeholder="Select a database"
            size="mini"
            style="width: 180px">

            <el-option v-for="db in $store.state.databases"
              style="width: 180px"
              :key="db.id"
              :label="db.name"
              :value="db.id">

            </el-option>

            <div style="margin:0px">
              <el-input v-model.trim="databaseName"
                clearable
                size="mini"
                :minlength="1"
                :maxlength="40"
                style="width: 60%;margin: 5px;"
                @keyup.enter.native="handleAdd"
                placeholder="New database" />
              <el-button size="mini"
                round
                @click="handleAdd"
                style="width: 60px">Save</el-button>
            </div>
          </el-select>

          <span v-if="selectedDatabaseId"
            :style="{fontSize:  '.8em'}">
            <i class="fa fa-pencil-alt edit-button"
              @click="editMode = !editMode" />
            <DeletePopover :refKey="database.id"
              @delete="$emit('delete');selectedDatabaseId = null;">
              <p>Are you sure you want to delete this database and all of it's collections?</p>
            </DeletePopover>
          </span>

        </span>

        <div v-if="editMode && selectedDatabaseId "
          style="display: flex; align-items: center">

          <el-input size="mini"
            v-model="databaseName"
            ref="databaseNameInput"
            style="width: 200px"
            @keyup.enter.native="handleEdit" />
          <el-button round
            style="margin: 5px"
            size="mini"
            @click="handleEdit">save</el-button>
          <i class="fa fa-times"
            style="cursor: pointer; color: var(--gray-5); margin-left: 5px;"
            @click="editMode=false" />

        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';
import DeletePopover from '@/components/UI/DeletePopover';

export default {
  props: {
    database: VueTypes.object.isRequired,
  },
  components: {
    DeletePopover,
  },
  data: () => ({
    editMode: false,
    databaseName: '',
    selectedDatabaseId: '',
  }),
  mounted() {
    this.selectedDatabaseId = this.$store.state.selectedDatabaseId;
  },

  watch: {
    editMode(value) {
      if (value) {
        this.databaseName = this.database.name;
        setTimeout(() => {
          this.$refs.databaseNameInput.$refs.input.select();
        }, 500);
      }
    },

    selectedDatabaseId(value) {
      this.$emit('selected', value);
    },
  },
  methods: {
    handleEdit() {
      this.$emit('edit', this.databaseName);
      this.editMode = false;
    },
    handleAdd() {
      this.$emit('add', this.databaseName);
      this.databaseName = '';
    },
  },
};
</script>

<style scoped>
.edit-button {
  margin-left: 15px;
  color: var(--warning);
  cursor: pointer;
}
.collection-name-wrapper {
  margin: 8px 0px;
  font-weight: bold;
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--gray-5);
  position: fixed;
  top: 10px;
  left: 50%;
  display: flex;
  align-items: center;
  transform: translateX(-40%);
}
</style>
