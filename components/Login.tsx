
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { MOCK_PASSWORD } from '../constants';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const chars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background noise (dots)
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Text
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    const charArray = captchaCode.split('');
    const space = canvas.width / (charArray.length + 1);
    
    charArray.forEach((char, i) => {
      ctx.save();
      ctx.translate((i + 1) * space, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4); // Random rotation
      ctx.fillStyle = `rgb(${Math.random() * 100},${Math.random() * 100},${Math.random() * 150})`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (captchaCode) {
      drawCaptcha();
    }
  }, [captchaCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !captchaInput) {
      setError('Please fill in all fields.');
      return;
    }

    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('Invalid verification code.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    const foundUser = users.find(u => u.name.toLowerCase() === username.toLowerCase());
    
    if (foundUser && password === MOCK_PASSWORD) {
      onLogin(foundUser);
    } else {
      setError('Invalid username or password.');
      generateCaptcha();
      setCaptchaInput('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your Gemini Chat account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. User 1"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Verification Code (6-Digit)</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="6 Characters"
                maxLength={6}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white transition-all font-mono uppercase"
              />
              <div 
                onClick={generateCaptcha}
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 select-none transition-colors border border-dashed border-gray-300 overflow-hidden"
                style={{ width: '140px', height: '44px' }}
              >
                <canvas ref={canvasRef} width="140" height="44" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 italic">Click image to refresh. "0" and "O" are excluded.</p>
          </div>

          {error && <p className="text-red-500 text-xs font-medium text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-500 text-xs">Don't have an account?</p>
          <button 
            onClick={onGoToRegister}
            className="text-primary font-bold text-sm mt-1 hover:underline"
          >
            Create New Account
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-[10px] text-gray-500 leading-relaxed">
          <p className="font-bold mb-1">Demo Access:</p>
          <p>Try any user from <b>User 1</b> to <b>User 20</b> with password <b>user123</b>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
