import React from 'react';
import styles from './button.styles.scss';

type Props = {
  text: string,
  onClick: () => void,
  theme: 'small' | 'medium'
};

export type buttonTheme = Small | Medium


interface Small {
  cssClass: 'smallButton'
}

interface Medium {
  cssClass: 'mediumButton'
}

export function Button(props: Props) {
  const {text, onClick, theme} = props;
  return (
    <span onClick={e => {
      e.stopPropagation();
      onClick();
    }} className={theme === 'small' ? styles.smallBtn : styles.mediumBtn}><i>[ {text} ]</i></span>
  );
}
