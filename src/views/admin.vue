<template>
  <div>
    <div class="container main-content mb-3">
      <Loading :active.sync="isLoading"></Loading>
      <div class="row">
        <div class="col-md-6">
          <Navbar></Navbar>
          <!-- <Sidebar></Sidebar> -->
        </div>

        <!-- 孝頝面 -->
        <div class="col-md-6">
        </div>

      </div>
    </div>
  </div>
</template>

<script>
//import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';


export default {
  components: {
    // Sidebar,
    Navbar,
  },
};
</script>

