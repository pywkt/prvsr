import React from 'react';
import styles from '../../styles/Accordion.module.scss';

const AccordionContent = ({ children, isOpen, label, onClick }) => {


    return (
        <div className={styles.accordionInnerContent}>
            {children}
        </div>
    )
}

export default AccordionContent;