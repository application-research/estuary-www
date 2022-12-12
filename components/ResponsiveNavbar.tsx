import EstuarySVG from '@root/components/EstuarySVG';
import styles from '@components/ResponsiveNavbar.module.scss';
import { BreakpointEnum, useBreakpoint } from '@common/use-breakpoint';
import * as React from 'react';

const navItems = [
  { name: 'Collaborators', href: '#collaborators' },
  { name: 'Performance', href: '#performance' },
  { name: 'Deals', href: '#deals' },
];

function MobileNav({ navItems }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const breakpoint = useBreakpoint();

  React.useEffect(() => {
    const isMobile = breakpoint === BreakpointEnum.XS || breakpoint === BreakpointEnum.SM;

    if (!isMobile) {
      setIsOpen(false);
    }
  }, [breakpoint]);

  return (
    <div className={styles.displayMobileNav}>
      <a className={styles.navBranding} href="https://estuary.tech/" target="_blank">
        <EstuarySVG height="64px" color="var(--text-white)" className={styles.logo} />
      </a>

      <div className={isOpen ? styles.activeMobileMenu : styles.mobileMenu} aria-label="Open Navigation" onClick={() => setIsOpen((prev) => !prev)} />

      <ul className={isOpen ? styles.activeSideNav : styles.sideNav} onClick={() => setIsOpen((prev) => !prev)}>
        {navItems.map((item, index) => {
          return (
            <li key={index} className={styles.navItemMobile}>
              <a className={styles.navLink} href={`${item.href}`}>
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DesktopNav({ navItems }) {
  return (
    <div className={styles.navbar}>
      <a className={styles.logoDesktop} href="https://estuary.tech/" target="_blank">
        <EstuarySVG height="64px" color="var(--text-white)" className={styles.logo} />
      </a>

      <ul className={styles.navMenu}>
        {navItems.map((item, index) => {
          return (
            <li key={index} className={styles.navItem}>
              <a className={styles.navLink} href={`${item.href}`}>
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResponsiveNavbar(props: any) {
  return (
    <nav className={styles.stickyNavbar}>
      <MobileNav navItems={navItems} />
      <DesktopNav navItems={navItems} />
    </nav>
  );
}

export default ResponsiveNavbar;
