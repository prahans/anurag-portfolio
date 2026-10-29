"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from "react";
import { ArrowUpRight, Check, Code2, Plus, Sprout, X } from "lucide-react";
import "./workspace-panel.css";

type WorkspacePanelProps = {
  kind: "laptop" | "notebook" | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

/** A separate interactive example; the screen pixels in the artwork stay intact. */
export function WorkspacePanel({ kind, onClose, returnFocusRef }: WorkspacePanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPointerDown = useRef(false);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (kind && !dialog.open) dialog.showModal();
    if (!kind && dialog.open) dialog.close();
  }, [kind]);

  function isBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  function closePanel() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className={`workspace-panel${kind === "notebook" ? " workspace-panel--notebook" : ""}`}
      aria-labelledby={`${id}-title`}
      aria-describedby={kind === "laptop" ? `${id}-description` : undefined}
      onClose={() => {
        onClose();
        returnFocusRef.current?.focus({ preventScroll: true });
      }}
      onCancel={(event) => { event.preventDefault(); closePanel(); }}
      onPointerDown={(event) => { backdropPointerDown.current = isBackdrop(event); }}
      onClick={(event) => {
        if (backdropPointerDown.current && isBackdrop(event)) closePanel();
        backdropPointerDown.current = false;
      }}
    >
      <header className="workspace-panel-header">
        <span className="workspace-panel-eyebrow">{kind === "notebook" ? "FROM MY NOTEBOOK" : "A SMALL WORKSPACE DEMO"}</span>
        <button type="button" className="workspace-panel-close" onClick={closePanel} aria-label={kind === "notebook" ? "Close note" : "Close workspace"}>
          <X size={19} aria-hidden="true" />
        </button>
      </header>
      {kind === "notebook" ? (
        <div className="workspace-notebook-content">
          <h2 id={`${id}-title`}>A little note from me</h2>
          <div className="workspace-notebook-rule" aria-hidden="true" />
          <p>I enjoy building useful things, learning as I go, and paying attention to the details. Good software isn&apos;t just about making something work — it&apos;s about making someone&apos;s experience a little better.</p>
          <p className="workspace-notebook-signoff">Still learning. Always building. ☕</p>
        </div>
      ) : kind === "laptop" ? (
        <>
          <h2 id={`${id}-title`}>Explore my workspace</h2>
          <p id={`${id}-description`} className="workspace-panel-description">An interactive example, inspired by the scene.</p>
          <WorkspaceTabs />
        </>
      ) : null}
    </dialog>
  );
}

function WorkspaceTabs() {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const codeRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    let nextTab: "code" | "preview";
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") nextTab = activeTab === "code" ? "preview" : "code";
    else if (event.key === "Home") nextTab = "code";
    else if (event.key === "End") nextTab = "preview";
    else return;
    event.preventDefault();
    setActiveTab(nextTab);
    (nextTab === "code" ? codeRef : previewRef).current?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label="Workspace example" className="workspace-tabs">
        <button ref={codeRef} type="button" role="tab" id={`${id}-code-tab`} aria-controls={`${id}-code`} aria-selected={activeTab === "code"} tabIndex={activeTab === "code" ? 0 : -1} onClick={() => setActiveTab("code")} onKeyDown={handleTabKey}>
          <Code2 size={15} aria-hidden="true" /> Code
        </button>
        <button ref={previewRef} type="button" role="tab" id={`${id}-preview-tab`} aria-controls={`${id}-preview`} aria-selected={activeTab === "preview"} tabIndex={activeTab === "preview" ? 0 : -1} onClick={() => setActiveTab("preview")} onKeyDown={handleTabKey}>
          <ArrowUpRight size={15} aria-hidden="true" /> Preview
        </button>
      </div>
      <div id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-code-tab`} tabIndex={0} hidden={activeTab !== "code"} className="workspace-tab-content">
        <div className="workspace-code-file"><span aria-hidden="true" /><span>little-ideas.tsx</span><span>TypeScript / React</span></div>
        <pre className="workspace-code"><code><span className="code-keyword">import</span>{" { useState } "}<span className="code-keyword">from</span>{" "}<span className="code-string">&quot;react&quot;</span>{";\n\n"}<span className="code-keyword">export function</span>{" "}<span className="code-function">LittleIdeas</span>{"() {\n  "}<span className="code-keyword">const</span>{" [ideas, setIdeas] =\n    "}<span className="code-function">useState</span>{"<"}<span className="code-type">number</span>{">("}<span className="code-number">1</span>{");\n\n  "}<span className="code-keyword">return</span>{" (\n    <"}<span className="code-tag">button</span>{"\n      "}<span className="code-property">onClick</span>{"={() => "}<span className="code-function">setIdeas</span>{"(ideas + "}<span className="code-number">1</span>{")}\n    >\n      {ideas} ideas to explore\n    </"}<span className="code-tag">button</span>{">\n  );\n}"}</code></pre>
        <p className="workspace-code-caption">Small ideas. A little code. Something useful.</p>
      </div>
      <div id={`${id}-preview`} role="tabpanel" aria-labelledby={`${id}-preview-tab`} tabIndex={0} hidden={activeTab !== "preview"} className="workspace-tab-content">
        <IdeaPreview />
      </div>
    </>
  );
}

function IdeaPreview() {
  const [ideaCount, setIdeaCount] = useState(1);

  return (
    <div className="workspace-preview">
      <div className="workspace-preview-top"><span><Sprout size={16} aria-hidden="true" /> little ideas</span><span className="workspace-demo-status"><i aria-hidden="true" /> Demo is live</span></div>
      <h3>A little closer<br />to something good.</h3>
      <p>A small place to turn curiosity into a next step.</p>
      <div className="workspace-preview-cards">
        <div><span className="workspace-preview-icon"><Sprout size={18} aria-hidden="true" /></span><strong>Make room for ideas</strong><span>Start with a useful question.</span></div>
        <div><span className="workspace-preview-icon"><Check size={18} aria-hidden="true" /></span><strong>Build, learn, repeat</strong><span>One thoughtful detail at a time.</span></div>
      </div>
      <div className="workspace-preview-bottom">
        <span className="workspace-idea-count" role="status" aria-live="polite">{ideaCount} {ideaCount === 1 ? "idea" : "ideas"} to explore</span>
        <button type="button" onClick={() => setIdeaCount((count) => count + 1)}><Plus size={15} aria-hidden="true" /> Add an idea</button>
      </div>
    </div>
  );
}
