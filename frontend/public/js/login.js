// Put DOM elements into variables
const myForm = document.querySelector("#my-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const msg = document.querySelector(".msg");
const showBtn = document.querySelector("#showBtn");

//toggle the password input type on clicking show button
showBtn.addEventListener("click", toggle);

// Listen for form submit
myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  if (emailInput.value === "" || passwordInput.value === "") {
    msg.classList.add("error");
    msg.textContent = "Please enter all fields";
    setTimeout(() => {
      msg.textContent = "";
      msg.classList.remove("error");
    }, 2000);
  } else {
    // Create new details object
    const userDetails = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    console.log(userDetails);

    try {
      // post to backend using axios
      const response = await axios.post(
        "http://52.90.255.137:3000/users/logIn",
        userDetails
      );
      console.log(response.data);

      //storing token to local storage
      localStorage.setItem("token", response.data.token);

      // Clear fields
      emailInput.value = "";
      passwordInput.value = "";
      window.location.href = "expense.html";
    } catch (err) {
      if (err.response.status === 404) {
        msg.classList.add("error");
        msg.textContent = "User doesn't exist";
      } else if (err.response.status === 401) {
        msg.classList.add("error");
        msg.textContent = "Incorrect password";
      }
      setTimeout(() => {
        msg.textContent = "";
        msg.classList.remove("error");
      }, 2000);
    }
  }
}

function toggle() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
