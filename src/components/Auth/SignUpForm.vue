<template>
  <el-form :model="formData"
    status-icon
    :rules="rules"
    ref="signupForm"
    label-width="0px"
    class="demo-ruleForm">
    <el-form-item prop="email">
      <el-input type="email"
        placeholder="Email"
        v-model="formData.email">
        <template slot="prepend">
          <i class="fa fa-envelope" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password1">
      <el-input type="password"
        placeholder="Create a Password"
        v-model="formData.password1"
        auto-complete="off">
        <template slot="prepend">
          <i class="fa fa-lock" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password2">
      <el-input type="password"
        placeholder="Confirm your Password"
        v-model="formData.password2"
        auto-complete="off">
        <template slot="prepend">
          <i class="fa fa-lock" />
        </template>
      </el-input>

      <el-button type="primary"
        :disabled="!isValid"
        native-type="submit"
        style="width: 100%;margin-top: 15px;"
        @click.prevent="submitForm('signupForm')">Join Claimbook!</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.formData.password2 && this.formData.password2 !== value) {
        this.$refs.signupForm.validateField('password2');
      }
      if (value.length < 6) {
        callback(new Error(' '));
      } else if (this.formData.password2 !== '') {
        this.$refs.signupForm.validateField('password2');
      }
      callback();
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' '));
      } else if (value !== this.formData.password1) {
        callback(new Error(' '));
      } else {
        callback();
      }
    };
    return {
      formData: {
        email: '',
        password1: '',
        password2: '',
      },
      rules: {
        email: [
          {
            required: true,
            message: ' ',
            trigger: ['change'],
          },
          {
            type: 'email',
            message: ' ',
            trigger: ['change'],
          },
        ],
        password1: [{ validator: validatePass, trigger: ['change'] }],
        password2: [{ validator: validatePass2, trigger: ['change'] }],
      },
    };
  },
  computed: {
    isValid() {
      return (
        this.formData.email &&
        this.formData.password1 &&
        this.formData.password2
      );
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          return this.$emit('submit', {
            email: this.formData.email,
            password: this.formData.password1,
          });
        }
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
i.fa-lock {
  font-size: 20px;
}
</style>
