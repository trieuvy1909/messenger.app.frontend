<script setup lang="ts">
import type { IConversation, IMessage } from "@src/types";
import type { Ref } from "vue";

import { inject, onMounted, ref, watch, nextTick } from "vue";

import useStore from "@src/store/store";

import Message from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Message.vue";
import TimelineDivider from "@src/components/views/HomeView/Chat/ChatMiddle/TimelineDivider.vue";

const props = defineProps<{
  activeConversation: IConversation;
  handleSelectMessage: (messageId: string) => void;
  handleDeselectMessage: (messageId: string) => void;
  selectedMessages: string[];
}>();

const store = useStore();

const container: Ref<HTMLElement | null> = ref(null);

// checks whether the previous message was sent by the same user.
const isFollowUp = (index: number, previousIndex: number): boolean => {
  if (previousIndex < 0) {
    return false;
  } else {
    let previousSender = props.activeConversation.messages[previousIndex].sender.id;
    let currentSender = props.activeConversation.messages[index].sender.id;
    return previousSender === currentSender;
  }
};

// checks whether the message is sent by the authenticated user.
const isSelf = (message: IMessage): boolean => {
  return Boolean(store.user && message.sender.id === store.user.id);
};

// checks wether the new message has been sent in a new day or not.
const renderDivider = (index: number, previousIndex: number): boolean => {
  if (index === 3) {
    return true;
  } else {
    return false;
  }
};
const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (container.value) {
      container.value.scrollTo({
        top: container.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  })
}
onMounted(() => {
  scrollToBottom(false)
});
watch(
  () => props.activeConversation.lastMessage.id,
  () => {
    scrollToBottom(true);
  },
  { deep: true }
);

</script>

<template>
  <div
    ref="container"
    class="grow px-5 py-5 flex flex-col overflow-y-scroll scrollbar-hidden"
  >
    <div
      v-if="store.status !== 'loading'"
      v-for="(message, index) in activeConversation.messages"
      :key="index"
    >
      <TimelineDivider v-if="renderDivider(index, index - 1)" />

      <Message
        :active-conversation="activeConversation"
        :message="message"
        :self="isSelf(message)"
        :follow-up="isFollowUp(index, index - 1)"
        :divider="renderDivider(index, index - 1)"
        :selected="props.selectedMessages.includes(message.id)"
        :handle-select-message="handleSelectMessage"
        :handle-deselect-message="handleDeselectMessage"
      />
    </div>
  </div>
</template>
