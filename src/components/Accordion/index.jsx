import React, { useState } from 'react';
import AccordionContent from './AccordionContent';
import styles from '../../styles/Accordion.module.scss';

const Accordion = ({ children, label, labelAlign }) => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(prev => !prev)

    return (
        <div>
            <div className={styles.accordionLabel} onClick={handleOpen} style={{ textAlign: labelAlign }}>
                <span>{label}</span>
            </div>
            {open && <AccordionContent>{children}</AccordionContent>}
        </div>
    )
}

export default Accordion;