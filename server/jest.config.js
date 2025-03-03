/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
    return {
        testMatch: ['**/__test__/**/*.js'],
        rootDir: '.',
        verbose: true,
    }
}