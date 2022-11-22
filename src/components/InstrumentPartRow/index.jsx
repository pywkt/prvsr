import React from 'react';
import InstrumentSelectorSection from '../InstrumentSelectorSection';
import InstrumentMods from '../InstrumentMods';
import Effects from '../Effects';
import styles from '../../styles/App.module.scss';

const InstrumentPartRow = ({ commitInstrument, data, deletePart, disabled, index, instrument, instruments, partData, register, tone}) => {

    return (
        <>
            <h4 className={styles.instrumentGridTitle}>{`${index + 1}: ${data.instrument}` || ""}</h4>
            <hr className={styles.instrumentGridHr} />
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
                    <Effects index={index} partData={partData} disabled={disabled} tone={tone} />
                </div>
            </div>
        </>
    )
}

export default InstrumentPartRow;