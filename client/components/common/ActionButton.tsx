"use client";

import React from "react";

export default function ActionButton({
  text,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`w-full py-2.5 font-semibold rounded-lg text-white shadow-md transition-all duration-200 ${
        isDisabled
          ? "bg-[#1d4ed8]/70 cursor-not-allowed"
          : "bg-[#2563eb] hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
      } ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{text}</span>
        </span>
      ) : (
        text
      )}
    </button>
  );
}
