const generateRandomNumber = (array: number[]): number => {
  let randomNumber: number;
  do {
    randomNumber = Math.floor(Math.random() * 100); // Change 100 to your desired upper bound
  } while (array.includes(randomNumber));
  return randomNumber;
};

export default generateRandomNumber;
