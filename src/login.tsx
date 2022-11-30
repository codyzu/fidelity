import {
  type ConfirmationResult,
  RecaptchaVerifier,
  sendSignInLinkToEmail,
  signInWithPhoneNumber,
} from 'firebase/auth';
import {type FormEvent, useEffect, useRef, useState} from 'react';
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
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // Ref needed for the recapthaVerifier
  const smsLoginRef = useRef<HTMLButtonElement>(null);

  // Need to store a reference to the send sms result so we can verify the code
  const [sendResult, setSendResult] = useState<ConfirmationResult>();

  async function submitSendSms(event_: FormEvent) {
    event_.preventDefault();

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

  async function submitEmailLogin(event_: FormEvent) {
    event_.preventDefault();

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
    setEmailSent(true);
  }

  function submitSmsCode(event_: FormEvent) {
    event_.preventDefault();
    void sendResult!.confirm(smsCode);
  }

  return (
    <div className="shadow-lg rounded-lg p-4 flex flex-col w-full gap-4">
      <div className="text-xl text-center mb-6">
        {t('Sign in to get started')}
      </div>
      <form className="flex flex-col w-full gap-4" onSubmit={submitEmailLogin}>
        <label className="" htmlFor="email">
          {t('Login by email')}:
        </label>
        <input
          className="input"
          id="email"
          type="email"
          value={email}
          onChange={(event_) => {
            setEmail(event_.target.value);
          }}
        />
        {emailSent && (
          <div className="text-sm font-semibold">{t('email sent')}</div>
        )}
        <button className="btn mb-6" type="submit">
          {t('Login')}
        </button>
      </form>
      <form className="flex flex-col w-full gap-4" onSubmit={submitSendSms}>
        <label className="" htmlFor="phone">
          {t('Login by SMS')}:
        </label>
        <div className="">
          <PhoneInput
            id="phone"
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
        {sendResult && (
          <div className="text-sm font-semibold">{t('sms sent')}</div>
        )}
        <button ref={smsLoginRef} className="btn mb-6" type="submit">
          {t('Send SMS')}
        </button>
      </form>
      {sendResult && (
        <form className="flex flex-col w-full gap-4" onSubmit={submitSmsCode}>
          <label className="" htmlFor="smscode">
            {t('SMS Code')}:
          </label>
          <input
            autoFocus
            className="input"
            id="smscode"
            type="tel"
            value={smsCode}
            onChange={(event_) => {
              setSmsCode(event_.target.value);
            }}
          />
          <button className="btn" type="submit">
            {t('Login')}
          </button>
        </form>
      )}
    </div>
  );
}
