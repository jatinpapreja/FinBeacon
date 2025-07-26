import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AgeSelector from "../../components/ui/AgeSelector";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Quiz from "../../components/ui/Quiz";
import { useQuiz } from "../../hooks/useQuiz";

const FinancialLiteracyScreen = () => {
  const {
    language,
    setLanguage,
    group,
    setGroup,
    currentQuestionIndex,
    currentQuestion,
    selectedAnswer,
    selectAnswer,
    correctAnswerIndex,
    next,
    quizCompleted,
    score,
    isLastQuestion,
    restart,
    translations,
  } = useQuiz();

  return (
    <SafeAreaView
      style={[
        styles.container,
        group === "elder" ? styles.elderBackground : styles.teenBackground,
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              group === "elder" ? styles.elderTitle : styles.teenTitle,
            ]}
          >
            {translations.appTitle}
          </Text>

          <View style={styles.languageContainer}>
            <LanguageSelector
              language={language}
              onChange={setLanguage}
              label={translations.langLabel}
            />
          </View>

          <Text style={styles.subtitle}>{translations.subtitle}</Text>
        </View>

        {/* Age Selection */}
        {!group && (
          <AgeSelector
            onSelect={setGroup}
            teenLabel={translations.teen}
            elderLabel={translations.elder}
            title={translations.whoLabel}
          />
        )}

        {/* Quiz Section */}
        {group && !quizCompleted && currentQuestion && (
          <View style={styles.quizContainer}>
            <Text
              style={[
                styles.quizTitle,
                group === "elder" ? styles.elderTitle : styles.teenTitle,
              ]}
            >
              {group === "teen"
                ? translations.teensQuiz
                : translations.eldersQuiz}
            </Text>

            <Quiz
              key={`${group}-${currentQuestionIndex}`}
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={selectAnswer}
              correctAnswer={correctAnswerIndex}
              next={next}
              nextLabel={translations.next}
              group={group}
              isLastQuestion={isLastQuestion}
            />
          </View>
        )}

        {/* Score Section */}
        {quizCompleted && group && (
          <View style={styles.scoreSection}>
            <Text
              style={[
                styles.scoreTitle,
                group === "elder" ? styles.elderTitle : styles.teenTitle,
              ]}
            >
              {translations.scoreLabel}
            </Text>

            <Text
              style={[
                styles.scoreText,
                group === "elder"
                  ? styles.elderScoreText
                  : styles.teenScoreText,
              ]}
            >
              {score} / {translations.questions[group].length}
            </Text>

            <TouchableOpacity
              style={[
                styles.restartButton,
                group === "elder" ? styles.elderButton : styles.teenButton,
              ]}
              onPress={restart}
            >
              <Text style={styles.restartButtonText}>
                {translations.restart}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{translations?.copyright}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FinancialLiteracyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  teenBackground: {
    backgroundColor: "#f8f9fd",
  },
  elderBackground: {
    backgroundColor: "#e8f0e8",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  teenTitle: {
    color: "#202868",
  },
  elderTitle: {
    color: "#1c8d3c",
  },
  quizContainer: {
    marginBottom: 30,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  scoreSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 30,
  },
  teenScoreText: {
    color: "#202868",
  },
  elderScoreText: {
    color: "#1c8d3c",
  },
  restartButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  teenButton: {
    backgroundColor: "#202868",
  },
  elderButton: {
    backgroundColor: "#1c8d3c",
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16, // spacing below title
  },

  languageContainer: {
    marginBottom: 180, // separates it from subtitle
    width: "50%",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 12,
  },
});
