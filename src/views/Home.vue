<template>
  <div class="home">
    <CryptoHome msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import CryptoHome from "@/components/CryptoHome.vue";

export default {
  name: "Home",
  components: {
    CryptoHome,
  },
};
</script>
