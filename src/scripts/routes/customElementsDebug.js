export default class customElementsDebug {
    static async init(parameters) {
        const timestamp = Date.now();
        document.getElementById("timeStamp").value = timestamp;
        document.getElementById("timeStampLabel").innerText = `<time-stamp value="${timestamp}">`;

        document.getElementById("timeStamp1").value = timestamp;
        document.getElementById("timeStampLabel1").innerText = `<time-stamp
    type="datetime"
    value="${timestamp}"
>`;

        document.getElementById("radioList").addEventListener("click", () => {
            document.getElementById("radioListLabel").innerText = `<radio-list value="${document.getElementById("radioList").value}">`;
        });

        document.getElementById("checkList").addEventListener("click", () => {
            document.getElementById("checkListLabel").innerText = `<check-list value="${document.getElementById("checkList").value}">`;
        });
    }

    static cleanup() {

    }
}
