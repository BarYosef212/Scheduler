import { useEffect, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import validator from 'email-validator';

export default function useValidateForm(phoneNumber?: string, fullName?: string, email?: string) {

  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (
      phoneNumber && phoneNumber.length > 0 &&
      !isValidPhoneNumber(phoneNumber) &&
      phoneNumber.length != 10
    ) {
      setError('מס טלפון לא תקין');
      return
    }

    if (fullName && fullName.length < 3 && fullName.length > 0) {
      setError('שם קצר מדי')
      return
    }
    if (email && !validator.validate(email)) {
      setError('אימייל לא תקין');
      return
    }

    setError('')

  }, [fullName, email, phoneNumber]);
  return {
    error
  }
}