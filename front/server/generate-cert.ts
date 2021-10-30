const fs = require('fs');
const path = require('path');
const pem = require('pem');

pem.config({
    pathOpenSSL: "C:\\Program Files\\Git\\usr\\bin\\openssl.exe"
});

pem.createCertificate({ selfSigned: true }, function (err, keys) {
    if (err) {
        throw err
    }

    const { csr, clientKey, serviceKey, certificate } = keys;
    const certPath = path.join(__dirname, "./certificates");

    console.log('GENERATED');
    console.log(certPath);

    if (!fs.existsSync(certPath)) {
        fs.mkdirSync(certPath);
    }
    fs.writeFileSync(path.join(certPath, 'csr.pem'), csr);
    fs.writeFileSync(path.join(certPath, 'clientKey.pem'), clientKey);
    fs.writeFileSync(path.join(certPath, 'serviceKey.pem'), serviceKey);
    fs.writeFileSync(path.join(certPath, 'certificate.pem'), certificate);
});
