var Group = require('io-group').QueueGroup;
var ConcurrentGroup = require('io-group').ConcurrentGroup;
exports.testRun = testRun;
function testRun(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new ConcurrentGroup({onComplete:onComplete, onError:onError, name:"concurrent_group.testRun", vo:vo});
    group.addMembers([connectDB, getVisitorInfo, redisTodo]);
    group.run();
    function  connectDB(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('connectDB');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function getVisitorInfo(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('getVisitorInfo');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function redisTodo(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('redisTodo');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function onError(error)
    {
        console.log('group test testRun error', error);
        console.trace('path is');
    }
    function onComplete()
    {
        console.log('group test testRun complete');
    }
}


function testRunWithQueueGroup(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new ConcurrentGroup({onComplete:onComplete, onError:onError, name:"concurrent_group.testRun", vo:vo});
    group.addMembers([connectDB, getVisitorInfo, runQueueGroup, redisTodo]);
    group.run();
    function  connectDB(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('connectDB');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function getVisitorInfo(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('getVisitorInfo');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function redisTodo(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('redisTodo');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function onError(error)
    {
        console.log('group test testRun error', error);
        console.trace('path is');
    }
    function onComplete()
    {
        console.log('group test testRun complete');
    }

    function runQueueGroup(callback, onError, vo, gotoComplete)
    {
        testRun();
        function testRun(req)
        {
            req = req || {session:{id:'xx'}};
            var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
            var group = new QueueGroup({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
            group.addMembers([connectDB, getVisitorInfo, redisTodo]);
            group.run();
            function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
            {
                process.nextTick(function()
                {
                    console.log("step is connectDB");
                    callback();
                });
            }
            function getVisitorInfo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
            {
                process.nextTick(function(){
                    console.log("step is getVisitorInfo");
                    callback();
                });
            }
            function redisTodo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
            {
                process.nextTick(function()
                {
                    console.log("step is redisTodo");
                    callback();
                });
            }

            function onComplete()
            {
                console.log('group test testRun complete');
                callback();
            }

        }
    }
}


exports.testGotoError = testGotoError;
function testGotoError(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new ConcurrentGroup({onComplete:onComplete, onError:onError, name:"concurrent_group.testRun", vo:vo});
    group.addMembers([connectDB, getVisitorInfo, redisTodo]);
    group.run();
    function  connectDB(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('connectDB');
            onError({error:2001});
        }, parseInt(Math.random() * 1000) + 100);
    }
    function getVisitorInfo(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('getVisitorInfo');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function redisTodo(callback, onError, vo, gotoComplete)
    {
        setTimeout(function () {
            console.log('redisTodo');
            callback();
        }, parseInt(Math.random() * 1000) + 100);
    }
    function onError(error)
    {
        console.log('group test testRun error', error);
        console.trace('stack is');
    }
    function onComplete()
    {
        console.log('group test testRun complete');
    }
}


test();
function test()
{
    // testRun();
    // testGotoError();
    // testRunWithQueueGroup();
}