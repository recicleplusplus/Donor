export const getValidImageUrl = (url: string | undefined) => {
    if (!url || typeof url !== 'string') {
        return require('../../assets/images/profile.jpg');
    }
    return { uri: url };
};