<template>
  <div id="app">
    <nav class="navbar navbar-light bg-light">
      <div class="shop">
      <router-link to="/">
        <i class="fa fa-heart text-info" aria-hidden="true"></i>
       購物首頁
      </router-link>
      </div>
      <router-link class="login" to="/login">登入
      </router-link>
      <!-- 下拉式購物車內的數量 (Button 內包含 icon, 數量 badge) -->
      <div class="dropdown ml-12">
        <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
          <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
          <span class="badge badge-pill badge-danger">{{cart.carts.length}}</span>
          <span class="sr-only">unread messages</span>
        </button>
        <div class="dropdown-menu dropdown-menu-right p-3" style="min-width: 300px"
          data-offset="400">
          <h6>已選擇商品</h6>
          <table class="table table-sm">
            <tbody>
              <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts.length">
                <td class="align-middle text-center">
                  <a href="#" class="text-muted" @click.prevent="removeCart(item.id)">
                    <i class="fa fa-trash-alt" aria-hidden="true"></i>
                  </a>
                </td>
                <td class="align-middle">{{ item.product.title }}</td>
                <td class="align-middle">{{ item.qty }}{{item.product.unit}}</td>
                <td class="align-middle text-right">{{item.total}}</td>
              </tr>
            </tbody>
          </table>
          <router-link to="/customerorders">
          <button class="btn btn-primary btn-block">
            <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
          </button>
          </router-link>
        </div>
      </div>
    </nav>
    <div class="jumbotron jumbotron-fluid jumbotron-bg d-flex align-items-end">
      <div class="container">
        <div class="p-3 bg-lighter">
          <h1 class="display-3 font-weight-bold">買到停不住！最後出清</h1>
          <p class="lead">This is a modified jumbotron that occupies
            the entire horizontal space of its parent.</p>
        </div>
      </div>
    </div>
    
    <Loading :active.sync="isLoading"></Loading>
    <router-view/>  <!--使用 vue router 載入頁面-->

    <footer class="bg-light text-muted py-5">
      <div class="container">
        <ul class="list-inline text-center">
          <li class="list-inline-item">© Copright 2019 測試網站</li>
          <li class="list-inline-item">
            <a class="text-info" href="#">
              <i class="fab fa-instagram" aria-hidden="true"></i> Instagrame</a>
          </li>
          <li class="list-inline-item">
            <a class="text-info" href="#">
              <i class="fab fa-facebook-square" aria-hidden="true"></i> Facebook</a>
          </li>
          <li class="list-inline-item">
            <a class="text-info" href="#">About</a>
          </li>
        </ul>
        <p class="text-center">Made with Bootstrap4</p>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      cart: {
        carts: [],
      },
      isLoading: false,
    };
  },
  methods: {
    getCart() {
      const vm = this;
      vm.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.$http.get(url).then((response) => {
        if (response.data.data.carts) {
          vm.cart = response.data.data;
        }
        vm.isLoading = false;
        //console.log('取得購物車', response.data.data);
      });
    },
    removeCart(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then((response) => {
        vm.isLoading = false;
        vm.getCart();
        console.log('刪除購物車項目', response);
      });
    },
    // signout() {
    // // 對應 config 裡的 dev.env.js 的環境變數
    // const api = 'https://vue-course-api.hexschool.io/logout';
    // const vm = this;
    // const api = `${process.env.APIPATH}/logout` ;
    // this.$http.post(api).then((response) => {
    // console.log(response.data);
    // if (response.data.success) {
    //        vm.$router.push('/home');    // 登入回到首頁
    //       } 
    //      });
    // },
  },
  created() {
    this.getCart();
  },
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";

.navbar {
  justify-content: flex-end;
}

.jumbotron-bg {
  /* banners.png */
  background: url('https://images.unsplash.com/photo-1477901492169-d59e6428fc90?w=1350');
  background-size: cover;
  background-position: center center;
  min-height: 400px;
}

/* 半透明背景 */
.bg-lighter {
  background-color: rgba(255, 255, 255, .45);
}

/* 購物車按鈕 */
.btn-cart {
  background-color: transparent;
  position: relative;
}

/* 購物車按鈕定位 */
.btn-cart .badge {
  position: absolute;
  top: 1px;
  right: 1px;
}

.main-content {
  min-height: calc(100vh - 56px - 176px)
}

.box-shadow {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, .05);
  transition: .3s linear;
}

.box-shadow:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, .08);
}

.dropdown-menu-right {
  right: 0;
  left: auto;
}

.alert-rounded {
  border-radius: 50px;
}

.login {
  text-align: right;
  margin: 15px;
}

.shop {
  margin: 10px;
}

</style>
