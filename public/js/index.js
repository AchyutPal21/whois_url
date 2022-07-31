"use strict";

const addUrlTextArea = document.querySelector("#domaininput");
const sendUrlBtn = document.querySelector(".submit_domain_btn");
const showUrlDetailsDiv = document.querySelector(".input_url_info");
const clipboardBtn = document.getElementById("clipboardbtn");
const form = document.querySelector(".urlForm");

// Toast Message
const toastObj = {
  toast: document.querySelector(".toast"),
  audio: document.querySelector("#toastaudio"),

  init() {
    this.hideTimeout = null;
  },

  show(message, state) {
    clearTimeout(this.hideTimeout);

    this.audio.play();
    this.toast.textContent = message;
    this.toast.className = "toast toast__visible";
    if (state) {
      this.toast.classList.add(`toast__${state}`);
    }

    this.hideTimeout = setTimeout(() => {
      this.toast.classList.remove("toast__visible");
    }, 5000);
  },
};

// Copy to clipboard function
async function copyToClipboard(data) {
  try {
    await navigator.clipboard.writeText(data);
    toastObj.show("Copied to Clipboard", "success");
  } catch (error) {
    toastObj.show(`Error while ${error.message}`, "error");
  }
}

// Copy to clipboard button
clipboardBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const showDetailTextArea = document.querySelector("#domaininfo");
  if (!showDetailTextArea) {
    return;
  }
  const data = showUrlDetailsDiv.textContent;
  copyToClipboard(data);
});

// Send URL to the server
async function sendURL(data) {
  try {
    const url = "http://localhost:3000/";
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });
    const getData = await response.json();

    if (getData) {
      showUrlDetailsDiv.innerHTML = "";
      const html = `<pre name="domain_name_input" id="domaininfo" readonly></pre>`;
      showUrlDetailsDiv.insertAdjacentHTML("beforeend", html);
      document.querySelector("#domaininfo").innerHTML = JSON.stringify(
        getData,
        undefined,
        2
      );
    }
  } catch (error) {
    toastObj.show(`Error while ${error.message}`, "error");
  }
}

// Extract URL Button
form.addEventListener("submit", function (event) {
  event.preventDefault();

  showUrlDetailsDiv.innerHTML = "";

  if (addUrlTextArea.value === "") return;

  if (!document.querySelector(".spinner")) {
    const html = `<div class="spinner"></div>`;
    showUrlDetailsDiv.insertAdjacentHTML("beforeend", html);
  }

  const formData = new FormData(this);
  const data = new URLSearchParams(formData);
  sendURL(data);
});

// On Loading of the DOM
document.addEventListener("DOMContentLoaded", toastObj.init());
