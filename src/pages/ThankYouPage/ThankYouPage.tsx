import React from "react";

import css from './thankYou.module.scss';

export const ThankYouPage: React.FC = () => {
  return <div className={css.root}>
    <div className={css.content}>
        <div className={css.title}>Дякую за замовлення</div>
        <div className={css.text}>Незабаром вам надійде лист на пошту з доступом до навчальної платформи</div>
    </div>
  </div>;
}
