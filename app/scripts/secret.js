(function() {

    var key = 'VGVkgBZFtbRzIHhU';

    App.encryptJSON = function(data) {
        // msg = '{\n  "channel" : "alipay",\n  "amount" : "100"\n}';
        var msg = JSON.stringify(data);
        msg = forge.util.encodeUtf8(msg);
        var cipher = forge.cipher.createCipher('AES-ECB', key);
        cipher.start();
        cipher.update(forge.util.createBuffer(msg));
        cipher.finish();
        var encrypted = cipher.output;
        var encryptedBase64 = forge.util.encode64(encrypted.data);
        // console.log(encryptedBase64);
        return encryptedBase64;
    };

    App.decryptJSON = function(encrypted) {
        // encrypted = 'SvjC+iCkEhMVpKv0f/PKOKqMDB/Cp4n9y7NhJ+yLd70A6wAMhjyMOLAB2nIKHX6O';
        var decode = forge.util.decode64(encrypted);
        var decipher = forge.cipher.createDecipher('AES-ECB', key);
        decipher.start();
        decipher.update(forge.util.createBuffer(decode));
        decipher.finish();
        var decrypted = decipher.output.data;
        decrypted = forge.util.decodeUtf8(decrypted);
        var decryptedData = JSON.parse(decrypted);
        // console.log(decryptedData);
        return decryptedData;
    };

})();
