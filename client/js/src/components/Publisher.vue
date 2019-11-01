<template>
  <div></div>
</template>

<script>
import OT from "@opentok/client";
import { mapState } from "vuex";

export default {
  name: "Publisher",
  computed: { ...mapState(["session"]) },
  mounted: function() {
    const publisher = OT.initPublisher(this.$el, this.opts, err => {
      if (err) {
        this.$emit("error", err);
      } else {
        this.$emit("publisherCompleted");
      }
    });
    this.$emit("publisherCreated", publisher);
    const publish = () => {
      this.session.publish(publisher, err => {
        if (err) {
          this.$emit("error", err);
        } else {
          this.$emit("publisherConnected", publisher);
        }
      });
    };
    if (this.session && this.session.isConnected()) {
      publish();
    }
    if (this.session) {
      this.session.on("sessionConnected", publish);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
