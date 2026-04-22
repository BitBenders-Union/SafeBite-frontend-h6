// /lib/auth/authValidation.ts

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupValidationErrors = {
    firstNameError: string;
    lastNameError: string;
    emailError: string;
    passwordError: string;
    confirmPasswordError: string;
};

type LoginValidationErrors = {
    emailError: string;
    passwordError: string;
};

export function validateSignupForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
): SignupValidationErrors {
    const errors: SignupValidationErrors = {
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
    };

    if (!firstName.trim()) {
        errors.firstNameError = "inputFirstNameError";
    }

    if (!lastName.trim()) {
        errors.lastNameError = "inputLastNameError";
    }

    if (!email.trim()) {
        errors.emailError = "inputEmailError";
    } else if (!emailRegex.test(email)) {
        errors.emailError = "inputValidEmailError";
    }

    if (!password.trim()) {
        errors.passwordError = "inputPasswordError";
    }

    if (!confirmPassword.trim()) {
        errors.confirmPasswordError = "inputConfirmPasswordError";
    } else if (confirmPassword !== password) {
        errors.confirmPasswordError = "inputConfirmPasswordError";
    }

    return errors;
}

export function hasSignupErrors(errors: SignupValidationErrors) {
    return (
        !!errors.firstNameError ||
        !!errors.lastNameError ||
        !!errors.emailError ||
        !!errors.passwordError ||
        !!errors.confirmPasswordError
    );
}

function createEmptyLoginErrors(): LoginValidationErrors {
    return {
        emailError: "",
        passwordError: "",
    };
}

export function validateLoginForm(
    email: string,
    password: string
): LoginValidationErrors {
    const errors = createEmptyLoginErrors();

    if (!email.trim()) {
        errors.emailError = "inputEmailError";
    } else if (!emailRegex.test(email)) {
        errors.emailError = "inputValidEmailError";
    }

    if (!password.trim()) {
        errors.passwordError = "inputPasswordError";
    }

    return errors;
}

export function hasLoginErrors(errors: LoginValidationErrors) {
    return !!errors.emailError || !!errors.passwordError;
}