import * as React from 'react';
import S from './CardWithIcon.module.scss';

export interface CardWithIconProps {
  caption: string;
  icon?: string;
  statistic: string;
}

function CardWithIcon({ caption, icon, statistic }: CardWithIconProps) {
  return (
    <div className={S.ecosystemSectionWithIcon}>
      <div className={S.ecosystemStatCardWithIcon}>
        <img className={S.ecosystemStatIcon} src={icon} />
        <div className={S.ecosystemStatValueWithIcon}>
          {statistic}
          <div className={S.ecosystemStatText}>{caption}</div>
        </div>
      </div>
    </div>
  );
}

export default CardWithIcon;
