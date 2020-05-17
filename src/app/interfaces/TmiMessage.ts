import * as tmi from 'tmi.js';

export interface TmiMessage {
    channel: string,
    userstate: tmi.ChatUserstate,
    message: string,
    self: boolean
}