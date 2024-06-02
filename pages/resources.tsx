import Hero from '@root/components/Hero';
import styles from '@pages/resources.module.scss';
import Video from '@root/components/Video';
import FeaturedProject from '@root/components/FeaturedProject';
import { RESOURCE_PAGE_FEATURED_PROJECTS_FIXTURE, RESOURCE_PAGE_VIDEOS_FIXTURE } from '@root/fixtures/resources';

//add small medium, large sizes to hero

export default function Resources() {
  const videos = RESOURCE_PAGE_VIDEOS_FIXTURE;
  const featuredProjects = RESOURCE_PAGE_FEATURED_PROJECTS_FIXTURE;
  return (
    <div>
      <Hero heading="Resources" caption="lorem ipsum" gradient={true} />

      <div className={styles.body}>
        <h2 className={styles.h2}>Video Tutorials</h2>
        <div className={styles.videoGrid}>
          {videos.map((video, index) => {
            return (
              <div className={styles.colum}>
                <Video src={video.src} title={video.title} format={video.format} key={index} />
              </div>
            );
          })}
        </div>
        <h2 className={styles.h2}>Featured Projects</h2>

        <div className={styles.featuredProjectsGrid}>
          {featuredProjects.map((featuredProject, index) => {
            const { title, image, href, caption } = featuredProject;
            return (
              <div className={styles.featuredProjectsGridColumn}>
                <FeaturedProject title={title} image={image} href={href} caption={caption} key={index} />
              </div>
            );
          })}
        </div>

        <h2 className={styles.h2}>Glossary</h2>
        <p> retrievals on chain sealed unsealed deals CID gateway pinned & unpinned auto retrive (link to auto retrieve docs)</p>
        <h2 className={styles.h2}>Further Reading</h2>
      </div>
    </div>
  );
}
