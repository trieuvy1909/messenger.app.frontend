<script setup lang="ts">
import { computed, ref } from "vue";

import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import PasswordSection from "@src/components/views/AccessView/RegisterForm/PasswordSection.vue";
import PersonalSection from "@src/components/views/AccessView/RegisterForm/PersonalSection.vue";
import Notification from "@src/components/ui/dialog/Notification.vue";
import { RouterLink } from "vue-router";
import { apiModule } from "@src/config/api";
import useStore from "@src/store/store";
const store = useStore();

//defineEmits(["activeSectionChange"]);

const phoneNumber = ref("");
const fullname = ref("");
const password = ref("");
const confirmPassword = ref("");

const notification = {
  visible: ref(false),
  type: ref(""),
  title: ref(""),
  message: ref("")
};

const validateNotification = {
  visible: ref(false),
  type: ref(""),
  title: ref(""),
  message: ref("")
};

// determines what form section to use.
const activeSectionName = ref("personal-section");

// determines what direction the slide animation should use.
const animation = ref("slide-left");

// get the active section component from the section name
const ActiveSection = computed((): any => {
  if (activeSectionName.value === "personal-section") {
    return PersonalSection;
  } else if (activeSectionName.value === "password-section") {
    return PasswordSection;
  }
});

const showNotification = (type: string, title: string, message: string) => {
  notification.type.value = type;
  notification.title.value = title;
  notification.message.value = message;
  notification.visible.value = true;
};

const showValidateNotification = (type: string, title: string, message: string) => {
  validateNotification.type.value = type;
  validateNotification.title.value = title;
  validateNotification.message.value = message;
  validateNotification.visible.value = true;
};

// (event) to move between modal pages
const changeActiveSection = (event: {
  sectionName: string;
  animationName: string;
}) => {
  animation.value = event.animationName;
  activeSectionName.value = event.sectionName;
};


const registerHandle = async () => {
  if (password.value !== confirmPassword.value) {
    showNotification('error', 'Register Error', "Mật khẩu không khớp");
    showValidateNotification('error', 'Register Error', "Mật khẩu không khớp");
  } else {
    try {
      store.status = "loading";
      validateNotification.visible.value = false;
      const response = await apiModule.users.create({
        UserName: phoneNumber.value,
        FullName: fullname.value,
        Password: password.value,
      });
      store.status = "";
      showNotification('success', 'Registration Successful', response.data);
    } catch (error) {
      store.status = "";
      const errorMessage = (error as any).response?.data || 'Bad request. Please check your input.';
      showNotification('error', 'Register Error',"");
      showValidateNotification('error', 'Register Error', errorMessage);
    }
  }
}
</script>

<template>
  <div
    class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center"
  >
    <div class="w-full md:px-[26%] xs:px-[10%]">
      <!--header-->
      <div class="mb-6 flex flex-col">
        <div class="flex justify-center">
          <img
          src="@src/assets/vectors/logo.svg"
          class="w-[10rem] h-[10rem] mb-5 opacity-70"
          alt="logo"
        />
        </div>
        <p class="heading-2 text-color mb-4">Get started with Avian</p>
        <p class="body-3 text-color text-opacity-75 font-light">
          Sign in to start using messaging!
        </p>
      </div>

      <!--form section-->
      <SlideTransition :animation="animation">
        <component
          @active-section-change="changeActiveSection"
          :is="ActiveSection"
          :phone-number="phoneNumber"
          :fullname="fullname"
          :password="password"
          :confirm-password="confirmPassword"
          :validateNotification="validateNotification"
          @update-phone-number="phoneNumber = $event"
          @update-fullname="fullname = $event"
          @update-password="password = $event"
          @update-confirm-password="confirmPassword = $event"
          @register="registerHandle"
        />
      </SlideTransition>

      <!--bottom text-->
      <div class="flex justify-center">
        <p class="body-2 text-color">
          Already have an account?
          <RouterLink to="/access/sign-in/" class="text-indigo-400 opacity-100">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
    <!-- Notification -->
    <Notification
      v-if="notification.visible.value"
      :visible="notification.visible.value"
      :type="notification.type.value"
      :title="notification.title.value"
      :message="notification.message.value"
      @close="notification.visible.value = false"
    />
  </div>
</template>
