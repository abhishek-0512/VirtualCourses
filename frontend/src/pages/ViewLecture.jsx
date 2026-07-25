import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  Award,
  Download,
  X,
} from "lucide-react";
import { serverUrl } from "../App";
import Nav from "../component/Nav";

// ================= AI VOICE & QUIZ DRAWER COMPONENT =================
export function AiLessonDrawer({ currentLecture, courseTitle }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const recognitionRef = useRef(null);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(0.95);
  const [rate, setRate] = useState(0.95);

  const [quiz, setQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"));
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);

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

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

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

      {showVoiceSettings && activeTab === "chat" && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Volume1 className="w-4 h-4" />
            <span>Tutor Voice Profile & Tone</span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select Accent / Voice</label>
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
  const [completedLectures, setCompletedLectures] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const certRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { data: courseRes } = await axios.get(
          `${serverUrl}/api/course/${courseId}`,
          { withCredentials: true }
        );

        const { data: userRes } = await axios.get(
          `${serverUrl}/api/auth/current`,
          { withCredentials: true }
        );

        if (isMounted) {
          if (courseRes.success) {
            const courseData = courseRes.course || courseRes.getCourse || courseRes;
            setCourse(courseData);
            if (courseData?.lectures?.length > 0) {
              setSelectedLecture(courseData.lectures[0]);
            }
          }

          if (userRes?.user) {
            setUser(userRes.user);
            setCompletedLectures(userRes.user.completedLectures || []);
          }
        }
      } catch (error) {
        console.error("Error loading lecture page data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (courseId) fetchData();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Toggle or Mark Lecture Completed safely with Optimistic Update
  const handleToggleComplete = async (lectureParam) => {
    let targetId = "";
    if (typeof lectureParam === "string") {
      targetId = lectureParam;
    } else if (lectureParam?._id) {
      targetId = lectureParam._id.toString();
    }

    if (!targetId) {
      console.error("Cannot toggle completion: No valid lecture ID provided.");
      return;
    }

    // Optimistic UI state update so progress bar updates immediately
    setCompletedLectures((prev) => {
      const isAlreadyDone = prev.some((id) => id?.toString() === targetId);
      if (isAlreadyDone) {
        return prev.filter((id) => id?.toString() !== targetId);
      } else {
        return [...prev, targetId];
      }
    });

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/course/toggle-complete`,
        { lectureId: targetId },
        { withCredentials: true }
      );

      if (data.success && data.completedLectures) {
        setCompletedLectures(data.completedLectures);
      }
    } catch (err) {
      console.error(
        "Failed to toggle lecture completion:",
        err.response?.data?.message || err.message || err
      );
    }
  };

  // Called automatically when video finishes playing
  const handleVideoEnded = () => {
    if (!selectedLecture?._id) return;

    const currentIdStr = selectedLecture._id.toString();
    const isAlreadyCompleted = completedLectures.some(
      (id) => id?.toString() === currentIdStr
    );

    if (!isAlreadyCompleted) {
      handleToggleComplete(selectedLecture._id);
    }

    // Auto-advance to next lecture
    if (course?.lectures?.length) {
      const currentIndex = course.lectures.findIndex(
        (l) => (l._id || l).toString() === currentIdStr
      );
      if (currentIndex !== -1 && currentIndex + 1 < course.lectures.length) {
        const nextLecture = course.lectures[currentIndex + 1];
        if (typeof nextLecture === "object") {
          setSelectedLecture(nextLecture);
        }
      }
    }
  };

  const downloadCertificate = async () => {
    if (!certRef.current) return;

    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${course?.title || course?.courseTitle || "Course"}_Certificate.pdf`);
  };

  // Calculation for progress bar
  const totalLectures = course?.lectures?.length || 0;
  const completedCount = course?.lectures?.filter((l) => {
    const lId = typeof l === "object" ? l._id?.toString() : l?.toString();
    return completedLectures.some((id) => id?.toString() === lId);
  }).length || 0;

  const progressPercent =
    totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  const rawVideoUrl =
    selectedLecture?.videoUrl ||
    selectedLecture?.lectureUrl ||
    selectedLecture?.url ||
    selectedLecture?.publicUrl ||
    selectedLecture?.video ||
    "";

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
          {/* Main Video & Lesson Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {currentVideoUrl ? (
                <video
                  key={selectedLecture?._id || currentVideoUrl}
                  src={currentVideoUrl}
                  controls
                  playsInline
                  preload="auto"
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                  <PlayCircle className="w-12 h-12 stroke-1 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">
                    No video uploaded for this lecture.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-white">
                  {selectedLecture?.lectureTitle || selectedLecture?.title || "Lecture Stream"}
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {selectedLecture?.description || "No description provided for this lecture."}
                </p>
              </div>

              {selectedLecture?._id && (
                <button
                  onClick={() => handleToggleComplete(selectedLecture._id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                    completedLectures.some((id) => id?.toString() === selectedLecture._id?.toString())
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {completedLectures.some((id) => id?.toString() === selectedLecture._id?.toString())
                      ? "Completed"
                      : "Mark as Completed"}
                  </span>
                </button>
              )}
            </div>

            <AiLessonDrawer
              currentLecture={selectedLecture}
              courseTitle={course?.title || course?.courseTitle}
            />
          </div>

          {/* Curriculum Sidebar + Progress */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl h-fit space-y-6">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Course Progress</span>
                <span className="text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {progressPercent === 100 && (
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim Completion Certificate</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {course?.lectures?.map((lecture, index) => {
                const isObj = typeof lecture === "object";
                const lectureId = isObj ? lecture._id : lecture;
                const isActive = selectedLecture?._id === lectureId;
                const isDone = completedLectures.some(
                  (id) => id?.toString() === lectureId?.toString()
                );
                const title = isObj
                  ? lecture.lectureTitle || lecture.title
                  : `Lecture ${index + 1}`;

                return (
                  <button
                    key={lectureId || index}
                    onClick={() => isObj && setSelectedLecture(lecture)}
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

                    {isDone ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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

      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Verified Course Certificate</span>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={certRef}
              className="p-10 bg-slate-950 border-4 border-amber-500/40 rounded-2xl text-center space-y-6 font-serif relative overflow-hidden"
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-amber-400 font-sans font-extrabold">
                  Certificate of Completion
                </p>
                <h2 className="text-3xl font-bold text-white font-sans">
                  Virtual Courses LMS
                </h2>
              </div>

              <p className="text-xs text-slate-400 font-sans">
                This certifies that
              </p>

              <h3 className="text-2xl font-black text-amber-300 font-sans tracking-wide">
                {user?.name || "Student Name"}
              </h3>

              <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
                has successfully completed all lectures and coursework for
              </p>

              <h4 className="text-lg font-bold text-indigo-300 font-sans">
                "{course?.title || course?.courseTitle}"
              </h4>

              <div className="pt-6 flex justify-between items-center text-[10px] text-slate-500 font-sans border-t border-slate-800">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Instructor Verified • Virtual Courses</span>
              </div>
            </div>

            <button
              onClick={downloadCertificate}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewLecture;