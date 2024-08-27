import { UsedAPI } from "@/utils/configs/endpoint";
import { saveJwtInfo } from "@/utils/functions/saveJwtInfo";

import { loadCookie } from "@/services/cookie";

import {
  MessageCopilotRequest,
  CopilotChatResponse,
} from "@/types/api/copilot";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const copilotApi = createApi({
  reducerPath: "copilotApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}`,
    prepareHeaders: (headers) => {
      //Please always include this (saveJwtInfo), this for copilot purpose
      saveJwtInfo();
      const token = loadCookie("token");
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    createCopilotChat: builder.mutation<
      CopilotChatResponse,
      MessageCopilotRequest
    >({
      query: (obj) => {
        const { signal, ...rest } = obj;
        return {
          url: `/chatbot/messages`,
          method: "POST",
          body: rest,
          signal,
        };
      },
    }),

    createCopilotStreamChat: builder.query<
      ReadableStream<Uint8Array> | null,
      MessageCopilotRequest
    >({
      queryFn: async (obj) => {
        const params = new URLSearchParams({
          html: obj.html,
          messages: JSON.stringify(obj.messages),
        });
        const url = `${UsedAPI}/chatbot/messages?${params.toString()}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loadCookie("token")}`,
            "Content-Type": "text/event-stream",
          },
        });

        if (response.ok) {
          const readableStream = response.body;
          return {
            data: readableStream,
          };
        } else {
          return {
            data: null,
          };
        }
      },
    }),
  }),
});

export const {
  useCreateCopilotChatMutation,
  useLazyCreateCopilotStreamChatQuery,
  util: { resetApiState: resetCopilotApiState },
} = copilotApi;
