import React, { useState, useRef, useCallback, useEffect } from "react";
import cx from 'classnames';
import { API } from 'aws-amplify';

import mainBanner from 'assets/main.jpg';
import footerBanner from 'assets/footer.jpg';
import { ReactComponent as LogoIcon } from 'assets/logo.svg';

import { Registration, Package } from "components/Registration";

import css from './main.module.scss';

export const MainPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageId, setPackageId] = useState<string>();
  const packagesRef = useRef<HTMLElement>(null);

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
          <div className={css.headerText}>Курс воркжопу, я маю сумніви, що є таке слово, але я пишу цей текст від балди, адже він мені потрібен тільки для краси</div>
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
              <div className={css.contentItemText}>Курс воркжопу, я маю сумніви, що є таке слово, але я пишу цей текст від балди, адже він мені потрібен тільки для краси. Рибний текст, для краси пишу від душі</div>
            </div>
          </div>
          <div className={css.contentRow}>
            <div className={cx(css.contentItem, css.mobile, css.right, css.rightNumPosition)}>
              <div className={css.contentItemNum}>2</div>
              <div className={css.contentItemTitle}>Робота з рефами</div>
              <div className={css.contentItemText}>Курс воркжопу, я маю сумніви, що є таке слово, але я пишу цей текст від балди, адже він мені потрібен тільки для краси. Рибний текст, для краси пишу від душі</div>
            </div>
            <div className={css.contentItem}></div>
          </div>
          <div className={css.contentRow}>
            <div className={css.contentItem}></div>
            <div className={cx(css.contentItem, css.mobile, css.left, css.leftNumPosition)}>
              <div className={css.contentItemNum}>3</div>
              <div className={css.contentItemTitle}>Розробка віжуалу</div>
              <div className={css.contentItemText}>Курс воркжопу, я маю сумніви, що є таке слово, але я пишу цей текст від балди, адже він мені потрібен тільки для краси. Рибний текст, для краси пишу від душі</div>
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
                <div className={cx(css.contentItemTitle, css.accent)}>Обробка</div>
                <div className={cx(css.contentItemText, css.accent)}>Курс воркжопу, я маю сумніви, що є таке слово, але я пишу цей текст від балди, адже він мені потрібен тільки для краси. Рибний текст, для краси пишу від душі</div>
              </div>
              <div className={css.contentItem}></div>
            </div>
            <div className={css.contentRow}>
              <div className={css.contentItem}></div>
              <div className={cx(css.contentItem, css.mobile, css.noBorder, css.left, css.leftNumPosition)}>
                <div className={css.contentItemNum}>5</div>
                <div className={cx(css.contentItemTitle, css.accent)}>Готовий віжуал</div>
                <div className={cx(css.contentItemText, css.accent)}>Курс воркжопу, я маю сумніви, що є таке слово, але я пишу цей текст від балди, адже він мені потрібен тільки для краси. Рибний текст, для краси пишу від душі</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className={css.packages} ref={packagesRef}>
        <div className={css.container}>
          <div className={css.packagesList}>
            {Boolean(packages.length) && packages.map(({ id, name, benefits, price }) => (
              <div className={css.packagesItem} key={id}>
                <div className={css.packagesTitle}>{name}</div>
                <div className={css.packagesPrice}>Ціна: ${price}</div>
                <ol className={css.benefits}>
                  {Boolean(benefits.length) && benefits.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <button className={css.button} onClick={() => handleChoosePackage(id)}>Придбати</button>
              </div>
            ))}
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
