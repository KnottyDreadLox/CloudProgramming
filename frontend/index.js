const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

async function submitLoginInfo() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const url = `http://localhost:3001/login?email=${email}&password=${password}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  if (response.data.result === "success") {
    console.log("Hello " + response.data.name);
  } else {
    console.log("Invalid credentials");
  }
}

async function submitRegisterInfo() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rpassword = document.getElementById("rpassword").value;
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const url = `http://localhost:3001/register?email=${email}&password=${password}&name=${name}&surname=${surname}`;

  //check if email address is in the correct format
  //check if the two passwords match
  if (validateEmail(email) && password === rpassword) {
    const headers = {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
    };
    const response = await axios.post(url, headers);
    if (response.data.result === "success") {
      console.log("Hello " + response.data.name);
    } else {
      console.log("Invalid credentials");
    }
  }
}

var whole = /^\+?[0-9 \.-]+$/

const ValidateNameSurname = (input) => {

    // input only contains valid things
    if (!input.test(whole)) { return "Input must contain only numbers, spaces, and + . or -"; }

    return "Valid input";
}