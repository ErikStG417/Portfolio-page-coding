/** refactored js modular */

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const spinner = document.getElementById("spinner");
const btnText = document.querySelector(".btn-text");
const honeypot = document.getElementById("company");

/** 1: Validation */

function validateForm() {
  let isValid = true;

  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  if (!form.name.value.trim()) {
    document.getElementById("name-error").textContent =
      "Please enter your name.";
    isValid = false;
  }

  if (!form.email.value.trim()) {
    document.getElementById("email-error").textContent =
      "Please enter your email.";
    isValid = false;
  } else if (!form.email.checkValidity()) {
    document.getElementById("email-error").textContent =
      "Please enter a valid email. ";
    isValid = false;
  }

  if (!form.message.value.trim()) {
    document.getElementById("message-error").textContent =
      "Please enter a message.";
    isValid = false;
  }
  return isValid;
}

/** honeypot check */

function isBot() {
  return honeypot.value !== "";
}

/** show status with animation */

function showStatus(message, type = "success") {
  status.classList.remove("success", "error");

  if (type === "success") {
    status.classList.add("success");
    status.innerHTML =
      `<span class="checkmark" aria-hidden="true">&check;</span> ` + message;

    /** auto hide after 5 seconds */

    setTimeout(() => {
      status.textContent = "";
      status.classList.remove("success");
    }, 5000);
  } else {
    status.classList.add("error");
    status.textContent = message;

    /** reset shake animation so it can replay */

    status.style.animation = "none";
    void status.offsetWidth;
    status.style.animation = "";
  }
}

/** fetch with timeout */

function fetchWithTimeout(url, options, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout),
    ),
  ]);
}

/** send form */

async function sendForm(e) {
  e.preventDefault();

  /** validation and bot check */

  if (!validateForm() || isBot()) return;

  /** disable button and show spinner */

  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
  spinner.style.display = "inline-block";
  btnText.textContent = "Sending...";

  const data = new FormData(form);

  try {
    const response = await fetchWithTimeout(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });

    let result = {};
    try {
      result = await response.json();
    } catch {}

    if (response.ok) {
      showStatus("Thanks! Your message has been sent.", "success");
      form.reset();
    } else {
      showStatus(
        result.error || "Something went wrong. Please try again",
        "error",
      );
    }
  } catch (error) {
    showStatus(error.message || "Network error. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
    spinner.style.display = "none";
    btnText.textContent = "SEND MESSAGE";
  }
}

/** attach event listener */

if (form) {
  form.addEventListener("submit", sendForm);
}
