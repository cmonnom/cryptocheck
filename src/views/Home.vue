<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <CryptoHome msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import CryptoHome from "@componenets/CryptoHome.vue";

export default {
  name: "Home",
  components: {
    CryptoHome,
  },
};
</script>
