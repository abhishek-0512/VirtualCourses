import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Bot,
  Loader2,
  Send,
  BookOpen,
  Settings2,
  Volume1,
} from "lucide-react";
import { serverUrl } from "../App";

export default function GeminiVoiceAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [micStatus, setMicStatus] = useState("Tap Mic to Speak");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Softer Voice Settings for Pleasant Audio
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(0.95); // Slightly lower pitch for a warmer, natural tone
  const [rate, setRate] = useState(0.95);   // Slightly slower pace for natural reading

  const recognitionRef = useRef(null);

  // Load and Filter for Premium/Natural Browser Voices
  useEffect(() => {
    const loadAndFilterVoices = () => {
      if ("speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        
        // Filter out robotic default fallback voices when possible
        const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"));
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);

        // Priority order for pleasant, warm, high-quality voices
        const pleasantVoice =
          availableVoices.find((v) => v.name.includes("Natural") && v.lang.startsWith("en")) ||
          availableVoices.find((v) => v.name.includes("Google US English") || v.name.includes("Google UK English Female")) ||
          availableVoices.find((v) => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Daniel")) ||
          englishVoices[0] ||
          availableVoices[0];

        if (pleasantVoice && !selectedVoice) {
          setSelectedVoice(pleasantVoice.name);
        }
      }
    };

    loadAndFilterVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadAndFilterVoices;
    }
  }, []);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatus("Listening... Speak now!");
      };

      recognition.onresult = (event) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event) => {
        console.error("Mic Error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setMicStatus("Microphone blocked! Please allow access.");
        } else if (event.error === "no-speech") {
          setMicStatus("No speech detected. Try again.");
        } else {
          setMicStatus(`Mic Error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setMicStatus("Speech recognition not supported in this browser.");
    }
  }, []);

  // Smooth & Warm Text-To-Speech Function
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Clear queued speech

    // Clean formatting and punctuation for better cadence
    const cleanText = text
      .replace(/```[\s\S]*?```/g, " Here is a code example. ")
      .replace(/[*#_`]/g, "")
      .replace(/https?:\/\/\S+/g, "link");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (selectedVoice) {
      const voiceObj = voices.find((v) => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser. Try Chrome or Edge!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setMicStatus("Stopped listening.");
    } else {
      stopAudio();
      setAiResponse("");
      setMatchedCourses([]);
      try {
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    }
  };

  // Send Query to Backend AI
  const handleSendQuery = async (queryText) => {
    const textToSearch = queryText || transcript;
    if (!textToSearch || !textToSearch.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const lower = textToSearch.toLowerCase();

    if (lower.includes("all courses") || lower === "courses") {
      speakText("Opening all available courses page");
      navigate("/allcourses");
      setIsOpen(false);
      return;
    } else if (lower.includes("profile")) {
      speakText("Opening your profile");
      navigate("/profile");
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setMicStatus("Gemini AI searching...");

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/ai/search`,
        { input: textToSearch },
        { withCredentials: true }
      );

      const responseMessage =
        data.message ||
        data.aiResponse ||
        "Here are the courses matching your request:";

      const foundCourses = data.courses || data.matchedCourses || [];

      setAiResponse(responseMessage);
      setMatchedCourses(foundCourses);
      speakText(responseMessage);
      setMicStatus("Results updated!");
    } catch (error) {
      console.error("Gemini Assistant Error:", error);
      const errorMsg = "Sorry, I couldn't search courses right now.";
      setAiResponse(errorMsg);
      setMatchedCourses([]);
      speakText(errorMsg);
      setMicStatus("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="text-xs uppercase tracking-wider font-extrabold">
          Gemini Voice
        </span>
      </button>

      {/* Voice Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
            
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Bot className="w-5 h-5" />
                <span>Gemini Voice Companion</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Tune Voice Softness & Pitch"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    stopAudio();
                    if (isListening && recognitionRef.current) recognitionRef.current.stop();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Tuning Panel */}
            {showVoiceSettings && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <Volume1 className="w-4 h-4" />
                  <span>Audio & Voice Selector</span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Select Voice Profile (Try Google US English or Natural)
                  </label>
                  <select
                    value={selectedVoice || ""}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Speed: {rate}x</label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Pitch Tone: {pitch}</label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mic Animation Button */}
            <div className="relative flex flex-col items-center justify-center my-2">
              <button
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer z-10 ${
                  isListening
                    ? "bg-rose-600 scale-110 shadow-rose-500/50 animate-pulse"
                    : isPlayingAudio
                    ? "bg-amber-500 shadow-amber-500/50"
                    : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Mic Status */}
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              {micStatus}
            </p>

            {/* Input Field */}
            <div className="relative flex items-center rounded-2xl border border-slate-800 bg-slate-950/80 p-2 focus-within:border-indigo-500">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                placeholder="Type or click the mic to ask Gemini..."
                className="w-full bg-transparent px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={loading || !transcript.trim()}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* AI Text Output */}
            {aiResponse && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300">
                    Gemini AI:
                  </span>
                  <button
                    onClick={isPlayingAudio ? stopAudio : () => speakText(aiResponse)}
                    className="p-1 rounded bg-indigo-600/30 text-white transition-all cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </p>
              </div>
            )}

            {/* Matched Course Cards */}
            {matchedCourses.length > 0 && (
              <div className="text-left space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Found {matchedCourses.length} Courses:</span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {matchedCourses.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => {
                        stopAudio();
                        setIsOpen(false);
                        navigate(`/viewcourse/${course._id}`);
                      }}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/60 hover:bg-slate-900 transition-all cursor-pointer group"
                    >
                      <img
                        src={
                          course.thumbnail ||
                          course.courseThumbnail ||
                          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={course.title}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                          {course.title || course.courseTitle}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {course.category} • {course.level}
                        </p>
                        <p className="text-xs font-black text-indigo-400 mt-0.5">
                          ₹{course.price || course.coursePrice || "Free"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}