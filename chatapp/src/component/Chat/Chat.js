import React, { useEffect, useState } from 'react';
import { user } from '../Join/Join';
import socketIO from 'socket.io-client';
import './Chat.css';
import sendImg from '../../images/send.png';
import Message from '../Message/Message';
import ReactScrollToBottom from 'react-scroll-to-bottom';
import closeImg from '../../images/close.png'

let socket

const ENDPOINT = 'http://localhost:4500/'

const Chat = () => {

  const [id, setId] = useState("")
  const [messages, setMessages] = useState([])

  const send = () => {
    const message = document.getElementById('chatInput').value;
    socket.emit('message', { id, message })
    document.getElementById('chatInput').value = ""
  }

  console.log(messages);
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ['websocket'] });
    socket.on('connect', () => {
      alert("Connected");
      setId(socket.id);
    })
    console.log(socket);
    socket.emit('joined', { user })

    socket.on('welcome', (data) => {
      setMessages([...messages,data])
      console.log(data.user, data.message);
    })

    socket.on('userjoined', (data) => {
      setMessages([...messages,data])
      console.log(data.user, data.message);
    })

    socket.on('leave', (data) => {
      setMessages([...messages,data])
      console.log(data.user, data.message);
    })
    return () => {
      socket.on('disconnect');
      socket.off();
    }
  }, [])
  
  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages([...messages,data])
      console.log(data.user, data.message, data.id);
    })
    
    return () => {
      socket.off();
    }
  }, [messages])



  return (
    <div className='chatPage'>
      <div className="chatConatiner">
        <div className="header">
          <h1>Chat App</h1>
          <a href="/"><img src={closeImg} alt="Close"/></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => <Message user={item.id===id?'':item.user} message={item.message} classs={item.id===id?'right':'left'} />)}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input type="text" id='chatInput' />
          <button onClick={send} className='sendBtn'><img src={sendImg} alt="Send" /></button>
        </div>       
      </div>
    </div>
  )
}

export default Chat