import React, { useState, useEffect } from 'react';

const Login = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isKeychainAvailable, setIsKeychainAvailable] = useState(false);

  useEffect(() => {
    // Check if Hive Keychain is available
    const checkKeychain = () => {
      if (window.hive_keychain) {
        setIsKeychainAvailable(true);
      } else {
        setTimeout(checkKeychain, 500);
      }
    };
    checkKeychain();
  }, []);

  const login = () => {
    if (isKeychainAvailable) {
      const signBuffer = () => {
        window.hive_keychain.requestSignBuffer(
          username,
          "Sign this message to authenticate",
          "Posting",
          (response) => {
            if (response.success) {
              setUser(username);
              console.log("Login successful: ", response);
            } else {
              setError("Login failed: " + response.message);
              console.log("Login failed: ", response);
            }
          }
        );
      };

      // Check if handshake is needed
      if (window.hive_keychain.requestHandshake) {
        window.hive_keychain.requestHandshake(() => signBuffer());
      } else {
        signBuffer();
      }
    } else {
      setError('Hive Keychain is not installed or not detected.');
    }
  };

  return (
    <div>
      {!user ? (
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Hive username"
          />
          <button onClick={login} disabled={!username || !isKeychainAvailable}>
            Login with Hive
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!isKeychainAvailable && <p>Waiting for Hive Keychain to be detected...</p>}
        </div>
      ) : (
        <p>Welcome, {user}!</p>
      )}
    </div>
  );
};

export default Login;