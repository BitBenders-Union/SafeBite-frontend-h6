// /components/app/admin/iconPicker/iconOptions.ts

export const allergyIconOptions = [
    { label: "Unknown", value: "help-circle-outline" },
    { label: "Apple", value: "food-apple-outline" },
    { label: "Peanut", value: "peanut-outline" },
    { label: "Fish", value: "fish" },
    { label: "Egg", value: "egg-outline" },
    { label: "Milk", value: "cow" },
    { label: "Wheat", value: "wheat" },
    { label: "Cherry", value: "fruit-cherries" },
    { label: "Soy", value: "soy-sauce" },
    { label: "Warning", value: "alert-circle-outline" },
] as const;

export type AllergyIconOption = (typeof allergyIconOptions)[number];