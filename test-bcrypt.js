const bcrypt = require('bcryptjs');
console.log('bcrypt ok:', bcrypt.hashSync('test', 12).length > 0);