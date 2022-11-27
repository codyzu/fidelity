import {isSignInWithEmailLink, signInWithEmailLink} from 'firebase/auth';
import {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {auth} from './firebase';

export default function LoginFinish() {
  const linkValid = isSignInWithEmailLink(auth, window.location.href);
  const email = window.localStorage.getItem('emailForSignIn');
  const navigate = useNavigate();

  useEffect(() => {
    async function signIn() {
      if (!email) {
        console.log('not implemented');
        return;
      }

      // TODO: do something if email is not stored, i.e. ask for it
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href,
      );
      console.log('Login success');
      window.localStorage.removeItem('emailForSignIn');
      navigate('/');
    }

    if (linkValid) {
      void signIn();
    }
  }, [linkValid, email]);

  if (!linkValid) {
    return (
      <div>
        <div className="i-lucide-server-crash h-4rem w-4rem" />
        Something is not right, you shouldn&apos;t be here. Go to the{' '}
        <Link to="/">homepage</Link>
      </div>
    );
  }

  if (!email) {
    <div>
      <div className="i-lucide-server-crash h-4rem w-4rem" />
      Looks like you changed browsers or devices. Please enter your email
      address again to complete the login.
    </div>;
  }

  return <div className="i-lucide-loader animate-spin h-4rem w-4rem" />;
}
