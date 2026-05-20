// components/scan/AnalysisCard.tsx
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { DetectedAllergy, ScanHistoryResponseDTO } from "@/lib/types/scan";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";

interface AnalysisResultProps {
    isCapturing: boolean;
    isUploading: boolean;
    analysisResult: string | null;
    errorMessage?: string | null;
    isHardwareTesting?: boolean;
}

export default function AnalysisResult({
    isCapturing,
    isUploading,
    analysisResult,
    errorMessage,
    isHardwareTesting,
}: AnalysisResultProps) {
    const { theme } = useAppTheme();
    const { t } = useTranslation("scan");
    const [showAfterHardwareDelay, setShowAfterHardwareDelay] = useState(false);

    useEffect(() => {
        if (isHardwareTesting) {
            setShowAfterHardwareDelay(false);
            return;
        }
        const timer = setTimeout(() => setShowAfterHardwareDelay(true), 1500);
        return () => clearTimeout(timer);
    }, [isHardwareTesting]);

    const parsed: ScanHistoryResponseDTO | null = analysisResult ? JSON.parse(analysisResult) : null;

    // 1. I splt only on commas that are NOT inside parentheses
    const ingredientString = parsed?.scannedIngredientsText || "";
    const ingredients = ingredientString 
        ? ingredientString.split(/,(?![^\(]*\))/g) 
            .map((ingrediens: string) => ingrediens.trim())
            .filter((ingrediens: string) => ingrediens.length > 0): [];

    // 2. I make a flat list of words that should be red
    const flagged = parsed?.detectedAllergies?.flatMap((allergy: DetectedAllergy) => 
        allergy.matchedIngredients?.map((match) => match.ingredientText.toLowerCase())) || [];

    const allergens = parsed?.detectedAllergies?.map((allergy: DetectedAllergy) => allergy.allergyName) || [];
    const hasAllergy = allergens.length > 0;

    return (
        <View className="w-[85%] mt-6">
            <DefaultCard>
                {isHardwareTesting || !showAfterHardwareDelay ? (
                    <Text style={{ color: theme.text, fontSize: 16, textAlign: "center" }}>
                        {t("hardwareTestRunningMessage")}
                    </Text>
                ) : isCapturing ? (
                    <Text style={{ color: theme.text, fontSize: 16, textAlign: "center" }}>
                        {t("capturingPhotoMessage")}
                    </Text>
                ) : isUploading ? (
                    <View className="items-center">
                        <ActivityIndicator size="large" color="black" />
                        <Text style={{ color: theme.text, fontSize: 16, textAlign: "center", marginTop: 10 }}>
                            {t("uploadingAndAnalyzingMessage")}
                        </Text>
                    </View>
                ) : errorMessage ? (
                    <View className="items-center">
                        <Text style={{ color: theme.warningText, fontSize: 16, textAlign: "center", fontWeight: "600" }}>
                            {errorMessage}
                        </Text>
                    </View>
                ) : parsed ? (
                    <View>
                        <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
                            {t("analysisResultTitle")}
                        </Text>

                        {hasAllergy ? (
                            <View className="mb-3">
                                <Text style={{ color: theme.warningText, fontWeight: "600" }}>
                                    {t("allergensFoundLabel")}: {allergens.join(", ")}
                                </Text>
                            </View>
                        ) : (
                            <Text style={{ color: theme.successText, fontWeight: "600", marginBottom: 12 }}>
                                {t("noAllergensFoundMessage")}
                            </Text>
                        )}

                        <View className="h-[1px] bg-gray-300 my-3" />

                        <View className="flex-row flex-wrap">
                            {ingredients.length > 0 ? (
                                ingredients.map((item: string, index: number) => {
                                    // checks if the ingredient (or part of it) is found in the flagged list
                                    const isRed = flagged.some(flagged => item.toLowerCase().includes(flagged));
                                    const separator = index === ingredients.length - 1 ? "" : ", ";

                                    return (
                                        <Text
                                            key={index}
                                            style={{
                                                fontSize: 15,
                                                color: isRed ? "#dc2626" : theme.text,
                                                fontWeight: isRed ? "700" : "400",
                                                lineHeight: 22,
                                            }}
                                        >
                                            {item}{separator}
                                        </Text>
                                    );
                                })
                            ) : (
                                <Text style={{ color: theme.text, fontSize: 16, textAlign: "center", width: '100%' }}>
                                    {t("noIngredientsDetectedMessage")}
                                </Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <Text style={{ color: theme.text, fontSize: 16, textAlign: "center" }}>
                        {t("pointCameraAtIngredientsMessage")}
                    </Text>
                )}
            </DefaultCard>
        </View>
    );
}