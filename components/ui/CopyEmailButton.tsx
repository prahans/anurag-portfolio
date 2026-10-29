"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyStatus = "idle" | "copied" | "error";

// Clipboard writes require browser permission and usually a secure context.
// The selection fallback supports older browsers and local testing setups.
function copyWithSelection(email: string): boolean {
  const input = document.createElement("textarea");
  input.value = email;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    input.remove();
  }
}

export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeout.current !== null) clearTimeout(resetTimeout.current);
    };
  }, []);

  async function handleCopy() {
    if (resetTimeout.current !== null) clearTimeout(resetTimeout.current);
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        // Try the selection fallback below.
      }
    }

    if (!copied) copied = copyWithSelection(email);
    setStatus(copied ? "copied" : "error");
    if (copied) {
      resetTimeout.current = setTimeout(() => {
        setStatus("idle");
        resetTimeout.current = null;
      }, 2400);
    }
  }

  return (
    <>
      <button
        type="button"
        className="contact-copy-button"
        data-status={status}
        onClick={handleCopy}
        aria-label="Copy email address"
        data-tooltip={status === "copied" ? "Copied!" : status === "error" ? "Couldn't copy" : "Copy email address"}
      >
        {status === "copied" ? <Check size={19} aria-hidden="true" /> : <Copy size={19} aria-hidden="true" />}
      </button>
      {status !== "idle" && (
        <span
          className={status === "error" ? "contact-copy-feedback contact-copy-feedback--error" : "sr-only"}
          role="status"
          aria-live="polite"
        >
          {status === "copied"
            ? "Email address copied to clipboard."
            : "Copy was blocked. You can select the email address above and copy it manually."}
        </span>
      )}
    </>
  );
}
