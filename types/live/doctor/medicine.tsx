export interface Medicine {
    id: string;
    name: string;
    type: "tablet" | "liquid" | "injection" | "syrup" | "capsule";
    dosage?: string;
    description?: string;
    strength?: string;
    unit?: string;
}

export interface MedicinesResponse {
    status: boolean;
    message: string;
    data: Medicine[];
}