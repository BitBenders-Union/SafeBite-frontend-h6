// components/scan/AnalysisCard.tsx
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
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

        const timer = setTimeout(() => {
            setShowAfterHardwareDelay(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [isHardwareTesting]);

    let parsed: any = null;

    try {
        if (analysisResult) {
            parsed = JSON.parse(analysisResult);
        }
    } catch { }

    const ingredients: string[] =
        parsed?.aiResult?.inputs_Ingredients || parsed?.ingredients || [];

    const flagged: string[] =
        parsed?.aiResult?.flaggedIngredients || parsed?.flaggedIngredients || [];

    const allergens: string[] =
        parsed?.aiResult?.matchedAllergy || parsed?.allergens || [];

    const severity: string =
        parsed?.aiResult?.overallRisk || parsed?.severity || "none";

    const hasAllergy = allergens.length > 0;

    const severityColor =
        severity === "high"
            ? "text-red-500"
            : severity === "moderate"
                ? "text-orange-500"
                : severity === "low"
                    ? "text-green-600"
                    : "text-gray-500";

    return (
        <View className="w-[85%] mt-6">
            <DefaultCard>
                {isHardwareTesting || !showAfterHardwareDelay ? (
                    <Text style={{
                        color: theme.text,
                        fontSize: 16,
                        textAlign: "center"
                    }}
                    >
                        {t("hardwareTestRunningMessage")}
                    </Text>
                ) : isCapturing ? (
                    <Text style={{
                        color: theme.text,
                        fontSize: 16,
                        textAlign: "center"
                    }}
                    >
                        {t("capturingPhotoMessage")}
                    </Text>
                ) : isUploading ? (
                    <View className="items-center">
                        <ActivityIndicator size="large" color="black" />
                        <Text style={{
                            color: theme.text,
                            fontSize: 16,
                            textAlign: "center"
                        }}
                        >
                            {t("uploadingAndAnalyzingMessage")}
                        </Text>
                    </View>
                ) : errorMessage ? (
                    <View className="items-center">
                        <Text style={{
                            color: theme.warningText,
                            fontSize: 16,
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                        >
                            {errorMessage}
                        </Text>
                    </View>
                ) : parsed ? (
                    <View>
                        <Text style={{
                            color: theme.text,
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 8,
                        }}
                        >
                            {t("analysisResultTitle")}
                        </Text>

                        {hasAllergy ? (
                            <View className="mb-3">
                                <Text style={{
                                    color: theme.warningText,
                                    fontWeight: "600"
                                }}
                                >
                                    {t("allergensFoundLabel")}: {allergens.join(", ")}
                                </Text>

                                {severity && (
                                    <Text className={`${severityColor} mt-1`}>
                                        {t("severityLabel")}: {severity}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Text
                                style={{
                                    color: theme.successText,
                                    fontWeight: "600",
                                    marginBottom: 12,
                                }}
                                className="text-green-600 font-semibold mb-3">
                                {t("noAllergensFoundMessage")}
                            </Text>
                        )}

                        <View className="h-[1px] bg-gray-300 my-3" />

                        <Text className="text-base flex-wrap leading-relaxed">
                            {ingredients.length > 0 ? (
                                ingredients.map((item, index) => {
                                    const isFlagged = flagged.some(
                                        (f) => f.toLowerCase() === item.toLowerCase()
                                    );

                                    const separator =
                                        index === ingredients.length - 1 ? "" : ", ";

                                    return (
                                        <Text
                                            key={index}
                                            className={
                                                isFlagged
                                                    ? "text-red-600 font-semibold"
                                                    : ""
                                            }
                                        >
                                            {item}
                                            {separator}
                                        </Text>
                                    );
                                })
                            ) : (
                                <Text
                                    style={{
                                        color: theme.text,
                                        fontSize: 16,
                                        textAlign: "center"
                                    }}>
                                    {t("noIngredientsDetectedMessage")}
                                </Text>
                            )}
                        </Text>
                    </View>
                ) : (
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                            textAlign: "center"
                        }}>
                        {t("pointCameraAtIngredientsMessage")}
                    </Text>
                )
                }
            </DefaultCard >
        </View >
    );
}