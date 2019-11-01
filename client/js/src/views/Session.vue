<template>
  <div class="row">
    <Publisher v-if="isConnecting" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as types from "../state/mutations";

import Publisher from "../components/Publisher";
//import Subscriber from "../components/Subscriber";

export default {
  name: "Session",
  components: {
    Publisher
    // Subscriber
  },
  computed: {
    ...mapState(["isConnecting", "currentSession"])
  },
  created: function() {
    this.$store.dispatch(types.JOINSESSION, this.$route.params.sessionId);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
