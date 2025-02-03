<script setup lang="ts">
import TextInput from "@src/components/ui/inputs/TextInput.vue";

const emit = defineEmits(["valueChanged"]);

const props = defineProps<{
  id?: string;
  type?: string;
  label?: string;
  value?: string;
  name?: string;
  class?: string;
  placeholder?: string;
  bordered?: boolean;
  required?: boolean;
}>();

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Chỉ cho phép nhập số từ 0-9
  const formattedValue = input.value.replace(/[^0-9]/g, "");
  input.value = formattedValue;
  // Emit giá trị đã được định dạng
  emit("valueChanged", formattedValue);
};
</script>

<template>
    <div class="flex flex-col">
        <label v-if="props.label" :for="props.id" class="body-2 text-color mb-3">
        {{ props.label }}
        </label>

        <div class="relative">
        <div class="absolute left-0 top-0">
            <slot name="startAdornment"></slot>
        </div>

        <TextInput
            type="text"
            :name="props.name"
            :id="props.id"
            :value="value"
            :class="class"
            :placeholder="props.placeholder"
            :bordered="props.bordered"
            :required="props.required"
            @value-changed="(value: string) => $emit('valueChanged', value)"
            pattern="[0-9]*"
            inputmode="numeric"
            style="appearance: none; -moz-appearance: textfield;"
            @input="handleInput"
        />

        <div class="absolute top-0 right-0">
            <slot name="endAdornment"></slot>
        </div>
        </div>
    </div>
</template>