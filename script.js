const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const spinner = document.getElementById("spinner");
const btnText = document.querySelector(".btn-text");
const honeypot = document.getElementById("company");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (honeypot.value) {
    return;
  }

  submitBtn.disabled = true;
  spinner.style.display = "inline-block";
  submitBtn.textContent = "Sending...";

  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      status.textContent = "Thanks! Your message has been sent.";
      status.classList.add("success");
      status.classList.remove("error");
      form.reset();
    } else {
      status.textContent = "Oops! something went wrong.";
      status.classList.add("error");
      status / classList.remove("success");
    }
  } catch (error) {
    status.textContent = "Network error, Please try again.";
    status.classList.add("error");
    status.classList.remove("success");
  }

  submitBtn.disabled = false;
  spinner.style.display = "none";
  submitBtn.textContent = "SEND MESSAGE";
});
