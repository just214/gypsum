<template>
  <el-form :model="formData"
    ref="loginForm"
    label-width="0px">
    <el-form-item prop="email">
      <el-input type="email"
        placeholder="Email"
        v-model="formData.email">
        <template slot="prepend">
          <i class="fa fa-envelope" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password"
      style="margin-bottom: 2px">
      <el-input type="password"
        placeholder="Password"
        v-model="formData.password"
        auto-complete="off">
        <template slot="prepend">
          <i class="fa fa-lock" />
        </template>
      </el-input>
    </el-form-item>
    <div style="padding: 8px">
      <el-checkbox v-model="rememberMe">Remember Me</el-checkbox>
    </div>

    <el-form-item>
      <el-button style="width: 100%"
        type="primary"
        native-type="submit"
        @click.prevent.capture="submitForm">Login</el-button>
    </el-form-item>

  </el-form>

</template>
<script>
export default {
  data: () => ({
    rememberMe: false,
    formData: {
      email: '',
      password: '',
    },
  }),
  methods: {
    submitForm() {
      this.$emit('submit', this.formData);
      this.formData.password = '';
      this.handleRemember();
    },
    handleRemember() {
      if (this.rememberMe) {
        localStorage.setItem('cb-email', this.formData.email);
      } else {
        localStorage.removeItem('cb-email');
      }
    },
  },
  created() {
    const localStorageEmail = localStorage.getItem('cb-email');
    if (localStorageEmail) {
      this.rememberMe = true;
      this.formData.email = localStorageEmail;
    }
  },
  watch: {
    rememberMe() {
      if (!this.rememberMe) {
        localStorage.removeItem('cb-email');
      }
    },
  },
};
</script>

<style scoped>
i.fa-lock {
  font-size: 20px;
}
</style>
