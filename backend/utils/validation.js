// Validation helper functions

exports.validateEmail = (email) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
};

exports.validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

exports.validateAadhaar = (aadhaar) => {
    const re = /^[0-9]{12}$/;
    return re.test(aadhaar);
};

exports.validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

exports.validateCoordinates = (coordinates) => {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        return false;
    }
    const [longitude, latitude] = coordinates;
    return (
        typeof longitude === 'number' &&
        typeof latitude === 'number' &&
        longitude >= -180 &&
        longitude <= 180 &&
        latitude >= -90 &&
        latitude <= 90
    );
};
