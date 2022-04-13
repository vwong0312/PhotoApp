const form = document.getElementById('form');

form.addEventListener('submit', e =>{
    const userName = document.getElementById('username');
    const password = document.getElementById("password");
    const confirm = document.getElementById('confirm').value;
    let test = []
    let userCase = /(.*[a-zA-Z0-9]){3,}$/;
    let passCase = /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    if(userName.value.match(userCase)){
        alert('Valid Username');
    }else{
        alert('Invalid Username. Must start with a character and be 3 characters long');
        test.push(1);
    }

    if(password.value.match(passCase)){
        alert('Valid Password');
    }else{
        alert('Invalid Password. Must contain at least 1 uppercase letter, number, and special character. Must also be at least 8 characters long');
        test.push(1);
    }
    
    if(password.value != confirm){
        alert('Passwords do not match');
        test.push(1);
    }else{
        alert('Passwords match');
    }

    if(test.length > 0){
        e.preventDefault();
    }
})













