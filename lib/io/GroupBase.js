var _ = require("lodash");
class Group
{
    constructor(config)
    {
        this.config = config;
        this.members = [];
    }
    addMember(member, params, params_args, alias)
    {
        this.members.push({member:member, params:params, params_args:params_args, alias:alias});
    }
    addMembers(items)
    {
        for(var i = 0; i < items.length; i ++)
        {
            var item = items[i];
            if(_.isFunction(item))
            {
                this.addMember(item);
            }
            else if(_.isArray(item))
            {
                this.addMember.apply(this, item);
            }
            else if(_.isObject(item)){
                this.members.push(item);
            }
            else {
                throw new Error("还没设置启用的类型");
            }
        }
    }
    run (jump_to) {
        throw new Error("接口方法没实现");
    }
    getMemberArgs(item)
    {

        // var item = this.members[num];
        var args;
        if(_.isFunction(item.params))
        {
            if(item.params_args)
            {
                args = item.params.apply(null, item.params_args);
            }
            else{
                args = item.params();
            }
        }
        else if(_.isArray(item.params))
        {
            args = item.params;
        }
        else{
            args = [];
        }
        return args;
    }
    gotoComplete()
    {
        console.log('goto complete');
        this.config.onComplete();
    }
}

module.exports = Group;