var _ = require("lodash");
var class_util = require('./utils/util');
var GroupBase = require('./GroupBase');
class QueueGroup extends GroupBase{
    constructor(config)
    {
        super(config);
        this.index = 0;
        class_util.thisBindThis(this, ['runMemeber', 'gotoIndex', 'gotoAlias', 'gotoComplete']);
    }

    gotoIndex (index)
    {
        if(_.isNumber(index))
        {
            if(index <= this.members.length)
            {
                this.index = index;
                this.runMemeber();
            }
            else{
                console.error('QueueGroup error goto greater then members length ', index, this.members.length, this.name);
            }
        }
        else{
            console.error('QueueGroup error goto_index not a number ', index, this.members.length, this.name);
        }
    }

    gotoAlias (alias)
    {
        var index = array_util.getItemIndexByProps(this.members, {alias:alias});
        if(index > -1)
        {
            this.index = index;
            this.runMemeber();
        }
        else{
            console.error('QueueGroup error goto_alias ', alias, this.name);
        }
    }
    run ()
    {
        this.runMemeber(this);
    }
    runMemeber ()
    {
        if(this.index >= this.members.length)
        {
            this.gotoComplete();
        }
        else{
            var num = this.index;
            this.index ++;
            var item = this.members[num];
            var args;
            args = this.getMemberArgs(item);
            var conf = this.config;
            args.unshift(this.runMemeber, conf.onError, conf.vo, this.gotoIndex, this.gotoAlias, this.gotoComplete);
            item.member.apply(null, args);
        }
    }
}

module.exports = QueueGroup;