interface StatusMessage {
    title: string;
    message: string;
}

const generateStatusCodesMessage = (statusCode: number): StatusMessage => {
    switch (statusCode) {
        case 200:
            return { title: "Success!", message: "The request has succeeded." };
        case 201:
            return { title: "Created", message: "Resource created successfully." };
        case 204:
            return { title: "Success!", message: "Request processed, but no content returned." };
        case 400:
            return { title: "Bad Request", message: "Oops! Something went wrong. Please check your input and try again." };
        case 401:
            return { title: "Unauthorized", message: "Access denied! Authentication required." };
        case 403:
            return { title: "Forbidden", message: "Access denied! You don't have permission to access this resource." };
        case 404:
            return { title: "Not Found", message: "Uh-oh! The requested resource could not be found." };
        case 405:
            return { title: "Method Not Allowed", message: "Oops! The specified method is not allowed for this resource." };
        case 409:
            return { title: "Conflict", message: "Conflict! Unable to complete the request due to a conflict with the current state of the resource." };
        case 429:
            return { title: "Too Many Requests", message: "Slow down! You've exceeded the request rate limit." };
        case 500:
            return { title: "Internal Server Error", message: "Oops! Something went wrong on our end. Please try again later." };
        case 502:
            return { title: "Bad Gateway", message: "Oops! There's an issue with the server's gateway." };
        case 503:
            return { title: "Service Unavailable", message: "Service Unavailable! The server is currently unable to handle the request due to temporary overloading or maintenance." };
        case 504:
            return { title: "Gateway Timeout", message: "Oops! The server didn't receive a timely response from an upstream server." };
        default:
            return { title: "Unknown Status Code", message: "An unknown status code was returned." };
    }
}

export default generateStatusCodesMessage