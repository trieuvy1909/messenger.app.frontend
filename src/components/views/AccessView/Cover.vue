<script setup lang="ts">
import cloudPatternPath from "@src/assets/images/clouds.png";
import blurPath from "@src/assets/images/blur.png";
</script>

<template>
  <div class="py-[3.125rem] px-[3.125rem] h-full basis-1/2 md:flex xs:hidden items-center justify-center">
    <div class="w-full h-full p-7 flex flex-row items-center justify-center bg-no-repeat bg-center bg-cover rounded-[.75rem]" :style="{ 'background-image': `url(${cloudPatternPath})` }">
      <div class="px-5 py-[3.75rem] rounded-[.3125rem] bg-cover bg-no-repeat body-3 text-white italic" :style="{ 'background-image': `url(${blurPath})` }">
        Welcome to <span class="text-gradient font-bold">V.P Messenger</span>! Connect with friends and colleagues through instant messaging and file sharing. Enjoy one-on-one chats or group discussions with ease. Our secure platform ensures your privacy while keeping you updated with instant notifications. Experience a seamless chatting experience on any device. Join us and enhance your communication today!
      </div>
    </div>
  </div>
</template>

<!-- Add this custom CSS to your project -->
<style scoped>
.text-gradient {
  background: -webkit-linear-gradient(left top, #de6dce, #e7ddee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
