<template>
<div>
    <loading :active.sync="isLoading"></loading> <!--讀取效果-->
    <!-- cart list-->
    <table class="table">
      <thead>
        <tr>
          <th></th>  
          <th>產品名稱</th>
          <th>數量</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <!--key 會產生警告(有 eslint 的話)，因為此時沒有資料，但不影響使用-->
        <tr v-for="(item, key) in carts" :key="item.id"> 
          <td width="20px">
          <button type="button" class="btn btn-outline-danger btn-sm"
          @click="removeCartItem(item.id)">
              <i class="fas fa-trash-alt"></i>
          </button>
          </td>
          <td width="100px">{{item.product.title}}
             <div class="text-success" v-if="item.coupon">
                 已使用優惠券
             </div>
          </td>
          <td width="50px">{{item.qty}}/{{item.product.unit}}</td>
          <td width="50px" align="right">{{ item.total | currency}}</td>
        </tr>
      </tbody>
      <tfoot>
      <tr>
          <td colspan="3" align="right">原價</td>
          <td align="right">{{this.total}}</td>
        </tr>
          <tr v-if="this.final_total !== this.total">  <!-- 有折扣時才出現 -->
          <td colspan="3" align="right" class="text-success">折扣價</td>
          <td align="right" class="text-success">{{this.final_total}}</td>
        </tr>
      </tfoot>
    </table>
        <!-- <div class='input-group mb-3 input-group-sm '>
          <input type="text" class="text-right" placeholder="請輸入優惠碼">
            <div>
            <button class="btn btn-lg btn-primary btn-block" type="button"
            @click="addCouponCode">送出</button>
            </div> 
        </div> -->
    <!-- 送出表單 -->
<div class="my-5 row justify-content-center">
  <form class="col-md-6" @submit.prevent="createOrder">
    <div class="form-group">
      <label for="useremail">Email</label>
      <input type="email" class="form-control" name="email" id="useremail"
        v-model="form.user.email" placeholder="請輸入 Email" required>
      <span class="text-danger">
      </span>
    </div>
  
    <div class="form-group">
      <label for="username">收件人姓名</label>
      <input type="text" class="form-control" name="name" id="username"
        v-model="form.user.name" v-validate="'required'" placeholder="輸入姓名">
    </div>
  
    <div class="form-group">
      <label for="usertel">收件人電話</label>
      <input type="tel" class="form-control" id="usertel" name="phoneNubmer" v-model="form.user.tel">
    </div>
  
    <div class="form-group">
      <label for="useraddress">收件人地址</label>
      <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address">
    </div>
  
    <div class="form-group">
      <label for="comment">留言</label>
      <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
    </div>
    <div class="text-right">
      <button class="btn btn-danger">送出訂單</button>
    </div>
  </form>
</div>
</div>   
</template>

<script>
import $ from "jquery"; // 因為此元件無法使用 $，所以要先 import 才能使用


 export default {
    data() {
        return {
            products: [],
            product: {},
            carts: {},
            total: 0,
            final_total: 0,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            isLoading: false,
            coupon_code: ''
        };
    },
    methods: {
    getProducts() { 
      const vm = this;
      const api = `https://vue-course-api.hexschool.io/api/jw310/products`;
      //const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
      vm.loading = true;
      this.$http.get(api).then(response => {
      console.log(response.data);
        vm.products = response.data.products; 
        vm.loading = false;
      });
     },
     getProduct(id) {   // 查看更多
      const vm = this;                                                                     
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => { 
        //console.log(response);
        vm.product = response.data.product;
        $('#productModal').modal('show');
        vm.status.loadingItem = '';
      }); 
     },
     getCart() {  // 取得購物車資料
      const vm = this;                                                                     
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(api).then(response => { 
      console.log(response.data.data);
      vm.carts = response.data.data.carts;
      vm.total = response.data.data.total;
      vm.final_total = response.data.data.final_total;
      vm.isLoading = false;
      }); 
     },
     removeCartItem(id) {
      const vm = this;                                                                     
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(response => { 
      //console.log(response);
      //vm.carts = response.data.data.carts;
      this.getCart();
      vm.isLoading = false;
      }); 
     },
    //  addCouponCode() {
    //   const vm = this;                                                                     
    //   const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
    //   const coupon = {
    //       code: vm.coupon_code,
    //   }
    //   vm.isLoading = true;
    //   this.$http.delete(api, { data: coupon }).then(response => { 
    //   this.getCart();
    //   vm.isLoading = false;
    //   }); 
    //  },
     createOrder() {
      const vm = this;                                                                     
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      const order = vm.form;
      //vm.isLoading = true;
      this.$validator.validate().then((result) => {  // veevalidate的驗證方法
        if (result) {
            this.$http.post(api, { data: order }).then(response => {  // 自訂義
            console.log('訂單已建立', response);
            if (response.data.success) {
              vm.$router.push(`/customercheckout/${response.data.orderId}`);
            }  
            //this.getCart();
            vm.isLoading = false;
           }); 
         } else {
             console.log('欄位不完整');
         }
      });
     },
   },       
    created() {
    this.getProducts();
    this.getCart();   // 取得購物車資料
   } 
}
</script>

<style scoped>
.table {
  width: 50%;
  /* 置中 */ 
  margin-left:auto;   
  margin-right:auto;
}

.form-coupon {
  width: 30%;
  /* 置中 */ 
  margin-left:auto;   
  margin-right:auto;
}

/* .form-control {
    display: inline-block;
} */

input {
    cursor: pointer;
    border-radius: 5px;
    padding:5px 15px;
    border:1px black solid; 
}

.coupon {
    white-space: nowrap; 
}

th {
  align-content: right;
}

</style>
