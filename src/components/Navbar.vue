<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <h6 class="d-flex justify-content-between align-items-center mt-4 mb-4 text-muted">
              <span>管理介面</span>
            </h6>
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link class="nav-link" to="/admin/products">
                  產品列表
                </router-link>
              </li>
            </ul>
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link class="nav-link" to="/admin/orders">
                  訂單列表
                </router-link>
              </li>
            </ul>
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link class="nav-link" to="/admin/coupons">
                  優惠券
                </router-link>
              </li>
            </ul>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a href="#" @click.prevent="signout">登出</a>
              </li>
            </ul>
    </nav>
  </div>
</template>

<script>
export default {
    name: 'Navbar',
    // methods: {
   signout() {
   //  對應 config 裡的 dev.env.js 的環境變數
   //const api = 'https://vue-course-api.hexschool.io/logout';
   const api = `${process.env.VUE_APP_APIPATH}/logout` ;
   // api 伺服器路徑
   // 申請apipath
   const vm = this;
   this.$http.post(api).then((response) => {
   console.log(response.data);
   if (response.data.success) {
          vm.$router.push('/login');    // 登入回到首頁
        } 
      });
    },
    // },
}
</script>

<style lang="scss">

.navbar {
  width: 800px;
}

  
</style>