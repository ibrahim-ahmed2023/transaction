let userNameInput = document.getElementById('userNameInput');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');
let signUpBtn = document.getElementById('signUpBtn');
let alertMassage = document.getElementById('alertMassage');
let userContainer = [];

if (localStorage.getItem('Users') != null) {
    userContainer = JSON.parse(localStorage.getItem('Users'));
}


function signUp() {
    var data = {
        userName: userNameInput.value,
        email: emailInput.value,
        passwrod: passwordInput.value
    }
    if (checkInputsEmpty() == true) {
        getAlertMessage('All Inputs Required', 'red');
    }
    else if(checkEmailExist() == true) {
            getAlertMessage('Email Already Exist', 'red');
    }

    else if(!emailValidation()) {
            getAlertMessage('Email not valid *exemple@yyy.zzz' , 'red');
        }
    else if(!passwordValidation()) {
            getAlertMessage('Enter valid password *Minimum eight characters, at least one letter and one number:*' , 'red');
        }
    else
        {
            userContainer.push(data);
            localStorage.setItem('Users', JSON.stringify(userContainer));
            clrFrorm();
            getAlertMessage('Success', 'green');
            window.location.href = '../index.html';
        }
    }



function getAlertMessage(text, color) {
    alertMassage.classList.replace('d-none', 'd-block');
    alertMassage.innerHTML = text;
    alertMassage.style.color = color;
}


function clrFrorm() {
    userNameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
}


function checkInputsEmpty() {
    if (userNameInput.value == '' || emailInput.value == '' || passwordInput.value == '')
        return true;
    else
        return false;
}
function checkEmailExist() {
    for (let i = 0; i < userContainer.length; i++) {
        if (userContainer[i].email == emailInput.value)
            return true;
    }
}
function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}
function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}



signUpBtn.addEventListener('click', signUp)

