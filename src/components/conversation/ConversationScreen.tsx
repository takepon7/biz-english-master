"use client";

import { useConversation } from "@/hooks/useConversation";
import { getScenarioLabel } from "@/lib/scenarios";
import { ConversationHeader } from "./ConversationHeader";
import { ErrorBanner } from "./ErrorBanner";
import { InputArea } from "./InputArea";
import { MessageList } from "./MessageList";
import type { ConversationScreenProps } from "./types";

export function ConversationScreen({
  scene,
  onBack,
  showJapanese,
  onShowJapaneseChange,
  companyCulture,
  userFirstName,
  onPracticeComplete,
  onUpgradeClick,
}: ConversationScreenProps) {
  const conv = useConversation({ scene, companyCulture, onPracticeComplete });

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50 text-gray-900 min-h-[100dvh] sm:min-h-0">
      <ConversationHeader
        onBack={onBack}
        sceneTitle={getScenarioLabel(scene)}
        showJapanese={showJapanese}
        onShowJapaneseChange={onShowJapaneseChange}
      />
      <MessageList
        messages={conv.messages}
        streamingPayload={conv.streamingPayload}
        loading={conv.loading}
        showJapanese={showJapanese}
        userFirstName={userFirstName}
        onRetry={conv.handleRetryWithHint}
        chatEndRef={conv.chatEndRef}
      />
      <ErrorBanner
        error={conv.error}
        dailyLimitReached={conv.dailyLimitReached}
        quotaExceededCountdown={conv.quotaExceededCountdown}
        onUpgradeClick={onUpgradeClick}
      />
      <InputArea
        inputDraft={conv.inputDraft}
        inputValue={conv.inputValue}
        inputDisplay={conv.inputDisplay}
        hintMode={conv.hintMode}
        isListening={conv.isListening}
        isSupported={conv.isSupported}
        loading={conv.loading}
        quotaExceededCountdown={conv.quotaExceededCountdown}
        canSend={!!conv.canSend}
        transcript={conv.transcript}
        onInputChange={(value) => {
          conv.setInputDraft(value);
          if (conv.hintMode) conv.setHintMode(false);
        }}
        onSubmit={() => {
          if (conv.inputDraft.trim()) conv.sendMessage(conv.inputDraft);
        }}
        onStartListening={conv.startListening}
        onStopListening={conv.stopListening}
        onResetTranscript={conv.resetTranscript}
      />
    </div>
  );
}
