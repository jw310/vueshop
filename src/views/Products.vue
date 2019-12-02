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
    <!-- <span>產品列表</span> -->
    <button class="btn btn-primary" @click="openModal(true)">建立新產品</button>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="80">編輯</th>
        </tr>
      </thead>
      <tbody>
        <!--key 會產生警告(有 eslint 的話)，因為此時沒有資料，但不影響使用-->
        <tr v-for="(item, key) in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price | currency}}</td>
          <td class="text-right">{{item.price | currency}}</td>
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
    <!-- Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div><div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結"
                  />
                </div>
          
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile"
                  />
                </div>
                <img
                  class="img-fluid"
                  :src="tempProduct.imageUrl"
                  alt
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價"
                    />
                    
                  </div>
                </div>
                <hr />
                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="delProductModal"
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
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
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
      products: [],
      pagination: {},
      tempProduct: {}, // modal 資料
      isNew: false,
      deleteId: "",
      isLoading: false, // 讀取效果
      status: {
        fileUploading: false
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      // ES6 變數預設值
      const vm = this;
      const api = 'https://vue-course-api.hexschool.io/api/jw310/admin/products?page=${page}`'
      //const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
      //console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH);  // 看路徑是否正確
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        // vue 下才能使用
        //console.log(response.data);   // api 回覆訊息
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination; // 分頁資訊
        //console.log(vm.products);
      });
    },
    openModal(isNew, item) {
      //$('#productModal').modal('show'); //  確認有資料才 openModal
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        // ES6 方法 Object.assign()
        this.tempProduct = Object.assign({}, item); // 如果直接 this.tempProduct = item，會有傳參考的特性
        this.isNew = false;
      }
      $("#productModal").modal("show");
    },
    updateProduct() {
      //updata API
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
      let httpMethod = "post";
      const vm = this;
      //console.log(process.env.APIPATH, process.env.CUSTOMPATH);  // 看路徑是否正確
      // { data: vm.tempProduct } 因為接收資料的型態要是物件
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        console.log(response.data);
        if (response.data.success) {
          $("#productModal").modal("hide"); // 成功地關閉 modal
          vm.getProducts();
        } else {
          $("#productModal").modal("hide"); // 成功地關閉 modal
          vm.getProducts();
          console.log("新增失敗");
        }
      });
    },
    delModal(item) {
      $("#delProductModal").modal("show");
      this.deleteId = item.id; // 取得點選的 item.id
      //console.log(item.id);
    },
    deleteProduct() {
      const vm = this;
      //console.log(vm.index);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.deleteId}`;
      this.$http.delete(api).then(response => {
        //console.log(response.data);
        if (response.data.success) {
          $("#delProductModal").modal("hide"); // 成功地關閉 modal
          console.log("刪除成功");
          vm.getProducts();
        } else {
          $("#delProductModal").modal("hide"); // 成功地關閉 modal
          vm.getProducts();
          console.log("刪除失敗");
        }
      });
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
    uploadFile() {
      // 上傳圖片
      //console.log(this);
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const formData = new FormData(); //  表單送出方法，建立物件
      formData.append("file-to-upload", uploadedFile);   // 新增欄位
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
      vm.status.fileUploading = true;
      this.$http.post(url, formData, {
          headers: {
            "content-Type": "multipart/form-data" // 改上傳格式為 form-data
          }
        }).then(response => {
          console.log(response.data);
          vm.status.fileUploading = false;
          if (response.data.success) {
            // vm.tempProduct.imageUrl = response.data.imageUrl; // 此時資訊並沒有完整寫入
            //console.log(vm.tempProduct.imageUrl);
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl); // 雙向綁定，強制寫入資訊
          } else {
            //this.$bus.$emit("message:push", response.data.message, "danger"); // 內層觸發
          }
        });
    }
  },
  created() {
    this.getProducts();
  }
};
</script>
