
export class Constants {
    static Magic = [0x4d, 0x50]; // Magic aka "MP"
    static Version = 0x00; // The current version number

    static ChunkSize = 128;

    static PayloadType = {
        Signalling: 0x00,
        Message: 0x01,
        File: 0x02,
        Voice: 0x03
    };

    static MessageEvent = {
        MessageProgress: "messageProgress",
        Message: "message",
        File: "file"
    };

    static MeshcorePushCodes = {
        LogRxData: 0x88
    };
}
