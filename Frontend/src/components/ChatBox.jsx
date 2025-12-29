import { useRef, useState } from "react";
import { apiPostStream } from "../api/api";
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

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content += chunk;
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
          <p key={i} className={`chat-message ${m.role}`}>
            <strong>{m.role === "user" ? "Tú" : "IA"}:</strong> {m.content}
          </p>
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