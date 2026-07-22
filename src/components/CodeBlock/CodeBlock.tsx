import "./CodeBlock.css";

/** Figma 9251:3979 (Code Block) — monospace G-code preview on the tertiary background. */
export function CodeBlock({ lines }: { lines: readonly string[] }) {
  return (
    <pre className="code-block">
      <code>{lines.join("\n")}</code>
    </pre>
  );
}
