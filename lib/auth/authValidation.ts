// /lib/auth/authValidation.ts

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupValidationErrors = {
    emailError: string;
    passwordError: string;
    confirmPasswordError: string;
};

type LoginValidationErrors = {
    emailError: string;
    passwordError: string;
};

export function validateEmail(email: string): string {
    if (!email.trim()) {
        return "inputEmailError";
    }

    if (!emailRegex.test(email)) {
        return "inputValidEmailError";
    }

    return "";
}

export function isPasswordStrong(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isLongEnough;
}

export function validatePassword(password: string): string {
    if (!password.trim()) {
        return "inputPasswordError";
    }

    if (!isPasswordStrong(password)) {
        return "inputPasswordRulesError";
    }

    return "";
}

export function validateConfirmPassword(
    password: string,
    confirmPassword: string
): string {
    if (!confirmPassword.trim()) {
        return "inputConfirmPasswordError";
    }

    if (confirmPassword !== password) {
        return "passwordsDoNotMatchError";
    }

    return "";
}

export function validateSignupForm(
    email: string,
    password: string,
    confirmPassword: string
): SignupValidationErrors {
    return {
        emailError: validateEmail(email),
        passwordError: validatePassword(password),
        confirmPasswordError: validateConfirmPassword(password, confirmPassword),
    };
}

export function hasSignupErrors(errors: SignupValidationErrors): boolean {
    return (
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

    errors.emailError = validateEmail(email);

    if (!password.trim()) {
        errors.passwordError = "inputPasswordError";
    }

    return errors;
}

export function hasLoginErrors(errors: LoginValidationErrors): boolean {
    return !!errors.emailError || !!errors.passwordError;
}