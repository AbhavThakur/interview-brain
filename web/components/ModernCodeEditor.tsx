"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

export interface EditorThemeOption {
  id: string;
  name: string;
  dotColor: string;
  bgPreview: string;
  isDark: boolean;
}

export const EDITOR_THEMES: EditorThemeOption[] = [
  {
    id: "vs-dark",
    name: "VS Code Dark Modern",
    dotColor: "#007acc",
    bgPreview: "#1e1e1e",
    isDark: true,
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    dotColor: "#7aa2f7",
    bgPreview: "#1a1b26",
    isDark: true,
  },
  {
    id: "dracula",
    name: "Dracula Gothic",
    dotColor: "#ff79c6",
    bgPreview: "#282a36",
    isDark: true,
  },
  {
    id: "one-dark",
    name: "One Dark Pro",
    dotColor: "#61afef",
    bgPreview: "#282c34",
    isDark: true,
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    dotColor: "#58a6ff",
    bgPreview: "#0d1117",
    isDark: true,
  },
  {
    id: "monokai",
    name: "Monokai Sublime",
    dotColor: "#a6e22e",
    bgPreview: "#272822",
    isDark: true,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    dotColor: "#c792ea",
    bgPreview: "#011627",
    isDark: true,
  },
  {
    id: "github-light",
    name: "GitHub Light",
    dotColor: "#0969da",
    bgPreview: "#ffffff",
    isDark: false,
  },
];

export interface ModernCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRunTests?: () => void;
  entryFunction?: string;
  defaultStarterCode: string;
  fileName?: string;
  onReset?: () => void;
}

const PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};

const CLOSERS = new Set([")", "]", "}", '"', "'", "`"]);

function formatJavaScriptCode(rawCode: string): string {
  const lines = rawCode.split("\n");
  let indentLevel = 0;
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      if (
        formattedLines.length > 0 &&
        formattedLines[formattedLines.length - 1] !== ""
      ) {
        formattedLines.push("");
      }
      continue;
    }

    let leadingClosers = 0;
    for (const c of trimmed) {
      if (c === "}" || c === "]" || c === ")") leadingClosers++;
      else break;
    }

    const currentIndent = Math.max(0, indentLevel - leadingClosers);
    formattedLines.push("  ".repeat(currentIndent) + trimmed);

    let openBraces = 0;
    let closeBraces = 0;
    let inString: string | null = null;

    for (let j = 0; j < trimmed.length; j++) {
      const char = trimmed[j];
      const prev = j > 0 ? trimmed[j - 1] : "";

      if (inString) {
        if (char === inString && prev !== "\\") inString = null;
      } else {
        if (char === '"' || char === "'" || char === "`") {
          inString = char;
        } else if (char === "/" && trimmed[j + 1] === "/") {
          break;
        } else if (char === "{" || char === "[" || char === "(") {
          openBraces++;
        } else if (char === "}" || char === "]" || char === ")") {
          closeBraces++;
        }
      }
    }

    indentLevel = Math.max(0, indentLevel + openBraces - closeBraces);
  }

  return formattedLines.join("\n");
}

export default function ModernCodeEditor({
  code,
  onChange,
  onRunTests,
  entryFunction,
  defaultStarterCode,
  fileName = "solution.js",
  onReset,
}: ModernCodeEditorProps) {
  // Theme state
  const [theme, setTheme] = useState<string>("vs-dark");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Font size & line wrap
  const [fontSize, setFontSize] = useState<number>(13);
  const [wrapLines, setWrapLines] = useState<boolean>(false);

  // Status & toasts
  const [copiedToast, setCopiedToast] = useState(false);
  const [formattedToast, setFormattedToast] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // DOM Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(
    null,
  );
  const gutterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("interview_brain_editor_theme");
      if (savedTheme && EDITOR_THEMES.some((t) => t.id === savedTheme)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrates the saved editor theme.
        setTheme(savedTheme);
      }
      const savedSize = localStorage.getItem("interview_brain_editor_fontsize");
      if (savedSize) {
        const parsed = parseInt(savedSize, 10);
        if (!isNaN(parsed) && parsed >= 11 && parsed <= 18) {
          setFontSize(parsed);
        }
      }
      const savedWrap = localStorage.getItem("interview_brain_editor_wrap");
      if (savedWrap !== null) {
        setWrapLines(savedWrap === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  // Close theme menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setThemeDropdownOpen(false);
      }
    }
    if (themeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeDropdownOpen]);

  const handleSelectTheme = (newTheme: string) => {
    setTheme(newTheme);
    setThemeDropdownOpen(false);
    try {
      localStorage.setItem("interview_brain_editor_theme", newTheme);
    } catch {
      // ignore
    }
  };

  const handleFontSizeChange = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.max(11, Math.min(18, prev + delta));
      try {
        localStorage.setItem("interview_brain_editor_fontsize", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleWrap = () => {
    setWrapLines((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("interview_brain_editor_wrap", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keep the line-number gutter aligned with the textarea's scroll position.
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (gutterRef.current) {
      gutterRef.current.scrollTop = target.scrollTop;
    }
  };

  // Cursor tracking
  const updateCursorPosition = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const textBefore = code.slice(0, ta.selectionStart);
    const lines = textBefore.split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  }, [code]);

  useLayoutEffect(() => {
    const pendingSelection = pendingSelectionRef.current;
    const textarea = textareaRef.current;
    if (!pendingSelection || !textarea) return;

    textarea.setSelectionRange(pendingSelection.start, pendingSelection.end);
    pendingSelectionRef.current = null;
    updateCursorPosition();
  }, [code, updateCursorPosition]);

  const updateCodeWithSelection = (
    newCode: string,
    start: number,
    end = start,
  ) => {
    pendingSelectionRef.current = { start, end };
    onChange(newCode);
  };

  // Keyboard handlers: indentation, auto-pairing, auto-closing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current;
    if (!ta) return;

    // Run tests shortcut: Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRunTests?.();
      return;
    }

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const hasSelection = start !== end;

    // Auto-pairing / wrapping selected text with brackets & quotes
    if (PAIRS[e.key]) {
      const closer = PAIRS[e.key];
      if (hasSelection) {
        e.preventDefault();
        const selectedText = code.substring(start, end);
        const newCode =
          code.substring(0, start) +
          e.key +
          selectedText +
          closer +
          code.substring(end);
        updateCodeWithSelection(newCode, start + 1, end + 1);
        return;
      } else {
        // If not selected, check if user is typing a quote right before the same quote
        if (
          (e.key === '"' || e.key === "'" || e.key === "`") &&
          code[start] === e.key
        ) {
          e.preventDefault();
          ta.selectionStart = ta.selectionEnd = start + 1;
          updateCursorPosition();
          return;
        }

        // Insert pair and place cursor inside
        e.preventDefault();
        const newCode =
          code.substring(0, start) + e.key + closer + code.substring(end);
        updateCodeWithSelection(newCode, start + 1);
        return;
      }
    }

    // Step-over closing bracket if already present right after cursor
    if (CLOSERS.has(e.key) && !hasSelection) {
      if (code[start] === e.key) {
        e.preventDefault();
        ta.selectionStart = ta.selectionEnd = start + 1;
        updateCursorPosition();
        return;
      }
    }

    // Backspace: delete empty pairs (e.g. () -> backspace -> deletes both)
    if (e.key === "Backspace" && !hasSelection && start > 0) {
      const prevChar = code[start - 1];
      const nextChar = code[start];
      if (PAIRS[prevChar] && PAIRS[prevChar] === nextChar) {
        e.preventDefault();
        const newCode =
          code.substring(0, start - 1) + code.substring(start + 1);
        updateCodeWithSelection(newCode, start - 1);
        return;
      }
    }

    // Tab key: indent 2 spaces (or dedent with Shift+Tab)
    if (e.key === "Tab") {
      e.preventDefault();
      if (hasSelection) {
        // Multi-line indent/dedent
        const startLineIndex = code.substring(0, start).lastIndexOf("\n") + 1;
        let endLineIndex = code.indexOf("\n", end);
        if (endLineIndex === -1) endLineIndex = code.length;

        const targetChunk = code.substring(startLineIndex, endLineIndex);
        const lines = targetChunk.split("\n");

        let modifiedLines: string[];
        if (e.shiftKey) {
          modifiedLines = lines.map((line) =>
            line.startsWith("  ")
              ? line.slice(2)
              : line.startsWith(" ")
                ? line.slice(1)
                : line,
          );
        } else {
          modifiedLines = lines.map((line) => "  " + line);
        }

        const newChunk = modifiedLines.join("\n");
        const newCode =
          code.substring(0, startLineIndex) +
          newChunk +
          code.substring(endLineIndex);
        updateCodeWithSelection(
          newCode,
          startLineIndex,
          startLineIndex + newChunk.length,
        );
      } else {
        if (e.shiftKey) {
          // Dedent previous 2 spaces
          const before = code.slice(0, start);
          if (before.endsWith("  ")) {
            const newCode = code.slice(0, start - 2) + code.slice(end);
            updateCodeWithSelection(newCode, start - 2);
          }
        } else {
          // Indent 2 spaces
          const newCode = code.substring(0, start) + "  " + code.substring(end);
          updateCodeWithSelection(newCode, start + 2);
        }
      }
      return;
    }

    // Enter key: Smart auto-indent & expand brace pairs
    if (e.key === "Enter") {
      const prevChar = start > 0 ? code[start - 1] : "";
      const nextChar = code[start] || "";

      // If pressing Enter between { and } or [ and ]
      if (
        (prevChar === "{" && nextChar === "}") ||
        (prevChar === "[" && nextChar === "]")
      ) {
        e.preventDefault();
        const currentLine = code.slice(0, start).split("\n").pop() || "";
        const baseIndent = currentLine.match(/^\s*/)?.[0] || "";
        const innerIndent = baseIndent + "  ";

        const insertion = "\n" + innerIndent + "\n" + baseIndent;
        const newCode =
          code.substring(0, start) + insertion + code.substring(end);
        updateCodeWithSelection(newCode, start + 1 + innerIndent.length);
        return;
      }

      // Normal Enter: retain previous indentation + indent if line ends with { [ ( :
      const currentLine = code.slice(0, start).split("\n").pop() || "";
      const baseIndent = currentLine.match(/^\s*/)?.[0] || "";
      const shouldExtraIndent = /[{[(:]\s*$/.test(currentLine);
      const extraIndent = shouldExtraIndent ? "  " : "";

      e.preventDefault();
      const newCode =
        code.substring(0, start) +
        "\n" +
        baseIndent +
        extraIndent +
        code.substring(end);
      updateCodeWithSelection(
        newCode,
        start + 1 + baseIndent.length + extraIndent.length,
      );
      return;
    }
  };

  // Format code action
  const handleFormatCode = () => {
    try {
      const formatted = formatJavaScriptCode(code);
      onChange(formatted);
      setFormattedToast(true);
      setTimeout(() => setFormattedToast(false), 2000);
    } catch {
      // ignore
    }
  };

  // Copy code action
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Reset code action
  const handleResetCode = () => {
    if (
      window.confirm(
        "Reset code to starter template? Your current edits will be lost.",
      )
    ) {
      if (onReset) {
        onReset();
      } else {
        onChange(defaultStarterCode);
      }
    }
  };

  const lineCount = useMemo(() => {
    return Math.max(code.split("\n").length, 14);
  }, [code]);

  const activeThemeMeta = useMemo(() => {
    return EDITOR_THEMES.find((t) => t.id === theme) || EDITOR_THEMES[0];
  }, [theme]);

  // Keep cursor, gutter, and text rows on the exact same integer line height to eliminate subpixel drift.
  const lineHeightPx = Math.round(fontSize * 1.6);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full min-h-0 select-text overflow-hidden editor-theme-${theme} theme-container transition-colors duration-200`}
    >
      {/* 1. IDE Top Title & Action Bar */}
      <div className="editor-header h-10 px-3 border-b flex items-center justify-between shrink-0 theme-gutter border-white/10 select-none">
        {/* Left: macOS dots, Tab pill & breadcrumb */}
        <div className="editor-header-title flex items-center gap-2.5 min-w-0">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5 mr-1 hidden sm:flex">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block opacity-85 hover:opacity-100 transition-opacity" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block opacity-85 hover:opacity-100 transition-opacity" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block opacity-85 hover:opacity-100 transition-opacity" />
          </div>

          {/* Active File Tab Pill */}
          <div className="flex items-center gap-1.5 min-w-0 max-w-full px-2.5 py-1 rounded-t-md text-xs font-mono font-medium border-t-2 border-primary bg-black/25 text-white/90 shadow-sm">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px] flex items-center justify-center border border-amber-500/30">
              JS
            </span>
            <span className="flex-1 min-w-0 truncate max-w-[140px] sm:max-w-none">
              {fileName}
            </span>
          </div>

          {/* Entry Function Breadcrumb */}
          {entryFunction && (
            <div className="text-[11px] font-mono text-white/40 hidden md:flex items-center gap-1">
              <span>›</span>
              <span className="text-white/60">{entryFunction}()</span>
            </div>
          )}
        </div>

        {/* Right: Theme picker, font size, formatting & actions */}
        <div className="editor-header-actions flex items-center justify-end gap-1.5 sm:gap-2">
          {/* Theme Selector Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setThemeDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-white/[0.06] hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
              title="Change Editor Theme"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                style={{ backgroundColor: activeThemeMeta.dotColor }}
              />
              <span className="hidden sm:inline text-[11px]">
                {activeThemeMeta.name}
              </span>
              <span className="text-[9px] opacity-60">▼</span>
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 py-1 bg-[#13161f] border border-white/15 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-md">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-wider border-b border-white/5">
                  Select Theme
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                  {EDITOR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTheme(t.id)}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                        theme === t.id
                          ? "text-primary font-semibold bg-white/[0.04]"
                          : "text-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span>{t.name}</span>
                      </div>
                      {theme === t.id && (
                        <span className="text-primary text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center border border-white/10 rounded bg-white/[0.04] text-[11px]">
            <button
              onClick={() => handleFontSizeChange(-1)}
              className="px-1.5 py-0.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-l"
              title="Decrease font size"
            >
              A-
            </button>
            <span className="px-1 font-mono text-[10px] text-white/70 min-w-[28px] text-center">
              {fontSize}px
            </span>
            <button
              onClick={() => handleFontSizeChange(1)}
              className="px-1.5 py-0.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-r"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Wrap Toggle */}
          <button
            onClick={handleToggleWrap}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors hidden sm:block ${
              wrapLines
                ? "bg-primary/20 border-primary/40 text-primary font-medium"
                : "bg-white/[0.04] border-white/10 text-white/60 hover:text-white"
            }`}
            title="Toggle word wrap"
          >
            {wrapLines ? "Wrap: On" : "Wrap: Off"}
          </button>

          {/* Format Code */}
          <button
            onClick={handleFormatCode}
            className="text-[11px] px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
            title="Clean Indentation & Format Code"
          >
            <span>🧹</span>
            <span className="hidden md:inline">
              {formattedToast ? "Formatted!" : "Format"}
            </span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="text-[11px] px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
            title="Copy Code to Clipboard"
          >
            <span>{copiedToast ? "✓" : "📋"}</span>
            <span className="hidden md:inline">
              {copiedToast ? "Copied" : "Copy"}
            </span>
          </button>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            className="text-[11px] px-2 py-1 rounded bg-white/[0.05] hover:bg-rose-500/20 text-white/60 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-colors flex items-center gap-1"
            title="Reset to Starter Boilerplate"
          >
            <span>↺</span>
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Editor Core Viewport (Gutter + Overlaid Highlight & Textarea) */}
      <div className="flex-1 relative flex min-h-0 overflow-hidden editor-viewport">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="w-12 py-3 pr-2 pl-1 select-none text-right font-mono text-xs theme-gutter border-r overflow-hidden shrink-0"
          style={{
            lineHeight: `${lineHeightPx}px`,
            fontSize: `${fontSize}px`,
          }}
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const lineNum = i + 1;
            const isActive = lineNum === cursorPos.line;
            return (
              <div
                key={i}
                className={`transition-colors ${
                  isActive ? "theme-gutter-active" : "opacity-40"
                }`}
                style={{ height: `${lineHeightPx}px` }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Editor Main Canvas */}
        <div className="flex-1 relative h-full min-h-0 overflow-hidden">
          {/* Active Line Highlight Strip */}
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all duration-75"
            style={{
              top: `${12 + (cursorPos.line - 1) * lineHeightPx}px`,
              height: `${lineHeightPx}px`,
              backgroundColor: "var(--editor-active-line)",
            }}
          />

          {/* Single text surface keeps typed glyphs aligned with the native caret. */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeightPx}px`,
              whiteSpace: wrapLines ? "pre-wrap" : "pre",
              wordBreak: wrapLines ? "break-word" : "normal",
            }}
            className="absolute inset-0 p-3 font-mono bg-transparent resize-none outline-none border-none overflow-auto custom-scrollbar theme-textarea"
            placeholder="// Write your JavaScript solution here..."
          />
        </div>
      </div>

      {/* 3. IDE Bottom Status Bar */}
      <div className="h-6 px-3 border-t flex items-center justify-between shrink-0 theme-gutter border-white/10 text-[10px] font-mono select-none">
        {/* Left: Cursor stats, line count, encoding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white/70">
            <span>Ln {cursorPos.line},</span>
            <span>Col {cursorPos.col}</span>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          <div className="text-white/40 hidden sm:block">
            {code.split("\n").length} lines · {code.length} chars
          </div>

          <div className="h-3 w-px bg-white/10 hidden md:block" />

          <div className="text-white/40 hidden md:block">Spaces: 2 · UTF-8</div>
        </div>

        {/* Right: Language, theme info, and shortcut prompt */}
        <div className="flex items-center gap-3">
          <div className="text-primary/90 font-medium hidden sm:flex items-center gap-1">
            <span>⚡</span>
            <span>Press ⌘↵ to Run</span>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          <div className="text-white/60 flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: activeThemeMeta.dotColor }}
            />
            <span className="hidden xs:inline">{activeThemeMeta.name}</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          <div className="text-amber-400/90 font-semibold">
            JavaScript (ES2024)
          </div>
        </div>
      </div>
    </div>
  );
}
