import React, { useState, useRef, useCallback, useEffect } from "react";
import cx from 'classnames';
import { API } from 'aws-amplify';

import mainBanner from 'assets/main.jpg';
import footerBanner from 'assets/footer.jpg';
import { ReactComponent as LogoIcon } from 'assets/logo.svg';

import { Registration, Package } from "components/Registration";

import css from './main.module.scss';

const availablePlacesMock: Record<string, number> = {
  'Селф': 12,
  'З вчителем': 7,
  'З Олександрою': 2,
}

export const MainPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageId, setPackageId] = useState<string>();
  const packagesRef = useRef<HTMLElement>(null);

  const getAvailablePlaces = (name: string, places: number) => {
    const fakePlaces = availablePlacesMock[name];
    return places < fakePlaces ? places : fakePlaces;
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const scrollToPackages = () => {
    packagesRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChoosePackage = (id: string) => {
    setPackageId(id);
    handleOpenModal();
  }

  const fetchPackages = useCallback(async () => {
    try {
      const response = await API.get('packages', '/packages', {});
      if (response.data) {
        setPackages(response.data.Items.reverse());
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return <div className={css.root}>
    {openModal && packageId && packages.length && <Registration packageId={packageId} packages={packages} onClose={handleCloseModal} />}
    <div className={css.header} style={{
      backgroundImage: `url(${mainBanner})`,
    }}>
      <div className={css.headerContent}>
        <div className={css.container}>
          <div className={css.headerTitle}>WORK<span className={css.accent}>ЖОП</span></div>
          <div className={css.headerText}> Тижневий онлайн воркшоп з віжуалу, мета котрого полягає аби ви отримали результат у вигляді унікального віжуалу на місяць вперед всього лиш за 5 днів. Отримали сильну базу, здобули практичні навички, розширили ваше бачення, нащупали власний стиль та сенси, зловили віжуал інсайти.</div>
          <div className={css.btnWrapper}><button className={css.button} onClick={scrollToPackages}>Записатися</button></div>
          <LogoIcon className={css.logo} />
        </div>
      </div>
    </div>
    <section className={css.content}>
      <div className={css.container}>
        <div className={css.contentList}>
          <div className={css.contentRow}>
            <div className={css.contentItem}></div>
            <div className={cx(css.contentItem, css.mobile, css.left, css.leftNumPosition)}>
              <div className={css.contentItemNum}>1</div>
              <div className={css.contentItemTitle}>Віжуал анпакінг</div>
              <div className={css.contentItemText}>Ділюсь своїм баченням віжуалу, розширюю горизонти за допомогою огляду різних авторів та їх сенсів, ознайомлюю з годними кейсами розпакування сенсів. Проходимо детальне віжуал розпакування, котре напрацьоване  роками та доведене до досконалості аби якісно розпакувати вашу особистість, сенси та стиль.</div>
            </div>
          </div>
          <div className={css.contentRow}>
            <div className={cx(css.contentItem, css.mobile, css.right, css.rightNumPosition)}>
              <div className={css.contentItemNum}>2</div>
              <div className={css.contentItemTitle}>Робота з рефами</div>
              <div className={css.contentItemText}>Руйную стереотипи роботи з референсами, ділюсь методами роботи з ними, аналізуємо роботу інфлюенсерів з рефами, джерела референсів. Візуалізуємо ваші сенси.</div>
            </div>
            <div className={css.contentItem}></div>
          </div>
          <div className={css.contentRow}>
            <div className={css.contentItem}></div>
            <div className={cx(css.contentItem, css.mobile, css.left, css.leftNumPosition)}>
              <div className={css.contentItemNum}>3</div>
              <div className={css.contentItemTitle}>Розробка віжуалу</div>
              <div className={css.contentItemText}>Наглядно ділюсь своєю методологією розробки візуальної концепції з референсів та логікою створення годного віжуалу. Віжуал інстайти, виключення з «правил», робота з кольором та його вижимка, віжуал без кольору, прийоми в візуалі, повітря. Практичне завдання- розробка власного віжуалу з рефів за прикладом з уроку.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className={css.commonBg} style={{
      backgroundImage: `url(${footerBanner})`,
    }}>
      <div className={css.nextContent}>
        <div className={css.container}>
          <div className={css.contentList}>
            <div className={css.contentRow}>
              <div className={cx(css.contentItem, css.mobile, css.right, css.rightNumPosition)}>
                <div className={css.contentItemNum}>4</div>
                <div className={cx(css.contentItemTitle, css.accent)}>Реалізація віжуалу</div>
                <div className={cx(css.contentItemText, css.accent)}>Секрет реалізації задуманого віжуалу за одну зйомку, рекомендації щодо зйомки: освітленність, чистота, візуальний шум, налаштування, фішки селф-зйомки, додаткові пристрої. Практичне завдання- зйомка.</div>
              </div>
              <div className={css.contentItem}></div>
            </div>
            <div className={css.contentRow}>
              <div className={css.contentItem}></div>
              <div className={cx(css.contentItem, css.mobile, css.noBorder, css.left, css.leftNumPosition)}>
                <div className={css.contentItemNum}>5</div>
                <div className={cx(css.contentItemTitle, css.accent)}>Готовий віжуал</div>
                <div className={cx(css.contentItemText, css.accent)}>Расказиваю і паказиваю як з сирих кадрів реалізовую референс та витягую омріяний віжуал, чим і як користуюсь. Обкладинки рілс, інтеграція контенту в моменті. Конспект з топовими додатками по обробці. Практичне завдання- перевтілення сирих кадрів та складення віжуалу відповідно задуманого віжуалу з рефів.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className={css.packages} ref={packagesRef}>
        <div className={css.container}>
          <div className={css.packagesList}>
            {Boolean(packages.length) && packages.map(({ id, name, benefits, price, available_places }) => {
              const isDisabled = available_places === 0;
              return (
                <div className={css.packagesItem} key={id}>
                  <div className={css.packagesTitle}>{name}</div>
                  <div className={css.packagesPrice}>Ціна: ${price}</div>
                  <div className={css.availablePlaces}>Вільних місць: {available_places > 0 ? getAvailablePlaces(name, available_places) : 'немає'}</div>
                  <ol className={css.benefits}>
                    {Boolean(benefits.length) && benefits.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                  <button className={css.button} onClick={() => handleChoosePackage(id)} disabled={isDisabled}>Придбати</button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <footer className={css.footer}>
        <div className={css.container}>
          <div className={css.footerContent}>
            <LogoIcon className={css.footerLogo} />
            <div className={css.footerText}>Copyright © 2023 Bilanenco. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </section>
  </div>;
}
