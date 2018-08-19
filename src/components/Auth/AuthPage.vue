<template>
  <div class="wrapper">
    <el-card class="auth-card"
      shadow="always"
      style="border-radius: 14px;position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);"
      v-loading="$store.state.auth.pending">

      <div class="title-wrapper">
        <p style="padding: 0px; margin: 0px;">Welcome to</p>
        <h1>Gypsum</h1>
      </div>

      <el-tabs v-model="activeTab"
        stretch>
        <el-tab-pane label="Login"
          name="login">
          <LoginForm @submit="handleEmailLogin" />
          <ResetPasswordForm @submit="handlePasswordReset" />
          <br />
          <el-button @click="loginWithGoogle"
            round>
            <div class="social-button-content">
              <img src="../../assets/google-icon.png"
                alt="Google Logo"
                height="20" />
              <span>&nbsp;&nbsp;Login with Google</span>
            </div>
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="Sign Up"
          name="signup">
          <SignUpForm @submit="handleEmailSignUp" />
          <el-button @click="loginWithGoogle"
            round>
            <div class="social-button-content">
              <img src="../../assets/google-icon.png"
                alt="Google Logo"
                height="20" />
              <span>&nbsp;&nbsp;Sign Up with Google</span>
            </div>
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ResetPasswordForm from './ResetPasswordForm';

export default {
  components: {
    LoginForm,
    ResetPasswordForm,
    SignUpForm,
  },
  data: () => ({
    activeTab: 'login',
  }),
  methods: {
    ...mapActions('auth', [
      'loginWithGoogle',
      'loginWithEmail',
      'sendPasswordResetLink',
      'signUpWithEmail',
    ]),
    handleEmailLogin(values) {
      this.loginWithEmail(values);
    },
    handleEmailSignUp(values) {
      this.signUpWithEmail(values);
    },
    handlePasswordReset(email) {
      this.sendPasswordResetLink(email).then(() => {
        this.$message(
          `A link to reset your password has been sent to ${email}.`,
        );
      });
    },
  },
};
</script>


<style scoped>
.wrapper {
  min-height: 100vh;
  height: 100%;
  width: 100%;
  min-width: 100vw;
  margin: 0;

  background: url('../../assets/bg.jpg');
  background-size: cover;
}

.auth-card {
  text-align: center;
  width: 320px;
  margin: 0 auto;
  margin-bottom: 50px;
  opacity: 0.95;
}

.social-button-content {
  display: flex;
  align-items: center;
}

.title-wrapper {
  text-align: center;
  font-family: 'Sigmar One', cursive;
  color: var(--gray-9);
  opacity: 0.9;
}

h1 {
  font-size: 3em;
  margin: 0px;
  padding: 0px;
}
</style>

