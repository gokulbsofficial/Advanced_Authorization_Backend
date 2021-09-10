"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
var generatePassword = function () {
    var set1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", set2 = "abcdefghijklmnopqrstuvwxyz", set3 = "@#$_", set4 = "1234567890", result = "";
    for (var i = 1; i <= 14; i++) {
        if (i % 2 && i < 8) {
            var no = Math.ceil(Math.random() * set1.length);
            result += set1.charAt(no);
        }
        else if (i >= 8 && i < 9) {
            var no = Math.ceil(Math.random() * set3.length);
            result += set3.charAt(no);
        }
        else if (i >= 10 && i < 12) {
            var no = Math.ceil(Math.random() * set4.length);
            result += set4.charAt(no);
        }
        else {
            var no = Math.ceil(Math.random() * set2.length);
            result += set2.charAt(no);
        }
    }
    return result;
};
exports.generatePassword = generatePassword;
