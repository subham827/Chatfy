
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useFirestore } from 'react-firebase-hooks/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';
import { useRef } from 'react';



firebase.initializeApp({
  apiKey: "AIzaSyBhCgs4zF_sEMAzPRG6jtdQZOKOskYmZ_8",
  authDomain: "firechat-d541b.firebaseapp.com",
  projectId: "firechat-d541b",
  storageBucket: "firechat-d541b.appspot.com",
  messagingSenderId: "189780060738",
  appId: "1:189780060738:web:2e876427000b26a98c1bdb",
  measurementId: "G-3C3RMR9PLB"
})
const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
   <>
<header>
  {/* <h1>Firechat</h1> */}
  {/* <h2>{user ? `Welcome ${user.displayName}` : 'Please sign in'}</h2> */}
  <section>
    {user ? <ChatRoom></ChatRoom> : <SignIn></SignIn>}
  </section>
</header>
   </>
  );
}
const SignIn = () => {
  const signinwithgoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
     firebase. auth().signInWithPopup(provider);
  }
return (
  <>
  <center><h1 style={{"color": "white"}}>Chat<span style={{"color":"green"}}>fy</span></h1><hr /></center>
    <button onClick={signinwithgoogle}>Sign in with Google</button>
  </>
)
}
const ChatRoom = () =>{
  const messagesRef = firestore.collection('messages');
  
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  console.log(messages);
  const [formValue, setFormValue] = useState('');
  const dummy = useRef()
  const sendMessage = async(e) => {
    e.preventDefault();
   await messagesRef.add({
      text: formValue,
      createdAt: new Date(),
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
   const playMusic = () => {
    const audio = new Audio('/Ting Sound Effect.mp3');
    audio.play();

  }
  useEffect(()=>{
    playMusic();
  },[messages])
return (
  <>
  <SignOut></SignOut>
    {/* <h1>Chat Room</h1> */}
    <h1 style={{"color" : "white"}}>{auth.currentUser.displayName}'s <span style={{"color" : "green"}}>Chatroom</span></h1>
    
   <main>


   {messages ?( messages.map(messages => (
      <ChatMessage key={messages.id} message={messages} messagesRef={messagesRef} />
    ))) : <p style={{"color" : "white"}}>Chats loading 🔃 </p>}

    <div ref={dummy}></div>
   </main>
   
   <form onSubmit={sendMessage}>
    <input type="text" value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>

    <button type="submit">👉</button>
   </form>

  </>
)

}
const ChatMessage = ({message}) => {

  
   const messageClass = message.uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
    
      <img src = {message.photoURL} alt="some photo"></img>
      <p>{message.text}</p>
    </div>
  )
}
const SignOut = () => {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} style={{"backgroundColor" : "purple"}}>
      Sign out</button>
  )
}
export default App;
