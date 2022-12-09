export async function fetch_readme(link: string): Promise<string> {

    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow'
    };

    const readme = await fetch(link, requestOptions)
                .then(response => response.text())
                .catch(error => error);
    return readme;
}