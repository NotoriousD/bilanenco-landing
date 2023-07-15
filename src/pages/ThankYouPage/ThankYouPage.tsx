import React from "react";

import { ReactComponent as InstagramIcon } from 'assets/instagram.svg';
import { ReactComponent as TelegramIcon } from 'assets/telegram.svg';

import css from './thankYou.module.scss';

export const ThankYouPage: React.FC = () => {
  return <div className={css.root}>
    <div className={css.content}>
      <div className={css.title}>Дякую за замовлення</div>
      <div className={css.text}>Незабаром вам надійде лист на пошту з доступом до навчальної платформи</div>
      <div className={css.info}>Якщо лист не надійде протягом 12-ти годин, напишіть мені будь-ласка</div>
      <div className={css.links}>
        <a href="/" className={css.link}><TelegramIcon /></a>
        <a href="/" className={css.link}><InstagramIcon /></a>
      </div>
    </div>
  </div>;
}
