import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

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

interface ResultsDisplayProps {
  data: EnhancedAnalysisResult;
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  const getRiskLevelColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Low': return '#22c55e';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getFinanceScoreColor = (score: number): string => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const openInvestmentLink = (fundName: string) => {
    // You can implement deep linking to investment apps or websites
    const searchQuery = encodeURIComponent(fundName);
    const url = `https://www.google.com/search?q=${searchQuery}+mutual+fund+investment`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Original Spending Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Spending Analysis</Text>
        <View style={styles.analysisGrid}>
          <View style={styles.analysisItem}>
            <Text style={styles.analysisLabel}>🛍️ Shopping</Text>
            <Text style={styles.analysisValue}>{data.spending_analysis.shopping}</Text>
          </View>
          <View style={styles.analysisItem}>
            <Text style={styles.analysisLabel}>💡 Utilities</Text>
            <Text style={styles.analysisValue}>{data.spending_analysis.utilities}</Text>
          </View>
          <View style={styles.analysisItem}>
            <Text style={styles.analysisLabel}>📈 Investment</Text>
            <Text style={styles.analysisValue}>{data.spending_analysis.investment}</Text>
          </View>
          <View style={styles.analysisItem}>
            <Text style={styles.analysisLabel}>🏷️ Others</Text>
            <Text style={styles.analysisValue}>{data.spending_analysis.others}</Text>
          </View>
        </View>
      </View>

      {/* Enhanced Spending Distribution */}
      {data.spending_distribution && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Detailed Spending Breakdown</Text>
          <View style={styles.distributionContainer}>
            {Object.entries(data.spending_distribution).map(([category, value]) => (
              <View key={category} style={styles.distributionItem}>
                <Text style={styles.distributionCategory}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <View style={styles.distributionBar}>
                  <View 
                    style={[
                      styles.distributionFill, 
                      { width: `${Math.min(value || 0, 100)}%` }
                    ]} 
                  />
                  <Text style={styles.distributionValue}>
                    {formatPercentage(value || 0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Finance Score */}
      {data.finance_score !== undefined && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Financial Health Score</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={[
                styles.scoreText, 
                { color: getFinanceScoreColor(data.finance_score) }
              ]}>
                {data.finance_score}
              </Text>
              <Text style={styles.scoreLabel}>/ 100</Text>
            </View>
            <View style={styles.scoreDescription}>
              <Text style={styles.scoreDescriptionText}>
                {data.finance_score >= 70 ? 
                  "Excellent financial health! You're managing your money well." :
                  data.finance_score >= 40 ?
                  "Good financial health with room for improvement." :
                  "Consider improving your spending habits and increasing investments."
                }
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Investment Recommendations */}
      {data.investment_recommendations && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Personalized Investment Recommendations</Text>
          
          {data.investment_recommendations.analysis_summary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                {data.investment_recommendations.analysis_summary}
              </Text>
            </View>
          )}

          <View style={styles.recommendationsContainer}>
            {data.investment_recommendations.recommendations.map((rec, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.recommendationCard}
                onPress={() => openInvestmentLink(rec.name)}
                activeOpacity={0.8}
              >
                <View style={styles.recommendationHeader}>
                  <Text style={styles.recommendationName}>{rec.name}</Text>
                  <View style={[
                    styles.riskBadge, 
                    { backgroundColor: getRiskLevelColor(rec.risk_level) }
                  ]}>
                    <Text style={styles.riskText}>{rec.risk_level}</Text>
                  </View>
                </View>
                
                <Text style={styles.recommendationType}>{rec.type}</Text>
                <Text style={styles.recommendationSuitability}>{rec.suitability}</Text>
                
                <View style={styles.recommendationDetails}>
                  {rec.expected_returns && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Expected Returns:</Text>
                      <Text style={styles.detailValue}>{rec.expected_returns}</Text>
                    </View>
                  )}
                  
                  {rec.minimum_investment && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Minimum Investment:</Text>
                      <Text style={styles.detailValue}>{rec.minimum_investment}</Text>
                    </View>
                  )}
                  
                  {rec.lock_in_period && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Lock-in Period:</Text>
                      <Text style={styles.detailValue}>{rec.lock_in_period}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.tapToLearnMore}>Tap to learn more</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Processing Metadata */}
      <View style={styles.metadataSection}>
        <Text style={styles.metadataTitle}>⚡ Processing Details</Text>
        <View style={styles.metadataGrid}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Document Processed</Text>
            <Text style={styles.metadataValue}>
              {new Date(data.analysis_metadata.document_processed_at).toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Recommendations Generated</Text>
            <Text style={styles.metadataValue}>
              {new Date(data.analysis_metadata.recommendations_generated_at).toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Total Processing Time</Text>
            <Text style={styles.metadataValue}>
              {data.analysis_metadata.total_processing_time_ms < 1000 
                ? `${data.analysis_metadata.total_processing_time_ms}ms`
                : `${(data.analysis_metadata.total_processing_time_ms / 1000).toFixed(1)}s`
              }
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
  },
  analysisGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  analysisItem: {
    width: "48%",
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  analysisLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 5,
  },
  analysisValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  distributionContainer: {
    gap: 12,
  },
  distributionItem: {
    marginBottom: 8,
  },
  distributionCategory: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  distributionBar: {
    height: 24,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    position: "relative",
    justifyContent: "center",
  },
  distributionFill: {
    height: "100%",
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    position: "absolute",
    left: 0,
    top: 0,
  },
  distributionValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e2e8f0",
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  scoreDescription: {
    flex: 1,
    marginLeft: 20,
  },
  scoreDescriptionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: "#eff6ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  summaryText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
    fontStyle: "italic",
  },
  recommendationsContainer: {
    gap: 15,
  },
  recommendationCard: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
    marginRight: 10,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  recommendationType: {
    fontSize: 14,
    color: "#4f46e5",
    fontWeight: "500",
    marginBottom: 6,
  },
  recommendationSuitability: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 18,
  },
  recommendationDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#9ca3af",
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    textAlign: "right",
  },
  tapToLearnMore: {
    fontSize: 11,
    color: "#4f46e5",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  metadataSection: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  metadataGrid: {
    gap: 8,
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metadataLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  metadataValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
});
