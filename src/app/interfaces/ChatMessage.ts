import { Badges } from 'tmi.js';

export default interface ChatMessage {
    badges?: Badges,
    style: { [key: string]: any },
    username: string,
    messageParts: Array<(string | { image: string })>
}