<template>
  <div>
    <b-card :title="session.sessionName" tag="article" style="max-width: 20rem;" class="mb-2">
      <b-card-text>Current members: {{ session.members }}</b-card-text>
      <router-link :to="{ name: 'Session', params: { sessionId: session.sessionId }}">
        <b-button href="#" variant="primary">Join Now</b-button>
      </router-link>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "SessionCard",
  props: {
    session: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
