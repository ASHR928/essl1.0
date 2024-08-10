const bcrypt = require('bcryptjs');

exports.encrypt = async (password) => {
    try {
        const salt = 10;
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
};

exports.verify = async (newPwd, oldPwd) => {
    try {
        const passwordsMatch = await bcrypt.compare(newPwd, oldPwd);
        return passwordsMatch;
    } catch (error) {
        throw error;
    }
};