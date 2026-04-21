import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Image, View } from "react-native";

type Props = { children: React.ReactNode };

export function AuthCard({ children }: Props) {

    const { theme } = useAppTheme();

    return (
        <View className="w-full rounded-2xl border px-6 py-7"
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: theme.shadowCard.color,
                shadowOpacity: theme.shadowCard.opacity,
                shadowRadius: theme.shadowCard.radius,
                shadowOffset: theme.shadowCard.offset,
            }}>


            {/* logo */}
            <View className="mb-6 items-center justify-center">
                <Image
                    source={require("@/assets/images/safebite.png")}
                    style={{
                        width: 160,
                        height: 160,
                        marginBottom: 8,
                    }}
                    resizeMode="contain"
                />
            </View>
            {children}

        </View>


    )
}

