import { useState } from 'react';
import axios from 'axios';

export default function Hello() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const role = 'admin';
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await axios.post('http://localhost:8000/api/admin/signup', {
      email,
      username,
      password,
      role,
    });
    console.log(res);
  }
  return (
    <div>
      <h1>Hello</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
