import * as Tone from 'tone'

export const allChannels = {}

export const makeChannel = (index) => {
    // console.log("start channel")
    if (!allChannels?.[`channel-${index}`]) {
        allChannels[`channel-${index}`] =
        {
            name: `channel-${index}`,
            data: new Tone.Channel({ channelCount: 2 }).toDestination()
        }
    }
    
    return allChannels[`channel-${index}`].data
}