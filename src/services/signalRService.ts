import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import useStore from "@src/store/store";
import { storeToRefs } from 'pinia';

class SignalRService {
  private connection: HubConnection | null = null;
  private readonly RETRY_INTERVAL = 5000;
  private readonly MAX_RETRIES = 10;
  private retryCount = 0;
  private isConnecting = false;

  public async startConnection() {
    if (this.isConnecting || this.connection?.state === HubConnectionState.Connected) {
      console.log('Connection exists:', this.connection?.state);
      return;
    }

    try {
      this.isConnecting = true;
      this.connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
          accessTokenFactory: () => JSON.parse(localStorage.getItem('user') || '{}').token || ''
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 3) {
              return null;
            }
            return 5000;
          }
        })
        .build();

      await this.connection.start();
      console.log('SignalR Connected');
      this.registerHandlers();
    } catch (error) {
      console.error('Connection failed:', error);
      this.retryConnection();
    } finally {
      this.isConnecting = false;
    }
  }

  private async retryConnection() {
    if (this.retryCount < this.MAX_RETRIES && !this.isConnecting) {
      this.retryCount++;
      console.log(`Retrying connection... Attempt ${this.retryCount}`);
      await new Promise(resolve => setTimeout(resolve, this.RETRY_INTERVAL));
      await this.startConnection();
    } else {
      console.error('Max retry attempts reached');
    }
  }

  private registerHandlers() {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log("Reconnecting...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("Reconnected successfully:", connectionId);
      this.retryCount = 0;
    });

    this.connection.onclose((error) => {
      console.error("Connection closed:", error);
      this.retryConnection();
    });

    this.connection.on('ReceiveMessage', (message) => {
      const store = useStore();
      const { conversations } = storeToRefs(store);
      const conversation = conversations.value.find(c => c.id === message.chatId);
      if (conversation) {
        conversation.messages = [...conversation.messages, message];
        conversation.lastMessage = message;
      }
    });

  }
  public getConnectionId() {
    return this.connection?.connectionId;
  }
}

export const signalRService = new SignalRService();