<script setup lang="ts">
import type { Ref } from "vue";
import { storeToRefs } from 'pinia';
import useStore from "@src/store/store";
import { computed, ref, provide } from "vue";
import { getActiveConversationId } from "@src/utils";

import NoChatSelected from "@src/components/states/empty-states/NoChatSelected.vue";
import Spinner from "@src/components/states/loading-states/Spinner.vue";
import ChatBottom from "@src/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import ChatMiddle from "@src/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatTop from "@src/components/views/HomeView/Chat/ChatTop/ChatTop.vue";

const store = useStore();


import type { IConversation } from "@src/types";

const { conversations } = storeToRefs(store);

const activeConversation = computed<IConversation | null>(() => {
  return conversations.value.find(
    (conversation) => conversation.id === getActiveConversationId()
  ) || null;
});

// determines whether select mode is enabled.
const selectMode = ref(false);

// determines whether all the messages are selected or not.
const selectAll = ref(false);

// holds the selected conversations.
const selectedMessages: Ref<string[]> = ref([]);

// (event) add message to select messages.
const handleSelectMessage = (messageId: string) => {
  selectedMessages.value.push(messageId);

  if (
    activeConversation.value &&
    selectedMessages.value.length === activeConversation.value.messages.length
  ) {
    selectAll.value = true;
  }

  if (!selectMode.value) {
    selectMode.value = true;
  }
};

// (event) remove message from select messages.
const handleDeselectMessage = (messageId: string) => {
  selectAll.value = false;
  selectedMessages.value = selectedMessages.value.filter(
    (item) => item !== messageId,
  );

  if (activeConversation.value && selectedMessages.value.length === 0) {
    selectMode.value = false;
  }
};

// (event) select all messages.
const handleSelectAll = () => {
  if (activeConversation.value) {
    const messages = activeConversation.value.messages.map(
      (message) => message.id,
    );
    selectedMessages.value = messages;
    selectAll.value = true;
  }
};

// (event) remove the selected messages.
const handleDeselectAll = () => {
  selectAll.value = false;
  selectedMessages.value = [];
};

// (event handle close Select)
const handleCloseSelect = () => {
  selectMode.value = false;
  selectAll.value = false;
  selectedMessages.value = [];
};
</script>

<template>
  <Spinner v-if="store.status === 'loading' || store.delayLoading" />

  <div
    v-else-if="getActiveConversationId() && activeConversation"
    class="h-full flex flex-col scrollbar-hidden"
  >
    <ChatTop
      :active-conversation="activeConversation"
      :select-all="selectAll"
      :select-mode="selectMode"
      :handle-select-all="handleSelectAll"
      :handle-deselect-all="handleDeselectAll"
      :handle-close-select="handleCloseSelect"
    />
    <ChatMiddle
      :active-conversation="activeConversation"
      :selected-messages="selectedMessages"
      :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage"
    />
    <ChatBottom :active-conversation="activeConversation"/>
  </div>

  <NoChatSelected v-else />
</template>
