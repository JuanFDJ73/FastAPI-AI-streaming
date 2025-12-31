import { useRef, useState } from "react";
import { apiPostStream } from "../api/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ChatBox.css";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    // Cancelar stream anterior si existe
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const reader = await apiPostStream(
        "/chat/stream",
        { message: userMessage },
        { auth: true, signal: controller.signal }
      );

      const decoder = new TextDecoder("utf-8");

      // Función para fusionar fragmentos de texto con superposición
      const mergeChunk = (existing, chunk) => {
        if (!existing) return chunk;

        // Evitar duplicados completos
        if (chunk === existing) return existing;
        if (chunk.includes(existing)) return chunk;
        if (existing.includes(chunk)) return existing;

        // Buscar superposición
        const maxOverlap = Math.min(chunk.length, existing.length);
        for (let i = maxOverlap; i > 0; i--) {
          if (existing.endsWith(chunk.slice(0, i))) {
            return existing + chunk.slice(i);
          }
        }

        // Concatenar SIN romper saltos de línea
        return existing + chunk;
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          last.content = mergeChunk(last.content, chunk);
          return updated;
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content =
            "Streaming interrumpido por error.";
          return updated;
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="chat-message-header">
              <strong>{m.role === "user" ? "Tú" : "IA"}:</strong>
            </div>
            <div className="chat-message-content">
              {m.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : (
                <span>{m.content}</span>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="chat-typing"><em>Escribiendo...</em></p>}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button className="chat-send" type="submit">Enviar</button>
      </form>
    </div>
  );
}