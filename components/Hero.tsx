import styles from '@components/Hero.module.scss';
import * as U from '@common/utilities';

export interface HeroProps {
  heading: string;
  caption: string;
  gradient?: boolean;
}

export default function Hero({ heading, caption, gradient }: HeroProps) {
  return (
    <header className={U.classNames(styles.heroContainer, gradient ? styles.gradient : null)}>
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
