// hooks/useQuiz.ts
import translations, {
  LanguageCode,
  QuizQuestion,
  TranslationEntry,
  UserGroup,
} from "@/constants/translations";
import { useEffect, useState } from "react";

export const useQuiz = () => {
  /** State */
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [group, setGroup] = useState<UserGroup | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  /** Whenever language or group changes, reset quiz */
  useEffect(() => {
    resetQuiz();
  }, [language, group]);

  /** Reset quiz state */
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  // Current translation block (guaranteed to exist)
  const t: TranslationEntry = translations[language];

  // Questions for chosen group or empty array if none selected
  const questions: QuizQuestion[] =
    group !== null ? t.questions[group] : [];

  // Current question object, or null if none
  const currentQuestion: QuizQuestion | null =
    questions.length > 0 ? questions[currentQuestionIndex] : null;

  // Correct answer index or null if not applicable
  const correctAnswerIndex: number | null =
    group !== null && questions.length > 0
      ? t.answers[group][currentQuestionIndex]
      : null;

  // Check if this is the last question
  const isLastQuestion: boolean =
    group !== null && questions.length > 0
      ? currentQuestionIndex === questions.length - 1
      : false;

  /** Select answer handler */
  const selectAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // prevent re-selection
    setSelectedAnswer(index);
    if (index === correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  /** Move to next question or finish quiz */
  const next = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  /** Restart quiz flow */
  const restart = () => {
    setGroup(null);
    resetQuiz();
  };

  return {
    language,
    setLanguage,
    group,
    setGroup,
    currentQuestionIndex,
    currentQuestion,
    selectedAnswer,
    score,
    quizCompleted,
    isLastQuestion,
    correctAnswerIndex,
    selectAnswer,
    next,
    restart,
    translations: t,
  };
};