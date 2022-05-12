import { useEffect, useState, useReducer } from 'react';
import GUN from 'gun';

const gun = GUN({
  peers: [
    'http://localhost:3030/gun'
  ]
});

const initialState = {
  messages: []
};

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  };
} 

export default function App() {
  const [formState, setFormState] = useState({
    name: '', message: '',
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messages = gun.get('messages');

    messages.map().on(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      });
    });
  }, []);

  function onChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function saveMessages() {
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now()
    });

    setFormState({
      name: '', message: '',
    });
  }

  return (
    <div style={{ padding: 30 }}>
      <input 
      onChange={onChange} 
      placeholder="name"
      name="name"
      value={formState.name}
      />
      <input 
      onChange={onChange}
      placeholder="Message"
      name="message"
      value={formState.message}
      />

      <button onClick={saveMessages}>Send Message</button>

      {
        state.messages.map(message => (
          <div>
            <h2>{message.message}</h2>
            <h3>From: {message.name}</h3>
            <p>Date: {message.createdAt}</p>
          </div>
        ))
      }

    </div>
  );
}