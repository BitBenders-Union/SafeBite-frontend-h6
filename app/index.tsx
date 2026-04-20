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
      <Text>{t("welcome")}</Text>
    </View>
  );
}
