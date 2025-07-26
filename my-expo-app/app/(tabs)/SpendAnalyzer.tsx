import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import ResultsDisplay from "../../components/ResultsDisplay";

// Updated interfaces to match the enhanced backend response
interface SpendingAnalysis {
  shopping: string;
  investment: string;
  utilities: string;
  others: string;
}

interface SpendingDistribution {
  shopping?: number;
  utilities?: number;
  investment?: number;
  food?: number;
  transport?: number;
  entertainment?: number;
  healthcare?: number;
  others?: number;
}

interface Recommendation {
  type: string;
  name: string;
  risk_level: 'Low' | 'Moderate' | 'High';
  suitability: string;
  expected_returns?: string;
  minimum_investment?: string;
  lock_in_period?: string;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  analysis_summary?: string;
}

interface EnhancedAnalysisResult {
  spending_analysis: SpendingAnalysis;
  finance_score?: number;
  spending_distribution?: SpendingDistribution;
  investment_recommendations?: RecommendationResponse;
  analysis_metadata: {
    document_processed_at: string;
    recommendations_generated_at: string;
    total_processing_time_ms: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: EnhancedAnalysisResult;
  message: string;
}

export default function SpendAnalyzer() {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EnhancedAnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // Replace with your backend URL
  // For local development: Use your computer's local IP
  // For Cloud Run deployment: Use your Cloud Run service URL
  const BACKEND_URL = "https://elevate-backend-hllhni53va-uc.a.run.app"; // Change this to your local IP or Cloud Run URL

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedFile(result);
        setResults(null); // Clear previous results
        console.log("Selected file:", result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const uploadAndAnalyze = async () => {
    if (!selectedFile || !selectedFile.assets || !selectedFile.assets[0]) {
      Alert.alert("Error", "Please select a PDF file first");
      return;
    }

    setLoading(true);
    setUploadProgress("Uploading file...");

    try {
      const file = selectedFile.assets[0];

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("bankStatement", {
        uri: file.uri,
        name: file.name || "statement.pdf",
        type: "application/pdf",
      } as any);

      setUploadProgress("Processing with Document AI...");

      // Add a delay to show the progress update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress("Analyzing spending patterns with AI...");

      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress("Generating investment recommendations...");

      const response = await fetch(`${BACKEND_URL}/api/analyze-statement`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          `HTTP error! status: ${response.status}`
        );
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setResults(result.data);
        setUploadProgress("Enhanced analysis with recommendations complete!");
        
        // Show success message with key insights
        const financeScore = result.data.finance_score || 0;
        const recommendationsCount = result.data.investment_recommendations?.recommendations.length || 0;
        
        Alert.alert(
          "Analysis Complete! 🎉",
          `Finance Score: ${financeScore}/100\nRecommendations: ${recommendationsCount} investment options\nProcessing Time: ${result.data.analysis_metadata.total_processing_time_ms}ms`,
          [{ text: "View Results", style: "default" }]
        );
      } else {
        throw new Error(result.message || "Enhanced analysis failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Analysis Error",
        `Failed to analyze statement: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nPlease check your internet connection and try again.`,
        [
          { text: "OK", style: "default" },
          { text: "Retry", style: "default", onPress: uploadAndAnalyze }
        ]
      );
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(""), 3000);
    }
  };

  const resetApp = () => {
    setSelectedFile(null);
    setResults(null);
    setUploadProgress("");
  };

  const formatProcessingTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>💰 Smart Investment Analyzer</Text>
          <Text style={styles.subtitle}>
            Upload your PDF bank statement to get spending insights and personalized investment recommendations
          </Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={pickDocument}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              📄 {selectedFile ? "Change PDF File" : "Select PDF File"}
            </Text>
          </TouchableOpacity>

          {selectedFile && selectedFile.assets && selectedFile.assets[0] && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>
                ✅ Selected: {selectedFile.assets[0].name}
              </Text>
              <Text style={styles.fileSize}>
                Size: {(selectedFile.assets[0].size! / 1024 / 1024).toFixed(2)}{" "}
                MB
              </Text>
            </View>
          )}

          {selectedFile && !loading && !results && (
            <TouchableOpacity
              style={[styles.button, styles.analyzeButton]}
              onPress={uploadAndAnalyze}
            >
              <Text style={styles.buttonText}>🚀 Analyze & Get Recommendations</Text>
            </TouchableOpacity>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>{uploadProgress}</Text>
              <Text style={styles.loadingSubtext}>
                Enhanced analysis with AI-powered recommendations
              </Text>
            </View>
          )}

          {results && (
            <View style={styles.resultsContainer}>
              {/* Enhanced Results Summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>📊 Analysis Summary</Text>
                {results.finance_score && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Finance Score:</Text>
                    <Text style={[
                      styles.scoreValue,
                      { color: results.finance_score >= 70 ? '#22c55e' : 
                               results.finance_score >= 40 ? '#f59e0b' : '#ef4444' }
                    ]}>
                      {results.finance_score}/100
                    </Text>
                  </View>
                )}
                
                {results.investment_recommendations && (
                  <Text style={styles.recommendationsCount}>
                    💡 {results.investment_recommendations.recommendations.length} personalized recommendations
                  </Text>
                )}
                
                <Text style={styles.processingTime}>
                  ⚡ Processed in {formatProcessingTime(results.analysis_metadata.total_processing_time_ms)}
                </Text>
              </View>

              {/* Pass the enhanced results to ResultsDisplay */}
              <ResultsDisplay data={results} />
              
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={resetApp}
              >
                <Text style={styles.resetButtonText}>
                  🔄 Analyze Another Statement
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f46e5", // Primary color
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280", // Muted foreground
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  section: {
    // Removed flex: 1 to allow ScrollView to handle scrolling
  },
  button: {
    backgroundColor: "#4f46e5", // Primary
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
  },
  analyzeButton: {
    backgroundColor: "#22c55e", // Success green
  },
  resetButton: {
    backgroundColor: "#6b7280", // Muted
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fileInfo: {
    backgroundColor: "#eef2ff", // Light primary background
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4f46e5",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f46e5",
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 14,
    color: "#6b7280",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#4f46e5",
    fontWeight: "500",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  resultsContainer: {
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "500",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  recommendationsCount: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  processingTime: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
