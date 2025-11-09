import React, { useEffect, useState, useRef } from 'react'
import clientServer from "./Ws"
import { Toaster, toast } from 'react-hot-toast'

function App() {
  const [inputName, setInputName] = useState("")
  const [showNamePopUp, setShowNamePopUp] = useState(true)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [userName, setUserName] = useState("")
  const socket = useRef(null)

  useEffect(() => {
    socket.current = clientServer()

    socket.current.on("connect", () => {
      console.log("Connected:", socket.current.id)
    })

    // Listen for room join announcements
    socket.current.on("roomNotice", (userName) => {
      toast.success(`${userName} joined the chat`)
    })

    // Listen for messages from the server
    socket.current.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.current.disconnect()
    }
  }, [])

  function formatTime(ts) {
    const d = new Date(ts)
    const hh = String(d.getHours()).padStart(2, "0")
    const mm = String(d.getMinutes()).padStart(2, "0")
    return `${hh}:${mm}`
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputName.trim()
    if (!trimmed) return
    setUserName(trimmed)
    socket.current.emit('joinRoom', trimmed)
    setShowNamePopUp(false)
  }

  const handleSendMessage = () => {
    const trimmed = text.trim()
    if (!trimmed) return

    const msg = {
      id: Date.now(),
      sender: userName,
      text: trimmed,
      ts: Date.now()
    }

    // Show my message instantly
    setMessages((m) => [...m, msg])
    setText('')

    // Send message to server
    socket.current.emit("chatMessage", msg)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {showNamePopUp ? (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-inter border border-black">
          <div className="bg-white rounded-lg shadow-lg max-w-md p-6">
            <h1 className="text-xl font-semibold text-black">Enter your name</h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your name to start chatting. This will be used to identify you in chat.
            </p>
            <form onSubmit={handleNameSubmit} className="mt-4">
              <input
                autoFocus
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 outline-green-500 placeholder-gray-400"
                placeholder='Enter Your Name'
              />
              <button
                className="w-full rounded-lg py-3 px-2 bg-green-600 mt-3 font-bold text-gray-300 cursor-pointer"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className='flex justify-center min-h-screen items-center'>
          <div className='w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden border border-black'>
            <div className='flex items-center gap-3 px-4 py-3 border-b border-gray-200'>
              <div className='h-10 w-10 rounded-full bg-[#075E54] flex items-center justify-center text-white font-semibold'>
                R
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium text-[#303030]'>Realtime Group Chat</div>
                <div className='text-sm text-gray-500'>Someone is typing...</div>
              </div>
              <div className='text-sm text-gray-500'>
                Signed in as{' '}
                <span className='font-medium text-[#303030] capitalize'>{userName}</span>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col'>
              {messages.map((data) => {
                const my_message = data.sender === userName
                return (
                  <div
                    key={data.id}
                    className={`flex ${my_message ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] border border-black p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                        my_message
                          ? 'bg-[#DCF8C6] text-[#303030] rounded-br-2xl'
                          : 'bg-white text-[#303030] rounded-bl-2xl'
                      }`}
                    >
                      <div className='break-words whitespace-pre-wrap'>
                        {data.text}
                      </div>
                      <div className='flex justify-between items-center mt-1 gap-15'>
                        <div className='text-[11px] font-bold'>{data.sender}</div>
                        <div className='text-[11px] text-gray-500 text-right'>
                          {formatTime(data.ts)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='px-4 py-3 border-t border-gray-200 bg-white'>
              <div className='flex items-center justify-between gap-4 border border-gray-200 rounded-full'>
                <textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Type a message...'
                  className='w-full resize-none px-4 py-4 text-sm outline-none'
                />
                <button
                  className='bg-green-600 text-white px-4 py-2 mr-2 rounded-full text-sm font-medium cursor-pointer'
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App