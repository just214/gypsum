<template>
  <div>
    <div ref="sidenav"
      class="sidenav"
      :class="{small: ['xs'].includes($mq)}">

      <div style="padding: 10px;">
        <slot name="nav-items" />
      </div>

    </div>

    <el-button @click="toggle=!toggle"
      circle
      ref="navButton"
      class="nav-button"
      icon="el-icon-more"></el-button>

    <div id="main"
      ref="main">
      <slot />
    </div>

  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    showSideNavAtStartup: VueTypes.bool.isRequired,
  },
  data: () => ({
    // * Controls the toggle of the sidenav
    toggle: true,
  }),
  mounted() {
    if (!this.showSideNavAtStartup) {
      this.toggle = false;
    }
  },
  watch: {
    $mq(value) {
      // * Dynamically show or hide the sidenav as the window size changes.

      if (['md', 'lg', 'xl'].includes(value)) {
        this.toggle = true;
      } else if (['xs', 'sm'].includes(value)) {
        this.toggle = false;
      }
    },
    toggle(value) {
      if (value) {
        this.$refs.sidenav.style.width = '250px';
        // * Do not push the main content area if the window size is xs or sm.
        // * Instead, the sidenav will slide over the content.
        this.$refs.main.style.marginLeft = ['xs'].includes(this.$mq)
          ? '0px'
          : '250px';
      } else {
        this.$refs.sidenav.style.width = '0';
        this.$refs.main.style.marginLeft = '0';
      }
    },
  },
  created() {
    // * On creation, display (default) or hide the sidenav based on window size.
    // * This is required because the watcher is not triggered until the window
    // * size actually changes after the page is rendered.
    if (['md', 'lg', 'xl', 'sm'].includes(this.$mq)) {
      this.toggle = true;
    } else if (['xs'].includes(this.$mq)) {
      this.toggle = false;
    }

    // * On xs (mobile) screens, automatically toggle the sidenav off if the user
    // * scrolls the content page.
    window.addEventListener('scroll', () => {
      if (['xs'].includes(this.$mq)) {
        this.toggle = false;
      }
    });
  },
  destroyed() {
    window.removeEventListener('scroll', () => {});
  },
};
</script>


<style scoped>
#main {
  transition: margin-left 0.2s;
  margin-left: 0px;
  min-height: 100%;
}

.nav-button {
  transition: margin-left 0.3s;
  opacity: 0.9;
  z-index: 100;
  background-color: var(--gray-1);
  position: fixed;
  top: 20px;
  left: 10px;
}

.sidenav {
  height: 100%;
  width: 0px;
  position: fixed;
  z-index: 100;
  top: 0px;
  padding-top: 70px;
  left: 0;
  background-color: white;
  overflow-x: hidden;
  transition: 0.2s;
  box-shadow: none;
}

.small {
  box-shadow: 4px 0px 12px -7px rgba(0, 0, 0, 0.75);
}
</style>
