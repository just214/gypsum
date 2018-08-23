<template>
  <MainLayout :showSideNavAtStartup="!!allCollections.length">
    <template slot="nav-items">

      <zoom-center-transition>
        <div v-if="allCollections.length">
          <Link to="/rules"
            title="Rules"
            icon="fa-pencil-ruler" />
          <Link to="/cluster"
            title="Cluster"
            icon="fa-project-diagram" />
        </div>
      </zoom-center-transition>

      <Link to="/wizard"
        title="Wizard"
        icon="fa-magic" />

      <div style="text-align: center;margin-top: 5px;">
        <el-button round
          size="mini"
          style=" width: 100%"
          @click="$store.dispatch('auth/signOut')">
          <i class="fa fa-sign-out-alt" />&nbsp;Log Out</el-button>
      </div>
      <br />
      <el-tree accordion
        :props="{
          children: 'children',
          label: 'name'
        }"
        :indent="8"
        :data="treeData"
        @current-change="handleTreeChange"></el-tree>

    </template>

    <div class="schema-container"
      :style="{backgroundColor: bgColor}">

      <DatabaseName :database="databases.find(db => db.id === selectedDatabaseId)"
        @add="databaseName => $store.dispatch('addDatabase', databaseName)"
        v-if="databases.length"
        @delete="deleteDatabase"
        @edit="newName => editDatabaseName(newName)"
        @selected="handleSelectedDatabase" />

      <fade-transition mode="out-in">

        <div v-if="!databases.length && readyForTextAnimation"
          class="title-wrapper">
          <h1 style="padding: 0px; margin: 0px">
            <b>Welcome to</b>
          </h1>
          <h1 class="title-text">Gypsum</h1>
          <h3 style="color: var(--gray-5)">Let's start by adding your first database.</h3>
          <DatabaseForm @add="databaseName => $store.dispatch('addDatabase', databaseName)"
        
            @selected="handleSelectedDatabase"
            :databases="databases" />
        </div>

        <div v-if=" readyForTextAnimation && databases.length && !selectedDatabaseId"
          class="title-wrapper">

          <i class="fa fa-arrow-up fa-5x arrow" />

          <h1>Welcome back to
            <span style="font-family: 'Sigmar One', cursive;font-size: 2em;">Gypsum</span>
          </h1>

          <h3 style="color: var(--gray-5)">Select or create a database in the select box above to start modeling your
            next great project!</h3>
        </div>

        <div v-if="!allCollections.length 
          && readyForTextAnimation 
          && databases.length 
          && selectedDatabaseId"
          class="title-wrapper">
          <h3 style="color: var(--gray-5)">You are now in the
            <span style="color: var(--warning)">
              <b>{{$store.getters.selectedDatabaseName}}</b>
            </span> database.</h3>
          <h3 style="color: var(--gray-5)">Click the
            <i class="fa fa-plus"
              style="font-size: 25px;" /> icon to add your first collection!</h3>
        </div>
      </fade-transition>

      <transition name="slide"
        mode="out-in">
        <div v-if="showPotoo"
          key="potoo"
          style="position:absolute;bottom: 0px;left: 50%;
    transform: translate(-50%, 0);text-align: center;display: inline-block;">

          <img src="../assets/potoo.png" />
        </div>

      </transition>

      <div style="padding: 10px 0px 0px 0px">
        <el-color-picker v-model="bgColor"
          style="position: fixed; right: 10px; top: 20px;"
          size="mini"
          @change="handleBGColor"></el-color-picker>
        <CollectionForm :collections="collections"
          v-if="selectedDatabaseId"
          @submit="values => addCollection(values)" />

        <div v-loading.fullscreen.lock="pending">

          <div style="display: flex;margin-top: 20px;">
            <zoom-center-transition group
              mode="out-in"
              style="display: flex;padding: 10px;">
              <div style="padding: 10px;"
                v-for="collection in sortedCollectionsByTreeSelection"
                :key="collection.id">

                <CollectionName :collection="collection"
                  @delete="deleteCollection(collection)"
                  @edit="newName => editCollectionName({ collection, newName })" />

                <el-card class="collection-card">

                  <CollectionCard :collection="collection"
                    :collections="collections"
                    :allCollections="allCollections"
                    :allFieldValues="allFieldValues"
                    @editMode="value => {editMode = value}"
                    @addField="(field, callback) => addField({field, collection, callback})"
                
                    @editField="(field, callback) => editField({field, collection, callback})"
                
                    @moveFields="fields => handleMoveField({fields, collection})"
                    @addSubcollection="addSubcollection"
                    @deleteField="field => deleteField({field, collection })">
                    <template slot="rules">
                      <RulesForm />
                    </template>
                  </CollectionCard>

                  <zoom-center-transition group>
                    <div v-if="subcollections"
                      v-for="subcollection in subcollections.filter(subcol =>
                  subcol.parentId === collection.id)"
                      :key="subcollection.id">

                      <el-card shadow="hover"
                        class="subcollection-card">
                        <CollectionName :collection="subcollection"
                          type="subcollection"
                          @delete="deleteCollection(subcollection)"
                          @edit="newName => 
                            editCollectionName({
                              collection: subcollection, 
                              newName, 
                              type: 'subcollections'
                            })" />

                        <CollectionCard :collection="subcollection"
                          type="subcollection"
                          :collections="collections"
                          :allCollections="allCollections"
                          :allFieldValues="allFieldValues"
                          @delete="deleteCollection(subcollection)"
                          @editMode="value => {editMode = value}"
                          @addSubcollection="addSubcollection"
                          @deleteField="field => deleteField({field, collection: subcollection})"
                      
                          @addField="(field, callback) => 
                            addField({field, collection: subcollection, callback})"
                      
                          @editField="(field, callback) => 
                            editField({field, collection:subcollection, callback})"
                      
                          @moveFields="fields => handleMoveField({fields, collection: subcollection})"
                        />

                      </el-card>
                    </div>
                  </zoom-center-transition>

                </el-card>
              </div>
            </zoom-center-transition>
          </div>

        </div>

      </div>
    </div>
  </MainLayout>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import MainLayout from '@/components/MainLayout';
import CollectionForm from '@/components/Collection/CollectionForm';
import CollectionCard from '@/components/Collection/CollectionCard';
import RulesForm from '@/components/Rules/RulesForm';
import DeletePopover from '@/components/UI/DeletePopover';
import CollectionName from '@/components/Collection/CollectionName';
import DatabaseForm from '@/components/Database/DatabaseForm';
import DatabaseName from '@/components/Database/DatabaseName';
import Link from '@/components/UI/Link';

export default {
  components: {
    MainLayout,
    CollectionForm,
    CollectionCard,
    RulesForm,
    DeletePopover,
    CollectionName,
    DatabaseForm,
    DatabaseName,
    Link,
  },
  data: () => ({
    pending: false,
    treeSelection: '',
    bgColor: '',
    editMode: false,
    readyForAnimation: false,
    readyForTextAnimation: false,
    databaseName: '',
  }),
  computed: {
    ...mapState(['databases', 'selectedDatabaseId']),
    ...mapGetters([
      'collections',
      'subcollections',
      'allFieldValues',
      'treeData',
      'sortedCollectionsByTreeSelection',
      'allCollections',
      'selectedDatabaseName',
    ]),
    showPotoo() {
      if (
        this.readyForAnimation &&
        (!this.allCollections.length && this.selectedDatabaseId)
      ) {
        return true;
      }
      if (!this.databases.length && this.readyForAnimation) {
        return true;
      }
      if (
        this.databases.length &&
        !this.selectedDatabaseId &&
        this.readyForAnimation
      ) {
        return true;
      }
      return false;
    },
  },
  created() {
    this.bgColor = localStorage.getItem('schema-bgcolor') || '#409eff';
    this.pending = true;
    // * handle the spinner and animations after subscription data is received.
    this.$store.dispatch('subscribeToCollections').finally(() => {
      setTimeout(() => {
        this.readyForTextAnimation = true;
      }, 700);
      this.readyForAnimation = true;
      this.pending = false;
    });
  },
  methods: {
    ...mapActions([
      'addCollection',
      'addSubcollection',
      'handleMoveField',
      'editCollectionName',
      'deleteCollection',
      'addField',
      'editField',
      'deleteField',
      'handleTreeChange',
      'handleSelectedDatabase',
      'deleteDatabase',
      'editDatabaseName',
    ]),
    handleBGColor(e) {
      window.localStorage.setItem('schema-bgcolor', e);
    },
  },
};
</script>

<style scoped>
.schema-container {
  height: 100%;
  max-height: 100vh;
  min-height: 100vh;
  overflow-x: scroll;
}

.title-wrapper {
  text-align: center;
  margin-top: 75px;
  height: 100%;
  position: fixed;
  transform: translateX(-50%);
  left: 50%;
  flex-wrap: wrap;
  color: var(--gray-5);
  width: 350px;
}

.title-text {
  font-size: 4em;
  font-family: 'Sigmar One', cursive;
  margin: 0px;
  padding: 0px;
}

.add-collection-button {
  position: fixed;
  top: ;
  left: 50%;
  transform: translateX(-50%);
}

.tree {
  height: 100%;
  width: auto;
}
.tree-container {
  height: 500px;
}

.slide-enter-active,
.slide-leave-active {
  transition: margin-bottom 0.5s ease-out;
}

.slide-enter,
.slide-leave-to {
  margin-bottom: -50vh;
}

.slide-enter-to,
.slide-leave {
  margin-bottom: 0px;
}
.collection-card {
  border-radius: 20px;
  width: 350px;
  height: 80vh;
  max-height: 90vh;
  overflow: scroll;
  background-color: var(--gray-1);
}
.subcollection-card {
  background-color: var(--gray-2);
  margin: 10px 0px;
  border-radius: 20px;
}

.arrow {
  animation: MoveUpDown 1s linear infinite;
  position: relative;
  left: 0;
  bottom: 0;
  color: var(--warning);
}

@keyframes MoveUpDown {
  0%,
  100% {
    bottom: 0;
  }
  50% {
    bottom: 10px;
  }
}
</style>
