import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Send,
  CheckCircle2,
  XCircle,
  Settings2,
} from "lucide-react";
import { serverUrl } from "../App";
import Nav from "../component/Nav";

// ================= AI VOICE & QUIZ DRAWER COMPONENT =================
export function AiLessonDrawer({ currentLecture, courseTitle }) {
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'quiz'
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const recognitionRef = useRef(null);

  // Smooth Voice Profiles & Settings
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(0.95); // Warmer, natural tone
  const [rate, setRate] = useState(0.95);   // Natural conversational speed

  // Quiz States
  const [quiz, setQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Load and Filter Soft, Natural Browser Voices
  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"));
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);

        // Pick pleasant, warm, high-quality voices
        const naturalVoice =
          availableVoices.find((v) => v.name.includes("Natural") && v.lang.startsWith("en")) ||
          availableVoices.find((v) => v.name.includes("Google US English") || v.name.includes("Google UK English Female")) ||
          availableVoices.find((v) => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Daniel")) ||
          englishVoices[0] ||
          availableVoices[0];

        if (naturalVoice && !selectedVoice) {
          setSelectedVoice(naturalVoice.name);
        }
      }
    };

    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Soft & Pleasant Text-To-Speech Output
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Stop active speech queue

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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopAudio();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Submit Question
  const handleAskAi = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const textToSubmit = customPrompt || question;
    if (!textToSubmit.trim()) return;

    setQuestion("");
    setChatHistory((prev) => [...prev, { role: "user", text: textToSubmit }]);
    setLoadingChat(true);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/ai/ask-lecture`,
        {
          question: textToSubmit,
          lectureTitle: currentLecture?.lectureTitle || currentLecture?.title,
          lectureDescription: currentLecture?.description,
          courseTitle,
        },
        { withCredentials: true }
      );

      if (data.success) {
        const aiAnswer = data.answer;
        setChatHistory((prev) => [...prev, { role: "ai", text: aiAnswer }]);

        if (autoSpeak) {
          speakText(aiAnswer);
        }
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't process your question right now." },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    setQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/ai/generate-quiz`,
        {
          lectureTitle: currentLecture?.lectureTitle || currentLecture?.title,
          lectureDescription: currentLecture?.description,
          courseTitle,
        },
        { withCredentials: true }
      );

      if (data.success) {
        setQuiz(data.quiz);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <div className="border border-slate-800 rounded-3xl bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Voice Tutor</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("quiz");
              if (!quiz) handleGenerateQuiz();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Take AI Quiz</span>
          </button>
        </div>

        {activeTab === "chat" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Voice Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (isPlayingAudio) stopAudio();
                setAutoSpeak(!autoSpeak);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                autoSpeak
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{autoSpeak ? "Voice On" : "Muted"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Voice Tuning Drawer Settings */}
      {showVoiceSettings && activeTab === "chat" && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Volume1 className="w-4 h-4" />
            <span>Tutor Voice Profile & Tone</span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Select Accent / Voice
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
              <label className="text-[11px] text-slate-400 block mb-1">Pitch: {pitch}</label>
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

      {/* AI Voice Chat Tab */}
      {activeTab === "chat" && (
        <div className="space-y-4">
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {chatHistory.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">
                Click the mic icon or type below to ask any question about this lesson!
              </p>
            )}

            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col text-sm ${
                  item.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    item.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none whitespace-pre-line"
                  }`}
                >
                  {item.text}
                </div>

                {item.role === "ai" && (
                  <button
                    onClick={() => speakText(item.text)}
                    className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-300 mt-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            ))}

            {loadingChat && (
              <div className="text-xs text-indigo-400 animate-pulse flex items-center gap-2">
                <Bot className="w-4 h-4" /> Gemini AI is thinking...
              </div>
            )}
          </div>

          <form onSubmit={(e) => handleAskAi(e)} className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              title={isListening ? "Listening... Click to stop" : "Click to speak"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Ask a question about this lesson..."}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={loadingChat || !question.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* AI Quiz Tab */}
      {activeTab === "quiz" && (
        <div className="space-y-6">
          {loadingQuiz ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Generating AI Quiz for this lesson...</p>
            </div>
          ) : quiz ? (
            <div className="space-y-6">
              {quiz.map((q, qIndex) => (
                <div key={qIndex} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 space-y-3">
                  <p className="text-xs font-bold text-white">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedAnswers[qIndex] === optIndex;
                      const isCorrect = q.correctIndex === optIndex;

                      let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
                      if (showResults) {
                        if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300";
                        else if (isSelected && !isCorrect) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                      } else if (isSelected) {
                        btnStyle = "bg-indigo-600/30 border-indigo-500 text-indigo-200";
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={showResults}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showResults && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {showResults && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {showResults && (
                    <p className="text-[11px] text-slate-400 pt-1 leading-normal italic">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleGenerateQuiz}
                  className="text-xs text-indigo-400 hover:underline cursor-pointer"
                >
                  Generate New Questions
                </button>
                {!showResults ? (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <span className="text-xs font-bold text-indigo-300">
                    Score: {quiz.filter((q, i) => selectedAnswers[i] === q.correctIndex).length} / {quiz.length}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handleGenerateQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Generate Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ================= MAIN VIEW LECTURE PAGE =================
function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCourseLectures = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/course/${courseId}`,
          { withCredentials: true }
        );

        if (data.success && isMounted) {
          const courseData = data.course || data.getCourse || data;
          setCourse(courseData);

          if (courseData?.lectures?.length > 0) {
            const firstLec = courseData.lectures[0];
            setSelectedLecture(firstLec);
          }
        }
      } catch (error) {
        console.error("Error fetching course lectures:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseLectures();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Extract raw video URL
  const rawVideoUrl =
    selectedLecture?.videoUrl ||
    selectedLecture?.lectureUrl ||
    selectedLecture?.url ||
    selectedLecture?.publicUrl ||
    selectedLecture?.video ||
    "";

  // Force Cloudinary to encode audio using browser-compatible AAC codec
  const currentVideoUrl = rawVideoUrl.includes("cloudinary.com") && !rawVideoUrl.includes("ac_aac")
    ? rawVideoUrl.replace("/upload/", "/upload/ac_aac/")
    : rawVideoUrl;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Course</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video Player + AI Drawer */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {currentVideoUrl ? (
                <video
                  key={selectedLecture?._id || currentVideoUrl}
                  src={currentVideoUrl}
                  controls
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain bg-black"
                  onError={(e) => {
                    console.error("Failed to stream video from source:", currentVideoUrl);
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                  <PlayCircle className="w-12 h-12 stroke-1 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">
                    No video URL found for this lecture.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-2">
              <h1 className="text-xl font-black text-white">
                {selectedLecture?.lectureTitle || selectedLecture?.title || "Lecture Stream"}
              </h1>
              <p className="text-sm text-slate-400">
                {selectedLecture?.description || "No description provided for this lecture."}
              </p>
            </div>

            {/* AI Assistant & Quiz Drawer */}
            <AiLessonDrawer
              currentLecture={selectedLecture}
              courseTitle={course?.title || course?.courseTitle}
            />
          </div>

          {/* Right Column: Curriculum Sidebar */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl h-fit space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
              Course Content ({course?.lectures?.length || 0})
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {course?.lectures?.map((lecture, index) => {
                const isObj = typeof lecture === "object";
                const lectureId = isObj ? lecture._id : lecture;
                const isActive = selectedLecture?._id === lectureId;
                const title = isObj
                  ? lecture.lectureTitle || lecture.title
                  : `Lecture ${index + 1}`;

                return (
                  <button
                    key={lectureId || index}
                    onClick={() => {
                      if (isObj) {
                        setSelectedLecture(lecture);
                      }
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-mono text-slate-500">{index + 1}.</span>
                      <span className="truncate">{title}</span>
                    </div>
                    {isActive ? (
                      <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;