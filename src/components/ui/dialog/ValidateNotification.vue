<template>
    <transition name="fade">
        <div v-if="visible" class="flex items-center p-4 mb-4 text-sm shadow-lg rounded-[0.5rem]" :class="alertClass" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">{{ type }}</span>
            <div>
                <span class="font-bold">{{ title }}</span> - {{ message }}
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
    visible: Boolean,
    type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});


const alertClass = computed(() => {
    switch (props.type) {
        case 'info':
            return 'text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800';
        case 'error':
            return 'text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800';
        case 'success':
            return 'text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800';
        case 'warning':
            return 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800';
        case 'dark':
            return 'text-gray-800 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
        default:
            return '';
    }
});
</script>

<style scoped>

</style> 