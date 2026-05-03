"use client";

interface UserMessageProps {
  text: string;
}

export function UserMessage({ text }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div
        data-testid="user-bubble"
        className="max-w-[85%] rounded-xl rounded-br-md bg-sky-600 px-3 py-2 text-white shadow-sm"
      >
        <p className="text-sm leading-snug">{text}</p>
      </div>
    </div>
  );
}
