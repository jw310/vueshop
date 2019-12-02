<template>
<div>
    <loading :active.sync="isLoading"></loading>
         <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <h6 class="d-flex justify-content-between align-items-center mt-4 mb-4 text-muted">
              <span>管理介面</span>
              <a class="d-flex align-items-center text-muted" href="#">
                <span data-feather="plus-circle"></span>
              </a>
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
    <div class="text-right mt-1">
    <!-- 傳值讓  isNew = true -->
    </div>
    </nav>
    <!-- <span>優惠券列表</span> -->
    <button class="btn btn-primary" @click="openModal(true)">建立新優惠券</button>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>優惠名稱</th>
          <th>優惠碼</th>
          <th>折扣%數</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <!--key 會產生警告(有 eslint 的話)，因為此時沒有資料，但不影響使用-->
        <tr v-for="(item, key) in Coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.code}}</td>
          <td>{{item.percent}}</td>
          <td>{{item.dua_date}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
              <div style="display: inline-block;width: 100px;">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
              <button class="btn btn-outline-primary btn-sm" @click="delModal(item)">刪除</button>
              </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!--page-->
        <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disable': !pagination.has_pre}">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="getProducts(pagination.current_page - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{'active': pagination.current_page === page}"
        >
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
        </li>
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="getProducts(pagination.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
        <!-- openModal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalLabel" aria-hidden="true"> 
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>新增優惠券</span>
                </h5>            
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">   
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                        <label for="title">優惠名稱</label>
                        <input type="text" class="form-control" id="title"
                        v-model="tempCoupon.title" placeholder="請輸入優惠名稱"/>
                        </div>
                        <div class="form-group">
                        <label for="code">優惠碼</label>
                        <input type="text" class="form-control" id="code"
                         v-model="tempCoupon.code" placeholder="請輸入優惠碼"/>
                        </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                <label for="percent">折扣％數</label>
                                <input type="text" class="form-control" id="percent"
                                v-model="tempCoupon.percent" placeholder="請輸入折扣％數"/>
                                </div>                     
                                <div class="form-group col-md-6">
                                <label for="percent">到期日</label>
                                 <date-picker v-model="tempCoupon.dua_date" :config="{format: 'DD/MM/YYYY'}"></date-picker>
                                </div>                               
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                <input class="form-check-input" type="checkbox"
                                v-model="tempCoupon.is_enabled"
                                :true-value="1"
                                :false-value="0"
                                id="is_enabled"/>
                                <label class="form-check-label" for="is_enabled">是否啟用</label>
                                </div>
                            </div>
                     </div>  
                </div>
            </div>  
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
                    </div>
        </div>
      </div>
    </div> 
    <!--delmodal-->
    <div class="modal fade" id="delcouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupons">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
          
</div> 
</template> 

<script>
import $ from "jquery"; // 因為此元件無法使用 $ ，所以要先 import 才能使用

export default {
  data() {
    return {
      Coupons: [],
      pagination: {},
      couponId: '', 
      tempCoupon: {}, // 暫存資料
      isNew: false,
      isLoading: false, // 讀取效果     
    };   
  },
  methods: {
    getCoupons(page = 1) {
      const vm = this;
      const api = 'https://vue-course-api.hexschool.io/api/jw310/admin/coupons?page=${page}'
      //const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);   // api 回覆訊息
        vm.isLoading = false;
        vm.Coupons = response.data.coupons;
        vm.pagination = response.data.pagination; // 分頁資訊
        console.log(vm.Coupons);
      });
    },
    updateCoupon() {
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
      let httpMethod = "post";
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
      //console.log(response.data);
        if (response.data.success) {
          $("#couponModal").modal("hide"); // 成功地關閉 modal
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide"); // 成功地關閉 modal
          vm.getCoupons();
          console.log("新增失敗");
        }
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        // ES6 方法 Object.assign()
        this.tempCoupon = Object.assign({}, item);  // 處理物件傳參考的問題
        this.isNew = false;
      }
      $("#couponModal").modal("show");
    },
    deleteCoupons() {
      const vm = this;
      //console.log(vm.index);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.couponId}`;
      this.$http.delete(api).then(response => {
      //console.log(response.data);
        if (response.data.success) {
          $("#delcouponModal").modal("hide"); // 成功地關閉 modal
          console.log("刪除成功");
          vm.getCoupons();
        } else {
          $("#delcouponModal").modal("hide"); // 成功地關閉 modal
          vm.getCoupons();
          console.log("刪除失敗");
        }
      });
    },
    delModal(item) {
      $("#delcouponModal").modal("show");
      this.couponId = item.id; // 取得點選的 item.id
      //console.log(item.id);
    },
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
  },
  created() {
    this.getCoupons();
  }
};
</script>

