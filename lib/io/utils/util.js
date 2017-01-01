exports.getItemIndexByProps = getItemIndexByProps;
function getItemIndexByProps(arr, props)
{
    for(var i = 0; i < arr.length; i ++){
        var item = arr[i];
        var is_same = true;
        for(var name in props)
        {
            if(item[name] != props[name])
            {
                is_same = false;
                break;
            }
        }
        if(is_same)
        {
            return i;
        }
    }
    return -1;
}

exports.thisBindThis = thisBindThis;
function thisBindThis(that, list)
{
    var len = list.length;
    for(var i = 0; i < len; i ++)
    {
        var name = list[i];
        that[name] = that[name].bind(that);
    }
}