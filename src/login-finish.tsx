import {isSignInWithEmailLink, signInWithEmailLink} from 'firebase/auth';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import {auth} from './firebase';
import LoadingSpinner from './loading-spinner';
import Page from './page';

export default function LoginFinish() {
  const {t} = useTranslation();
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
      <Page>
        <div className="i-lucide-frown h-4rem w-4rem" />
        {t('loginLinkError')} <Link to="/">{t('homepage')}</Link>
      </Page>
    );
  }

  if (!email) {
    <Page>
      <div className="i-lucide-frown h-4rem w-4rem" />
      {t('emailNotFound')}
    </Page>;
  }

  return <LoadingSpinner />;
}
