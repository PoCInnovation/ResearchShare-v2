export function truncate(str: string, n: number) {
    return (
        (str.length > n) ?
            str.substr(0, n - (n / 2)) + '...' + str.substr(str.length - (n / 2), str.length) : str
    );
}
