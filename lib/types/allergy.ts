// /lib/types/allergy.ts

export type Allergy = {
    id: string;
    name: string;
    icon?: string | null;
};

export type CreateAllergyRequest = {
    name: string;
};

export type CreateAllergyResponse = {
    id: string;
    name: string;
};

export type UpdateAllergyRequest = {
    id: string;
    name: string;
};