// Put DOM elements into variables
const myForm = document.querySelector("#my-form");
const nameInput = document.querySelector("#name");
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
  if (
    nameInput.value === "" ||
    emailInput.value === "" ||
    passwordInput.value === ""
  ) {
    msg.classList.add("error");
    msg.textContent = "Please enter all fields";
    setTimeout(() => {
      msg.textContent = "";
      msg.classList.remove("error");
    }, 2000);
  } else {
    // Create new details object
    const newDetails = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    console.log(newDetails);

    try {
      // post to backend using axios
      const response = await axios.post(
        "http://52.90.255.137:3000/users/signUp",
        newDetails
      );
      console.log(response.data);
      // Clear fields
      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      window.location.href = "login.html";
    } catch (err) {
      msg.classList.add("error");
      msg.textContent = "User Already exists";
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
