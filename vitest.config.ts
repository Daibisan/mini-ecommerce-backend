export default {
  test: {
    globals: true, // Agar tidak perlu import describe, it, expect di tiap file
    environment: 'node',
  },
};