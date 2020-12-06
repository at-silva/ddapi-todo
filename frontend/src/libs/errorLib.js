export function onError(error) {
    let message = error.toString();

    if (error.response && error.response.status === 401) {
        message = "Authentication Failed, please, check your credentials."
    }

    console.log(error.response);

    alert(message);
}