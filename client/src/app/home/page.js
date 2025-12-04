"use client";

import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";



export default function App() {

  return (
  
      <div className="flex w-screen h-screen" >
        <ChatList />
        <ChatWindow/>
      </div>
   
  );
}
