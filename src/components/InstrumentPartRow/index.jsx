import React, { useState } from 'react';
import useCollapse from 'react-collapsed'
import InstrumentSelectorSection from '../InstrumentSelectorSection';
import InstrumentMods from '../InstrumentMods';
import Effects from '../Effects';
import { ReactComponent as Chevron } from '../../icons/chevron-up.svg';
import styles from '../../styles/InstrumentPartRow.module.scss'

const InstrumentPartRow = ({ commitInstrument, currentTime, data, deletePart, disabled, index, instrument, instruments, register, setInstrumentName, setSelectedPart, setValue, tone }) => {
    const { getCollapseProps, getToggleProps } = useCollapse({ defaultExpanded: true });

    const [instrumentOpen, setInstrumentOpen] = useState(false)
    const handleInstrumentOpen = () => setInstrumentOpen(prev => !prev)

    const handlePartSelect = (e, index, name) => {
        e.stopPropagation()
        setSelectedPart(index)
        setInstrumentName(name)
    }

    const instrumentName = `${index + 1}: ${data.instrument}` || ""

    return (
        <>
            <div
                {...getToggleProps({ onClick: handleInstrumentOpen })}
                className={styles.sequencerAccordionLabel}
            >
                <div className={styles.instrumentPartLabel}>
                    <span className={styles.titleAndButtonContainer}>
                        <h4 className={styles.instrumentGridTitle}>{`${index + 1}: ${data.instrument}` || ""}</h4>
                        <button type="button" className={styles.selectPartButton} onClick={(e) => handlePartSelect(e, index, instrumentName)} styles={{ border: `1px solid lightgrey` }}>Select</button>
                    </span>
                    <span className={instrumentOpen ? styles.rotatedChevron : styles.notRotatedChevron}>
                        <Chevron />
                    </span>

                </div>
            </div>

            <div {...getCollapseProps()}>
                <div className={styles.instrumentGrid}>

                    {/* Instrument Selector */}
                    <div className={styles.instrumentSelectorGrid}>
                        <InstrumentSelectorSection
                            currentTime={currentTime}
                            index={index}
                            instruments={instruments}
                            register={register}
                            data={data}
                            commitInstrument={(i) => commitInstrument(i)}
                            deletePart={(i) => deletePart(i)}
                            setValue={setValue}
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