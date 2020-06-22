import React from 'react';
import {Link} from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.scss';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Franz (Kafka)</h2>
      <Link to={routes.CONNECTIONS}><i>[ to connections ]</i></Link>
    </div>
  );
}
