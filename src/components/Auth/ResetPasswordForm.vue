<template>
  <el-collapse>
    <el-collapse-item title="Reset Password"
      name="reset-password">
      <el-form :model="formData"
        ref="formData"
        label-width="0px">
        <el-form-item prop="email">
          <el-input type="email"
            clearable
            placeholder="Email"
            v-model="formData.email">
            <template slot="prepend">
              <i class="fa fa-envelope" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%"
            @click="submitForm"
            type="primary">Send Password Reset Link</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data: () => ({
    formData: {
      email: '',
    },
  }),
  methods: {
    submitForm() {
      this.$emit('submit', this.formData.email);
      this.formData.email = '';
    },
  },
  created() {
    const localStorageEmail = localStorage.getItem('cb-email');
    if (localStorageEmail) {
      this.formData.email = localStorageEmail;
    }
  },
};
</script>

