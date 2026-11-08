// ---- Site settings: change these before deploying ----
const CONFIG = {
  // Where enquiries go if no form endpoint is set (opens the visitor's email app).
  email: "info@npm247.co.za",
  // Optional: a form endpoint that accepts POSTed JSON (e.g. Formspree, n8n webhook, your own API).
  // Leave empty to use the email fallback.
  formEndpoint: ""
};

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Email links
document.querySelectorAll(".js-email").forEach((a) => {
  a.href = "mailto:" + CONFIG.email;
  a.textContent = CONFIG.email;
});

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const list = document.getElementById("nav-list");
toggle.addEventListener("click", () => {
  const open = list.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
});
list.addEventListener("click", (e) => {
  if (e.target.closest("a") && list.classList.contains("open")) toggle.click();
});

// Enquiry form
const form = document.getElementById("enquiry");
const status = form.querySelector(".form-status");

function setError(input, msg) {
  const field = input.closest(".field");
  let err = field.querySelector(".err");
  if (msg) {
    input.setAttribute("aria-invalid", "true");
    if (!err) {
      err = document.createElement("span");
      err.className = "err";
      err.id = input.id + "-err";
      field.appendChild(err);
      input.setAttribute("aria-describedby", err.id);
    }
    err.textContent = msg;
  } else {
    input.removeAttribute("aria-invalid");
    if (err) err.remove();
  }
}

function validate() {
  let first = null;
  const checks = [
    ["f-name", (v) => v.trim() ? "" : "Enter your name."],
    ["f-company", (v) => v.trim() ? "" : "Enter your company name."],
    ["f-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter an email address like name@company.co.za."]
  ];
  for (const [id, fn] of checks) {
    const el = document.getElementById(id);
    const msg = fn(el.value);
    setError(el, msg);
    if (msg && !first) first = el;
  }
  if (first) first.focus();
  return !first;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";
  if (form.website.value) return; // spam trap
  if (!validate()) return;

  const data = Object.fromEntries(new FormData(form));
  delete data.website;

  if (CONFIG.formEndpoint) {
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.className = "form-status ok";
      status.textContent = "Enquiry sent. We'll reply within one working day.";
    } catch {
      status.className = "form-status bad";
      status.textContent = "Your enquiry didn't send. Check your connection and try again, or email " + CONFIG.email + ".";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send enquiry";
    }
    return;
  }

  // Email fallback
  const body = [
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "-"}`,
    `Employees: ${data.size}`,
    `Need: ${data.need}`,
    "",
    data.message || ""
  ].join("\n");
  const subject = `Gap assessment enquiry — ${data.company}`;
  window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.className = "form-status ok";
  status.textContent = "Your email app should open with the enquiry filled in. Press send there to finish.";
});
