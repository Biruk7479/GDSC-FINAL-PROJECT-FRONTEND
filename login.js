const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (()=>{
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
  });

  loginBtn.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
  });
  
  signupLink.onclick = (()=>{
    signupBtn.click();
    return false;
  });

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login_form");
  const signupForm = document.getElementById("signup_form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm.querySelector(".name").value;
    const password = loginForm.querySelector(".password").value;

    try {
      const response = await fetch("https://gdsc-final-project-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        window.location.href = "index.html";
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.userEmail);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = signupForm.querySelector("input[placeholder='Name']").value;
    const email = signupForm.querySelector("input[placeholder='Email Address']").value;
    const password = signupForm.querySelector("input[placeholder='Password']").value;
    const confirmPassword = signupForm.querySelector("input[placeholder='Confirm password']").value;

    try {
      const response = await fetch("https://gdsc-final-project-backend.onrender.com/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, confirmPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  });
});
