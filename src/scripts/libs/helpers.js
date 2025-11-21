
export class Helpers {
    static limitText(text, length) {
        return text.length > length ? text.slice(0, length) + "..." : text;
    }

    static toSigned32(number) {
        return number > 0x7FFFFFFF ? number - 0x100000000 : number;
    }

    static stringToColour(str, saturation = 70, lightness = 45) {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    static getLastEmoji(str) {
        const emojiRegex = /[\p{Extended_Pictographic}]/u;
        const all = [...str.matchAll(new RegExp(emojiRegex, 'gu'))];

        return all.length > 0 ? all[all.length - 1][0] : null;
    }
}
