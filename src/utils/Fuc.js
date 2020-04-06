//获取对象中的某个属性，如果不存在该属性则返回默认值
const getValue=(obj,key,defaultValue=null)=>{
    return Object.prototype.hasOwnProperty.call(obj, key)?obj[key]:defaultValue;
}

export {
    getValue
}