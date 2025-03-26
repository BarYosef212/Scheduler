import { useReducer } from "react";

const ACTIONS = {
  SET_EMAIL: 'SET_EMAIL',
  SET_FULL_NAME: 'SET_NAME',
  SET_PHONE_NUMBER: 'SET_PHONE',
}


interface FormState {
  fullName: string,
  email: string,
  phoneNumber: string
}

type FormAction = { type: typeof ACTIONS.SET_EMAIL; payload: string } | { type: typeof ACTIONS.SET_FULL_NAME; payload: string } | { type: typeof ACTIONS.SET_PHONE_NUMBER; payload: string }


const formReducer = (state: FormState, action: FormAction): FormState => {
  if (action.type == ACTIONS.SET_PHONE_NUMBER) {
    if (/^\d+$/.test(action.payload) || action.payload == "") {
      return { ...state, phoneNumber: action.payload }
    }
    return state
  }
  else if (action.type == ACTIONS.SET_FULL_NAME) {
    return { ...state, fullName: action.payload }
  }
  else if (action.type == ACTIONS.SET_EMAIL) {
    return { ...state, email: action.payload }
  }
  else return state
}

const useFormReducer = () => {
  const [state, dispatch] = useReducer(formReducer, {
    phoneNumber: "",
    fullName: "",
    email: ""
  })

  return { state, dispatch }
}

export default useFormReducer