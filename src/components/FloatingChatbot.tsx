"use client";
import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, ChevronRight, ArrowLeft, Copy, Check, MessageSquare } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { servicesData } from "@/data/services"; 

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! Main **TaxAdhaar AI** hoon. Main aapki GST aur ITR filing mein madad kar sakta hoon.' }
  ]);
  const [showMainCategories, setShowMainCategories] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // Typing state
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // professional WhatsApp Formatter
  const shareOnWhatsApp = (text: string) => {
    let formattedText = text
      .replace(/###/g, '📌')       // Heading ko Pin emoji banaya
      .replace(/\*\*/g, '*')       // Bold ko WhatsApp bold (*) mein convert kiya
      .replace(/\* /g, '✅ ')      // Bullet points ko Checkmark banaya
      .replace(/__/g, '_');        // Italics handling

    const url = `https://wa.me/?text=${encodeURIComponent("*TaxAdhaar AI Notification*\n\n" + formattedText + "\n\n_Powered by Aimgrit_")}`;
    window.open(url, '_blank');
  };

  const handleCopy = (text: string, index: number) => {
    const cleanText = text.replace(/[#*]/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { role: 'client', text: messageText }]);
    setInput("");
    setShowMainCategories(false);
    setIsTyping(true); // Typing start

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: "Service temporary busy. Please try later." }]);
    } finally {
      setIsTyping(false); // Typing stop
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-[#1e3a8a] text-white p-4 rounded-full shadow-2xl flex items-center gap-2">
          <span className="font-bold">TaxAdhaar AI</span>
          <Bot size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[360px] sm:w-[400px] h-[550px] rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#1e3a8a] p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot size={24} />
              <div>
                <h3 className="font-bold text-sm leading-tight">TaxAdhaar Support</h3>
                <span className="text-[10px] text-blue-200">24/7 Tax Expert AI</span>
              </div>
            </div>
            <X onClick={() => setIsOpen(false)} className="cursor-pointer opacity-70 hover:opacity-100" />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#fcfdfe] text-black">
            {messages.map((m, i) => (
              <div key={i} className={`${m.role === 'client' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl text-[13px] shadow-sm max-w-[88%] ${
                  m.role === 'client' ? 'bg-[#1e3a8a] text-white' : 'bg-white text-gray-800 border'
                }`}>
                  <div className="prose prose-sm prose-blue max-w-none ">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>

                  {m.role === 'bot' && m.text.includes('*') && (
                    <div className="mt-3 pt-3 border-t flex gap-4">
                      <button onClick={() => handleCopy(m.text, i)} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                        {copiedIndex === i ? <Check size={12}/> : <Copy size={12}/>} {copiedIndex === i ? "Copied" : "Copy List"}
                      </button>
                      <button onClick={() => shareOnWhatsApp(m.text)} className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                        <MessageSquare size={12}/> WhatsApp Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* TYPING ANIMATION */}
            {isTyping && (
              <div className="text-left">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            {showMainCategories && (
              <div className="grid grid-cols-1 gap-2 mt-2 ">
                {Object.keys(servicesData).map((key) => (
                  <button key={key} onClick={() => sendMessage(servicesData[key].title)} className="flex items-center justify-between bg-white border p-3 rounded-xl text-[13px] hover:bg-blue-50 transition-all group">
                    <div className="flex items-center gap-2"><span>{servicesData[key].icon}</span> {servicesData[key].title}</div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            {!showMainCategories && (
               <button onClick={() => setShowMainCategories(true)} className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mb-2">
                 <ArrowLeft size={12} /> View Services
               </button>
            )}
            <div className="flex gap-2">
              <input className="flex-1 text-[13px] bg-gray-50 border p-3 rounded-2xl outline-none text-black" placeholder="Likhein yahan..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
              <button onClick={() => sendMessage()} className="bg-[#1e3a8a] text-white p-3 rounded-2xl"><Send size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}