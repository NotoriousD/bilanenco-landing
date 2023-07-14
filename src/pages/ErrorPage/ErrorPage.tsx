import React from "react";
import { useNavigate } from 'react-router-dom';

import css from './errorPage.module.scss';

export const ErrorPage: React.FC = () => {
    const navigate = useNavigate();
    return <div className={css.root}>
        <div className={css.content}>
            <div className={css.title}>Упс...</div>
            <div className={css.text}>Щось пішло не так</div>
            <button className={css.btn} onClick={() => navigate('/')}>Повернутися</button>
        </div>
    </div>;
}
