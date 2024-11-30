'use client'; // Required for client-side interactions

import { useState } from 'react';
import { signUp } from '../../../services/auth';
import axiosInstance from '../../lib/axios';
import Link from 'next/link';


export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const user = await signUp(email, password);
      console.log(user);
      const uid = user.uid;
      await axiosInstance.post('/roles/assign',{uid, role});
      setSuccess(`User created: ${user.email} sign in to continue`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={({target})=> setRole(target.value)}>
          <option value="admin">Admin</option>  
          <option value="user">User</option>    
        </select>
        <button type="submit">Sign Up</button>
      </form>

      <Link href={'/login'}>Login</Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}