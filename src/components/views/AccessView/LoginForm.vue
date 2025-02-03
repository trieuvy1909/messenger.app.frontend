<template>
  <div class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center">
    <div class="w-full md:px-[26%] xs:px-[10%]">
      <!-- Header -->
      <div class="mb-6 flex flex-col">
        <div class="flex justify-center">
          <img
            src="@src/assets/vectors/logo.svg"
            class="w-[10rem] h-[10rem] mb-4 opacity-70"
            alt="bird logo"
          />
        </div>
        <p class="heading-2 text-color mb-4 text-center">Welcome back</p>
        <p class="body-3 text-color text-opacity-75 font-light italic text-center">
          Start messaging now!
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="loginHandle" class="mb-6">
        <PhoneNumberInput
          label="Phone Number"
          name="Phone"
          placeholder="Enter your phone number"
          class="mb-5"
          required
          :value="phoneNumber"
          @valueChanged="(newValue: string) => phoneNumber = newValue"
        />
        <PasswordInput
          label="Password"
          name="Password"
          :value="password"
          required
          placeholder="Enter your password"
          @valueChanged="(newValue: string) => password = newValue"
        />


        <!-- Validate Notification -->
        <ValidateNotification
        v-if="validateNotificationVisible"
          :visible="validateNotificationVisible"
          :type="validateNotificationType"
          :title="validateNotificationTitle"
          :message="validateNotificationMessage"
          @close="validateNotificationVisible = false"
        />


        <Button
          type="submit"
          class="contained-primary contained-text w-full my-4"
          :loading="store.status==='loading'?true:false"
        >
          Sign in
        </Button>
      </form>

      <!-- Divider -->
      <div class="mb-6 flex items-center">
        <span class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"></span>
        <p class="body-3 text-color px-4 text-opacity-75 font-light">or</p>
        <span class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"></span>
      </div>

      <!-- OAuth Controls -->
      <div>
        <Button class="outlined-primary outlined-text w-full mb-5">
          <span class="flex">
            <img
              src="@src/assets/vectors/google-logo.svg"
              class="mr-3"
              alt="google logo"
            />
            Sign in with Google
          </span>
        </Button>

        <!-- Bottom Text -->
        <div class="flex justify-center">
          <p class="body-2 text-color">
            Don’t have an account?
            <RouterLink to="/access/sign-up/" class="text-indigo-400 opacity-100">
              Sign up
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <Notification
      v-if="notificationVisible"
      :visible="notificationVisible"
      :type="notificationType"
      :title="notificationTitle"
      :message="notificationMessage"
      @close="notificationVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { apiModule } from "@src/config/api";
import Button from "@src/components/ui/inputs/Button.vue";
import PhoneNumberInput from "@src/components/ui/inputs/PhoneNumberInput.vue";
import PasswordInput from "@src/components/ui/inputs/PasswordInput.vue";
import { RouterLink, useRouter } from "vue-router";
import Notification from "@src/components/ui/dialog/Notification.vue";
import ValidateNotification from "@src/components/ui/dialog/ValidateNotification.vue";
import useStore from "@src/store/store";
import { IUser,IProfile } from "@src/types";
const store = useStore();
const router = useRouter();

const phoneNumber = ref("");
const password = ref("");

const notificationVisible = ref(false);
const notificationType = ref("");
const notificationTitle = ref("");
const notificationMessage = ref("");

// Thêm các biến cho ValidateNotification
const validateNotificationVisible = ref(false);
const validateNotificationType = ref("");
const validateNotificationTitle = ref("");
const validateNotificationMessage = ref("");

const showNotification = (type: string, title: string, message: string) => {
  notificationType.value = type;
  notificationTitle.value = title;
  notificationMessage.value = message;
  notificationVisible.value = true;
};

const showValidateNotification = (type: string, title: string, message: string) => {
  validateNotificationType.value = type;
  validateNotificationTitle.value = title;
  validateNotificationMessage.value = message;
  validateNotificationVisible.value = true;
};

const loginHandle = async () => {
  try {
    store.status = "loading";
    validateNotificationVisible.value = false;

    // #region Login & Local Store Update
    const response = await apiModule.users.login({
      Username: phoneNumber.value,
      Password: password.value,
    });

    store.status = "";
    const userStore = {
      id: response.data.user.id,
      userName: response.data.user.userName,
      status: response.data.user.status,
      profile: {
        fullName : response.data.user.profile.fullName,
        avatar : response.data.user.profile.avatar,
        bio : response.data.user.profile.bio,
      } as IProfile,
      isAdmin: response.data.user.isAdmin,
      createdAt: response.data.user.createdAt,
      chats: response.data.user.chats,
      friends: response.data.user.friends,
      token: response.data.token,
      lastSeen: new Date(),
    } as IUser;
    localStorage.setItem('user', JSON.stringify(userStore.id));
    // #endregion

    // #region Fetch Data to Store
    await Promise.all([
      store.fetchUser(),
      store.fetchConversations(),
    ]);
    // #endregion

    store.status = "success";

    showNotification('success', 'Login Successful', response.data.message);

    setTimeout(() => {
        router.push('/');
    }, 500);
  } catch (error) {
    store.status = "error";
    const errorMessage = (error as any).response?.data || 'Bad request. Please check your input.';
    showNotification('error', 'Login Error',"");
    showValidateNotification('error', 'Login Error', errorMessage);
  }
};
</script>

<style scoped>
</style>
