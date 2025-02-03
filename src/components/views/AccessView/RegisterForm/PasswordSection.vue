<script setup lang="ts">
import { ref } from "vue";
import PasswordInput from "@src/components/ui/inputs/PasswordInput.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import useStore from "@src/store/store";
import ValidateNotification from "@src/components/ui/dialog/ValidateNotification.vue";

// Định nghĩa props
const props = defineProps({
  password: String,
  confirmPassword: String,
  validateNotification: {
    type: Object,
    default: () => ({
      visible: false,
      type: '',
      title: '',
      message: ''
    })
  }
});
const password = ref(props.password);
const confirmPassword = ref(props.confirmPassword);
const emit = defineEmits();
const store = useStore();

const updatePassword = (newValue: string) => {
  emit('update-password', newValue);
  password.value = newValue; 
}
const updateConfirmPassword = (newValue: string) => {
  emit('update-confirm-password', newValue);
  confirmPassword.value = newValue;
}
</script>

<template>
  <div>
    <form @submit.prevent="emit('register')" class="mb-5">
      <!--form-->
      <PasswordInput
        @valueChanged="(newValue) => updatePassword(newValue)"
        label="Password"
        required
        :value="password"
        placeholder="Enter your password"
        class="mb-5"
      />

      <PasswordInput
        @valueChanged="(newValue) => updateConfirmPassword(newValue)"
        label="Confirm Password"
        required
        :value="confirmPassword"
        placeholder="Enter your password"
        class="mb-5"
      />
      <ValidateNotification
        v-if="props.validateNotification.visible.value"
        :visible="props.validateNotification.visible.value"
        :type="props.validateNotification.type.value"
        :title="props.validateNotification.title.value"
        :message="props.validateNotification.message.value"
        @close="props.validateNotification.visible.value = false"
      />
      <Button class="contained-primary contained-text w-full mb-4" 
      type="submit"
      :loading="store.status === 'loading' ? true : false"
        >Sign up</Button
      >
    </form>

    <!--controls-->
    <div class="mb-5">
      <Button
        class="outlined-primary outlined-text w-full"
        @click="
          emit('active-section-change', {
            sectionName: 'personal-section',
            animationName: 'slide-right',
          })
        "
      >
        Back
      </Button>
    </div>
  </div>
</template>
