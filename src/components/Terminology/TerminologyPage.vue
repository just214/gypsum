<template>
  <div class="wrapper">
    <GoBackButton />
    <h1>Terminology</h1>
    <Term v-for="term in sortedTerms"
      :value="term"
      :key="term.term" />
    <h3>More to come...</h3>

  </div>
</template>

<script>
import GoBackButton from '@/components/UI/GoBackButton';
import Term from './Term';

const options = [
  'Root-Level Collection',
  'Subcollection',
  'Nested Array of Objects',
  'Nested Array of Values',
  'Nested Object',
  'Map',
];

export default {
  components: {
    GoBackButton,
    Term,
  },
  data: () => ({
    terms: [
      {
        term: 'Cloud Firestore',
        definition:
          'A flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform',
      },
      {
        term: 'Documents',
        definition:
          'In Cloud Firestore, the unit of storage is the document. A document is a lightweight record that contains fields, which map to values. Each document is identified by a name.',
      },
      {
        term: 'Collections',
        definition:
          'Documents live in collections, which are simply containers for documents. For example, you could have a users collection to contain your various users, each represented by a document.',
      },
      {
        term: 'Maps',
        definition: 'Complex, nested objects in a document.',
      },
      {
        term: 'Subcollections',
        definition: 'Collections associated with a specific document.',
      },
    ],
  }),
  computed: {
    sortedTerms() {
      return this.terms.sort((a, b) => {
        const aTerm = a.term.toLowerCase();
        const bTerm = b.term.toLowerCase();

        return aTerm < bTerm ? -1 : 1;
      });
    },
  },
};
</script>

<style scoped>
.caption {
  color: var(--warning);
}

.wrapper {
  padding: 10px;
  padding-top: 50px;
  padding-bottom: 450px;
  text-align: center;
  background: var(--gray-1);
  min-height: 100vh;
  height: 100%;
}
</style>
