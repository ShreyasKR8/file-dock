const passwordInput = document.getElementById("password");
const passwordToggle = document.querySelector(".password-toggle");

passwordToggle.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";
  passwordToggle.setAttribute("aria-pressed", String(!isPasswordVisible));
  passwordToggle.setAttribute(
    "aria-label",
    isPasswordVisible ? "Show password" : "Hide password",
  );
});
