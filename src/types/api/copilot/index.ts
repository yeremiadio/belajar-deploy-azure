export type MessageCopilot = {
  role: "user" | "assistant";
  content: string;
};

export type MessageCopilotRequest = {
  messages: MessageCopilot[];
  html: string;
  signal?: AbortSignal;
};

export type MessageCopilotForm = {
  chat: string;
};

export type CopilotChatResponse = {
  status: string;
  data: MessageCopilot;
};