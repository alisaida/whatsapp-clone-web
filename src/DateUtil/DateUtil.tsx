import moment from "moment"

export const timeAgo = (date: string) => {
    var now = moment();
    var past = moment(date);
    var result = now.diff(past, 'days');

    if (result < 1) {
        return past.format('LT');
    } else if (result < 2) {
        return 'Yesterday';
    } else if (result < 5) {
        return past.format('dddd');
    } else {
        return past.format("DD/MM/YYYY");
    }
}