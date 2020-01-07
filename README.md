# EasyAPI JSON编辑器

## 组件命名

easyapi-json-editor

## 组件描述

EasyAPI JSON编辑器组件，参考市面上标准的JSON编辑器风格，另外还包括数据类型（字段类型），数据注释（字段描述），示例值。

当JSON数据传入（覆盖性传入），保持原来填写的注释与类型内容，在原来基础上继续完善，例如有新增的字段。

## 组件效果图
![image](https://qiniu.easyapi.com/easyapi-json-editor.png)

> 本组件重点是可以在编辑器上面直接设置数据注释（字段描述）和数据类型（字段类型）

## 数据格式

传入数据格式与输出数据格式一致

> JSON示例如下：
```json
{
  "name": "blog",
  "type": "object",      
  "description": "博客",
  "sample": "",
  "sequence": 1,
  "childs":[
    {
      "name": "title",
      "type": "string",
      "description": "标题",
      "sample": "我和我的祖国",
      "sequence": 1
    }
  ]
}
```

## 方法说明

*1、getJSONEditorData 获取JSON编辑器数据*

*2、importJSON 导入标准JSON数据*
> 使用JSON的Value作为示例值，并自动处理数据类型

*3、exportJSON 导出标准JSON数据*
> 使用示例值作为JSON的Value

## 更多

*数据类型（字段类型）*
> string, number, boolean, integer, float, double, object, array