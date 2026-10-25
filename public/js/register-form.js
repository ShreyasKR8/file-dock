const registerForm = document.getElementById("register-form");
const passwordInput = document.getElementById("password");
const passwordToggle = document.querySelector(".password-toggle");

if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        const invalidFields = Array.from(registerForm.querySelectorAll(":invalid"));

        if (invalidFields.length === 0) {
            return;
        }

        event.preventDefault();

        const messages = invalidFields.map((field) => {
            const label = registerForm.querySelector(`label[for="${field.id}"]`);
            const fieldName = label ? label.textContent.trim() : field.name;

            if (field.validity.valueMissing) {
                return `${fieldName} is required.`;
            }

            if (field.validity.typeMismatch && field.type === "email") {
                return "Please enter a valid email address.";
            }

            return `${fieldName} is invalid.`;
        });

        const errorContainer = document.getElementById("register-errors");

errorContainer.replaceChildren();

for (const message of new Set(messages)) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    errorContainer.append(paragraph);
}

errorContainer.hidden = false;
invalidFields[0].focus();
    });
}

passwordToggle.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";
  passwordToggle.setAttribute("aria-pressed", String(!isPasswordVisible));
  passwordToggle.setAttribute(
    "aria-label",
    isPasswordVisible ? "Show password" : "Hide password",
  );
});