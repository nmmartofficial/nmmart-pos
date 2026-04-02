import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [userShop, setUserShop] = useState(null);

  // जब लॉगिन सफल हो जाए
  const handleLoginSuccess = (shopData) => {
    setUserShop(shopData);
  };

  // लॉगआउट करने पर
  const handleLogout = () => {
    setUserShop(null);
  };

  return (
    <div className="App">
      {userShop ? (
        <Dashboard shop={userShop} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;