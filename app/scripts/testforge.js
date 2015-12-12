
key = 'VGVkgBZFtbRzIHhU';

decode = forge.util.decode64('SvjC+iCkEhMVpKv0f/PKOKqMDB/Cp4n9y7NhJ+yLd70A6wAMhjyMOLAB2nIKHX6O');
var decipher = forge.cipher.createDecipher('AES-ECB', key);
decipher.start();
decipher.update(forge.util.createBuffer(decode));
decipher.finish();
// outputs decrypted hex
console.log(decipher.output.data);


msg = decipher.output.data;
msg = '{\n  "channel" : "alipay",\n  "amount" : "100"\n}';
cipher = forge.cipher.createCipher('AES-ECB', key);
cipher.start();
cipher.update(forge.util.createBuffer(msg));
cipher.finish();
encrypted = cipher.output;
console.log(forge.util.encode64(encrypted.data));
