import React from 'react';
import styles from '../../styles/NotesToUse.module.scss';

const NotesToUse = ({ index, register }) => {
    const notesToUse = ['1n', '2n', '4n', '8n', '16n']

    return (
        <div className={styles.notesToUseContainer}>
            <div>Notes to include:</div>
            {notesToUse.map(n => (
                <div key={n} className={styles.notesToUseCheckboxes}>
                    <label htmlFor={`notes-to-use-${n}-${index}`}>{n}</label>
                    <input name={n} type="checkbox" {...register(`instrumentArray.${index}.notesToUse.${n}`)} id={`notes-to-use-${n}-${index}`} />
                </div>
            ))}
        </div>
    )
}

export default NotesToUse;