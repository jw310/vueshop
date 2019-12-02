<template>
   <div>
      <form class="form-signin" @submit.prevent="signin">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
          <label for="inputEmail" class="sr-only">Email address</label>
          <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="user.username" required autofocus>
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="user.password" required>
          <div class="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"> Remember me
            </label>
          </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          <p class="mt-5 mb-3 text-muted">&copy; 2019</p>
      </form>
   </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: '', 
      },
    };
  },
  methods: {
  signin() {
    //  對應 config 裡的 dev.env.js 的環境變數
    //const api = 'https://vue-course-api.hexschool.io/signin';
    const api = `${process.env.VUE_APP_APIPATH}/admin/signin` ;
    // api 伺服器路徑
    // 申請apipath
    const vm = this;
    //console.log(process.env.APIPATH, process.env.CUSTOMPATH);
    this.$http.post(api, vm.user).then((response) => {
    console.log(response.data);
    if (response.data.success) {
            //vm.$router.push('/');
            vm.$router.push('/admin');    // 登入到指定頁面
          } 
        });
    },
  },
}
</script>


<style scoped>  /* scoped 只對裡面的元件樣式有效 */
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>