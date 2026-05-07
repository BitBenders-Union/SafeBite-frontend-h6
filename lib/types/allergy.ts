// /lib/types/allergy.ts

export type Allergy = {
    id: string;
    name: string;
    icon?: string | null;
};

export type CreateAllergyRequest = {
    name: string;
    icon?: string | null;
};

export type CreateAllergyResponse = {
    id: string;
    name: string;
    icon?: string | null;
};

export type UpdateAllergyRequest = {
    id: string;
    name: string;
    icon?: string | null;
};

export type CustomAllergy = {
    id: string;
    name: string;
};

export type AllergyUser = {
    userId: string;
    allergyId: string;
    allergyName: string;
};

