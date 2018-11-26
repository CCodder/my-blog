var mysql = require('mysql');
var config = require('../config/default.js')

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
});

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        // 使用连接
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                // 使用连接执行查询
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    //连接不再使用，返回到连接池
                    connection.release();
                });
            };
        });
    });
}

// create table if not exists users()表示如果users表不存在则创建该表，避免每次重复建表报错的情况。
let users =
    `create table if not exists users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    pass VARCHAR(100) NOT NULL COMMENT '密码',
    avator VARCHAR(100) NOT NULL COMMENT '头像',
    moment VARCHAR(100) NOT NULL COMMENT '注册时间',
    PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let posts =
    `create table if not exists posts(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '文章作者',
    title TEXT(0) NOT NULL COMMENT '评论题目',
    content TEXT(0) NOT NULL COMMENT '评论内容',
    md TEXT(0) NOT NULL COMMENT 'markdown',
    uid VARCHAR(40) NOT NULL COMMENT '用户id',
    tagname TEXT(0) NOT NULL COMMENT '标签名称',
    moment VARCHAR(100) NOT NULL COMMENT '发表时间',
    comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
    pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
    avator VARCHAR(100) NOT NULL COMMENT '用户头像',
    likes TEXT(0) NOT NULL COMMENT '点赞数',
    PRIMARY KEY(id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let comment =
    `create table if not exists comment(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名称',
    content TEXT(0) NOT NULL COMMENT '评论内容',
    moment VARCHAR(40) NOT NULL COMMENT '评论时间',
    postid VARCHAR(40) NOT NULL COMMENT '文章id',
    avator VARCHAR(100) NOT NULL COMMENT '用户头像',
    PRIMARY KEY(id) 
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let likes =
    `create table if not exists likes(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名称',
    moment VARCHAR(40) NOT NULL COMMENT '点赞时间',
    postid VARCHAR(40) NOT NULL COMMENT '文章id',
    avator VARCHAR(100) NOT NULL COMMENT '用户头像',
    PRIMARY KEY(id) 
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let tags =
    `create table if not exists tags(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '用户名称',
    tagname VARCHAR(100) NOT NULL COMMENT '标签名称',
    uid VARCHAR(40) NOT NULL COMMENT '用户id',
    title TEXT(0) NOT NULL COMMENT '标题',
    PRIMARY KEY(id) 
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`

let createTable = (sql) => {
    return query(sql, [])
}

// 建表
createTable(users)
createTable(posts)
createTable(comment)
createTable(tags)
createTable(likes)

// 注册用户
exports.insertData = (value) => {
    let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
    return query(_sql, value)
}

// 存储标签
exports.posttagsData = (value) => {
    let _sql = "insert into tags set name=?,tagname=?,uid=?title=?;"
    return query(_sql, value)
}

// 查寻标签
exports.findTagsData = (name) => {
    let _sql = `select * from tags where name="${name}";`
    return query(_sql)
}

// 删除用户
exports.deleteUserData = (name) => {
    let _sql = `delete from users where name="${name}";`
    return query(_sql)
}
// 查找用户
exports.findUserData = (name) => {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}
// 发表文章
exports.insertPost = (value) => {
    let _sql = "insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?,tagname=?;"
    return query(_sql, value)
}
// 增加文章评论数
exports.addPostCommentCount = (value) => {
    let _sql = "update posts set comments = comments + 1 where id=?"
    return query(_sql, value)
}
// 减少文章评论数
exports.reducePostCommentCount = (value) => {
    let _sql = "update posts set comments = comments - 1 where id=?"
    return query(_sql, value)
}

// 更新浏览数
exports.updatePostPv = (value) => {
    let _sql = "update posts set pv= pv + 1 where id=?"
    return query(_sql, value)
}
// 发表评论
exports.insertComment = (value) => {
    let _sql = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
    return query(_sql, value)
}

// 增加点赞数
exports.addGiveLikeCount = (value) => {
    let _sql = "update posts set likes = likes + 1 where id=?"
    return query(_sql, value)
}

// 减少点赞数
exports.reduceGiveLikeCount = (value) => {
    let _sql = "update posts set likes = likes - 1 where id=?"
    return query(_sql, value)
}
// 点赞
exports.giveLike = (value) => {
    let _sql = "insert into likes set name=?,moment=?,postid=?,avator=?;"
    return query(_sql, value)
}
// 删除点赞信息
exports.deleteLike = (name, id) => {
    let _sql = `delete from likes where name="${name}" and postid="${id}";`
    return query(_sql)
}
// 通过名字查找用户
exports.findDataByName = (name) => {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}
// 通过名字查找用户数量判断是否已经存在
exports.findDataCountByName = (name) => {
    let _sql = `select count(*) as count from users where name="${name}";`
    return query(_sql)
}
// 通过文章的名字查找用户
exports.findDataByUser = (name) => {
    let _sql = `select * from posts where name="${name}";`
    return query(_sql)
}
// 通过文章id查找
exports.findDataById = (id) => {
    let _sql = `select * from posts where id="${id}";`
    return query(_sql)
}
// 通过文章id查找点赞信息
exports.findLikesById = (id) => {
    let _sql = `select * from likes where postid="${id}";`
    return query(_sql)
}
// 通过文章id查找
exports.findCommentById = (id) => {
    let _sql = `select * from comment where postid="${id}";`
    return query(_sql)
}

// 通过文章id查找评论数
exports.findCommentCountById = (id) => {
    let _sql = `select count(*) as count from comment where postid="${id}";`
    return query(_sql)
}

// 通过评论id查找
exports.findComment = (id) => {
    let _sql = `select * from comment where id="${id}";`
    return query(_sql)
}
// 查询所有文章
exports.findAllPost = () => {
    let _sql = `select * from posts;`
    return query(_sql)
}
// 查询所有文章数量
exports.findAllPostCount = () => {
    let _sql = `select count(*) as count from posts;`
    return query(_sql)
}
// 查询分页文章
exports.findPostByPage = (page) => {
    let _sql = ` select * from posts limit ${(page-1)*10},10;`
    return query(_sql)
}
// 查询所有个人用户文章数量
exports.findPostCountByName = (name) => {
    let _sql = `select count(*) as count from posts where name="${name}";`
    return query(_sql)
}
// 查询个人分页文章
exports.findPostByUserPage = (name, page) => {
    let _sql = ` select * from posts where name="${name}" order by id desc limit ${(page-1)*10},10 ;`
    return query(_sql)
}
// 更新修改文章
exports.updatePost = (values) => {
    let _sql = `update posts set title=?,content=?,md=? where id=?`
    return query(_sql, values)
}
// 删除文章
exports.deletePost = (id) => {
    let _sql = `delete from posts where id = ${id}`
    return query(_sql)
}
// 删除评论
exports.deleteComment = (id) => {
    let _sql = `delete from comment where id=${id}`
    return query(_sql)
}
// 删除所有评论
exports.deleteAllPostComment = (id) => {
    let _sql = `delete from comment where postid=${id}`
    return query(_sql)
}

// 滚动无限加载数据
exports.findPageById = (page) => {
    let _sql = `select * from posts limit ${(page-1)*5},5;`
    return query(_sql)
}
// 评论分页
exports.findCommentByPage = (page, postId) => {
    let _sql = `select * from comment where postid=${postId} order by id desc limit ${(page-1)*10},10;`
    return query(_sql)
}