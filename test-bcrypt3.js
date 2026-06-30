try {
    const bcryptjs = require('bcryptjs');
    console.log('bcryptjs methods:', Object.keys(bcryptjs || {}));
    console.log('bcryptjs:', bcryptjs);
} catch (e) {
    console.log('Error:', e);
}