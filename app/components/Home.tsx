import React from 'react';
import {Link} from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.scss';
import Olive from '../assets/olive_black_main.png';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <div>
        <h2>Olive.kafka</h2>
        <Link to={routes.CONNECTIONS}><i>[ to connections ]</i></Link>
      </div>
      <div>
        <img src={Olive} alt="" />
        <div className={styles.imgRef}>olive.young<br /> designed by peanut.jamjam <br/>(Instagram)</div>
      </div>
    </div>
  );
}
