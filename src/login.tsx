import {
  type ConfirmationResult,
  RecaptchaVerifier,
  sendSignInLinkToEmail,
  signInWithPhoneNumber,
} from 'firebase/auth';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import PI from 'react-phone-input-2';
import {auth} from './firebase';

// Hack so that react-phone-input-2 works in dev and prod
// https://github.com/bl00mber/react-phone-input-2/issues/533#issuecomment-1125220454
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PhoneInput = PI.default ?? PI; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

export default function Login() {
  const {t, i18n} = useTranslation();
  useEffect(() => {
    auth.languageCode = i18n.resolvedLanguage;
  }, [i18n.resolvedLanguage]);

  // Stateful form controls
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [smsCode, setSmsCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Ref needed for the recapthaVerifier
  const smsLoginRef = useRef<HTMLButtonElement>(null);

  // Need to store a reference to the send sms result so we can verify the code
  const [sendResult, setSendResult] = useState<ConfirmationResult>();

  async function loginSms() {
    // Ideas to improve this: https://stackoverflow.com/questions/62619916/firebase-invisible-recaptcha-does-not-work-in-react-js
    const recapthaVerifier = new RecaptchaVerifier(
      smsLoginRef.current!,
      {
        size: 'invisible',
        callback(response: any) {
          console.log('Success');
          console.log('RES', response);
        },
      },
      auth,
    );

    const result = await signInWithPhoneNumber(
      auth,
      `+${phoneNumber}`,
      recapthaVerifier,
    );

    // Reset the code input box after sending the SMS
    setSmsCode('');
    setSendResult(result);
  }

  async function loginEmail() {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}${import.meta.env.BASE_URL}finishLogin`,
      // This must be true.
      handleCodeInApp: true,
      // IOS: {
      //   bundleId: 'com.example.ios'
      // },
      // android: {
      //   packageName: 'com.example.android',
      //   installApp: true,
      //   minimumVersion: '12'
      // },
      // dynamicLinkDomain: 'example.page.link'
    };

    console.log('AC', actionCodeSettings);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  }

  return (
    <div className="shadow-lg rounded-lg p-2 flex flex-col w-full">
      <div className="text-xl text-center m-2 mb-6">
        {t('Sign in to get started')}
      </div>
      <label className="m-2">{t('Login by email')}:</label>
      <input
        className="input m-2"
        type="email"
        value={email}
        onChange={(event_) => {
          setEmail(event_.target.value);
        }}
      />
      <button className="btn m-2 mb-6" type="button" onClick={loginEmail}>
        {t('Login')}
      </button>
      <label className="m-2">{t('Login by SMS')}:</label>
      <div className="m-2">
        <PhoneInput
          // InputClass="input-base! py-2! relative! w-full!"
          // buttonClass="rounded-lg! py-0! flex-shrink-0! z-10! inline-flex"
          // containerClass="mr-2 p-2 flex-1"
          inputClass="w-auto!"
          buttonClass=""
          containerClass=""
          dropdownClass=""
          searchClass=""
          country="fr"
          value={phoneNumber}
          onChange={(phone: string) => {
            setPhoneNumber(phone);
          }}
        />
      </div>
      <button
        ref={smsLoginRef}
        className="btn m-2 mb-6"
        type="button"
        onClick={() => {
          void loginSms();
        }}
      >
        {t('Login')}
      </button>
      {sendResult && (
        <>
          <label className="m-2">{t('Code')}:</label>
          <input
            className="input m-2"
            type="text"
            value={smsCode}
            onChange={(event_) => {
              setSmsCode(event_.target.value);
            }}
          />
          <button
            className="btn m-2"
            type="button"
            onClick={() => {
              void sendResult.confirm(smsCode);
            }}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
}
