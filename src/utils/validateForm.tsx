import type { Participant, ValidatedParticipant } from "../types/Participant";

export const validateForm = (formData: ValidatedParticipant) => {
    const errors: Partial<Record<keyof Participant, string>> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.name) {
        errors.name = "Name is required";
    } else if (formData.name.length < 3) {
        errors.name = "Name must be at least 3 characters long";
    } else if (formData.name.length > 40) {
        errors.name = "Name must be less than 40 characters long";
    }

    if (!formData.email) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
        errors.email = "Email address is invalid";
    }

    if (!formData.birthdate) {
        errors.birthdate = "Birthdate is required";
    } else if (new Date(formData.birthdate) >= new Date()) {
        errors.birthdate = "Birthdate must be in the past";
    } else if (new Date(formData.birthdate) < new Date("1900-01-01")) {
        errors.birthdate = "Birthdate must be after 1900-01-01";
    }

    return errors;
}