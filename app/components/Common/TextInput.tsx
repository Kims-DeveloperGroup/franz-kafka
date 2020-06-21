import React from 'react';
import styles from "./textInput.scss";
import "./textInput.scss";

type Props = {
  placeholder: string,
  refer: (input: any) => void
};

export function TextInput(props: Props) {
    const {placeholder= '', refer} = props;
    return (
      <label className={styles.label}>
        <input ref={el => refer(el)} className="text-input" placeholder={placeholder} type='text'/>
      </label>);
}
