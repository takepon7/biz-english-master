import type { SceneId } from "@/lib/scenarios";
import type { CompanyCultureId } from "@/lib/companyCulture";

export type { SceneId };

export interface AssistantMessagePayload {
  nextDialogue: string;
  nextJp?: string;
  refactored?: string;
  refactoredJp?: string;
  note?: string;
  analysis?: string;
}

export interface CoachResponse extends AssistantMessagePayload {
  refactoredEnglish: string;
  coachingNote: string;
  japanese_translation?: { refactored: string; nextDialogue: string };
}

export interface PracticeRecord {
  scenario: SceneId;
  userInput: string;
  refactoredText: string;
  coachingNote: string;
}

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; payload: AssistantMessagePayload };

export interface ConversationScreenProps {
  scene: SceneId;
  onBack?: () => void;
  showJapanese: boolean;
  onShowJapaneseChange?: (value: boolean) => void;
  companyCulture?: CompanyCultureId;
  userFirstName?: string | null;
  onPracticeComplete?: (record: PracticeRecord) => void;
  /** 回数制限で 429 のときにアップグレード案内を押したときのコールバック（例: サイドバーを開く） */
  onUpgradeClick?: () => void;
}
