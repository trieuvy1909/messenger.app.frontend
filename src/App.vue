<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import useStore from "@src/store/store";
const store = useStore();
store.delayLoading = false;

onMounted(async () => {
  if (localStorage.getItem('user')) {
    try {
      await Promise.all([
        store.fetchUser(),
        store.fetchConversations(),
      ]);
      store.status = "success";
    } catch (error) {
      store.status = "error";
      console.error('Failed to fetch data:', error);
    }
  }
});

// the app height
const height = ref(`${window.innerHeight}px`);

// change the app height to the window hight.
const resizeWindow = () => {
  height.value = `${window.innerHeight}px`;
};

// and add the resize event when the component mounts.
onMounted(() => {
  window.addEventListener("resize", resizeWindow);
});

// remove the event when un-mounting the component.
onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});
</script>

<template>
  <div :class="{ dark: store.user?.settings.darkMode || false}">
    <div class="bg-white dark:bg-gray-800 transition-colors duration-500" :style="{ height: height }">
      <router-view v-slot="{ Component }">
        <FadeTransition>
          <component :is="Component" />
        </FadeTransition>
      </router-view>
    </div>
  </div>
</template>
