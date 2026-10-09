import React, { useState } from 'react';
import { 
  Bot, Send, User, AlertOctagon, PhoneCall, 
  Globe, Mic, MicOff, Shield, RefreshCw
} from 'lucide-react';
import { LanguageCode, CityName } from '../types';
import { api } from '../services/api';

interface MedicalChatbotProps {
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  currentCity: CityName;
  onOpenEmergency: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isEmergency?: boolean;
  action?: string;
  engine?: string;
  timestamp: string;
}

export const MedicalChatbot: React.FC<MedicalChatbotProps> = ({
  currentLanguage,
  onChangeLanguage,
  currentCity,
  onOpenEmergency,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: {
        en: `Hello! I am resQPath Health Assistant. I can help you understand symptoms, prepare questions for your doctor, and find genuine care in ${currentCity}. What symptoms are you experiencing?`,
        te: `నమస్కారం! నేను resQPath హెల్త్ అసిస్టెంట్. ${currentCity} లో మీ లక్షణాలను అర్థం చేసుకోవడానికి మరియు సరైన వైద్యుడిని కనుగొనడానికి నేను సహాయం చేయగలను. మీ సమస్య ఏమిటి?`,
        hi: `नमस्ते! मैं resQPath स्वास्थ्य सहायक हूँ। मैं ${currentCity} में आपके लक्षणों को समझने और सही डॉक्टर या अस्पताल खोजने में सहायता कर सकता हूँ। बताएं आपको क्या तकलीफ़ है?`,
        kn: `ನಮಸ್ಕಾರ! ನಾನು resQPath ಆರೋಗ್ಯ ಸಹಾಯಕ. ${currentCity} ನಲ್ಲಿ ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಸರಿಯಾದ ಚಿಕಿತ್ಸೆಯನ್ನು ಕಂಡುಹಿಡಿಯಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.`,
        ta: `வணக்கம்! நான் resQPath மருத்துவ உதவியாளர். ${currentCity}-ல் உங்கள் அறிகுறிகளைப் புரிந்துகொள்ளவும் சரியான மருத்துவரை அணுகவும் நான் வழிகாட்டுகிறேன்.`
      }[currentLanguage],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const sampleQueries: Record<LanguageCode, string[]> = {
    en: ["Mild fever and body pain for 2 days", "Sudden sharp chest pain", "Affordable diabetes medicine near me"],
    te: ["2 రోజులుగా జ్వరం మరియు ఒంటి నొప్పులు", "గుండెల్లో తీవ్రమైన నొప్పి వస్తోంది", "సమీపంలోని జన ఔషధి కేంద్రం"],
    hi: ["दो दिन से हल्का बुखार और सिरदर्द", "सीने में अचानक तेज दर्द", "सस्ती शुगर की दवा कहाँ मिलेगी?"],
    kn: ["ಎರಡು ದಿನಗಳಿಂದ ಜ್ವರ ಮತ್ತು ಮೈಕೈ ನೋವು", "ಎದೆಯಲ್ಲಿ ತೀವ್ರವಾದ ನೋವು ಬರ್ತಾ ಇದೆ", "ಸಮೀಪದ ಜನೌಷಧಿ ಕೇಂದ್ರ"],
    ta: ["2 நாட்களாக மிதமான காய்ச்சல்", "திடீர் கடுமையான நெஞ்சு வலி", "அருகிலுள்ள மலிவு விலை மருந்தகம்"],
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    try {
      const res = await api.sendChatQuery(text, currentLanguage, currentCity);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.response,
        isEmergency: res.emergency_flag,
        action: res.recommended_action,
        engine: res.ai_engine,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Safe local clinical fallback
      const lower = text.toLowerCase();
      const isRedFlag = lower.includes('chest pain') || lower.includes('గుండె') || lower.includes('दर्द') || lower.includes('breath');

      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: isRedFlag 
          ? `EMERGENCY ALERT: Severe symptoms detected. Please call 108 or visit Government General Hospital (GGH) ${currentCity} Casualty immediately.`
          : `For mild symptoms in ${currentCity}, stay well hydrated, rest, and visit the Outpatient Department (OPD) at GGH ${currentCity} or a local Primary Health Centre (PHC).`,
        isEmergency: isRedFlag,
        engine: 'Rule-Based Offline Clinical Safety Protocol',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Browser Speech-to-Text Support
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langCodes: Record<LanguageCode, string> = {
      en: 'en-IN', te: 'te-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN'
    };
    recognition.lang = langCodes[currentLanguage] || 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMsg(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col h-[650px]">
        
        {/* Chatbot Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-700 via-blue-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  resQPath Multilingual Triage Assistant
                </h3>
                <span className="text-[10px] bg-emerald-500/80 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live Triage
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Supporting Telugu, Hindi, English, Kannada & Tamil • Active in {currentCity}
              </p>
            </div>
          </div>

          {/* Chat Language Selector Dropdown */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-200" />
            <select
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-2.5 py-1.5 font-bold focus:outline-hidden"
            >
              <option value="en" className="text-slate-900">English</option>
              <option value="te" className="text-slate-900">తెలుగు (Telugu)</option>
              <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              <option value="kn" className="text-slate-900">ಕನ್ನಡ (Kannada)</option>
              <option value="ta" className="text-slate-900">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        {/* Chat Message Scroll Window */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : msg.isEmergency
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : msg.isEmergency
                    ? 'bg-red-50 border-2 border-red-300 text-red-950 rounded-tl-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                {/* Emergency Red Flag Alert Card */}
                {msg.isEmergency && (
                  <div className="mb-2 pb-2 border-b border-red-200 flex items-center justify-between">
                    <span className="font-bold text-red-700 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                      <AlertOctagon className="w-4 h-4 text-red-600 animate-bounce" />
                      Critical Emergency Warning
                    </span>
                    <button
                      onClick={onOpenEmergency}
                      className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>DIAL 108 / 112</span>
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-line">{msg.text}</div>

                <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                  <span>{msg.engine || 'resQPath Clinical Safety'}</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-10">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing symptoms under clinical triage safety rules...</span>
            </div>
          )}
        </div>

        {/* Sample Prompt Chips */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Try:</span>
          {sampleQueries[currentLanguage]?.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sample)}
              className="text-[11px] font-medium bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition ${
              isListening 
                ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Speech Input (Voice)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={`Describe symptoms in ${currentLanguage.toUpperCase()} (e.g. fever, headache, chest pain)...`}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputMsg.trim() || isTyping}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold p-2.5 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Send</span>
          </button>
        </div>

        {/* Bottom Safety Disclaimer */}
        <div className="bg-slate-50 px-4 py-1.5 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-sky-600" />
            Educational Clinical Assistant • Not a substitute for in-person physician examination.
          </span>
          <span className="font-semibold text-slate-700">Immediate Danger? Dial 112</span>
        </div>

      </div>
    </section>
  );
};
