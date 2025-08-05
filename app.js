import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getAuth,
  sendSignInLinkToEmail
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function sendEmailOTP(action) {
  const email = document.getElementById("email").value;
  const message = document.getElementById("message");

  const actionCodeSettings = {
    url: window.location.origin + "/verify.html",
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    localStorage.setItem("action", action);
    message.textContent = "✅ OTP sent to your email!";
  } catch (error) {
    console.error("Failed to send OTP:", error);
    message.textContent = "❌ Could not send OTP.";
  }
}
