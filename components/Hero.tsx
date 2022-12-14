import styles from '@components/Hero.module.scss';

function Hero({ heading, caption }) {
  return (
    <header className={styles.heroContainer}>
      <div className={styles.centeredContainer}>
        <div className={styles.textContainer}>
          <div className={styles.text}>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.caption}>{caption}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
