"use client";

import type { RefObject } from "react";
import { ResponseSkeleton } from "@/components/ResponseSkeleton";
import { AssistantMessage } from "./AssistantMessage";
import { StreamingMessage } from "./StreamingMessage";
import { UserMessage } from "./UserMessage";
import type { AssistantMessagePayload, ChatMessage } from "./types";

interface MessageListProps {
  messages: ChatMessage[];
  streamingPayload: Partial<AssistantMessagePayload> | null;
  loading: boolean;
  showJapanese: boolean;
  userFirstName?: string | null;
  onRetry: (refactoredText: string) => void;
  chatEndRef: RefObject<HTMLDivElement | null>;
}

export function MessageList({
  messages,
  streamingPayload,
  loading,
  showJapanese,
  userFirstName,
  onRetry,
  chatEndRef,
}: MessageListProps) {
  return (
    <section className="min-h-0 flex-1 flex-grow overflow-y-auto overflow-x-hidden bg-gray-50 px-3 py-2 overscroll-contain">
      {userFirstName && (
        <p className="mb-2 text-sm text-gray-600" data-testid="welcome-message">
          Welcome, {userFirstName}!
        </p>
      )}
      <div className="min-h-0 space-y-2">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} text={msg.text} />
          ) : (
            <AssistantMessage
              key={msg.id}
              payload={msg.payload}
              showJapanese={showJapanese}
              showRetryButton={
                messages.length >= 2 && messages[messages.length - 1].id === msg.id
              }
              onRetry={onRetry}
            />
          )
        )}

        {loading && !streamingPayload?.nextDialogue ? (
          <div className="flex justify-start">
            <ResponseSkeleton />
          </div>
        ) : streamingPayload ? (
          <StreamingMessage payload={streamingPayload} showJapanese={showJapanese} />
        ) : null}
      </div>
      <div ref={chatEndRef} aria-hidden />
    </section>
  );
}
