import React, { useState } from 'react';
import useCollapse from 'react-collapsed'
import InstrumentSelectorSection from '../InstrumentSelectorSection';
import InstrumentMods from '../InstrumentMods';
import Effects from '../Effects';
import { ReactComponent as Chevron } from '../../icons/chevron-up.svg';
import styles from '../../styles/App.module.scss';
import rowStyles from '../../styles/InstrumentPartRow.module.scss'

const InstrumentPartRow = ({ commitInstrument, data, deletePart, disabled, index, instrument, instruments, register, tone }) => {
    const { getCollapseProps, getToggleProps } = useCollapse({ defaultExpanded: true });

    const [instrumentOpen, setInstrumentOpen] = useState(false)
    const handleInstrumentOpen = () => setInstrumentOpen(prev => !prev)

    return (
        <>
            <div
                {...getToggleProps({ onClick: handleInstrumentOpen })}
                className={rowStyles.sequencerAccordionLabel}
            >
                <div className={rowStyles.instrumentPartLabel}>
                    <span>
                        <h4 className={rowStyles.instrumentGridTitle}>{`${index + 1}: ${data.instrument}` || ""}</h4>
                    </span>
                    <span className={instrumentOpen ? rowStyles.rotatedChevron : rowStyles.notRotatedChevron}>
                        <Chevron />
                    </span>

                </div>
            </div>

            <div {...getCollapseProps()}>
                <div className={styles.instrumentGrid}>

                    {/* Instrument Selector */}
                    <div className={styles.instrumentSelectorGrid}>
                        <InstrumentSelectorSection
                            index={index}
                            instruments={instruments}
                            register={register}
                            data={data}
                            commitInstrument={(i) => commitInstrument(i)}
                            deletePart={(i) => deletePart(i)}
                        />
                    </div>

                    {/* Instrument Settings */}
                    <div className={styles.instrumentControlsGrid}>
                        {/monoSynth|fmSynth|amSynth|pluckSynth/.test(instrument) &&
                            <InstrumentMods instrument={instrument} index={index} />
                        }
                    </div>


                    {/* Instrument Effects */}
                    <div className={styles.instrumentEffectsGrid}>
                        <Effects index={index} partData={data} disabled={disabled} tone={tone} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default InstrumentPartRow;