export interface KeyboardProfile {
    keyboardProfileId?: string;
    owner?: string;
    soundBytes?: Record<string, Uint8Array[]>;
    profileName?: string;
}
