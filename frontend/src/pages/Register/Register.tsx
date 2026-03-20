import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Dog, Mail, Lock, Heart, User, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../assets/scss/pages/Register.module.scss';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register, error, isSigningUp, checkAuth, isAuthenticated, user } = useAuthStore();

  // Handle case where user is already authenticated (e.g. refresh after account creation)
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.defaultPet || (user?.pets && user.pets.length > 0)) {
        navigate('/');
      } else {
        setStep(2);
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Step 1: Account State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Pet State
  const [petName, setPetName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [species, setSpecies] = useState('DOG');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('MALE');

  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setInternalError('Passwords do not match');
      return;
    }
    setInternalError(null);
    try {
      await register(email, password);
      // Backend now logs in automatically, so user is now authenticated
      setStep(2);
    } catch {
      // Error handled by store
    }
  };

  const handleRegisterPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInternalError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pets/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: petName,
          displayName,
          species,
          breed,
          gender,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to register pet');
      }

      await checkAuth(); // Refresh user data to include the new pet
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setInternalError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPet = () => {
    navigate('/');
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className={styles.Register}>
      <motion.div
        className={styles['register-card']}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={styles.header}>
          <div className={styles['icon-wrapper']}>
            {step === 1 ? (
              <User size={40} className={styles.icon} />
            ) : (
              <Dog size={40} className={styles.icon} />
            )}
          </div>
          <h1 className={styles.title}>
            {step === 1 ? 'Join Petopia' : 'Tell us about your pet'}
          </h1>
          <p className={styles.subtitle}>
            {step === 1 
              ? 'Create an account to start your journey' 
              : "Let's personalize your experience"}
          </p>
        </header>

        <div className={styles['step-indicator']}>
          <div className={`${styles.dot} ${step >= 1 ? styles.active : ''}`} />
          <div className={`${styles.dot} ${step >= 2 ? styles.active : ''}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.form}
              onSubmit={handleRegisterAccount}
            >
              {(error || internalError) && (
                <div className={styles['error-message']}>
                  {error || internalError}
                </div>
              )}

              <div className={styles['input-group']}>
                <label htmlFor="email">Email address</label>
                <div className={styles['input-wrapper']}>
                  <Mail size={18} className={styles['field-icon']} />
                  <input
                    type="email"
                    id="email"
                    placeholder="hello@petopia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles['input-group']}>
                <label htmlFor="password">Password</label>
                <div className={styles['input-wrapper']}>
                  <Lock size={18} className={styles['field-icon']} />
                  <input
                    type="password"
                    id="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles['input-group']}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={styles['input-wrapper']}>
                  <Lock size={18} className={styles['field-icon']} />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles['submit-btn']} disabled={isSigningUp}>
                {isSigningUp ? 'Creating Account...' : 'Continue'}
                {!isSigningUp && <ArrowRight size={18} />}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.form}
              onSubmit={handleRegisterPet}
            >
              {internalError && (
                <div className={styles['error-message']}>{internalError}</div>
              )}

              <div className={styles['input-group']}>
                <label htmlFor="petName">Pet Username (Unique)</label>
                <div className={styles['input-wrapper']}>
                  <Sparkles size={18} className={styles['field-icon']} />
                  <input
                    type="text"
                    id="petName"
                    placeholder="e.g. fluffy_cloud"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                    required
                  />
                </div>
              </div>

              <div className={styles['input-group']}>
                <label htmlFor="displayName">Display Name</label>
                <div className={styles['input-wrapper']}>
                  <Heart size={18} className={styles['field-icon']} />
                  <input
                    type="text"
                    id="displayName"
                    placeholder="e.g. Fluffy"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className={styles['input-group']}>
                  <label htmlFor="species">Species</label>
                  <div className={styles['input-wrapper']} style={{ paddingLeft: '0' }}>
                    <select
                      id="species"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      style={{ paddingLeft: '16px' }}
                    >
                      <option value="DOG">Dog</option>
                      <option value="CAT">Cat</option>
                      <option value="BIRD">Bird</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles['input-group']}>
                  <label htmlFor="gender">Gender</label>
                  <div className={styles['input-wrapper']} style={{ paddingLeft: '0' }}>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ paddingLeft: '16px' }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles['input-group']}>
                <label htmlFor="breed">Breed</label>
                <div className={styles['input-wrapper']}>
                  <Sparkles size={18} className={styles['field-icon']} />
                  <input
                    type="text"
                    id="breed"
                    placeholder="e.g. Golden Retriever"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles['submit-btn']} disabled={loading}>
                {loading ? 'Registering Pet...' : "Start Explorer"}
                {!loading && <Heart size={18} fill="currentColor" />}
              </button>

              <button type="button" className={styles['skip-btn']} onClick={handleSkipPet}>
                Skip for now
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <footer className={styles.footer}>
          {step === 1 && (
            <p>Already have an account? <a href="/login">Sign In</a></p>
          )}
        </footer>
      </motion.div>

      <div className={styles.background}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
      </div>
    </div>
  );
};

export default Register;
