import React from 'react'
import "./Login.css"

function Login({inImage}) 
{
	const checkPassword = () => {
		const loginValue = document.querySelector(".login-code").value;
		if(loginValue === "scanda")
			document.querySelector(".login").style.display = "none";
		else
			alert("Codigo incorrecto");
	}

	return (
		<div className="login">
			<img src={inImage} />
			<label>Código de seguridad</label>
    		<input type="text" name="name" className="login-code"/>
			<a onClick={checkPassword}><span>Entrar</span></a>
		</div>
	)
}

export default Login