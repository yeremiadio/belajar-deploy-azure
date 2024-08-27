const handleInputChangeNumberOnly = (
    event: React.ChangeEvent<HTMLInputElement>,
) => {
    const regex = /^[0-9\b]+$/; // Only allow digits and backspace (\b)
    const inputValue = event.target.value;

    if (!regex.test(inputValue)) {
        // Remove any non-digit characters from the input value
        const sanitizedValue = inputValue.replace(/\D/g, "");

        // Update the input field value with the sanitized value
        event.target.value = sanitizedValue;
    }
};

export default handleInputChangeNumberOnly;