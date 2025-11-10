export default function useNumberFormat(locale = 'vi-VN') {
    return (value) => value.toLocaleString(locale);
}