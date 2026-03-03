import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatMessages } from "@/data/mockData";

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [alert, setAlert] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectContact = (text: string) => {
    const phoneRegex = /(\+?\d[\d\s-]{7,})/;
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    return phoneRegex.test(text) || emailRegex.test(text);
  };

  const maskContact = (text: string) => {
    return text
      .replace(/(\+?\d[\d\s-]{7,})/g, "****masked****")
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, "****masked****");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    if (detectContact(input)) {
      setAlert("Contact sharing is not permitted. All communication must happen within Naapio for your protection.");
      const maskedText = maskContact(input);
      setMessages([...messages, { id: messages.length + 1, sender: "customer", text: maskedText, time: "Now" }]);
    } else {
      setMessages([...messages, { id: messages.length + 1, sender: "customer", text: input, time: "Now" }]);
    }
    setInput("");

    // Mock vendor reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "vendor", text: "Thanks for the update! I'll keep you posted on the progress.", time: "Now" },
      ]);
    }, 2000);
  };

  return (
    <div className="max-w-3xl h-[calc(100vh-180px)] flex flex-col">
      <button onClick={() => navigate("/dashboard/view-bids")} className="flex items-center gap-2 text-accent font-sans font-medium text-sm mb-4 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Bids
      </button>

      <div className="bg-card rounded-xl border border-border p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-serif font-bold text-primary">3</span>
        </div>
        <div>
          <h3 className="font-sans font-semibold text-foreground text-sm">Artisan #3</h3>
          <p className="text-xs text-muted-foreground font-sans">Gold Tier • 4.9★ • Bangalore</p>
        </div>
      </div>

      {alert && (
        <div className="bg-warning-light border border-warning/30 rounded-xl p-3 mb-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-xs font-sans text-foreground">{alert}</p>
          <button onClick={() => setAlert("")} className="ml-auto text-muted-foreground hover:text-foreground text-xs">✕</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-secondary rounded-xl p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl font-sans text-sm ${
              msg.sender === "customer"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border text-foreground rounded-bl-md"
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "customer" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="icon" className="flex-shrink-0">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="font-sans"
        />
        <Button variant="gold" size="icon" onClick={handleSend} className="flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
