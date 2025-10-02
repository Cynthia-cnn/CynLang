function tokenize(code) {
    const tokens = [];
    const regex = /\s*(=>|<=|>=|==|!=|\.\.|&&|\|\||[(){}=,+\-*/<>!]|biarkan|tulis|jika|maka|selain itu|selesai|fungsi|kembalikan|ulang|dari|sampai|benar|salah|[A-Za-z_]\w*|\d+|".*?")\s*/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
        tokens.push(match[1]);
    }
    return tokens;
}

module.exports = { tokenize };