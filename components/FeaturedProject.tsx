import { Image } from './Image';
import styles from '@components/FeaturedProject.module.scss';

export interface FeaturedProjectProps {
  title: string;
  image: any; //to do create a global image type that can be reused
  href: string;
  caption: string;
}

function FeaturedProject({ title, image, href, caption }: FeaturedProjectProps) {
  console.log(image);
  return (
    <div style={{ display: 'grid', rowGap: '8px' }}>
      <Image image={image} layout="fill" />
      <h3 className={styles.h3}>{title}</h3>
      <p className={styles.source}>
        <a href={href} className={styles.link}>
          Source
        </a>
      </p>

      <p>{caption}</p>
    </div>
  );
}

export default FeaturedProject;
