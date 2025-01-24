let eMail = document.querySelector("#mail")
let password = document.querySelector("#pwd")
let loginBtn = document.querySelector("#submit")

let getE_mail = localStorage.getItem("email")
let getPassword = localStorage.getItem("password")

loginBtn.addEventListener ("click" , function(e){
    e.preventDefault()
    if (eMail.value==="" || password.value===""){
        alert("please fill data ")
    } else {
        if ( (getE_mail && getE_mail.trim() === eMail.value.trim() && getPassword && getPassword === password.value )  )
        {
            setTimeout ( () => {
                window.location = "index.html"
            } , 1500)
        } else {
            alert("username or password is wrong ")
        }
    }
})



