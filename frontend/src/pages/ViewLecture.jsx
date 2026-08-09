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
  FileText,
  Clock,
  Trash2,
  Copy,
  Maximize2,
  Minimize2,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import Nav from "../component/Nav";

// ================= AI VOICE & QUIZ DRAWER COMPONENT =================
export function AiLessonDrawer({ currentLecture, courseTitle }) {
  const [activeTab, setActiveTab] = useState("chat"); // chat | quiz | notes
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
        { role: "ai", text: "Sorry, I couldn't process your question right now. Please try again." },
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
      {/* Tabs Header */}
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
            <span>Interactive AI Quiz</span>
          </button>
        </div>

        {activeTab === "chat" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Voice Profile"
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
            <span>Tutor Voice Tone</span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select Voice Accent</label>
            <select
              value={selectedVoice || ""}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
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

      {/* AI Chat Tab */}
      {activeTab === "chat" && (
        <div className="space-y-4">
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {chatHistory.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">
                Click the microphone or type below to ask any questions about this lecture!
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
                <Bot className="w-4 h-4" /> Gemini AI is analyzing the lesson...
              </div>
            )}
          </div>

          <form onSubmit={(e) => handleAskAi(e)} className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
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
              placeholder={isListening ? "Listening to your voice..." : "Ask Gemini AI about this lesson..."}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={loadingChat || !question.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === "quiz" && (
        <div className="space-y-6">
          {loadingQuiz ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Generating AI Quiz questions for this lesson...</p>
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
                    Score: {quiz.filter((q, i) => selectedAnswers[i] === q.correctIndex).length} / {quiz.length} Correct
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handleGenerateQuiz}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Generate Quiz for this Lesson
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

  // Video Player Tools
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const videoRef = useRef(null);
  const certRef = useRef(null);

  // Timestamped Notes Feature
  const [noteText, setNoteText] = useState("");
  const [studyNotes, setStudyNotes] = useState([]);
  const [activeSideTab, setActiveSideTab] = useState("curriculum"); // curriculum | notes

  // Load study notes from localStorage
  useEffect(() => {
    try {
      const savedNotes = JSON.parse(
        localStorage.getItem(`vc_notes_${courseId}`) || "[]"
      );
      setStudyNotes(savedNotes);
    } catch (e) {
      setStudyNotes([]);
    }
  }, [courseId]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Add a new timestamped note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const currentTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    const newNote = {
      id: Date.now(),
      time: currentTime,
      formattedTime: formatTime(currentTime),
      text: noteText.trim(),
      lectureTitle: selectedLecture?.lectureTitle || selectedLecture?.title || "Lesson",
      date: new Date().toLocaleDateString(),
    };

    const updated = [newNote, ...studyNotes];
    setStudyNotes(updated);
    localStorage.setItem(`vc_notes_${courseId}`, JSON.stringify(updated));
    setNoteText("");
    toast.success("Note captured with timestamp!");
  };

  // Delete note
  const handleDeleteNote = (noteId) => {
    const updated = studyNotes.filter((n) => n.id !== noteId);
    setStudyNotes(updated);
    localStorage.setItem(`vc_notes_${courseId}`, JSON.stringify(updated));
  };

  // Copy notes as Markdown
  const handleCopyNotes = () => {
    if (studyNotes.length === 0) return;
    const md = studyNotes
      .map(
        (n) => `### ${n.lectureTitle} [${n.formattedTime}]\n- ${n.text}\n`
      )
      .join("\n");
    navigator.clipboard.writeText(md);
    toast.success("Study notes copied to clipboard as Markdown!");
  };

  // Jump video to timestamp
  const seekToTime = (timeInSeconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      videoRef.current.play();
    }
  };

  // Change playback rate
  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

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

  // Toggle Lecture Completed with optimistic update
  const handleToggleComplete = async (lectureParam) => {
    let targetId = "";
    if (typeof lectureParam === "string") {
      targetId = lectureParam;
    } else if (lectureParam?._id) {
      targetId = lectureParam._id.toString();
    }

    if (!targetId) return;

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
      console.error("Failed to toggle lecture completion:", err);
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
          toast.info(`Next Lesson: ${nextLecture.lectureTitle || nextLecture.title}`);
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
    toast.success("Certificate downloaded successfully!");
  };

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className={`mx-auto pt-24 pb-16 px-4 sm:px-6 transition-all ${isTheaterMode ? "max-w-full" : "max-w-7xl"}`}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Course Overview</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Video & Lesson Content (8 cols normally / full in theater) */}
          <div className={`${isTheaterMode ? "lg:col-span-12" : "lg:col-span-8"} space-y-6`}>
            
            {/* Video Player Container */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {currentVideoUrl ? (
                <video
                  ref={videoRef}
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

            {/* Video Player Controls Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Speed:
                </span>
                {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      playbackRate === speed
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isTheaterMode ? "Default View" : "Theater View"}</span>
                </button>
              </div>
            </div>

            {/* Lesson Title & Mark as Completed Bar */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-xl">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {selectedLecture?.lectureTitle || selectedLecture?.title || "Lesson Stream"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  {selectedLecture?.description || "Follow along with the video and engage with the AI voice assistant for any questions."}
                </p>
              </div>

              {selectedLecture?._id && (
                <button
                  onClick={() => handleToggleComplete(selectedLecture._id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-lg ${
                    completedLectures.some((id) => id?.toString() === selectedLecture._id?.toString())
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {completedLectures.some((id) => id?.toString() === selectedLecture._id?.toString())
                      ? "Completed ✓"
                      : "Mark as Completed"}
                  </span>
                </button>
              )}
            </div>

            {/* AI Assistant & Quiz Drawer */}
            <AiLessonDrawer
              currentLecture={selectedLecture}
              courseTitle={course?.title || course?.courseTitle}
            />
          </div>

          {/* Sidebar (4 cols): Curriculum & Study Notes */}
          <div className={`${isTheaterMode ? "lg:col-span-12" : "lg:col-span-4"} space-y-6`}>
            
            {/* Progress Card */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Your Course Progress</span>
                <span className="text-indigo-400 font-extrabold">{progressPercent}%</span>
              </div>

              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                {completedCount} of {totalLectures} lessons completed
              </p>

              {progressPercent === 100 && (
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim Verified Certificate</span>
                </button>
              )}
            </div>

            {/* Sidebar Tabs: Curriculum vs. Study Notes */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
              
              <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveSideTab("curriculum")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSideTab === "curriculum"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Curriculum</span>
                </button>

                <button
                  onClick={() => setActiveSideTab("notes")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSideTab === "notes"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes ({studyNotes.length})</span>
                </button>
              </div>

              {/* Tab 1: Curriculum List */}
              {activeSideTab === "curriculum" && (
                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {course?.lectures?.map((lecture, index) => {
                    const isObj = typeof lecture === "object";
                    const lectureId = isObj ? lecture._id : lecture;
                    const isActive = selectedLecture?._id === lectureId;
                    const isDone = completedLectures.some(
                      (id) => id?.toString() === lectureId?.toString()
                    );
                    const lecTitle = isObj
                      ? lecture.lectureTitle || lecture.title
                      : `Lecture ${index + 1}`;

                    return (
                      <button
                        key={lectureId || index}
                        onClick={() => isObj && setSelectedLecture(lecture)}
                        className={`w-full p-3.5 rounded-2xl text-left text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                          isActive
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate min-w-0">
                          <span className="font-mono text-slate-500">{index + 1}.</span>
                          <span className="truncate">{lecTitle}</span>
                        </div>

                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Timestamped Notes */}
              {activeSideTab === "notes" && (
                <div className="space-y-4">
                  {/* Note Creator Form */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <div className="relative">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Type notes at current video timestamp..."
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>Captures video second automatically</span>
                      </span>
                      <button
                        type="submit"
                        disabled={!noteText.trim()}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  {studyNotes.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Saved Notes
                        </span>
                        <button
                          onClick={handleCopyNotes}
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy as Markdown</span>
                        </button>
                      </div>

                      {studyNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => seekToTime(note.time)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md hover:bg-indigo-500/20 cursor-pointer"
                              title="Jump video to this timestamp"
                            >
                              <Clock className="w-2.5 h-2.5" />
                              <span>{note.formattedTime}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-slate-600 hover:text-rose-400 p-1"
                              title="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-slate-200 leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-6">
                      No notes yet. Type a thought above to capture it with a timestamp!
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Verified Certificate of Completion</span>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Certificate Template */}
            <div
              ref={certRef}
              className="p-10 bg-slate-950 border-4 border-amber-500/50 rounded-2xl text-center space-y-6 font-serif relative overflow-hidden shadow-2xl"
            >
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-amber-400 font-sans font-extrabold">
                  Official Certificate of Achievement
                </p>
                <h2 className="text-3xl font-black text-white font-sans tracking-tight">
                  Virtual Courses Global Academy
                </h2>
              </div>

              <p className="text-xs text-slate-400 font-sans">
                This document proudly certifies that
              </p>

              <h3 className="text-3xl font-black text-amber-300 font-sans tracking-wide">
                {user?.name || "Student Name"}
              </h3>

              <p className="text-xs text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
                has successfully completed all lectures, curriculum requirements, and coursework for
              </p>

              <h4 className="text-xl font-extrabold text-indigo-300 font-sans">
                "{course?.title || course?.courseTitle}"
              </h4>

              <div className="pt-8 flex justify-between items-center text-[10px] text-slate-500 font-sans border-t border-slate-800">
                <span>Issued Date: {new Date().toLocaleDateString()}</span>
                <span>Credential ID: VC-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
                <span>Instructor Verified • 100% Completed</span>
              </div>
            </div>

            <button
              onClick={downloadCertificate}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewLecture;