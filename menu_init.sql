-- 菜单初始化数据
-- 基于 namecards_menus 表结构
-- 清空现有菜单数据
DELETE FROM namecards_menus;

-- 重置自增ID
ALTER TABLE namecards_menus AUTO_INCREMENT = 1;

-- 1. Dashboard 目录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '仪表盘', 'directory', '/dashboard', 'dashboard', 'ri:pie-chart-line', 1, 1, NOW(), NOW());

SET @dashboard_id = LAST_INSERT_ID();

-- 1.1 控制台
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@dashboard_id, '控制台', 'menu', '/dashboard/console', 'dashboard:console', NULL, 1, 1, NOW(), NOW());

-- 2. 系统管理目录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '系统管理', 'directory', '/system', 'system', 'ri:user-3-line', 2, 1, NOW(), NOW());

SET @system_id = LAST_INSERT_ID();

-- 2.1 用户管理
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@system_id, '用户管理', 'menu', '/system/user', 'system:user', NULL, 1, 1, NOW(), NOW());

-- 2.2 角色管理
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@system_id, '角色管理', 'menu', '/system/role', 'system:role', NULL, 2, 1, NOW(), NOW());

-- 2.3 菜单管理
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@system_id, '菜单管理', 'menu', '/system/menu', 'system:menu', NULL, 3, 1, NOW(), NOW());

SET @menu_id = LAST_INSERT_ID();

-- 2.3.1 菜单管理按钮权限
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@menu_id, '新增', 'button', NULL, 'system:menu:add', NULL, 1, 1, NOW(), NOW());

INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@menu_id, '编辑', 'button', NULL, 'system:menu:edit', NULL, 2, 1, NOW(), NOW());

INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@menu_id, '删除', 'button', NULL, 'system:menu:delete', NULL, 3, 1, NOW(), NOW());

-- 3. 会员中心
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '会员中心', 'menu', '/member', 'member', 'ri:user-star-line', 3, 1, NOW(), NOW());

-- 4. 公告管理
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '公告管理', 'menu', '/announcement', 'announcement', 'ri:notification-3-line', 4, 1, NOW(), NOW());

-- 5. 对话管理目录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '对话管理', 'directory', '/conversation', 'conversation', 'ri:message-3-line', 5, 1, NOW(), NOW());

SET @conversation_id = LAST_INSERT_ID();

-- 5.1 对话记录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@conversation_id, '对话记录', 'menu', '/conversation/record', 'conversation:record', NULL, 1, 1, NOW(), NOW());

-- 5.2 点赞记录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@conversation_id, '点赞记录', 'menu', '/conversation/like', 'conversation:like', NULL, 2, 1, NOW(), NOW());

-- 5.3 评论记录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@conversation_id, '评论记录', 'menu', '/conversation/comment', 'conversation:comment', NULL, 3, 1, NOW(), NOW());

-- 6. 会话类型管理
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '会话类型', 'menu', '/session-type', 'session-type', 'ri:chat-settings-line', 6, 1, NOW(), NOW());

-- 7. 设置目录
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (NULL, '系统设置', 'directory', '/settings', 'settings', 'ri:settings-3-line', 7, 1, NOW(), NOW());

SET @settings_id = LAST_INSERT_ID();

-- 7.1 基础设置
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@settings_id, '基础设置', 'menu', '/settings/basic', 'settings:basic', NULL, 1, 1, NOW(), NOW());

-- 7.2 应用菜单设置
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@settings_id, '应用菜单', 'menu', '/settings/app-menu', 'settings:app-menu', NULL, 2, 1, NOW(), NOW());

-- 7.3 用户协议设置
INSERT INTO namecards_menus (parent_id, menu_name, menu_type, route, permission_code, icon, sort_order, status, created_at, updated_at) 
VALUES (@settings_id, '用户协议', 'menu', '/settings/user-agreement', 'settings:user-agreement', NULL, 3, 1, NOW(), NOW());

-- 查看插入结果
SELECT id, parent_id, menu_name, menu_type, route, permission_code, sort_order, status 
FROM namecards_menus 
ORDER BY parent_id, sort_order;
