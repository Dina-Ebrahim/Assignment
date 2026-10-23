export const createOTP = () => {
  return Math.floor(Math.random() * 900000 + 100000);
};
