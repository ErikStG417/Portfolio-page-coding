function fetchWithTimeout(url, options, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout),
    ),
  ]);
}

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const spinner = document.getElementById("spinner");
const btnText = document.querySelector(".btn-text");
const honeypot = document.getElementById("company");

function validateform() {
  let isValid = ture;
  const name = form.name;
  const email = form.email;
  const message = from.message;

  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  if (!name.value.trim()) {
    doceument.getelementById("name-error").textContent =
      "Please enter your name.";
    isValid = flase;
  }

  if (!email.value.trim()) {
    document.getElementById("email-error").textContent =
      "Please enter your email.";
    isValid = false;
  } else if (!email.checkValidity()) {
    document.getElementById("email-error").textContent =
      "Please enter a valid email.";
    isValid = false;
  }

  if (!message.value / trim()) {
    document.getElementById("message-error").textContent =
      "Please enter a message.";
    isValid = false;
  }
  return isValid;
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  if (honeypot.value) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
  spinner.style.display = "inline-block";
  submitBtn.textContent = "Sending...";

  const data = new FormData(form);

  try {
    const response = await fetchWithTimeout(form.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      status.classList.add("success");
      status.classList.remove("error");
      status.innerHTML =
        `<span class="checkmark" aria-hidden="true">&check;</span` +
        "Thanks! Your message has been sent.";
      form.reset();

      setTimeout(() => {
        status.textContent = "";
        status.classList.remove("success");
      }, 5000);
    } else {
      status.classList.add("error");
      status.classList.remove("success");

      status.textContent =
        result.error || "Something went wrong. PLease try again.";

      status.style.animation = "none";
      void status.offsetWidth;
      status.style.animation = "";
    }
  } catch (error) {
    status.textContent = "Network error, Please try again.";
    status.classList.add("error");
    status.classList.remove("success");

    status.style.animation = "none";
    void status.offsetWidth;
    status.style.animation = "";
  }

  submitBtn.disabled = false;
  submitBtn.removeAttribute("aria-busy");
  spinner.style.display = "none";
  submitBtn.textContent = "SEND MESSAGE";
});
