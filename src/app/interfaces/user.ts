import { KeyboardProfile } from "./keyboardprofile";

export interface User {
    username?: string;
    email?: string;
    profilePictureUrl?: string;
    keyboardProfile?: KeyboardProfile[];
}
