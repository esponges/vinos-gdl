// axios fake library for mocks

export default {
    get: jest.fn(() => Promise.resolve({ data: {} }) ),
    post: jest.fn(() => Promise.resolve({ data: {} }) )
};
