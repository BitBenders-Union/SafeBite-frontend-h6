// app/(app)/scan.tsx
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    View,
} from "react-native";

import AllergyAlert from "@/components/app/mobil/scan/Alert";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { analyzeImage } from "@/services/api/scanApi";
import AnalysisResult from "../../../components/app/mobil/scan/AnalysisResult";
import HourglassLoader from "../../../components/app/mobil/scan/HourglassLoader";
import PermissionRequest from "../../../components/app/mobil/scan/PermissionRequest";

export default function Scan() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("scan");
    const [permission, requestPermission] = useCameraPermissions();

    const [isCapturing, setIsCapturing] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [detectedAllergens, setDetectedAllergens] = useState<string[]>([]);

    const [qualityMessage, setQualityMessage] = useState<string | null>(null);
    const [isCameraTooWeak, setIsCameraTooWeak] = useState(false);
    const [hasTestedHardware, setHasTestedHardware] = useState(false);

    const cameraRef = useRef<CameraView>(null);

    const HARD_FAIL_MS = 120000;

    const screenHeight = Dimensions.get("window").height;
    const cameraHeight = screenHeight * 0.28;
    const buttonOverlap = cameraHeight * 0.18;

    // Validate Picture Quality Based on Dimensions 
    const validatePhotoQuality = (photo: any) => {
        const width = photo.width || photo.exif?.PixelXDimension || 0;
        const height =
            photo.height ||
            photo.exif?.PixelYDimension ||
            0;

        if (width < 400 || height < 400) {
            setIsCameraTooWeak(true);
            setQualityMessage(t("FailedCameraResToLow"));
            return false;
        }

        setQualityMessage(null);
        setIsCameraTooWeak(false);
        return true;
    };

    const handleTakePhoto = async () => {
        if (!cameraRef.current) return;

        try {
            setIsCapturing(true);
            setAnalysisResult(null);
            setShowAlert(false);
            setQualityMessage(null);
            setDetectedAllergens([]);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
                exif: true,
            });

            if (!photo?.uri) return;

            const valid = validatePhotoQuality(photo);
            if (!valid) {
                setIsCapturing(false);
                return;
            }


            setPhotoUri(photo.uri);
            await uploadToBackend(photo);
        } catch (err) {
            console.error(t("FailedPhotoCapture"), err);
            setQualityMessage(t("FailedPhotoCapture"));
        } finally {
            setIsCapturing(false);
        }
    };

    const uploadToBackend = async (photo: any) => {
        setIsUploading(true);
        const startedAt = Date.now();
        console.log("[OCR] Backend upload started via scanApi");

        const hardTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("HARD_TIMEOUT")), HARD_FAIL_MS);
        });

        try {
            const apiPromise = analyzeImage(photo, {
                timeoutMs: HARD_FAIL_MS + 2000,
            });

            const result = await Promise.race([apiPromise, hardTimeoutPromise]);

            const ms = Date.now() - startedAt;
            console.log(`[OCR] Success in ${ms}ms`, result);

            setQualityMessage(null);

            // Maps detectedAllergies from DTO to a list of names
            const detectedNames = result.detectedAllergies?.map(allergi => allergi.allergyName) || [];
            
            setDetectedAllergens(detectedNames);
            
            // show alert only if allergens were detected
            if (detectedNames.length > 0) {
                setShowAlert(true);
            } else {
                setShowAlert(false);
            }

            // saves the entire result as text for the AnalysisResult component
            setAnalysisResult(JSON.stringify(result, null, 2));
        } catch (error: unknown) {
            const ms = Date.now() - startedAt;

            if (error instanceof Error && error.message === "HARD_TIMEOUT") {
                console.log(`[OCR] Hard fail at ${ms}ms`);
                setQualityMessage(t("ScanTimedOutSuggestHistory"));
            } else {
                console.log(`[OCR] Failed after ${ms}ms`, error);
                setQualityMessage(t("ScanFailedTryHistory"));
            }

            setDetectedAllergens([]);
            setShowAlert(false);
            setAnalysisResult(
                JSON.stringify({ error: t("FailedtoAnalyze") }, null, 2)
            );
        } finally {
            setIsUploading(false);
        }
    };

    // Tests camera hardware on initial ready
    const handleCameraReady = async () => {
        if (hasTestedHardware) return;
        setHasTestedHardware(true);

        if (!cameraRef.current) return;

        try {
            if (Platform.OS === "web") {
                await new Promise((resolve) => setTimeout(resolve, 1200));
            }

            const testPhoto = await cameraRef.current.takePictureAsync({
                quality: 0.2,
                base64: false,
                exif: true,
            });

            if (testPhoto) validatePhotoQuality(testPhoto);
        } catch (err) {
            console.warn("Hardware test failed:", err);
        }
    };

    if (!permission) return <View />;

    if (!permission.granted) {
        return <PermissionRequest onGrant={requestPermission} />;
    }

    return (
        <View className="flex-1 bg-transparent">
            {/* Show only alert if there is found allergy */}
            {showAlert && (
                <AllergyAlert
                    allergens={detectedAllergens}
                    onClose={() => setShowAlert(false)}
                />
            )}

            <ScrollView
                contentContainerStyle={{
                    alignItems: "center",
                    paddingTop: 20,
                    paddingBottom: 120,
                }}
            >
                <View
                    style={{
                        width: "85%",
                        height: cameraHeight + buttonOverlap,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            height: cameraHeight,
                            backgroundColor: theme.surfaceStrong,
                            borderRadius: 16,
                            overflow: "hidden",
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: theme.shadowCard.color,
                            shadowOpacity: theme.shadowCard.opacity,
                            shadowOffset: theme.shadowCard.offset,
                            shadowRadius: theme.shadowCard.radius,
                            elevation: 6,
                        }}
                    >
                        {photoUri ? (
                            <Image
                                source={{ uri: photoUri }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        ) : (
                            <CameraView
                                ref={cameraRef}
                                style={{ width: "100%", height: "100%" }}
                                facing="back"
                                autofocus="on"
                                onCameraReady={handleCameraReady}
                            />
                        )}
                    </View>

                    <Pressable
                        testID="ScanButton"
                        onPress={
                            photoUri
                                ? () => {
                                    setPhotoUri(null);
                                    setAnalysisResult(null);
                                    setShowAlert(false);
                                    setQualityMessage(null);
                                    setDetectedAllergens([]);
                                }
                                : handleTakePhoto
                        }
                        disabled={isCapturing || isUploading || isCameraTooWeak}
                        style={{
                            position: "absolute",
                            bottom: buttonOverlap / 5,
                            alignSelf: "center",
                            width: 74,
                            height: 74,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                            isUploading || isCapturing
                            ? theme.card
                            : isCameraTooWeak
                            ? theme.scanButtonDangerBg
                            : theme.scanButtonBg,
                            borderColor: theme.scanButtonBorder,
                            opacity: isUploading ? 0.9 : 1,
                            borderRadius: 37,
                            borderWidth: 3,
                            shadowColor: theme.shadowCard.color,
                            shadowOpacity: theme.shadowCard.opacity,
                            shadowOffset: theme.shadowCard.offset,
                            shadowRadius: theme.shadowCard.radius,
                            elevation: 6,
                        }}
                    >
                        {isUploading ? (
                            <HourglassLoader size={38} />
                        ) : (
                            <Ionicons
                                name={photoUri ? "refresh" : "camera"}
                                size={32}
                                color={theme.text}
                            />
                        )}
                    </Pressable>
                </View>

                <AnalysisResult
                    isCapturing={isCapturing}
                    isUploading={isUploading}
                    analysisResult={analysisResult}
                    errorMessage={qualityMessage}
                    isHardwareTesting={!hasTestedHardware}
                />
            </ScrollView>
        </View>
    );
}