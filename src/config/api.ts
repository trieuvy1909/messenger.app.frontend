import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/v1/api/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/access/login';
    }
    return Promise.reject(error);
  }
);

export const apiModule = {
  users: {
    login: (data: { Username: string; Password: string }) => api.post("users/login", data),
    create: (data: { UserName: string; Password: string; FullName: string }) => api.post("users/create", data),
    logout: () => api.get("users/logout"),
    getMyInfo: () => api.get("users/my-info"),
  },
  chats: {
    getChatsOfUser: () => api.get("chats/get-chats"),
    getChatById: (chatId: string) => api.get(`get-chat-by-id?chatId=${chatId}`),
    create: (data: { Title:string; Recipients: string[] }) => api.post("chats/create", data),
    delete: (chatId: string) => api.delete(`chats/?id=${chatId}`),
    addUserToChat: (data: { ChatID:string; Recipients: string[] }) => api.post("chats/add-user-to-chat", data),
    deleteUserFromChat: (data: { ChatID:string; Recipients: string[] }) => api.delete(`chats/delete-user-from-chat`),
  },
  messages: {
    send: (message: { content: string; chatId: string; }) => api.post(`message/send`, message)
  },
};