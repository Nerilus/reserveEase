import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import './RegisterForm.css'
interface RegisterFormProps {
  baseUrl: string; // Assurez-vous d'utiliser cette prop si nécessaire
}

const RegisterForm: React.FC<RegisterFormProps> = ({baseUrl}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext n\'est pas défini. Assurez-vous que le composant AuthProvider enveloppe ce composant.');
  }

  const { register } = authContext; // Récupération de la fonction register depuis le contexte

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await register(username, email, password, confirmPassword); // Appel de la fonction register du contexte
      console.log('Inscription réussie!');
      // Réinitialisation des champs après l'inscription réussie
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) { // Gestion des erreurs avec une erreur spécifique
      if (err instanceof Error) {
        console.error('Erreur lors de l\'inscription:', err.message);
        setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
      } else {
        console.error('Erreur inconnue lors de l\'inscription:', err);
        setError('Une erreur inconnue est survenue lors de l\'inscription.');
      }
    }
  };

  return (
    <div className='vh-100 page page-register page-log-reg flex-center'>
  <div className='register-container'>
    <h2 className="title-regular text-center">Bienvenue sur <br /><span>ReserveEase
    </span></h2>
    <div className="box-shadow-1 box-model">
      <h1 className="text-center">S'inscrire</h1>
      <form onSubmit={handleSubmit}>
        <div className="fields-column">
          <div className="fields-row mb-4">
            <input
              type="text"
              id="formUsername"
              className="form-control form-control-lg"
              placeholder="Pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              id="formEmail"
              className="form-control form-control-lg"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="fields-row mb-4">
            <input
              type="password"
              id="formPassword"
              className="form-control form-control-lg"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              id="formConfirmPassword"
              className="form-control form-control-lg"
              placeholder="Confirmation mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="bloc-btn">
          <button type="submit">Je m'inscris</button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
</div>
  );
};

export default RegisterForm;
