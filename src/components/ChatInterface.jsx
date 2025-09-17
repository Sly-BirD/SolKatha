import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { generateKrishnaResponse } from '../services/geminiAPI';
import { auth, db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';

const ChatInterface = () => {
  const [user] = useAuthState(auth);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, [user]);

  const handleInput = async (e) => {
    if (e.key !== 'Enter' || !userInput.trim() || isProcessing || !user) return;
    setIsProcessing(true);

    try {
      await addDoc(collection(db, 'messages'), {
        role: 'user',
        content: userInput,
        userId: user.uid,
        timestamp: new Date(),
      });

      const { response, sentiment } = await generateKrishnaResponse(userInput, messages);
      console.log('Sentiment detected:', sentiment);
      await addDoc(collection(db, 'messages'), {
        role: 'krishna',
        content: response,
        userId: user.uid,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error handling input:', error);
      await addDoc(collection(db, 'messages'), {
        role: 'krishna',
        content: 'Krishna is here to guide you. Please try again.',
        userId: user.uid,
        timestamp: new Date(),
      });
    } finally {
      setIsProcessing(false);
      setUserInput('');
    }
  };

  const clearChat = async () => {
    if (isProcessing || !user) return;
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-white">Please log in to chat.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-teal-500">
      <div className="flex-1 w-3/4 overflow-y-auto p-4">
        {messages
          .filter((msg) => msg.userId === user.uid)
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 rounded-lg max-w-xs ${
                  msg.role === 'user'
                    ? 'bg-teal-200 text-purple-900'
                    : 'bg-gold-200 text-purple-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
      </div>
      {isProcessing && (
        <div className="mt-4 text-gold-200">Krishna is contemplating...</div>
      )}
      <div className="mt-4 flex space-x-4">
        <input
          type="text"
          placeholder="What's on your mind?"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleInput}
          className="p-2 border rounded-lg w-1/2 text-center bg-white bg-opacity-80"
          disabled={isProcessing}
        />
        <button
          onClick={clearChat}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          disabled={isProcessing}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;