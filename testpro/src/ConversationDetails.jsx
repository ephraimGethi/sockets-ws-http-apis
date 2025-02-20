import React from 'react'
import useWebSocket from 'react-use-websocket'
import { useState, useEffect } from 'react';
const ConversationDetails = ({ condetails, token, conversationId, username }) => {
  const [newMessage, setNewMessage] = useState("")
  const loggedInUser = condetails?.conversation?.users.find((user) => user.username == username)
  // const myusername = loggedInUser.username
  // const otheruser = condetails?.conversation?.users.find((user)=>user.username !== username)
  // const otheruserid = otheruser.id
  let myUsername = null;
  let otherUserId = null;
  let otherUsername = null;


  if (loggedInUser) {
    myUsername = loggedInUser.username;
    const otherUsers = condetails?.conversation?.users.filter(user => user.id !== loggedInUser.id);

    if (otherUsers.length === 1) {
      otherUserId = otherUsers[0].id;
      otherUsername = otherUsers[0].username;
    } else if (otherUsers.length > 1) {
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      otherUserId = randomUser.id;
      otherUsername = randomUser.username
    }
  }
  const [realtimeMessages, setRealtimeMessages] = useState([])


  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://127.0.0.1:8000/ws/${conversationId}/?token=${token}`, {
    share: false,
    shouldReconnect: () => true,
  })
  useEffect(() => {
    setRealtimeMessages([])
  }, [])
  useEffect(() => {
    console.log("connection state changed", readyState)
  }, [readyState])
  useEffect(() => {
    if (lastJsonMessage && typeof lastJsonMessage === 'object' && "name" in lastJsonMessage) {
      console.log('message received')
      const message = {
        id: "",
        name: lastJsonMessage.name,
        body: lastJsonMessage.body,
        createdBy: myUsername,
        conversationId: conversationId,
        sentto: otherUsername,
      }
      setRealtimeMessages((realtimemessages) => [...realtimemessages, message])
    }
  }, [lastJsonMessage])
  const sendMessage = async () => {
    console.log('send message')
    sendJsonMessage({
      event: 'chat_message',
      data: {
        body: newMessage,
        name: myUsername,
        sent_to_id: otherUserId,
        conversation_id: conversationId
      }
    });
    setNewMessage("")
  }
  return (
    <div>
      <div className='inbox-mes'>
        {condetails && condetails.messages && Array.isArray(condetails.messages) && condetails.messages.map((mes, index) => (
          <div key={index}>
            <p>sent to: {mes.sent_to.username}</p>
            <h3>{mes.body}</h3>
            <p>sent by: {mes.created_by.username}</p>
          </div>
        ))}
        {realtimeMessages.map((message, index) => (
          <div key={index}>
            <p>sent to:{message.sentto}</p>
            <h3>{message.body}</h3>
            <p>sent by:{message.createdBy}</p>
          </div>
        ))}
      </div>
      <div className="chatinput">
        <input type="text" placeholder="Type Message here ..."
          value={newMessage}
          onChange={(e) => { setNewMessage(e.target.value) }}
        />
        <button onClick={() => { sendMessage() }}><span>Send Message</span></button>
      </div>
    </div>
  )
}

export default ConversationDetails