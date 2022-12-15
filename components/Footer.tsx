import styles from '@components/Footer.module.scss';
import Link from 'next/link';

function FooterLink({ children, href }: { href: string, children: React.ReactNode }) {
  return (
    <li className={styles.listItemLink}>
      <Link className={styles.footerLink} style={{ textDecoration: 'none' }} href={href} target="_blank">
        {children}
      </Link>
    </li>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.container}>
        <div className={styles.footerColumn} style={{ borderRight: '1px dashed var(--text-space-gray)' }}>
          <h4 className={styles.footerHeading}>Learn more</h4>
          <ul className={styles.unorderedList}>
            <FooterLink href={'https://arg.protocol.ai'}>Our Team</FooterLink>
            <FooterLink href={'https://github.com/application-research/estuary-knowledge-base'}>Knowledge Base</FooterLink>
          </ul>
        </div>
        <div className={styles.footerColumn} style={{ borderRight: '1px dashed  var(--text-space-gray)' }}>
          <h4 className={styles.footerHeading}>Reach out</h4>
          <ul className={styles.unorderedList}>
            <FooterLink href={'https://filecoinproject.slack.com/join/shared_invite/zt-1k3lv7938-9pDAqSpH4eWVHtX12elqvg#/shared-invite/email'}>Slack</FooterLink>
            <FooterLink href={'https://github.com/filecoin-project/community#forums'}>Github Discussions</FooterLink>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4 className={styles.footerHeading}>Follow us</h4>
          <ul className={styles.unorderedList}>
            <FooterLink href={'https://twitter.com/estuary_tech'}>Twitter</FooterLink>
            <FooterLink href={'https://github.com/application-research/estuary-www'}>Github</FooterLink>
          </ul>
        </div>
      </section>

      <section className={styles.footerBranding}>
        <div className={styles.footerBrandingContent}>
          <div className={styles.footerLeft}>
            <Link href="https://estuary.tech/" target="_blank">
              <img className={styles.footerLogo} height="24px" src="https://user-images.githubusercontent.com/28320272/204942093-88d8027a-2e0f-4d41-877e-1a462ab15c8d.svg" />
            </Link>
          </div>
          <div className={styles.footerRight}>
            <Link href={'https://arg.protocol.ai'} style={{ textDecoration: 'none', color: 'black', whiteSpace: 'nowrap' }}>
              @2022 ARG
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
