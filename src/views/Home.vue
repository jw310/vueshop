<template>
  <div>
    <div class="container main-content mb-3">
      <Loading :active.sync="isLoading"></Loading>
      <div class="row">
        <div class="col-md-3">
          <!-- 左側選單 (List group) -->
          <div class="list-group sticky-top">
            <a class="list-group-item list-group-item-action"
              href="#" @click.prevent="searchText = item"
              :class="{ 'active': item === searchText}"
              v-for="item in categories" :key="item">
              <i class="fa fa-street-view" aria-hidden="true"></i>
              {{ item }}
            </a>
            <a href="#" class="list-group-item list-group-item-action"
              @click.prevent="searchText = ''"
              :class="{ 'active': searchText === ''}">
              全部顯示
            </a>
          </div>
        </div>

        <!-- 子頁面 -->
        <div class="col-md-9">
          <div class="d-flex mb-4">
            <!-- Search bar -->
            <form class="form-inline my-3 my-lg-0">
              <div class="input-group">
                <input class="form-control" type="text" v-model="searchText"
                  placeholder="Search" aria-label="Search">
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button"
                    @click="searchText = ''">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
            </form>
            <button class="btn btn-outline-primary ml-auto" type="button"
              @click="getProducts">
              重新取得產品資料
            </button>
          </div>
          <!-- content -->
          <div class="tab-pane" id="list-gift">
            <div class="row align-items-stretch">
              <!-- 禮品 -->
              <div class="col-md-4 mb-4" v-for="(item) in filterData" :key="item.id">
                <div class="card border-0 box-shadow text-center h-100">
                  <img class="card-img-top" :src="item.imageUrl" alt="Card image cap">
                  <div class="card-body">
                    <span class="badge badge-secondary float-right">{{item.category}}</span>
                    <h4 class="card-title">{{ item.title }}</h4>
                    <p class="card-text text-left">{{ item.content }}</p>
                  </div>
                  <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm"
                        @click="getProduct(item.id)">
                        <!-- <i class="fas fa-spinner fa-spin"></i> -->
                        看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
                        @click="addtoCart(item.id)">
                        <i class="fa fa-cart-plus" aria-hidden="true"></i>
                        加到購物車
                    </button>
                    </div>
                  <!-- <div class="card-footer border-top-0 bg-white">
                    <button class="btn btn-outline-secondary btn-block btn-sm"
                      @click="addtoCart(item.id)">
                      <i class="fa fa-cart-plus" aria-hidden="true"></i> 加到購物車
                    </button>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
          aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span> 
                        </button>
                    </div>
                    <div class="modal-body">
                    <img :src="product.imageUrl" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                            <p class="mb-0">{{ product.content }}</p>
                            <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                            <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                            <div class="h4" v-if="product.price">現在只要{{ product.price }} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">
                                選購 {{ num }} {{ product.unit }}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計 <strong>{{ product.num * product.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary"
                        @click="addtoCart(product.id, product.num)">
                        <!-- <i class="fas fa-spinner fa-spin" v-if="product.id === status.LoadingItem"></i> -->
                        加到購物車 
                        </button>
                    </div>
                </div>
            </div>
         </div>

  </div>
</template>

<script>
import $ from "jquery"; // 因為此元件無法使用 $，所以要先 import 才能使用

export default {
  name: 'Home',
  data() {
    return {
      products: [],
      product: {},
      searchText: '',
      categories: [],
      isLoading: false,
      status: {   // 個別產品讀取效果
                loadingItem: '',
      },
    };
  },
  computed: { // 篩選功能
    filterData() {
      const vm = this;
      if (vm.searchText) {
        return vm.products.filter((item) => {  // 用三元運算來處理類別跟關鍵字的運算
          const data =  vm.searchText === item.category ? item.category.toLowerCase().includes(vm.searchText.toLowerCase()) : item.title.toLowerCase().includes(vm.searchText.toLowerCase());
          return data;
        }); 
      }
      return this.products;
    },
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;
        //console.log('取得產品列表:', response);
        vm.getUnique();
        vm.isLoading = false;
      });
    },
    getProduct(id) {   // 查看更多
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
      this.$http.get(api).then(response => { 
        //console.log(response);
        vm.product = response.data.product;
        //console.log(vm.product);
        $('#productModal').modal('show');
      }); 
     },
    addtoCart(id, qty = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      const item = {
        product_id: id,
        qty,
      };
      vm.isLoading = true;
      this.$http.post(url, { data: item }).then((response) => {
        vm.isLoading = false;
        console.log('加入購物車:', response);
      });
    },
    getUnique() {
      const vm = this;
      const categories = new Set();
      vm.products.forEach((item) => {
        categories.add(item.category);
      // console.log(categories);
      });
      vm.categories = Array.from(categories);
      //console.log(vm.categories);
    },   
  },
  created() {
    this.getProducts();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* img {
  width: 50%;  
  height: auto;
} */

.badge {
  c​​lear: both;
}

</style>
