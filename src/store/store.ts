import { defineStore } from "pinia";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { apiModule } from "@src/config/api";
import defaults from "@src/store/defaults";
import type {
  IConversation,
  IContactGroup,
  IUser,
  IProfile,
  INotification,
  ICall,
  ISettings,
  IEmoji,
} from "@src/types";

const useStore = defineStore("Store", () => {
  // local storage
  const storage = JSON.parse(localStorage.getItem("Store") || "{}");

  // app status refs
  const status = ref("idle");

  // app data refs
  // data refs
  const user: Ref<IUser> = ref({
    fullName:"",
    id: "",
    userName: "",
    status: "offline",
    profile: {
      fullName: "",
      avatar: "",
      bio: "",
    },
    isAdmin: false,
    createdAt: new Date(),
    chats: [],
    password: "",
    friends: [],
    token: "",
    lastSeen: new Date(),
    settings: {
      lastSeen: false,
      readReceipt: false,
      joiningGroups: false,
      privateMessages: false,
      darkMode: false,
      borderedTheme: false,
      allowNotifications: false,
      keepNotifications: false,
    },
  });
  const conversations: Ref<IConversation[]> = ref([]);
  const activeConversation: Ref<IConversation | undefined> = ref();
  const notifications: Ref<INotification[]> = ref([]);
  const calls: Ref<ICall[]> = ref(defaults.calls || []);
  const activeCall: Ref<ICall | undefined> = ref(defaults.activeCall);
  const emojiSkinTone: Ref<string> = ref(storage.emojiSkinTone || "neutral");

  // ui refs
  const activeSidebarComponent: Ref<string> = ref(
    storage.activeSidebarComponent || "messages"
  );
  const delayLoading = ref(true);
  const callMinimized = ref(false);
  const openVoiceCall = ref(false);

  // contacts grouped alphabetically.
  const contactGroups: Ref<IContactGroup[] | undefined> = computed(() => {
    if (user.value) {
      let sortedContacts = [...user.value.friends];

      sortedContacts.sort();

      let groups: IContactGroup[] = [];
      let currentLetter: string = "";
      let groupNames: string[] = [];

      // create an array of letter for every different sort level.
      // for (let contact of sortedContacts) {
      //   // if the first letter is different create a new group.
      //   if (contact.firstName[0].toUpperCase() !== currentLetter) {
      //     currentLetter = contact.firstName[0].toUpperCase();
      //     groupNames.push(currentLetter);
      //   }
      // }

      // create an array that groups contact names based on the first letter;
      // for (let groupName of groupNames) {
      //   let group: IContactGroup = { letter: groupName, contacts: [] };
      //   for (let contact of sortedContacts) {
      //     if (contact.firstName[0].toUpperCase() === groupName) {
      //       group.contacts.push(contact);
      //     }
      //   }
      //   groups.push(group);
      // }

      return groups;
    }
  });

  const fetchConversations = async () => {
    try {
      status.value = "loading";
      const response = await apiModule.chats.getChatsOfUser();
      conversations.value = [...response.data];
      return response.data;
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw error;
    }
  };
  const fetchUser = async () => {
    try {
      const response = await apiModule.users.getMyInfo();
      user.value = response.data;
      const userStore = {
        id: response.data.id,
        userName: response.data.userName,
        status: response.data.status,
        profile: {
          fullName : response.data.profile.fullName,
          avatar : response.data.profile.avatar,
          bio : response.data.profile.bio,
        } as IProfile,
        settings: {
          lastSeen: response.data.settings.lastSeen,
          readReceipt: response.data.settings.readReceipt,
          joiningGroups: response.data.settings.joiningGroups,
          privateMessages: response.data.settings.privateMessages,
          darkMode: response.data.settings.darkMode,
          borderedTheme: response.data.settings.borderedTheme,
          allowNotifications: response.data.settings.allowNotifications,  
          keepNotifications: response.data.settings.keepNotifications,
        } as ISettings,
        isAdmin: response.data.isAdmin,
        createdAt: response.data.createdAt,
        chats: response.data.chats,
        friends: response.data.friends,
        lastSeen: new Date(),
      } as IUser;
      user.value = userStore;
    } catch (error) {
      status.value = "error";
      console.error(error);
    }
  };
  return {
    // fetch data
    status,
    fetchUser,
    fetchConversations,
    // data refs
    user,
    conversations,
    activeConversation,
    contactGroups,
    notifications,
    calls,
    activeCall,
    emojiSkinTone,

    // ui refs
    activeSidebarComponent,
    delayLoading,
    callMinimized,
    openVoiceCall,
  };
});

export default useStore;
