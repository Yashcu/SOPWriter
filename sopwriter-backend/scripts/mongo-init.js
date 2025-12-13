db = db.getSiblingDB('gdocs_dev');

db.createUser({
    user: 'gdocs_user',
    pwd: 'gdocs_pass',
    roles: [
        {
            role: 'readWrite',
            db: 'gdocs_dev',
        },
    ],
});

db.createCollection('services');
db.createCollection('users');
