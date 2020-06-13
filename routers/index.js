var API_KEY = 1305;
const SECRET_KEY = "K62_UET";

const express = require('express');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: SECRET_KEY
});

var router = express.Router();

/*===============================================================
    JWT
================================================================*/

// JWT TEST
router.get('/testjwt', jwtMW, function(req, res){
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    var fbid = decoded.fbid;
    res.send(JSON.stringify({success: true, message: fbid}));
});

router.get('/getkey', function(req, res, next){
    
    var fbid = req.query.fbid;
    if (fbid != undefined){
        let token = jwt.sign({fbid: fbid}, SECRET_KEY, {}); // Sign token
        res.send(JSON.stringify({success: true, token: token}));
    }
    else {
        res.send(JSON.stringify({success: false, message: "Thiếu fbid ở truy vấn!!"}));
    }

});

// GET
router.get('/', function(req, res, next){
    res.send('Hello World');
});

/*===============================================================
USER TABLE
GET/POST
================================================================*/

router.get('/user', jwtMW,function(req, res, next){

    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    var fbid = decoded.fbid;

    if (fbid != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT userPhone, name, address, fbid FROM User WHERE fbid=?', [fbid], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
    }

});

router.post('/user', jwtMW, function(req, res, next){
    
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    var fbid = decoded.fbid;

    var user_phone = req.body.userPhone;
    var user_name = req.body.userName;
    var user_address = req.body.userAddress;


    if (fbid != undefined){
        req.getConnection(function(error, conn){
            conn.query('INSERT INTO User(FBID, UserPhone, Name, Address) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE Name=?, Address=?', [fbid, user_phone, user_name, user_address, user_name, user_address], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.affectedRows > 0){
                        res.send(JSON.stringify({success: true, message: "Success"}));
                    }  
                }   

            })
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing fbid in body'}));
    }

});

/*===============================================================
RESTAURANTOWNER TABLE
GET/POST
================================================================*/

router.get('/restaurantowner', jwtMW,function(req, res, next){

    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const fbid = decoded.fbid;

    if (fbid != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT userPhone, name, CASE WHEN status=0 THEN \'FALSE\' ELSE \'TRUE\' END as status, restaurantId, fbid FROM restaurantowner WHERE fbid=?', [fbid], function(err, rows, fields){
                
                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        console.log(JSON.stringify({success: true, result: rows}));
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
    }

});

router.post('/restaurantowner', jwtMW, function(req, res, next){
    
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const fbid = decoded.fbid;

    const restaurantowner_phone = req.body.restaurantownerPhone;
    const restaurantowner_name = req.body.restaurantownerName;
    const restaurantowner_id = req.body.restaurantownerId;
    const restaurantowner_status = req.body.restaurantownerStatus;


    if (fbid != undefined){
        req.getConnection(function(error, conn){
            conn.query('INSERT INTO Restaurantowner(FBID, UserPhone, Name, RestaurantId, Status) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Name=?, UserPhone=?', [fbid, restaurantowner_phone, restaurantowner_name, restaurantowner_id, restaurantowner_status, restaurantowner_name, restaurantowner_phone], function(err, rows, fields){
                //console.log(rows);
                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.affectedRows > 0){
                        res.send(JSON.stringify({success: true, message: "Success"}));
                    }  
                }   

            })
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing fbid in body'}));
    }

});

/*===============================================================
FAVORITE TABLE
GET/POST/DELETE
================================================================*/

router.get('/favorite', jwtMW, function(req, res, next){
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const fbid = decoded.fbid;

    if (fbid != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT fbid, foodId, restaurantId, restaurantName, foodName, foodImage, price FROM Favorite WHERE fbid=?', [fbid], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
    }
});

router.get('/favoriteByRestaurant', jwtMW, function(req, res, next){
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const fbid = decoded.fbid;
    const restaurant_id = req.query.restaurantId;
    if (fbid){
        req.getConnection(function(error, conn){
            conn.query('SELECT fbid, foodId, restaurantId, restaurantName, foodName, foodImage, price FROM Favorite WHERE fbid=? AND RestaurantId=?', [fbid, restaurant_id], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
    }
});

router.post('/favorite', jwtMW,function(req, res, next){
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const fbid = decoded.fbid;
    const food_id = req.body.foodId;
    const restaurant_id = req.body.restaurantId;
    const restaurant_name = req.body.restaurantName;
    const food_name = req.body.foodName;
    const food_image = req.body.foodImage;
    const food_price = req.body.price;


    if (fbid){
        req.getConnection(function(error, conn){
            conn.query('INSERT INTO Favorite(FBID, FoodId, RestaurantId, RestaurantName, FoodName, FoodImage, Price) VALUES(?, ?, ?, ?, ?, ?, ?)', [fbid, food_id, restaurant_id, restaurant_name, food_name, food_image, food_price], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.affectedRows > 0){
                        res.send(JSON.stringify({success: true, message: "Success"}));
                    }  
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing fbid in body'}));
    }
});

router.delete('/favorite', jwtMW, function(req, res, next){
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const fbid = decoded.fbid;
    const food_id = req.query.foodId;
    const restaurant_id = req.query.restaurantId;

    if (fbid){
        req.getConnection(function(error, conn){
            conn.query('DELETE FROM Favorite WHERE fbid=? AND FoodId=? AND RestaurantId=?', [fbid, food_id, restaurant_id], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.affectedRows > 0){
                        res.send(JSON.stringify({success: true, message: "Success"}));
                    }
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
    }

});

/*===============================================================
RESTAURANT TABLE
GET
================================================================*/

router.get('/restaurant', jwtMW, function(req, res, next){

    req.getConnection(function(error, conn){
        conn.query('SELECT id, name, address, phone, lat, lng, userOwner, image, paymentUrl FROM Restaurant', function(err, rows, fields){

            if (err){
                res.status(500);
                res.send(JSON.stringify({success: false, message: err.message}));
            }
            else {
                if (rows.length > 0){
                    res.send(JSON.stringify({success: true, result: rows}));
                }
                else{
                    res.send(JSON.stringify({success: false, message: "Empty"}));
                }
            }   

        });
    });
});

router.get('/restaurantById', jwtMW, function(req, res, next){

    var restaurant_id = req.query.restaurantId;
    //console.log(restaurant_id);
    if (restaurant_id != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, address, phone, lat, lng, userOwner, image, paymentUrl FROM Restaurant WHERE id=?', [restaurant_id], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing restaurant id'}));
    }
});

router.get('/nearByRestaurant', jwtMW, function(req, res, next){
 
    if (req.query.lat != undefined && req.query.lng != undefined && req.query.distance != undefined){
        var user_lat = parseFloat(req.query.lat);
        var user_lng = parseFloat(req.query.lng);
        var distance = parseFloat(req.query.distance);
        req.getConnection(function(error, conn){
            conn.query('SELECT * FROM (SELECT id, name, address, phone, lat, lng, userOwner, image, paymentUrl,' 
            + 'ROUND(111.045 * DEGREES(ACOS(COS(RADIANS(?)) * COS(RADIANS(lat))'
            + '* COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?))'
            + '* SIN(RADIANS(lat)))), 2) AS distance_in_km FROM Restaurant) tempTable WHERE distance_in_km < ?', [user_lat, user_lng, user_lat, distance], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: "Missing something"}));
    }
});

/*===============================================================
MENU TABLE
GET
================================================================*/

router.get('/menu', jwtMW, function(req, res, next){

    var restaurant_id = req.query.restaurantId;
    //console.log(restaurant_id);
    if (restaurant_id != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, description, image FROM Menu WHERE id in (SELECT menuId FROM Restaurant_Menu WHERE restaurantId = ?)', [restaurant_id], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing restaurant id'}));
    }
});

/*===============================================================
FOOD TABLE
GET
================================================================*/

router.get('/food', jwtMW,function(req, res, next){

    var menu_id = req.query.menuId;
    //console.log(restaurant_id);
    if (menu_id != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, description, image, price, CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'False\' END as isSize, '
            +'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'False\' END as isAddon, '
            +'discount FROM Food WHERE id in (SELECT foodId FROM Menu_Food WHERE menuId = ?)'
            , [menu_id], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing menuId'}));
    }
});
router.get('/foodById', jwtMW, function(req, res, next){
    var food_id = req.query.foodId;
    //console.log(restaurant_id);
    if (food_id != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, description, image, price, CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'False\' END as isSize, '
            +'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'False\' END as isAddon, '
            +'discount FROM Food WHERE id = ?'
            , [food_id], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing foodId'}));
    }
});
router.get('/searchFood', jwtMW, function(req, res, next){
    var search_query = '%' + req.query.foodName + '%';
    //console.log(restaurant_id);
    if (search_query != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, description, image, price, CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'False\' END as isSize, '
            +'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'False\' END as isAddon, '
            +'discount FROM Food WHERE name LIKE ?'
            , [search_query], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing search_query'}));
    }
});

/*===============================================================
SIZE TABLE
GET
================================================================*/

router.get('/size', jwtMW, function(req, res, next){
    var food_id = req.query.foodId;
    //console.log(restaurant_id);
    if (food_id != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, description, extraPrice FROM Size WHERE id in (SELECT sizeId FROM Food_Size WHERE foodId = ?)', [food_id]
            , function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing foodId'}));
    }
});

/*===============================================================
ADDON TABLE
GET
================================================================*/

router.get('/addon',jwtMW, function(req, res, next){
    var food_id = req.query.foodId;
    //console.log(restaurant_id);
    if (food_id != undefined){
        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, description, extraPrice FROM Addon WHERE id in (SELECT addonId FROM Food_Addon WHERE foodId = ?)', [food_id]
            , function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing foodId'}));
    }
});

/*===============================================================
ORDER TABLE
GET / POST
================================================================*/

router.get('/orderbyrestaurant', jwtMW, function(req, res, next){

    const restaurant_id = req.query.restaurantId;
    var startIndex = parseInt(req.query.from);
    var endIndex = parseInt(req.query.to);

    // set defaut if user not pass params
    if (isNaN(startIndex)) startIndex = 0;
    if (isNaN(endIndex)) endIndex = 10;

    //console.log(restaurant_id);
    if (restaurant_id){
        req.getConnection(function(error, conn){
            conn.query('SELECT OrderId, OrderFBID, OrderPhone, OrderName, OrderAddress, OrderStatus, OrderDate,'
            + 'RestaurantId, TransactionId, '
            + 'CASE WHEN COD = 1 THEN \'TRUE\' ELSE \'FALSE\' END as COD,'
            + 'TotalPrice, NumOfItem FROM `order` WHERE restaurantId = ? AND NumOfitem > 0'
            + ' ORDER BY OrderId DESC LIMIT ?, ?'
            , [restaurant_id, startIndex, endIndex]
            , function(err, rows, fields){
                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
						
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing restaurant_id'}));
    }
});

router.get('/maxorderbyrestaurant', jwtMW, function(req, res, next){
    
    const restaurantId = req.query.restaurantId;

    //console.log(restaurant_id);
    if (restaurantId){
        req.getConnection(function(error, conn){
            conn.query('SELECT COUNT(orderId) as maxRowNum FROM `order` WHERE restaurantId = ? AND NumOfitem > 0'
            + ' ORDER BY OrderId DESC'
            , [restaurantId]
            , function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing restaurantId'}));
    }
});

router.get('/order', jwtMW, function(req, res, next){
    var order_fbid = req.query.orderFBID;
    var startIndex = parseInt(req.query.from);
    var endIndex = parseInt(req.query.to);
    //console.log(restaurant_id);
    if (order_fbid){
        req.getConnection(function(error, conn){
            conn.query('SELECT OrderId, OrderFBID, OrderPhone, OrderName, OrderAddress, OrderStatus, OrderDate,'
            + 'RestaurantId, TransactionId, '
            + 'CASE WHEN COD = 1 THEN \'TRUE\' ELSE \'FALSE\' END as COD,'
            + 'TotalPrice, NumOfItem FROM `order` WHERE OrderFBID = ? AND NumOfitem > 0'
            + ' ORDER BY OrderId DESC LIMIT ?, ?'
            , [order_fbid, startIndex, endIndex]
            , function(err, rows, fields){
                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
						
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing order_fbid'}));
    }
});

router.get('/maxOrder', jwtMW, function(req, res, next){
    var order_fbid = req.query.orderFBID;

    //console.log(restaurant_id);
    if (order_fbid){
        req.getConnection(function(error, conn){
            conn.query('SELECT COUNT(orderId) as maxRowNum FROM `order` WHERE OrderFBID = ? AND NumOfitem > 0'
            + ' ORDER BY OrderId DESC'
            , [order_fbid]
            , function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing order_fbid'}));
    }
});

router.post('/createOrder', jwtMW, function(req, res, next){

	const authorization = req.headers.authorization; let decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    const order_fbid = decoded.fbid;

    const order_phone = req.body.orderPhone;
    const order_name = req.body.orderName;
    const order_address = req.body.orderAddress;
    const order_date = moment(req.body.orderDate, "MM/DD/YYYY").format("YYYY-MM-DD");
    const restaurant_id = req.body.restaurantId;
    const transaction_id = req.body.transactionId;
    const cod = (req.body.cod == "true");
    const total_price = req.body.totalPrice;
    const num_of_item = req.body.numOfItem;



    if (order_fbid){
        req.getConnection(function(error, conn){
            conn.query('INSERT INTO `order`(OrderFBID, OrderPhone, OrderName, OrderAddress, OrderStatus, OrderDate, RestaurantId' 
            + ',TransactionId, COD, TotalPrice, NumOfItem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            , [order_fbid, order_phone, order_name, order_address, 0, order_date, restaurant_id, transaction_id, cod, total_price, num_of_item], function(err, rows, fields){

                if (err){
					console.log(err);
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    conn.query('SELECT OrderId as orderNumber FROM `order` WHERE OrderFBID = ? AND NumOfItem > 0' 
                    + ' ORDER BY orderNumber DESC LIMIT 1', [order_fbid], function(err, rows, fields){
                        if (err){
                            res.status(500);
                            res.send(JSON.stringify({success: false, message: err.message}));
                        }
                        else{
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                    });

                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing orderFBID in body'}));
    }
});

/*===============================================================
ORDERDETAIL TABLE
GET / POST
================================================================*/

router.get('/orderdetailbyrestaurant', jwtMW, function(req, res, next){
    var order_id = req.query.orderId;
    //console.log(restaurant_id);
    if (order_id){
        req.getConnection(function(error, conn){
            conn.query('SELECT OrderDetail.orderId, itemId, quantity, size, addOn, orderFBID, name, description, image FROM OrderDetail'
            + ' INNER JOIN `Order` ON OrderDetail.orderId = `Order`.orderId'
            + ' INNER JOIN Food ON OrderDetail.itemId = Food.ID'
            + ' WHERE OrderDetail.orderId=?'
            , [order_id]
            , function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing orderId'}));
    }
});

router.get('/orderDetail', jwtMW, function(req, res, next){
    var order_id = req.query.orderId;
    //console.log(restaurant_id);
    if (order_id){
        req.getConnection(function(error, conn){
            conn.query('SELECT OrderId, itemId, quantity, discount, extraPrice, size, addOn FROM OrderDetail WHERE orderId=?'
            , [order_id]
            , function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing orderId'}));
    }
});

router.post('/updateOrder', jwtMW, function(req, res, next){

    var order_id = req.body.orderId;
    var order_detail;

    try {
        order_detail = JSON.parse(req.body.orderDetail);
    }
    catch (err){
        res.status(500);
        res.send(JSON.stringify({success: false, message: err.message}));
    }



    if (order_id && order_detail){

        var data_insert = [];
        for (var i = 0; i < order_detail.length; ++i){
            data_insert[i] = [
                parseInt(order_id),
                order_detail[i]["foodId"],
                order_detail[i]["foodQuantity"],
                order_detail[i]["foodPrice"],
                0, // discount
                order_detail[i]["foodSize"],
                order_detail[i]["foodAddon"],
                parseFloat(order_detail[i]["foodExtraPrice"])
            ]
        }
        //console.log(data_insert[0][6]);
        req.getConnection(function(error, conn){
            conn.query('INSERT INTO OrderDetail(OrderId, ItemId, Quantity, Price, Discount, Size, Addon, ExtraPrice) VALUE (?) '
            , data_insert, function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    res.send(JSON.stringify({success: true, message: "update success"}));
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing something in body'}));
    }

});

/*===============================================================
TOKEN TABLE
GET / POST
================================================================*/
router.get('/token', jwtMW, function(req, res, next){
    
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    var fbid = decoded.fbid;
	
    if (fbid){
        req.getConnection(function(error, conn){
            conn.query('SELECT fbid, token FROM Token WHERE fbid=?', [fbid], function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            })
        })
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
    }

});

router.post('/token', jwtMW, function(req, res, next){
    
    var authorization = req.headers.authorization, decoded;
    try{
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch(err){
        return res.status(401).send('unauthorized');
    }

    var fbid = decoded.fbid;
    //console.log(req.body);
    var user_token = req.body.token;
    //console.log(user_token);

    if (fbid != undefined){
        req.getConnection(function(error, conn){
            var sql = "INSERT INTO Token(FBID, Token) VALUES ('" + fbid + "', '" + user_token +"') ON DUPLICATE KEY UPDATE Token='" + user_token + "'";
            //console.log(sql);
            conn.query(sql, function(err, rows, fields){
                
                if (err){
                    res.status(500).send(JSON.stringify({success: false, message: err.message}));
                    
                }
                else {
                    if (rows.affectedRows > 0){
                        res.send(JSON.stringify({success: true, message: "Success"}));
                    }  
                }   

            })
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Missing fbid in body'}));
    }

});

module.exports = router;
