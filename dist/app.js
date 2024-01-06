"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
(0, sharp_1.default)('./img.jpg')
    .resize({ width: 100 })
    .toBuffer()
    .then((data) => {
    // 100 pixels wide, auto-scaled height
});
//# sourceMappingURL=app.js.map