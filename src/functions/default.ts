export const generatePassword = (): string => {
  var set1: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    set2: string = "abcdefghijklmnopqrstuvwxyz",
    set3: string = "@#$_",
    set4: string = "1234567890",
    result: string = "";

  for (let i = 1; i <= 14; i++) {
    if (i % 2 && i < 8) {
      let no = Math.ceil(Math.random() * set1.length);
      result += set1.charAt(no);
    } else if (i >= 8 && i < 9) {
      let no = Math.ceil(Math.random() * set3.length);
      result += set3.charAt(no);
    } else if (i >= 10 && i < 12) {
      let no = Math.ceil(Math.random() * set4.length);
      result += set4.charAt(no);
    } else {
      let no = Math.ceil(Math.random() * set2.length);
      result += set2.charAt(no);
    }
  }
  return result;
};
