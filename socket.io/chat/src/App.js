import logo from './logo.svg';
import './App.css';
import { useEffect,useState } from 'react';
import io from 'socket.io-client'

function App() {
  let [Message,setMessage] = useState()
  useEffect(() => {
   let socket = io('http://localhost:8022')

   socket.emit("setup",{_id:"1",name:"pratiksha"})
   socket.emit("setup",{_id:"2",name:"omkar"})
   socket.on("connected",()=>console.log("on"))

   socket.emit("join chat","1")
   socket.emit("join chat","2")
   console.log(socket)
 
   socket.emit("new message",{
    "content": "Oh...Very sorry sir.offer is not avaliable right now.",
    "chat": {
      "_id": "632ab265a25fb69e176c57c7",
      "seller": {
        "_id": "62fb280bd152760baaa4d18f",
        "name": "Angular minds",
        "email": "omkar@gmail.com"
      },
      "customer": {
        "_id": "62f62aae806108fe90beab40",
        "name": "Pratiksha Shelke",
        "email": "me2@pratikshashelke.com",
        "picture": "https://i.imgur.com/CR1iy7U.png"
      },
      "createdAt": "2022-09-21T06:42:45.460Z",
      "updatedAt": "2022-09-21T09:01:56.079Z",
      "__v": 0,
      "latestMessage": "632ad3022a339f223459f5e8"
    },
    "sender": {
      "_id": "62fb280bd152760baaa4d18f",
      "name": "Angular minds",
      "email": "omkar@gmail.com"
    },
    "senderType": "organizations",
    "_id": "632c00d5e6765693ca63a7c7",
    "createdAt": "2022-09-22T06:29:41.399Z",
    "updatedAt": "2022-09-22T06:29:41.399Z",
    "__v": 0
  })

    socket.on("message recieved",(newMessage)=>
    {
      setMessage(newMessage)
    })

    socket.emit("typing","1")

    socket.on("typing",()=>
    {
      setMessage(true)
    })
  }, [])  
  console.log(Message)  
  
  return (
    <div className="App">
      hello
    </div>
  );
}

export default App;
