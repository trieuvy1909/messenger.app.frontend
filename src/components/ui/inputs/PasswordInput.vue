<script setup lang="ts">
import { ref, watch } from "vue";

import LabeledTextInput from "@src/components/ui/inputs/LabeledTextInput.vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";

defineEmits(["valueChanged"]);

const props = defineProps<{
  id?: string;
  type?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  description?: string;
  bordered?: boolean;
  class?: string;
  required?:boolean;
}>();

const showPassword = ref(false);
const inputValue = ref(props.value);

watch(() => props.value, (newValue) => {
  inputValue.value = newValue;
});
</script>

<template>
  <LabeledTextInput
    :id="props.id"
    :type="showPassword ? 'text' : 'password'"
    :label="props.label"
    :value="props.value"
    v-model="inputValue"
    :placeholder="props.placeholder"
    :class="props.class"
    :bordered="props.bordered"
    :required="props.required"
    @value-changed="(value: string) => $emit('valueChanged', value)"
  >
    <template v-slot:endAdornment>
      <IconButton
        title="toggle password visibility"
        aria-label="toggle password visibility"
        class="mt-3 p-2"
        @click.prevent="showPassword = !showPassword"
      >
        <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
        <EyeIcon v-else class="w-5 h-5" />
      </IconButton>
    </template>
  </LabeledTextInput>
</template>
