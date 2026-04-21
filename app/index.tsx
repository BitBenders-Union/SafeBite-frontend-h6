// /app/index.tsx
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function Index() {

    const { t } = useTranslation("home");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="bg-blue-500 text-white p-4 rounded"> {t("welcome")}</Text>
    </View>
  );
}
