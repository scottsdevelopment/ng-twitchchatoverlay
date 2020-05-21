import { Badges } from 'tmi.js';

export default interface ChatMessage {
    badges?: Badges,
    color: string,
    username: string,
    messageParts: Array<(string | { image: string })>
}