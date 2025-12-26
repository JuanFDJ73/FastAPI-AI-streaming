import { useState } from "react";
import { apiPost } from "../api/api";
import "./ChatBox.css";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setLoading(true);
    try {
      const res = await apiPost("/chat", { message: userMessage }, { auth: true });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error al obtener respuesta." },
      ]);
    } finally {
      setLoading(false);
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