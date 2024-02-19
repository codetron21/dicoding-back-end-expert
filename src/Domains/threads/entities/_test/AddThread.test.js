const AddThread = require('../AddThread');

describe('add thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'tips programmer',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: {},
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create registeredUser object correctly', () => {
        // Arrange
        const payload = {
            title: 'tips programmer',
            body: 'jago progmram',
        };

        // Action
        const addThread = new AddThread(payload);

        // Assert
        expect(addThread.title).toEqual(payload.title);
        expect(addThread.body).toEqual(payload.body);
    });
});