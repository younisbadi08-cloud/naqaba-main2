const { hash } = require('bcryptjs');
console.log('bcrypt hash result:', hash('test', 12));
const bcryptjs = require('bcryptjs');
console.log('bcryptjs methods:', Object.keys(bcryptjs).join(', '));