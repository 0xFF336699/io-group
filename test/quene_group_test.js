// 队列例子
var Group = require('io-group').QueueGroup;
var ConcurrentGroup = require('io-group').ConcurrentGroup;
exports.testRun = testRun;
/**
 *  队列测试
 *  生成3个异步方法模拟，它们会被依次调用，如果出现错误会跳出，没有错误就会完成后调用complete
 * @param req
 */
function testRun(req)
{
    req = req || {session:{id:'xx'}};
    // 模拟注入到被调用方法里的共享model
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    // 添加一组简单的成员
    group.addMembers([connectDB, getVisitorInfo, redisTodo]);
    // 执行
    group.run();
    /**
     *  这几个被注入的参数是固定的
     * @param callback 当方法按预期执行完毕后调用这个callback，callback是group里的方法。
     * @param onError 当方法出现错误时调用这个，它会导致队列退出，处理权交给group的创建和调用者
     * @param vo 注入的数据
     * @param gotoIndex 根据情况不同 可以直接跳转到队列中指定的位置
     * @param gotoAlias 根据情况不同 可以直接跳转到队列中指定别名的位置
     * @param gotoComplete 直接通知group已经完成，需要退出队列（非error）。
     */
    function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function()
        {
            // vo.db = "client";
            console.log("step is connectDB");
            callback();
        });
    }
    function getVisitorInfo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function(){
            // vo.visitor = {};
            console.log("step is getVisitorInfo");
            callback();
        });
    }
    function redisTodo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        // redis.select(vo.redis_index);
        process.nextTick(function()
        {
            // vo.first_time = "2016/12/27";
            console.log("step is redisTodo");
            callback();
        });
    }
    // 当队列发生错误时被调用，按设计预期需要注入error。
    function onError(error)
    {
        console.log('group test testRun error', error);
    }
    // 当队列按预期完成任务时调用。
    function onComplete()
    {
        console.log('group test testRun complete');
    }

}

exports.testGotoIndex = testGotoIndex;
/**
 *  模拟直接跳转到指定步骤
 */
function testGotoIndex(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    group.addMembers([connectDB, getVisitorInfo, redisTodo]);
    group.run();
    function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function()
        {
            console.log("step is connectDB");
            // 当前是索引0，直接跳到2，不执行1了。
            gotoIndex(2);
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

    function onError(error)
    {
        console.log('group test testRun error', error);
    }
    function onComplete()
    {
        console.log('group test testRun complete');
    }
}

exports.testGotoAlias = testGotoAlias;
/**
 *  跳转到别名位置
 * @param req
 */
function testGotoAlias(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    // redisTodo的字符串为别名。有时候要执行的队列长度不稳定，或增加或减少，
    // 这时候用别名可以防止队列长度变化导致数字索引失效出现问题，只要别名的成员还被调用就行。
    group.addMembers([connectDB, getVisitorInfo, [redisTodo, undefined, undefined, 'redisTodo']]);
    group.run();
    function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function()
        {
            console.log("step is connectDB");
            // 直接跳到别名指定位置。
            gotoAlias('redisTodo');
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

    function onError(error)
    {
        console.log('group test testRun error', error);
    }
    function onComplete()
    {
        console.log('group test testRun complete');
    }
}
exports.testOnError = testOnError;
/**
 * 模拟错误发生
 * @param req
 */
function testOnError(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    group.addMembers([connectDB, getVisitorInfo, [redisTodo, undefined, undefined, 'redisTodo']]);
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
            // 出现错误，会跳出队列，任务失败。
            onError({error:2001});
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

    function onError(error)
    {
        console.error('group test testRun error', error);
    }
    function onComplete()
    {
        console.log('group test testRun complete');
    }
}


exports.testGetParamsWithArray = testGetParamsWithArray;
/**
 * 队列中被调用的成员（函数）带有参数。
 * @param req
 */
function testGetParamsWithArray(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    // ['word', 3]是redisTodo方法额外参数
    group.addMembers([connectDB, [redisTodo, ['word', 3]]]);
    group.run();
    function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function()
        {
            console.log("step is connectDB");
            callback();
        });
    }

    /**
     * 额外的参数
     * @param message
     * @param index
     */
    function redisTodo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete, message, index)
    {
        console.log('params', message, index);
        process.nextTick(function()
        {
            console.log("step is redisTodo");
            callback();
        });
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
exports.testGetParamsWithFunction = testGetParamsWithFunction;
/**
 * 队列中执行某个方法时，它的参数可能是动态获取的，
 * 例如是依据上一步提取的某个数据计算出来的，初始化时是不能设置的，
 * 所以这个是动态返回参数的。
 * @param req
 */
function testGetParamsWithFunction(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    // redisTodo方法执行时会动态获取所需数据
    group.addMembers([connectDB, [redisTodo,function(){return [{"info":"哈喽 word"}, 5]}]]);
    group.run();
    function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function()
        {
            console.log("step is connectDB");
            callback();
        });
    }

    /**
     * 这些数据是动态生成的
     * @param info
     * @param index
     */
    function redisTodo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete, info, index)
    {
        console.log('info', info, index);
        process.nextTick(function()
        {
            console.log("step is redisTodo");
            callback();
        });
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


exports.testGetParamsWithFunctionArgs = testGetParamsWithFunctionArgs;
/**
 * 为动态数据生成再注入参数。这种有点奇葩了，不过装装逼先写上吧，万一哪天真用到了呢，反正实际执行就一个判断，几行代码也不累手指头。
 * @param req
 */
function testGetParamsWithFunctionArgs(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    // ["here", 6]是为动态获取参数的方法再注入的数据
    group.addMembers([connectDB, [redisTodo,function(info, index){return [{"info":info}, index]}, ["here", 6]]]);
    group.run();
    function  connectDB(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        process.nextTick(function()
        {
            console.log("step is connectDB");
            callback();
        });
    }
    function redisTodo(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete, info, index)
    {
        console.log('info', info, index);
        process.nextTick(function()
        {
            console.log("step is redisTodo");
            callback();
        });
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
exports.testRunWidthConcurrentGroup = testRunWidthConcurrentGroup;
/**
 * 这个特么开始有些牛逼了 今天刚弄的方法 热乎的。
 * 有的时候队列中某阶段的一些异步请求不需要依赖和等待其它成员，这时候可以一次性并发出去，也无所谓返回顺序。
 * 这里演示的是[步骤1，步骤2，[并发，并发，并发]，步骤4]
 * @param req
 */
function testRunWidthConcurrentGroup(req)
{
    req = req || {session:{id:'xx'}};
    var vo = {"db_name":"db_name", "redis_index":"redis_index", "form":"form", "session":req.session, result:{}};
    var group = new Group({onComplete:onComplete, onError:onError, name:"group_test.testRun", vo:vo});
    // runConcurrentGroup是执行一坨无依赖的方法 可以并发。
    group.addMembers([connectDB, getVisitorInfo, runConcurrentGroup, redisTodo]);
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
    function runConcurrentGroup(callback, onError, vo, gotoIndex, gotoAlias, gotoComplete)
    {
        testRun();
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
            function onComplete()
            {
                console.log('group test testRun complete');
                callback();
            }
        }
    }


    function onError(error)
    {
        console.log('group test testRun error', error);
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
    // testGotoIndex();
    // testGotoAlias();
    testOnError();
    // testGetParamsWithArray();
    // testGetParamsWithFunction();
    // testGetParamsWithFunctionArgs();
    // testRunWidthConcurrentGroup();

}
