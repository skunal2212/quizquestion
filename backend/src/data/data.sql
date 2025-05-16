INSERT INTO public."Users" (username, "password", "role", "createdAt", "updatedAt")
VALUES
('admin1', '$2b$10$0aQs1oGO50q3YGcIqYCuH.IFPqs/jB4e1w8wvuzx6ht/E6FbHUuAi', 'admin', now(), now()), -- password: admin123
('user1', '$2b$10$0aQs1oGO50q3YGcIqYCuH.IFPqs/jB4e1w8wvuzx6ht/E6FbHUuAi', 'user', now(), now()); -- password: admin123


/*

Admin:
username: admin1
password: admin123

User:
username: user1
password: admin123

*/