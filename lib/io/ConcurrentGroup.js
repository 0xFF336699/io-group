var class_util = require('./utils/util');
var GroupBase = require('./GroupBase');
class ConcurrentGroup extends GroupBase
{
    constructor(config)
    {
        super(config);
        this.waiting_length = 0;
        class_util.thisBindThis(this, ['oneBack', 'gotoComplete']);
    }
    run()
    {
        var len = this.waiting_length = this.members.length;
        console.log('len', len);
        for(var i = 0; i < len; i ++)
        {
            this.runMember(this.members[i]);
        }
    }

    oneBack()
    {
        this.checkComplete();
    }
    checkComplete()
    {
        this.waiting_length -- ;
        if(this.waiting_length <= 0)
        {
            this.gotoComplete();
        }
    }

    runMember (item)
    {
        var args;
        args = this.getMemberArgs(item);
        var conf = this.config;
        args.unshift(this.oneBack, conf.onError, conf.vo, this.gotoComplete);
        item.member.apply(null, args);
    }
}

module.exports = ConcurrentGroup;