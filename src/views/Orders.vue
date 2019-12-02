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
    </nav>
    <!-- <span>訂單列表</span> -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>訂購人</th>
          <th>訂購人電話</th>
          <th>購買品項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <!-- <th width="80">編輯</th> -->
        </tr>
      </thead>
      <tbody>
        <!--key 會產生警告(有 eslint 的話)，因為此時沒有資料，但不影響使用-->
        <tr v-for="(item, key) in Orders" :key="item.id">
          <td>{{item.create_at | timestamp}}</td>
          <td>{{item.user.name}}</td>
          <td>{{item.user.tel}}</td>
          <td>{{item.products.product}}</td>
          <td>{{item.total}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else>未付款</span>
          </td>
          <!-- <td>
            <div style="display: inline-block;width: 100px;">
              <button class="btn btn-outline-primary btn-sm" @click="">編輯</button>
              <button class="btn btn-outline-primary btn-sm" @click="delModal(item)">刪除</button>
            </div>
          </td> -->
        </tr>
      </tbody>
    </table>
    <!--頁籤列表-->
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disable': !pagination.has_pre}">
          <a class="page-link" href="#" aria-label="Previous"
            @click.prevent="getOrders(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li
          class="page-item" v-for="page in pagination.total_pages" :key="page"
          :class="{'active': pagination.current_page === page}">
          <a class="page-link" href="#" @click.prevent="getOrders(page)">{{ page }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next"
            @click.prevent="getOrders(pagination.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>

    <!--deleteModal-->
    <div
      class="modal fade"
      id="delOrderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
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
            <strong class="text-danger">{{ tempOrder.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteOrder">確認刪除</button>
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
      Orders: [],
      pagination: {},
      deleteId: '',
      tempOrder: {},
      isLoading: false, // 讀取效果
      status: {
        fileUploading: false
      }
    };
  },
  methods: {
    getOrders(page = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);   // api 回覆訊息
        vm.isLoading = false;
        vm.Orders = response.data.orders;
        vm.pagination = response.data.pagination; // 分頁資訊
        //console.log(vm.Orders);
      });
    },
    deleteOrder() {
      const vm = this;
      //console.log(vm.index);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/order/${vm.deleteId}`;
      this.$http.delete(api).then(response => {
      });
    },
    openModal(item) {
      //$('#productModal').modal('show'); //  確認有資料才 openModal
      // ES6 方法 Object.assign()
      this.tempOrder = Object.assign({}, item); // 如果直接 this.tempProduct = item，會有傳參考的特性
      //$("#OrderModal").modal("show");
    },
    delModal(item) {
      $("#delOrderModal").modal("show");
      this.deleteId = item.id; // 取得點選的 item.id
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
    this.getOrders();
  }
};
</script>