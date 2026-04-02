import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // यहाँ अपनी लॉगिन लॉजिक लिखें
    if (email === 'admin@nmmart.com' && password === 'nmmart123') {
      onLogin();
    } else {
      alert('Wrong Email or Password!');
    }
  };

  // पूरा पेज (बैकग्राउंड इमेज के साथ)
  const pageStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000')", // यहाँ इमेज का लिंक है
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  // सफेद रंग का लॉगिन कार्ड (जो इमेज के ऊपर दिखेगा)
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // हल्का पारदर्शी सफेद
    padding: '40px',
    borderRadius: '15px', // गोल कोने
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', // सुंदर छाया
    width: '350px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#d32f2f', // NM MART का लाल रंग
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '15px'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* NM MART का लोगो या नाम */}
        <h1 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>NM MART</h1>
        <p style={{ color: '#555', marginBottom: '30px' }}>POINT OF SALE</p>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.get.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.get.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;