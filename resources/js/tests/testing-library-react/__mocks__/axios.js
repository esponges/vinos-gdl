// axios fake library for mocks

// import axios from "axios";

// export default {
//     get: jest.fn(() => Promise.resolve({ data: {} }) ),
//     post: jest.fn(() => Promise.resolve({ data: {} }) )
// };

export default {
    post: jest.fn().mockResolvedValue({ data: {} }),
    get: jest.fn().mockResolvedValue({ data: {} }),
    create: jest.fn().mockResolvedValue({ data: {} }),
    // getAgain: jest.fn().mockResolvedValue({ data: {} }),
};
