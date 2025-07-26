import { QuizQuestion, UserGroup } from "@/constants/translations";
import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface QuizProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  correctAnswer: number | null;
  next: () => void;
  nextLabel: string;
  group: UserGroup;
  isLastQuestion: boolean;
}

const Quiz: React.FC<QuizProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  correctAnswer,
  next,
  nextLabel,
  group,
  isLastQuestion,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.questionText, group === "elder" && styles.elderQuestion]}>
          {question.q}
        </Text>

        {question.options.map((option, idx) => {
          let buttonStyle: StyleProp<ViewStyle> = styles.optionButton;
          let textStyle: StyleProp<TextStyle> = styles.optionText;

          if (selectedAnswer !== null) {
            if (idx === correctAnswer) {
              buttonStyle = [styles.optionButton, styles.correctButton];
              textStyle = [styles.optionText, styles.correctText];
            } else if (idx === selectedAnswer && idx !== correctAnswer) {
              buttonStyle = [styles.optionButton, styles.wrongButton];
              textStyle = [styles.optionText, styles.wrongText];
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={buttonStyle}
              onPress={() => onSelectAnswer(idx)}
              disabled={selectedAnswer !== null}
              activeOpacity={0.7}
            >
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={next}>
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? "Finish" : nextLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 15,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#23244f",
  },
  elderQuestion: {
    fontSize: 22,
  },
  optionButton: {
    backgroundColor: "#f6f7fe",
    paddingVertical: 14,
    marginVertical: 7,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d5d6eb",
  },
  optionText: {
    fontSize: 16,
    color: "#23244f",
  },
  correctButton: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  wrongButton: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
  },
  correctText: {
    color: "#fff",
  },
  wrongText: {
    color: "#fff",
  },
  nextButton: {
    backgroundColor: "#202868",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
