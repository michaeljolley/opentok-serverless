<template>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-4" v-for="session in sessions" :key="session.sessionId">
      <SessionCard :session="session" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import * as types from "../state/mutations";
import SessionCard from "../components/SessionCard";

export default {
  name: "Home",
  components: { SessionCard },
  computed: { ...mapState(["sessions"]) },
  created: function() {
    this.$store.dispatch(types.INITIALIZE);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
