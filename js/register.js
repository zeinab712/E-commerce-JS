let fName = document.querySelector("#f-name")
let Lname = document.querySelector("#l-name")
let email = document.querySelector("#mail")
let password = document.querySelector("#pwd")
let submit_btn = document.querySelector("#submit")

submit_btn .addEventListener ("click" , function (e){
    e.preventDefault()
    if (fName.value===""|| Lname.value==="" || email.value==="" || password.value ===""){
        alert("please fill data")
    } else {
        localStorage.setItem("fName" , fName.value);
        localStorage.setItem("Lname" , Lname.value);
        localStorage.setItem("email" , email.value);
        localStorage.setItem("password" , password.value); 

        setTimeout ( () => {
            window.location = "login.html"
        } , 1500)
    }
})

