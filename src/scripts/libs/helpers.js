
export class Helpers {
    static compareUint(a, b) {
        return a.length === b.length && a.every((v, i) => v === b[i]);
    }

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
        const all = [...str.matchAll(new RegExp(emojiRegex, "gu"))];

        return all.length > 0 ? all[all.length - 1][0] : null;
    }

    static timeSince(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);

            if (count > 0) {
                return count + " " + interval.label + (count !== 1 ? "s" : "") + " ago";
            }
        }

        return "just now";
    }

    static formatDate(date) {
        const dateInput = new Date(date);
        const currentDate = new Date();

        const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const startOfYesterday = new Date(startOfToday);
        
        startOfYesterday.setDate(startOfToday.getDate() - 1);

        const formattedTime = dateInput.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        
        if (dateInput >= startOfToday) {
            return `today at ${formattedTime}`;
        } else if (dateInput >= startOfYesterday) {
            return `yesterday at ${formattedTime}`;
        } else {
            const formattedDate = dateInput.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
            
            return `${formattedDate} ${formattedTime}`;
        }
    }
}
