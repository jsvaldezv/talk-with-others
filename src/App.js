import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import './App.css';

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";

import Login from "./Components/Login.js"

import LogoScanda from "./assets/logoScanda.png";

firebase.initializeApp({
	// PUT ALL YOU FIREBASE INFO HERE (API KEY, AUTH DOMAIN, ETC)
})

const auth = firebase.auth();
const firestore = firebase.firestore();

const deleteData = () => {
	firestore.collection("messages").get().then(querySnapshot => {
		for(var i = 0; i < querySnapshot.size; i++)
			querySnapshot.docs[i].ref.delete();
	});

	auth.signOut();
}

function App()
{
	const [user] = useAuthState(auth);
	const [date, setDate] = useState("");

	return (
		<div className="App">
			
			<Helmet> <title>Comunidad Scanda</title> </Helmet>
			
			<Login inImage={LogoScanda}/>

			<header>
				<img src={LogoScanda} className="logoScanda"/>
				<SignOut />
			</header>

			<section className="app_main">
				{user ? <ChatRoom /> : <SignIn/>}
			</section>
			
		</div>
  );
}

function SignIn()
{
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	}
	return(
		<>
			<div className="app_signIn">
				<h2>Bienvenido/a a este espacio que es para ti</h2>
				<div className="app_signInButton">
					<button className="sign-in" onClick={signInWithGoogle}>Entrar con Google</button>
					<p>¡Recuerda ser amable y usar esta herramienta con responsabilidad!</p>
				</div>
				<p className="app_signIn_footer">Si quieres saber más de nuestros programas, escribenos en comunidad@scanda.com.mx</p>
			</div>
	  	</>
	)
}

function SignOut()
{
	return auth.currentUser && (
		<button className="sign-out" onClick={deleteData}>Sign Out</button>
	)
}

function ChatRoom()
{
	const dummy = useRef();
	const messagesRef = firestore.collection("messages");
	const query = messagesRef.orderBy('createdAt').limit(25);

	const [messages] = useCollectionData(query, {idField: 'id'});
	const [formValue, setFormValue] = useState('');
	var test = 0;

	const deleteData = () => {
		if(test == 0)
			messagesRef.delete();
	}

	const sendMessage = async (e) => {
		e.preventDefault();
	
		const { uid, photoURL } = auth.currentUser;
	
		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL
		}); 
	
		setFormValue('');
		dummy.current.scrollIntoView({ behavior: 'smooth' });
		deleteData();
	}

	return (
		<>
			<main class="main_chat">
				{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
				<span ref={dummy}></span>
			</main>

			<form onSubmit={sendMessage}>
				<input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="¡Di algo!" />
				<button type="submit" disabled={!formValue}>Enviar</button>
			</form>
  		</>
	)
}

function ChatMessage(props)
{
	const {text, uid, photoURL} = props.message;
	const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
	return (
		<>
			<div className={`message ${messageClass}`}>
		  		<img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
		  		<p>{text}</p>
			</div>
		</>
	)
}

export default App;