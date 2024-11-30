'use client';

import { useEffect, useState } from 'react';
import { auth, logIn, logOut } from '../../../services/auth';
// import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import axiosInstance from '../../lib/axios';
import { User } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState('');
// const router = useRouter();

  useEffect(()=> {
    const user = auth.currentUser;
    if(user){
    setUser(user?.email || '');
    }
  },[auth?.currentUser?.email]);
  // console.log(user);
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    setUser('');
    try {
      const user = await logIn(email, password);
      const token = await user.getIdToken();
      localStorage.setItem('token',token);
      setUser(user?.email || '');
      // router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async ()=> {
    await logOut();
    setUser('');
    localStorage.removeItem('token');
  }

  const handleRouteTesting = async ()=> {
    try{
    const data = await axiosInstance.get('/auth/protected');
    if(data.status === 200){
      alert('Hi admin you are authorized for this');
    }else if(data.status === 403){
      alert('You are not authorized');
    }else{
      alert('Network Problem');
    }
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div>
    {!user && <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log In</button>
        <Link href={'/register'}>Sign Up</Link>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    <hr />
    </div>}
      {!!user && <><p style={{ color: 'green' }}>{`Hi ${user}`}</p>
    <button onClick={()=> handleLogout()}>Logout</button>   
    <hr />
    <section>
      <h1>Test frontend admin guard</h1>
      <Link href={'/admin'}>Go to admin page</Link>
    </section>
    <hr />
    <section>
      <h1>Test accessing nest js admin protected route</h1>
      <button onClick={()=> handleRouteTesting()}>Test admin access</button>
    </section></>}
    </div>
  );
}