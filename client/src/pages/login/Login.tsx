import React, { useContext, useState } from 'react';
import { AuthContext,} from '../../context/AuthProvider';
import './LoginForm.css'

const Login: React.FC = () => {
  const authContext = useContext(AuthContext)!;
  const { login } = authContext;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
          await login(username, password);
          console.log('Connexion réussie!');
      } catch (err: unknown) {
          if (err instanceof Error) {
              setError(err.message);
          } else {
              setError('Une erreur est survenue lors de la connexion.');
          }
      }
  };

  return (
      <div className='page-login'>
          <div className='login-container'>
              <h2 className="title-regular text-center">
                  Bienvenue sur <br /><span>ReserveEase</span>
              </h2>
              <div className="box-shadow-1 box-model">
                  <h1 className="text-center">Connexion</h1>
                  <form onSubmit={handleSubmit}>
                      <div className="fields-column">
                          <div className="fields-row mb-4">
                              <input
                                  type="text"
                                  id="formUsername"
                                  className="form-control form-control-lg"
                                  placeholder="Nom d'utilisateur"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  required
                              />
                              <input
                                  type="password"
                                  id="formPassword"
                                  className="form-control form-control-lg"
                                  placeholder="Mot de passe"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                              />
                          </div>
                      </div>
                      <div className="bloc-btn">
                          <button type="submit">Se connecter</button>
                      </div>
                  </form>
                  {error && <p className="error-message">{error}</p>}
              </div>
          </div>
      </div>
  );
};

export default Login;