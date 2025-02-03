<script setup lang="ts">
import Button from "@src/components/ui/inputs/Button.vue";
import LabeledTextInput from "@src/components/ui/inputs/LabeledTextInput.vue";
import PhoneNumberInput from "@src/components/ui/inputs/PhoneNumberInput.vue";

const props = defineProps({
  phoneNumber: String,
  fullname: String,
});

const emit = defineEmits();

const validatePersonalInformationHandle = async() => {
  if (props.phoneNumber !== "" && props.fullname !== "") {
    emit('active-section-change', {
      sectionName: 'password-section',
      animationName: 'slide-left',
    });
  }
}
</script>

<template>
  <div>
    <!--form-->
    <form class="mb-5" @submit.prevent="validatePersonalInformationHandle">
      <PhoneNumberInput
        label="Phone"
        required
        placeholder="Enter your phone number"
        class="mb-5"
        @valueChanged="(newValue: string) => emit('update-phone-number', newValue)"
      />
      <LabeledTextInput
        label="FullName"
        required
        placeholder="Enter your full name"
        class="mb-5"
        @valueChanged="(newValue: string) => emit('update-fullname', newValue)"
      />
      <Button
        class="contained-primary contained-text w-full mb-4"
        >Next</Button
      >
    </form>


    <!--divider-->
    <div class="mb-6 flex items-center">
      <span
        class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"
      ></span>
      <p class="body-3 text-color px-4 text-opacity-75 font-light">or</p>
      <span
        class="w-full border border-dashed border-gray-100 dark:border-gray-600 rounded-[.0625rem]"
      ></span>
    </div>

    <!--oauth controls-->
    <Button class="outlined-primary outlined-text w-full mb-5">
      <span class="flex">
        <img
          src="@src/assets/vectors/google-logo.svg"
          class="mr-3"
          alt="google-logo"
        />
        Sign in with google
      </span>
    </Button>
  </div>
</template>
