import { useSelector } from 'react-redux';
import { useState, useEffect, HTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

import Card from '@/components/Card';

import { RootState } from '@/stores';
import { selectHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { MessageCopilotForm, MessageCopilot } from '@/types/api/copilot';

import { cn } from '@/lib/utils';

import { ProcessBarIcon, WarningIcon } from '@/assets/images';

import Header from './_components/Header';
import Question from './_components/ChatBubble/Question';
import Answer from './_components/ChatBubble/Answer';
import ChatInput from './_components/ChatInput';

import useAppSelector from '@/utils/hooks/useAppSelector';
import { localization } from '@/utils/functions/localization';

import { useLazyCreateCopilotStreamChatQuery } from '@/stores/copilotStore/copilotStoreApi';

import './style.css';

export default function Copilot({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { isCopilotOpen } = useSelector(
    ({ toggleCopilotSlice }: RootState) => toggleCopilotSlice,
  );
  const language = useAppSelector(selectLanguage);

  const copilotForm = useForm<MessageCopilotForm>({
    defaultValues: {
      chat: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const globalHtmlRefId = useSelector(selectHtmlRefId);
  const [chatHistory, setChatHistory] = useState<MessageCopilot[]>([]);
  const [errorChatMessage, setErrorChatMessage] = useState<string>('');
  const [loadingCopilot, setLoadingCopilot] = useState<boolean>(false);
  const [isIterating, setIsIterating] = useState<boolean>(false);
  const [abortReader, setAbortReader] =
    useState<ReadableStreamDefaultReader<Uint8Array>>();
  const greetingMessage: MessageCopilot = {
    role: 'assistant',
    content: localization(
      'Hi, how can I help you today? Ask me about everything you need to know about Rapidsense!',
      language,
    ),
  };

  const [createCopilotChat] = useLazyCreateCopilotStreamChatQuery();
  const [currentReply, setCurrentReply] = useState<string>('');
  const [replyIndex, setReplyIndex] = useState<number>(0);

  // Iterate currentReply to display the typing animation
  useEffect(() => {
    if (currentReply.length === 0) {
      return;
    }

    setIsIterating(true);

    const interval = setInterval(() => {
      if (replyIndex === currentReply.length) {
        clearInterval(interval);
        setIsIterating(false);
        return;
      }

      setChatHistory((prevChatHistory) => {
        const lastMessage = prevChatHistory[prevChatHistory.length - 1];
        // If the last message is from the assistant, append the new message to the last message
        if (lastMessage.role === 'assistant') {
          return prevChatHistory.slice(0, -1).concat({
            role: 'assistant',
            content:
              // If the last message is not an ellipsis, append the new message to the last message
              // Otherwise, replace the ellipsis with the new message
              lastMessage.content !== '...'
                ? lastMessage.content + currentReply[replyIndex]
                : currentReply[replyIndex],
          });
        } else {
          // If the last message is from the user, append the new message to the chat history
          return prevChatHistory.concat({
            role: 'assistant',
            content: currentReply[replyIndex],
          });
        }
      });
      setReplyIndex((prevReplyIndex) => prevReplyIndex + 1);
    }, 20);

    return () => clearInterval(interval);
  }, [currentReply, replyIndex]);

  useEffect(() => {
    // Cleanup the Reader when the component unmounts
    return () => {
      if (abortReader) {
        abortReader.cancel();
      }

      setAbortReader(undefined);
    };
  }, []);

  useEffect(() => {
    if (loadingCopilot) {
      const loadingMessage: MessageCopilot = {
        role: 'assistant',
        content: '...',
      };

      setChatHistory((prevChatHistory) => [...prevChatHistory, loadingMessage]);
      setErrorChatMessage('');
    } else {
      setChatHistory((prevChatHistory) =>
        prevChatHistory.filter(
          (message) =>
            message.role !== 'assistant' || message.content !== '...',
        ),
      );
    }
  }, [loadingCopilot]);

  useEffect(() => {
    setChatHistory([greetingMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChatResponse = async ({
    messages,
    html,
  }: {
    messages: MessageCopilot[];
    html: string;
  }) => {
    try {
      setLoadingCopilot(true);
      const { data: readableStream } = await createCopilotChat({
        html,
        messages,
      });

      if (!readableStream) {
        throw new Error('No readable stream');
      }

      const reader = readableStream.getReader();

      if (!reader) {
        throw new Error('No reader');
      }

      // Store the reader in the state so we can cancel it later
      setAbortReader(reader);
      const decoder = new TextDecoder('utf-8');

      let loop = true;
      let completeMessage = '';
      setReplyIndex(0);
      while (loop) {
        const { done, value } = await reader.read();
        if (done) {
          loop = false;
          setLoadingCopilot(false);
          break;
        }
        const text = decoder.decode(value, { stream: true });
        const sanitizedText = text
          .split('\n')
          .filter((line) => line.startsWith('data:'));
        sanitizedText.forEach((line) => {
          completeMessage += line.replace('data: ', '');
        });
        setCurrentReply(completeMessage);
      }
    } catch (error) {
      setLoadingCopilot(false);
      throw new Error('Error getting chat response');
    }
  };

  const handleSubmit = async (data: MessageCopilotForm) => {
    const htmlElement = document.getElementById(globalHtmlRefId || '');
    setErrorChatMessage('');

    try {
      if (htmlElement) {
        const userMessage: MessageCopilot = {
          role: 'user',
          content: data.chat,
        };

        if (data.chat.trim() === '') {
          setChatHistory((prevHistory) => prevHistory);
        } else {
          setChatHistory((prevHistory) => [...prevHistory, userMessage]);
        }

        copilotForm.setValue('chat', '');

        const usedMessages =
          data.chat.trim() === ''
            ? [...chatHistory]
            : [...chatHistory, userMessage];

        await getChatResponse({
          messages: usedMessages,
          html: htmlElement.textContent || '',
        });
        setErrorChatMessage('');
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message: string } }).data?.message ??
        "There's an error, please try again!";
      setErrorChatMessage(errorMessage);
    }
    copilotForm.reset();
  };

  const handleOnReset = () => {
    handleStopProcess();
    setChatHistory([greetingMessage]);
    setErrorChatMessage('');
  };

  const handleRetryButtonClick = async () => {
    copilotForm.reset();

    setErrorChatMessage('');
    setChatHistory((prevHistory) => {
      const lastUserMessage = prevHistory[prevHistory.length - 1];

      // Check if the last user message has empty content
      if (
        lastUserMessage &&
        lastUserMessage.role === 'user' &&
        lastUserMessage.content.trim() === ''
      ) {
        // Remove the last user message from chat history
        return prevHistory.slice(0, -1);
      }

      return prevHistory;
    });
    await copilotForm.handleSubmit(handleSubmit)();
  };

  const handleStopProcess = () => {
    if (abortReader) {
      abortReader.cancel();
    }
    setCurrentReply('');
    setReplyIndex(0);
    setErrorChatMessage('');
    setLoadingCopilot(false);
    setIsIterating(false);
  };

  return (
    <Card
      className={cn(
        // 80.5px is the height of TopBar
        `z-20 flex max-h-[calc(100vh-(2.5rem+80.5px))] w-[310px] max-w-[250px] rounded-e-none border-e-0 bg-rs-v2-navy-blue backdrop-blur-[2.5px] transition-all duration-500 ease-in-out lg:max-w-[310px]`,
        isCopilotOpen ? `relative ml-6 blur-none` : 'h-0 w-0 blur-lg',
        className,
      )}
      {...rest}
    >
      <div className="relative flex w-full flex-shrink-0 flex-col">
        <Header handleReset={handleOnReset} />
        <div className="flex h-full flex-col gap-6 overflow-y-auto py-6">
          {chatHistory.map((message, index) => {
            const { role, content } = message;
            if (role === 'user') {
              return <Question key={index} text={content} />;
            } else if (role === 'assistant') {
              return (
                <Answer
                  key={index}
                  text={content}
                  errorChat={
                    content === '...' && errorChatMessage ? true : false
                  }
                />
              );
            }
            return null;
          })}
        </div>
        <div
          className={cn(
            'bg-linear-copilot absolute bottom-0 z-10 h-[150px] w-full',
          )}
        />
        <div
          className={cn(
            'absolute left-[40px] z-10 flex items-center justify-center transition-all duration-500 ease-in-out lg:left-[70px]',
            loadingCopilot || isIterating ? 'bottom-[80px]' : 'bottom-[20px]',
          )}
        >
          <button
            onClick={handleStopProcess}
            className="mb-5 mt-0 flex h-[35px] w-[173px] items-center justify-center rounded-[5px] border border-rs-yale-blue bg-rs-light-blue text-[13px] font-semibold text-rs-yale-blue"
          >
            Stop Responding
            <img src={ProcessBarIcon} alt="send" className="ml-2" />
          </button>
        </div>

        {errorChatMessage && (
          <div className="z-10 my-0 flex w-full justify-start p-[30px] text-left">
            <img src={WarningIcon} alt="send" className="mb-5 mr-2 " />
            <div className="text-xs">
              <div className="mb-1">
                Sorry, but it looks like {errorChatMessage}.
              </div>

              <button
                onClick={handleRetryButtonClick}
                type="button"
                className="text-rs-azure-blue"
              >
                Would you like to try again?
              </button>
            </div>
          </div>
        )}

        <ChatInput
          copilotForm={copilotForm}
          handleSubmit={handleSubmit}
          isLoading={loadingCopilot || isIterating}
        />
      </div>
    </Card>
  );
}
