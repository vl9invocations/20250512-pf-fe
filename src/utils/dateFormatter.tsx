export default function formatDate(date: string, locale: string): string {
    const options: Intl.DateTimeFormatOptions = {
        // year: 'numeric',
        // month: '2-digit',
        // day: '2-digit',
        dateStyle: 'short'
    };

    return new Intl.DateTimeFormat(locale, options)
        .format(new Date(date));
}