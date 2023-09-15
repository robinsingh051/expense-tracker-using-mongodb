// Put DOM elements into variables
const myForm = document.querySelector("#my-form");
const emailInput = document.querySelector("#email");
const msg = document.querySelector(".msg");

// Listen for form submit
myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  if (emailInput.value === "") {
    msg.classList.add("error");
    msg.textContent = "Please enter the email id";
    setTimeout(() => {
      msg.textContent = "";
      msg.classList.remove("error");
    }, 2000);
  } else {
    // Create new details object
    const newDetails = {
      email: emailInput.value,
    };

    console.log(newDetails);

    try {
      // post to backend using axios
      const response = await axios.post(
        "http://52.90.255.137:3000/users/forgetpassword",
        newDetails
      );
      console.log(response.data);
      alert("Password Reset link is sent to given email id");
    } catch (err) {
      console.log(err);
    }
  }
}
